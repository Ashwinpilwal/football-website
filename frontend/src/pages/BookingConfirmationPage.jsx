import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CheckCircle2,
  CalendarDays,
  MapPin,
  Clock3,
  ShieldCheck,
  Download,
  Share2,
  ArrowRight,
  Home,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bookingService } from "@/services/turf.service";
import { generateAndDownloadMatchPass } from "@/utils/passGenerator.utils";
import { cleanAddress } from "@/utils/avatar.utils";
import toast from "react-hot-toast";

export default function BookingConfirmationPage() {
  const { bookingId } = useParams();
  const { userData } = useSelector((state) => state.auth);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await bookingService.getMyBookings();
        const bookings = res?.data || [];
        const found = bookings.find((b) => b._id === bookingId) || bookings[0];
        setBooking(found);
      } catch (err) {
        console.log("Error loading booking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Match pass link copied to clipboard!");
  };

  const handleDownload = () => {
    if (!booking) {
      toast.error("Booking data not loaded yet.");
      return;
    }

    setIsDownloading(true);

    try {
      generateAndDownloadMatchPass({
        bookingId: booking._id,
        turfName: booking.turf?.name,
        turfAddress: cleanAddress(booking.turf?.address),
        date: booking.date,
        slots: booking.slots,
        expiresAt: booking.expiresAt,
        bookerName: booking.user?.fullName || userData?.fullName || userData?.username || "Footballer",
        status: booking.status || "CONFIRMED",
      });

      toast.success("Match Pass voucher downloaded successfully! 🎟️⚽");
    } catch (err) {
      console.error("Match pass voucher download error:", err);
      toast.error("Failed to generate voucher download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 md:py-10 space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-3">
        <div className="size-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="size-9 stroke-[2.5]" />
        </div>
        <div>
          <Badge variant="emerald" className="mb-2">
            RESERVATION CONFIRMED
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Match Pass Generated!
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Your match pass voucher has been registered for the turf venue.
          </p>
        </div>
      </div>

      {booking ? (
        <div className="relative rounded-3xl bg-white dark:bg-[#0c1219] border border-neutral-200 dark:border-white/15 overflow-hidden shadow-2xl transition-colors">
          <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent dark:from-emerald-600/25 dark:via-neutral-900 dark:to-neutral-900 p-6 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between bg-neutral-50/80 dark:bg-[#070b10]">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-emerald-500 text-neutral-950 flex items-center justify-center font-bold shadow-sm">
                <Ticket className="size-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Match Pass ID
                </div>
                <div className="text-base sm:text-lg font-extrabold font-mono text-neutral-900 dark:text-white">{booking._id}</div>
              </div>
            </div>
            <Badge variant="emerald">CONFIRMED</Badge>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="p-5 rounded-3xl bg-neutral-50 dark:bg-[#070b10] border border-neutral-200 dark:border-white/10 shrink-0 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                <div className="size-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Ticket className="size-8" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Verified Pass
                </div>
              </div>

              <div className="flex-1 space-y-3 w-full">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white font-display">{booking.turf?.name || "Ground Venue"}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5 mt-1 font-medium">
                    <MapPin className="size-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    {cleanAddress(booking.turf?.address) || "Bengaluru Pitch"}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/5 space-y-0.5">
                    <div className="text-[10px] uppercase text-neutral-500 dark:text-neutral-400 font-bold tracking-wider">Date</div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      {booking.date ? new Date(booking.date).toLocaleDateString() : "Match Day"}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/5 space-y-0.5">
                    <div className="text-[10px] uppercase text-neutral-500 dark:text-neutral-400 font-bold tracking-wider">Slot Time</div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {booking.slots?.[0]?.startTime || "06:00 AM"} - {booking.slots?.[booking.slots.length - 1]?.endTime || "07:00 AM"}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/5 space-y-0.5 col-span-2 sm:col-span-1">
                    <div className="text-[10px] uppercase text-amber-600 dark:text-amber-400 font-bold tracking-wider">Valid Until</div>
                    <div className="text-xs font-bold text-amber-600 dark:text-amber-300 font-mono">
                      {booking.expiresAt
                        ? new Date(booking.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "End of Match"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-neutral-200 dark:border-white/15 my-4" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="size-4" /> Non-marking boots & bibs ready
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400/90 font-mono font-medium">
                Auto-expires after match end time
              </div>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button onClick={handleDownload} variant="secondary" size="sm" className="text-xs rounded-xl gap-1.5 bg-neutral-200/70 hover:bg-neutral-300 dark:bg-white/10 dark:hover:bg-white/20 text-neutral-800 dark:text-neutral-200">
                <Download className="size-3.5" /> Download
              </Button>
              <Button onClick={handleShare} variant="outline" size="sm" className="text-xs rounded-xl gap-1.5 border-neutral-300 dark:border-white/15 text-neutral-800 dark:text-neutral-200">
                <Share2 className="size-3.5" /> Share
              </Button>
            </div>
            <Link to="/my-bookings">
              <Button variant="primary" size="sm" className="text-xs font-bold rounded-xl gap-1">
                View in My Bookings <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Booking pass generated. Check <Link to="/my-bookings" className="text-emerald-500 dark:text-emerald-400 underline">My Bookings</Link>.
        </div>
      )}

      <div className="text-center">
        <Link to="/" className="text-xs text-neutral-500 hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400 font-medium flex items-center justify-center gap-1.5">
          <Home className="size-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
