import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Activity, BarChart3, Database, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { API_BASE_URL } from "../config";
import { useAppStore } from "../store";

interface Analytics {
  summary: {
    totalUsers: number;
    predictorUses: number;
    counselorQueries: number;
    matchingScholarships: number;
  };
  trafficTrend: { name: string; visitors: number; pageviews: number }[];
  popularCourses: { name: string; value: number }[];
}

export default function Admin() {
  const user = useAppStore((state) => state.user);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/analytics`)
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error("Failed to load analytics:", err));
  }, []);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  const uploadSample = async () => {
    setUploadStatus("Uploading...");
    const response = await fetch(`${API_BASE_URL}/admin/upload-predictor-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [{ college: "Sample College", course: "B.Tech CSE", cutoff: 4500 }] }),
    });
    const data = await response.json();
    setUploadStatus(data.message || "Upload complete.");
  };

  const cards = analytics ? [
    { label: "Users", value: analytics.summary.totalUsers, icon: Users },
    { label: "Predictor Uses", value: analytics.summary.predictorUses, icon: Activity },
    { label: "AI Queries", value: analytics.summary.counselorQueries, icon: BarChart3 },
    { label: "Scholarships", value: analytics.summary.matchingScholarships, icon: Database },
  ] : [];

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-16 w-full page-wrapper bg-slate-50 dark:bg-dark-bg transition-colors">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center shadow-sm">
          <BarChart3 className="h-6 w-6 text-brand-indigo" />
        </div>
        <div>
          <h1 className="text-h2 text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">System analytics and predictor data maintenance.</p>
        </div>
      </div>

      {!analytics ? (
        <div className="text-center py-24"><div className="animate-spin h-8 w-8 border-4 border-brand-indigo border-t-transparent rounded-full mx-auto mb-4" /><p className="text-xs text-slate-400">Loading analytics...</p></div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border">
                  <Icon className="h-5 w-5 text-brand-indigo mb-4" />
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">{card.label}</p>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{card.value.toLocaleString("en-IN")}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border">
              <h2 className="text-h4 text-slate-900 dark:text-white mb-6">Traffic Trend</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.trafficTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visitors" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="pageviews" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border">
              <h2 className="text-h4 text-slate-900 dark:text-white mb-6">Popular Courses</h2>
              <div className="space-y-4">
                {analytics.popularCourses.map((course) => (
                  <div key={course.name}>
                    <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-slate-700 dark:text-slate-200">{course.name}</span><span className="text-slate-400">{course.value}</span></div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-brand-indigo" style={{ width: `${Math.min(100, course.value / 5)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={uploadSample} className="mt-8 h-11 px-5 rounded-xl bg-brand-indigo text-white text-sm font-bold hover:bg-brand-purple">Upload Sample Predictor Data</button>
              {uploadStatus && <p className="text-sm text-slate-400 mt-3">{uploadStatus}</p>}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
