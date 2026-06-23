export interface MockCourse {
  name: string;
  stream: string;
  overview: string;
  eligibility: string;
  feesRange: string;
  durationYears: number;
  skillsRequired: string[];
  careerOpportunities: string[];
  salaryRangeMin: number; // in LPA
  salaryRangeMax: number; // in LPA
  futureScope: string;
  successStories: any[];
  faqs: any[];
}

export interface MockCareer {
  title: string;
  description: string;
  roadmapSteps: any; // JSON structure for steps
  averageSalary: number; // in LPA
  industryDemand: string;
  futureGrowth: string;
  topRecruiters: string[];
  requiredSkills: string[];
  associatedCourses: string[]; // names of courses
}

export interface MockExam {
  name: string;
  category: string;
  eligibility: string;
  syllabus: string;
  pattern: string;
  notifications: string[];
  previousPapers: any[];
  counselingProcess: string;
  dates: { eventName: string; daysOffset: number }[];
}

export interface MockCollege {
  name: string;
  about: string;
  location: string;
  state: string;
  district: string;
  feesRange: string;
  rating: number;
  nirfRank?: number;
  accreditation: string;
  placementPct: number;
  avgPackage: number;
  highestPackage: number;
  hostelDetails: string;
  gallery: string[];
  videos: string[];
  mapEmbedUrl: string;
  courses: { courseName: string; cutoffOC: number; cutoffOBC: number; cutoffSC: number; cutoffST: number }[];
}

export interface MockScholarship {
  name: string;
  providerType: string;
  providerName: string;
  amount: number;
  eligibility: string;
  description: string;
  deadlineDaysOffset: number;
  state?: string;
  categoryCheck: string[];
  genderCheck: string; // All, Girls, Boys
  minIncome?: number;
  associatedCourses: string[];
}

