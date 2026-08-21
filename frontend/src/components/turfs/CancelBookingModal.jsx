import React, { useEffect } from "react";
import { AlertTriangle, X, Ticket, CalendarDays, Clock3, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CancelBookingModal({
  isOpen,
  booking,
  onClose,
  onConfirm,
  loading = false,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !booking) return null;

  const slotTimes =
    booking.slots?.map((s) => `${s.startTime} - ${s.endTime}`).join(", ") ||
    "Standard Slot";

  const formattedDate = booking.date
    ? new Date(booking.date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "Match Day";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full rounded-3xl bg-[#0c1219] border border-red-500/30 p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200 dynamic-sidebar-shift transition-transform duration-200 ease-out will-change-transform"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="size-5.5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-display tracking-tight">
                Cancel Match Pass?
              </h3>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">
                Release pitch reservation for this matchday
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Pass Details Summary Box */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Ticket className="size-3.5 text-emerald-400" />
              <span>{booking.turf?.name || "Turf Ground"}</span>
            </div>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-white/20 font-mono text-neutral-300">
              #{String(booking._id).slice(-8)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300 pt-1">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-neutral-500 shrink-0" />
              <span className="truncate">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock3 className="size-3.5 text-emerald-400 shrink-0" />
              <span className="truncate font-mono">{slotTimes}</span>
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="p-3.5 rounded-2xl bg-red-500/[0.08] border border-red-500/20 text-xs text-neutral-200 leading-relaxed font-normal">
          Are you sure you want to cancel this match pass? Your reserved pitch slot will be immediately cancelled and released back to the turf schedule.
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl text-xs font-semibold px-4 text-neutral-400 hover:text-white cursor-pointer"
          >
            Keep Match Pass
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl text-xs font-bold px-5 bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 transition-all cursor-pointer flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Cancelling...</span>
              </>
            ) : (
              <span>Confirm Cancellation</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
