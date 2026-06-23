import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "edutech_jwt_super_secret_key";

// Simple in-memory user fallback database to handle signup/login during offline mode
const inMemoryUsers: any[] = [
  {
    id: "user-student-demo",
    email: "student@edutech.com",
    mobileNumber: "9876543210",
    passwordHash: bcrypt.hashSync("password123", 10),
    role: "student",
    profile: {
      fullName: "Aniket Sharma",
      gender: "Male",
      state: "Telangana",
      district: "Hyderabad",
      category: "OC",
      intermediateStream: "MPC",
      marks: 92.5,
      rank: 4500,
      interests: ["Programming", "Robotics"],
      careerGoals: ["Software Engineer"],
    },
  },
  {
    id: "user-admin-demo",
    email: "admin@edutech.com",
    mobileNumber: "9999999999",
    passwordHash: bcrypt.hashSync("admin123", 10),
    role: "admin",
    profile: {
      fullName: "Admin Controller",
      gender: "Female",
      state: "Telangana",
      district: "Hyderabad",
      category: "OC",
      intermediateStream: "MPC",
      marks: 98.0,
      rank: 120,
      interests: [],
      careerGoals: [],
    },
  },
];

// Mock storage for SMS OTPs: mobileNumber -> OTP
const activeOtps: Record<string, string> = {};

// Helper to generate User details
const getSessionPayload = (user: any) => {
  return {
    id: user.id,
    email: user.email,
    mobileNumber: user.mobileNumber,
    role: user.role,
    profile: user.profile,
  };
};

// 1. SIGNUP
router.post("/signup", async (req: Request, res: Response) => {
  const { email, mobileNumber, password, fullName, gender, state, district, category, intermediateStream } = req.body;

  if (!password || (!email && !mobileNumber)) {
    return res.status(400).json({ error: "Password and either Email or Mobile Number are required." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser: any = {
    id: `user-${Date.now()}`,
    email: email || null,
    mobileNumber: mobileNumber || null,
    passwordHash,
    role: "student",
    profile: {
      fullName: fullName || "New Student",
      gender: gender || "Other",
      state: state || "Telangana",
      district: district || "",
      category: category || "OC",
      intermediateStream: intermediateStream || "MPC",
      marks: null,
      rank: null,
      interests: [],
      careerGoals: [],
    },
  };

  try {
    // Try Prisma DB first
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          mobileNumber ? { mobileNumber } : {},
        ].filter((o) => Object.keys(o).length > 0) as any,
      },
    });

    if (existing) {
      return res.status(400).json({ error: "User already exists with this email or mobile number." });
    }

    const created = await prisma.user.create({
      data: {
        email: newUser.email,
        mobileNumber: newUser.mobileNumber,
        passwordHash: newUser.passwordHash,
        role: newUser.role,
        profile: {
          create: {
            fullName: newUser.profile.fullName,
            gender: newUser.profile.gender,
            state: newUser.profile.state,
            district: newUser.profile.district,
            category: newUser.profile.category,
            intermediateStream: newUser.profile.intermediateStream,
            interests: [],
            careerGoals: [],
          },
        },
      },
      include: { profile: true },
    });

    const token = jwt.sign(getSessionPayload(created), JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: getSessionPayload(created) });
  } catch (err) {
    // DB offline fallback
    const existingMem = inMemoryUsers.find(
      (u) => (email && u.email === email) || (mobileNumber && u.mobileNumber === mobileNumber)
    );
    if (existingMem) {
      return res.status(400).json({ error: "User already exists with this email or mobile number." });
    }

    inMemoryUsers.push(newUser);
    const token = jwt.sign(getSessionPayload(newUser), JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: getSessionPayload(newUser) });
  }
});

// 2. PASSWORD LOGIN
router.post("/login", async (req: Request, res: Response) => {
  const { identifier, password } = req.body; // identifier can be email or mobile

  if (!identifier || !password) {
    return res.status(400).json({ error: "Identifier and password required." });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { mobileNumber: identifier }],
      },
      include: { profile: true },
    });

    if (!user || !user.passwordHash) {
      throw new Error("Fallback required");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const token = jwt.sign(getSessionPayload(user), JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: getSessionPayload(user) });
  } catch (err) {
    // DB offline fallback
    const userMem = inMemoryUsers.find((u) => u.email === identifier || u.mobileNumber === identifier);
    if (!userMem) {
      return res.status(401).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, userMem.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const token = jwt.sign(getSessionPayload(userMem), JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: getSessionPayload(userMem) });
  }
});

