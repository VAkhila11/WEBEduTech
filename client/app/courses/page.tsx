"use client";

import { useState, useEffect, Suspense } from "react";
import { Compass, GraduationCap, DollarSign, Clock, ArrowRight, UserCheck, ShieldQuestion, HelpCircle, X, CheckSquare, Sparkles } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "../config";

interface Course {
  id: string;
  name: string;
  stream: string;
  overview: string;
  eligibility: string;
  feesRange: string;
  durationYears: number;
  skillsRequired: string[];
  careerOpportunities: string[];
  salaryRangeMin: number;
  salaryRangeMax: number;
  futureScope: string;
  successStories: any[];
  faqs: any[];
}

interface Career {
  title: string;
  description: string;
  roadmapSteps: { title: string; desc: string }[];
  averageSalary: number;
  industryDemand: string;
  futureGrowth: string;
  topRecruiters: string[];
  requiredSkills: string[];
  associatedCourses: string[];
}

function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Selected stream from query parameters or default
  const streamParam = searchParams.get("stream") || "MPC";

  // States
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [careersList, setCareersList] = useState<Career[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync streams
  const handleStreamChange = (stream: string) => {
    router.push(`/courses?stream=${stream}`);
  };

  // Load course details
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/courses?stream=${streamParam}`)
      .then((res) => res.json())
      .then((data) => setCoursesList(data))
      .catch((err) => console.error("Failed to load courses:", err))
      .finally(() => setLoading(false));
  }, [streamParam]);

  // Load career options
  useEffect(() => {
    fetch(`${API_BASE_URL}/careers`)
      .then((res) => res.json())
      .then((data) => setCareersList(data))
      .catch((err) => console.error("Failed to load careers:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full relative">
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-brand-purple/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-brand-indigo">
          <Compass className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Stream & Career Explorer</h1>
          <p className="text-sm text-slate-400">Discover courses and high-paying career paths after Class 12</p>
        </div>
      </div>

      {/* Stream Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-1 rounded-2xl w-fit">
        {["MPC", "BiPC", "MEC", "CEC", "HEC"].map((s) => (
          <button
            key={s}
            onClick={() => handleStreamChange(s)}
            className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
              streamParam === s
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {s} Stream
          </button>
        ))}
      </div>

      {/* Grid Layout: Courses Listing */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-brand-indigo border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-xs text-slate-400">Loading course library...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {coursesList.map((course) => (
            <div
              key={course.id}
              className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-indigo/10 text-brand-indigo rounded uppercase">
                    {course.stream}
                  </span>
                  <div className="flex items-center space-x-1 text-slate-400 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{course.durationYears} Years</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-base mb-2 leading-snug">{course.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4">
                  {course.overview}
                </p>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-6">
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-slate-400">Min Salary</div>
                    <div className="font-bold mt-0.5 text-slate-800 dark:text-slate-200">₹{course.salaryRangeMin} LPA</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-slate-400">Max Salary</div>
                    <div className="font-bold mt-0.5 text-indigo-500">₹{course.salaryRangeMax} LPA</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCourse(course)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-brand-indigo hover:text-brand-purple transition-all"
              >
                Detailed Overview
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Career Roadmaps Subheading */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-1">Visual Career Roadmaps</h2>
        <p className="text-xs text-slate-400">Map out your pathway from Intermediate studies to high-paying jobs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {careersList
          .filter((c) =>
            c.associatedCourses.some((acName) => coursesList.some((cl) => cl.name === acName))
          )
          .map((career) => (
            <div
              key={career.title}
              className="bg-white dark:bg-dark-card p-6 border border-slate-200 dark:border-dark-border rounded-3xl"
            >
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">{career.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{career.description}</p>

              {/* Vertical SVG connection node lines */}
              <div className="relative pl-6 space-y-4">
                <div className="absolute top-2.5 bottom-2.5 left-2 w-0.5 bg-indigo-200 dark:bg-slate-800" />
                {career.roadmapSteps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start space-x-3 text-xs">
                    <span className="absolute -left-[22px] top-1.5 h-2 w-2 rounded-full bg-brand-indigo ring-4 ring-indigo-100 dark:ring-brand-indigo/25" />
                    <div>
                      <div className="font-extrabold text-slate-800 dark:text-white">{step.title}</div>
                      <div className="text-slate-400 mt-0.5">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-indigo/10 text-brand-indigo rounded">
                  {selectedCourse.stream} Stream
                </span>
                <h3 className="text-lg font-bold mt-1 text-slate-850 dark:text-white">{selectedCourse.name}</h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overview</h4>
                <p className="text-slate-600 dark:text-slate-350 leading-relaxed">{selectedCourse.overview}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Academic Eligibility</h4>
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs">
                    {selectedCourse.eligibility}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Annual Tuition Fees</h4>
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs font-semibold text-brand-indigo">
                    {selectedCourse.feesRange}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedCourse.skillsRequired.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              {selectedCourse.faqs && selectedCourse.faqs.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Frequently Asked Questions</h4>
                  <div className="space-y-3">
                    {selectedCourse.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800">
                        <div className="font-extrabold text-xs text-slate-850 dark:text-white flex items-center space-x-1">
                          <HelpCircle className="h-4 w-4 text-brand-indigo" />
                          <span>{faq.q}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 pl-5">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success stories */}
              {selectedCourse.successStories && selectedCourse.successStories.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Student success story</h4>
                  {selectedCourse.successStories.map((story, idx) => (
                    <div key={idx} className="bg-indigo-50/20 dark:bg-brand-indigo/5 border border-brand-indigo/10 p-4 rounded-xl text-xs">
                      <div className="font-bold text-brand-indigo mb-1">{story.studentName} (Batch {story.batch})</div>
                      <p className="text-slate-500 italic">"{story.story}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="py-2 px-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Courses() {
  return (
    <Suspense fallback={
      <div className="text-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-brand-indigo border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-xs text-slate-400">Loading career explorer...</p>
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}
