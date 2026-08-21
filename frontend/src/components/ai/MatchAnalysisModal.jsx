import React from "react";
import { X, Shield, Activity, Award, Flame, Zap, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MatchAnalysisModal({ isOpen, onClose, analysis, match }) {
  if (!isOpen || !analysis) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto overscroll-contain rounded-3xl bg-[#0a0f16] border border-white/15 p-6 shadow-xl space-y-6 scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 size-9 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg">
            <Activity className="size-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
              AI Tactical Match Breakdown
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold font-display text-white">
              {match ? `${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}` : "Match Analysis"}
            </h2>
          </div>
        </div>

        {/* Headline Banner */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold text-xs sm:text-sm flex items-start gap-2.5">
          <Zap className="size-4.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{analysis.matchHeadline || "Tactical Dissection Completed"}</span>
        </div>

        {/* Overview */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Match Story & Context
          </h4>
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed bg-black/40 p-3.5 rounded-2xl border border-white/5">
            {analysis.tacticalOverview}
          </p>
        </div>

        {/* Tactical Approaches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Home Team */}
          <div className="p-4 rounded-2xl bg-[#0d1520] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Shield className="size-3.5 text-emerald-400" />
                {match?.homeTeam || "Home Team"}
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {analysis.homeTactics?.formation || "4-3-3"}
              </span>
            </div>
            <p className="text-xs text-neutral-300 font-medium">
              {analysis.homeTactics?.style}
            </p>
            {analysis.homeTactics?.keyStrengths?.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Strengths:</span>
                <ul className="text-xs text-neutral-400 space-y-0.5 list-disc list-inside">
                  {analysis.homeTactics.keyStrengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="p-4 rounded-2xl bg-[#0d1520] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Shield className="size-3.5 text-sky-400" />
                {match?.awayTeam || "Away Team"}
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/30">
                {analysis.awayTactics?.formation || "4-2-3-1"}
              </span>
            </div>
            <p className="text-xs text-neutral-300 font-medium">
              {analysis.awayTactics?.style}
            </p>
            {analysis.awayTactics?.keyStrengths?.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Strengths:</span>
                <ul className="text-xs text-neutral-400 space-y-0.5 list-disc list-inside">
                  {analysis.awayTactics.keyStrengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Key Turning Points */}
        {analysis.keyTurningPoints?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="size-3.5 text-amber-400" /> Key Turning Points
            </h4>
            <div className="space-y-2">
              {analysis.keyTurningPoints.map((tp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3 text-xs"
                >
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 shrink-0">
                    {tp.minute}
                  </span>
                  <span className="text-neutral-200 mt-0.5">{tp.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Player of the Match */}
        {analysis.playerOfTheMatch && (
          <div className="p-4 rounded-2xl bg-[#0f1b26] border border-emerald-500/30 flex items-start gap-3.5">
            <div className="size-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/40">
              <Award className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">
                  {analysis.playerOfTheMatch.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-mono">
                  {analysis.playerOfTheMatch.role}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  ★ Player of the Match
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                {analysis.playerOfTheMatch.tacticalImpact}
              </p>
            </div>
          </div>
        )}

        {/* Tactical Verdict */}
        {analysis.tacticalVerdict && (
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-neutral-300">
            <strong className="text-white block mb-0.5">Tactical Verdict:</strong>
            {analysis.tacticalVerdict}
          </div>
        )}

        {/* Footer Action */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={onClose}
            variant="secondary"
            className="rounded-2xl px-6 text-xs font-bold cursor-pointer"
          >
            Close Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