export const courses: MockCourse[] = [
  {
    name: "B.Tech Computer Science and Engineering",
    stream: "MPC",
    overview: "Four-year undergraduate program focusing on computer systems, software engineering, algorithms, and advanced technologies like AI and Cloud Computing.",
    eligibility: "Class 12th passed with Physics, Chemistry, and Mathematics (MPC) with minimum 50% marks.",
    feesRange: "₹80,000 - ₹3,00,000 per year",
    durationYears: 4,
    skillsRequired: ["Analytical Thinking", "Problem Solving", "Programming", "Mathematics", "Logic Design"],
    careerOpportunities: ["Software Engineer", "AI/ML Engineer", "Data Scientist", "Cybersecurity Expert", "Cloud Architect"],
    salaryRangeMin: 4.5,
    salaryRangeMax: 45.0,
    futureScope: "Excellent growth with the rapid expansion of AI, cloud infrastructure, and software products globally.",
    successStories: [
      { studentName: "Sandeep Kumar", batch: "2023", story: "Secured a package of 40 LPA at Microsoft after completing B.Tech CSE." }
    ],
    faqs: [
      { q: "Is coding mandatory before joining B.Tech CSE?", a: "No, the course starts from basic programming fundamentals." }
    ]
  },
  {
    name: "B.Tech Electronics and Communication Engineering",
    stream: "MPC",
    overview: "Focuses on semiconductor chips, communication systems, digital signals, hardware architecture, and embedded systems.",
    eligibility: "Class 12th MPC with minimum 50% marks.",
    feesRange: "₹75,000 - ₹2,80,000 per year",
    durationYears: 4,
    skillsRequired: ["Circuit Design", "Signal Processing", "Embedded Systems", "Hardware Troubleshooting"],
    careerOpportunities: ["Embedded Software Engineer", "VLSI Designer", "Network Engineer", "Telecom Analyst"],
    salaryRangeMin: 4.0,
    salaryRangeMax: 28.0,
    futureScope: "High demand with the India Semiconductor Mission and IoT boom.",
    successStories: [],
    faqs: []
  },
  {
    name: "MBBS",
    stream: "BiPC",
    overview: "Bachelor of Medicine and Bachelor of Surgery is the primary professional degree for medical practitioners in India.",
    eligibility: "Class 12th passed with Biology, Physics, and Chemistry (BiPC) and qualified NEET-UG exam.",
    feesRange: "₹10,000 (Govt) - ₹15,000,000 (Private) total",
    durationYears: 5.5,
    skillsRequired: ["Empathy", "Clinical Knowledge", "Resilience", "Diagnostic Aptitude"],
    careerOpportunities: ["General Physician", "Medical Officer", "Specialist Doctor (after PG)", "Clinical Researcher"],
    salaryRangeMin: 8.0,
    salaryRangeMax: 60.0,
    futureScope: "Evergreen high-demand profession with continuous learning and specialized career paths.",
    successStories: [
      { studentName: "Dr. A. Shruti", batch: "2022", story: "Completed MBBS from Gandhi Medical College and cleared NEET PG in first attempt." }
    ],
    faqs: [
      { q: "How long is the MBBS course including internship?", a: "It is 4.5 years of academic study and 1 year of compulsory rotating internship." }
    ]
  },
  {
    name: "Bachelor of Pharmacy (B.Pharm)",
    stream: "BiPC",
    overview: "Undergraduate degree in the field of pharmacy focusing on drug discovery, manufacturing, and pharmaceutical chemistry.",
    eligibility: "Class 12th passed with Physics, Chemistry, and Biology/Maths with 50% marks.",
    feesRange: "₹40,000 - ₹1,50,000 per year",
    durationYears: 4,
    skillsRequired: ["Chemical Knowledge", "Pharmacology", "Laboratory Precision", "Research Orientation"],
    careerOpportunities: ["Pharmacist", "Drug Inspector", "R&D Scientist", "Medical Representative"],
    salaryRangeMin: 3.0,
    salaryRangeMax: 12.0,
    futureScope: "India is the 'pharmacy of the world', providing extensive manufacturing, research, and regulatory jobs.",
    successStories: [],
    faqs: []
  },
  {
    name: "BBA (Bachelor of Business Administration)",
    stream: "MEC",
    overview: "Professional business management degree focusing on corporate governance, finance, marketing, and leadership.",
    eligibility: "Class 12th passed in any stream (Commerce/MEC preferred) with 50% marks.",
    feesRange: "₹50,000 - ₹2,50,000 per year",
    durationYears: 3,
    skillsRequired: ["Communication", "Leadership", "Financial Basics", "Problem Solving"],
    careerOpportunities: ["Management Trainee", "Financial Analyst", "Marketing Executive", "HR Coordinator"],
    salaryRangeMin: 3.5,
    salaryRangeMax: 15.0,
    futureScope: "Provides a stepping stone to MBA degrees and rapid growth in corporate management.",
    successStories: [],
    faqs: []
  },
  {
    name: "B.Com (Honours)",
    stream: "CEC",
    overview: "Specialized commerce degree covering corporate accounting, business laws, economics, tax, and auditing.",
    eligibility: "Class 12th passed (CEC/MEC stream) with minimum 50% marks.",
    feesRange: "₹30,000 - ₹1,20,000 per year",
    durationYears: 3,
    skillsRequired: ["Accounting", "Taxation knowledge", "Spreadsheets", "Analytical Skills"],
    careerOpportunities: ["Accountant", "Auditor", "Tax Consultant", "Finance Executive"],
    salaryRangeMin: 3.0,
    salaryRangeMax: 10.0,
    futureScope: "Core business function that is essential for every business, small or large.",
    successStories: [],
    faqs: []
  },
  {
    name: "BA LLB (Integrated Law)",
    stream: "CEC",
    overview: "5-year integrated double-degree program combining arts/humanities subjects with comprehensive legal education.",
    eligibility: "Class 12th passed in any stream with minimum 45% marks and CLAT/LAWCET qualification.",
    feesRange: "₹50,000 - ₹2,50,000 per year",
    durationYears: 5,
    skillsRequired: ["Argumentation", "Legal Writing", "Analytical Reasoning", "Public Speaking"],
    careerOpportunities: ["Corporate Lawyer", "Litigation Attorney", "Legal Advisor", "Judicial Officer"],
    salaryRangeMin: 4.5,
    salaryRangeMax: 24.0,
    futureScope: "Rapidly expanding corporate law sector, alongside traditional litigation and judiciary career paths.",
    successStories: [],
    faqs: []
  },
  {
    name: "BA in Public Administration",
    stream: "HEC",
    overview: "Undergraduate degree focusing on administrative theories, public policies, governance, and state machinery.",
    eligibility: "Class 12th passed in any stream (HEC/CEC preferred).",
    feesRange: "₹10,000 - ₹40,000 per year",
    durationYears: 3,
    skillsRequired: ["Policy Understanding", "Social Analysis", "Critical Reading", "Civic Awareness"],
    careerOpportunities: ["Civil Servant Aspirant", "NGO Coordinator", "Public Relations Officer", "Social Worker"],
    salaryRangeMin: 2.5,
    salaryRangeMax: 8.0,
    futureScope: "Direct utility for Civil Services (UPSC/State PSCs) preparation and public welfare organizations.",
    successStories: [],
    faqs: []
  }
];

