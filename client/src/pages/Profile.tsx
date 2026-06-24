import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, MapPin, Save, Target, User } from "lucide-react";
import { API_BASE_URL } from "../config";
import { useAppStore } from "../store";

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, setSession, logout } = useAppStore();
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    state: "",
    district: "",
    category: "",
    intermediateStream: "",
    marks: "",
    rank: "",
    interests: "",
    careerGoals: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.profile.fullName || "",
      gender: user.profile.gender || "",
      state: user.profile.state || "",
      district: user.profile.district || "",
      category: user.profile.category || "",
      intermediateStream: user.profile.intermediateStream || "",
      marks: user.profile.marks?.toString() || "",
      rank: user.profile.rank?.toString() || "",
      interests: user.profile.interests.join(", "),
      careerGoals: user.profile.careerGoals.join(", "),
    });
  }, [user]);

  if (!user || !token) return <Navigate to="/login" replace />;

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setStatus("Saving...");
    const payload = {
      token,
      ...form,
      interests: form.interests.split(",").map((item) => item.trim()).filter(Boolean),
      careerGoals: form.careerGoals.split(",").map((item) => item.trim()).filter(Boolean),
    };
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Profile update failed.");
      setSession(data.user, data.token);
      setStatus("Profile saved.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const inputClass = "w-full h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-sm outline-none focus:ring-2 focus:ring-brand-indigo";
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2";

  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-6 lg:px-8 py-16 w-full bg-slate-50 dark:bg-dark-bg transition-colors">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center shadow-sm">
            <User className="h-6 w-6 text-brand-indigo" />
          </div>
          <div>
            <h1 className="text-h2 text-slate-900 dark:text-white">Profile</h1>
            <p className="text-base text-slate-400 mt-1">Keep your details current for better predictions and scholarship matching.</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="h-11 px-5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 text-sm font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border h-fit lg:sticky lg:top-24">
          <div className="h-16 w-16 rounded-2xl bg-brand-indigo text-white flex items-center justify-center text-2xl font-black mb-4">
            {form.fullName.trim().charAt(0).toUpperCase() || "E"}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{form.fullName || "Student Profile"}</h2>
          <p className="text-sm text-slate-400 mt-1">{user.email || user.mobileNumber || "EDUTech learner"}</p>

          <div className="space-y-3 mt-6 text-sm">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <GraduationCap className="h-4 w-4 text-brand-indigo" />
              <span>{form.intermediateStream || "Stream not set"}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <MapPin className="h-4 w-4 text-brand-indigo" />
              <span>{[form.district, form.state].filter(Boolean).join(", ") || "Location not set"}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <Target className="h-4 w-4 text-brand-indigo" />
              <span>{form.rank ? `Rank ${form.rank}` : "Rank not set"}</span>
            </div>
          </div>
        </aside>

        <form onSubmit={saveProfile} className="lg:col-span-3 glass-card p-6 md:p-8 rounded-3xl border border-slate-200/50 dark:border-dark-border">
          <div className="mb-8">
            <h2 className="text-h4 text-slate-900 dark:text-white">Personal Details</h2>
            <p className="text-sm text-slate-400 mt-1">These values are used across profile, predictor, and scholarship pages.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Full Name</label>
              <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputClass} placeholder="Your full name" />
            </div>

            <div>
              <label className={labelClass}>Gender</label>
              <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className={inputClass}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)} className={inputClass}>
                <option value="">Select category</option>
                {["OC", "OBC", "SC", "ST", "EWS"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>State</label>
              <select value={form.state} onChange={(e) => update("state", e.target.value)} className={inputClass}>
                <option value="">Select state</option>
                {["Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Maharashtra", "Kerala"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>District</label>
              <input value={form.district} onChange={(e) => update("district", e.target.value)} className={inputClass} placeholder="Hyderabad" />
            </div>
          </div>

          <div className="my-8 border-t border-slate-200 dark:border-slate-800" />

          <div className="mb-6">
            <h2 className="text-h4 text-slate-900 dark:text-white">Academic Profile</h2>
            <p className="text-sm text-slate-400 mt-1">Better academic data gives sharper college predictions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Intermediate Stream</label>
              <select value={form.intermediateStream} onChange={(e) => update("intermediateStream", e.target.value)} className={inputClass}>
                <option value="">Select stream</option>
                {["MPC", "BiPC", "MEC", "CEC", "HEC"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Marks</label>
              <input type="number" min="0" step="0.01" value={form.marks} onChange={(e) => update("marks", e.target.value)} className={inputClass} placeholder="92.5" />
            </div>

            <div>
              <label className={labelClass}>Entrance Rank</label>
              <input type="number" min="1" value={form.rank} onChange={(e) => update("rank", e.target.value)} className={inputClass} placeholder="4500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div>
              <label className={labelClass}>Interests</label>
              <textarea value={form.interests} onChange={(e) => update("interests", e.target.value)} className="w-full min-h-28 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-indigo resize-none" placeholder="Programming, Robotics, Biology" />
              <p className="text-xs text-slate-400 mt-2">Separate multiple interests with commas.</p>
            </div>

            <div>
              <label className={labelClass}>Career Goals</label>
              <textarea value={form.careerGoals} onChange={(e) => update("careerGoals", e.target.value)} className="w-full min-h-28 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-indigo resize-none" placeholder="Software Engineer, Doctor, Chartered Accountant" />
              <p className="text-xs text-slate-400 mt-2">These goals help the counselor recommend roadmaps.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-8">
            <button disabled={saving} className="h-11 px-5 rounded-xl bg-brand-indigo text-white text-sm font-bold hover:bg-brand-purple disabled:opacity-60 flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {status && <span className="text-sm text-slate-500 dark:text-slate-400">{status}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
