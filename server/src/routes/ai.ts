import { Router, Request, Response } from "express";
import { getAllCourses, getAllColleges, getAllScholarships } from "../db";

const router = Router();

// Mock interactive node roadmap generators for the frontend counselor graph
function getCustomRoadmap(interest: string) {
  if (interest.includes("cse") || interest.includes("software") || interest.includes("computer")) {
    return [
      { id: "1", title: "Class 12 Intermediate (MPC)", type: "input", status: "completed" },
      { id: "2", title: "Entrance Exam (EAPCET/JEE)", type: "exam", status: "current" },
      { id: "3", title: "B.Tech Computer Science", type: "degree", status: "upcoming" },
      { id: "4", title: "DSA & Open Source Development", type: "skill", status: "upcoming" },
      { id: "5", title: "Software Development Internship", type: "internship", status: "upcoming" },
      { id: "6", title: "Full-Stack Software Engineer (6-15 LPA)", type: "job", status: "upcoming" }
    ];
  }
  if (interest.includes("doctor") || interest.includes("mbbs") || interest.includes("medical")) {
    return [
      { id: "1", title: "Class 12 Intermediate (BiPC)", type: "input", status: "completed" },
      { id: "2", title: "Entrance Exam (NEET)", type: "exam", status: "current" },
      { id: "3", title: "MBBS (4.5 Yrs + 1 Yr Internship)", type: "degree", status: "upcoming" },
      { id: "4", title: "MD / MS Specialization", type: "degree", status: "upcoming" },
      { id: "5", title: "Junior Resident doctor", type: "job", status: "upcoming" }
    ];
  }
  // Default general commerce / management roadmap
  return [
    { id: "1", title: "Class 12 (MEC/CEC/HEC)", type: "input", status: "completed" },
    { id: "2", title: "Bachelor of Business Administration (BBA)", type: "degree", status: "current" },
    { id: "3", title: "MBA / Specialized Certifications", type: "degree", status: "upcoming" },
    { id: "4", title: "Corporate Management Consultant (8-18 LPA)", type: "job", status: "upcoming" }
  ];
}

router.post("/chat", async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message content cannot be blank." });
  }

  const query = message.toLowerCase().trim();

  // Load database items to dynamically reference them in AI responses
  const [courses, colleges, scholarships] = await Promise.all([
    getAllCourses(),
    getAllColleges(),
    getAllScholarships(),
  ]);

  let reply = "";
  let suggestedRoadmap: any = null;

  // 1. MPC Query
  if (query.includes("mpc") || query.includes("maths") || query.includes("engineering")) {
    suggestedRoadmap = getCustomRoadmap("cse");
    reply = `### Career Path Options for MPC (Mathematics, Physics, Chemistry)

Students completing their Intermediate in the **MPC stream** have access to premium engineering and scientific roles. Here are the top recommended pathways:

1. **B.Tech Computer Science & Engineering**: Focuses on software engineering, cloud architecture, and artificial intelligence.
2. **B.Tech Electronics & Communication (ECE)**: Covers microprocessors, VLSI design, and telecommunications.
3. **Data Science / Artificial Intelligence**: Highly specialized branches that prepare you directly for the industry.

#### Recommended Next Steps:
* Register for entrance exams like **JEE Main**, **TS EAPCET**, or **AP EAPCET**.
* Keep coding and logical reasoning practice consistent!`;
  }
  // 2. BiPC Query
  else if (query.includes("bipc") || query.includes("biology") || query.includes("medical") || query.includes("mbbs")) {
    suggestedRoadmap = getCustomRoadmap("doctor");
    reply = `### Career Path Options for BiPC (Biology, Physics, Chemistry)

BiPC is the foundation for healthcare, medicine, and pharmaceutical sciences in India.

1. **MBBS (Bachelor of Medicine & Bachelor of Surgery)**: The flagship 5.5-year medical degree. Requires securing a top rank in **NEET**.
2. **B.Pharm (Bachelor of Pharmacy)**: Core chemistry and pharmacology. Offers strong corporate placements in R&D and drug inspection.
3. **B.Sc Agriculture / Veterinary Science**: Fast-growing sectors focused on agricultural innovation and animal healthcare.

#### Recommended Next Steps:
* Focus intensely on **NCERT Biology, Physics, and Chemistry** for NEET preparation.
* Explore state-level counselling websites (e.g. KNRUHS for Telangana).`;
  }
  // 3. CSE Rank Query
  else if (query.includes("cse") && (query.includes("rank") || query.includes("can i get"))) {
    // Extract rank if any number is in query
    const match = query.match(/\d+/);
    const rankVal = match ? parseInt(match[0]) : 5000;
    
    suggestedRoadmap = getCustomRoadmap("cse");
    reply = `### Admission Assessment for CSE with Rank ${rankVal}

Based on the latest TS/AP EAPCET historic cutoffs, a rank of **${rankVal}** gives you the following admission prospects:

* **Government / Premium Colleges (e.g., JNTU Hyderabad)**: 
  ${rankVal <= 1500 ? "🟢 **High probability!** You qualify comfortably for a CSE seat." : "🟡 **Moderate to Low probability.** The general category cutoff for JNTU CSE is typically around 1,200. Consider ECE or checking OBC/SC/ST category benefits."}
  
* **Top-tier Private Colleges (e.g., Vasavi, CBIT)**:
  ${rankVal <= 4000 ? "🟢 **Safe choice.** Vasavi CSE cutoff is ~1,800-3,500. You stand a very strong chance." : "🟡 **Moderate chance.** You might need to look at IT, ECE, or specialized AI branches in these top colleges."}

#### Suggestions:
Use our **[College Predictor](/predictor)** to input your exact category and gender for a detailed breakdown.`;
  }
  // 4. Scholarship Query
  else if (query.includes("scholarship") || query.includes("free") || query.includes("fee reimbursement")) {
    reply = `### Scholarship Programs Available After Class 12

There are both government and private scholarships you can apply for:

1. **TS/AP ePASS**: State-sponsored programs providing complete or partial tuition fee reimbursement for candidates belonging to SC, ST, BC, and EWS categories.
2. **HDFC Badhte Kadam**: Private scholarship offering ₹30,000 for students with family incomes under 6 Lakhs.
3. **L'Oréal India Girls in Science**: Provides up to ₹2.5 Lakhs for female students pursuing graduation in science streams.

#### How to apply:
Verify your family income certificate and apply directly through our **[Scholarship Matching Hub](/scholarships)**!`;
  }
  // 5. Default Query
  else {
    reply = `Hello! I am the **EDUTech AI Career Counsellor**. 

I can help you navigate post-Class 12 decisions. Here are some questions you can ask me:
* *Which course is best for MPC?*
* *Can I get CSE with a rank of 4000?*
* *Which scholarships am I eligible for?*
* *What is the roadmap for becoming a Software Engineer?*

Feel free to input your stream and marks, and I will draw up a personalized path for you!`;
  }

  // Simulate delay to mimic streaming/AI generation
  setTimeout(() => {
    return res.json({
      reply,
      roadmap: suggestedRoadmap,
    });
  }, 400);
});

export default router;