export const careers: MockCareer[] = [
  {
    title: "Software Engineer",
    description: "Design, build, and deploy reliable software products and systems. Work across web, mobile, desktop, or cloud applications.",
    roadmapSteps: [
      { title: "Class 12 Intermediate (MPC)", desc: "Focus on Maths and Physics" },
      { title: "Entrance Exams", desc: "Clear JEE Main, TS EAPCET, or AP EAPCET" },
      { title: "B.Tech in CSE/IT", desc: "Focus on DSA, OOP, Systems, Databases" },
      { title: "Build Portfolio & Internships", desc: "Work on GitHub projects, secure junior developer intern roles" },
      { title: "Full-Time Placement", desc: "Associate Software Engineer starting at 4-12 LPA" },
      { title: "Senior Software Engineer", desc: "Lead system architectures, mentorship, scale applications to millions" }
    ],
    averageSalary: 8.5,
    industryDemand: "High",
    futureGrowth: "15% annual growth rate",
    topRecruiters: ["Google", "Microsoft", "TCS", "Infosys", "Wipro", "Amazon", "Stripe"],
    requiredSkills: ["JavaScript", "Python", "Data Structures", "Algorithms", "React", "NodeJS", "System Design"],
    associatedCourses: ["B.Tech Computer Science and Engineering", "B.Tech Electronics and Communication Engineering"]
  },
  {
    title: "AI Specialist / ML Engineer",
    description: "Build intelligence systems using neural networks, statistics, and machine learning libraries. Train systems to make smart decisions.",
    roadmapSteps: [
      { title: "Class 12 Intermediate (MPC)", desc: "Focus on Linear Algebra, Calculus, Statistics" },
      { title: "B.Tech in AI/ML or CSE", desc: "Learn Python, Math modeling, ML algorithms, Deep learning frameworks" },
      { title: "Publish Papers / Kaggle", desc: "Compete in dataset challenges, build computer vision or NLP models" },
      { title: "AI/ML Engineer Role", desc: "Optimize pipelines, deploy AI models to production" }
    ],
    averageSalary: 12.0,
    industryDemand: "Very High",
    futureGrowth: "30% annual growth rate",
    topRecruiters: ["NVIDIA", "Meta", "Google AI", "OpenAI", "Accenture", "TCS Research"],
    requiredSkills: ["Python", "PyTorch", "TensorFlow", "Statistics", "Machine Learning", "Mathematics"],
    associatedCourses: ["B.Tech Computer Science and Engineering"]
  },
  {
    title: "Medical Specialist / Surgeon",
    description: "Diagnose, treat, and perform surgical operations on patients to treat diseases, injuries, and deformities.",
    roadmapSteps: [
      { title: "Class 12 Intermediate (BiPC)", desc: "Focus on Biology, Chemistry, Physics" },
      { title: "Qualify NEET-UG", desc: "Rank high to secure a Government MBBS seat" },
      { title: "MBBS Degree", desc: "5.5 years of anatomy, physiology, surgery and internship" },
      { title: "Qualify NEET-PG / NEXT", desc: "Secure specialized MS (Surgery) or MD (Medicine) seats" },
      { title: "Residency & Fellowship", desc: "Super-specialization (M.Ch) in cardiology, neurosurgery, etc." }
    ],
    averageSalary: 18.0,
    industryDemand: "High",
    futureGrowth: "Steady demand",
    topRecruiters: ["Apollo Hospitals", "Yashoda Hospitals", "AIMS", "KIMS", "Fortis Healthcare"],
    requiredSkills: ["Clinical Diagnostics", "Surgical Precision", "Patient Ethics", "Resilience"],
    associatedCourses: ["MBBS"]
  },
  {
    title: "Chartered Accountant (CA)",
    description: "Professional auditor, tax advisor, and financial analyst managing financial audits and statements of corporate and private clients.",
    roadmapSteps: [
      { title: "Class 12 Intermediate (MEC/CEC)", desc: "Learn bookkeeping and accountancy" },
      { title: "CA Foundation Exam", desc: "Register with ICAI and clear foundation within 6 months" },
      { title: "CA Intermediate & Articleship", desc: "Complete 2 years of practical training under a practicing CA" },
      { title: "CA Final Exam", desc: "Clear both groups to become a member of ICAI" }
    ],
    averageSalary: 10.0,
    industryDemand: "High",
    futureGrowth: "8% annual growth",
    topRecruiters: ["Deloitte", "EY", "KPMG", "PwC", "ICICI Bank", "Tata Group"],
    requiredSkills: ["Corporate Auditing", "Indian Tax Laws", "GST", "Financial Accounting"],
    associatedCourses: ["B.Com (Honours)", "BBA (Bachelor of Business Administration)"]
  },
  {
    title: "Corporate Lawyer",
    description: "Advise businesses on legal transactions, mergers & acquisitions, contracts, liability, and compliance issues.",
    roadmapSteps: [
      { title: "Class 12 Intermediate (Any Stream)", desc: "Commerce or Humanities preferred" },
      { title: "Clear CLAT Exam", desc: "Score rank for National Law Universities (NLUs)" },
      { title: "Integrated BA LLB / BBA LLB", desc: "5 years of academic law study and moot courts" },
      { title: "State Bar Council Enrollment", desc: "Clear All India Bar Exam (AIBE)" },
      { title: "Corporate Associate", desc: "Join Law Firms starting at 8-16 LPA" }
    ],
    averageSalary: 9.5,
    industryDemand: "High",
    futureGrowth: "12% annual growth",
    topRecruiters: ["Shardul Amarchand Mangaldas", "Cyril Amarchand Mangaldas", "Khaitan & Co", "Trilegal"],
    requiredSkills: ["Contract Drafting", "Corporate Law", "Negotiation", "Critical Thinking"],
    associatedCourses: ["BA LLB (Integrated Law)"]
  }
];

