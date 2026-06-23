import { Router, Request, Response } from "express";
import { getAllCourses, getAllCareers, getAllExams, getAllColleges, getAllScholarships } from "../db";

const router = Router();

// 1. GLOBAL SEARCH
router.get("/search", async (req: Request, res: Response) => {
  const query = (req.query.q as string || "").toLowerCase().trim();

  if (!query) {
    return res.json({ colleges: [], courses: [], careers: [], exams: [] });
  }

  const [courses, careers, exams, colleges] = await Promise.all([
    getAllCourses(),
    getAllCareers(),
    getAllExams(),
    getAllColleges(),
  ]);

  const matchedCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.overview.toLowerCase().includes(query) ||
      c.stream.toLowerCase().includes(query)
  );

  const matchedCareers = careers.filter(
    (c) =>
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.requiredSkills.some((s: string) => s.toLowerCase().includes(query))
  );

  const matchedExams = exams.filter(
    (e) =>
      e.name.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query)
  );

  const matchedColleges = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.location.toLowerCase().includes(query) ||
      c.state.toLowerCase().includes(query) ||
      c.accreditation.toLowerCase().includes(query)
  );

  return res.json({
    courses: matchedCourses.slice(0, 5),
    careers: matchedCareers.slice(0, 5),
    exams: matchedExams.slice(0, 5),
    colleges: matchedColleges.slice(0, 5),
  });
});

// 2. COURSES
router.get("/courses", async (req: Request, res: Response) => {
  const { stream } = req.query;
  let data = await getAllCourses();

  if (stream) {
    data = data.filter((c) => c.stream.toLowerCase() === (stream as string).toLowerCase());
  }

  return res.json(data);
});

router.get("/courses/:name", async (req: Request, res: Response) => {
  const courses = await getAllCourses();
  const course = courses.find((c) => c.name.toLowerCase() === req.params.name.toLowerCase());
  
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  return res.json(course);
});

// 3. CAREERS
router.get("/careers", async (req: Request, res: Response) => {
  const data = await getAllCareers();
  return res.json(data);
});

router.get("/careers/:title", async (req: Request, res: Response) => {
  const careers = await getAllCareers();
  const career = careers.find((c) => c.title.toLowerCase() === req.params.title.toLowerCase());

  if (!career) {
    return res.status(404).json({ error: "Career roadmap not found" });
  }
  return res.json(career);
});

// 4. EXAMS
router.get("/exams", async (req: Request, res: Response) => {
  const data = await getAllExams();
  return res.json(data);
});

router.get("/exams/:name", async (req: Request, res: Response) => {
  const exams = await getAllExams();
  const exam = exams.find((e) => e.name.toLowerCase() === req.params.name.toLowerCase());

  if (!exam) {
    return res.status(404).json({ error: "Exam details not found" });
  }
  return res.json(exam);
});

// 5. COLLEGES (WITH DYNAMIC SIDEBAR FILTERS)
router.get("/colleges", async (req: Request, res: Response) => {
  const { state, district, course, feesLimit, minRating, nirfLimit, placementPct } = req.query;
  let data = await getAllColleges();

  if (state) {
    data = data.filter((col) => col.state.toLowerCase() === (state as string).toLowerCase());
  }
  if (district) {
    data = data.filter((col) => col.district.toLowerCase() === (district as string).toLowerCase());
  }
  if (course) {
    data = data.filter((col) =>
      col.collegeCourses.some((cc: any) => cc.course.name.toLowerCase().includes((course as string).toLowerCase()))
    );
  }
  if (feesLimit) {
    const limit = parseInt(feesLimit as string);
    // Parse fee string like ₹80,000 to compare
    data = data.filter((col) => {
      const match = col.feesRange.match(/[\d,]+/);
      if (match) {
        const val = parseInt(match[0].replace(/,/g, ""));
        return val <= limit;
      }
      return true;
    });
  }
  if (minRating) {
    const rating = parseFloat(minRating as string);
    data = data.filter((col) => col.rating >= rating);
  }
  if (nirfLimit) {
    const limit = parseInt(nirfLimit as string);
    data = data.filter((col) => col.nirfRank && col.nirfRank <= limit);
  }
  if (placementPct) {
    const pct = parseFloat(placementPct as string);
    data = data.filter((col) => col.placementPct && col.placementPct >= pct);
  }

  return res.json(data);
});

router.get("/colleges/:name", async (req: Request, res: Response) => {
  const colleges = await getAllColleges();
  const college = colleges.find((c) => c.name.toLowerCase() === req.params.name.toLowerCase());

  if (!college) {
    return res.status(404).json({ error: "College profile not found" });
  }
  return res.json(college);
});

// 6. SCHOLARSHIPS
router.get("/scholarships", async (req: Request, res: Response) => {
  const data = await getAllScholarships();
  return res.json(data);
});

export default router;
