"use client";

import { useState } from "react";
import { MessageSquare, Star, User, PlusCircle, Filter, Send, AlertCircle } from "lucide-react";

interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  category: string;
  replies: number;
  likes: number;
  date: string;
}

interface CollegeReview {
  id: string;
  author: string;
  collegeName: string;
  rating: number;
  comment: string;
  date: string;
}

export default function Community() {
  const [activeTab, setActiveTab] = useState<"forum" | "reviews">("forum");

  // Mock Forum Posts
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: "p1",
      author: "Aditya K.",
      title: "CBIT CSE vs Vasavi CSE - Which is better for placements?",
      content: "I secured a rank of 2,100 in TS EAPCET. Which college should I choose for Computer Science? I am looking for top recruiters and high packages.",
      category: "Admissions",
      replies: 14,
      likes: 8,
      date: "2 hours ago",
    },
    {
      id: "p2",
      author: "Shruti Reddy",
      title: "NEET 2026 Counseling Schedule updates?",
      content: "Has MCC released the dates for the first round of NEET counseling? I couldn't find any active notifications on MCC.nic.in.",
      category: "Exams",
      replies: 5,
      likes: 3,
      date: "5 hours ago",
    },
  ]);

  // Mock College Reviews
  const [reviews, setReviews] = useState<CollegeReview[]>([
    {
      id: "r1",
      author: "Sai Kumar",
      collegeName: "JNTUH College of Engineering Hyderabad",
      rating: 5,
      comment: "Excellent campus life and coding culture. The placements are top notch, especially for B.Tech CSE students. Lots of hackathons and tech fests happen throughout the year.",
      date: "1 day ago",
    },
    {
      id: "r2",
      author: "Preeti Sharma",
      collegeName: "Gandhi Medical College, Secunderabad",
      rating: 4.5,
      comment: "Superb clinical exposure. The hospital OPD gets massive patient flow, which is great for learning. Hostel facilities are decent, though mess food can be improved.",
      date: "3 days ago",
    },
  ]);

  // Form States
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("General");
  
  const [newReviewCollege, setNewReviewCollege] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  const [success, setSuccess] = useState("");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) return;

    const newPost: ForumPost = {
      id: `p-${Date.now()}`,
      author: "You (Student)",
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      replies: 0,
      likes: 0,
      date: "Just now",
    };

    setForumPosts([newPost, ...forumPosts]);
    setNewPostTitle("");
    setNewPostContent("");
    setSuccess("Your question has been posted successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewCollege || !newReviewComment) return;

    const newRev: CollegeReview = {
      id: `r-${Date.now()}`,
      author: "You (Student)",
      collegeName: newReviewCollege,
      rating: newReviewRating,
      comment: newReviewComment,
      date: "Just now",
    };

    setReviews([newRev, ...reviews]);
    setNewReviewCollege("");
    setNewReviewComment("");
    setSuccess("Your college review has been shared!");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full relative">
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-brand-indigo/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-brand-indigo">
          <MessageSquare className="h-6 w-6 text-brand-indigo" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Community Forum</h1>
          <p className="text-sm text-slate-400">Ask questions, read reviews, and interact with peers & mentors</p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-1 rounded-2xl w-fit mb-8">
        <button
          onClick={() => setActiveTab("forum")}
          className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "forum"
              ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Discussion Board
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "reviews"
              ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          College Reviews
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Listings */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "forum" ? (
            <div className="space-y-4">
              {forumPosts.map((post) => (
                <div key={post.id} className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-50/60 dark:bg-brand-indigo/15 text-brand-indigo rounded text-[10px] font-bold">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">{post.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{post.content}</p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-4 text-xs text-slate-400 font-medium">
                    <span>💬 {post.replies} Replies</span>
                    <span>👍 {post.likes} Likes</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-2">
                      <User className="h-4.5 w-4.5" />
                      <span>{rev.author}</span>
                      <span>•</span>
                      <span>{rev.date}</span>
                    </div>
                    <div className="flex items-center text-yellow-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-yellow-500 mr-1" />
                      <span>{rev.rating} / 5</span>
                    </div>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{rev.collegeName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Creation Forms */}
        <div className="glass-card p-6 rounded-3xl h-fit">
          {activeTab === "forum" ? (
            <form onSubmit={handleCreatePost} className="space-y-4">
              <h3 className="text-sm font-bold flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
                <PlusCircle className="h-4.5 w-4.5 text-brand-indigo" />
                <span>Ask a Question</span>
              </h3>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  placeholder="e.g. CBA vs CSE seats"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-2.5 px-3.5 text-xs focus:ring-2 focus:ring-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-2.5 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
                >
                  <option value="General">General Guidance</option>
                  <option value="Admissions">Admissions & Counseling</option>
                  <option value="Exams">Entrance Exams</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Content Details</label>
                <textarea
                  placeholder="Write your question details..."
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-2.5 px-3.5 text-xs focus:ring-2 focus:ring-brand-indigo resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-brand-indigo to-brand-blue text-white font-bold rounded-xl text-xs hover:shadow shadow-brand-indigo/15 flex items-center justify-center space-x-1 transition-all hover:-translate-y-0.5"
              >
                <Send className="h-4 w-4" />
                <span>Post Question</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateReview} className="space-y-4">
              <h3 className="text-sm font-bold flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
                <PlusCircle className="h-4.5 w-4.5 text-brand-purple" />
                <span>Add College Review</span>
              </h3>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">College Name</label>
                <input
                  type="text"
                  placeholder="e.g. CBIT, Hyderabad"
                  value={newReviewCollege}
                  onChange={(e) => setNewReviewCollege(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-2.5 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Rating</label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(parseFloat(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-2.5 px-3 text-xs focus:ring-2 focus:ring-brand-indigo"
                >
                  <option value="5">★ 5 (Excellent)</option>
                  <option value="4">★ 4 (Very Good)</option>
                  <option value="3">★ 3 (Good)</option>
                  <option value="2">★ 2 (Average)</option>
                  <option value="1">★ 1 (Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Comment Description</label>
                <textarea
                  placeholder="Share details about hostel facilities, faculty, or placement packages..."
                  rows={4}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none py-2.5 px-3 text-xs focus:ring-2 focus:ring-brand-indigo resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-brand-indigo to-brand-purple text-white font-bold rounded-xl text-xs hover:shadow shadow-brand-indigo/15 flex items-center justify-center space-x-1 transition-all hover:-translate-y-0.5"
              >
                <Send className="h-4 w-4" />
                <span>Share Review</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
