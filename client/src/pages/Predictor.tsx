import { useState } from "react";
import { Sparkles, TrendingUp } from "lucide-react";
import { API_BASE_URL } from "../config";
import { defaultStudentProfile } from "../lib/defaultStudentProfile";
import { useAppStore } from "../store";

interface PredictionResult {
  collegeId: string;
  collegeName: string;
  location: string;
  state: string;
  feesRange: string;
  rating: number;
  accreditation?: string;
  placementPct?: number;
  avgPackage?: number;
  courseName: string;
  cutoff: number;
  probability: number;
}

interface PredictionGroups {
  safe: PredictionResult[];
  moderate: PredictionResult[];
  dream: PredictionResult[];
}

const categories = ["OC", "OBC", "SC", "ST", "EWS"];
const streams = ["MPC", "BiPC", "MEC", "CEC", "HEC"];

export default function Predictor() {
  const user = useAppStore((state) => state.user);
  const activeProfile = user?.profile || defaultStudentProfile;
  const [rank, setRank] = useState(activeProfile.rank?.toString() || "");
  const [category, setCategory] = useState(activeProfile.category || "OC");
  const [gender, setGender] = useState(activeProfile.gender || "Co-Education");
  const [stream, setStream] = useState(activeProfile.intermediateStream || "MPC");
  const [branch, setBranch] = useState("");
  const [results, setResults] = useState<PredictionGroups | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runPrediction = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/predictor/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rank, category, gender, stream, branch }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Prediction failed.");
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const sections: { key: keyof PredictionGroups; label: string; tone: string }[] = [
    { key: "safe", label: "Safe Matches", tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
    { key: "moderate", label: "Moderate Chances", tone: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
    { key: "dream", label: "Dream Options", tone: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-16 w-full page-wrapper bg-slate-50 dark:bg-dark-bg transition-colors">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center shadow-sm">
          <Sparkles className="h-6 w-6 text-brand-indigo" />
        </div>
        <div>
          <h1 className="text-h2 text-slate-900 dark:text-white">College Predictor</h1>
          <p className="text-sm text-slate-400 mt-1">Estimate admission chances from rank, category, stream, and branch preference.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="glass-card p-6 rounded-3xl h-fit space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Entrance Rank</label>
            <input value={rank} onChange={(e) => setRank(e.target.value)} type="number" min="1" className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-indigo" placeholder="Example: 4500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm outline-none">
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stream</label>
              <select value={stream} onChange={(e) => setStream(e.target.value)} className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm outline-none">
                {streams.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm outline-none">
              <option>Co-Education</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Branch Keyword</label>
            <input value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-indigo" placeholder="CSE, ECE, MBBS..." />
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <button onClick={runPrediction} disabled={loading} className="w-full h-11 rounded-xl bg-brand-indigo text-white text-sm font-bold hover:bg-brand-purple disabled:opacity-60 transition-colors">
            {loading ? "Predicting..." : "Predict Colleges"}
          </button>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {!results ? (
            <div className="glass-card p-12 rounded-3xl text-center">
              <TrendingUp className="h-10 w-10 mx-auto text-brand-indigo mb-4" />
              <h2 className="text-h4 text-slate-900 dark:text-white">Run a prediction to see ranked matches</h2>
              <p className="text-sm text-slate-400 mt-2">Results are grouped into safe, moderate, and dream options from cutoff data.</p>
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.key}>
                <h2 className="text-h4 text-slate-900 dark:text-white mb-4">{section.label}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results[section.key].length === 0 ? (
                    <div className="glass-card p-6 rounded-3xl text-sm text-slate-400">No matches found in this band.</div>
                  ) : results[section.key].map((item) => (
                    <div key={`${section.key}-${item.collegeId}-${item.courseName}`} className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{item.collegeName}</h3>
                          <p className="text-xs text-slate-400 mt-1">{item.location}, {item.state}</p>
                        </div>
                        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${section.tone}`}>{item.probability}%</span>
                      </div>
                      <p className="text-sm font-semibold text-brand-indigo dark:text-indigo-400 mb-4">{item.courseName}</p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-white/70 dark:bg-slate-900/60 rounded-xl p-3"><span className="text-slate-400 block">Cutoff</span><b>{item.cutoff}</b></div>
                        <div className="bg-white/70 dark:bg-slate-900/60 rounded-xl p-3"><span className="text-slate-400 block">Fees</span><b>{item.feesRange}</b></div>
                        <div className="bg-white/70 dark:bg-slate-900/60 rounded-xl p-3"><span className="text-slate-400 block">Rating</span><b>{item.rating}</b></div>
                        <div className="bg-white/70 dark:bg-slate-900/60 rounded-xl p-3"><span className="text-slate-400 block">Avg Package</span><b>{item.avgPackage ? `${item.avgPackage} LPA` : "N/A"}</b></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
