import { PrismaClient } from "@prisma/client";
import * as mockData from "./mockData";

export const prisma = new PrismaClient({
  log: ["error"],
});

let dbAvailable = false;

// Quick check to see if database connection is functional
export async function checkDbConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbAvailable = true;
    console.log("✅ PostgreSQL Database connection verified via Prisma.");
    return true;
  } catch (err) {
    dbAvailable = false;
    console.warn("⚠️ Database connection failed or DATABASE_URL not set. Falling back to In-Memory Mock Datasets.");
    return false;
  }
}

// Course fetching wrapper
export async function getAllCourses(): Promise<any[]> {
  if (dbAvailable) {
    try {
      return await prisma.course.findMany() as any[];
    } catch {
      return mockData.courses as any[];
    }
  }
  return mockData.courses as any[];
}

// Career fetching wrapper
export async function getAllCareers(): Promise<any[]> {
  if (dbAvailable) {
    try {
      return await prisma.careerPath.findMany() as any[];
    } catch {
      return mockData.careers as any[];
    }
  }
  return mockData.careers as any[];
}

// Exam fetching wrapper
export async function getAllExams(): Promise<any[]> {
  if (dbAvailable) {
    try {
      return await prisma.exam.findMany({
        include: { dates: true },
      }) as any[];
    } catch {
      return getMockExamsFormatted();
    }
  }
  return getMockExamsFormatted();
}

function getMockExamsFormatted(): any[] {
  return mockData.exams.map((exam) => ({
    ...exam,
    id: exam.name.toLowerCase().replace(/\s+/g, "-"),
    dates: exam.dates.map((d, index) => ({
      id: `date-${index}`,
      eventName: d.eventName,
      eventDate: new Date(Date.now() + d.daysOffset * 24 * 60 * 60 * 1000).toISOString(),
      isConfirmed: true,
    })),
  }));
}

// College fetching wrapper
export async function getAllColleges(): Promise<any[]> {
  if (dbAvailable) {
    try {
      return await prisma.college.findMany({
        include: { collegeCourses: { include: { course: true, cutoffRanks: true } } },
      }) as any[];
    } catch {
      return getMockCollegesFormatted();
    }
  }
  return getMockCollegesFormatted();
}

function getMockCollegesFormatted(): any[] {
  return mockData.colleges.map((col, index) => ({
    ...col,
    id: `college-${index}`,
    collegeCourses: col.courses.map((c, cIndex) => ({
      id: `cc-${index}-${cIndex}`,
      course: { name: c.courseName },
      cutoffRanks: [
        { category: "OC", cutoffRank: c.cutoffOC },
        { category: "OBC", cutoffRank: c.cutoffOBC },
        { category: "SC", cutoffRank: c.cutoffSC },
        { category: "ST", cutoffRank: c.cutoffST },
      ],
    })),
  }));
}

// Scholarship fetching wrapper
export async function getAllScholarships(): Promise<any[]> {
  if (dbAvailable) {
    try {
      return await prisma.scholarship.findMany() as any[];
    } catch {
      return getMockScholarshipsFormatted();
    }
  }
  return getMockScholarshipsFormatted();
}

