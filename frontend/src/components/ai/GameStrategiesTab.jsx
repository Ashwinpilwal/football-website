import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { footballAiService } from "@/services/footballAi.service";
import StrategyModal from "./StrategyModal";
import toast from "react-hot-toast";

const STRATEGIES_PLAYBOOK = [
  {
    id: "gegenpressing",
    name: "Gegenpressing",
    formation: "4-3-3 / 4-2-3-1",
    badge: "HIGH INTENSITY",
    tagline: "Immediate ball-recovery press upon turnover.",
    iconicTeams: "Klopp's Liverpool 2019, Rangnick's Leipzig",
    pitchDots: [
      { top: "92%", left: "50%", role: "GK" },
      { top: "78%", left: "18%", role: "LB" },
      { top: "82%", left: "38%", role: "CB" },
      { top: "82%", left: "62%", role: "CB" },
      { top: "78%", left: "82%", role: "RB" },
      { top: "60%", left: "50%", role: "DM" },
      { top: "46%", left: "32%", role: "LCM" },
      { top: "46%", left: "68%", role: "RCM" },
      { top: "24%", left: "20%", role: "LW" },
      { top: "16%", left: "50%", role: "ST" },
      { top: "24%", left: "80%", role: "RW" },
    ],
  },
  {
    id: "low_block",
    name: "Low Block & Counter",
    formation: "5-4-1 / 4-4-2",
    badge: "DEFENSIVE DISCIPLINE",
    tagline: "Ultra-compact deep wall striking on vertical transitions.",
    iconicTeams: "Simeone's Atlético Madrid, Mourinho's Inter 2010",
    pitchDots: [
      { top: "92%", left: "50%", role: "GK" },
      { top: "83%", left: "14%", role: "LWB" },
      { top: "85%", left: "32%", role: "LCB" },
      { top: "87%", left: "50%", role: "CB" },
      { top: "85%", left: "68%", role: "RCB" },
      { top: "83%", left: "86%", role: "RWB" },
      { top: "68%", left: "20%", role: "LM" },
      { top: "70%", left: "40%", role: "LCM" },
      { top: "70%", left: "60%", role: "RCM" },
      { top: "68%", left: "80%", role: "RM" },
      { top: "38%", left: "50%", role: "ST" },
    ],
  },
  {
    id: "tiki_taka",
    name: "Tiki-Taka / Positional Play",
    formation: "4-3-3",
    badge: "POSSESSION MASTERY",
    tagline: "Continuous passing triangles and half-space overloads.",
    iconicTeams: "Pep's Barcelona 2011, Spain 2010 World Cup",
    pitchDots: [
      { top: "92%", left: "50%", role: "GK" },
      { top: "72%", left: "18%", role: "LB" },
      { top: "78%", left: "38%", role: "CB" },
      { top: "78%", left: "62%", role: "CB" },
      { top: "72%", left: "82%", role: "RB" },
      { top: "58%", left: "50%", role: "DM" },
      { top: "42%", left: "32%", role: "LCM" },
      { top: "42%", left: "68%", role: "RCM" },
      { top: "20%", left: "18%", role: "LW" },
      { top: "26%", left: "50%", role: "F9" },
      { top: "20%", left: "82%", role: "RW" },
    ],
  },
  {
    id: "4231_system",
    name: "Modern 4-2-3-1 Fluidity",
    formation: "4-2-3-1",
    badge: "TACTICAL BALANCE",
    tagline: "Double-pivot security paired with an explosive creative #10.",
    iconicTeams: "Heynckes' Bayern 2013, Deschamps' France 2018",
    pitchDots: [
      { top: "92%", left: "50%", role: "GK" },
      { top: "76%", left: "18%", role: "LB" },
      { top: "80%", left: "38%", role: "CB" },
      { top: "80%", left: "62%", role: "CB" },
      { top: "76%", left: "82%", role: "RB" },
      { top: "62%", left: "36%", role: "DM" },
      { top: "62%", left: "64%", role: "DM" },
      { top: "38%", left: "20%", role: "LAM" },
      { top: "36%", left: "50%", role: "CAM" },
      { top: "38%", left: "80%", role: "RAM" },
      { top: "16%", left: "50%", role: "ST" },
    ],
  },
  {
    id: "352_wingback",
    name: "3-5-2 Wing-Back Dominance",
    formation: "3-5-2",
    badge: "WIDTH & OVERLOADS",
    tagline: "Central defensive trio with dynamic flying fullbacks.",
    iconicTeams: "Conte's Juventus & Chelsea, Inzaghi's Inter Milan",
    pitchDots: [
      { top: "92%", left: "50%", role: "GK" },
      { top: "80%", left: "28%", role: "LCB" },
      { top: "83%", left: "50%", role: "CB" },
      { top: "80%", left: "72%", role: "RCB" },
      { top: "50%", left: "12%", role: "LWB" },
      { top: "62%", left: "50%", role: "DM" },
      { top: "46%", left: "34%", role: "LCM" },
      { top: "46%", left: "66%", role: "RCM" },
      { top: "50%", left: "88%", role: "RWB" },
      { top: "20%", left: "38%", role: "ST" },
      { top: "20%", left: "62%", role: "ST" },
    ],
  },
  {
    id: "box_midfield",
    name: "3-2-4-1 Box Midfield Build-up",
    formation: "3-2-4-1",
    badge: "HYBRID EVOLUTION",
    tagline: "Inverted fullback creating a 4v3 central box overload.",
    iconicTeams: "Guardiola's Man City (Treble 2023), Arteta's Arsenal",
    pitchDots: [
      { top: "92%", left: "50%", role: "GK" },
      { top: "80%", left: "24%", role: "LCB" },
      { top: "83%", left: "50%", role: "CB" },
      { top: "80%", left: "76%", role: "RCB" },
      { top: "64%", left: "38%", role: "DM" },
      { top: "64%", left: "62%", role: "INV" },
      { top: "34%", left: "14%", role: "LW" },
      { top: "38%", left: "38%", role: "AM" },
      { top: "38%", left: "62%", role: "AM" },
      { top: "34%", left: "86%", role: "RW" },
      { top: "16%", left: "50%", role: "ST" },
    ],
  },
  {
    id: "catenaccio",
    name: "Catenaccio & Libero Sweeper",
    formation: "1-4-3-2",
    badge: "ITALIAN FORTRESS",
    tagline: "Strict man-to-man marking with a free roaming sweeper.",
    iconicTeams: "Helenio Herrera's Grande Inter (1960s), Trapattoni",
    pitchDots: [
      { top: "94%", left: "50%", role: "GK" },
      { top: "86%", left: "50%", role: "SW" },
      { top: "78%", left: "18%", role: "LB" },
      { top: "78%", left: "38%", role: "CB" },
      { top: "78%", left: "62%", role: "CB" },
      { top: "78%", left: "82%", role: "RB" },
      { top: "60%", left: "36%", role: "DM" },
      { top: "60%", left: "64%", role: "DM" },
      { top: "44%", left: "50%", role: "CM" },
      { top: "26%", left: "38%", role: "SS" },
      { top: "16%", left: "62%", role: "ST" },
    ],
  },
  {
    id: "total_football",
    name: "Total Football Fluidity",
    formation: "4-3-3",
    badge: "TOTAL INTERCHANGE",
    tagline: "Any outfield player can seamlessly occupy any positional role.",
    iconicTeams: "Rinus Michels & Cruyff's Ajax (1970s), Netherlands 1974",
    pitchDots: [
      { top: "92%", left: "50%", role: "GK" },
      { top: "68%", left: "18%", role: "LB" },
      { top: "74%", left: "38%", role: "CB" },
      { top: "74%", left: "62%", role: "CB" },
      { top: "68%", left: "82%", role: "RB" },
      { top: "52%", left: "50%", role: "DM" },
      { top: "38%", left: "30%", role: "LCM" },
      { top: "38%", left: "70%", role: "RCM" },
      { top: "18%", left: "18%", role: "LW" },
      { top: "22%", left: "50%", role: "CF" },
      { top: "18%", left: "82%", role: "RW" },
    ],
  },
  {
    id: "diamond_midfield",
    name: "4-4-2 Diamond Midfield",
    formation: "4-1-2-1-2",
    badge: "CENTRAL OVERLOAD",
    tagline: "Suffocates the central corridor with a 4-man narrow diamond.",
    iconicTeams: "Ancelotti's AC Milan 2007, Zidane's Real Madrid 2017",
    pitchDots: [
      { top: "92%", left: "50%", role: "GK" },
      { top: "76%", left: "18%", role: "LB" },
      { top: "80%", left: "38%", role: "CB" },
      { top: "80%", left: "62%", role: "CB" },
      { top: "76%", left: "82%", role: "RB" },
      { top: "64%", left: "50%", role: "DM" },
      { top: "48%", left: "32%", role: "LCM" },
      { top: "48%", left: "68%", role: "RCM" },
      { top: "32%", left: "50%", role: "CAM" },
      { top: "16%", left: "38%", role: "LS" },
      { top: "16%", left: "62%", role: "RS" },
    ],
  },
  {
    id: "high_line_trap",
    name: "Extreme High Line & Offside Trap",
    formation: "4-2-3-1",
    badge: "OFFSIDE TRAP",
    tagline: "Aggressive suffocating line trapping attackers in offside positions.",
    iconicTeams: "Hansi Flick's Barcelona 2024 & Bayern 2020",
    pitchDots: [
      { top: "80%", left: "50%", role: "SK" },
      { top: "58%", left: "18%", role: "LB" },
      { top: "60%", left: "38%", role: "CB" },
      { top: "60%", left: "62%", role: "CB" },
      { top: "58%", left: "82%", role: "RB" },
      { top: "44%", left: "36%", role: "DM" },
      { top: "44%", left: "64%", role: "DM" },
      { top: "26%", left: "20%", role: "LAM" },
      { top: "26%", left: "50%", role: "CAM" },
      { top: "26%", left: "80%", role: "RAM" },
      { top: "12%", left: "50%", role: "ST" },
    ],
  },
  {
    id: "sarri_ball",
    name: "Sarri-ball (Vertical Tiki-Taka)",
    formation: "4-3-3",
    badge: "VERTICAL TEMPO",
    tagline: "Rapid vertical one-touch triangles breaking defensive lines.",
    iconicTeams: "Maurizio Sarri's Napoli (2017-18), Chelsea",
    pitchDots: [
      { top: "92%", left: "50%", role: "GK" },
      { top: "74%", left: "18%", role: "LB" },
      { top: "78%", left: "38%", role: "CB" },
      { top: "78%", left: "62%", role: "CB" },
      { top: "74%", left: "82%", role: "RB" },
      { top: "58%", left: "50%", role: "REG" },
      { top: "42%", left: "32%", role: "LCM" },
      { top: "42%", left: "68%", role: "RCM" },
      { top: "22%", left: "18%", role: "LW" },
      { top: "18%", left: "50%", role: "CF" },
      { top: "22%", left: "82%", role: "RW" },
    ],
  },
  {
    id: "classic_442",
    name: "Classic 4-4-2 Wing Play",
    formation: "4-4-2",
    badge: "AERIAL DOMINANCE",
    tagline: "Wide wing crossing channels feeding physical dual strikers in the box.",
    iconicTeams: "Sir Alex Ferguson's Manchester United 1999",
    pitchDots: [
      { top: "92%", left: "50%", role: "GK" },
      { top: "76%", left: "18%", role: "LB" },
      { top: "80%", left: "38%", role: "CB" },
      { top: "80%", left: "62%", role: "CB" },
      { top: "76%", left: "82%", role: "RB" },
      { top: "52%", left: "14%", role: "LM" },
      { top: "54%", left: "38%", role: "CM" },
      { top: "54%", left: "62%", role: "CM" },
      { top: "52%", left: "86%", role: "RM" },
      { top: "18%", left: "38%", role: "LS" },
      { top: "18%", left: "62%", role: "RS" },
    ],
  },
];

