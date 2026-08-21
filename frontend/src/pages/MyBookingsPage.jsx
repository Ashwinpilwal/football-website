import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CalendarDays,
  Clock3,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  QrCode,
  Flame,
  ArrowRight,
  Shield,
  Ticket,
  ShieldCheck,
  User,
  Check,
  X,
  Layers,
  Plus,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { bookingService } from "@/services/turf.service";
import CreateTurfModal from "@/components/turfs/CreateTurfModal";
import EditTurfModal from "@/components/turfs/EditTurfModal";
import CancelBookingModal from "@/components/turfs/CancelBookingModal";
import { getAvatarUrl, cleanAddress } from "@/utils/avatar.utils";
import toast from "react-hot-toast";

export default function MyBookingsPage() {
  const { userData, status } = useSelector((state) => state.auth);

  const [viewMode, setViewMode] = useState("my"); // "my" | "admin"
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [adminRequests, setAdminRequests] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [isCreateTurfModalOpen, setIsCreateTurfModalOpen] = useState(false);
  const [editingTurf, setEditingTurf] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      const data = res?.data || [];
      const formatted = Array.isArray(data) ? data : [];
      setBookings(formatted);
      if (formatted.length > 0 && !selectedBooking) {
        setSelectedBooking(formatted[0]);
      }

      // Fetch admin requests only if user is admin
      if (userData?.role === "admin") {
        try {
          const adminRes = await bookingService.getAdminBookingRequests();
          const adminData = adminRes?.data || [];
          setAdminRequests(Array.isArray(adminData) ? adminData : []);
        } catch (e) {
          setAdminRequests([]);
        }
      } else {
        setAdminRequests([]);
      }
    } catch (err) {
      console.log("My bookings fetch error:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userData?.role]);

  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    const id = cancelModalBooking._id;
    setIsCancelling(true);
    try {
      await bookingService.cancelBooking(id);
      toast.success("Match pass cancelled successfully.");
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
      if (selectedBooking?._id === id) {
        setSelectedBooking((prev) => ({ ...prev, status: "cancelled" }));
      }
      setCancelModalBooking(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel match pass.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleAdminUpdateStatus = async (bookingId, newStatus) => {
    setActionLoadingId(bookingId);
    try {
      const res = await bookingService.updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking ${newStatus === "confirmed" ? "confirmed & approved" : "rejected"}!`);
      
      // Update local admin requests state
      setAdminRequests((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );

      // Update user bookings state if matching
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
      if (selectedBooking?._id === bookingId) {
        setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to ${newStatus} booking.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const isBookingPast = (booking) => {
    if (!booking) return false;
    if (booking.expiresAt) {
      return new Date(booking.expiresAt).getTime() < Date.now();
    }
    if (booking.date) {
      const baseDate = new Date(booking.date);
      let latestHour = 23;
      let latestMinute = 59;
      if (Array.isArray(booking.slots) && booking.slots.length > 0) {
        let maxMinutes = -1;
        booking.slots.forEach((s) => {
          const timeStr = s.endTime || s.startTime;
          if (timeStr) {
            const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)?$/i);
            if (match) {
              let h = parseInt(match[1], 10);
              const m = parseInt(match[2], 10);
              const p = match[3]?.toUpperCase();
              if (p === "PM" && h < 12) h += 12;
              if (p === "AM" && h === 12) h = 0;
              const totalM = h * 60 + m;
              if (totalM > maxMinutes) {
                maxMinutes = totalM;
                latestHour = h;
                latestMinute = m;
              }
            }
          }
        });
      }
      const expiry = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        latestHour,
        latestMinute,
        0,
        0
      );
      return expiry.getTime() < Date.now();
    }
    return false;
  };

  const currentList = viewMode === "admin" && userData?.role === "admin" ? adminRequests : bookings;

  const filterTabs = [
    { id: "all", label: `All (${currentList.length})` },
    {
      id: "upcoming",
      label: `Active & Upcoming (${
        currentList.filter(
          (b) => !isBookingPast(b) && b.status !== "cancelled" && b.status !== "rejected"
        ).length
      })`,
    },
    {
      id: "past",
      label: `Past Bookings (${currentList.filter((b) => isBookingPast(b)).length})`,
    },
    {
      id: "pending",
      label: `Pending (${currentList.filter((b) => b.status === "pending" && !isBookingPast(b)).length})`,
    },
    {
      id: "confirmed",
      label: `Confirmed (${
        currentList.filter((b) => b.status === "confirmed" && !isBookingPast(b)).length
      })`,
    },
    {
      id: "cancelled",
      label: `Cancelled (${
        currentList.filter((b) => (b.status === "cancelled" || b.status === "rejected") && !isBookingPast(b)).length
      })`,
    },
  ];

  const filteredBookings = currentList.filter((b) => {
    const past = isBookingPast(b);
    if (activeTab === "all") return true;
    if (activeTab === "upcoming")
      return !past && b.status !== "cancelled" && b.status !== "rejected";
    if (activeTab === "past") return past;
    if (activeTab === "pending") return b.status === "pending" && !past;
    if (activeTab === "confirmed") return b.status === "confirmed" && !past;
    if (activeTab === "cancelled")
      return (b.status === "cancelled" || b.status === "rejected") && !past;
    return b.status === activeTab;
  });

  const pendingAdminCount = adminRequests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight font-display flex items-center gap-3">
            <CalendarDays className="size-8 text-emerald-400" />
            {viewMode === "admin" && userData?.role === "admin"
              ? "Ground Admin Approval Desk"
              : "My Bookings & Match Passes"}
          </h1>
          <p className="text-sm text-neutral-300 font-medium mt-1">
            {viewMode === "admin" && userData?.role === "admin"
              ? "Review and approve incoming turf slot booking requests from footballers."
              : "View scheduled match passes, past historical matches, and QR entry vouchers."}
          </p>
        </div>

        {/* View Mode Switcher: Only visible for Admin accounts */}
        {userData?.role === "admin" && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsCreateTurfModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="size-4 stroke-[3]" />
              <span>Create & List Turf</span>
            </button>

            <div className="flex items-center gap-1.5 bg-[#090e15] border border-white/10 p-1.5 rounded-2xl shadow-xl">
              <button
                type="button"
                onClick={() => setViewMode("my")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "my"
                    ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-extrabold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                My Match Passes ({bookings.length})
              </button>

              <button
                type="button"
                onClick={() => setViewMode("admin")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "admin"
                    ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-extrabold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="size-3.5" />
                <span>Admin Desk ({adminRequests.length})</span>
                {pendingAdminCount > 0 && (
                  <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs Row */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 custom-scrollbar">
        <div className="flex items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-neutral-950 font-black shadow-md shadow-emerald-500/20"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white border border-white/[0.06]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-neutral-400 font-mono hidden sm:block shrink-0">
          Showing {filteredBookings.length} booking(s)
        </span>
      </div>

      {/* Bookings Stream & Pass Drawer */}
      {loading ? (
        <div className="p-14 text-center text-sm text-neutral-400 space-y-3">
          <div className="size-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-semibold">Loading schedule and bookings...</p>
        </div>
      ) : currentList.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Bookings Cards List */}
          <div className="lg:col-span-7 space-y-4">
            {filteredBookings.map((b) => {
              const isPast = isBookingPast(b);
              return (
                <div
                  key={b._id}
                  onClick={() => setSelectedBooking(b)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer shadow-xl ${
                    selectedBooking?._id === b._id
                      ? "bg-[#0b1118] border-emerald-500/50 shadow-2xl ring-1 ring-emerald-500/30"
                      : isPast
                      ? "bg-[#06090e]/60 hover:bg-[#080d14] border-white/[0.05] opacity-80"
                      : "bg-[#070b10]/80 hover:bg-[#0b1118] border-white/[0.08]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`size-13 rounded-2xl border flex items-center justify-center font-bold shrink-0 shadow-md ${
                          isPast
                            ? "bg-neutral-950/80 border-white/5 text-neutral-500"
                            : "bg-neutral-950 border-white/10 text-emerald-400"
                        }`}
                      >
                        <Ticket className="size-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-display font-bold text-lg truncate ${
                              isPast ? "text-neutral-300" : "text-white"
                            }`}
                          >
                            {b.turf?.name || "Ground Match Pass"}
                          </h3>
                          {viewMode === "admin" &&
                            b.turf &&
                            (b.turf.owner?._id || b.turf.owner)?.toString() ===
                              userData?._id?.toString() && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTurf(b.turf);
                                }}
                                className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0"
                                title="Edit Turf Details"
                              >
                                <Edit3 className="size-3" />
                                <span>Edit Turf</span>
                              </button>
                            )}
                        </div>
                        <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5 truncate font-medium">
                          <MapPin className="size-3.5 text-emerald-400 shrink-0" />
                          {cleanAddress(b.turf?.address) || "Bengaluru Pitch"}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={
                        isPast
                          ? "outline"
                          : b.status === "confirmed"
                          ? "emerald"
                          : b.status === "pending"
                          ? "outline"
                          : "destructive"
                      }
                      className={`text-xs px-3 py-1 font-bold shrink-0 ${
                        isPast
                          ? "bg-neutral-800/80 text-neutral-400 border-white/10"
                          : b.status === "pending"
                          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          : ""
                      }`}
                    >
                      {isPast
                        ? "MATCH ENDED (PAST)"
                        : b.status === "pending"
                        ? "⏳ PENDING APPROVAL"
                        : b.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* User Info if viewing Admin Desk */}
                  {viewMode === "admin" && b.user && (
                    <div className="mt-4 p-3 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={getAvatarUrl(b.user)}
                          alt="User"
                          className="size-7 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-white truncate block">
                            {b.user.fullName || b.user.username}
                          </span>
                          <span className="text-neutral-400 font-mono text-[10px] truncate block">
                            @{b.user.username}
                          </span>
                        </div>
                      </div>

                      {/* Admin Instant Action Buttons on Card */}
                      {b.status === "pending" && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            disabled={actionLoadingId === b._id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdminUpdateStatus(b._id, "confirmed");
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-xs transition-all cursor-pointer shadow-md"
                          >
                            <Check className="size-3.5" /> Confirm
                          </button>
                          <button
                            type="button"
                            disabled={actionLoadingId === b._id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdminUpdateStatus(b._id, "rejected");
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs transition-all cursor-pointer"
                          >
                            <X className="size-3.5" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/[0.06] text-xs">
                    <div className="flex items-center gap-3.5 text-neutral-200 font-medium">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-neutral-400" />
                        {b.date ? new Date(b.date).toLocaleDateString() : "Scheduled Match"}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono">
                        <Clock3 className="size-3.5 text-emerald-400" />
                        {b.slots?.[0]?.startTime || "06:00 AM"} -{" "}
                        {b.slots?.[b.slots.length - 1]?.endTime || "07:00 AM"}
                      </span>
                    </div>
                    <div className="font-extrabold text-emerald-400 font-mono">
                      {b.slots?.length ? `${b.slots.length} Slot(s)` : "1 Slot"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Booking Pass Detail Drawer */}
          <div className="lg:col-span-5">
            {selectedBooking && (() => {
              const isSelectedPast = isBookingPast(selectedBooking);
              return (
                <Card className="p-7 bg-[#0b1118] border-white/10 space-y-6 sticky top-24 shadow-2xl rounded-3xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
                        Match Pass Details
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5 font-mono truncate max-w-[200px]">
                        {selectedBooking._id}
                      </h3>
                    </div>
                    <Badge
                      variant={
                        isSelectedPast
                          ? "outline"
                          : selectedBooking.status === "confirmed"
                          ? "emerald"
                          : "outline"
                      }
                      className={`text-xs px-3 py-1 font-bold ${
                        isSelectedPast
                          ? "bg-neutral-800/80 text-neutral-400 border-white/10"
                          : selectedBooking.status === "pending"
                          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          : ""
                      }`}
                    >
                      {isSelectedPast
                        ? "MATCH COMPLETED / PAST"
                        : selectedBooking.status === "pending"
                        ? "⏳ Awaiting Approval"
                        : selectedBooking.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-11 rounded-2xl border flex items-center justify-center ${
                          isSelectedPast
                            ? "bg-neutral-950 text-neutral-400 border-white/10"
                            : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        }`}
                      >
                        <Ticket className="size-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                          Official Match Pass
                        </span>
                        <h4 className="font-bold text-sm text-white">
                          {selectedBooking.turf?.name || "Ground Venue"}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5 text-neutral-400 font-mono">
                      <span>Voucher #{selectedBooking._id?.slice(-8)?.toUpperCase()}</span>
                      <span
                        className={
                          isSelectedPast
                            ? "text-neutral-400"
                            : "text-emerald-400 font-semibold"
                        }
                      >
                        {isSelectedPast ? "Expired Match Day" : "Active Match Day"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-white/[0.06]">
                      <span className="text-neutral-400 font-medium shrink-0">Turf Venue</span>
                      <span className="text-white font-bold text-right truncate">
                        {selectedBooking.turf?.name || "Ground Venue"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-white/[0.06]">
                      <span className="text-neutral-400 font-medium shrink-0">Match Date</span>
                      <span className="text-white font-bold text-right">
                        {selectedBooking.date
                          ? new Date(selectedBooking.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Match Day"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-white/[0.06]">
                      <span className="text-neutral-400 font-medium shrink-0 pt-0.5">Reserved Slots</span>
                      <div className="flex justify-end flex-wrap gap-1.5 max-w-[65%] text-right">
                        {selectedBooking.slots && selectedBooking.slots.length > 0 ? (
                          selectedBooking.slots.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono text-[11px] font-bold shrink-0"
                            >
                              {s.startTime ? (s.endTime ? `${s.startTime} - ${s.endTime}` : s.startTime) : s}
                            </span>
                          ))
                        ) : (
                          <span className="text-emerald-400 font-bold font-mono text-xs">Standard Slot</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-white/[0.06]">
                      <span className="text-neutral-400 font-medium shrink-0">Booked By</span>
                      <span className="text-white font-bold text-right truncate">
                        {selectedBooking.user?.fullName ||
                          selectedBooking.user?.username ||
                          userData?.fullName ||
                          userData?.username ||
                          "Player"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-white/[0.06]">
                      <span className="text-neutral-400 font-medium shrink-0">Ticket Valid Until</span>
                      <span className="text-amber-400 font-bold font-mono text-xs text-right">
                        {selectedBooking.expiresAt
                          ? new Date(selectedBooking.expiresAt).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "End of Match Slot"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-2.5">
                      <span className="text-neutral-400 font-medium shrink-0">Approval Status</span>
                      <span
                        className={`font-extrabold uppercase text-xs px-2.5 py-1 rounded-lg ${
                          isSelectedPast
                            ? "bg-neutral-800 text-neutral-400 border border-white/10"
                            : selectedBooking.status === "confirmed"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : selectedBooking.status === "pending"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : "bg-red-500/15 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {isSelectedPast ? "COMPLETED & PAST" : selectedBooking.status}
                      </span>
                    </div>
                  </div>

                  {/* Admin Actions in Drawer */}
                  {viewMode === "admin" && selectedBooking.status === "pending" && (
                    <div className="pt-2 flex items-center gap-3">
                      <Button
                        disabled={actionLoadingId === selectedBooking._id}
                        onClick={() => handleAdminUpdateStatus(selectedBooking._id, "confirmed")}
                        variant="primary"
                        className="flex-1 font-bold text-xs py-3.5 rounded-xl shadow-lg cursor-pointer"
                      >
                        <Check className="size-4" /> Confirm Booking
                      </Button>
                      <Button
                        disabled={actionLoadingId === selectedBooking._id}
                        onClick={() => handleAdminUpdateStatus(selectedBooking._id, "rejected")}
                        variant="destructive"
                        className="flex-1 font-bold text-xs py-3.5 rounded-xl cursor-pointer"
                      >
                        <X className="size-4" /> Reject
                      </Button>
                    </div>
                  )}

                  {/* User Actions in Drawer */}
                  {viewMode === "my" && (
                    <div className="pt-2 flex flex-col gap-2.5">
                      <Link
                        to={`/booking-confirmation/${selectedBooking._id}`}
                        className="w-full"
                      >
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full text-xs font-bold rounded-xl py-3 cursor-pointer"
                        >
                          Open Full Match Ticket Pass <ArrowRight className="size-3.5 ml-1" />
                        </Button>
                      </Link>
                      {!isSelectedPast &&
                        selectedBooking.status !== "cancelled" &&
                        selectedBooking.status !== "rejected" && (
                          <Button
                            onClick={() => setCancelModalBooking(selectedBooking)}
                            variant="destructive"
                            size="sm"
                            className="w-full text-xs font-bold rounded-xl py-3 cursor-pointer"
                          >
                            Cancel Match Pass
                          </Button>
                        )}
                    </div>
                  )}
                </Card>
              );
            })()}
          </div>
        </div>
      ) : (
        <div className="p-14 rounded-3xl bg-[#0b1118] border border-white/10 text-center space-y-3.5 shadow-2xl">
          <Ticket className="size-12 text-neutral-500 mx-auto" />
          <h3 className="text-lg font-bold text-white font-display">
            {viewMode === "my" ? "No Match Passes Found" : "No Booking Requests Pending"}
          </h3>
          <p className="text-sm text-neutral-400 font-medium">
            {viewMode === "my"
              ? "Discover municipal turfs, check real-time slot availability, and reserve your matchday ground."
              : "All booking requests for your turfs have been processed."}
          </p>
          {viewMode === "my" && (
            <Link to="/find-turfs" className="inline-block pt-2">
              <Button variant="primary" size="sm" className="text-xs font-bold rounded-xl gap-1.5 shadow-lg">
                <MapPin className="size-3.5" /> Find Turfs to Book
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Cancel Match Pass Confirmation Modal Component */}
      <CancelBookingModal
        isOpen={Boolean(cancelModalBooking)}
        booking={cancelModalBooking}
        onClose={() => setCancelModalBooking(null)}
        onConfirm={handleConfirmCancel}
        loading={isCancelling}
      />

      {/* Create Turf Modal for Admin / Turf Owners */}
      <CreateTurfModal
        isOpen={isCreateTurfModalOpen}
        onClose={() => setIsCreateTurfModalOpen(false)}
        onTurfCreated={() => fetchBookings()}
      />

      {/* Edit Turf Modal for Admin Turf Owner */}
      {editingTurf && (
        <EditTurfModal
          turf={editingTurf}
          isOpen={!!editingTurf}
          onClose={() => setEditingTurf(null)}
          onTurfUpdated={() => fetchBookings()}
          onTurfDeleted={() => fetchBookings()}
        />
      )}
    </div>
  );
}
