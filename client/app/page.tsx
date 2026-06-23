"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Compass, Sparkles, Award, GraduationCap, ChevronRight, Bell, Calendar, ArrowUpRight, ArrowRight, Heart } from "lucide-react";
import { API_BASE_URL } from "./config";

interface SearchResults {
  courses: any[];
  careers: any[];
  exams: any[];
  colleges: any[];
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults>({ courses: [], careers: [], exams: [], colleges: [] });
  const [showResults, setShowResults] = useState(false);
  const [examsList, setExamsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch search results on input change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ courses: [], careers: [], exams: [], colleges: [] });
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Load latest exams for notifications
  useEffect(() => {
    fetch(`${API_BASE_URL}/exams`)
      .then((res) => res.json())
      .then((data) => setExamsList(data.slice(0, 3)))
      .catch((err) => console.error("Failed to load exams:", err));
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Glow Backdrops */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-indigo/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-purple/10 blur-[130px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto flex-grow flex flex-col justify-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-brand-indigo/15 border border-brand-indigo/25 px-3 py-1.5 rounded-full text-xs font-semibold text-brand-indigo dark:text-indigo-300 mb-6 mx-auto animate-bounce">
          <Sparkles className="h-4.5 w-4.5" />
          <span>India's post-12th Guidance Center</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
          Find the Right Course, College and Career After{" "}
          <span className="text-gradient">Intermediate</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-8 font-medium">
          Explore thousands of courses, colleges, entrance exams, and career opportunities tailored for your streams.
        </p>

        {/* Global Live Search Bar */}
        <div className="relative max-w-2xl w-full mx-auto mb-12 z-20">
          <div className="glass-panel flex items-center p-1.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 focus-within:ring-2 focus-within:ring-brand-indigo">
            <Search className="h-6 w-6 text-slate-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search colleges, courses (CSE, MBBS), exams (EAPCET, NEET)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="w-full bg-transparent border-0 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 py-3 px-3 text-base"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="mr-2 text-xs px-2 py-1 bg-slate-150 dark:bg-slate-800 text-slate-500 rounded hover:bg-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Dropdown Suggestion Menu */}
          {showResults && searchQuery && (
            <div className="absolute top-[105%] left-0 right-0 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl overflow-hidden text-left max-h-[450px] overflow-y-auto z-30 animate-in fade-in duration-200">
              {loading ? (
                <div className="p-6 text-center text-slate-400 text-sm">Searching...</div>
              ) : Object.values(searchResults).every((arr) => arr.length === 0) ? (
                <div className="p-6 text-center text-slate-400 text-sm">No results match "{searchQuery}"</div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {/* Match Colleges */}
                  {searchResults.colleges.length > 0 && (
                    <div className="p-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Colleges</h4>
                      <div className="space-y-2">
                        {searchResults.colleges.map((col) => (
                          <Link
                            key={col.id}
                            href={`/colleges/${col.name.toLowerCase().replace(/\s+/g, "-")}`}
                            onClick={clearSearch}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/60"
                          >
                            <div>
                              <div className="text-sm font-semibold">{col.name}</div>
                              <div className="text-xs text-slate-400">{col.location}, {col.state}</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Match Courses */}
                  {searchResults.courses.length > 0 && (
                    <div className="p-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Courses</h4>
                      <div className="space-y-2">
                        {searchResults.courses.map((course) => (
                          <Link
                            key={course.id}
                            href={`/courses?stream=${course.stream}`}
                            onClick={clearSearch}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/60"
                          >
                            <div>
                              <div className="text-sm font-semibold">{course.name}</div>
                              <div className="text-xs text-slate-400">Stream: {course.stream} | {course.durationYears} Years</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Match Careers */}
                  {searchResults.careers.length > 0 && (
                    <div className="p-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Career Paths</h4>
                      <div className="space-y-2">
                        {searchResults.careers.map((career) => (
                          <Link
                            key={career.title}
                            href={`/courses`}
                            onClick={clearSearch}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/60"
                          >
                            <div>
                              <div className="text-sm font-semibold">{career.title}</div>
                              <div className="text-xs text-slate-400">Demand: {career.industryDemand} | Avg Salary: {career.averageSalary} LPA</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Match Exams */}
                  {searchResults.exams.length > 0 && (
                    <div className="p-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Entrance Exams</h4>
                      <div className="space-y-2">
                        {searchResults.exams.map((exam) => (
                          <Link
                            key={exam.id}
                            href={`/colleges`} // Redirect to college folder or catalog
                            onClick={clearSearch}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/60"
                          >
                            <div>
                              <div className="text-sm font-semibold">{exam.name}</div>
                              <div className="text-xs text-slate-400">{exam.category} Exam</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
          <Link
            href="/predictor"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-indigo to-brand-blue hover:shadow-xl shadow-brand-indigo/15 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 transition-all hover:-translate-y-0.5"
          >
            <Sparkles className="h-5 w-5" />
            <span>Predict My College</span>
          </Link>
          <Link
            href="/courses"
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-bold rounded-2xl flex items-center justify-center space-x-2 transition-all hover:-translate-y-0.5"
          >
            <Compass className="h-5 w-5" />
            <span>Explore Careers</span>
          </Link>
        </div>
      </section>

      {/* Main Content Layout Grid */}
      <section className="bg-white dark:bg-dark-card/30 border-t border-slate-200 dark:border-slate-800 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* MPC stream block */}
            <div className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all">
              <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-brand-indigo mb-4">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">MPC Streams</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Analyze cutoffs and explore roadmaps for engineering (B.Tech, B.Arch), defense sciences, merchant navy and aviation.
              </p>
              <Link href="/courses?stream=MPC" className="text-sm font-semibold text-brand-indigo flex items-center group">
                <span>Explore MPC Paths</span>
                <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* BiPC stream block */}
            <div className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all">
              <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-brand-purple mb-4">
                <Heart className="h-6 w-6 text-brand-purple" />
              </div>
              <h3 className="text-lg font-bold mb-2">BiPC Streams</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Analyze cutoff and admissions for MBBS, dental (BDS), ayurveda, pharmaceutical chemistry, and agricultural research.
              </p>
              <Link href="/courses?stream=BiPC" className="text-sm font-semibold text-brand-purple flex items-center group">
                <span>Explore BiPC Paths</span>
                <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Commerce / MEC stream block */}
            <div className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all">
              <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/40 rounded-xl flex items-center justify-center text-brand-blue mb-4">
                <Award className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="text-lg font-bold mb-2">MEC / CEC / HEC Streams</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Discover options in commerce (B.Com, BBA), accounting (CA, CS, CMA), finance banking, and legal studies (LLB).
              </p>
              <Link href="/courses?stream=MEC" className="text-sm font-semibold text-brand-blue flex items-center group">
                <span>Explore Commerce Paths</span>
                <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* Exam Updates & Scholarship Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Exam updates */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  <span>Entrance Exams Calendar</span>
                </h3>
                <span className="text-xs px-2.5 py-1 bg-indigo-500/10 text-brand-indigo rounded-full font-bold">2026 Season</span>
              </div>
              <div className="space-y-4">
                {examsList.map((exam) => (
                  <div key={exam.id} className="bg-white dark:bg-dark-card p-4 rounded-xl border border-slate-200 dark:border-dark-border flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm">{exam.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{exam.category} | counseling via state systems</p>
                    </div>
                    <Link
                      href="/colleges"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg flex items-center space-x-1"
                    >
                      <span>Syllabus</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Scholarship alerts */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-purple-500" />
                  <span>Active Scholarship Alerts</span>
                </h3>
                <span className="text-xs px-2.5 py-1 bg-purple-500/10 text-brand-purple rounded-full font-bold">Matching Active</span>
              </div>
              <div className="space-y-4">
                <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-slate-200 dark:border-dark-border flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">TS ePASS Matric Reimbursement</h4>
                    <p className="text-xs text-slate-400 mt-1">Tuition fee reimbursement up to ₹50,000.</p>
                  </div>
                  <Link
                    href="/scholarships"
                    className="px-4 py-1.5 bg-gradient-to-r from-brand-indigo to-brand-purple text-white text-xs font-bold rounded-lg flex items-center space-x-1"
                  >
                    <span>Match</span>
                  </Link>
                </div>

                <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-slate-200 dark:border-dark-border flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">L'Oréal Young Women in Science</h4>
                    <p className="text-xs text-slate-400 mt-1">Up to ₹2,50,000 for girls in science streams.</p>
                  </div>
                  <Link
                    href="/scholarships"
                    className="px-4 py-1.5 bg-gradient-to-r from-brand-indigo to-brand-purple text-white text-xs font-bold rounded-lg flex items-center space-x-1"
                  >
                    <span>Match</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
