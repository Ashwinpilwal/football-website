import React from "react";
import { X, Sparkles, TrendingUp, Shield, Swords, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MatchPredictionModal({ isOpen, onClose, prediction, match }) {
  if (!isOpen || !prediction) return null;

  const probs = prediction.probabilities || { homeWin: 45, draw: 25, awayWin: 30 };

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
            <Sparkles className="size-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
              AI Match Prediction & Probability Forecast
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold font-display text-white">
              {match ? `${match.homeTeam} vs ${match.awayTeam}` : "Upcoming Match Prediction"}
            </h2>
          </div>
        </div>

        {/* Headline & Expected Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0d1622] border border-white/10">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Predicted Scoreline
            </span>
            <div className="text-2xl font-black font-display text-emerald-400">
              {prediction.expectedScoreline || "2 - 1"}
            </div>
          </div>
          <div className="text-right sm:text-right">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              AI Confidence Index
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
              <CheckCircle2 className="size-3.5" /> {prediction.aiConfidence || "High (82%)"}
            </span>
          </div>
        </div>

        {/* Win / Draw / Loss Probability Bar */}
        <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/5">
          <div className="flex justify-between text-xs font-bold text-white mb-1">
            <span className="text-emerald-400 font-bold">{match?.homeTeam || "Home"}: {probs.homeWin}%</span>
            <span className="text-sky-400 font-bold">{match?.awayTeam || "Away"}: {probs.awayWin}%</span>
          </div>

          <div className="h-8 w-full rounded-xl bg-white/10 overflow-hidden flex shadow-inner border border-white/10 text-[11px] font-black tracking-wide">
            <div
              style={{ width: `${probs.homeWin}%` }}
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-neutral-950 flex items-center justify-center transition-all duration-500 truncate px-1"
              title={`Home Win: ${probs.homeWin}%`}
            >
              {probs.homeWin >= 12 ? `${match?.homeTeam ? match.homeTeam.slice(0, 10) : 'Win'} ${probs.homeWin}%` : `${probs.homeWin}%`}
            </div>
            <div
              style={{ width: `${probs.draw}%` }}
              className="bg-neutral-600 text-white flex items-center justify-center transition-all duration-500 truncate px-1 text-center font-black"
              title={`Draw: ${probs.draw}%`}
            >
              Draw: {probs.draw}%
            </div>
            <div
              style={{ width: `${probs.awayWin}%` }}
              className="bg-gradient-to-r from-sky-500 to-sky-600 text-neutral-950 flex items-center justify-center transition-all duration-500 truncate px-1"
              title={`Away Win: ${probs.awayWin}%`}
            >
              {probs.awayWin >= 12 ? `${match?.awayTeam ? match.awayTeam.slice(0, 10) : 'Win'} ${probs.awayWin}%` : `${probs.awayWin}%`}
            </div>
          </div>
        </div>

        {/* Tactical Story */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Tactical Match Preview
          </h4>
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed bg-black/30 p-3.5 rounded-2xl border border-white/5">
            {prediction.tacticalPreview}
          </p>
        </div>

        {/* Expected Setups */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#0c141f] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Shield className="size-3.5 text-emerald-400" />
                {match?.homeTeam || "Home Setup"}
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-400">
                {prediction.homeExpectedSetup?.likelyFormation || "4-3-3"}
              </span>
            </div>
            <p className="text-xs text-neutral-300">
              {prediction.homeExpectedSetup?.tacticalPlan}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c141f] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Shield className="size-3.5 text-sky-400" />
                {match?.awayTeam || "Away Setup"}
              </span>
              <span className="text-[11px] font-mono font-bold text-sky-400">
                {prediction.awayExpectedSetup?.likelyFormation || "4-2-3-1"}
              </span>
            </div>
            <p className="text-xs text-neutral-300">
              {prediction.awayExpectedSetup?.tacticalPlan}
            </p>
          </div>
        </div>

        {/* Key Battles */}
        {prediction.keyMatchups?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Swords className="size-3.5 text-amber-400" /> Key 1v1 Battles
            </h4>
            <div className="space-y-2">
              {prediction.keyMatchups.map((km, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-black/40 border border-white/5 text-xs space-y-0.5"
                >
                  <strong className="text-amber-300 block">{km.battle}</strong>
                  <p className="text-neutral-300">{km.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Factors */}
        {prediction.riskFactors?.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-neutral-300 space-y-1">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="size-3.5" /> Potential X-Factors & Risks:
            </span>
            <ul className="list-disc list-inside text-neutral-300 space-y-0.5">
              {prediction.riskFactors.map((rf, i) => (
                <li key={i}>{rf}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={onClose}
            variant="secondary"
            className="rounded-2xl px-6 text-xs font-bold cursor-pointer"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
