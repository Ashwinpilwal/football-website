import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  MapPin,
  LocateFixed,
  Compass,
  ExternalLink,
  Navigation,
  ShieldCheck,
  Search,
  RefreshCw,
  Globe2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TurfMap from "@/components/Map/TurfMap";
import RadarVenueList from "@/components/Map/RadarVenueList";
import { pitchService } from "@/services/turf.service";
import axios from "axios";
import toast from "react-hot-toast";

export default function LiveRadarPage() {
  const locationState = useSelector((state) => state.location);

  const [pitches, setPitches] = useState([]);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [selectedType, setSelectedType] = useState("all"); // 'all', 'turf', 'ground'
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("map"); // 'map' or 'radar'
  const [searchQuery, setSearchQuery] = useState("");
  const [searchingLocation, setSearchingLocation] = useState(false);

  // Default GPS coordinates: from Redux location or Bengaluru standard
  const [userCoords, setUserCoords] = useState(() => {
    if (locationState?.latitude && locationState?.longitude) {
      return [locationState.latitude, locationState.longitude];
    }
    return [12.9716, 77.5946];
  });

  const [currentLocationName, setCurrentLocationName] = useState("Live Coordinates");

  // 1. Detect Real Browser GPS Location on Mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserCoords([lat, lng]);
          setCurrentLocationName("Current GPS Location");
        },
        (err) => {
          console.log("Geolocation prompt error, using default coordinates:", err.message);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  // 2. Fetch Real Pitches and Turfs via 100% Live Geospatial API
  const fetchRadarData = useCallback(async (lat, lng) => {
    setLoading(true);
    try {
      const pitchRes = await pitchService.getNearbyPitches(lat, lng);
      const rawPitches = Array.isArray(pitchRes)
        ? pitchRes
        : Array.isArray(pitchRes?.data)
        ? pitchRes.data
        : Array.isArray(pitchRes?.data?.data)
        ? pitchRes.data.data
        : pitchRes?.features || [];

      setPitches(rawPitches);

      if (rawPitches.length > 0) {
        setSelectedPitch(rawPitches[0]);
      } else {
        setSelectedPitch(null);
      }
    } catch (err) {
      console.log("Radar data API error:", err);
      toast.error("Failed to scan real grounds in this area.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userCoords && userCoords.length === 2) {
      fetchRadarData(userCoords[0], userCoords[1]);
    }
  }, [userCoords, fetchRadarData]);

  // 3. Search Any Global Location/City via OpenStreetMap Nominatim
  const handleLocationSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setSearchingLocation(true);
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );

      if (res.data && res.data.length > 0) {
        const place = res.data[0];
        const newLat = parseFloat(place.lat);
        const newLng = parseFloat(place.lon);
        setUserCoords([newLat, newLng]);
        setCurrentLocationName(place.display_name.split(",")[0] || query);
        toast.success(`Scanning real venues near ${place.display_name.split(",")[0]}!`);
      } else {
        toast.error("Location not found. Try another city or neighborhood.");
      }
    } catch (err) {
      console.log("Location search error:", err);
      toast.error("Failed to search location.");
    } finally {
      setSearchingLocation(false);
    }
  };

  // 4. Recenter to Real Device GPS
  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords([lat, lng]);
        setCurrentLocationName("Current GPS Location");
        setSearchQuery("");
        toast.success("Recentered to your live GPS location!");
      },
      (err) => {
        setLoading(false);
        toast.error(err.message || "Failed to retrieve GPS location.");
      },
      { enableHighAccuracy: true }
    );
  };

  // Filter API venues based on category
  const filteredPitches = pitches.filter((p) => {
    if (selectedType === "all") return true;
    const venueType = p.properties?.venueType;
    if (selectedType === "turf") return venueType === "turf";
    if (selectedType === "ground") return venueType === "ground";
    return true;
  });

  const turfCount = pitches.filter((p) => p.properties?.venueType === "turf").length;
  const groundCount = pitches.filter((p) => p.properties?.venueType === "ground").length;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Sleek Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Compass className="size-6 text-emerald-400" />
              Live Turf & Ground Radar
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
              {currentLocationName}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time map scanning genuine football turfs and municipal sports grounds near you.
          </p>
        </div>

        {/* View & Search Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Location Search Bar */}
          <form onSubmit={handleLocationSearch} className="flex items-center gap-1.5 relative">
            <div className="relative">
              <Search className="size-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search city, area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8.5 pl-8 pr-3 w-40 sm:w-48 rounded-xl bg-[#0b1118] border border-white/15 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 font-medium"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              disabled={searchingLocation || !searchQuery.trim()}
              className="h-8.5 px-3 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
            >
              {searchingLocation ? "..." : "Search"}
            </Button>
          </form>

          {/* Recenter to GPS Button */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleUseCurrentGPS}
            className="h-8.5 px-2.5 rounded-xl border-white/15 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            title="Scan your live GPS coordinates"
          >
            <LocateFixed className="size-3.5" />
            <span className="hidden sm:inline">My GPS</span>
          </Button>

          {/* Mode Switcher: Map vs HUD Radar */}
          <div className="flex items-center gap-0.5 bg-[#0b1118] border border-white/10 p-0.5 rounded-xl text-xs">
            <button
              onClick={() => setViewMode("map")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === "map" ? "bg-emerald-500 text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-white"
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode("radar")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === "radar" ? "bg-emerald-500 text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-white"
              }`}
            >
              HUD Radar
            </button>
          </div>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedType === "all"
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40"
                : "bg-black/30 border-white/10 text-neutral-400 hover:text-white"
            }`}
          >
            <span>All Venues</span>
            <span className="size-4.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] flex items-center justify-center font-mono">
              {pitches.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedType("turf")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedType === "turf"
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40"
                : "bg-black/30 border-white/10 text-neutral-400 hover:text-white"
            }`}
          >
            <span>⚽ Turfs & Arenas</span>
            <span className="size-4.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] flex items-center justify-center font-mono">
              {turfCount}
            </span>
          </button>

          <button
            onClick={() => setSelectedType("ground")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedType === "ground"
                ? "bg-sky-500/20 border-sky-500 text-sky-300 ring-1 ring-sky-500/40"
                : "bg-black/30 border-white/10 text-neutral-400 hover:text-white"
            }`}
          >
            <span>🏟️ Grounds & Stadiums</span>
            <span className="size-4.5 rounded-full bg-sky-500/30 text-sky-300 text-[10px] flex items-center justify-center font-mono">
              {groundCount}
            </span>
          </button>
        </div>

        <div className="text-xs text-neutral-400 font-medium">
          {loading ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <RefreshCw className="size-3 animate-spin" /> Scanning live data...
            </span>
          ) : (
            <span>Found <strong>{filteredPitches.length}</strong> venues</span>
          )}
        </div>
      </div>

      {/* Main Grid: Interactive Map / Radar + Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Interactive Map or HUD Radar (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {viewMode === "map" ? (
            <div className="h-[340px] sm:h-[450px] md:h-[540px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl relative">
              <TurfMap
                pitches={filteredPitches}
                userCoords={userCoords}
                selectedPitch={selectedPitch}
                onSelectPitch={(p) => setSelectedPitch(p)}
                height="100%"
              />
            </div>
          ) : (
            /* HUD Radar Sweep View */
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 rounded-3xl bg-[#090e15] border border-white/[0.08] relative overflow-hidden shadow-2xl min-h-[340px] sm:min-h-[450px] md:min-h-[540px]">
              <div className="relative size-64 sm:size-80 md:size-96 rounded-full border border-emerald-500/20 flex items-center justify-center">
                <div className="size-48 sm:size-64 rounded-full border border-emerald-500/25 flex items-center justify-center" />
                <div className="size-32 sm:size-44 rounded-full border border-emerald-500/30 flex items-center justify-center" />
                <div className="size-16 sm:size-24 rounded-full border border-emerald-500/40 flex items-center justify-center" />
                <div className="size-4 sm:size-5 rounded-full bg-emerald-500 shadow-[0_0_20px_#10b981] z-10" />

                {/* Crosshairs */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-emerald-500/20" />
                <div className="absolute inset-y-0 left-1/2 w-[1px] bg-emerald-500/20" />

                {/* Sweeping Beam */}
                <div className="absolute inset-0 rounded-full radar-sweep pointer-events-none bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(16,185,129,0.35)_360deg)]" />

                {/* Blips */}
                {filteredPitches.slice(0, 10).map((p, idx) => {
                  const isTurf = p.properties?.venueType === "turf";
                  const positions = [
                    { top: "25%", left: "68%" },
                    { top: "65%", left: "30%" },
                    { top: "35%", left: "20%" },
                    { top: "75%", left: "65%" },
                    { top: "18%", left: "42%" },
                    { top: "52%", left: "80%" },
                    { top: "45%", left: "55%" },
                    { top: "60%", left: "70%" },
                    { top: "20%", left: "28%" },
                    { top: "80%", left: "35%" },
                  ];
                  const pos = positions[idx % positions.length];
                  return (
                    <button
                      key={`blip_${idx}`}
                      onClick={() => setSelectedPitch(p)}
                      style={{ top: pos.top, left: pos.left }}
                      className={`absolute size-6 rounded-full border-2 border-white flex items-center justify-center shadow-lg hover:scale-125 transition-transform cursor-pointer z-10 ${
                        isTurf ? "bg-emerald-500 shadow-[0_0_12px_#10b981]" : "bg-sky-500 shadow-[0_0_12px_#0ea5e9]"
                      }`}
                      title={p.properties?.name || "Ground"}
                    >
                      <span className="text-[9px] font-bold text-neutral-950">{isTurf ? "⚽" : idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-emerald-400" /> Real Turf Arenas ({turfCount})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-sky-400" /> Real Stadiums & Grounds ({groundCount})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Minimal Selected Venue Card + Distance List Box (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedPitch && (
            <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-4 shadow-2xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                    selectedPitch.properties?.venueType === "turf"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                  }`}
                >
                  <span>{selectedPitch.properties?.venueType === "turf" ? "⚽" : "🏟️"}</span>
                  {selectedPitch.properties?.venueType === "turf" ? "AstroTurf Arena" : "Sports Ground"}
                </span>

                {selectedPitch.properties?.distance && (
                  <span className="text-xs font-bold text-neutral-300 font-mono">
                    {(selectedPitch.properties.distance / 1000).toFixed(1)} km away
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-display text-base sm:text-lg font-extrabold text-white leading-snug">
                  {selectedPitch.properties?.name || "Football Venue"}
                </h3>
                <p className="text-xs text-neutral-400 flex items-start gap-1.5 mt-1.5 leading-relaxed">
                  <MapPin className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{selectedPitch.properties?.formatted || selectedPitch.properties?.address_line2 || "Ground Location"}</span>
                </p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${
                  selectedPitch.geometry?.coordinates?.[1] || selectedPitch.properties?.lat || userCoords[0]
                },${
                  selectedPitch.geometry?.coordinates?.[0] || selectedPitch.properties?.lon || userCoords[1]
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="block pt-0.5"
              >
                <Button variant="primary" className="w-full text-xs font-bold rounded-2xl py-2.5 gap-2 shadow-lg cursor-pointer">
                  <Navigation className="size-3.5" /> Open in Google Maps <ExternalLink className="size-3" />
                </Button>
              </a>
            </div>
          )}

          {/* List of Grounds & Turfs in Order of Distance */}
          <RadarVenueList
            venues={filteredPitches}
            selectedVenue={selectedPitch}
            onSelectVenue={(v) => setSelectedPitch(v)}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