function getMockScholarshipsFormatted(): any[] {
  return mockData.scholarships.map((s, index) => ({
    ...s,
    id: `scholarship-${index}`,
    deadline: new Date(Date.now() + s.deadlineDaysOffset * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

// Seed the database if database is online
export async function seedDatabase() {
  const isUp = await checkDbConnection();
  if (!isUp) return;

  try {
    console.log("🌱 Seeding database...");
    
    // Seed Courses
    for (const c of mockData.courses) {
      await prisma.course.upsert({
        where: { name: c.name },
        update: {},
        create: {
          name: c.name,
          stream: c.stream,
          overview: c.overview,
          eligibility: c.eligibility,
          feesRange: c.feesRange,
          durationYears: c.durationYears,
          skillsRequired: c.skillsRequired,
          careerOpportunities: c.careerOpportunities,
          salaryRangeMin: c.salaryRangeMin,
          salaryRangeMax: c.salaryRangeMax,
          futureScope: c.futureScope,
          successStories: c.successStories,
          faqs: c.faqs,
        },
      });
    }

    // Seed Careers
    for (const car of mockData.careers) {
      await prisma.careerPath.upsert({
        where: { title: car.title },
        update: {},
        create: {
          title: car.title,
          description: car.description,
          roadmapSteps: car.roadmapSteps,
          averageSalary: car.averageSalary,
          industryDemand: car.industryDemand,
          futureGrowth: car.futureGrowth,
          topRecruiters: car.topRecruiters,
          requiredSkills: car.requiredSkills,
        },
      });
    }

    // Seed Exams
    for (const e of mockData.exams) {
      const exam = await prisma.exam.upsert({
        where: { name: e.name },
        update: {},
        create: {
          name: e.name,
          category: e.category,
          eligibility: e.eligibility,
          syllabus: e.syllabus,
          pattern: e.pattern,
          notifications: e.notifications,
          previousPapers: e.previousPapers,
          counselingProcess: e.counselingProcess,
        },
      });

      for (const d of e.dates) {
        await prisma.examDate.create({
          data: {
            examId: exam.id,
            eventName: d.eventName,
            eventDate: new Date(Date.now() + d.daysOffset * 24 * 60 * 60 * 1000),
            isConfirmed: true,
          },
        });
      }
    }

    // Seed Colleges
    for (const col of mockData.colleges) {
      const college = await prisma.college.upsert({
        where: { name: col.name },
        update: {},
        create: {
          name: col.name,
          about: col.about,
          location: col.location,
          state: col.state,
          district: col.district,
          feesRange: col.feesRange,
          rating: col.rating,
          nirfRank: col.nirfRank,
          accreditation: col.accreditation,
          placementPct: col.placementPct,
          avgPackage: col.avgPackage,
          highestPackage: col.highestPackage,
          hostelDetails: col.hostelDetails,
          gallery: col.gallery,
          videos: col.videos,
          mapEmbedUrl: col.mapEmbedUrl,
        },
      });

      // Link courses and set cutoffs
      for (const cc of col.courses) {
        const course = await prisma.course.findFirst({ where: { name: cc.courseName } });
        if (course) {
          const collegeCourse = await prisma.collegeCourse.create({
            data: {
              collegeId: college.id,
              courseId: course.id,
            },
          });

          // Insert cutoff ranks
          const categories = ["OC", "OBC", "SC", "ST"];
          const cutoffs = [cc.cutoffOC, cc.cutoffOBC, cc.cutoffSC, cc.cutoffST];
          for (let i = 0; i < categories.length; i++) {
            await prisma.cutoffRank.create({
              data: {
                collegeCourseId: collegeCourse.id,
                year: 2025,
                category: categories[i],
                gender: "Co-Education",
                cutoffRank: cutoffs[i],
              },
            });

            await prisma.predictorData.create({
              data: {
                collegeCourseId: collegeCourse.id,
                category: categories[i],
                gender: "Co-Education",
                cutoffRank: cutoffs[i],
                quota: "State Quota",
              },
            });
          }
        }
      }
    }

    // Seed Scholarships
    for (const s of mockData.scholarships) {
      await prisma.scholarship.upsert({
        where: { name: s.name },
        update: {},
        create: {
          name: s.name,
          providerType: s.providerType,
          providerName: s.providerName,
          amount: s.amount,
          eligibility: s.eligibility,
          description: s.description,
          deadline: new Date(Date.now() + s.deadlineDaysOffset * 24 * 60 * 60 * 1000),
          state: s.state,
          categoryCheck: s.categoryCheck,
          genderCheck: s.genderCheck,
          minIncome: s.minIncome,
        },
      });
    }

    console.log("🌱 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding database failed:", error);
  }
}
