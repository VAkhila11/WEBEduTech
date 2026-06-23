"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "../store";
import { User, Mail, Lock, Phone, Compass, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { API_BASE_URL } from "../config";

export default function Signup() {
  const router = useRouter();
  const setSession = useAppStore((state) => state.setSession);

  // States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("Male");
  const [state, setState] = useState("Telangana");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("OC");
  const [intermediateStream, setIntermediateStream] = useState("MPC");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          mobileNumber,
          password,
          gender,
          state,
          district,
          category,
          intermediateStream,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register.");

      setSession(data.user, data.token);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 relative">
      <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-brand-indigo/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-brand-purple/5 blur-[90px] pointer-events-none" />

      <div className="glass-card max-w-lg w-full p-8 rounded-3xl shadow-2xl relative border border-slate-200/50 dark:border-slate-800">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-indigo via-brand-blue to-brand-purple items-center justify-center text-white font-bold text-lg mb-3 shadow">
            E
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Get custom cutoff predictions & roadmap plans</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-brand-indigo transition-all">
                <User className="h-4 w-4 text-slate-400 ml-3 absolute pointer-events-none" />
                <input
                  type="text"
                  placeholder="Rahul Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none py-3 pl-10 pr-3 text-xs"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-brand-indigo transition-all">
                <Mail className="h-4 w-4 text-slate-400 ml-3 absolute pointer-events-none" />
                <input
                  type="email"
                  placeholder="rahul@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none py-3 pl-10 pr-3 text-xs"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mobile Number</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-brand-indigo transition-all">
                <Phone className="h-4 w-4 text-slate-400 ml-3 absolute pointer-events-none" />
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none py-3 pl-10 pr-3 text-xs"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-brand-indigo transition-all">
                <Lock className="h-4 w-4 text-slate-400 ml-3 absolute pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none py-3 pl-10 pr-3 text-xs"
                />
              </div>
            </div>

            {/* Intermediate Stream */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Inter Stream</label>
              <select
                value={intermediateStream}
                onChange={(e) => setIntermediateStream(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="MPC">MPC (Mathematics, Physics, Chem)</option>
                <option value="BiPC">BiPC (Biology, Physics, Chem)</option>
                <option value="MEC">MEC (Maths, Economics, Commerce)</option>
                <option value="CEC">CEC (Civics, Economics, Commerce)</option>
                <option value="HEC">HEC (History, Economics, Civics)</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Caste Category</label>
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

            {/* State */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Domicile State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-3 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
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

            {/* District */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">District</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-brand-indigo transition-all">
                <MapPin className="h-4 w-4 text-slate-400 ml-3 absolute pointer-events-none" />
                <input
                  type="text"
                  placeholder="Hyderabad"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none py-3 pl-10 pr-3 text-xs"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gender</label>
              <div className="flex space-x-3">
                {["Male", "Female", "Other"].map((g) => (
                  <label
                    key={g}
                    className={`flex-1 flex items-center justify-center py-2.5 border rounded-xl cursor-pointer text-xs font-semibold transition-all ${
                      gender === g
                        ? "border-brand-indigo bg-brand-indigo/5 text-brand-indigo"
                        : "border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={gender === g}
                      onChange={() => setGender(g)}
                      className="sr-only"
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-brand-indigo to-brand-blue text-white rounded-xl font-bold text-sm hover:shadow-lg shadow-brand-indigo/15 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-1.5"
          >
            <span>{loading ? "Registering..." : "Register & Continue"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-indigo hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
