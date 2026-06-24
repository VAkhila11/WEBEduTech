import { useEffect, useMemo, useState } from "react";
import { Award, CalendarDays, Filter, IndianRupee } from "lucide-react";
import { API_BASE_URL } from "../config";
import { defaultStudentProfile } from "../lib/defaultStudentProfile";
import { useAppStore } from "../store";

interface Scholarship {
  id: string;
  name: string;
  providerType: string;
  providerName: string;
  amount: number;
  eligibility: string;
  description: string;
  deadline?: string;
  state?: string;
  categoryCheck: string[];
  genderCheck?: string;
  minIncome?: number;
}

export default function Scholarships() {
  const user = useAppStore((state) => state.user);
  const activeProfile = user?.profile || defaultStudentProfile;
  const [items, setItems] = useState<Scholarship[]>([]);
  const [category, setCategory] = useState(activeProfile.category || "");
  const [stateFilter, setStateFilter] = useState(activeProfile.state || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/scholarships`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Failed to load scholarships:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const categoryMatch = !category || item.categoryCheck.includes("All") || item.categoryCheck.includes(category);
      const stateMatch = !stateFilter || !item.state || item.state === "All India" || item.state.toLowerCase() === stateFilter.toLowerCase();
      return categoryMatch && stateMatch;
    });
  }, [category, items, stateFilter]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-16 w-full page-wrapper bg-slate-50 dark:bg-dark-bg transition-colors">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center shadow-sm">
            <Award className="h-6 w-6 text-brand-indigo" />
          </div>
          <div>
            <h1 className="text-h2 text-slate-900 dark:text-white">Scholarship Matching Hub</h1>
            <p className="text-sm text-slate-400 mt-1">Find government and private scholarships from your profile details.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="glass-card p-6 rounded-3xl h-fit space-y-5">
          <h2 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Filter className="h-4 w-4" />
            Matching Filters
          </h2>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm outline-none">
              <option value="">All Categories</option>
              {["OC", "OBC", "SC", "ST", "EWS"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">State</label>
            <input value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm outline-none" placeholder="Telangana" />
          </div>
          <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 p-4 text-xs text-slate-500 dark:text-slate-400">
            Signed-in profiles prefill these filters from `Profile.category` and `Profile.state`.
          </div>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-24"><div className="animate-spin h-8 w-8 border-4 border-brand-indigo border-t-transparent rounded-full mx-auto mb-4" /><p className="text-xs text-slate-400">Loading scholarships...</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((item) => (
                <div key={item.id} className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-brand-indigo text-xs font-bold">{item.providerType}</span>
                      <span className="flex items-center gap-1 text-sm font-extrabold text-emerald-600"><IndianRupee className="h-4 w-4" />{item.amount.toLocaleString("en-IN")}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">{item.name}</h3>
                    <p className="text-xs text-slate-400 mb-4">{item.providerName}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{item.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.eligibility}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-6 text-xs">
                    {item.deadline && <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/60"><CalendarDays className="h-3.5 w-3.5" />{new Date(item.deadline).toLocaleDateString()}</span>}
                    <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/60">{item.state || "All India"}</span>
                    <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/60">{item.categoryCheck.join(", ")}</span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div className="glass-card p-10 rounded-3xl text-sm text-slate-400">No scholarships matched the selected filters.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
