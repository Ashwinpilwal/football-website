import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Shuffle,
  Shield,
  Award,
  Activity,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { footballAiService } from "@/services/footballAi.service";
import toast from "react-hot-toast";

// Massive Pool of 40+ Dynamic Football Tactical & Scouting Questions
const ALL_PROMPT_POOL = [
  "Explain Pep Guardiola's Inverted Fullback system in detail",
  "Compare Erling Haaland vs Kylian Mbappé playstyles and metrics",
  "How can a manager break down an ultra-compact 5-4-1 Low Block?",
  "Tactical history of El Clásico (Real Madrid vs Barcelona)",
  "What is Gegenpressing and how does the 5-second recovery rule work?",
  "Best midfield trios in football history and their tactical roles",
  "Analyze Arsenal's set-piece dominance and corner routine schemes",
  "Why is the modern classic #10 attacking midfielder fading in modern football?",
  "Explain the 3-2-4-1 Box Midfield build-up structure",
  "How did Spain master Tiki-Taka between 2008 and 2012?",
  "What makes Rodri the most influential defensive midfielder today?",
  "Tactical breakdown: Miracle of Istanbul 2005 (Milan vs Liverpool)",
  "Explain Rest Defense and why it prevents dangerous counter-attacks",
  "Compare Vinicius Jr. vs Bukayo Saka in 1v1 isolated wide situations",
  "How does Carlo Ancelotti's player-led freedom system work at Real Madrid?",
  "What are Inverted Wingers vs Traditional Touchline Wingers?",
  "Explain the False 9 role using Messi under Pep Guardiola at Barcelona",
  "How to defend against a high-intensity transition counter-attacking team?",
  "What is PPDA (Passes Per Defensive Action) in football analytics?",
  "Tactical evolution of Jurgen Klopp's Heavy Metal Football to Control",
  "Explain Catenaccio: Helenio Herrera's Italian defensive fortress",
  "How does Hansi Flick set up his extreme high-line offside traps?",
  "Compare prime Cristiano Ronaldo (2008-2014) vs prime Lionel Messi (2009-2015)",
  "What is 'La Pausa' and which midfielders mastered it?",
  "Explain the difference between Zonal Marking and Man-to-Man Marking on corners",
  "How does Mikel Arteta use dynamic overloads in the half-spaces?",
  "Tactical breakdown of the 2022 World Cup Final (Argentina vs France)",
  "What are progressive passes and progressive carries in scouting?",
  "Why are modern goalkeepers required to act as Sweeper-Keepers?",
  "Explain Marcelo Bielsa's murderball high-octane pressing philosophy",
  "How to counter a high press when playing out from the back?",
  "Tactical analysis of Bayer Leverkusen's unbeaten Bundesliga title under Xabi Alonso",
  "Compare Jude Bellingham's attacking box-crashing role vs Zinedine Zidane",
  "Explain the Half-Space (Zwischenlinienraum) in football geometry",
  "What makes Diego Simeone's 4-4-2 low block so notoriously difficult to beat?",
  "Explain Sarri-ball: Vertical tiki-taka and one-touch combinations",
  "How do fullbacks like Trent Alexander-Arnold revolutionize playmaking?",
  "What is the Underslot run and how do modern wingers exploit it?",
  "Explain Post-Shot Expected Goals (PSxG) for evaluating goalkeepers",
  "How does Ange Postecoglou's inverted ultra-high line work at Tottenham?",
];

// Cycling Thinking Status Messages
const THINKING_STEPS = [
  "⚡ Scouting career metrics, heatmaps & playstyles...",
  "📊 Cross-referencing goals, trophies & clutch records...",
  "🧠 Analyzing tactical systems & spatial influence...",
  "📝 Formulating detailed football report...",
];

