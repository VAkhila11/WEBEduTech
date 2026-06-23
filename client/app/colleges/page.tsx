"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "../store";
import { School, MapPin, DollarSign, Star, SlidersHorizontal, Eye, ChevronRight, X, Heart, Plus, Check } from "lucide-react";
import { API_BASE_URL } from "../config";

interface College {
  id: string;
  name: string;
  about: string;
  location: string;
  state: string;
  district: string;
  feesRange: string;
  rating: number;
  nirfRank?: number;
  accreditation?: string;
  placementPct?: number;
  avgPackage?: number;
  highestPackage?: number;
  hostelDetails?: string;
  gallery: string[];
  videos: string[];
  mapEmbedUrl?: string;
  collegeCourses: any[];
}

export default function Colleges() {
  const { compareColleges, addCompare, removeCompare } = useAppStore();

  // Search/Filter states
  const [stateFilter, setStateFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [feesFilter, setFeesFilter] = useState("");
  const [placementFilter, setPlacementFilter] = useState("");
  
  // Data states
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch list of colleges based on filters
  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (stateFilter) query.append("state", stateFilter);
    if (courseFilter) query.append("course", courseFilter);
    if (feesFilter) query.append("feesLimit", feesFilter);
    if (placementFilter) query.append("placementPct", placementFilter);

    fetch(`${API_BASE_URL}/colleges?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => setColleges(data))
      .catch((err) => console.error("Error loading colleges:", err))
      .finally(() => setLoading(false));
  }, [stateFilter, courseFilter, feesFilter, placementFilter]);

  const toggleWishlist = (id: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((wId) => wId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full relative">
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-brand-indigo">
          <School className="h-6 w-6 text-brand-indigo" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Colleges Directory</h1>
          <p className="text-sm text-slate-400">Search and filter top engineering, medical & degree colleges</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="glass-card p-6 rounded-3xl h-fit space-y-5">
          <h3 className="text-sm font-bold flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Search Filters</span>
          </h3>

          {/* State */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">State Location</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-2.5 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
            >
              <option value="">All States</option>
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>

          {/* Course Category */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Offered Course</label>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-2.5 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
            >
              <option value="">All Streams</option>
              <option value="Computer Science">B.Tech CSE</option>
              <option value="Electronics">B.Tech ECE</option>
              <option value="MBBS">MBBS</option>
              <option value="BBA">BBA Management</option>
            </select>
          </div>

          {/* Fees ranges */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Max Yearly Fees</label>
            <select
              value={feesFilter}
              onChange={(e) => setFeesFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-2.5 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
            >
              <option value="">No Limit</option>
              <option value="50000">Under ₹50,000 / year</option>
              <option value="150000">Under ₹1.5 Lakhs / year</option>
              <option value="300000">Under ₹3.0 Lakhs / year</option>
            </select>
          </div>

          {/* Placement percent */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Min Placement %</label>
            <select
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-2.5 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
            >
              <option value="">Any Placement %</option>
              <option value="90">90% and above</option>
              <option value="95">95% and above</option>
            </select>
          </div>
        </div>

        {/* Right side College List */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-brand-indigo border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-xs text-slate-400">Filtering colleges...</p>
            </div>
          ) : colleges.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-3xl">
              <p className="text-sm text-slate-400">No colleges match your filter configurations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {colleges.map((col) => {
                const isSaved = wishlist.includes(col.id);
                const isCompareSelected = compareColleges.includes(col.id);
                return (
                  <div
                    key={col.id}
                    className="glass-card rounded-3xl border border-slate-200/50 dark:border-dark-border overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    {/* Top banner / Image mockup */}
                    <div className="h-40 bg-gradient-to-r from-slate-100 to-indigo-50/50 dark:from-slate-850 dark:to-indigo-950/20 relative flex items-center justify-center p-4">
                      {col.gallery && col.gallery.length > 0 ? (
                        <img src={col.gallery[0]} alt={col.name} className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay dark:mix-blend-normal dark:opacity-30" />
                      ) : null}
                      <span className="text-2xl font-black text-slate-400/40 select-none">EDUTECH PROFILE</span>
                      
                      {/* Wishlist floating heart */}
                      <button
                        onClick={() => toggleWishlist(col.id)}
                        className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md shadow transition-colors ${
                          isSaved ? "bg-rose-500 text-white" : "bg-white/70 dark:bg-black/40 text-slate-400 hover:text-rose-500"
                        }`}
                      >
                        <Heart className={`h-4.5 w-4.5 ${isSaved ? "fill-white" : ""}`} />
                      </button>
                    </div>

                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {col.location}, {col.state}
                          </span>
                          <span className="flex items-center text-yellow-500 font-bold">
                            <Star className="h-3.5 w-3.5 fill-yellow-500 mr-1" />
                            {col.rating}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-base leading-snug mb-3 min-h-[44px]">{col.name}</h3>

                        {/* Placements & Package Pills */}
                        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                          <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl">
                            <div className="text-slate-400">Avg Package</div>
                            <div className="font-bold mt-0.5">{col.avgPackage ? `${col.avgPackage} LPA` : "N/A"}</div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl">
                            <div className="text-slate-400">Accreditation</div>
                            <div className="font-bold mt-0.5 text-indigo-500">{col.accreditation || "Approved"}</div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => setSelectedCollege(col)}
                          className="flex-1 py-2 px-3 bg-brand-indigo/10 text-brand-indigo hover:bg-brand-indigo hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Profile</span>
                        </button>
                        {isCompareSelected ? (
                          <button
                            onClick={() => removeCompare(col.id)}
                            className="py-2 px-3 border border-emerald-500 text-emerald-500 rounded-xl hover:bg-emerald-50/10 bg-emerald-500/5 transition-colors"
                          >
                            <Check className="h-4.5 w-4.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => addCompare(col.id)}
                            className="py-2 px-3 border border-slate-200 dark:border-slate-700 hover:border-brand-indigo hover:text-brand-indigo text-slate-500 rounded-xl transition-colors"
                            title="Add to Comparison"
                          >
                            <Plus className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* College Profile Modal details */}
      {selectedCollege && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-indigo/10 text-brand-indigo rounded uppercase">
                  🏆 NIRF Rank: #{selectedCollege.nirfRank || "N/A"}
                </span>
                <h3 className="text-lg font-bold mt-1 text-slate-850 dark:text-white">{selectedCollege.name}</h3>
              </div>
              <button
                onClick={() => setSelectedCollege(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Profile Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About College</h4>
                <p className="text-slate-600 dark:text-slate-350 leading-relaxed">{selectedCollege.about}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200/50 dark:border-slate-850 rounded-xl">
                  <div className="text-xs text-slate-450">Placement Rate</div>
                  <div className="text-lg font-extrabold text-brand-indigo mt-0.5">{selectedCollege.placementPct}%</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200/50 dark:border-slate-850 rounded-xl">
                  <div className="text-xs text-slate-450">Average package</div>
                  <div className="text-lg font-extrabold text-slate-850 dark:text-white mt-0.5">{selectedCollege.avgPackage} LPA</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200/50 dark:border-slate-850 rounded-xl">
                  <div className="text-xs text-slate-450">Highest Package</div>
                  <div className="text-lg font-extrabold text-emerald-500 mt-0.5">{selectedCollege.highestPackage} LPA</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200/50 dark:border-slate-850 rounded-xl">
                  <div className="text-xs text-slate-450">Fees range</div>
                  <div className="text-lg font-extrabold text-brand-purple mt-0.5 text-xs truncate leading-relaxed">{selectedCollege.feesRange}</div>
                </div>
              </div>

              {/* Hostels Details */}
              {selectedCollege.hostelDetails && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hostel & Accommodation Details</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/50 dark:border-slate-850">
                    {selectedCollege.hostelDetails}
                  </p>
                </div>
              )}

              {/* Course Cutoffs */}
              {selectedCollege.collegeCourses && selectedCollege.collegeCourses.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cutoffs Offered Courses</h4>
                  <div className="space-y-3">
                    {selectedCollege.collegeCourses.map((cc: any, idx: number) => (
                      <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                        <div className="font-bold text-xs text-brand-indigo mb-2">{cc.course.name}</div>
                        <div className="grid grid-cols-4 gap-2 text-[10px] text-center font-semibold">
                          {cc.cutoffRanks.map((cr: any, crIdx: number) => (
                            <div key={crIdx} className="bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded">
                              <span className="text-slate-400 block">{cr.category}</span>
                              <span className="text-slate-850 dark:text-white font-extrabold mt-0.5">{cr.cutoffRank}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Map Embed */}
              {selectedCollege.mapEmbedUrl && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location map</h4>
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-64 w-full">
                    <iframe
                      src={selectedCollege.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-end">
              <button
                onClick={() => setSelectedCollege(null)}
                className="py-2 px-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
