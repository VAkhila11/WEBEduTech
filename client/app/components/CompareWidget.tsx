"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "../store";
import { X, ArrowRightLeft, Sparkles, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "../config";

interface CollegeData {
  id: string;
  name: string;
  location: string;
  state: string;
  feesRange: string;
  rating: number;
  nirfRank?: number;
  accreditation?: string;
  placementPct?: number;
  avgPackage?: number;
  highestPackage?: number;
}

export default function CompareWidget() {
  const { compareColleges, removeCompare, clearCompare } = useAppStore();
  const [collegesData, setCollegesData] = useState<CollegeData[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (compareColleges.length === 0) {
      setCollegesData([]);
      setIsOpen(false);
      return;
    }

    // Load data from backend for selected colleges
    const loadDetails = async () => {
      try {
        const promises = compareColleges.map(async (id) => {
          // Simple fetch from single endpoint or filter from local list
          const res = await fetch(`${API_BASE_URL}/colleges`);
          if (res.ok) {
            const list = await res.json();
            return list.find((c: any) => c.id === id || c.name.toLowerCase().replace(/\s+/g, "-") === id);
          }
          return null;
        });

        const results = await Promise.all(promises);
        setCollegesData(results.filter((c) => c !== null) as CollegeData[]);
      } catch (err) {
        console.error("Failed to load compare college details:", err);
      }
    };

    loadDetails();
  }, [compareColleges]);

  if (compareColleges.length === 0) return null;

  return (
    <>
      {/* Floating Bar at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl p-4 max-w-sm w-full transition-all duration-300 transform scale-100 hover:shadow-brand-indigo/10">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-brand-indigo dark:text-indigo-400 font-semibold text-sm">
            <ArrowRightLeft className="h-4 w-4" />
            <span>Compare Colleges ({compareColleges.length}/3)</span>
          </div>
          <button onClick={clearCompare} className="text-xs text-rose-500 hover:underline">
            Clear all
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {collegesData.map((col) => (
            <div key={col.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg text-xs">
              <span className="font-medium truncate max-w-[200px]">{col.name}</span>
              <button
                onClick={() => removeCompare(col.id)}
                className="text-slate-400 hover:text-rose-500 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          disabled={compareColleges.length < 2}
          className={`w-full py-2 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center space-x-1.5 transition-all ${
            compareColleges.length >= 2
              ? "bg-gradient-to-r from-brand-indigo to-brand-blue hover:shadow-lg shadow-brand-indigo/15 hover:-translate-y-0.5"
              : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500"
          }`}
        >
          <span>Compare Now</span>
        </button>
        {compareColleges.length < 2 && (
          <p className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>Select at least 2 colleges to compare.</span>
          </p>
        )}
      </div>

      {/* Comparison Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-dark-card">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
                  <ArrowRightLeft className="h-5 w-5 text-brand-indigo" />
                  <span>College Comparison</span>
                </h2>
                <p className="text-xs text-slate-400">Comparing your shortlisted colleges side-by-side</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="overflow-x-auto p-6 flex-1">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4 text-left font-semibold text-sm text-slate-400 w-1/4">Metric</th>
                    {collegesData.map((col) => (
                      <th key={col.id} className="py-3 px-4 text-center font-bold text-sm text-brand-indigo dark:text-indigo-400 w-1/4">
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                  {/* Rating */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Rating</td>
                    {collegesData.map((col) => (
                      <td key={col.id} className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                        ★ {col.rating} / 5
                      </td>
                    ))}
                  </tr>
                  {/* NIRF Rank */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">NIRF Rank</td>
                    {collegesData.map((col) => (
                      <td key={col.id} className="py-3 px-4 text-center font-semibold">
                        {col.nirfRank ? `#${col.nirfRank}` : "N/A"}
                      </td>
                    ))}
                  </tr>
                  {/* Location */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Location</td>
                    {collegesData.map((col) => (
                      <td key={col.id} className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">
                        {col.location}, {col.state}
                      </td>
                    ))}
                  </tr>
                  {/* Fees */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Annual Fees</td>
                    {collegesData.map((col) => (
                      <td key={col.id} className="py-3 px-4 text-center text-slate-600 dark:text-slate-300 font-medium">
                        {col.feesRange}
                      </td>
                    ))}
                  </tr>
                  {/* Accreditation */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Accreditation</td>
                    {collegesData.map((col) => (
                      <td key={col.id} className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-semibold">
                          {col.accreditation || "Approved"}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {/* Placements */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Placement Percentage</td>
                    {collegesData.map((col) => (
                      <td key={col.id} className="py-3 px-4 text-center font-bold text-brand-blue">
                        {col.placementPct ? `${col.placementPct}%` : "N/A"}
                      </td>
                    ))}
                  </tr>
                  {/* Packages */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Average Package</td>
                    {collegesData.map((col) => (
                      <td key={col.id} className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        {col.avgPackage ? `${col.avgPackage} LPA` : "N/A"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Highest Package</td>
                    {collegesData.map((col) => (
                      <td key={col.id} className="py-3 px-4 text-center font-extrabold text-indigo-600 dark:text-indigo-400">
                        {col.highestPackage ? `${col.highestPackage} LPA` : "N/A"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-end space-x-2 text-xs">
              <button
                onClick={() => setIsOpen(false)}
                className="py-2 px-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 font-semibold"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
