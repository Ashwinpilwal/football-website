import React from "react";
import { Activity, Sparkles } from "lucide-react";

export default function SessionWarmupPage() {
  return (
    <div className="min-h-screen bg-transparent text-neutral-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background stadium glows (Screen 10 reference) */}
      <div className="absolute top-1/3 size-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 size-96 bg-teal-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm">
        {/* Animated football pulse */}
        <div className="relative size-20 rounded-3xl bg-neutral-900 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-bounce">
          <Activity className="size-10 text-emerald-400 stroke-[2.5]" />
          <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Getting You Onto the Pitch...
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Warming up session tokens, calibrating live pitch radar, and syncing squad schedules.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/10">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
