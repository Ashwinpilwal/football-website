import React, { useState, useMemo } from "react";
import { Search, Shield, Check, ChevronDown, ChevronUp, Sparkles, X } from "lucide-react";
import { clubsByLeague } from "@/data/clubsByLeague";

export default function LeagueClubPicker({
  selectedClub = "",
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLeagueId, setActiveLeagueId] = useState(
    clubsByLeague[0]?.leagueId || "english-premier-league-2026-2027.football-logos.cc"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Flatten all clubs
  const allClubs = useMemo(() => {
    return clubsByLeague.flatMap((l) =>
      l.clubs.map((c) => ({
        ...c,
        leagueName: l.leagueName,
        leagueId: l.leagueId,
      }))
    );
  }, []);

  // Find currently selected club object
  const currentClubObj = useMemo(() => {
    return (
      allClubs.find(
        (c) => c.name.toLowerCase() === (selectedClub || "").toLowerCase()
      ) || {
        name: selectedClub || "Select Club",
        image: "/club/english-premier-league-2026-2027.football-logos.cc/arsenal.football-logos.cc.png",
      }
    );
  }, [allClubs, selectedClub]);

  const activeLeague = useMemo(() => {
    return (
      clubsByLeague.find((l) => l.leagueId === activeLeagueId) ||
      clubsByLeague[0]
    );
  }, [activeLeagueId]);

  const displayedClubs = useMemo(() => {
    if (searchQuery.trim()) {
      return allClubs.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          c.leagueName.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }
    return activeLeague?.clubs || [];
  }, [allClubs, activeLeague, searchQuery]);

  return (
    <div className="space-y-2">
      <label className="text-xs text-neutral-300 font-semibold block">
        Favourite Football Club
      </label>

      {/* Collapsed Active Club Trigger Card */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-3 rounded-2xl bg-[#0b1118] border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-lg group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-xl bg-black/60 p-1.5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <img
              src={currentClubObj.image}
              alt={currentClubObj.name}
              className="w-full h-full object-contain drop-shadow"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate font-display group-hover:text-emerald-400 transition-colors">
              {currentClubObj.name}
            </h4>
            <span className="text-[11px] text-neutral-400 truncate block">
              {currentClubObj.leagueName || "Football Club"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            {isOpen ? "Close" : "Change Club"}
          </span>
          {isOpen ? (
            <ChevronUp className="size-4 text-neutral-400" />
          ) : (
            <ChevronDown className="size-4 text-neutral-400" />
          )}
        </div>
      </div>

      {/* Expandable League & Club Selector Box */}
      {isOpen && (
        <div className="space-y-3.5 rounded-3xl p-5 bg-[#0a0f16] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 mt-2">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-white/10">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 font-display uppercase tracking-wider">
              <Shield className="size-3.5 text-emerald-400" />
              Choose League & Club
            </h3>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="size-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search 330+ clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8.5 pl-8.5 pr-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* League Tabs */}
          {!searchQuery.trim() && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {clubsByLeague.map((league) => {
                const isActive = activeLeagueId === league.leagueId;
                return (
                  <button
                    key={league.leagueId}
                    type="button"
                    onClick={() => setActiveLeagueId(league.leagueId)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${isActive
                        ? "bg-emerald-500 text-neutral-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                        : "bg-black/30 text-neutral-400 border-white/10 hover:text-white hover:border-white/20"
                      }`}
                  >
                    {league.leagueName} ({league.clubs.length})
                  </button>
                );
              })}
            </div>
          )}

          {/* Clubs Grid */}
          <div className="max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
            {displayedClubs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {displayedClubs.map((club) => {
                  const isSelected =
                    selectedClub?.toLowerCase() === club.name.toLowerCase();

                  return (
                    <button
                      key={`${club.leagueId || activeLeagueId}_${club.filename || club.name}`}
                      type="button"
                      onClick={() => {
                        onChange(club.name);
                        setIsOpen(false);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between group relative ${isSelected
                          ? "bg-emerald-500/20 border-emerald-400 text-white ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20"
                          : "bg-black/40 border-white/[0.06] hover:border-emerald-500/40 hover:bg-white/[0.03]"
                        }`}
                    >
                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 size-4 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-md">
                          <Check className="size-2.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Club Logo */}
                      <div className="size-13 sm:size-14 rounded-xl bg-black/60 p-2 border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform mb-1.5">
                        <img
                          src={club.image}
                          alt={club.name}
                          className="w-full h-full object-contain drop-shadow"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>

                      {/* Club Name */}
                      <div className="w-full">
                        <h4
                          className={`text-xs font-bold truncate leading-tight ${isSelected
                              ? "text-emerald-400"
                              : "text-neutral-200 group-hover:text-white"
                            }`}
                          title={club.name}
                        >
                          {club.name}
                        </h4>
                        {club.leagueName && searchQuery.trim() && (
                          <span className="text-[10px] text-neutral-400 truncate block mt-0.5">
                            {club.leagueName}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-neutral-500">
                No clubs found matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
