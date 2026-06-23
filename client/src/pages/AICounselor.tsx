import { useState } from "react";
import type { FormEvent } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { API_BASE_URL } from "../config";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RoadmapNode {
  id: string;
  title: string;
  type: string;
  status: string;
}

export default function AICounselor() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ask me about courses, entrance ranks, scholarships, or career roadmaps after Class 12." },
  ]);
  const [message, setMessage] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapNode[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    const nextMessages: Message[] = [...messages, { role: "user", content: message.trim() }];
    setMessages(nextMessages);
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: nextMessages }),
      });
      const data = await response.json();
      setMessages([...nextMessages, { role: "assistant", content: data.reply || "I could not prepare a response." }]);
      setRoadmap(data.roadmap || []);
    } catch {
      setMessages([...nextMessages, { role: "assistant", content: "The counselor service is unavailable right now. Please try again shortly." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-16 w-full page-wrapper bg-slate-50 dark:bg-dark-bg transition-colors">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center shadow-sm">
          <Bot className="h-6 w-6 text-brand-indigo" />
        </div>
        <div>
          <h1 className="text-h2 text-slate-900 dark:text-white">AI Career Counselor</h1>
          <p className="text-sm text-slate-400 mt-1">Get guided answers from the `/api/ai/chat` counselor endpoint.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 glass-card rounded-3xl border border-slate-200/50 dark:border-dark-border overflow-hidden">
          <div className="h-[560px] overflow-y-auto p-6 space-y-4">
            {messages.map((item, index) => (
              <div key={`${item.role}-${index}`} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${item.role === "user" ? "bg-brand-indigo text-white" : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800"}`}>
                  {item.content.replace(/[#*]/g, "")}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-slate-400">Counselor is thinking...</div>}
          </div>
          <form onSubmit={sendMessage} className="border-t border-slate-200 dark:border-slate-800 p-4 flex gap-3 bg-white/70 dark:bg-slate-950/50">
            <input value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-sm outline-none focus:ring-2 focus:ring-brand-indigo" placeholder="Can I get CSE with rank 4000?" />
            <button disabled={loading} className="h-11 w-11 rounded-xl bg-brand-indigo text-white flex items-center justify-center disabled:opacity-60">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>

        <aside className="glass-card p-6 rounded-3xl h-fit">
          <h2 className="text-h4 text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-indigo" />
            Suggested Roadmap
          </h2>
          {roadmap.length === 0 ? (
            <p className="text-sm text-slate-400">Ask about MPC, BiPC, medical, software, or rank-based admission to generate a path.</p>
          ) : (
            <div className="relative pl-6 space-y-4">
              <div className="absolute top-2 bottom-2 left-2 w-0.5 bg-indigo-200 dark:bg-slate-800" />
              {roadmap.map((node) => (
                <div key={node.id} className="relative">
                  <span className="absolute -left-[22px] top-1.5 h-2 w-2 rounded-full bg-brand-indigo ring-4 ring-indigo-100 dark:ring-brand-indigo/25" />
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{node.title}</div>
                  <div className="text-xs text-slate-400 capitalize">{node.type} · {node.status}</div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
