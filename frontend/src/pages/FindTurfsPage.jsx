import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Shield,
  Clock3,
  Filter,
  ArrowRight,
  MapPinned,
  Plus,
  Building2,
  Navigation,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TurfMap from "@/components/Map/TurfMap";
import { turfService } from "@/services/turf.service";
import CreateTurfModal from "@/components/turfs/CreateTurfModal";
import EditTurfModal from "@/components/turfs/EditTurfModal";
import { cleanAddress } from "@/utils/avatar.utils";

// Haversine distance calculator between user and pitch
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d < 1 ? `${Math.round(d * 1000)} m away` : `${d.toFixed(1)} km away`;
}

export default function FindTurfsPage() {
  const { userData, status } = useSelector((state) => state.auth);
  const locationState = useSelector((state) => state.location);
  const [searchParams] = useSearchParams();
  const searchParamQuery = searchParams.get("search") || searchParams.get("name") || "";
  const turfIdParam = searchParams.get("turfId");

  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParamQuery);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedAmenity, setSelectedAmenity] = useState("all");
  const [viewMode, setViewMode] = useState("split");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTurf, setEditingTurf] = useState(null);

  // Live GPS User Location
  const [userCoords, setUserCoords] = useState(
    locationState?.latitude && locationState?.longitude
      ? [locationState.latitude, locationState.longitude]
      : [31.2536, 75.7032]
  );

  const loadTurfs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (userCoords && Array.isArray(userCoords)) {
        params.lat = userCoords[0];
        params.lng = userCoords[1];
      }
      const res = await turfService.getNearbyTurfs(params);
      const data = res?.data || [];
      const list = Array.isArray(data) ? data : [];
      setTurfs(list);

      if (turfIdParam) {
        const found = list.find((t) => t._id?.toString() === turfIdParam.toString());
        if (found) setSelectedTurf(found);
        else if (list.length > 0) setSelectedTurf(list[0]);
      } else if (searchParamQuery) {
        const found = list.find((t) =>
          t.name?.toLowerCase().includes(searchParamQuery.toLowerCase())
        );
        if (found) setSelectedTurf(found);
        else if (list.length > 0) setSelectedTurf(list[0]);
      } else if (list.length > 0 && !selectedTurf) {
        setSelectedTurf(list[0]);
      }
    } catch (e) {
      console.log("Turfs fetch error:", e);
      setTurfs([]);
    } finally {
      setLoading(false);
    }
  };

  // Sync with device GPS on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const gps = [
            parseFloat(pos.coords.latitude.toFixed(6)),
            parseFloat(pos.coords.longitude.toFixed(6)),
          ];
          setUserCoords(gps);
        },
        () => {
          if (locationState?.latitude && locationState?.longitude) {
            setUserCoords([locationState.latitude, locationState.longitude]);
          }
        }
      );
    }
  }, [locationState]);

  useEffect(() => {
    loadTurfs();
  }, [userCoords]);

  const amenitiesList = [
    "FIFA Grade Turf",
    "LED Floodlights",
    "Showers & Changing Room",
    "Free Parking",
    "Air Conditioned Lounge",
    "Bibs & Match Balls",
    "Drinking Water",
  ];

  const filteredTurfs = turfs.filter((t) => {
    const matchesSearch =
      (t.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.address || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "all" || t.type === selectedType;
    const matchesPrice = !t.pricePerHour || t.pricePerHour <= maxPrice;
    const matchesAmenity =
      selectedAmenity === "all" || (t.amenities && t.amenities.includes(selectedAmenity));
    return matchesSearch && matchesType && matchesPrice && matchesAmenity;
  });

  const isAdmin = userData?.role === "admin";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-display">
              <MapPinned className="size-7 text-emerald-400" />
              Discover Pitches & Turfs
            </h1>
            {userCoords && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live GPS Active
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Compare artificial grass vs open grounds, view live location distance, and book instantly.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Create Turf Button for Admin / Turf Owners */}
          {isAdmin && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="size-4 stroke-[3]" />
              <span>Register New Turf</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-[#090e15] border border-white/10 p-1.5 rounded-2xl self-start md:self-auto shadow-md">
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${viewMode === "split" ? "bg-emerald-500 text-neutral-950 shadow-md font-bold" : "text-neutral-400 hover:text-white"
                }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${viewMode === "list" ? "bg-emerald-500 text-neutral-950 shadow-md font-bold" : "text-neutral-400 hover:text-white"
                }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${viewMode === "map" ? "bg-emerald-500 text-neutral-950 shadow-md font-bold" : "text-neutral-400 hover:text-white"
                }`}
            >
              Map
            </button>
          </div>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="p-5 rounded-3xl bg-[#0e1520] border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="size-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by arena name, location, or landmark..."
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-[#080d14] border border-white/10 text-xs text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-11 px-3 rounded-2xl bg-[#080d14] border border-white/10 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Surface Types</option>
              <option value="turf">Pro AstroTurf / 5v5 & 7v7</option>
              <option value="playground">Open Ground / 11v11</option>
            </select>
          </div>

          <div>
            <select
              value={selectedAmenity}
              onChange={(e) => setSelectedAmenity(e.target.value)}
              className="w-full h-11 px-3 rounded-2xl bg-[#080d14] border border-white/10 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Any Amenity</option>
              {amenitiesList.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Rendering by View Mode */}
      {viewMode === "split" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Cards Column */}
          <div className="lg:col-span-6 space-y-4 max-h-[780px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-12 text-center text-xs text-neutral-400 space-y-2">
                <div className="size-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Locating floodlit pitches near you...</p>
              </div>
            ) : filteredTurfs.length > 0 ? (
              filteredTurfs.map((turf) => {
                const isSelected = selectedTurf?._id === turf._id;
                const distanceStr =
                  userCoords && turf.location?.coordinates
                    ? calculateDistanceKm(
                      userCoords[0],
                      userCoords[1],
                      turf.location.coordinates[1],
                      turf.location.coordinates[0]
                    )
                    : null;

                return (
                  <div
                    key={turf._id}
                    onClick={() => setSelectedTurf(turf)}
                    className={`rounded-3xl transition-all cursor-pointer border overflow-hidden flex flex-col group ${isSelected
                        ? "bg-[#0e1520] border-emerald-500/50 shadow-xl ring-1 ring-emerald-500/20"
                        : "bg-[#0a0f16] border-white/10 hover:border-white/20"
                      }`}
                  >
                    {/* Full-width panoramic cover image covering phone and card width */}
                    <div className="w-full h-44 sm:h-48 relative overflow-hidden bg-neutral-950">
                      <img
                        src={
                          turf.images?.[0] ||
                          "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"
                        }
                        alt={turf.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      <Badge
                        variant={turf.type === "turf" ? "emerald" : "outline"}
                        className="absolute top-3 left-3 text-[10.5px] uppercase font-bold backdrop-blur-xs"
                      >
                        {turf.type}
                      </Badge>

                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-xs border border-white/15 text-xs font-black text-emerald-400 shadow-md">
                        {turf.pricePerHour ? `₹${turf.pricePerHour}/hr` : "Free Pitch"}
                      </div>

                      {distanceStr && (
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-xs text-[10.5px] font-bold text-emerald-400 flex items-center gap-1 border border-white/10 shadow-sm">
                          <Navigation className="size-3" /> {distanceStr}
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-5 flex-1 min-w-0 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors truncate font-display">
                          {turf.name}
                        </h3>
                      </div>

                      <p className="text-xs text-neutral-400 flex items-center gap-1 line-clamp-1">
                        <MapPin className="size-3.5 text-emerald-500 shrink-0" />
                        <span>{cleanAddress(turf.address)}</span>
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-neutral-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock3 className="size-3 text-emerald-400" />
                          {turf.openingTime || "06:00 AM"} - {turf.closingTime || "11:00 PM"}
                        </span>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/[0.06]">
                        <span className="text-[11px] text-neutral-400 font-medium">
                          {turf.amenities?.length || 3} amenities
                        </span>
                        <div className="flex items-center gap-2">
                          {userData?.role === "admin" && (turf.owner?._id || turf.owner)?.toString() === userData?._id?.toString() && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTurf(turf);
                              }}
                              className="p-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0"
                              title="Edit Turf Details"
                            >
                              <Edit3 className="size-3.5" />
                              <span>Edit</span>
                            </button>
                          )}
                          <Link to={`/turf/${turf._id}`} onClick={(e) => e.stopPropagation()}>
                            <Button variant="primary" size="sm" className="rounded-xl text-xs gap-1">
                              <span>Book Pitch</span> <ArrowRight className="size-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 rounded-3xl bg-[#0a0f16] border border-white/10 text-center space-y-3">
                <MapPin className="size-8 text-neutral-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">No Pitches Found</h3>
                <p className="text-xs text-neutral-400">Try adjusting your filters or location search query.</p>
              </div>
            )}
          </div>

          {/* Right Map Column with Live User Location */}
          <div className="lg:col-span-6 sticky top-20 sm:top-24">
            <div className="h-[320px] sm:h-[450px] lg:h-[780px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <TurfMap
                turfs={filteredTurfs}
                userCoords={userCoords}
                selectedTurf={selectedTurf}
                onSelectTurf={(t) => setSelectedTurf(t)}
              />
            </div>
          </div>
        </div>
      )}

      {viewMode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTurfs.map((turf) => {
            const distanceStr =
              userCoords && turf.location?.coordinates
                ? calculateDistanceKm(
                  userCoords[0],
                  userCoords[1],
                  turf.location.coordinates[1],
                  turf.location.coordinates[0]
                )
                : null;

            return (
              <div
                key={turf._id}
                className="rounded-3xl bg-[#0a0f16] border border-white/10 overflow-hidden shadow-xl hover:border-emerald-500/40 transition-all flex flex-col group"
              >
                <div className="h-44 w-full relative overflow-hidden bg-neutral-950">
                  <img
                    src={
                      turf.images?.[0] ||
                      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500"
                    }
                    alt={turf.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                  <Badge
                    variant={turf.type === "turf" ? "emerald" : "outline"}
                    className="absolute top-3 left-3 text-xs uppercase font-bold"
                  >
                    {turf.type}
                  </Badge>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-black/85 border border-white/15 text-xs font-black text-emerald-400">
                    {turf.pricePerHour ? `₹${turf.pricePerHour}/hr` : "Free Pitch"}
                  </div>
                  {distanceStr && (
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-black/80 text-[10.5px] font-bold text-emerald-400 flex items-center gap-1 border border-white/10">
                      <Navigation className="size-2.5" /> {distanceStr}
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors font-display">
                      {turf.name}
                    </h3>
                    <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{cleanAddress(turf.address)}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {userData?.role === "admin" && (turf.owner?._id || turf.owner)?.toString() === userData?._id?.toString() && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTurf(turf);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shrink-0"
                        title="Edit Turf Details"
                      >
                        <Edit3 className="size-3.5" />
                        <span>Edit</span>
                      </button>
                    )}
                    <Link to={`/turf/${turf._id}`} className="flex-1">
                      <Button variant="primary" className="w-full py-2.5 rounded-xl text-xs font-bold gap-1.5">
                        <span>Reserve Slot</span> <ArrowRight className="size-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "map" && (
        <div className="h-[750px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <TurfMap
            turfs={filteredTurfs}
            userCoords={userCoords}
            selectedTurf={selectedTurf}
            onSelectTurf={(t) => setSelectedTurf(t)}
          />
        </div>
      )}

      {/* Create Turf Modal for Admin / Turf Owners */}
      <CreateTurfModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTurfCreated={() => loadTurfs()}
      />

      {/* Edit Turf Modal for Admin Turf Owner */}
      {editingTurf && (
        <EditTurfModal
          turf={editingTurf}
          isOpen={!!editingTurf}
          onClose={() => setEditingTurf(null)}
          onTurfUpdated={() => loadTurfs()}
          onTurfDeleted={() => loadTurfs()}
        />
      )}
    </div>
  );
}
