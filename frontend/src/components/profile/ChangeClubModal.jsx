import React, { useState, useMemo } from "react";
import { X, Search, Shield, Check, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clubsByLeague } from "@/data/clubsByLeague";
import toast from "react-hot-toast";

export default function ChangeClubModal({
  isOpen,
  onClose,
  currentClubName = "",
  currentClubLogo = "",
  onClubSelected,
}) {
  const [selectedLeague, setSelectedLeague] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState(() => ({
    name: currentClubName || "",
    image: currentClubLogo || "",
  }));
  const [saving, setSaving] = useState(false);

  // Flatten all clubs with league info
  const allClubs = useMemo(() => {
    return clubsByLeague.flatMap((league) =>
      league.clubs.map((c) => ({
        ...c,
        leagueName: league.leagueName,
        leagueId: league.leagueId,
      }))
    );
  }, []);

  // Filtered list based on selected league & search query
  const filteredClubs = useMemo(() => {
    return allClubs.filter((club) => {
      const matchesLeague =
        selectedLeague === "all" || club.leagueId === selectedLeague;
      const matchesSearch =
        !searchQuery.trim() ||
        club.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        club.leagueName.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesLeague && matchesSearch;
    });
  }, [allClubs, selectedLeague, searchQuery]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!selectedClub?.name) {
      toast.error("Please select a club first.");
      return;
    }

    setSaving(true);
    try {
      if (onClubSelected) {
        await onClubSelected(selectedClub);
      }
      toast.success(`Favourite club updated to ${selectedClub.name}!`);
      onClose();
    } catch (err) {
      console.error("Failed to update club:", err);
      toast.error("Failed to update favourite club.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/85 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-4xl max-h-[92dvh] bg-[#0c121a] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#080d14]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Shield className="size-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Choose Favourite Club
              </h2>
              <p className="text-xs text-neutral-400">
                Browse 15 leagues and 380+ official football clubs
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search & League Filters Bar */}
        <div className="p-5 border-b border-white/10 space-y-3 bg-[#080d14]/60">
          {/* Search Input */}
          <div className="relative">
            <Search className="size-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search club by name (e.g. Real Madrid, Arsenal, Barcelona, Inter Miami)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-black/50 border border-white/10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* League Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedLeague("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${selectedLeague === "all"
                  ? "bg-emerald-500 text-neutral-950 border-emerald-400 shadow-sm"
                  : "bg-black/30 text-neutral-400 border-white/10 hover:text-white hover:border-white/20"
                }`}
            >
              All Leagues ({allClubs.length})
            </button>

            {clubsByLeague.map((league) => (
              <button
                key={league.leagueId}
                type="button"
                onClick={() => setSelectedLeague(league.leagueId)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${selectedLeague === league.leagueId
                    ? "bg-emerald-500 text-neutral-950 border-emerald-400 shadow-sm"
                    : "bg-black/30 text-neutral-400 border-white/10 hover:text-white hover:border-white/20"
                  }`}
              >
                {league.leagueName} ({league.clubs.length})
              </button>
            ))}
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="flex-1 overflow-y-auto p-5 min-h-[300px] max-h-[50vh]">
          {filteredClubs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {filteredClubs.map((club) => {
                const isSelected =
                  selectedClub?.name?.toLowerCase() === club.name.toLowerCase();

                return (
                  <button
                    key={`${club.leagueId}_${club.filename}`}
                    type="button"
                    onClick={() =>
                      setSelectedClub({ name: club.name, image: club.image })
                    }
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-pointer group relative ${isSelected
                        ? "bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/10"
                        : "bg-black/40 border-white/[0.06] hover:border-emerald-500/40 hover:bg-white/[0.03]"
                      }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 size-5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-md">
                        <Check className="size-3 stroke-[3]" />
                      </div>
                    )}

                    {/* Club Logo */}
                    <div className="size-16 sm:size-18 rounded-2xl bg-black/60 p-2 border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
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

                    {/* Club Info */}
                    <div className="w-full">
                      <h4
                        className={`text-xs font-bold truncate leading-tight ${isSelected ? "text-emerald-400" : "text-white group-hover:text-emerald-300"
                          }`}
                        title={club.name}
                      >
                        {club.name}
                      </h4>
                      <span className="text-[10px] text-neutral-400 truncate block mt-0.5 font-medium">
                        {club.leagueName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
              <Shield className="size-10 text-neutral-600" />
              <h3 className="text-sm font-bold text-white">No clubs found</h3>
              <p className="text-xs text-neutral-500">
                Try a different search keyword or league category.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#080d14]">
          <div className="flex items-center gap-3">
            {selectedClub?.image && (
              <img
                src={selectedClub.image}
                alt={selectedClub.name}
                className="size-8 object-contain rounded-lg bg-black/60 p-1 border border-white/10"
              />
            )}
            <div className="text-left">
              <span className="text-[11px] text-neutral-400 font-medium block">
                Selected Club:
              </span>
              <span className="text-xs font-bold text-white">
                {selectedClub?.name || "None Selected"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={saving || !selectedClub?.name}
              className="rounded-xl text-xs font-bold px-5 cursor-pointer shadow-md"
            >
              {saving ? "Saving..." : "Save Club"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
