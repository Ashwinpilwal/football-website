import React from "react";
import { Hammer, Radio, Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LiveMatchesPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Icon with glow */}
      <div className="relative">
        <div className="size-20 sm:size-24 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-2xl shadow-amber-500/10">
          <Construction className="size-10 sm:size-12 text-amber-400 animate-bounce duration-1000" />
        </div>
        <span className="absolute -top-1 -right-1 size-5 rounded-full bg-red-500 flex items-center justify-center ring-4 ring-[#080d14]">
          <Radio className="size-2.5 text-white animate-pulse" />
        </span>
      </div>

      {/* Texts */}
      <div className="space-y-2 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-400 uppercase tracking-widest font-mono">
          <Hammer className="size-3.5" /> Feature In Progress
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
          Under Construction
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          The real-time live match broadcast & scores center is currently being built. Stay tuned for kickoff!
        </p>
      </div>

      {/* Action */}
      <Link to="/">
        <Button variant="secondary" size="sm" className="rounded-2xl px-5 text-xs font-bold gap-2 cursor-pointer">
          <ArrowLeft className="size-3.5" /> Back to Home Feed
        </Button>
      </Link>
    </div>
  );
}
