import Link from "next/link";
import { Compass, School, Award, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#080c14] border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-indigo via-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-lg">
                E
              </span>
              <span className="font-extrabold text-2xl tracking-tight text-gradient">
                EDUTech
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              India's premium career guidance platform for students after Class 12. Helping you discover courses, colleges, and scholarships.
            </p>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              "Explore. Learn. Achieve."
            </div>
          </div>

          {/* Explorer Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses?stream=MPC" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-indigo">
                  MPC Stream Careers
                </Link>
              </li>
              <li>
                <Link href="/courses?stream=BiPC" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-indigo">
                  BiPC Stream Careers
                </Link>
              </li>
              <li>
                <Link href="/courses?stream=MEC" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-indigo">
                  MEC/CEC Stream Careers
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-indigo">
                  All Courses Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Features */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Flagship Tools
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/predictor" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-indigo flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-brand-purple" />
                  <span>College Predictor</span>
                </Link>
              </li>
              <li>
                <Link href="/ai-counselor" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-indigo flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-brand-blue" />
                  <span>AI Career Counsellor</span>
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-indigo flex items-center space-x-1">
                  <Award className="h-3 w-3 text-brand-indigo" />
                  <span>Scholarship Hub</span>
                </Link>
              </li>
              <li>
                <Link href="/colleges" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-indigo flex items-center space-x-1">
                  <School className="h-3 w-3" />
                  <span>Colleges Directory</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Get In Touch
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
              Have questions or feedback? Email us at support@edutech.com or contact our counselor helpline.
            </p>
            <div className="pt-2">
              <span className="text-xs px-2 py-1 bg-brand-indigo/10 dark:bg-brand-indigo/20 text-brand-indigo rounded font-semibold">
                Helpline: 1800-200-TECH
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-400">
            &copy; {currentYear} EDUTech India. All rights reserved.
          </p>
          <p className="text-sm text-slate-400 flex items-center mt-2 md:mt-0">
            Made with <Heart className="h-4 w-4 text-rose-500 mx-1 fill-rose-500" /> for Intermediate Students
          </p>
        </div>
      </div>
    </footer>
  );
}