function getRandomPrompts(count = 6) {
  const shuffled = [...ALL_PROMPT_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Rich Markdown Response Formatter Component
function FormattedMessage({ text }) {
  if (!text) return null;

  return (
    <div className="prose prose-invert max-w-2xl text-sm sm:text-base leading-relaxed sm:leading-7 space-y-3">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-lg sm:text-xl font-black font-display text-white mt-4 mb-2 pb-1.5 border-b border-white/10 flex items-center gap-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-base sm:text-lg font-extrabold font-display text-emerald-400 mt-4 mb-2 flex items-center gap-1.5" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-sm sm:text-base font-bold font-display text-emerald-300 mt-3.5 mb-1.5 flex items-center gap-1.5" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-sm sm:text-base font-bold text-white mt-3 mb-1 flex items-center gap-1.5" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-neutral-200 leading-relaxed sm:leading-7 my-2 text-sm sm:text-base" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-white tracking-wide" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="text-emerald-300 not-italic font-semibold px-1 rounded bg-emerald-500/10 border border-emerald-500/20" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="space-y-2 my-2.5 pl-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="space-y-2 my-2.5 pl-1 list-decimal list-inside text-neutral-200" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="flex items-start gap-2.5 text-neutral-200 text-sm sm:text-base leading-relaxed">
              <span className="size-2 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-[0_0_6px_#10b981]" />
              <span className="flex-1">{props.children}</span>
            </li>
          ),
          hr: () => (
            <hr className="border-white/10 my-4" />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="p-4 my-2.5 rounded-2xl bg-black/40 border-l-4 border-emerald-500 text-neutral-300 italic text-sm" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3 rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs sm:text-sm text-neutral-200 divide-y divide-white/10" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-[#080d14] text-emerald-400 font-bold uppercase text-[11px] tracking-wider" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-3 font-bold" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-2.5 border-t border-white/5" {...props} />
          ),
          code: ({ node, inline, ...props }) => (
            inline ? (
              <code className="px-1.5 py-0.5 rounded-md bg-white/10 text-emerald-300 font-mono text-xs" {...props} />
            ) : (
              <pre className="p-3.5 rounded-2xl bg-[#060a0f] border border-white/10 text-xs font-mono text-neutral-200 overflow-x-auto my-2" {...props} />
            )
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

export default function AIAssistantTab() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem("football_ai_chat_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure streaming flags are cleared on load
          return parsed.map((m) => ({ ...m, streaming: false }));
        }
      }
    } catch (e) {
      console.warn("Failed to load chat history from sessionStorage", e);
    }
    return [
      {
        id: "welcome",
        sender: "ai",
        text: "👋 Ask any tactical question, match breakdown, or player comparison.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  });
  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinkingStepIdx, setThinkingStepIdx] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [quickPrompts, setQuickPrompts] = useState(() => getRandomPrompts(6));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Persist messages across tab navigation & refreshes
  useEffect(() => {
    try {
      sessionStorage.setItem("football_ai_chat_messages", JSON.stringify(messages));
    } catch (e) {
      console.warn("Failed to save chat to sessionStorage", e);
    }
  }, [messages]);

  useEffect(() => {
    setQuickPrompts(getRandomPrompts(6));
  }, []);

  // Cycle thinking status text during loading
  useEffect(() => {
    if (!loading) {
      setThinkingStepIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setThinkingStepIdx((prev) => (prev + 1) % THINKING_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleShufflePrompts = () => {
    setQuickPrompts(getRandomPrompts(6));
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || loading) return;

    const userMsgId = `user_${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const aiMsgId = `ai_${Date.now()}`;
    const aiPlaceholder = {
      id: aiMsgId,
      sender: "ai",
      text: "",
      streaming: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg, aiPlaceholder]);
    setInputPrompt("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .slice(-8)
        .map((m) => ({ sender: m.sender, text: m.text }));

      await footballAiService.streamChat(
        query,
        history,
        (token) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, text: msg.text + token } : msg
            )
          );
        },
        () => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, streaming: false } : msg
            )
          );
          setLoading(false);
        },
        async (error) => {
          console.warn("Stream error, falling back to sync chat", error);
          try {
            const res = await footballAiService.chat(query, history);
            if (res?.response) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMsgId
                    ? { ...msg, text: res.response, streaming: false }
                    : msg
                )
              );
            }
          } catch (syncErr) {
            toast.error("Failed to communicate with Football AI.");
          } finally {
            setLoading(false);
          }
        }
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to communicate with Football AI.");
      setLoading(false);
    }
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: "👋 Ask any tactical question, match breakdown, or player comparison.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    toast.success("Chat history cleared");
  };

  return (
    <div className="flex flex-col h-[750px] rounded-3xl bg-white dark:bg-[#090e15] border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in duration-300">
      {/* Chat Top Header */}
      <div className="px-6 py-4 bg-neutral-50 dark:bg-[#0c131d] border-b border-neutral-200 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-md">
            <Bot className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-display">
                FootballAI Master
              </h3>
            </div>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Powered by Google Gemini Pro Sports Engine
            </span>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleClearChat}
          className="h-8.5 px-3 rounded-xl border-white/10 text-neutral-400 hover:text-rose-400 hover:border-rose-500/30 text-xs font-bold gap-1.5 cursor-pointer"
        >
          <Trash2 className="size-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </Button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
        {messages.map((m) => {
          const isAI = m.sender === "ai";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isAI ? "justify-start" : "justify-end"}`}
            >
              {isAI && (
                <div className="size-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-1 shadow">
                  <Sparkles className="size-4" />
                </div>
              )}

              <div
                className={`max-w-[92%] sm:max-w-[84%] rounded-3xl p-4 sm:p-5 shadow-lg relative group ${
                  isAI
                    ? "bg-white dark:bg-[#0d1622] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-neutral-100"
                    : "bg-emerald-500 text-neutral-950 font-medium font-sans"
                }`}
              >
                {/* Copy Button on hover */}
                {isAI && (
                  <button
                    onClick={() => handleCopyText(m.id, m.text)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity size-7 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center cursor-pointer"
                    title="Copy text"
                  >
                    {copiedId === m.id ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                )}

                {/* Formatted Content */}
                {isAI ? (
                  m.streaming && !m.text ? (
                    <div className="flex items-center gap-2.5 py-1 text-xs text-neutral-200">
                      <RefreshCw className="size-3.5 animate-spin text-emerald-400 shrink-0" />
                      <span className="font-semibold text-emerald-300 transition-all duration-300">
                        {THINKING_STEPS[thinkingStepIdx]}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <FormattedMessage text={m.text} />
                      {m.streaming && (
                        <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1 rounded-sm align-middle" />
                      )}
                    </div>
                  )
                ) : (
                  <div className="text-xs sm:text-sm font-semibold whitespace-pre-wrap">{m.text}</div>
                )}

                <div
                  className={`text-[10px] mt-2 font-mono ${
                    isAI ? "text-neutral-500" : "text-neutral-900 font-bold"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {!isAI && (
                <div className="size-8 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="size-4" />
                </div>
              )}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Dynamic Quick Prompt Chips */}
      <div className="px-4 sm:px-6 py-2.5 bg-neutral-100/80 dark:bg-[#0a1018] border-t border-neutral-200 dark:border-white/5 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="size-3 text-emerald-500 dark:text-emerald-400" /> Quick Ideas:
          </span>
          <button
            type="button"
            onClick={handleShufflePrompts}
            className="size-6 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/15 text-neutral-500 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center justify-center transition-colors cursor-pointer"
            title="Shuffle fresh tactical ideas"
          >
            <Shuffle className="size-3" />
          </button>
        </div>

        {quickPrompts.map((qp, idx) => (
          <button
            key={`${qp}-${idx}`}
            type="button"
            onClick={() => handleSendMessage(qp)}
            disabled={loading}
            className="px-3 py-1 rounded-xl bg-white dark:bg-white/5 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-300 border border-neutral-200 dark:border-white/10 hover:border-emerald-500/40 text-xs whitespace-nowrap transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 bg-neutral-50 dark:bg-[#0c131d] border-t border-neutral-200 dark:border-white/10 flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Ask tactical questions, compare players, request game analysis..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          disabled={loading}
          className="flex-1 h-11 px-4.5 rounded-2xl bg-white dark:bg-[#070b10] border border-neutral-300 dark:border-white/15 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
        />

        <Button
          type="submit"
          disabled={loading || !inputPrompt.trim()}
          variant="primary"
          className="h-11 px-5 rounded-2xl font-bold text-xs gap-2 shrink-0 cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          <Send className="size-3.5" />
          <span className="hidden sm:inline">Ask AI</span>
        </Button>
      </form>
    </div>
  );
}
