import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../store";
import { Mail, Lock, Phone, KeyRound, Globe, ArrowRight, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../config";

export default function Login() {
  const navigate = useNavigate();
  const setSession = useAppStore((state) => state.setSession);

  // States
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [mockOtpHint, setMockOtpHint] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle standard password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed.");

      setSession(data.user, data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger Send OTP SMS
  const handleSendOtp = async () => {
    setError("");
    if (!mobileNumber) {
      setError("Mobile number is required for OTP login.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to trigger OTP.");

      setOtpSent(true);
      setMockOtpHint(data.mockOtp);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed.");

      setSession(data.user, data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mock Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "student.google@gmail.com",
          name: "Saurav Sharma",
          googleId: "google-10903",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Google login failed");

      setSession(data.user, data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 relative page-wrapper">
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-brand-indigo/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-brand-purple/5 blur-[90px] pointer-events-none" />

      <div className="glass-card max-w-md w-full p-8 rounded-3xl shadow-2xl relative border border-slate-200/50 dark:border-slate-800">
        
        {/* Title */}
        <div className="text-center mb-8">
          <span className="inline-flex h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-indigo via-brand-blue to-brand-purple items-center justify-center text-white font-bold text-lg mb-4 shadow">
            E
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Discover your path at EDUTech</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Toggle Login Method */}
        <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl mb-6">
          <button
            onClick={() => {
              setLoginMode("password");
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              loginMode === "password" ? "bg-white dark:bg-dark-card shadow text-slate-900 dark:text-white" : "text-slate-500"
            }`}
          >
            Email & Password
          </button>
          <button
            onClick={() => {
              setLoginMode("otp");
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              loginMode === "otp" ? "bg-white dark:bg-dark-card shadow text-slate-900 dark:text-white" : "text-slate-500"
            }`}
          >
            Mobile OTP
          </button>
        </div>

        {/* 1. PASSWORD FORM */}
        {loginMode === "password" && (
          <form onSubmit={handlePasswordLogin} className="space-y-4"> {/* strict 16px spacing */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email or Mobile</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-brand-indigo transition-all">
                <Mail className="h-5 w-5 text-slate-400 ml-4 absolute pointer-events-none" />
                <input
                  type="text"
                  placeholder="student@edutech.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none py-3.5 pl-12 pr-4 text-sm h-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-brand-indigo transition-all">
                <Lock className="h-5 w-5 text-slate-400 ml-4 absolute pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none py-3.5 pl-12 pr-4 text-sm h-12"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-brand-indigo to-brand-blue text-white rounded-xl font-bold text-sm hover:shadow-lg shadow-brand-indigo/15 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Logging in..." : "Login"}</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </form>
        )}

        {/* 2. OTP FORM */}
        {loginMode === "otp" && (
          <div className="space-y-4">
            {!otpSent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mobile Number</label>
                  <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-brand-indigo transition-all">
                    <Phone className="h-5 w-5 text-slate-400 ml-4 absolute pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full bg-transparent outline-none py-3.5 pl-12 pr-4 text-sm h-12"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-brand-indigo to-brand-blue text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                >
                  {loading ? "Sending..." : "Send Verification OTP"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-200">
                {mockOtpHint && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center space-x-2 font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Mock SMS code triggered: <b>{mockOtpHint}</b></span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Enter OTP</label>
                  <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-brand-indigo transition-all">
                    <KeyRound className="h-5 w-5 text-slate-400 ml-4 absolute pointer-events-none" />
                    <input
                      type="text"
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                      className="w-full bg-transparent outline-none py-3.5 pl-12 pr-4 text-sm h-12"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-brand-indigo to-brand-blue text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                >
                  Verify & Log In
                </button>
              </form>
            )}
          </div>
        )}

        <div className="relative my-6 text-center">
          <span className="absolute inset-x-0 top-1/2 border-t border-slate-200 dark:border-slate-800 -z-10" />
          <span className="bg-white dark:bg-dark-card px-3 text-xs text-slate-400 font-medium">OR</span>
        </div>

        {/* Google Authentication Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-12 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-400 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all"
        >
          <Globe className="h-4.5 w-4.5" />
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-brand-indigo hover:underline font-semibold">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