// 3. SEND OTP (MOCK)
router.post("/send-otp", (req: Request, res: Response) => {
  const { mobileNumber } = req.body;
  if (!mobileNumber) {
    return res.status(400).json({ error: "Mobile number is required." });
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  activeOtps[mobileNumber] = otp;

  console.log(`[SMS OTP SERVICE] Sent OTP ${otp} to ${mobileNumber}`);
  return res.json({ message: "OTP sent successfully (Mocked).", mockOtp: otp }); // Send back mockOtp for easy frontend testing
});

// 4. VERIFY OTP LOGIN (MOCK)
router.post("/verify-otp", async (req: Request, res: Response) => {
  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp) {
    return res.status(400).json({ error: "Mobile number and OTP are required." });
  }

  if (activeOtps[mobileNumber] !== otp && otp !== "123456") {
    // Allow 123456 as master test OTP
    return res.status(401).json({ error: "Invalid OTP code." });
  }

  // Clear OTP
  delete activeOtps[mobileNumber];

  try {
    let user = await prisma.user.findUnique({
      where: { mobileNumber },
      include: { profile: true },
    });

    if (!user) {
      // Create user automatically
      user = await prisma.user.create({
        data: {
          mobileNumber,
          role: "student",
          profile: {
            create: {
              fullName: `Student ${mobileNumber.slice(-4)}`,
              gender: "Other",
              state: "Telangana",
              district: "",
              category: "OC",
              intermediateStream: "MPC",
              interests: [],
              careerGoals: [],
            },
          },
        },
        include: { profile: true },
      });
    }

    const token = jwt.sign(getSessionPayload(user), JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: getSessionPayload(user) });
  } catch (err) {
    // DB offline fallback
    let userMem = inMemoryUsers.find((u) => u.mobileNumber === mobileNumber);
    if (!userMem) {
      userMem = {
        id: `user-${Date.now()}`,
        mobileNumber,
        role: "student",
        profile: {
          fullName: `Student ${mobileNumber.slice(-4)}`,
          gender: "Other",
          state: "Telangana",
          district: "",
          category: "OC",
          intermediateStream: "MPC",
          interests: [],
          careerGoals: [],
        },
      };
      inMemoryUsers.push(userMem);
    }

    const token = jwt.sign(getSessionPayload(userMem), JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: getSessionPayload(userMem) });
  }
});

// 5. GOOGLE LOGIN (MOCK EXCHANGE)
router.post("/google-login", async (req: Request, res: Response) => {
  const { email, name, googleId } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Google authentication payload incomplete." });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          role: "student",
          profile: {
            create: {
              fullName: name,
              gender: "Other",
              state: "Telangana",
              district: "",
              category: "OC",
              intermediateStream: "MPC",
              interests: [],
              careerGoals: [],
            },
          },
        },
        include: { profile: true },
      });
    }

    const token = jwt.sign(getSessionPayload(user), JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: getSessionPayload(user) });
  } catch (err) {
    // DB offline fallback
    let userMem = inMemoryUsers.find((u) => u.email === email);
    if (!userMem) {
      userMem = {
        id: `user-${Date.now()}`,
        email,
        role: "student",
        profile: {
          fullName: name,
          gender: "Other",
          state: "Telangana",
          district: "",
          category: "OC",
          intermediateStream: "MPC",
          interests: [],
          careerGoals: [],
        },
      };
      inMemoryUsers.push(userMem);
    }

    const token = jwt.sign(getSessionPayload(userMem), JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: getSessionPayload(userMem) });
  }
});

// 6. UPDATE PROFILE
router.post("/profile", async (req: Request, res: Response) => {
  const { token, fullName, gender, state, district, category, intermediateStream, marks, rank, interests, careerGoals } = req.body;
  if (!token) {
    return res.status(401).json({ error: "Access denied. Auth token required." });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    try {
      const updated = await prisma.profile.update({
        where: { userId: decoded.id },
        data: {
          fullName,
          gender,
          state,
          district,
          category,
          intermediateStream,
          marks: marks ? parseFloat(marks) : undefined,
          rank: rank ? parseInt(rank) : undefined,
          interests,
          careerGoals,
        },
        include: { user: true },
      });

      const userSession = {
        id: updated.userId,
        email: updated.user.email,
        mobileNumber: updated.user.mobileNumber,
        role: updated.user.role,
        profile: updated,
      };

      const newToken = jwt.sign(userSession, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token: newToken, user: userSession });
    } catch {
      // DB Offline fallback
      const userMem = inMemoryUsers.find((u) => u.id === decoded.id);
      if (!userMem) return res.status(404).json({ error: "Profile not found." });

      userMem.profile = {
        fullName: fullName || userMem.profile.fullName,
        gender: gender || userMem.profile.gender,
        state: state || userMem.profile.state,
        district: district || userMem.profile.district,
        category: category || userMem.profile.category,
        intermediateStream: intermediateStream || userMem.profile.intermediateStream,
        marks: marks ? parseFloat(marks) : userMem.profile.marks,
        rank: rank ? parseInt(rank) : userMem.profile.rank,
        interests: interests || userMem.profile.interests,
        careerGoals: careerGoals || userMem.profile.careerGoals,
      };

      const newToken = jwt.sign(getSessionPayload(userMem), JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token: newToken, user: getSessionPayload(userMem) });
    }
  } catch (err) {
    return res.status(403).json({ error: "Invalid token session." });
  }
});

export default router;
