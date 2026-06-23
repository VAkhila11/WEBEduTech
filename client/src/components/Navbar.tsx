import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../store";
import {
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  Compass,
  School,
  Award,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;

  const { user, theme, logout, toggleTheme } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    {
      href: "/courses",
      label: "Careers & Courses",
      icon: Compass,
    },
    {
      href: "/colleges",
      label: "Colleges",
      icon: School,
    },
    {
      href: "/predictor",
      label: "College Predictor",
      icon: Sparkles,
      highlight: true,
    },
    {
      href: "/scholarships",
      label: "Scholarships",
      icon: Award,
    },
    {
      href: "/ai-counselor",
      label: "AI Counselor",
      icon: Sparkles,
    },
    {
      href: "/community",
      label: "Community",
      icon: HelpCircle,
    },
  ];

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                E
              </div>

              <span className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                EDUTech
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center px-8">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              {navLinks.map((link) => {
                const Icon = link.icon;

                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(link.href + "/");

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center justify-center gap-2 h-11 px-4 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-200
${
  isActive
    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
    : link.highlight
    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:shadow-sm"
    : "text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm"
}`}>
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-600" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">

                <Link
                  to="/profile"
                  className="flex items-center gap-2"
                >
                  <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>

                  <span className="max-w-[140px] truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {user.profile.fullName}
                  </span>
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-2 py-1 rounded-md text-xs font-semibold bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">

                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-2">

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-600" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-slate-700 dark:text-slate-200" />
              ) : (
                <Menu className="h-6 w-6 text-slate-700 dark:text-slate-200" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-xl">

          <div className="p-4 space-y-2">

            {navLinks.map((link) => {
              const Icon = link.icon;

              const isActive =
                pathname === link.href ||
                pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">

              {user ? (
                <div className="space-y-2">

                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <User className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {user.profile.fullName}
                    </span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>

                </div>
              ) : (
                <div className="flex gap-2">

                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-3 rounded-xl bg-indigo-600 text-white font-medium"
                  >
                    Sign Up
                  </Link>

                </div>
              )}

            </div>

          </div>

        </div>
      )}
    </nav>
  );
}