export const exams: MockExam[] = [
  {
    name: "TS EAPCET",
    category: "Engineering",
    eligibility: "Intermediate Class 12 with MPC (Physics, Chemistry, Maths) from Telangana Board or equivalent. Min 45% marks.",
    syllabus: "Class 11 and Class 12 Mathematics (50%), Physics (25%), Chemistry (25%) state board syllabus.",
    pattern: "Computer Based Test (CBT), 160 multiple choice questions, no negative marking. 3 hours duration.",
    notifications: [
      "TS EAPCET 2026 application process starts online.",
      "Last date to submit application without late fee announced.",
      "Mock tests link active on the official website."
    ],
    previousPapers: [
      { year: 2025, link: "#" },
      { year: 2024, link: "#" }
    ],
    counselingProcess: "Web counseling via TSCHE portal. Certificate verification followed by web option entry and category-based seat allotment.",
    dates: [
      { eventName: "Online Application Starts", daysOffset: -30 },
      { eventName: "Application Last Date (No Late Fee)", daysOffset: 15 },
      { eventName: "Hall Ticket Download", daysOffset: 35 },
      { eventName: "Exam Date", daysOffset: 45 },
      { eventName: "Results Declaration", daysOffset: 65 }
    ]
  },
  {
    name: "JEE Main",
    category: "Engineering",
    eligibility: "Class 12 passed or appearing in current year with Physics, Chemistry, Mathematics.",
    syllabus: "Physics, Chemistry, and Mathematics based on CBSE Class 11 and 12 NCERT curriculum.",
    pattern: "Online CBT. 90 questions (75 to be attempted). +4 for correct, -1 for incorrect. 3 hours duration.",
    notifications: [
      "JEE Main Session 1 registration starts.",
      "Admit Cards released for Session 1."
    ],
    previousPapers: [
      { year: 2025, link: "#" }
    ],
    counselingProcess: "Joint Seat Allocation Authority (JoSAA) coordinates admissions into IITs, NITs, and IIITs based on JEE ranks.",
    dates: [
      { eventName: "Registration Opens", daysOffset: -60 },
      { eventName: "Admit Card Download", daysOffset: -10 },
      { eventName: "Exam Date", daysOffset: 0 },
      { eventName: "Results & Rank List", daysOffset: 20 }
    ]
  },
  {
    name: "NEET",
    category: "Medical",
    eligibility: "Class 12 passed with BiPC (Physics, Chemistry, Biology/Biotech). Minimum age 17 years.",
    syllabus: "Core topics of Physics, Chemistry, and Biology from Class 11 and 12 NCERT syllabus.",
    pattern: "Pen & paper (OMR) test. 200 questions (180 to be attempted). +4 marks for correct, -1 for incorrect. 3 hours 20 mins.",
    notifications: [
      "NEET-UG Information Bulletin released.",
      "Correction window closes tonight."
    ],
    previousPapers: [
      { year: 2025, link: "#" }
    ],
    counselingProcess: "MCC (Medical Counseling Committee) for All India Quota (15%) seats and respective State Counseling Authorities for State Quota (85%) seats.",
    dates: [
      { eventName: "Application Opening", daysOffset: -45 },
      { eventName: "Exam Day", daysOffset: 25 },
      { eventName: "Official Answer Key", daysOffset: 40 },
      { eventName: "Result Proclamation", daysOffset: 55 }
    ]
  }
];

