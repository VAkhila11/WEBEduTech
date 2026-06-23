import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { HelpCircle, MessageSquare, Plus } from "lucide-react";
import { useAppStore } from "../store";

interface PostItem {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
}

const starterPosts: PostItem[] = [
  {
    id: "post-eapcet",
    title: "How should I prioritize TS EAPCET web options?",
    content: "List dream, moderate, and safe colleges separately. Lock preferred branches first, then use cutoff rank as a reality check.",
    category: "Admission",
    author: "Counselor Desk",
    createdAt: new Date().toISOString(),
  },
  {
    id: "post-scholarship",
    title: "Documents commonly needed for fee reimbursement",
    content: "Income certificate, caste/category certificate, Aadhaar, bank passbook, bonafide certificate, and admission allotment order are usually requested.",
    category: "Scholarships",
    author: "EDUTech Team",
    createdAt: new Date().toISOString(),
  },
];

export default function Community() {
  const user = useAppStore((state) => state.user);
  const [posts, setPosts] = useState<PostItem[]>(starterPosts);
  const [category, setCategory] = useState("All");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const filteredPosts = useMemo(() => posts.filter((post) => category === "All" || post.category === category), [category, posts]);

  const addPost = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setPosts([
      {
        id: `post-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        category: category === "All" ? "General" : category,
        author: user?.profile.fullName || "Guest Student",
        createdAt: new Date().toISOString(),
      },
      ...posts,
    ]);
    setTitle("");
    setContent("");
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-16 w-full page-wrapper bg-slate-50 dark:bg-dark-bg transition-colors">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center shadow-sm">
          <HelpCircle className="h-6 w-6 text-brand-indigo" />
        </div>
        <div>
          <h1 className="text-h2 text-slate-900 dark:text-white">Community</h1>
          <p className="text-sm text-slate-400 mt-1">Student questions and admission discussions based on the `Post` model.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="glass-card p-6 rounded-3xl h-fit space-y-4">
          <h2 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <MessageSquare className="h-4 w-4" />
            Channels
          </h2>
          {["All", "Exam", "Admission", "Scholarships", "General"].map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`w-full h-10 rounded-xl text-sm font-semibold text-left px-3 ${category === item ? "bg-brand-indigo text-white" : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900"}`}>
              {item}
            </button>
          ))}
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={addPost} className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Plus className="h-4 w-4 text-brand-indigo" />
              Start a Discussion
            </div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-sm outline-none focus:ring-2 focus:ring-brand-indigo" placeholder="Question title" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full min-h-24 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-indigo resize-none" placeholder="Share context, rank, course, category, or college preference..." />
            <button className="h-10 px-5 rounded-xl bg-brand-indigo text-white text-sm font-bold hover:bg-brand-purple">Post</button>
          </form>

          {filteredPosts.map((post) => (
            <article key={post.id} className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border">
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-brand-indigo font-bold">{post.category}</span>
                <span className="text-slate-400">{post.author}</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">{post.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{post.content}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
