import React, { useMemo } from "react";
import { Compass, ExternalLink, Navigation } from "lucide-react";

export default function RadarVenueList({
  venues = [],
  selectedVenue = null,
  onSelectVenue,
  loading = false,
}) {
  // Sort venues by distance ascending (closest first)
  const sortedVenues = useMemo(() => {
    return [...venues].sort(
      (a, b) => (a.properties?.distance || 0) - (b.properties?.distance || 0)
    );
  }, [venues]);

  return (
    <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-3 shadow-xl flex flex-col">
      {/* Box Header */}
      <div className="flex items-center justify-between pb-1 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Compass className="size-4 text-emerald-400" />
          <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
            Nearest Venues ({sortedVenues.length})
          </h3>
        </div>
        <span className="text-[10px] text-neutral-400 font-medium">
          Closest First
        </span>
      </div>

      {/* Venues List Container */}
      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
        {loading ? (
          <div className="py-8 text-center text-xs text-neutral-400">
            Scanning nearest grounds...
          </div>
        ) : sortedVenues.length > 0 ? (
          sortedVenues.map((v, idx) => {
            const isTurf = v.properties?.venueType === "turf";
            const title =
              v.properties?.name ||
              v.properties?.address_line1 ||
              `Venue #${idx + 1}`;
            const dist = v.properties?.distance
              ? `${(v.properties.distance / 1000).toFixed(2)} km`
              : "Nearby";
            const lat =
              v.geometry?.coordinates?.[1] || v.properties?.lat;
            const lng =
              v.geometry?.coordinates?.[0] || v.properties?.lon;
            const isSelected =
              selectedVenue &&
              (selectedVenue === v ||
                (selectedVenue.properties?.name === v.properties?.name &&
                  selectedVenue.geometry?.coordinates?.[0] ===
                    v.geometry?.coordinates?.[0]));

            return (
              <div
                key={`venue_item_${idx}`}
                onClick={() => onSelectVenue && onSelectVenue(v)}
                className={`w-full p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  isSelected
                    ? isTurf
                      ? "bg-emerald-500/20 border-emerald-400 text-white ring-1 ring-emerald-400 shadow-md"
                      : "bg-sky-500/20 border-sky-400 text-white ring-1 ring-sky-400 shadow-md"
                    : "bg-black/40 border-white/[0.06] hover:border-white/20 hover:bg-white/[0.03] text-neutral-300"
                }`}
              >
                {/* Left: Icon + Single Title Heading */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className={`size-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      isTurf
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-sky-500/10 border-sky-500/30 text-sky-400"
                    }`}
                  >
                    <span className="text-xs">{isTurf ? "⚽" : "🏟️"}</span>
                  </div>

                  <h4
                    className={`text-xs font-bold truncate leading-tight flex-1 ${
                      isSelected
                        ? "text-emerald-400"
                        : "text-white group-hover:text-emerald-300"
                    }`}
                    title={title}
                  >
                    {title}
                  </h4>
                </div>

                {/* Right: Distance Badge + Google Maps Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] font-bold font-mono px-2 py-1 rounded-lg border ${
                      isTurf
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-sky-500/10 border-sky-500/30 text-sky-400"
                    }`}
                  >
                    {dist}
                  </span>

                  {lat && lng && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-emerald-500 text-neutral-400 hover:text-neutral-950 border border-white/10 hover:border-emerald-400 transition-all cursor-pointer flex items-center justify-center"
                      title="Open in Google Maps"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-neutral-500">
            No venues found in this area.
          </div>
        )}
      </div>
    </div>
  );
}