export const colleges: MockCollege[] = [
  {
    name: "JNTUH College of Engineering Hyderabad",
    about: "Jawaharlal Nehru Technological University Hyderabad College of Engineering is a premier state government university college situated in Kukatpally, Hyderabad.",
    location: "Hyderabad",
    state: "Telangana",
    district: "Medchal-Malkajgiri",
    feesRange: "₹35,000 - ₹1,20,000 per year",
    rating: 4.4,
    nirfRank: 83,
    accreditation: "NAAC A+ & NBA",
    placementPct: 92,
    avgPackage: 6.8,
    highestPackage: 44.0,
    hostelDetails: "Separate campus hostels for boys and girls with affordable mess rates.",
    gallery: [
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60"
    ],
    videos: [],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3805.3023412586715!2d78.38600107577519!3d17.493132683411475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!2f49.31!3m3!1m2!1s0x3bcb90edd0df0e55%3A0xe54e60bf764f691d!2sJNTUH%20College%20of%20Engineering%20Hyderabad!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    courses: [
      { courseName: "B.Tech Computer Science and Engineering", cutoffOC: 1200, cutoffOBC: 2500, cutoffSC: 8000, cutoffST: 12000 },
      { courseName: "B.Tech Electronics and Communication Engineering", cutoffOC: 2200, cutoffOBC: 4500, cutoffSC: 12000, cutoffST: 18000 }
    ]
  },
  {
    name: "Vasavi College of Engineering",
    about: "Established in 1981, Vasavi College of Engineering is a top-tier private engineering institution affiliated to Osmania University.",
    location: "Hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    feesRange: "₹1,40,000 - ₹1,60,000 per year",
    rating: 4.3,
    nirfRank: 125,
    accreditation: "NAAC A++",
    placementPct: 95,
    avgPackage: 7.2,
    highestPackage: 38.0,
    hostelDetails: "No campus hostel. Multiple private PG facilities nearby in Ibrahimbagh and Langar House.",
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60"
    ],
    videos: [],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3807.5029312586715!2d78.3860010!3d17.38!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!2f49.31!3m3!1m2!1s0x3bcb9671e2efef73%3A0xe54e60bf!2sVasavi%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    courses: [
      { courseName: "B.Tech Computer Science and Engineering", cutoffOC: 1800, cutoffOBC: 3800, cutoffSC: 11000, cutoffST: 16000 },
      { courseName: "B.Tech Electronics and Communication Engineering", cutoffOC: 3500, cutoffOBC: 7000, cutoffSC: 16000, cutoffST: 24000 }
    ]
  },
  {
    name: "Gandhi Medical College, Secunderabad",
    about: "Gandhi Medical College is one of the oldest and most prestigious government medical institutions located in Secunderabad, Telangana.",
    location: "Secunderabad",
    state: "Telangana",
    district: "Hyderabad",
    feesRange: "₹10,000 - ₹30,000 per year",
    rating: 4.6,
    nirfRank: 32,
    accreditation: "NMC Approved",
    placementPct: 100,
    avgPackage: 10.0,
    highestPackage: 30.0,
    hostelDetails: "Compulsory medical student accommodation for boys and girls inside the hospital premises.",
    gallery: [
      "https://images.unsplash.com/photo-1584515901407-4b653b5369ac?w=800&auto=format&fit=crop&q=60"
    ],
    videos: [],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3806.902!2d78.50!3d17.43!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!2f49.31!3m3!1m2!1s0x3bcb90987!2sGandhi%20Medical%20College!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    courses: [
      { courseName: "MBBS", cutoffOC: 450, cutoffOBC: 1200, cutoffSC: 5500, cutoffST: 7800 }
    ]
  },
  {
    name: "Osmania Medical College, Hyderabad",
    about: "A premier historic medical college in Koti, Hyderabad, established in 1846. Affiliated to KNRUHS.",
    location: "Hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    feesRange: "₹12,000 - ₹28,000 per year",
    rating: 4.7,
    nirfRank: 25,
    accreditation: "NMC Approved",
    placementPct: 100,
    avgPackage: 11.2,
    highestPackage: 36.0,
    hostelDetails: "Separate historic hostels with active dining blocks for medical undergraduates.",
    gallery: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60"
    ],
    videos: [],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3807.123!2d78.48!3d17.38!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!2f49.31!3m3!1m2!1s0x3bcb97d!2sOsmania%20Medical%20College!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    courses: [
      { courseName: "MBBS", cutoffOC: 380, cutoffOBC: 950, cutoffSC: 4200, cutoffST: 6500 }
    ]
  },
  {
    name: "Indian Institute of Management Bangalore (IIMB)",
    about: "IIM Bangalore is one of the premier business schools in Asia, widely recognized for high-quality management studies and executive programs.",
    location: "Bangalore",
    state: "Karnataka",
    district: "Bangalore Urban",
    feesRange: "₹11,00,000 - ₹24,00,000 total",
    rating: 4.9,
    nirfRank: 2,
    accreditation: "EQUIS Accredited",
    placementPct: 100,
    avgPackage: 33.5,
    highestPackage: 115.0,
    hostelDetails: "World-class residential housing options on the beautiful green campus.",
    gallery: [],
    videos: [],
    mapEmbedUrl: "",
    courses: [
      { courseName: "BBA (Bachelor of Business Administration)", cutoffOC: 99, cutoffOBC: 95, cutoffSC: 85, cutoffST: 80 }
    ]
  }
];

