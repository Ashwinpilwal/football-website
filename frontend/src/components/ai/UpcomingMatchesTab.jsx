import React, { useState } from "react";
import {
  Sparkles,
  Shield,
  Calendar,
  MapPin,
  RefreshCw,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { footballAiService } from "@/services/footballAi.service";
import MatchPredictionModal from "./MatchPredictionModal";
import toast from "react-hot-toast";

export default function UpcomingMatchesTab({ fixtures = [] }) {
  const [selectedLeague, setSelectedLeague] = useState("All");
  const [predictingId, setPredictingId] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [activeMatch, setActiveMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom Match Prediction
  const [customHome, setCustomHome] = useState("");
  const [customAway, setCustomAway] = useState("");
  const [customComp, setCustomComp] = useState("Champions League");
  const [customLoading, setCustomLoading] = useState(false);

  const leagues = ["All", "Premier League", "Spain La Liga", "Italy Serie A", "Saudi Pro League", "USA MLS"];

  const filteredMatches = fixtures.filter((m) => {
    if (selectedLeague === "All") return true;
    return m.competition?.toLowerCase().includes(selectedLeague.toLowerCase());
  });

  const handlePredict = async (match) => {
    setPredictingId(match.id);
    try {
      const res = await footballAiService.predictMatch({
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        competition: match.competition,
        date: match.date,
      });

      if (res?.prediction) {
        setPredictionResult(res.prediction);
        setActiveMatch(match);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate prediction.");
    } finally {
      setPredictingId(null);
    }
  };

  const handleCustomPredict = async (e) => {
    e.preventDefault();
    if (!customHome.trim() || !customAway.trim()) {
      toast.error("Please enter both home and away team names.");
      return;
    }

    setCustomLoading(true);
    try {
      const res = await footballAiService.predictMatch({
        homeTeam: customHome,
        awayTeam: customAway,
        competition: customComp,
        date: "Upcoming Clash",
      });

      if (res?.prediction) {
        setPredictionResult(res.prediction);
        setActiveMatch({
          homeTeam: customHome,
          awayTeam: customAway,
          competition: customComp,
        });
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to forecast match.");
    } finally {
      setCustomLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#090e15] border border-white/10 shadow-xl">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <TrendingUp className="size-5 text-emerald-400" />
            Upcoming Fixtures & AI Probability Forecasting
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Run Monte Carlo-style probabilistic modeling, key 1v1 battle predictions, and score estimates.
          </p>
        </div>

        {/* League Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {leagues.map((l) => {
            const isActive = selectedLeague === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => setSelectedLeague(l)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? "bg-emerald-500 text-neutral-950 border-emerald-400 shadow-md"
                    : "bg-black/30 text-neutral-400 border-white/10 hover:text-white"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixtures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatches.map((m) => {
          const isPredicting = predictingId === m.id;
          return (
            <div
              key={m.id}
              onClick={() => handlePredict(m)}
              className="p-5 rounded-3xl bg-[#090e15] border border-white/10 hover:border-emerald-500/50 hover:bg-[#0c141f] transition-all flex flex-col justify-between space-y-4 shadow-xl group cursor-pointer"
            >
              {/* Top League & Date */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 text-[10px]">
                  {m.competition}
                </span>
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Calendar className="size-3 text-neutral-500" />
                  {m.date}
                </span>
              </div>

              {/* Teams Clash */}
              <div className="flex items-center justify-between gap-3 py-3">
                {/* Home */}
                <div className="flex flex-col items-center text-center flex-1 min-w-0">
                  <div className="size-13 rounded-2xl bg-black/60 p-2 border border-white/5 flex items-center justify-center mb-1.5 shadow group-hover:scale-105 transition-transform">
                    {m.homeLogo ? (
                      <img
                        src={m.homeLogo}
                        alt={m.homeTeam}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <Shield className="size-6 text-neutral-500" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white truncate max-w-full">
                    {m.homeTeam}
                  </span>
                </div>

                {/* VS Badge */}
                <div className="flex flex-col items-center justify-center shrink-0 px-2">
                  <span className="size-8 rounded-full bg-white/5 border border-white/10 text-[11px] font-black text-emerald-400 font-display flex items-center justify-center shadow-inner">
                    VS
                  </span>
                </div>

                {/* Away */}
                <div className="flex flex-col items-center text-center flex-1 min-w-0">
                  <div className="size-13 rounded-2xl bg-black/60 p-2 border border-white/5 flex items-center justify-center mb-1.5 shadow group-hover:scale-105 transition-transform">
                    {m.awayLogo ? (
                      <img
                        src={m.awayLogo}
                        alt={m.awayTeam}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <Shield className="size-6 text-neutral-500" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white truncate max-w-full">
                    {m.awayTeam}
                  </span>
                </div>
              </div>

              {/* Stadium & Prediction Trigger */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                <span className="text-[11px] text-neutral-400 truncate flex items-center gap-1">
                  <MapPin className="size-3 text-neutral-500 shrink-0" />
                  {m.stadium || "Match Arena"}
                </span>

                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  disabled={isPredicting}
                  onClick={() => handlePredict(m)}
                  className="h-8.5 px-3 rounded-xl text-xs font-bold gap-1.5 shrink-0 cursor-pointer shadow-md shadow-emerald-500/15"
                >
                  {isPredicting ? (
                    <>
                      <RefreshCw className="size-3 animate-spin" /> Forecasting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5" /> AI Prediction
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Match Prediction Form */}
      <div className="p-6 rounded-3xl bg-[#090e15] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <Zap className="size-4.5 text-emerald-400" />
          <h4 className="text-sm font-bold text-white font-display">
            Simulate & Predict Any Custom Matchup
          </h4>
        </div>

        <form onSubmit={handleCustomPredict} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Home Club / Country (e.g. France)"
            value={customHome}
            onChange={(e) => setCustomHome(e.target.value)}
            className="h-10 px-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            required
          />

          <input
            type="text"
            placeholder="Away Club / Country (e.g. Argentina)"
            value={customAway}
            onChange={(e) => setCustomAway(e.target.value)}
            className="h-10 px-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            required
          />

          <Button
            type="submit"
            disabled={customLoading}
            variant="primary"
            className="h-10 rounded-xl text-xs font-bold gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            {customLoading ? (
              <>
                <RefreshCw className="size-3.5 animate-spin" /> Simulating...
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" /> Predict Outcome
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Prediction Modal */}
      <MatchPredictionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prediction={predictionResult}
        match={activeMatch}
      />
    </div>
  );
}
