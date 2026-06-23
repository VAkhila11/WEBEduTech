import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { courses, colleges, exams, scholarships } from "../mockData";

const router = Router();

// 1. GET SYSTEM ANALYTICS
router.get("/analytics", async (req: Request, res: Response) => {
  try {
    let usersCount = 1240;
    let predictorUsage = 875;
    let queryCount = 2050;

    try {
      usersCount = await prisma.user.count();
      predictorUsage = await prisma.analytics.count({ where: { metric: "predictor_use" } });
      queryCount = await prisma.analytics.count({ where: { metric: "query" } });
    } catch {
      // Keep static mock variables if DB not online
    }

    // Return detailed dashboard metrics for the Recharts dashboard
    return res.json({
      summary: {
        totalUsers: usersCount,
        predictorUses: predictorUsage || 480,
        counselorQueries: queryCount || 820,
        matchingScholarships: scholarships.length,
      },
      trafficTrend: [
        { name: "Mon", visitors: 400, pageviews: 2400 },
        { name: "Tue", visitors: 300, pageviews: 2210 },
        { name: "Wed", visitors: 600, pageviews: 2290 },
        { name: "Thu", visitors: 800, pageviews: 3000 },
        { name: "Fri", visitors: 700, pageviews: 2800 },
        { name: "Sat", visitors: 900, pageviews: 3400 },
        { name: "Sun", visitors: 1100, pageviews: 4000 }
      ],
      popularCourses: [
        { name: "B.Tech CSE", value: 450 },
        { name: "MBBS", value: 300 },
        { name: "B.Tech ECE", value: 180 },
        { name: "BBA", value: 150 },
        { name: "B.Com", value: 120 }
      ],
      predictorTrends: [
        { name: "OC", percentage: 55 },
        { name: "OBC", percentage: 30 },
        { name: "SC", percentage: 10 },
        { name: "ST", percentage: 5 }
      ]
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load admin analytics." });
  }
});

// 2. BULK DATA UPLOAD MOCK
router.post("/upload-predictor-data", (req: Request, res: Response) => {
  const { data } = req.body;
  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ error: "Invalid data package. Array format required." });
  }

  console.log(`[ADMIN] Bulk upload of ${data.length} predictor cutoffs registered.`);
  return res.json({
    message: "Data package uploaded successfully (Mocked).",
    processedCount: data.length,
  });
});

export default router;