export const scholarships: MockScholarship[] = [
  {
    name: "TS ePASS Post Matric Scholarship",
    providerType: "Government",
    providerName: "Telangana Welfare Departments",
    amount: 50000,
    eligibility: "Parental income below ₹2,00,000 for OBC/General or ₹2,50,000 for SC/ST. Must be pursuing post-matric courses in Telangana.",
    description: "Financial assistance towards tuition fee reimbursement and maintenance fees for state-quota college students in Telangana.",
    deadlineDaysOffset: 90,
    state: "Telangana",
    categoryCheck: ["OBC", "SC", "ST", "EWS"],
    genderCheck: "All",
    minIncome: 200000,
    associatedCourses: [
      "B.Tech Computer Science and Engineering",
      "B.Tech Electronics and Communication Engineering",
      "MBBS",
      "Bachelor of Pharmacy (B.Pharm)",
      "B.Com (Honours)",
      "BBA (Bachelor of Business Administration)",
      "BA LLB (Integrated Law)",
      "BA in Public Administration"
    ]
  },
  {
    name: "HDFC Badhte Kadam Scholarship",
    providerType: "Private",
    providerName: "HDFC Bank Foundation",
    amount: 30000,
    eligibility: "Students studying in Class 11, 12, or general and professional graduation streams. Minimum 60% marks in previous class. Annual family income below 6 Lakhs.",
    description: "Support students from underprivileged backgrounds to complete vocational or professional degree courses.",
    deadlineDaysOffset: 45,
    categoryCheck: ["OC", "OBC", "SC", "ST", "EWS"],
    genderCheck: "All",
    minIncome: 600000,
    associatedCourses: [
      "B.Tech Computer Science and Engineering",
      "B.Tech Electronics and Communication Engineering",
      "B.Com (Honours)",
      "BBA (Bachelor of Business Administration)"
    ]
  },
  {
    name: "L'Oréal India For Young Women In Science Scholarship",
    providerType: "Private",
    providerName: "L'Oréal India",
    amount: 250000,
    eligibility: "Girls who have passed Class 12 Science stream with minimum 85% marks. Family income less than 6 Lakhs.",
    description: "Exclusive scholarship designed to encourage young women to pursue engineering, medical, and scientific graduation courses.",
    deadlineDaysOffset: 60,
    categoryCheck: ["OC", "OBC", "SC", "ST", "EWS"],
    genderCheck: "Girls",
    minIncome: 600000,
    associatedCourses: [
      "B.Tech Computer Science and Engineering",
      "B.Tech Electronics and Communication Engineering",
      "MBBS",
      "Bachelor of Pharmacy (B.Pharm)"
    ]
  }
];
