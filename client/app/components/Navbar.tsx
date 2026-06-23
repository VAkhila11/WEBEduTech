"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppStore } from "../store";
import { Sun, Moon, Menu, X, User, LogOut, Compass, School, Award, Sparkles, HelpCircle } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, theme, logout, toggleTheme } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/courses", label: "Careers & Courses", icon: Compass },
    { href: "/colleges", label: "Colleges", icon: School },
    { href: "/predictor", label: "College Predictor", icon: Sparkles, highlight: true },
    { href: "/scholarships", label: "Scholarships", icon: Award },
    { href: "/ai-counselor", label: "AI Counselor", icon: Sparkles },
    { href: "/community", label: "Community", icon: HelpCircle },
  ];

  if (!mounted) return null; // Avoid hydration mismatch on initial SSR

  return (
    <nav className="sticky top-0 z-50 glass-panel shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-indigo via-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-lg shadow-md animate-pulse">
                E
              </span>
              <span className="font-extrabold text-2xl tracking-tight text-gradient">
                EDUTech
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    link.highlight
                      ? "bg-gradient-to-r from-brand-indigo/10 to-brand-purple/10 border border-brand-indigo/20 text-brand-indigo dark:text-brand-purple hover:scale-105"
                      : isActive
                      ? "text-brand-indigo dark:text-brand-purple bg-brand-indigo/5 dark:bg-white/5"
                      : "text-slate-600 dark:text-slate-300 hover:text-brand-indigo dark:hover:text-brand-purple hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right actions: Theme + Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-indigo-600" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-700">
                <Link href="/profile" className="flex items-center space-x-2 text-sm font-medium hover:text-brand-indigo">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-brand-indigo dark:text-indigo-400 flex items-center justify-center font-semibold">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="max-w-[120px] truncate">{user.profile.fullName}</span>
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="text-xs px-2 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded font-semibold">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-indigo"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-indigo to-brand-blue rounded-lg hover:shadow-lg hover:shadow-brand-indigo/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-indigo-600" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive
                    ? "bg-brand-indigo/5 dark:bg-white/5 text-brand-indigo dark:text-brand-purple"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          {user ? (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 px-3">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 text-slate-700 dark:text-slate-300 font-medium py-2"
              >
                <User className="h-5 w-5 text-brand-indigo" />
                <span>{user.profile.fullName}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3 w-full text-left text-rose-500 font-medium py-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex space-x-2 px-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center py-2 px-4 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center py-2 px-4 text-sm font-medium text-white bg-brand-indigo rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
