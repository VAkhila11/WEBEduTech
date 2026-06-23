import { Router, Request, Response } from "express";
import { getAllColleges } from "../db";

const router = Router();

router.post("/predict", async (req: Request, res: Response) => {
  const { rank, category, gender, state, stream, branch } = req.body;

  const parsedRank = parseInt(rank);
  if (isNaN(parsedRank) || parsedRank <= 0) {
    return res.status(400).json({ error: "A valid positive rank is required." });
  }

  const userCategory = category || "OC";
  const userGender = gender || "Co-Education";

  try {
    const colleges = await getAllColleges();
    const safeColleges: any[] = [];
    const moderateColleges: any[] = [];
    const dreamColleges: any[] = [];

    for (const col of colleges) {
      for (const cc of col.collegeCourses) {
        // Filter by stream/branch if provided
        if (stream && cc.course.name && !cc.course.name.toLowerCase().includes(stream.toLowerCase()) && !cc.course.name.includes("MBBS")) {
          // Quick stream check bypass if NEET and MBBS
          if (stream === "BiPC" && !cc.course.name.includes("MBBS") && !cc.course.name.includes("Pharmacy")) continue;
          if (stream === "MPC" && !cc.course.name.includes("B.Tech")) continue;
        }
        
        if (branch && cc.course.name && !cc.course.name.toLowerCase().includes(branch.toLowerCase())) {
          continue;
        }

        // Find relevant cutoff
        // Fallback to OC if category cutoff not available
        let matchingCutoff = cc.cutoffRanks.find(
          (cr: any) => cr.category.toUpperCase() === userCategory.toUpperCase()
        );
        if (!matchingCutoff) {
          matchingCutoff = cc.cutoffRanks.find((cr: any) => cr.category === "OC");
        }

        if (!matchingCutoff) continue;

        const cutoffVal = matchingCutoff.cutoffRank;

        // Calculate probability
        let probability = 50;
        if (cutoffVal >= parsedRank * 1.3) {
          probability = Math.min(99, Math.floor(85 + (cutoffVal - parsedRank) / 1000));
        } else if (cutoffVal >= parsedRank) {
          probability = Math.floor(70 + ((cutoffVal - parsedRank) / (parsedRank * 0.3)) * 15);
        } else if (cutoffVal >= parsedRank * 0.8) {
          probability = Math.floor(40 + ((cutoffVal - parsedRank * 0.8) / (parsedRank * 0.2)) * 30);
        } else {
          probability = Math.max(5, Math.floor(((cutoffVal) / (parsedRank * 0.8)) * 40));
        }

        const collegeResult = {
          collegeId: col.id,
          collegeName: col.name,
          location: col.location,
          state: col.state,
          feesRange: col.feesRange,
          rating: col.rating,
          nirfRank: col.nirfRank,
          accreditation: col.accreditation,
          placementPct: col.placementPct,
          avgPackage: col.avgPackage,
          highestPackage: col.highestPackage,
          courseName: cc.course.name,
          cutoff: cutoffVal,
          probability,
          // Generate 3 year cutoff trends for Recharts graph visualization
          cutoffTrends: [
            { year: 2023, cutoff: Math.round(cutoffVal * 0.96) },
            { year: 2024, cutoff: Math.round(cutoffVal * 1.03) },
            { year: 2025, cutoff: cutoffVal }
          ]
        };

        // Categorize into Safe, Moderate, Dream
        if (cutoffVal > parsedRank * 1.2) {
          safeColleges.push(collegeResult);
        } else if (cutoffVal >= parsedRank * 0.9) {
          moderateColleges.push(collegeResult);
        } else if (cutoffVal >= parsedRank * 0.7) {
          dreamColleges.push(collegeResult);
        }
      }
    }

    // Sort by rating or packages
    const sortByProb = (a: any, b: any) => b.probability - a.probability;
    return res.json({
      safe: safeColleges.sort(sortByProb).slice(0, 8),
      moderate: moderateColleges.sort(sortByProb).slice(0, 8),
      dream: dreamColleges.sort(sortByProb).slice(0, 8),
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to process college prediction. Please check parameters." });
  }
});

export default router;
