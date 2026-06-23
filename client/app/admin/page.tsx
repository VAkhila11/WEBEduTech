"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "../store";
import { ShieldAlert, BarChart2, Users, FileSpreadsheet, Activity, Sparkles, Upload, FileText, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from "recharts";
import { API_BASE_URL } from "../config";

interface AnalyticsData {
  summary: {
    totalUsers: number;
    predictorUses: number;
    counselorQueries: number;
    matchingScholarships: number;
  };
  trafficTrend: any[];
  popularCourses: any[];
  predictorTrends: any[];
}

export default function Admin() {
  const router = useRouter();
  const { user } = useAppStore();

  // States
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [csvContent, setCsvContent] = useState("");

  // Validate admin access
  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [user]);

  // Load analytics
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/analytics`)
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error("Error loading analytics:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!user || user.role !== "admin") return null;

  const handleCsvUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent.trim()) return;

    // Simulate calling /api/admin/upload-predictor-data
    fetch(`${API_BASE_URL}/admin/upload-predictor-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: csvContent.split("\n").map((line) => line.split(",")),
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        setUploadSuccess(`Cutoffs uploaded successfully! Processed ${resData.processedCount} records.`);
        setCsvContent("");
        setTimeout(() => setUploadSuccess(""), 4000);
      });
  };

  const COLORS = ["#4f46e5", "#2563eb", "#7c3aed", "#ec4899", "#10b981"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full relative">
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 bg-rose-50 dark:bg-rose-950/20 rounded-2xl flex items-center justify-center text-rose-500">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Super Admin Panel</h1>
          <p className="text-sm text-slate-400">System overview, database updates & platform analytics</p>
        </div>
      </div>

      {loading || !data ? (
        <div className="text-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-xs text-slate-400">Loading admin parameters...</p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-dark-border">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                <Users className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="text-2xl font-extrabold mt-2">{data.summary.totalUsers}</div>
              <div className="text-[10px] text-emerald-500 mt-1">▲ 12% from last week</div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-dark-border">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Predictor Uses</span>
                <BarChart2 className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-extrabold mt-2">{data.summary.predictorUses}</div>
              <div className="text-[10px] text-indigo-500 mt-1">Active evaluation rounds</div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-dark-border">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Counselor Queries</span>
                <Activity className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-2xl font-extrabold mt-2">{data.summary.counselorQueries}</div>
              <div className="text-[10px] text-purple-500 mt-1">AI roadmap completions</div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-dark-border">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Scholarships</span>
                <FileText className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="text-2xl font-extrabold mt-2">{data.summary.matchingScholarships}</div>
              <div className="text-[10px] text-emerald-500 mt-1">Private & Govt entries</div>
            </div>

          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Traffic Trend */}
            <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border">
              <h3 className="text-sm font-bold text-slate-450 uppercase mb-4">Visitor Traffic Trend (Daily)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.trafficTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#22304d" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#131b2e", borderColor: "#1e293b", color: "#f8fafc" }} />
                    <Line type="monotone" dataKey="visitors" stroke="#4f46e5" strokeWidth={2} />
                    <Line type="monotone" dataKey="pageviews" stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular Courses */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border">
              <h3 className="text-sm font-bold text-slate-450 uppercase mb-4">Course Searches</h3>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.popularCourses}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {data.popularCourses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                {data.popularCourses.map((c, index) => (
                  <div key={c.name} className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="truncate">{c.name} ({c.value})</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Database upload & controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Cutoff Upload */}
            <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border">
              <h3 className="text-sm font-bold flex items-center space-x-1.5 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Upload className="h-4.5 w-4.5 text-rose-500" />
                <span>Upload Predictor Cutoffs (.CSV / Raw)</span>
              </h3>

              {uploadSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center space-x-1 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              <form onSubmit={handleCsvUpload} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Format: <code>CollegeName, CourseName, CasteCategory, CutoffRank, Gender, StateQuota</code>
                </p>
                <textarea
                  placeholder="JNTUH, B.Tech CSE, OC, 1200, Co-Education, State Quota&#10;Vasavi, B.Tech CSE, OBC, 3800, Co-Education, State Quota"
                  rows={4}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-2.5 px-3.5 text-xs focus:ring-2 focus:ring-brand-indigo font-mono resize-none"
                />
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-gradient-to-r from-rose-500 to-indigo-600 text-white rounded-xl text-xs font-bold hover:shadow transition-all"
                >
                  Parse & Insert Records
                </button>
              </form>
            </div>

            {/* Demographics Bar Chart */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border">
              <h3 className="text-sm font-bold text-slate-455 uppercase mb-4">Predictor Demographics</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.predictorTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#22304d" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#7c3aed" radius={[4, 4, 0, 0]}>
                      {data.predictorTrends.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
