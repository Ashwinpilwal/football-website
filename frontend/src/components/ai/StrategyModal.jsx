import React from "react";
import { X, BookOpen, Shield, Target, Trophy, UserCheck, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StrategyModal({ isOpen, onClose, strategy, tactic }) {
  if (!isOpen || !strategy) return null;

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
            <BookOpen className="size-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
              Tactical Playbook Deep Dive
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold font-display text-white">
              {strategy.tacticName || tactic?.name}
            </h2>
          </div>
        </div>

        {/* Core Philosophy Banner */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold text-xs sm:text-sm flex items-start gap-2.5">
          <Zap className="size-4.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{strategy.corePhilosophy}</span>
        </div>

        {/* Buildup & Defensive Phases */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#0c1420] border border-white/10 space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
              ⚽ Buildup & Attacking Phase
            </span>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {strategy.buildupPhase}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c1420] border border-white/10 space-y-1.5">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
              🛡️ Defensive & Pressing Structure
            </span>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {strategy.defensivePhase}
            </p>
          </div>
        </div>

        {/* Key Principles */}
        {strategy.keyPrinciples?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Core Principles & Rules
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {strategy.keyPrinciples.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-black/40 border border-white/5 text-xs text-neutral-200 flex items-start gap-2"
                >
                  <span className="size-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {strategy.strengths?.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
              <strong className="text-emerald-400 block font-bold uppercase tracking-wider text-[11px]">
                Tactical Advantages:
              </strong>
              <ul className="list-disc list-inside text-neutral-300 space-y-0.5">
                {strategy.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {strategy.weaknesses?.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
              <strong className="text-rose-400 block font-bold uppercase tracking-wider text-[11px]">
                Counter-Exploits & Risks:
              </strong>
              <ul className="list-disc list-inside text-neutral-300 space-y-0.5">
                {strategy.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Iconic Teams */}
        {strategy.iconicTeams?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="size-3.5 text-amber-400" /> Iconic Teams That Mastered It
            </h4>
            <div className="space-y-2">
              {strategy.iconicTeams.map((it, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#0f1b26] border border-white/10 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <strong className="text-white block text-sm">{it.team}</strong>
                    <span className="text-emerald-400 font-medium">{it.manager}</span>
                    <p className="text-neutral-400 mt-1">{it.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={onClose}
            variant="secondary"
            className="rounded-2xl px-6 text-xs font-bold cursor-pointer"
          >
            Close Playbook
          </Button>
        </div>
      </div>
    </div>
  );
}