export default function GameStrategiesTab() {
  const [selectedTactic, setSelectedTactic] = useState(STRATEGIES_PLAYBOOK[0]);
  const [explainingId, setExplainingId] = useState(null);
  const [strategyResult, setStrategyResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeepDive = async (tactic) => {
    setExplainingId(tactic.id);
    try {
      const res = await footballAiService.explainStrategy({
        tacticName: tactic.name,
        formation: tactic.formation,
      });

      if (res?.strategy) {
        setStrategyResult(res.strategy);
        setSelectedTactic(tactic);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to analyze tactic.");
    } finally {
      setExplainingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="p-5 rounded-3xl bg-[#090e15] border border-white/10 shadow-xl flex items-center justify-between">
        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
          <BookOpen className="size-5 text-emerald-400" />
          Tactical Systems & Formations Playbook ({STRATEGIES_PLAYBOOK.length} Systems)
        </h3>
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STRATEGIES_PLAYBOOK.map((st) => {
          const isExplaining = explainingId === st.id;
          return (
            <div
              key={st.id}
              onClick={() => handleDeepDive(st)}
              className="p-5 rounded-3xl bg-[#090e15] border border-white/10 hover:border-emerald-500/40 hover:bg-[#0c141f] transition-all flex flex-col justify-between space-y-4 shadow-xl group relative overflow-hidden cursor-pointer"
            >
              {/* Top Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                    {st.badge}
                  </span>
                  <span className="text-xs font-bold text-neutral-400 font-mono">
                    {st.formation}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white font-display group-hover:text-emerald-400 transition-colors">
                  {st.name}
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                  {st.tagline}
                </p>
              </div>

              {/* Full-Length Football Tactics Board */}
              <div className="w-full py-2 flex items-center justify-center bg-black/40 rounded-2xl border border-white/5">
                <div className="w-56 sm:w-64 h-[350px] sm:h-[370px] rounded-2xl bg-[#051a11] border border-emerald-500/40 relative overflow-hidden shadow-2xl select-none">
                  {/* Grass Mowing Strips Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.025)_50%,transparent_50%)] bg-[length:100%_36px] pointer-events-none" />

                  {/* Halfway Line & Center Circle */}
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-emerald-500/30 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 rounded-full border border-emerald-500/30 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-emerald-500/50 pointer-events-none" />

                  {/* Attacking Penalty Area & D-Box (Top) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-14 border-b border-x border-emerald-500/30 pointer-events-none" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-6 border-b border-x border-emerald-500/25 pointer-events-none" />
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 w-16 h-8 rounded-b-full border-b border-x border-emerald-500/20 pointer-events-none" />

                  {/* Defending Penalty Area & D-Box (Bottom) */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-14 border-t border-x border-emerald-500/30 pointer-events-none" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-6 border-t border-x border-emerald-500/25 pointer-events-none" />
                  <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-16 h-8 rounded-t-full border-t border-x border-emerald-500/20 pointer-events-none" />

                  {/* Corner Arcs */}
                  <div className="absolute top-0 left-0 size-3 rounded-br-full border-r border-b border-emerald-500/25 pointer-events-none" />
                  <div className="absolute top-0 right-0 size-3 rounded-bl-full border-l border-b border-emerald-500/25 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 size-3 rounded-tr-full border-r border-t border-emerald-500/25 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 size-3 rounded-tl-full border-l border-t border-emerald-500/25 pointer-events-none" />

                  {/* Player Tactical Dots */}
                  {st.pitchDots.map((dot, dIdx) => (
                    <div
                      key={dIdx}
                      style={{ top: dot.top, left: dot.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 size-6 rounded-full bg-emerald-400 border border-neutral-950 text-[10px] font-black text-neutral-950 flex items-center justify-center shadow-[0_0_10px_#10b981] group-hover:scale-110 transition-transform cursor-pointer z-10"
                      title={dot.role}
                    >
                      {dot.role}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button & Mastered info in separate lines */}
              <div className="pt-3 border-t border-white/5 flex flex-col gap-2.5">
                <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                  <span>Mastered by:</span>
                  <strong className="text-white font-semibold">{st.iconicTeams.split(",")[0]}</strong>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  disabled={isExplaining}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeepDive(st);
                  }}
                  className="w-full h-9 rounded-xl text-xs font-bold gap-2 cursor-pointer shadow-md shadow-emerald-500/20 flex items-center justify-center"
                >
                  {isExplaining ? (
                    <>
                      <RefreshCw className="size-3 animate-spin" /> Deep Diving...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5" /> Ask AI Breakdown
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategy Detail Modal */}
      <StrategyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        strategy={strategyResult}
        tactic={selectedTactic}
      />
    </div>
  );
}
