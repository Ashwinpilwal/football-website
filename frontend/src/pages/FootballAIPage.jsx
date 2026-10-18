import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Activity,
  TrendingUp,
  BookOpen,
  Zap,
  Flame,
  Layers,
  Radio,
} from "lucide-react";
import AIAssistantTab from "@/components/ai/AIAssistantTab";
import PastMatchesTab from "@/components/ai/PastMatchesTab";
import UpcomingMatchesTab from "@/components/ai/UpcomingMatchesTab";
import GameStrategiesTab from "@/components/ai/GameStrategiesTab";
import { footballAiService } from "@/services/footballAi.service";
import { getDynamicFixtures } from "@/data/aiFixtures";

export default function FootballAIPage() {
  const [activeTab, setActiveTab] = useState("assistant");
  const [fixtures, setFixtures] = useState(() => getDynamicFixtures());
  const [loadingFixtures, setLoadingFixtures] = useState(false);

  const loadFixtures = async () => {
    setLoadingFixtures(true);
    try {
      const res = await footballAiService.getFixtures();
      if (res?.data) {
        setFixtures(res.data);
      } else {
        setFixtures(getDynamicFixtures());
      }
    } catch (e) {
      setFixtures(getDynamicFixtures());
    } finally {
      setLoadingFixtures(false);
    }
  };

  useEffect(() => {
    loadFixtures();
  }, []);

  const tabs = [
    { id: "assistant", name: "AI Assistant", icon: Bot, badge: "SMART" },
    { id: "past", name: "Past Matches & Analysis", icon: Activity, count: fixtures.pastMatches?.length },
    { id: "upcoming", name: "Upcoming Predictions", icon: TrendingUp, count: fixtures.upcomingMatches?.length },
    { id: "strategies", name: "Game Strategies", icon: BookOpen, badge: "PLAYBOOK" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-gradient-to-r dark:from-[#071318] dark:via-[#091a22] dark:to-[#0a1018] border border-neutral-200 dark:border-emerald-500/20 p-6 sm:p-8 shadow-2xl">
        {/* Lightweight background gradient without blur filters */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">
                Next-Gen Football Intelligence Engine
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-neutral-900 dark:text-white tracking-tight">
              Football AI Analytics & Assistant
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`h-11 px-4 sm:px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap border shrink-0 ${
                isActive
                  ? "bg-emerald-500 text-neutral-950 border-emerald-400 shadow-lg shadow-emerald-500/20"
                  : "bg-white dark:bg-[#090e15] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-white/10 hover:text-black dark:hover:text-white hover:border-neutral-300 dark:hover:border-white/20 shadow-sm"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span>{tab.name}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md font-bold ${
                    isActive ? "bg-black/20 text-neutral-950" : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
              {tab.count !== undefined && (
                <span
                  className={`size-5 rounded-full text-[10px] font-mono flex items-center justify-center font-bold ${
                    isActive ? "bg-black/20 text-neutral-950" : "bg-white/10 text-neutral-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Persistent Tab Panels - Preserves state and streaming when switching tabs */}
      <div>
        <div className={activeTab === "assistant" ? "block" : "hidden"}>
          <AIAssistantTab />
        </div>
        <div className={activeTab === "past" ? "block" : "hidden"}>
          <PastMatchesTab fixtures={fixtures.pastMatches} />
        </div>
        <div className={activeTab === "upcoming" ? "block" : "hidden"}>
          <UpcomingMatchesTab fixtures={fixtures.upcomingMatches} />
        </div>
        <div className={activeTab === "strategies" ? "block" : "hidden"}>
          <GameStrategiesTab />
        </div>
      </div>
    </div>
  );
}
