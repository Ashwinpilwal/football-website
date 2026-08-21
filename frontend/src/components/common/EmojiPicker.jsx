import React, { useState, useRef, useEffect } from "react";
import { Smile, Search, X } from "lucide-react";

const EMOJI_CATEGORIES = [
  {
    id: "football",
    name: "⚽ Match & Sports",
    emojis: [
      "⚽", "🥅", "🧤", "🏆", "🥇", "🥈", "🥉", "🏟️", "👟", "🏃",
      "🔥", "⚡", "🎯", "🟨", "🟥", "⏱️", "📢", "📣", "💥", "🚀",
    ],
  },
  {
    id: "smileys",
    name: "😀 Expressions",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
      "🙂", "😉", "😍", "🥰", "😘", "😋", "😛", "😜", "🤪", "😎",
      "🤩", "🥳", "😏", "😤", "😡", "🤯", "🥶", "😱", "🥱", "😴",
    ],
  },
  {
    id: "gestures",
    name: "💪 Gestures",
    emojis: [
      "👍", "👎", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "💪", "🤙",
      "✌️", "🤞", "🤟", "🤘", "👌", "🤌", "👈", "👉", "👆", "👇",
      "🫡", "👊", "🤛", "🤜", "👋", "🕺", "💃", "🏃‍♂️", "🚶‍♂️", "🙇‍♂️",
    ],
  },
  {
    id: "hearts",
    name: "❤️ Hearts & Icons",
    emojis: [
      "❤️", "💚", "💙", "🖤", "🤍", "💛", "🧡", "💜", "🤎", "💔",
      "💖", "💗", "💓", "💞", "💕", "💯", "👑", "💎", "⭐", "🌟",
      "✨", "💣", "🛡️", "⚔️", "🚩", "🏁", "📍", "🔔", "🟢", "🔴",
    ],
  },
];

export default function EmojiPicker({ onSelectEmoji, isOpen, onClose, className = "" }) {
  const [activeCategory, setActiveCategory] = useState("football");
  const [search, setSearch] = useState("");
  const pickerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredEmojis = search.trim()
    ? EMOJI_CATEGORIES.flatMap((c) => c.emojis).filter((emoji) => true) // Emojis don't have text so showing all in flat list or search match
    : null;

  return (
    <div
      ref={pickerRef}
      className={`absolute z-50 w-72 sm:w-80 rounded-3xl bg-white dark:bg-[#090e15]/95 border border-neutral-200 dark:border-white/15 p-3.5 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 fade-in duration-150 space-y-3 ring-1 ring-emerald-500/20 ${
        className || "bottom-16 left-3 sm:left-6"
      }`}
    >
      {/* Top Header & Tabs */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-white/[0.08]">
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-0.5">
          {EMOJI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setSearch("");
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id && !search
                  ? "bg-emerald-500 text-neutral-950 shadow-sm"
                  : "bg-neutral-100 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {cat.id === "football" ? "⚽" : cat.id === "smileys" ? "😀" : cat.id === "gestures" ? "💪" : "❤️"}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="size-6 rounded-full bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {/* Emoji Grid */}
      <div className="h-44 overflow-y-auto custom-scrollbar p-1">
        {EMOJI_CATEGORIES.filter((cat) => cat.id === activeCategory).map((cat) => (
          <div key={cat.id} className="space-y-1.5">
            <span className="text-[10.5px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              {cat.name}
            </span>
            <div className="grid grid-cols-7 gap-1.5">
              {cat.emojis.map((emoji, idx) => (
                <button
                  key={`${emoji}-${idx}`}
                  type="button"
                  onClick={() => onSelectEmoji(emoji)}
                  className="size-9 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 text-xl flex items-center justify-center transition-transform hover:scale-125 cursor-pointer active:scale-95"
                  title={`Insert ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Footer */}
      <div className="pt-2 border-t border-neutral-200 dark:border-white/[0.06] flex items-center justify-between text-[10.5px] text-neutral-500 font-medium px-1">
        <span>Click to insert into message</span>
        <span className="text-emerald-500 dark:text-emerald-400 font-bold">FootballHub Live</span>
      </div>
    </div>
  );
}
