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
  AlertTriangle,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { turfService } from "@/services/turf.service";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import toast from "react-hot-toast";
import { optimizeTurfThumbnail } from "@/utils/avatar.utils";

// Leaflet Map Imports
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 1. Draggable Turf Pin
const turfPinIcon = L.divIcon({
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

function DraggableTurfMarker({ position, onDragEnd, address, name }) {
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const latLng = marker.getLatLng();
        onDragEnd([
          parseFloat(latLng.lat.toFixed(6)),
          parseFloat(latLng.lng.toFixed(6)),
        ]);
      }
    },
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={turfPinIcon}
    >
      <Popup className="custom-pitch-popup">
        <div className="p-1 space-y-1 text-neutral-900 font-sans">
          <div className="font-extrabold text-sm flex items-center gap-1 text-emerald-700">
            <span>⚽</span> {name || "Arena Location"}
          </div>
          <div className="text-[11px] text-neutral-600 leading-tight">
            {address || "Drag pin to update exact GPS location"}
          </div>
          <div className="text-[10px] font-mono text-neutral-500 pt-0.5">
            GPS: {position[0]}, {position[1]}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick([
        parseFloat(e.latlng.lat.toFixed(6)),
        parseFloat(e.latlng.lng.toFixed(6)),
      ]);
    },
  });
  return null;
}

function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords[0] && coords[1]) {
      map.setView(coords, map.getZoom(), { animate: true });
    }
  }, [coords, map]);
  return null;
}

const TIME_OPTIONS = [
  "05:00 AM", "05:30 AM", "06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM",
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
  "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM",
  "11:00 PM", "11:30 PM", "12:00 AM"
];

