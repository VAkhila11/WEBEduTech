"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "../store";
import { Award, DollarSign, Calendar, Search, Filter, ShieldCheck, CheckCircle2, ChevronRight, X } from "lucide-react";
import { API_BASE_URL } from "../config";

interface Scholarship {
  id: string;
  name: string;
  providerType: string;
  providerName: string;
  amount: number;
  eligibility: string;
  description: string;
  deadline: string;
  state?: string;
  categoryCheck: string[];
  genderCheck: string;
  minIncome?: number;
}

export default function Scholarships() {
  const { user } = useAppStore();

  // Filters
  const [category, setCategory] = useState(user?.profile.category || "OC");
  const [gender, setGender] = useState(user?.profile.gender || "All");
  const [income, setIncome] = useState("");
  const [state, setState] = useState(user?.profile.state || "Telangana");

  // States
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [matchedList, setMatchedList] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);
  const [successApply, setSuccessApply] = useState<string | null>(null);

  // Load all scholarships initially
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/scholarships`)
      .then((res) => res.json())
      .then((data) => {
        setScholarships(data);
        setMatchedList(data); // Show all by default
      })
      .catch((err) => console.error("Error loading scholarships:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeVal = income ? parseFloat(income) : Infinity;

    // Run client side matching engine logic
    const matched = scholarships.filter((s) => {
      // 1. Domicile state check (if specific)
      if (s.state && s.state.toLowerCase() !== state.toLowerCase()) return false;
      // 2. Category check
      if (s.categoryCheck && s.categoryCheck.length > 0 && !s.categoryCheck.includes(category)) return false;
      // 3. Gender check
      if (s.genderCheck !== "All" && gender !== "All" && s.genderCheck !== gender) return false;
      // 4. Income check
      if (s.minIncome && incomeVal > s.minIncome) return false;

      return true;
    });

    setMatchedList(matched);
  };

  const handleApply = (name: string) => {
    setSuccessApply(name);
    setTimeout(() => setSuccessApply(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full relative">
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-brand-purple/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-brand-indigo">
          <Award className="h-6 w-6 text-brand-indigo" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Scholarships Hub</h1>
          <p className="text-sm text-slate-400">Match and apply for state government & private welfare scholarships</p>
        </div>
      </div>

      {successApply && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-2xl shadow-xl flex items-center space-x-2 font-semibold text-xs animate-in slide-in-from-right-4 duration-300">
          <CheckCircle2 className="h-4.5 w-4.5" />
          <span>Application successfully submitted for {successApply}!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Matching engine parameters */}
        <div className="glass-card p-6 rounded-3xl h-fit">
          <h3 className="text-base font-bold mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center space-x-2">
            <Filter className="h-4 w-4 text-brand-indigo" />
            <span>Matching Engine</span>
          </h3>

          <form onSubmit={handleMatch} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Domicile State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Caste Category</label>
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
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="All">All Genders</option>
                <option value="Girls">Girls Only</option>
                <option value="Boys">Boys Only</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Annual Family Income (Max)</label>
              <input
                type="number"
                placeholder="e.g. 200000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-brand-indigo to-brand-purple text-white font-bold rounded-xl text-xs hover:shadow-lg shadow-brand-indigo/15 transition-all flex items-center justify-center space-x-1 hover:-translate-y-0.5"
            >
              <Search className="h-4 w-4" />
              <span>Evaluate Matches</span>
            </button>
          </form>
        </div>

        {/* Right Column: Listing results */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-brand-indigo border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-xs text-slate-400">Loading catalog...</p>
            </div>
          ) : matchedList.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-3xl">
              <p className="text-sm text-slate-400">No scholarships matched your profile constraints.</p>
            </div>
          ) : (
            matchedList.map((sch) => (
              <div
                key={sch.id}
                className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all duration-300 hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-purple/10 text-brand-purple rounded">
                      {sch.providerType}
                    </span>
                    {sch.state && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                        📍 {sch.state}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base leading-snug">{sch.name}</h3>
                  <p className="text-xs text-slate-400">Provided by: {sch.providerName}</p>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg pt-1">
                    {sch.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                    <span className="flex items-center text-brand-indigo">
                      <DollarSign className="h-4 w-4 mr-0.5" />
                      Amount: <b>₹{sch.amount.toLocaleString("en-IN")}</b>
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-slate-400" />
                      Deadline: {new Date(sch.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center">
                  <button
                    onClick={() => handleApply(sch.name)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-brand-indigo to-brand-blue hover:shadow-lg shadow-brand-indigo/15 text-white text-xs font-bold rounded-xl transition-all hover:-translate-y-0.5"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
