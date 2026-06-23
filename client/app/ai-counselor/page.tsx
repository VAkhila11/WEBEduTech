"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, HelpCircle, GraduationCap, Map, ArrowRight, User, Terminal, ChevronRight } from "lucide-react";
import { API_BASE_URL } from "../config";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface RoadmapStep {
  id: string;
  title: string;
  type: string; // input, exam, degree, skill, internship, job
  status: string; // completed, current, upcoming
}

export default function AiCounselor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am your **EDUTech AI Career Counsellor**. I can help you find suitable courses, map out career paths, check your college cutoff chances, and discover scholarships.\n\nClick one of the suggestions below or ask your own question!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapStep[] | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Which course is best for MPC?",
    "Can I get CSE with my rank of 4000?",
    "Which scholarship am I eligible for?",
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Append User Message
    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("AI query failed.");

      // Append AI Response
      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);

      // Update Visual Roadmap if returned
      if (data.roadmap) {
        setRoadmap(data.roadmap);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I apologize, but I ran into a communication issue. Please check your network and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Convert markdown bold and list formatting to HTML for simple preview
  const renderMessageText = (text: string) => {
    return text
      .split("\n")
      .map((line, idx) => {
        let renderedLine = line;
        
        // Headers
        if (line.startsWith("### ")) {
          return <h4 key={idx} className="font-extrabold text-sm text-slate-800 dark:text-white mt-3 mb-1.5">{line.replace("### ", "")}</h4>;
        }
        if (line.startsWith("#### ")) {
          return <h5 key={idx} className="font-bold text-xs text-slate-700 dark:text-slate-200 mt-2 mb-1">{line.replace("#### ", "")}</h5>;
        }

        // Bullet lists
        if (line.startsWith("* ") || line.startsWith("- ")) {
          renderedLine = line.replace(/^[\*\-]\s+/, "");
          return (
            <li key={idx} className="list-disc list-inside text-xs text-slate-500 pl-2 mt-1">
              {parseBold(renderedLine)}
            </li>
          );
        }

        // Ordered lists
        if (/^\d+\.\s+/.test(line)) {
          const num = line.match(/^\d+\./)?.[0];
          renderedLine = line.replace(/^\d+\.\s+/, "");
          return (
            <div key={idx} className="text-xs text-slate-500 pl-2 mt-1 flex">
              <span className="font-bold mr-1.5 text-brand-indigo">{num}</span>
              <span>{parseBold(renderedLine)}</span>
            </div>
          );
        }

        return <p key={idx} className="text-xs leading-relaxed text-slate-500 mt-1.5">{parseBold(renderedLine)}</p>;
      });
  };

  const parseBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*|🟢|🟡|🔴)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} className="text-slate-800 dark:text-white font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-between relative">
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-brand-purple/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-brand-indigo shadow-sm">
          <Sparkles className="h-6 w-6 text-brand-indigo animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Career Counselor</h1>
          <p className="text-sm text-slate-400">Ask questions and generate tailored career roadmaps</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
        {/* Left Column: Chat Container */}
        <div className="lg:col-span-2 glass-card rounded-3xl flex flex-col h-[65vh] overflow-hidden border border-slate-200/50 dark:border-dark-border">
          {/* Messages Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => {
              const isAi = msg.sender === "ai";
              return (
                <div key={index} className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
                  <div className={`flex items-start space-x-3 max-w-[85%] ${isAi ? "" : "flex-row-reverse space-x-reverse"}`}>
                    
                    {/* User icon */}
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isAi ? "bg-indigo-100 dark:bg-brand-indigo/25 text-brand-indigo" : "bg-purple-100 dark:bg-brand-purple/25 text-brand-purple"
                    }`}>
                      {isAi ? "AI" : <User className="h-4.5 w-4.5" />}
                    </div>

                    {/* Chat Bubble */}
                    <div className={`p-4 rounded-2xl text-slate-800 dark:text-slate-100 text-sm ${
                      isAi
                        ? "bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800"
                        : "bg-gradient-to-tr from-brand-indigo to-brand-blue text-white"
                    }`}>
                      {isAi ? renderMessageText(msg.text) : <p className="text-xs">{msg.text}</p>}
                    </div>

                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-brand-indigo/25 text-brand-indigo flex items-center justify-center text-xs font-bold">
                    AI
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800">
                    <div className="flex space-x-1.5">
                      <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-brand-indigo hover:text-brand-indigo rounded-full text-slate-500 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white dark:bg-dark-card border-t border-slate-150 dark:border-slate-800 flex space-x-2">
            <input
              type="text"
              placeholder="Ask a question (e.g. Which course is best for MPC?)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend(input);
              }}
              className="flex-grow bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 outline-none rounded-xl py-3.5 px-4 text-xs"
            />
            <button
              onClick={() => handleSend(input)}
              className="p-3 bg-gradient-to-r from-brand-indigo to-brand-blue text-white rounded-xl hover:shadow shadow-brand-indigo/15 hover:scale-105 transition-all flex-shrink-0"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Roadmap Output Graphic */}
        <div className="glass-card p-6 rounded-3xl h-[65vh] flex flex-col overflow-hidden border border-slate-200/50 dark:border-dark-border">
          <h3 className="text-base font-bold flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <Map className="h-5 w-5 text-brand-indigo" />
            <span>Target Career Path</span>
          </h3>

          {!roadmap ? (
            <div className="text-center py-20 flex-grow flex flex-col justify-center items-center">
              <Terminal className="h-10 w-10 text-slate-400 mb-3" />
              <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed mx-auto">
                No active pathway loaded. Ask the AI Counselor about streams or courses to generate a roadmap.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="relative pl-6 space-y-4">
                {/* Visual Connector Line */}
                <div className="absolute top-2.5 bottom-2.5 left-2 w-0.5 bg-indigo-200 dark:bg-slate-800" />
                {roadmap.map((step, idx) => (
                  <div
                    key={step.id}
                    className="relative flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-slate-850 animate-in slide-in-from-right-4 duration-300"
                  >
                    <span className="absolute -left-[22px] top-4.5 h-2.5 w-2.5 rounded-full bg-brand-indigo ring-4 ring-indigo-100 dark:ring-brand-indigo/25" />
                    <div>
                      <div className="text-xs font-bold text-slate-850 dark:text-white leading-snug">{step.title}</div>
                      <div className="text-[10px] text-slate-400 capitalize mt-0.5">{step.type} node</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
