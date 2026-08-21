import React, { useState } from "react";
import {
  Activity,
  Shield,
  Search,
  Sparkles,
  Calendar,
  MapPin,
  RefreshCw,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { footballAiService } from "@/services/footballAi.service";
import MatchAnalysisModal from "./MatchAnalysisModal";
import toast from "react-hot-toast";

export default function PastMatchesTab({ fixtures = [] }) {
  const [selectedLeague, setSelectedLeague] = useState("All");
  const [analyzingId, setAnalyzingId] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeMatch, setActiveMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom Match Analysis Inputs
  const [customHome, setCustomHome] = useState("");
  const [customAway, setCustomAway] = useState("");
  const [customScore, setCustomScore] = useState("");
  const [customCompetition, setCustomCompetition] = useState("Champions League");
  const [customLoading, setCustomLoading] = useState(false);

  const leagues = ["All", "Premier League", "Spain La Liga", "Germany Bundesliga", "Italy Serie A", "France Ligue 1"];

  const filteredMatches = fixtures.filter((m) => {
    if (selectedLeague === "All") return true;
    return m.competition?.toLowerCase().includes(selectedLeague.toLowerCase());
  });

  const handleAnalyze = async (match) => {
    setAnalyzingId(match.id);
    try {
      const res = await footballAiService.analyzeMatch({
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        score: `${match.homeScore} - ${match.awayScore}`,
        competition: match.competition,
        date: match.date,
      });

      if (res?.analysis) {
        setAnalysisResult(res.analysis);
        setActiveMatch(match);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to analyze match.");
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleCustomAnalyze = async (e) => {
    e.preventDefault();
    if (!customHome.trim() || !customAway.trim()) {
      toast.error("Please enter both home and away team names.");
      return;
    }

    setCustomLoading(true);
    try {
      const res = await footballAiService.analyzeMatch({
        homeTeam: customHome,
        awayTeam: customAway,
        score: customScore || "Completed Match",
        competition: customCompetition,
        date: "Classic Match",
      });

      if (res?.analysis) {
        setAnalysisResult(res.analysis);
        setActiveMatch({
          homeTeam: customHome,
          awayTeam: customAway,
          homeScore: customScore ? customScore.split("-")[0] : "",
          awayScore: customScore ? customScore.split("-")[1] : "",
          competition: customCompetition,
        });
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate tactical analysis.");
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
            <Activity className="size-5 text-emerald-400" />
            Past Match Results & Tactical Breakdown
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Click any match to run full AI tactical dissection with pressing phases, turning points & MOM.
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

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatches.map((m) => {
          const isAnalyzing = analyzingId === m.id;
          return (
            <div
              key={m.id}
              onClick={() => handleAnalyze(m)}
              className="p-5 rounded-3xl bg-[#090e15] border border-white/10 hover:border-emerald-500/50 hover:bg-[#0c141f] transition-all flex flex-col justify-between space-y-4 shadow-xl group cursor-pointer"
            >
              {/* Top League & Date */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 text-[10px]">
                  {m.competition}
                </span>
                <span className="text-[11px] text-neutral-400">{m.date}</span>
              </div>

              {/* Teams & Scoreline */}
              <div className="flex items-center justify-between gap-3 py-2">
                {/* Home */}
                <div className="flex flex-col items-center text-center flex-1 min-w-0">
                  <div className="size-12 rounded-2xl bg-black/60 p-2 border border-white/5 flex items-center justify-center mb-1.5 shadow">
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

                {/* Score */}
                <div className="flex flex-col items-center justify-center shrink-0 px-3">
                  <div className="text-xl sm:text-2xl font-black font-display text-white tracking-wider bg-white/5 px-3 py-1 rounded-xl border border-white/10">
                    {m.homeScore} - {m.awayScore}
                  </div>
                  <span className="text-[9px] font-bold text-neutral-400 mt-1 uppercase font-mono">
                    Full Time
                  </span>
                </div>

                {/* Away */}
                <div className="flex flex-col items-center text-center flex-1 min-w-0">
                  <div className="size-12 rounded-2xl bg-black/60 p-2 border border-white/5 flex items-center justify-center mb-1.5 shadow">
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

              {/* Stadium & Action Button */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                <span className="text-[11px] text-neutral-400 truncate flex items-center gap-1">
                  <MapPin className="size-3 text-neutral-500 shrink-0" />
                  {m.stadium || "Football Stadium"}
                </span>

                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  disabled={isAnalyzing}
                  onClick={() => handleAnalyze(m)}
                  className="h-8.5 px-3 rounded-xl text-xs font-bold gap-1.5 shrink-0 cursor-pointer shadow-md"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="size-3 animate-spin" /> Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5" /> Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Match Tactical Analyzer Form */}
      <div className="p-6 rounded-3xl bg-[#090e15] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <Zap className="size-4.5 text-emerald-400" />
          <h4 className="text-sm font-bold text-white font-display">
            Analyze Any Custom / Historical Match
          </h4>
        </div>

        <form onSubmit={handleCustomAnalyze} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Home Team (e.g. Arsenal)"
            value={customHome}
            onChange={(e) => setCustomHome(e.target.value)}
            className="h-10 px-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            required
          />

          <input
            type="text"
            placeholder="Score (e.g. 2-1 or 3-3)"
            value={customScore}
            onChange={(e) => setCustomScore(e.target.value)}
            className="h-10 px-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          />

          <input
            type="text"
            placeholder="Away Team (e.g. Real Madrid)"
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
                <RefreshCw className="size-3.5 animate-spin" /> Dissecting...
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" /> Dissect Match
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Analysis Modal */}
      <MatchAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        analysis={analysisResult}
        match={activeMatch}
      />
    </div>
  );
}
