
import { Link } from "react-router-dom";
import {
  School,
  Award,
  Sparkles,
  Heart,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-dark-bg border-t border-slate-200 dark:border-dark-border transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-brand-indigo via-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-lg shadow-md">
                E
              </div>

              <span className="text-2xl font-bold text-gradient">
                EDUTech
              </span>
            </Link>

            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
              India's premium career guidance platform helping students choose
              the right courses, colleges, entrance exams and scholarships
              after Intermediate.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs bg-brand-indigo/10 text-brand-indigo">
                Career Guidance
              </span>

              <span className="px-3 py-1 rounded-full text-xs bg-brand-purple/10 text-brand-purple">
                AI Counselor
              </span>

              <span className="px-3 py-1 rounded-full text-xs bg-brand-blue/10 text-brand-blue">
                Scholarships
              </span>
            </div>

            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Explore. Learn. Achieve.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-5">
              Explore
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/courses?stream=MPC"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-indigo transition-colors"
                >
                  MPC Stream Careers
                </Link>
              </li>

              <li>
                <Link
                  to="/courses?stream=BiPC"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-indigo transition-colors"
                >
                  BiPC Stream Careers
                </Link>
              </li>

              <li>
                <Link
                  to="/courses?stream=MEC"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-indigo transition-colors"
                >
                  MEC / CEC Careers
                </Link>
              </li>

              <li>
                <Link
                  to="/courses"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-indigo transition-colors"
                >
                  All Courses
                </Link>
              </li>

              <li>
                <Link
                  to="/colleges"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-indigo transition-colors"
                >
                  Colleges Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-5">
              Tools & Features
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/predictor"
                  className="group flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-indigo transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-brand-purple group-hover:scale-110 transition-transform" />
                  <span>College Predictor</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/ai-counselor"
                  className="group flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-indigo transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-brand-blue group-hover:scale-110 transition-transform" />
                  <span>AI Career Counselor</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/scholarships"
                  className="group flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-indigo transition-colors"
                >
                  <Award className="h-4 w-4 text-brand-indigo group-hover:scale-110 transition-transform" />
                  <span>Scholarship Hub</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/colleges"
                  className="group flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-indigo transition-colors"
                >
                  <School className="h-4 w-4 text-brand-blue group-hover:scale-110 transition-transform" />
                  <span>College Directory</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-5">
              Contact Us
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-indigo" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  support@edutech.com
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-indigo" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  1800-200-TECH
                </span>
              </div>

              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                Need help selecting a course, college or scholarship?
                Our experts are here to guide you.
              </p>

              <div className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-indigo/10 text-brand-indigo text-sm font-medium">
                📞 Student Helpline
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-dark-border flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {currentYear} EDUTech India. All rights reserved.
          </p>

          <p className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            Made with
            <Heart className="h-4 w-4 mx-2 text-rose-500 fill-rose-500 animate-pulse" />
            for Students Across India
          </p>

        </div>
      </div>
    </footer>
  );
}

