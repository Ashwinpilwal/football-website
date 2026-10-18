import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MapPin,
  Clock3,
  Phone,
  CheckCircle2,
  CalendarDays,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  Lock,
  Hourglass,
  Users,
  MessageCircle,
  Send,
  Edit3,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { turfService, bookingService } from "@/services/turf.service";
import { chatService } from "@/services/social.service";
import EditTurfModal from "@/components/turfs/EditTurfModal";
import TurfRatingsSection from "@/components/turfs/TurfRatingsSection";
import toast from "react-hot-toast";
import { cleanAddress, optimizeTurfHeroImage, optimizeMiniThumbnail } from "@/utils/avatar.utils";

export default function TurfDetailPage() {
  const { turfId } = useParams();
  const navigate = useNavigate();
  const { userData, status } = useSelector((state) => state.auth);

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSlotDateIndex, setSelectedSlotDateIndex] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlotsMap, setBookedSlotsMap] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Squad selection for match announcement
  const [squadChats, setSquadChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState("");

  // Edit Turf Modal state for Admin Turf Owner
  const [isEditTurfModalOpen, setIsEditTurfModalOpen] = useState(false);

  // Dynamic 7-day upcoming calendar starting from Today
  const dates = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const label =
        i === 0
          ? "Today"
          : i === 1
          ? "Tomorrow"
          : d.toLocaleDateString("en-US", { weekday: "short" });
      const sub = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      list.push({ label, dateStr, sub, dateObj: d });
    }
    return list;
  }, []);

  const selectedDateObj = dates[selectedSlotDateIndex] || dates[0];

  useEffect(() => {
    const loadTurf = async () => {
      setLoading(true);
      try {
        const res = await turfService.getTurfById(turfId);
        if (res?.data) {
          setTurf(res.data);
        }
      } catch (err) {
        console.log("Turf details error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (turfId) loadTurf();
  }, [turfId]);

  // Load user's group chats to select squad for this match
  useEffect(() => {
    const loadSquads = async () => {
      if (!status) return;
      try {
        const res = await chatService.getAllGroupChats();
        const data = res?.data || [];
        const formatted = Array.isArray(data) ? data : [];
        setSquadChats(formatted);
        if (formatted.length > 0) {
          setSelectedChatId(formatted[0]._id);
        }
      } catch (err) {
        console.log("Squad chats fetch error:", err);
      }
    };
    loadSquads();
  }, [status]);

  // Fetch slot availability for selected date
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!turfId || !selectedDateObj?.dateStr) return;
      setLoadingAvailability(true);
      try {
        const res = await bookingService.getBookedSlots(turfId, selectedDateObj.dateStr);
        const booked = res?.data?.bookedSlots || [];
        const map = {};
        booked.forEach((b) => {
          map[b.startTime] = b;
        });
        setBookedSlotsMap(map);
        // Deselect any slot that is now unavailable
        setSelectedSlots((prev) => prev.filter((s) => !map[s.startTime]));
      } catch (err) {
        console.log("Availability error:", err);
      } finally {
        setLoadingAvailability(false);
      }
    };
    fetchAvailability();
  }, [turfId, selectedDateObj?.dateStr]);

  const availableSlots = [
    { id: "s1", startTime: "06:00 AM", endTime: "07:00 AM", price: turf?.pricePerHour || 1200 },
    { id: "s2", startTime: "07:00 AM", endTime: "08:00 AM", price: turf?.pricePerHour || 1200 },
    { id: "s3", startTime: "08:00 AM", endTime: "09:00 AM", price: turf?.pricePerHour || 1200 },
    { id: "s4", startTime: "05:00 PM", endTime: "06:00 PM", price: turf?.pricePerHour || 1200 },
    { id: "s5", startTime: "06:00 PM", endTime: "07:00 PM", price: turf?.pricePerHour || 1200 },
    { id: "s6", startTime: "07:00 PM", endTime: "08:00 PM", price: (turf?.pricePerHour || 1200) + 200, isPeak: true },
    { id: "s7", startTime: "08:00 PM", endTime: "09:00 PM", price: (turf?.pricePerHour || 1200) + 200, isPeak: true },
    { id: "s8", startTime: "09:00 PM", endTime: "10:00 PM", price: turf?.pricePerHour || 1200 },
    { id: "s9", startTime: "10:00 PM", endTime: "11:00 PM", price: turf?.pricePerHour || 1200 },
  ];

  // Check if slot has already passed in current time today
  const isSlotPastToday = (slotTimeStr) => {
    if (selectedSlotDateIndex !== 0) return false;
    const now = new Date();
    const match = slotTimeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)?$/i);
    if (!match) return false;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const p = match[3]?.toUpperCase();
    if (p === "PM" && h < 12) h += 12;
    if (p === "AM" && h === 12) h = 0;
    const slotMinutes = h * 60 + m;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return slotMinutes <= currentMinutes;
  };

  const toggleSlot = (slot) => {
    if (isSlotPastToday(slot.startTime)) {
      toast.error("This time slot has already passed for today.");
      return;
    }
    if (bookedSlotsMap[slot.startTime]) {
      toast.error("This slot is already booked or awaiting admin confirmation.");
      return;
    }
    const exists = selectedSlots.find((s) => s.id === slot.id);
    if (exists) {
      setSelectedSlots(selectedSlots.filter((s) => s.id !== slot.id));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const totalPrice = selectedSlots.reduce((acc, curr) => acc + curr.price, 0);

  const handleCreateBooking = async () => {
    if (!status) {
      toast.error("Please sign in to request a turf booking.");
      navigate("/login");
      return;
    }

    if (selectedSlots.length === 0) {
      toast.error("Please select at least one time slot.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        turfId: turf._id,
        date: selectedDateObj.dateStr,
        slots: selectedSlots.map((s) => ({ startTime: s.startTime, endTime: s.endTime })),
        chatId: selectedChatId || undefined,
      };

      const res = await bookingService.createBooking(payload);
      toast.success("Booking request sent to admin & squad group notified!");
      navigate("/my-bookings");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Booking request failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-14 text-center text-sm text-neutral-400 space-y-3">
        <div className="size-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-semibold">Loading ground information...</p>
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="p-14 rounded-3xl bg-neutral-900 border border-white/10 text-center space-y-3">
        <MapPin className="size-10 text-neutral-500 mx-auto" />
        <h3 className="text-base font-bold text-white font-display">Turf Not Found</h3>
        <Link to="/find-turfs">
          <Button variant="primary" size="sm" className="text-xs font-bold rounded-xl">
            Browse All Turfs
          </Button>
        </Link>
      </div>
    );
  }

  const images = turf.images?.length > 0 ? turf.images : ["https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200"];

  return (
    <div className="-mt-2 sm:-mt-4 space-y-4 animate-in fade-in duration-300 pb-12">
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" className="text-xs px-2.5 py-0.5 font-bold">{turf.type?.toUpperCase() || "TURF"}</Badge>
              {userData?.role === "admin" && (turf.owner?._id || turf.owner)?.toString() === userData?._id?.toString() && (
                <Badge variant="outline" className="text-xs px-2.5 py-0.5 font-bold border-emerald-500/40 text-emerald-400">
                  Your Listed Arena
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-display">{turf.name}</h1>
            <p className="text-xs sm:text-sm text-neutral-300 flex items-center gap-1.5 mt-0.5 font-medium">
              <MapPin className="size-3.5 text-emerald-400 shrink-0" />
              {cleanAddress(turf.address)}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap md:flex-nowrap">
            {/* Back Button shifted to right side */}
            <Link
              to="/find-turfs"
              className="h-10 px-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <ChevronLeft className="size-4" />
              <span>Back to Turfs</span>
            </Link>

            {/* Edit Turf Button strictly for Owner Admin */}
            {userData?.role === "admin" && (turf.owner?._id || turf.owner)?.toString() === userData?._id?.toString() && (
              <Button
                onClick={() => setIsEditTurfModalOpen(true)}
                variant="secondary"
                size="sm"
                className="h-10 px-3.5 rounded-2xl text-xs font-bold gap-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <Edit3 className="size-3.5" />
                <span>Edit Turf Details</span>
              </Button>
            )}

            {turf.pricePerHour && (
              <div className="px-3.5 py-1.5 rounded-2xl bg-neutral-900/90 border border-white/10 text-right shadow-xl min-w-[110px]">
                <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Price per Hour</div>
                <div className="text-lg sm:text-xl font-black text-emerald-400 font-display">
                  ₹{turf.pricePerHour} <span className="text-xs font-semibold text-neutral-400">/hr</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Still Main Cover Image */}
        <div className="relative h-56 sm:h-80 md:h-[450px] lg:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl">
          <img
            src={optimizeTurfHeroImage(images[activeImageIndex])}
            alt={turf.name}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Photo Counter Pill */}
          {images.length > 1 && (
            <div className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-xl bg-black/85 border border-white/15 text-xs font-mono font-bold text-white shadow-lg flex items-center gap-1.5">
              <span>📷</span>
              <span>{activeImageIndex + 1} / {images.length}</span>
            </div>
          )}
        </div>

        {/* Thumbnail Gallery Strip Component Below Cover */}
        {images.length > 1 && (
          <div className="p-3.5 rounded-2xl bg-[#090e15] border border-white/[0.08] shadow-xl space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="size-5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Camera className="size-3" />
                </div>
                <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-display">
                  Arena Photos & Angles
                </span>
                <span className="text-[11px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  {images.length} photos
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 font-medium hidden sm:inline-block">
                Click any thumbnail to preview
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar p-1.5">
              {images.map((img, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={`thumb_${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 sm:w-28 h-16 sm:h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-150 cursor-pointer group focus:outline-none ${
                      isActive
                        ? "border-emerald-400 shadow-md shadow-emerald-500/30 opacity-100"
                        : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={optimizeMiniThumbnail(img)}
                      alt={`Turf angle ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                    )}
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/85 text-[9px] font-mono font-bold text-neutral-200 pointer-events-none">
                      {idx + 1}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Specs + Slot Picker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-7 bg-[#0b1118] border-white/10 space-y-6 shadow-2xl rounded-3xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5 font-display">
              <ShieldCheck className="size-6 text-emerald-400" />
              Ground Information
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-1">
                <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Opening Time</div>
                <div className="text-base font-bold text-white">{turf.openingTime || "06:00 AM"}</div>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-1">
                <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Closing Time</div>
                <div className="text-base font-bold text-white">{turf.closingTime || "11:30 PM"}</div>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-1">
                <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Phone Hotline</div>
                <div className="text-base font-bold text-emerald-400 font-mono">{turf.phone || "Available"}</div>
              </div>
            </div>

            {turf.amenities?.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Amenities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {turf.amenities.map((a, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-neutral-950/80 border border-white/[0.07] text-sm text-neutral-200 flex items-center gap-2.5 font-medium"
                    >
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span className="truncate">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Slot Picker & Squad Notification Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-7 bg-[#0b1118] border-white/10 space-y-6 sticky top-24 shadow-2xl rounded-3xl">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2.5 font-display">
                <CalendarDays className="size-6 text-emerald-400" />
                Select Slot & Squad
              </h3>
              <p className="text-xs text-neutral-400 mt-1 font-medium">Pick dynamic calendar date, slots, and notify your squad.</p>
            </div>

            {/* Dynamic 7-Day Calendar Ribbon */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
              {dates.map((d, index) => (
                <button
                  key={d.dateStr}
                  type="button"
                  onClick={() => setSelectedSlotDateIndex(index)}
                  className={`flex flex-col items-center px-4 py-3 rounded-2xl border transition-all shrink-0 cursor-pointer ${
                    selectedSlotDateIndex === index
                      ? "bg-emerald-500 text-neutral-950 border-emerald-400 font-extrabold shadow-md shadow-emerald-500/20"
                      : "bg-neutral-950 text-neutral-300 border-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="text-xs font-bold">{d.label}</span>
                  <span className="text-[10px] opacity-80 mt-0.5">{d.sub}</span>
                </button>
              ))}
            </div>

            {/* Slots Matrix */}
            <div className="space-y-2">
              {loadingAvailability ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  <div className="size-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Checking real-time slot availability...
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                  {availableSlots.map((slot) => {
                    const isPast = isSlotPastToday(slot.startTime);
                    const isBooked = !!bookedSlotsMap[slot.startTime];
                    const bookingInfo = bookedSlotsMap[slot.startTime];
                    const isSelected = selectedSlots.some((s) => s.id === slot.id);

                    if (isPast) {
                      return (
                        <div
                          key={slot.id}
                          className="p-3.5 rounded-2xl border border-white/5 bg-neutral-950/40 text-neutral-500 opacity-60 cursor-not-allowed select-none flex flex-col justify-between"
                          title="This time slot has already passed for today."
                        >
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="line-through text-neutral-500">{slot.startTime}</span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-neutral-500 border border-white/10">
                              Passed
                            </span>
                          </div>
                          <div className="text-[10.5px] text-neutral-600 mt-1.5 flex items-center gap-1 font-medium">
                            <Clock3 className="size-3 text-neutral-600" /> Expired
                          </div>
                        </div>
                      );
                    }

                    if (isBooked) {
                      return (
                        <div
                          key={slot.id}
                          className="p-3.5 rounded-2xl border border-red-500/20 bg-red-950/20 text-neutral-400 opacity-75 cursor-not-allowed select-none flex flex-col justify-between"
                          title="This slot has already been booked or is awaiting confirmation."
                        >
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="line-through text-neutral-400">{slot.startTime}</span>
                            <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                              {bookingInfo?.status === "confirmed" ? "Booked" : "Unavailable"}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-1.5 flex items-center gap-1 font-medium">
                            <Lock className="size-3 text-red-400/80" /> Slot Reserved
                          </div>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => toggleSlot(slot)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-emerald-500/20 border-emerald-400 text-white ring-1 ring-emerald-400 shadow-md shadow-emerald-500/10"
                            : "bg-neutral-950/80 border-white/10 hover:border-white/25 text-neutral-200"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-white">{slot.startTime}</span>
                          {isSelected && (
                            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-emerald-400 font-bold mt-1.5 font-mono">₹{slot.price}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Squad Selection Box */}
            <div className="p-4.5 rounded-2xl bg-neutral-950 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5 font-display">
                  <Users className="size-4 text-emerald-400" />
                  Select Squad for Match
                </label>
                {selectedChatId && (
                  <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                    📢 Auto-Notify
                  </span>
                )}
              </div>

              {squadChats.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={selectedChatId}
                    onChange={(e) => setSelectedChatId(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#0e1520] border border-white/10 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    {squadChats.map((chat) => (
                      <option key={chat._id} value={chat._id}>
                        ⚽ {chat.groupName || "Squad Group"} ({chat.participants?.length || 0} members)
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    Everyone in this squad will receive an instant match pass announcement & live notification in their chat.
                  </p>
                </div>
              ) : (
                <div className="text-xs text-neutral-400 space-y-1.5">
                  <p>No squad group chats found.</p>
                  <Link to="/messages" className="text-xs text-emerald-400 font-bold hover:underline inline-flex items-center gap-1">
                    + Create a Squad Group in Messages
                  </Link>
                </div>
              )}
            </div>

            {/* Calculation */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-3">
              <div className="flex justify-between text-xs text-neutral-400 font-medium">
                <span>Selected Date</span>
                <span className="text-white font-bold">{selectedDateObj.label} ({selectedDateObj.sub})</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-400 font-medium">
                <span>Slots Selected</span>
                <span className="text-white font-bold">{selectedSlots.length} hour(s)</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/5 font-display">
                <span>Total Amount</span>
                <span className="text-emerald-400 font-black text-lg font-mono">₹{totalPrice}</span>
              </div>
            </div>

            <Button
              onClick={handleCreateBooking}
              disabled={isSubmitting || selectedSlots.length === 0}
              variant="primary"
              className="w-full py-4 rounded-2xl font-bold text-sm shadow-xl cursor-pointer"
            >
              {isSubmitting ? "Submitting Request..." : `Request Booking & Notify Squad (₹${totalPrice})`}
            </Button>
          </Card>
        </div>
      </div>

      {/* Verified Booker Player Ratings & Reviews Section */}
      <TurfRatingsSection turfId={turfId} turfName={turf?.name} />

      {/* Edit Turf Modal for Admin Turf Owner */}
      {isEditTurfModalOpen && (
        <EditTurfModal
          turf={turf}
          isOpen={isEditTurfModalOpen}
          onClose={() => setIsEditTurfModalOpen(false)}
          onTurfUpdated={(updated) => setTurf(updated)}
          onTurfDeleted={() => navigate("/find-turfs")}
        />
      )}
    </div>
  );
}
