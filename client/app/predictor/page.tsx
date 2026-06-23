"use client";

import { useState } from "react";
import { useAppStore } from "../store";
import { Sparkles, RefreshCw, BarChart2, CheckCircle, HelpCircle, ArrowRight, ShieldCheck, Plus, Check } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { API_BASE_URL } from "../config";

export default function Predictor() {
  const { user, compareColleges, addCompare, removeCompare } = useAppStore();

  // Inputs
  const [rank, setRank] = useState(user?.profile.rank?.toString() || "");
  const [category, setCategory] = useState(user?.profile.category || "OC");
  const [gender, setGender] = useState(user?.profile.gender || "Co-Education");
  const [state, setState] = useState(user?.profile.state || "Telangana");
  const [stream, setStream] = useState(user?.profile.intermediateStream || "MPC");
  const [branch, setBranch] = useState("");

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"safe" | "moderate" | "dream">("safe");
  const [expandedCollege, setExpandedCollege] = useState<string | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResults(null);

    const rankNum = parseInt(rank);
    if (isNaN(rankNum) || rankNum <= 0) {
      setError("Please input a valid positive rank.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/predictor/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rank: rankNum,
          category,
          gender,
          state,
          stream,
          branch,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to calculate predictions.");

      setResults(data);
      // Select best tab based on results
      if (data.safe.length > 0) setActiveTab("safe");
      else if (data.moderate.length > 0) setActiveTab("moderate");
      else if (data.dream.length > 0) setActiveTab("dream");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (prob >= 50) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative w-full">
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-brand-indigo/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-brand-indigo shadow-sm">
          <Sparkles className="h-6 w-6 text-brand-indigo" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Admission College Predictor
          </h1>
          <p className="text-sm text-slate-400">Predict college chances instantly based on your exam rank & criteria</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Panel */}
        <div className="glass-card p-6 rounded-3xl h-fit">
          <h3 className="text-base font-bold mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <span>Query Parameters</span>
            <button
              onClick={() => {
                setRank("");
                setBranch("");
                setResults(null);
              }}
              className="text-xs text-slate-400 hover:text-brand-indigo flex items-center space-x-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </h3>

          <form onSubmit={handlePredict} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Intermediate Stream</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-3.5 text-xs focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="MPC">MPC (Engineering/B.Tech)</option>
                <option value="BiPC">BiPC (Medical/MBBS/Pharma)</option>
                <option value="MEC">MEC (BBA/B.Com)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Entrance Exam Rank</label>
              <input
                type="number"
                placeholder="Enter EAPCET/NEET/JEE Rank"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-3.5 text-xs focus:ring-2 focus:ring-brand-indigo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
                >
                  <option value="OC">OC (General)</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
                >
                  <option value="Co-Education">Co-Education</option>
                  <option value="Female">Female (Girls quota)</option>
                  <option value="Male">Male</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">State Preference</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-3.5 text-xs focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Preferred Branch (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Computer Science, MBBS"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-3.5 text-xs focus:ring-2 focus:ring-brand-indigo"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-semibold">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-indigo via-brand-blue to-brand-purple text-white rounded-xl font-bold text-sm hover:shadow-lg shadow-brand-indigo/15 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{loading ? "Computing Odds..." : "Evaluate Chances"}</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>

        {/* Right Column: Prediction results */}
        <div className="lg:col-span-2 space-y-6">
          {!results && !loading && (
            <div className="glass-card p-12 text-center rounded-3xl flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-950/40 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-dashed border-slate-200">
                <BarChart2 className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-base mb-1">No Results Calculated</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Enter your stream, category, and exam rank in the left panel to calculate admission probability and view matched colleges.
              </p>
            </div>
          )}

          {loading && (
            <div className="glass-card p-12 text-center rounded-3xl flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="animate-spin h-8 w-8 border-4 border-brand-indigo border-t-transparent rounded-full mb-4" />
              <h3 className="font-semibold text-sm">Evaluating historical parameters...</h3>
              <p className="text-xs text-slate-400">Comparing ranks against 2023, 2024 & 2025 counseling cycles.</p>
            </div>
          )}

          {results && !loading && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Tab Selector */}
              <div className="flex bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-1 rounded-2xl">
                {([
                  { id: "safe", label: "SAFE Colleges", count: results.safe.length, color: "text-emerald-500" },
                  { id: "moderate", label: "MODERATE Colleges", count: results.moderate.length, color: "text-yellow-500" },
                  { id: "dream", label: "DREAM Colleges", count: results.dream.length, color: "text-indigo-500" },
                ] as const).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setExpandedCollege(null);
                    }}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                      activeTab === tab.id
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="ml-1.5 px-2 py-0.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-full text-[10px] font-extrabold">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* List of matched items */}
              <div className="space-y-4">
                {results[activeTab].length === 0 ? (
                  <div className="glass-card p-12 text-center rounded-3xl">
                    <p className="text-sm text-slate-400">No colleges matched in this tier category.</p>
                  </div>
                ) : (
                  results[activeTab].map((col: any) => {
                    const isExpanded = expandedCollege === col.collegeId + col.courseName;
                    const isAdded = compareColleges.includes(col.collegeId);
                    return (
                      <div
                        key={col.collegeId + col.courseName}
                        className="glass-card rounded-3xl border border-slate-200/50 dark:border-dark-border overflow-hidden transition-all duration-300 hover:shadow-md"
                      >
                        <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          
                          {/* Left: College branding */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold px-2 py-1 bg-brand-indigo/10 text-brand-indigo dark:text-indigo-300 rounded font-semibold uppercase">
                              {col.courseName}
                            </span>
                            <h4 className="font-extrabold text-base leading-snug">{col.collegeName}</h4>
                            <div className="text-xs text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                              <span>📍 {col.location}, {col.state}</span>
                              {col.nirfRank && <span>🏆 NIRF: #{col.nirfRank}</span>}
                              {col.accreditation && <span>🏅 {col.accreditation}</span>}
                            </div>
                          </div>

                          {/* Right: Probability widget + comparison */}
                          <div className="flex items-center justify-between sm:justify-end space-x-6">
                            
                            {/* Prob indicator */}
                            <div className="text-right">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${getProbabilityColor(col.probability)}`}>
                                {col.probability}% Probability
                              </span>
                              <div className="text-[10px] text-slate-400 mt-1">Admission Chance</div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                              {isAdded ? (
                                <button
                                  onClick={() => removeCompare(col.collegeId)}
                                  className="p-2 border border-emerald-500 text-emerald-500 rounded-xl hover:bg-emerald-50/10 bg-emerald-500/5 transition-colors"
                                  title="Remove from comparison"
                                >
                                  <Check className="h-4.5 w-4.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => addCompare(col.collegeId)}
                                  className="p-2 border border-slate-200 dark:border-slate-700 hover:border-brand-indigo hover:text-brand-indigo text-slate-500 dark:text-slate-400 rounded-xl transition-colors"
                                  title="Add to comparison"
                                >
                                  <Plus className="h-4.5 w-4.5" />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  setExpandedCollege(isExpanded ? null : col.collegeId + col.courseName)
                                }
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                              >
                                {isExpanded ? "Collapse" : "Trends"}
                              </button>
                            </div>

                          </div>
                        </div>

                        {/* Collapsible Recharts Area */}
                        {isExpanded && (
                          <div className="px-6 pb-6 pt-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-150 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-200">
                            <div>
                              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Historical Cutoff trend
                              </h5>
                              <div className="h-48 w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={col.cutoffTrends}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#22304d" opacity={0.3} />
                                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                                    <YAxis stroke="#94a3b8" fontSize={11} />
                                    <Tooltip
                                      contentStyle={{
                                        backgroundColor: "#131b2e",
                                        borderColor: "#1e293b",
                                        borderRadius: "8px",
                                        color: "#f8fafc",
                                      }}
                                    />
                                    <Line
                                      type="monotone"
                                      dataKey="cutoff"
                                      stroke="#4f46e5"
                                      strokeWidth={2}
                                      activeDot={{ r: 6 }}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement insights</h5>
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-white dark:bg-dark-card p-3 border border-slate-200/50 dark:border-dark-border rounded-xl">
                                  <div className="text-slate-400">Avg Salary</div>
                                  <div className="text-sm font-bold text-slate-850 dark:text-white mt-0.5">{col.avgPackage} LPA</div>
                                </div>
                                <div className="bg-white dark:bg-dark-card p-3 border border-slate-200/50 dark:border-dark-border rounded-xl">
                                  <div className="text-slate-400">Highest Salary</div>
                                  <div className="text-sm font-bold text-indigo-500 mt-0.5">{col.highestPackage} LPA</div>
                                </div>
                                <div className="bg-white dark:bg-dark-card p-3 border border-slate-200/50 dark:border-dark-border rounded-xl">
                                  <div className="text-slate-400">Placement %</div>
                                  <div className="text-sm font-bold text-slate-850 dark:text-white mt-0.5">{col.placementPct}%</div>
                                </div>
                                <div className="bg-white dark:bg-dark-card p-3 border border-slate-200/50 dark:border-dark-border rounded-xl">
                                  <div className="text-slate-400">Yearly Fees</div>
                                  <div className="text-sm font-bold text-slate-855 mt-0.5 truncate">{col.feesRange}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
