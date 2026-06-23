"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "../store";
import { User, Award, CheckCircle, ChevronRight, Save, Settings, Shield } from "lucide-react";
import { API_BASE_URL } from "../config";

export default function Profile() {
  const router = useRouter();
  const { user, token, setSession } = useAppStore();

  // Redirect if offline/not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  // States
  const [fullName, setFullName] = useState(user?.profile.fullName || "");
  const [gender, setGender] = useState(user?.profile.gender || "Male");
  const [state, setState] = useState(user?.profile.state || "Telangana");
  const [district, setDistrict] = useState(user?.profile.district || "");
  const [category, setCategory] = useState(user?.profile.category || "OC");
  const [intermediateStream, setIntermediateStream] = useState(user?.profile.intermediateStream || "MPC");
  const [marks, setMarks] = useState(user?.profile.marks?.toString() || "");
  const [rank, setRank] = useState(user?.profile.rank?.toString() || "");
  const [interests, setInterests] = useState<string[]>(user?.profile.interests || []);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          fullName,
          gender,
          state,
          district,
          category,
          intermediateStream,
          marks,
          rank,
          interests,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile.");

      setSession(data.user, data.token);
      setSuccess("Profile settings updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const availableInterests = [
    "Programming",
    "Robotics",
    "Medical Research",
    "Clinical Medicine",
    "Business Management",
    "Banking & Finance",
    "Corporate Law",
    "Public Administration",
    "Data Science",
    "Semiconductor VLSI",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-brand-indigo">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-sm text-slate-400">Manage your educational metrics and academic streams</p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm flex items-center space-x-2 font-semibold">
          <CheckCircle className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Card: Summary */}
        <div className="glass-card p-6 rounded-3xl h-fit space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-brand-indigo/10 text-brand-indigo font-bold flex items-center justify-center">
              {fullName[0]}
            </div>
            <div>
              <h3 className="font-bold text-base">{fullName}</h3>
              <p className="text-xs text-slate-400">{user.email || user.mobileNumber}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Account Type:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span>Inter Stream:</span>
              <span className="font-bold text-brand-indigo">{intermediateStream}</span>
            </div>
            <div className="flex justify-between">
              <span>Category:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{category}</span>
            </div>
            <div className="flex justify-between">
              <span>Target Ranks:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {rank ? `#${rank}` : "Not Set"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Form: Editors */}
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl">
          <form onSubmit={handleUpdate} className="space-y-6">
            <h3 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-3">
              Profile Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-4 text-sm focus:ring-2 focus:ring-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Domicile State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-4 text-sm focus:ring-2 focus:ring-brand-indigo"
                >
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Kerala">Kerala</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Intermediate Stream</label>
                <select
                  value={intermediateStream}
                  onChange={(e) => setIntermediateStream(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3.5 px-4 text-sm focus:ring-2 focus:ring-brand-indigo"
                >
                  <option value="MPC">MPC (Maths, Physics, Chem)</option>
                  <option value="BiPC">BiPC (Biology, Physics, Chem)</option>
                  <option value="MEC">MEC (Maths, Econ, Commerce)</option>
                  <option value="CEC">CEC (Civics, Econ, Commerce)</option>
                  <option value="HEC">HEC (History, Econ, Civics)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-4 text-sm focus:ring-2 focus:ring-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Class 12 Marks (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 92.4"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-4 text-sm focus:ring-2 focus:ring-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Entrance Exam Rank</label>
                <input
                  type="number"
                  placeholder="e.g. 4500"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-4 text-sm focus:ring-2 focus:ring-brand-indigo"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Academic & Career Interests</label>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const isSelected = interests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`text-xs px-3 py-2 rounded-full border transition-all ${
                        isSelected
                          ? "bg-brand-indigo text-white border-brand-indigo font-semibold"
                          : "border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-indigo to-brand-blue text-white rounded-xl font-bold text-sm hover:shadow-lg shadow-brand-indigo/15 flex items-center justify-center space-x-2 hover:-translate-y-0.5 transition-all"
            >
              <Save className="h-4.5 w-4.5" />
              <span>{loading ? "Saving Changes..." : "Save Profile Settings"}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