function LuxuryTimeSelect({ value, onChange, label, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <Label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
        <Icon className="size-3.5 text-emerald-400" /> {label}
      </Label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-3.5 rounded-2xl bg-black/60 border border-white/10 hover:border-emerald-500/50 flex items-center justify-between text-xs sm:text-sm font-bold text-white transition-all cursor-pointer shadow-inner"
      >
        <span className="flex items-center gap-2">
          <Clock className="size-3.5 text-neutral-400" />
          <span>{value || "Select Time"}</span>
        </span>
        <ChevronDown className={`size-4 text-neutral-400 transition-transform ${isOpen ? "rotate-180 text-emerald-400" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto custom-scrollbar rounded-2xl bg-[#0b1118] border border-white/15 shadow-2xl p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
          {TIME_OPTIONS.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => {
                onChange(time);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${value === time
                  ? "bg-emerald-500 text-neutral-950 font-bold"
                  : "text-neutral-300 hover:bg-white/10 hover:text-white"
                }`}
            >
              <span>{time}</span>
              {value === time && <Check className="size-3.5 stroke-[3]" />}
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

export default function EditTurfModal({ turf, isOpen, onClose, onTurfUpdated, onTurfDeleted }) {
  const { userData } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [type, setType] = useState("turf");
  const [address, setAddress] = useState("");
  const [pricePerHour, setPricePerHour] = useState(1200);
  const [phone, setPhone] = useState("");
  const [openingTime, setOpeningTime] = useState("06:00 AM");
  const [closingTime, setClosingTime] = useState("11:00 PM");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Coordinates
  const [coords, setCoords] = useState([31.2536, 75.7032]);

  // Unified Gallery Items: { id, type: 'existing' | 'new', url, file? }
  const [galleryItems, setGalleryItems] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState(null);
  const [isDropzoneDraggingOver, setIsDropzoneDraggingOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const fileInputRef = useRef(null);

  // Initialize form state when turf changes or modal opens
  useEffect(() => {
    if (turf && isOpen) {
      setName(turf.name || "");
      setType(turf.type || "turf");
      setAddress(turf.address || "");
      setPricePerHour(turf.pricePerHour ?? 1200);
      setPhone(turf.phone || "");
      setOpeningTime(turf.openingTime || "06:00 AM");
      setClosingTime(turf.closingTime || "11:00 PM");
      setSelectedAmenities(Array.isArray(turf.amenities) ? turf.amenities : []);

      const lat = turf.location?.coordinates?.[1] || 31.2536;
      const lng = turf.location?.coordinates?.[0] || 75.7032;
      setCoords([lat, lng]);

      const initialItems = (Array.isArray(turf.images) ? turf.images : []).map((imgUrl, idx) => ({
        id: `exist-${idx}-${imgUrl}`,
        type: "existing",
        url: imgUrl,
      }));

      // If turf has a dedicated thumbnail, ensure it appears at position #1 (index 0)
      if (turf.thumbnail && initialItems.length > 1) {
        const thumbIdx = initialItems.findIndex((it) => it.url === turf.thumbnail);
        if (thumbIdx > 0) {
          const [thumbItem] = initialItems.splice(thumbIdx, 1);
          initialItems.unshift(thumbItem);
        }
      }

      setGalleryItems(initialItems);
      setDraggedItemIndex(null);
      setDragOverItemIndex(null);
    }
  }, [turf, isOpen]);

  if (!isOpen || !turf) return null;

  // Strict Ownership Guard: Compare turf.owner with logged-in user
  const turfOwnerId = turf.owner?._id || turf.owner;
  const isOwner = userData?.role === "admin" && turfOwnerId?.toString() === userData?._id?.toString();

  const handleToggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleAddFiles = (fileList) => {
    const valid = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (valid.length === 0) {
      toast.error("Please select valid image files (PNG, JPG, WEBP).");
      return;
    }

    if (galleryItems.length + valid.length > 15) {
      toast.error("Maximum 15 photos allowed per arena.");
      return;
    }

    const newItems = valid.map((file) => ({
      id: `new-${file.name}-${file.lastModified}-${Math.random()}`,
      type: "new",
      url: URL.createObjectURL(file),
      file: file,
    }));

    setGalleryItems((prev) => [...prev, ...newItems]);
    toast.success(`${valid.length} image${valid.length > 1 ? "s" : ""} added! Drag to reorder or set cover.`);
  };

  // Dropzone drag-and-drop handlers
  const handleDropzoneDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropzoneDraggingOver(true);
  };

  const handleDropzoneDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropzoneDraggingOver(false);
  };

  const handleDropzoneDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropzoneDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  // Card Drag-to-Reorder Handlers
  const handleCardDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
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

    const updated = [...galleryItems];
    const [moved] = updated.splice(draggedItemIndex, 1);
    updated.splice(targetIndex, 0, moved);

    setGalleryItems(updated);
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);

    if (targetIndex === 0) {
      toast.success("⭐ Set as main pitch cover photo / thumbnail!");
    }
  };

  const handleCardDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  // Set card as main cover photo (moves to index 0)
  const handleSetCover = (index) => {
    if (index === 0) return;
    const updated = [...galleryItems];
    const [coverItem] = updated.splice(index, 1);
    updated.unshift(coverItem);
    setGalleryItems(updated);
    toast.success("⭐ Set as main pitch cover photo / thumbnail!");
  };

  // Remove single image from gallery
  const handleRemoveItem = (index) => {
    const item = galleryItems[index];
    if (item?.type === "new" && item.url) {
      URL.revokeObjectURL(item.url);
    }
    setGalleryItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOwner) {
      toast.error("Unauthorized: You do not own this turf.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter the turf arena name.");
      return;
    }

    if (!address.trim()) {
      toast.error("Please specify the street address.");
      return;
    }

    if (galleryItems.length === 0) {
      toast.error("Please keep or upload at least one image of the arena.");
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

      // Construct imageOrder tokens and existingImages array
      const imageOrder = [];
      const keptExistingImages = [];
      let newFileIndex = 0;

      galleryItems.forEach((item) => {
        if (item.type === "existing") {
          imageOrder.push(item.url);
          keptExistingImages.push(item.url);
        } else if (item.type === "new" && item.file) {
          imageOrder.push(`NEW_${newFileIndex}`);
          formData.append("images", item.file);
          newFileIndex++;
        }
      });

      formData.append("imageOrder", JSON.stringify(imageOrder));
      formData.append("existingImages", JSON.stringify(keptExistingImages));

      // Set thumbnail explicitly as index 0 (the cover image)
      if (imageOrder.length > 0) {
        formData.append("thumbnail", imageOrder[0]);
      }

      const res = await turfService.updateTurf(turf._id, formData);
      const updated = res?.data || { ...turf, name, type, address, pricePerHour };

      toast.success("Turf details & cover photo updated successfully!");
      if (onTurfUpdated) onTurfUpdated(updated);
      onClose();
    } catch (err) {
      console.log("Update turf error:", err);
      toast.error(err?.response?.data?.message || "Failed to update turf details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTurf = async () => {
    if (!isOwner) {
      toast.error("Unauthorized: You do not own this turf.");
      return;
    }

    setLoading(true);
    try {
      await turfService.deleteTurf(turf._id);
      toast.success("Turf deleted successfully!");
      if (onTurfDeleted) onTurfDeleted(turf._id);
      setIsConfirmDeleteOpen(false);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete turf.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 animate-in fade-in duration-200 cursor-pointer">
        <div
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#090e15] border border-white/10 shadow-2xl overflow-hidden dynamic-sidebar-shift transition-transform duration-200 ease-out will-change-transform"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#0b121c]">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg">
                <Building2 className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-white font-display">
                    Edit Turf Arena
                  </h3>
                  <Badge variant="emerald" className="text-[10px] py-0.5 px-2 font-bold">
                    Admin Owner
                  </Badge>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Update location, pricing, schedule, amenities & pitch photos
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            {/* Ownership Warning if not owner */}
            {!isOwner && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300">
                <AlertTriangle className="size-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-red-200">Access Restricted</p>
                  <p>You can only edit turfs that you own and listed from your administrator account.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} id="edit-turf-form" className="space-y-6">
              {/* 1. Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-emerald-400" /> Arena Name *
                  </Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Camp Nou Elite Arena"
                    disabled={!isOwner}
                    className="h-11 rounded-2xl bg-black/60 border-white/10 text-white placeholder:text-neutral-500 text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="size-3.5 text-emerald-400" /> Surface Category *
                  </Label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    disabled={!isOwner}
                    className="w-full h-11 px-3.5 rounded-2xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="turf">Pro AstroTurf (5v5 / 7v7)</option>
                    <option value="playground">Full Open Ground (11v11)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <IndianRupee className="size-3.5 text-emerald-400" /> Hourly Rate (₹ / hour) *
                  </Label>
                  <Input
                    type="number"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    placeholder="1200"
                    min="0"
                    disabled={!isOwner}
                    className="h-11 rounded-2xl bg-black/60 border-white/10 text-white placeholder:text-neutral-500 text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="size-3.5 text-emerald-400" /> Contact Phone
                  </Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    disabled={!isOwner}
                    className="h-11 rounded-2xl bg-black/60 border-white/10 text-white placeholder:text-neutral-500 text-sm font-medium"
                  />
                </div>
              </div>

              {/* 2. Schedule */}
              <div className="p-4 rounded-3xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row gap-4">
                  <LuxuryTimeSelect
                    label="Opening Time"
                    value={openingTime}
                    onChange={setOpeningTime}
                    icon={Sun}
                  />
                  <LuxuryTimeSelect
                    label="Closing Time"
                    value={closingTime}
                    onChange={setClosingTime}
                    icon={Moon}
                  />
                </div>
              </div>

              {/* 3. Address & Interactive Leaflet Map */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-emerald-400" /> Street Address & Landmark *
                  </Label>
                  <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Near Grand Sports Hub, Sector 45"
                    disabled={!isOwner}
                    className="h-11 rounded-2xl bg-black/60 border-white/10 text-white placeholder:text-neutral-500 text-sm font-medium"
                    required
                  />
                </div>

                {/* Map Container */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="font-semibold flex items-center gap-1 text-emerald-400">
                      <Crosshair className="size-3.5" /> Drag marker or click map to set exact GPS pin
                    </span>
                    <span className="font-mono text-[11px] text-neutral-500">
                      [{coords[0]}, {coords[1]}]
                    </span>
                  </div>

                  <div className="w-full h-56 rounded-3xl overflow-hidden border border-white/15 relative z-10 shadow-xl">
                    <MapContainer
                      center={coords}
                      zoom={14}
                      style={{ width: "100%", height: "100%" }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <ChangeMapView coords={coords} />
                      <MapClickHandler onClick={setCoords} />
                      <DraggableTurfMarker
                        position={coords}
                        onDragEnd={setCoords}
                        address={address}
                        name={name}
                      />
                    </MapContainer>
                  </div>
                </div>
              </div>

              {/* 4. Amenities Checklist */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-400" /> Pitch Amenities
                </Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleToggleAmenity(amenity)}
                        disabled={!isOwner}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${isSelected
                            ? "bg-emerald-500 text-neutral-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                            : "bg-black/50 text-neutral-400 border-white/10 hover:border-white/20 hover:text-white"
                          }`}
                      >
                        {isSelected ? <Check className="size-3 stroke-[3]" /> : <Plus className="size-3" />}
                        <span>{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Images Manager (Reorderable Pitch Photos & Cover Selection) */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="size-3.5 text-emerald-400" /> Pitch Photos & Gallery
                    </Label>
                    <span className="text-xs text-neutral-400 font-medium">
                      {galleryItems.length} {galleryItems.length === 1 ? "image" : "images"} total
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-medium">
                    Card #1 is your primary pitch hero cover & thumbnail. Drag cards to reorder, or click &ldquo;Make Cover&rdquo;.
                  </p>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {galleryItems.map((item, index) => {
                    const isCover = index === 0;
                    const isDragging = draggedItemIndex === index;
                    const isDragOver = dragOverItemIndex === index;

                    return (
                      <div
                        key={item.id}
                        draggable={isOwner}
                        onDragStart={(e) => isOwner && handleCardDragStart(e, index)}
                        onDragOver={(e) => isOwner && handleCardDragOver(e, index)}
                        onDragEnd={handleCardDragEnd}
                        onDrop={(e) => isOwner && handleCardDrop(e, index)}
                        className={`group relative rounded-2xl overflow-hidden bg-[#060a0f] border transition-all select-none ${
                          isOwner ? "cursor-grab active:cursor-grabbing" : ""
                        } ${
                          isCover
                            ? "border-emerald-500 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-500/50"
                            : "border-white/15 hover:border-white/30"
                        } ${isDragging ? "opacity-40 scale-95" : ""} ${
                          isDragOver ? "ring-2 ring-emerald-400 scale-105" : ""
                        }`}
                      >
                        {/* Image Preview */}
                        <div className="aspect-video w-full bg-neutral-900 overflow-hidden">
                          <img
                            src={item.type === "existing" ? optimizeTurfThumbnail(item.url) : item.url}
                            alt={`Pitch photo ${index + 1}`}
                            className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        {/* Drag Grip Handle */}
                        {isOwner && (
                          <div className="absolute top-1.5 left-1.5 p-1 rounded-lg bg-black/80 text-white/80 opacity-80 group-hover:opacity-100 shadow-md">
                            <GripVertical className="size-3.5" />
                          </div>
                        )}

                        {/* Status Badge (Saved vs New) */}
                        <div
                          className={`absolute top-1.5 ${
                            isOwner ? "left-8" : "left-1.5"
                          } px-1.5 py-0.5 rounded text-[9px] font-bold shadow-md ${
                            item.type === "new"
                              ? "bg-emerald-500 text-neutral-950 font-black"
                              : "bg-black/75 text-neutral-300 border border-white/10"
                          }`}
                        >
                          {item.type === "new" ? "New" : "Saved"}
                        </div>

                        {/* Top Right: Delete Button */}
                        {isOwner && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(index);
                            }}
                            className="absolute top-1.5 right-1.5 size-6 rounded-lg bg-black/80 hover:bg-red-500 text-neutral-300 hover:text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-md"
                            title="Remove photo"
                          >
                            <X className="size-3.5 stroke-[2.5]" />
                          </button>
                        )}

                        {/* Bottom Overlay: Cover Badge or Make Cover Action */}
                        {isCover ? (
                          <div className="absolute bottom-0 inset-x-0 bg-black/90 px-2 py-1 flex items-center justify-between border-t border-emerald-500/30">
                            <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                              <Star className="size-3 fill-emerald-400" /> MAIN COVER
                            </span>
                            <span className="text-[10px] font-mono text-emerald-300 font-bold">
                              #1
                            </span>
                          </div>
                        ) : (
                          <div className="absolute bottom-0 inset-x-0 bg-black/90 px-2 py-1 flex items-center justify-between border-t border-white/10">
                            {isOwner ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetCover(index);
                                }}
                                className="text-[10px] font-bold text-emerald-300 hover:text-white bg-emerald-500/30 hover:bg-emerald-500/50 px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-0.5"
                              >
                                <Star className="size-2.5" /> Make Cover
                              </button>
                            ) : (
                              <div />
                            )}
                            <span className="text-[10px] font-mono text-neutral-400 font-bold">
                              #{index + 1}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Upload Trigger Dropzone Card */}
                  {isOwner && galleryItems.length < 15 && (
                    <div
                      onDragOver={handleDropzoneDragOver}
                      onDragLeave={handleDropzoneDragLeave}
                      onDrop={handleDropzoneDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer ${
                        isDropzoneDraggingOver
                          ? "border-emerald-400 bg-emerald-500/20 scale-[1.02]"
                          : "border-white/20 bg-black/30 hover:border-emerald-500/60 hover:bg-black/50"
                      }`}
                    >
                      <Upload className="size-5 text-emerald-400 mb-1" />
                      <span className="text-[11px] font-bold text-white">Add Photos</span>
                      <span className="text-[9px] text-neutral-400">Click or Drag & Drop</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => e.target.files && handleAddFiles(e.target.files)}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-white/10 bg-[#0b121c] flex items-center justify-between gap-3">
            {isOwner ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsConfirmDeleteOpen(true)}
                disabled={loading}
                className="h-10 px-3.5 text-xs font-bold rounded-xl text-red-400 border-red-500/30 hover:bg-red-500/15 hover:text-red-300 gap-1.5 cursor-pointer"
              >
                <Trash2 className="size-3.5" /> Delete Turf
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onClose}
                disabled={loading}
                className="h-10 px-4 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/15 text-white border-white/10 cursor-pointer"
              >
                Cancel
              </Button>

              {isOwner && (
                <Button
                  type="submit"
                  form="edit-turf-form"
                  variant="primary"
                  size="sm"
                  disabled={loading}
                  className="h-10 px-5 text-xs font-bold rounded-xl gap-1.5 shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="size-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="size-3.5" />
                      <span>Save Turf Updates</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Turf Confirmation Modal */}
      {isConfirmDeleteOpen && (
        <ConfirmDeleteModal
          isOpen={isConfirmDeleteOpen}
          onClose={() => setIsConfirmDeleteOpen(false)}
          onConfirm={handleDeleteTurf}
          title={`Delete "${name}"?`}
          message="Are you sure you want to permanently delete this turf? All associated match slots, active passes, and listed photos will be removed."
          confirmText="Yes, Delete Arena"
        />
      )}
    </>
  );
}
