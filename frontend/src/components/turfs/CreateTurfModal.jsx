import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  X,
  Plus,
  Upload,
  MapPin,
  Clock,
  Phone,
  IndianRupee,
  ShieldCheck,
  Check,
  Building2,
  Sparkles,
  GripVertical,
  Star,
  Image as ImageIcon,
  Trash2,
  Navigation,
  Crosshair,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { turfService } from "@/services/turf.service";
import toast from "react-hot-toast";

// Leaflet Map Imports
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 1. Draggable New Turf Pin
const newTurfPinIcon = L.divIcon({
  className: "custom-pitch-pin",
  html: `<div style="
    background: #10b981;
    color: #0a0a0a;
    width: 40px;
    height: 40px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 20px;
    border: 3px solid white;
    box-shadow: 0 0 25px rgba(16, 185, 129, 0.9);
    cursor: grab;
  ">⚽</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// 2. User's Live GPS Pin
const userGpsIcon = L.divIcon({
  className: "custom-user-pin",
  html: `<div style="
    background: #ef4444;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border: 2px solid white;
    box-shadow: 0 0 18px rgba(239, 68, 68, 0.85);
  ">📍</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

// 3. Existing Nearby Turfs Pin
const existingTurfPinIcon = L.divIcon({
  className: "custom-existing-pitch-pin",
  html: `<div style="
    background: #1e293b;
    color: #34d399;
    width: 30px;
    height: 30px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border: 1.5px solid rgba(52, 211, 153, 0.5);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
  ">🏟️</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Helper component to handle map clicks and marker dragging for the new turf
function LocationPickerMapEvents({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      const newPos = [
        parseFloat(e.latlng.lat.toFixed(6)),
        parseFloat(e.latlng.lng.toFixed(6)),
      ];
      setPosition(newPos);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition([
            parseFloat(pos.lat.toFixed(6)),
            parseFloat(pos.lng.toFixed(6)),
          ]);
        },
      }}
      icon={newTurfPinIcon}
    >
      <Popup className="dark-popup">
        <div className="text-xs font-black text-neutral-900 p-1">
          ⚽ New Turf Location (Drag to reposition)
        </div>
      </Popup>
    </Marker>
  ) : null;
}

// Map center synchronizer
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

// Aesthetic Visual Time Picker Component with segmented Hour, Minute, and AM/PM Selector
function AestheticTimeInput({ label, value, onChange, presets = [] }) {
  // Parse incoming value like "06:00 AM"
  const parseTime = (timeStr) => {
    const match = (timeStr || "06:00 AM").trim().match(/^(\d+):(\d+)\s*(AM|PM)?$/i);
    if (!match) return { hour: "06", minute: "00", period: "AM" };
    let h = match[1].padStart(2, "0");
    let m = match[2].padStart(2, "0");
    let p = match[3]?.toUpperCase() || "AM";
    return { hour: h, minute: m, period: p };
  };

  const { hour, minute, period } = parseTime(value);

  const updateTime = (newH, newM, newP) => {
    onChange(`${newH}:${newM} ${newP}`);
  };

  const hoursList = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const minutesList = ["00", "15", "30", "45"];

  return (
    <div className="space-y-2 p-4 rounded-2xl bg-[#060a0f] border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
          <Clock className="size-3.5 text-emerald-400" />
          <span>{label}</span>
        </Label>
        <Badge variant="emerald" className="text-[11px] font-mono font-bold px-2 py-0.5">
          {value}
        </Badge>
      </div>

      {/* Segmented Selectors */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {/* Hour Selector */}
        <div>
          <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block mb-1">
            Hour
          </label>
          <select
            value={hour}
            onChange={(e) => updateTime(e.target.value, minute, period)}
            className="w-full h-11 px-2.5 rounded-xl bg-[#0b121b] border border-white/15 text-xs text-white font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {hoursList.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        {/* Minute Selector */}
        <div>
          <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block mb-1">
            Minute
          </label>
          <select
            value={minute}
            onChange={(e) => updateTime(hour, e.target.value, period)}
            className="w-full h-11 px-2.5 rounded-xl bg-[#0b121b] border border-white/15 text-xs text-white font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {minutesList.map((m) => (
              <option key={m} value={m}>
                :{m}
              </option>
            ))}
          </select>
        </div>

        {/* AM / PM Toggle Pill */}
        <div>
          <label className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block mb-1">
            Period
          </label>
          <div className="flex h-11 rounded-xl bg-[#0b121b] border border-white/15 p-1">
            <button
              type="button"
              onClick={() => updateTime(hour, minute, "AM")}
              className={`flex-1 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-0.5 cursor-pointer ${
                period === "AM"
                  ? "bg-amber-500 text-neutral-950 shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Sun className="size-3" /> AM
            </button>
            <button
              type="button"
              onClick={() => updateTime(hour, minute, "PM")}
              className={`flex-1 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-0.5 cursor-pointer ${
                period === "PM"
                  ? "bg-emerald-500 text-neutral-950 shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Moon className="size-3" /> PM
            </button>
          </div>
        </div>
      </div>

      {/* Quick Preset Chips */}
      {presets.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] text-neutral-500 font-medium">Quick:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                value === preset
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white border border-white/5"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const AVAILABLE_AMENITIES = [
  "Floodlights",
  "Changing Rooms",
  "Free Parking",
  "Bibs & Match Balls",
  "Turf Cleats Rental",
  "Drinking Water",
  "First Aid Station",
  "Seating Stands",
];

export default function CreateTurfModal({ isOpen, onClose, onTurfCreated }) {
  const locationState = useSelector((state) => state.location);

  const [name, setName] = useState("");
  const [type, setType] = useState("turf"); // "turf" | "playground"
  const [address, setAddress] = useState("");
  const [pricePerHour, setPricePerHour] = useState(1200);
  const [phone, setPhone] = useState("");
  const [openingTime, setOpeningTime] = useState("06:00 AM");
  const [closingTime, setClosingTime] = useState("11:00 PM");
  const [selectedAmenities, setSelectedAmenities] = useState([
    "Floodlights",
    "Bibs & Match Balls",
    "Drinking Water",
  ]);

  // User's own live coordinates
  const [userLiveCoords, setUserLiveCoords] = useState(
    locationState?.latitude && locationState?.longitude
      ? [locationState.latitude, locationState.longitude]
      : [31.2536, 75.7032]
  );

  // New Turf Selected Coordinates
  const [coords, setCoords] = useState([
    locationState?.latitude || 31.2536,
    locationState?.longitude || 75.7032,
  ]);

  // Existing Nearby Turfs loaded from DB
  const [nearbyTurfs, setNearbyTurfs] = useState([]);

  // Image states: stores File objects and preview URLs in sync
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Load User Location & Existing Nearby Turfs on modal open
  useEffect(() => {
    if (isOpen) {
      const fetchNearby = async () => {
        try {
          const params = {};
          if (locationState?.latitude && locationState?.longitude) {
            params.lat = locationState.latitude;
            params.lng = locationState.longitude;
          }
          const res = await turfService.getNearbyTurfs(params);
          const data = res?.data || [];
          setNearbyTurfs(Array.isArray(data) ? data : []);
        } catch (e) {
          setNearbyTurfs([]);
        }
      };
      fetchNearby();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const gps = [
              parseFloat(pos.coords.latitude.toFixed(6)),
              parseFloat(pos.coords.longitude.toFixed(6)),
            ];
            setUserLiveCoords(gps);
            setCoords(gps);
          },
          () => {
            if (locationState?.latitude && locationState?.longitude) {
              const loc = [locationState.latitude, locationState.longitude];
              setUserLiveCoords(loc);
              setCoords(loc);
            }
          }
        );
      }
    }
  }, [isOpen, locationState]);

  if (!isOpen) return null;

  const handleToggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = [
            parseFloat(pos.coords.latitude.toFixed(6)),
            parseFloat(pos.coords.longitude.toFixed(6)),
          ];
          setCoords(newPos);
          setUserLiveCoords(newPos);
          toast.success("📍 Pinned to your current GPS position!");
        },
        () => {
          toast.error("Unable to retrieve GPS. Click on the map to place pin.");
        }
      );
    }
  };

  // Add new files from file dialog or drop
  const handleAddFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      toast.error("Please select valid image files (PNG, JPG, WEBP).");
      return;
    }

    const combinedFiles = [...images, ...validFiles].slice(0, 10);
    const previews = combinedFiles.map((file) => URL.createObjectURL(file));

    setImages(combinedFiles);
    setImagePreviews(previews);

    if (combinedFiles.length > images.length) {
      toast.success(
        `${validFiles.length} image${validFiles.length > 1 ? "s" : ""} added! Drag cards to set cover photo.`
      );
    }
  };

  // Dropzone drag-and-drop handlers
  const handleDropzoneDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDropzoneDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDropzoneDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  // Image Card Drag-to-Reorder Handlers (influencing images[0] cover)
  const handleCardDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleCardDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedItemIndex !== null && draggedItemIndex !== index) {
      setDragOverItemIndex(index);
    }
  };

  const handleCardDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItemIndex === null || draggedItemIndex === targetIndex) {
      setDraggedItemIndex(null);
      setDragOverItemIndex(null);
      return;
    }

    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];

    const [movedImage] = updatedImages.splice(draggedItemIndex, 1);
    const [movedPreview] = updatedPreviews.splice(draggedItemIndex, 1);

    updatedImages.splice(targetIndex, 0, movedImage);
    updatedPreviews.splice(targetIndex, 0, movedPreview);

    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);

    if (targetIndex === 0) {
      toast.success("⭐ Updated main pitch cover photo!");
    }
  };

  const handleCardDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  // Quick action: Set image as main cover (move to index 0)
  const handleSetCover = (index) => {
    if (index === 0) return;
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];

    const [coverImage] = updatedImages.splice(index, 1);
    const [coverPreview] = updatedPreviews.splice(index, 1);

    updatedImages.unshift(coverImage);
    updatedPreviews.unshift(coverPreview);

    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
    toast.success("⭐ Set as main pitch cover photo!");
  };

  // Remove single image
  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      toast.error("Turf name and street address are required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("type", type);
      formData.append("address", address.trim());
      formData.append("latitude", coords[0]);
      formData.append("longitude", coords[1]);
      formData.append("pricePerHour", pricePerHour);
      formData.append("phone", phone.trim());
      formData.append("openingTime", openingTime);
      formData.append("closingTime", closingTime);
      formData.append("amenities", JSON.stringify(selectedAmenities));

      images.forEach((imgFile) => {
        formData.append("images", imgFile);
      });

      const res = await turfService.createTurf(formData);
      toast.success("🏟️ New Turf registered successfully with GPS location!");
      if (onTurfCreated) {
        onTurfCreated(res?.data || res);
      }
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to register turf. Please verify admin privileges."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85">
      {/* Spacious Modal Box */}
      <div className="w-full max-w-4xl rounded-3xl bg-[#0b1118] border border-white/15 shadow-2xl flex flex-col max-h-[92vh] transform-gpu overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-white/[0.08] flex items-center justify-between bg-[#070b10] shrink-0">
          <div className="flex items-center gap-4">
            <div className="size-13 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
              <Building2 className="size-6.5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight">
                  Register New Football Pitch
                </h2>
                <span className="text-[10.5px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase tracking-wider hidden sm:inline">
                  Admin Facility
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                View nearby existing turfs and your location on the live map to pin your new ground.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-10 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-7 transform-gpu"
        >
          {/* Turf Name & Facility Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="turfName" className="text-xs font-bold text-neutral-200">
                Turf / Arena Name *
              </Label>
              <Input
                id="turfName"
                placeholder="e.g. XL Arena Stadium"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-sm rounded-2xl bg-[#060a0f]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="turfType" className="text-xs font-bold text-neutral-200">
                Pitch Type *
              </Label>
              <select
                id="turfType"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-[#060a0f] border border-white/15 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="turf">Synthetic Turf (5v5 / 7v7)</option>
                <option value="playground">Natural Grass Ground (11v11)</option>
              </select>
            </div>
          </div>

          {/* Interactive Map: Choose Latitude & Longitude with Nearby Turfs and User GPS */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <Label className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                  <MapPin className="size-4 text-emerald-400" />
                  <span>Pin Pitch Location on Map (Drag Green Pin or Click Map)</span>
                </Label>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Green pin: <strong className="text-emerald-400 font-bold">Your New Turf</strong> • Red pin: <strong className="text-rose-400 font-bold">Your Location</strong> • Slate pins: <strong className="text-neutral-300 font-bold">Nearby Turfs ({nearbyTurfs.length})</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <Crosshair className="size-3.5" />
                  <span>Center On My GPS</span>
                </button>
              </div>
            </div>

            {/* Interactive Leaflet Map Container */}
            <div className="h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-white/15 relative shadow-inner bg-[#070b10]">
              <MapContainer
                center={coords}
                zoom={14}
                scrollWheelZoom={true}
                zoomControl={false}
                attributionControl={false}
                className="w-full h-full"
                style={{ height: "100%", width: "100%", background: "#070b10" }}
              >
                <MapRecenter center={coords} />
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* 1. User Live GPS Location Marker (Red Pin) */}
                {userLiveCoords && (
                  <Marker position={userLiveCoords} icon={userGpsIcon}>
                    <Popup className="dark-popup">
                      <div className="text-xs font-bold text-neutral-900 p-1">
                        📍 Your Current Location
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* 2. Existing Nearby Turfs (Slate Pins) */}
                {nearbyTurfs.map((t) => {
                  const lat = t.location?.coordinates ? t.location.coordinates[1] : null;
                  const lng = t.location?.coordinates ? t.location.coordinates[0] : null;
                  if (!lat || !lng) return null;

                  return (
                    <Marker key={t._id} position={[lat, lng]} icon={existingTurfPinIcon}>
                      <Popup className="dark-popup">
                        <div className="p-1.5 text-neutral-900 min-w-[150px]">
                          <div className="font-bold text-xs text-neutral-900">{t.name}</div>
                          <div className="text-[11px] text-neutral-600 truncate">{t.address}</div>
                          <div className="text-[11px] font-black text-emerald-700 mt-1">
                            ₹{t.pricePerHour || 1200}/hr • {t.type?.toUpperCase()}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                {/* 3. New Turf Draggable Selected Location Marker (Green Pin) */}
                <LocationPickerMapEvents position={coords} setPosition={setCoords} />
              </MapContainer>

              {/* Map Legend & Coordinates Floating Badge */}
              <div className="absolute bottom-3 left-3 right-3 z-[1000] flex items-center justify-between gap-2 flex-wrap pointer-events-none">
                <div className="px-3 py-1.5 rounded-xl bg-black/85 border border-white/15 text-[11px] font-mono text-emerald-400 flex items-center gap-2 shadow-lg pointer-events-auto">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    New Turf GPS: <strong>{coords[0]}</strong>, <strong>{coords[1]}</strong>
                  </span>
                </div>

                <div className="px-2.5 py-1 rounded-xl bg-black/80 border border-white/10 text-[10px] text-neutral-300 flex items-center gap-3 font-medium shadow-lg pointer-events-auto hidden sm:flex">
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-red-500" /> You
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-emerald-400" /> New Turf
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-slate-400" /> Existing ({nearbyTurfs.length})
                  </span>
                </div>
              </div>
            </div>

            {/* Street Address Input */}
            <div className="space-y-1.5 pt-1">
              <Label htmlFor="turfAddress" className="text-xs font-bold text-neutral-200">
                Full Street Address & Landmark *
              </Label>
              <Input
                id="turfAddress"
                placeholder="e.g. Lovely Professional University, Uni mall, Phagwara, Punjab"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-12 text-sm rounded-2xl bg-[#060a0f]"
                required
              />
            </div>
          </div>

          {/* Pricing & Contact Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="turfPrice" className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                <IndianRupee className="size-4 text-emerald-400" />
                <span>Price Per Hour (₹)</span>
              </Label>
              <Input
                id="turfPrice"
                type="number"
                min="0"
                step="50"
                placeholder="1200"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                className="h-12 text-sm rounded-2xl bg-[#060a0f]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="turfPhone" className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                <Phone className="size-4 text-emerald-400" />
                <span>Manager Phone / WhatsApp</span>
              </Label>
              <Input
                id="turfPhone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 text-sm rounded-2xl bg-[#060a0f]"
              />
            </div>
          </div>

          {/* Aesthetic Visual Time Pickers (Opening & Closing Time) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <AestheticTimeInput
              label="Opening Time"
              value={openingTime}
              onChange={(newVal) => setOpeningTime(newVal)}
              presets={["05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM"]}
            />

            <AestheticTimeInput
              label="Closing Time"
              value={closingTime}
              onChange={(newVal) => setClosingTime(newVal)}
              presets={["10:00 PM", "11:00 PM", "12:00 AM", "02:00 AM"]}
            />
          </div>

          {/* Amenities Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-neutral-200">
                Pitch Amenities & Features
              </Label>
              <span className="text-xs text-neutral-400 font-medium">
                {selectedAmenities.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleToggleAmenity(amenity)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-colors flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold shadow-md"
                        : "bg-[#060a0f] border-white/10 text-neutral-400 hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`size-4.5 rounded-lg border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-emerald-500 border-emerald-400 text-neutral-950"
                          : "border-white/20"
                      }`}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drag & Drop Photo Uploader & Reorder Gallery */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                  <ImageIcon className="size-4 text-emerald-400" />
                  <span>Ground Photos & Cover Banner</span>
                </Label>
                <p className="text-xs text-neutral-400 mt-1">
                  Drag & drop files to upload. <strong className="text-emerald-400 font-bold">Drag cards in the grid</strong> to choose which photo is the <span className="text-emerald-300 font-bold">Cover Photo (#1)</span>.
                </p>
              </div>

              {images.length > 0 && (
                <Badge variant="emerald" className="text-xs px-3 py-1 font-bold">
                  {images.length}/10 Photos
                </Badge>
              )}
            </div>

            {/* Spacious Drag & Drop Dropzone */}
            <div
              onDragOver={handleDropzoneDragOver}
              onDragLeave={handleDropzoneDragLeave}
              onDrop={handleDropzoneDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 relative overflow-hidden ${
                isDraggingOver
                  ? "bg-emerald-500/15 border-emerald-400 ring-4 ring-emerald-500/30 scale-[1.01]"
                  : "bg-[#060a0f] border-white/15 hover:border-emerald-500/40 hover:bg-[#090f17]"
              }`}
            >
              <div className="size-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto shadow-sm">
                <Upload className={`size-7 transition-transform duration-200 ${isDraggingOver ? "-translate-y-1 scale-110" : ""}`} />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  {isDraggingOver
                    ? "Release photos here to add to pitch gallery!"
                    : "Drag & drop photos here, or click to browse from device"}
                </p>
                <p className="text-xs text-neutral-400 font-medium">
                  Supports PNG, JPG, WEBP • Up to 10 photos
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleAddFiles(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Reorderable Image Thumbnails Grid */}
            {imagePreviews.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
                  <span>Reorder gallery photos (Card #1 is your primary pitch hero cover):</span>
                  <span>{imagePreviews.length} photos ready</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {imagePreviews.map((previewSrc, index) => {
                    const isCover = index === 0;
                    const isDragging = draggedItemIndex === index;
                    const isDragOver = dragOverItemIndex === index;

                    return (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleCardDragStart(e, index)}
                        onDragOver={(e) => handleCardDragOver(e, index)}
                        onDragEnd={handleCardDragEnd}
                        onDrop={(e) => handleCardDrop(e, index)}
                        className={`group relative rounded-2xl overflow-hidden bg-[#060a0f] border transition-all select-none cursor-grab active:cursor-grabbing ${
                          isCover
                            ? "border-emerald-500 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-500/50"
                            : "border-white/10 hover:border-white/30"
                        } ${isDragging ? "opacity-40 scale-95" : ""} ${
                          isDragOver ? "ring-2 ring-emerald-400 scale-105" : ""
                        }`}
                      >
                        {/* Image Preview */}
                        <div className="h-32 sm:h-36 w-full bg-neutral-900 overflow-hidden">
                          <img
                            src={previewSrc}
                            alt={`Pitch ${index + 1}`}
                            className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Drag Grip Indicator */}
                        <div className="absolute top-2 left-2 p-1.5 rounded-xl bg-black/80 text-white/80 opacity-80 group-hover:opacity-100 shadow-md">
                          <GripVertical className="size-4" />
                        </div>

                        {/* Top Right: Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                          className="absolute top-2 right-2 size-7 rounded-xl bg-black/80 hover:bg-red-500 text-neutral-300 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
                          title="Remove photo"
                        >
                          <X className="size-4" />
                        </button>

                        {/* Bottom Overlay: Cover Badge or Make Cover Action */}
                        {isCover ? (
                          <div className="absolute bottom-0 inset-x-0 bg-black/90 p-2 flex items-center justify-between">
                            <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                              <Star className="size-3 fill-emerald-400" /> MAIN COVER
                            </span>
                            <span className="text-[10px] font-mono text-emerald-300 font-bold">
                              #1
                            </span>
                          </div>
                        ) : (
                          <div className="absolute bottom-0 inset-x-0 bg-black/90 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetCover(index);
                              }}
                              className="text-[10.5px] font-bold text-emerald-300 hover:text-white bg-emerald-500/30 hover:bg-emerald-500/50 px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                            >
                              Make Cover
                            </button>
                            <span className="text-[10px] font-mono text-neutral-400 font-bold">
                              #{index + 1}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add More Photos Card in Grid */}
                  {imagePreviews.length < 10 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="h-32 sm:h-36 rounded-2xl border border-dashed border-white/15 hover:border-emerald-500/40 bg-[#060a0f] hover:bg-[#090f17] flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer group"
                    >
                      <Plus className="size-6 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">Add More</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Submit Button */}
          <div className="pt-3">
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/20 cursor-pointer"
            >
              {loading ? "Registering Ground..." : "List Turf & Start Receiving Bookings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
