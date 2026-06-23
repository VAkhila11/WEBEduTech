import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Compass, Sparkles, Award, GraduationCap, ChevronRight, Bell, Calendar, ArrowUpRight, ArrowRight, Heart } from "lucide-react";
import { API_BASE_URL } from "../config";

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
          const payload = data && typeof data === "object" ? data : {};
          setSearchResults({
            courses: Array.isArray(payload.courses) ? payload.courses : [],
            careers: Array.isArray(payload.careers) ? payload.careers : [],
            exams: Array.isArray(payload.exams) ? payload.exams : [],
            colleges: Array.isArray(payload.colleges) ? payload.colleges : [],
          });
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
      .then((data) => {
        setExamsList(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .catch((err) => console.error("Failed to load exams:", err));
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg relative">
      {/* Glow Backdrops */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-indigo/10 blur-[120px] pointer-events-none" />
      <div className="fixed top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-purple/10 blur-[130px] pointer-events-none" />

      {/* Hero Section - Perfectly Centered Vertically & Horizontally */}
<section className="relative flex min-h-[85vh] flex-col items-center justify-center text-center px-6 sm:px-8 lg:px-10 py-24 md:py-32 overflow-hidden">

  <div className="w-full max-w-6xl mx-auto flex flex-col items-center">

           
        {/* Sparkles Badge */}
        <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-brand-indigo/15 border border-brand-indigo/25 px-4 py-2 rounded-full text-xs font-semibold text-brand-indigo dark:text-indigo-300 animate-bounce">
          <Sparkles className="h-4 w-4" />
          <span>India's post-12th Guidance Center</span>
        </div>

        {/* Headline - Strict 24px margin to subheadline, 56px H1 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 dark:text-white mt-8 max-w-5xl tracking-tight leading-tight font-bold">
          Find the Right Course, College and Career After{" "}
          <span className="text-gradient">Intermediate</span>
        </h1>

        {/* Subheadline - Strict 32px margin to buttons, Max Width 700px */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mt-8 md:mt-10 font-medium leading-relaxed">
          Explore thousands of courses, colleges, entrance exams, and career opportunities tailored for your streams.
        </p>

        {/* Global Live Search Bar */}
<div className="relative w-full max-w-4xl mx-auto mt-12 md:mt-14 z-20">
  {/* Search Bar */}
  <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-h-[72px] md:min-h-[76px] px-4 sm:px-5 rounded-[28px] border border-brand-indigo/20 dark:border-brand-indigo/30 bg-gradient-to-r from-white via-indigo-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-xl hover:shadow-2xl backdrop-blur-md transition-all duration-300 focus-within:ring-4 focus-within:ring-brand-indigo/20">
    <Search className="h-6 w-6 sm:h-7 sm:w-7 text-brand-indigo flex-shrink-0" />

    <input
      type="text"
      placeholder="Search colleges, courses (CSE, MBBS), exams (EAPCET, NEET)..."
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        setShowResults(true);
      }}
      onFocus={() => setShowResults(true)}
      className="flex-1 min-w-0 bg-transparent border-0 outline-none px-1 py-4 text-base sm:text-lg md:text-xl font-medium text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
    />

    {searchQuery && (
      <button
        onClick={clearSearch}
        className="flex-shrink-0 px-4 sm:px-5 py-2.5 rounded-2xl bg-brand-indigo text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md"
      >
        Clear
      </button>
    )}
  </div>

  {/* Search Results */}
  {showResults && searchQuery && (
    <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl border border-slate-200 dark:border-dark-border rounded-[28px] shadow-2xl overflow-hidden text-left max-h-[500px] overflow-y-auto z-30 animate-in fade-in duration-200">

      {loading ? (
        <div className="p-10 text-center">
          <div className="inline-flex items-center gap-3 text-brand-indigo font-medium">
            <div className="h-5 w-5 rounded-full border-2 border-brand-indigo border-t-transparent animate-spin" />
            Searching...
          </div>
        </div>
      ) : Object.values(searchResults).every(
          (arr) => arr.length === 0
        ) ? (
        <div className="p-10 text-center text-slate-500 dark:text-slate-400 font-medium">
          No results found for
          <span className="font-semibold text-brand-indigo ml-1">
            "{searchQuery}"
          </span>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">

          {/* Colleges */}
          {searchResults.colleges.length > 0 && (
            <div className="p-6">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-indigo">
                Colleges
              </h4>

              <div className="space-y-3">
                {searchResults.colleges.map((col) => (
                  <Link
                    key={col.id}
                    to="/colleges"
                    onClick={clearSearch}
                    className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {col.name}
                      </div>

                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {col.location}, {col.state}
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-brand-indigo transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {searchResults.courses.length > 0 && (
            <div className="p-6">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-blue">
                Courses
              </h4>

              <div className="space-y-3">
                {searchResults.courses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses?stream=${course.stream}`}
                    onClick={clearSearch}
                    className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {course.name}
                      </div>

                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Stream: {course.stream} • {course.durationYears} Years
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-brand-blue transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Careers */}
          {searchResults.careers.length > 0 && (
            <div className="p-6">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-purple">
                Career Paths
              </h4>

              <div className="space-y-3">
                {searchResults.careers.map((career) => (
                  <Link
                    key={career.title}
                    to="/courses"
                    onClick={clearSearch}
                    className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {career.title}
                      </div>

                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Demand: {career.industryDemand} • Avg Salary: {career.averageSalary} LPA
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-brand-purple transition-colors" />
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

{/* Action Buttons - Strict 48px margin to features */}
        <div className="mt-16 md:mt-20 lg:mt-24 w-full max-w-4xl mx-auto">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">

  <Link
    to="/predictor"
    className="w-full min-h-[88px] md:min-h-[100px] px-6 sm:px-8 lg:px-10 py-5 sm:py-6 bg-gradient-to-r from-brand-indigo via-brand-blue to-brand-purple text-white font-bold text-lg sm:text-xl md:text-2xl rounded-[28px] flex items-center justify-center gap-3 text-center shadow-xl hover:shadow-2xl hover:shadow-brand-indigo/30 transition-all duration-300 hover:-translate-y-2"
  >
    <Sparkles className="h-7 w-7 flex-shrink-0" />
    <span className="leading-tight">
      Predict My College
    </span>
  </Link>

  <Link
    to="/courses"
    className="w-full min-h-[88px] md:min-h-[100px] px-6 sm:px-8 lg:px-10 py-5 sm:py-6 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-lg sm:text-xl md:text-2xl rounded-[28px] flex items-center justify-center gap-3 text-center shadow-lg hover:shadow-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:-translate-y-2"
  >
    <Compass className="h-7 w-7 flex-shrink-0" />
    <span className="leading-tight">
      Explore Careers
    </span>
  </Link>

</div>
</div>
      </div>
      </section>
     


      {/* Main Content Layout Grid */}
      <section className="w-full bg-white dark:bg-dark-card/30 border-t border-slate-200 dark:border-slate-800 py-24 md:py-32 lg:py-36 transition-colors relative z-5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          
          {/* Section 1: Stream Explorer */}
          <div className="mb-20 md:mb-24 lg:mb-28">
            <div className="text-center mb-12 md:mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Explore by Stream</h2>
              <p className="mt-3 text-base md:text-lg text-slate-600 dark:text-slate-300">Choose the stream that fits your goals and discover the right path forward.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            
            {/* MPC stream block */}
            <div className="glass-card p-8 md:p-10 rounded-[28px] hover:shadow-xl transition-all duration-200 flex flex-col justify-between h-full bg-white/80 dark:bg-slate-900/45 border border-slate-200/80 dark:border-slate-800/80 shadow-md text-center min-h-[280px]">
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-brand-indigo mb-6">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-white">MPC Streams</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-6 max-w-sm mx-auto">
                  Analyze cutoffs and explore roadmaps for engineering (B.Tech, B.Arch), defense sciences, merchant navy and aviation.
                </p>
              </div>
              <Link to="/courses?stream=MPC" className="mx-auto text-sm md:text-base font-semibold text-brand-indigo hover:text-brand-indigo/80 flex items-center justify-center group w-fit">
                <span>Explore MPC Paths</span>
                <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* BiPC stream block */}
            <div className="glass-card p-8 md:p-10 rounded-[28px] hover:shadow-xl transition-all duration-200 flex flex-col justify-between h-full bg-white/80 dark:bg-slate-900/45 border border-slate-200/80 dark:border-slate-800/80 shadow-md text-center min-h-[300px] w-full max-w-[360px] mx-auto">
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="h-16 w-16 bg-purple-50 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center text-brand-purple mb-6">
                  <Heart className="h-8 w-8 text-brand-purple" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-white">BiPC Streams</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-6 max-w-sm mx-auto">
                  Analyze cutoff and admissions for MBBS, dental (BDS), ayurveda, pharmaceutical chemistry, and agricultural research.
                </p>
              </div>
              <Link to="/courses?stream=BiPC" className="mx-auto text-sm md:text-base font-semibold text-brand-purple hover:text-brand-purple/80 flex items-center justify-center group w-fit">
                <span>Explore BiPC Paths</span>
                <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Commerce / MEC stream block */}
            <div className="glass-card p-8 md:p-10 rounded-[28px] hover:shadow-xl transition-all duration-200 flex flex-col justify-between h-full bg-white/80 dark:bg-slate-900/45 border border-slate-200/80 dark:border-slate-800/80 shadow-md text-center min-h-[300px] w-full max-w-[360px] mx-auto">
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-brand-blue mb-6">
                  <Award className="h-8 w-8 text-brand-blue" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-white">MEC / CEC / HEC Streams</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-6 max-w-sm mx-auto">
                  Discover options in commerce (B.Com, BBA), accounting (CA, CS, CMA), finance banking, and legal studies (LLB).
                </p>
              </div>
              <Link to="/courses?stream=MEC" className="mx-auto text-sm md:text-base font-semibold text-brand-blue hover:text-brand-blue/80 flex items-center justify-center group w-fit">
                <span>Explore Commerce Paths</span>
                <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            </div>
          </div>

          <div className="mb-20 md:mb-24 lg:mb-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <div className="text-center mb-12 md:mb-14">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Latest Exam Updates</h2>
                  <p className="mt-3 text-base md:text-lg text-slate-600 dark:text-slate-300">Stay informed about the latest entrance exams and important timelines.</p>
                </div>
                <div className="w-full">
                  <div className="bg-slate-100 dark:bg-slate-900/50 p-8 md:p-10 lg:p-16 rounded-[12px] border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full shadow-md">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 text-center sm:text-left">
                        <h3 className="text-2xl md:text-3xl font-bold flex items-center justify-center sm:justify-start space-x-2 text-slate-900 dark:text-white">
                          <Calendar className="h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
                          <span>Entrance Exams Calendar</span>
                        </h3>
                        <span className="text-xs px-3 py-1.5 bg-indigo-500/10 text-brand-indigo rounded-full font-bold w-fit mx-auto sm:mx-0">2026 Season</span>
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        {examsList.map((exam) => (
                          <div key={exam.id} className="bg-white dark:bg-dark-card p-5 md:p-6 rounded-xl border border-slate-200 dark:border-dark-border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-base md:text-lg text-slate-900 dark:text-white">{exam.name}</h4>
                              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2">{exam.category} Exam | cutoff metrics apply</p>
                            </div>
                            <Link
                              to="/colleges"
                              className="px-5 py-2.5 md:py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm md:text-base font-semibold text-slate-700 dark:text-slate-200 rounded-lg flex items-center space-x-2 transition-all w-fit whitespace-nowrap hover:shadow-md"
                            >
                              <span>Syllabus</span>
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-center mb-12 md:mb-14">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Scholarship Opportunities</h2>
                  <p className="mt-3 text-base md:text-lg text-slate-600 dark:text-slate-300">Explore scholarships that can support your higher education journey.</p>
                </div>
                <div className="w-full">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-8 md:p-10 lg:p-12 rounded-[32px] border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full shadow-md">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 text-center sm:text-left">
                        <h3 className="text-2xl md:text-3xl font-bold flex items-center justify-center sm:justify-start space-x-2 text-slate-900 dark:text-white">
                          <Bell className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
                          <span>Active Scholarship Alerts</span>
                        </h3>
                        <span className="text-xs px-3 py-1.5 bg-purple-500/10 text-brand-purple rounded-full font-bold w-fit mx-auto sm:mx-0">Matching Active</span>
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        <div className="bg-white dark:bg-dark-card p-5 md:p-6 rounded-xl border border-slate-200 dark:border-dark-border flex flex-col sm:flex-row sm:justify-between sm:items-start sm:gap-4 gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-base md:text-lg text-slate-900 dark:text-white">TS ePASS Matric Reimbursement</h4>
                            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2">Tuition fee reimbursement up to ₹50,000.</p>
                          </div>
                          <Link
                            to="/scholarships"
                            className="px-6 py-2.5 md:py-3 bg-gradient-to-r from-brand-indigo to-brand-purple text-white text-sm md:text-base font-bold rounded-lg flex items-center space-x-2 transition-all hover:shadow-xl w-fit whitespace-nowrap"
                          >
                            <span>Match</span>
                          </Link>
                        </div>

                        <div className="bg-white dark:bg-dark-card p-5 md:p-6 rounded-xl border border-slate-200 dark:border-dark-border flex flex-col sm:flex-row sm:justify-between sm:items-start sm:gap-4 gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-base md:text-lg text-slate-900 dark:text-white">L'Oréal Young Women in Science</h4>
                            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2">Up to ₹2,50,000 for girls in science streams.</p>
                          </div>
                          <Link
                            to="/scholarships"
                            className="px-6 py-2.5 md:py-3 bg-gradient-to-r from-brand-indigo to-brand-purple text-white text-sm md:text-base font-bold rounded-lg flex items-center space-x-2 transition-all hover:shadow-xl w-fit whitespace-nowrap"
                          >
                            <span>Match</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
