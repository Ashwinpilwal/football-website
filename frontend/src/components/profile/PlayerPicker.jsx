import React, { useState, useMemo } from "react";
import { Search, Star, Check, ChevronDown, ChevronUp } from "lucide-react";
import { players } from "@/components/FootballPreferences/FootballPreferences";

const categories = ["All", "Current Superstars", "Legends & GOATs", "Icons & Legends", "Indian Stars"];

export default function PlayerPicker({
  selectedPlayer = "",
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const currentPlayerObj = useMemo(() => {
    return (
      players.find(
        (p) => p.name.toLowerCase() === (selectedPlayer || "").toLowerCase()
      ) || {
        name: selectedPlayer || "Select Idol",
        image: "/player/messi.png",
        category: "Legends & GOATs",
      }
    );
  }, [selectedPlayer]);

  const displayedPlayers = useMemo(() => {
    return players.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-2">
      <label className="text-xs text-neutral-300 font-semibold block">
        Football Idol / GOAT
      </label>

      {/* Collapsed Active Player Trigger Card */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-3 rounded-2xl bg-[#0b1118] border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-lg group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-xl bg-black/60 p-0.5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
            <img
              src={currentPlayerObj.image}
              alt={currentPlayerObj.name}
              className="w-full h-full object-cover rounded-lg drop-shadow"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate font-display group-hover:text-emerald-400 transition-colors">
              {currentPlayerObj.name}
            </h4>
            <span className="text-[11px] text-neutral-400 truncate block">
              {currentPlayerObj.category || "Football Idol"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            {isOpen ? "Close" : "Change Idol"}
          </span>
          {isOpen ? (
            <ChevronUp className="size-4 text-neutral-400" />
          ) : (
            <ChevronDown className="size-4 text-neutral-400" />
          )}
        </div>
      </div>

      {/* Expandable Player Selector Box */}
      {isOpen && (
        <div className="space-y-3.5 rounded-3xl p-5 bg-[#0a0f16] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 mt-2">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-white/10">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 font-display uppercase tracking-wider">
              <Star className="size-3.5 text-emerald-400" />
              Choose Football Idol / GOAT
            </h3>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="size-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search 40+ players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8.5 pl-8.5 pr-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Category Tabs */}
          {!searchQuery.trim() && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${isActive
                        ? "bg-emerald-500 text-neutral-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                        : "bg-black/30 text-neutral-400 border-white/10 hover:text-white hover:border-white/20"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* Players Grid */}
          <div className="max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
            {displayedPlayers.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {displayedPlayers.map((player) => {
                  const isSelected =
                    selectedPlayer?.toLowerCase() === player.name.toLowerCase();

                  return (
                    <button
                      key={player.name}
                      type="button"
                      onClick={() => {
                        onChange(player.name);
                        setIsOpen(false);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between group relative ${isSelected
                          ? "bg-emerald-500/20 border-emerald-400 text-white ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20"
                          : "bg-black/40 border-white/[0.06] hover:border-emerald-500/40 hover:bg-white/[0.03]"
                        }`}
                    >
                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 size-4 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-md z-10">
                          <Check className="size-2.5 stroke-[3]" />
                        </div>
                      )}

                      {/* FC 25 Player Card Image */}
                      <div className="size-16 sm:size-20 rounded-xl bg-black/60 p-1 border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform mb-1.5 overflow-hidden">
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-full h-full object-cover rounded-lg drop-shadow"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>

                      {/* Player Name */}
                      <div className="w-full">
                        <h4
                          className={`text-xs font-bold truncate leading-tight ${isSelected
                              ? "text-emerald-400"
                              : "text-neutral-200 group-hover:text-white"
                            }`}
                          title={player.name}
                        >
                          {player.name}
                        </h4>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-neutral-500">
                No players found matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
