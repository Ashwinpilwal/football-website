import { useEffect } from "react";
import {
  ArrowLeft,
  Balloon,
  CalendarDays,
  CalendarPlus,
  Check,
  MapPin,
  QrCode,
  ShieldCheck,
  Ticket,
} from "lucide-react";

export default function App() {
  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-screen bg-red-500/14.000000000000002 px-8 py-6">
          <div className="min-h-screen max-w-[1140px] flex mx-auto flex-col">
            <div className="border-white/20 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex pb-4 justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="size-11 shadow-[0_0_30px_rgba(239,68,68,0.18)] rounded-2xl bg-red-500/10 border-red-500/25 border-1 border-solid flex justify-center items-center">
                  <Balloon className="size-5 text-red-400" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-neutral-50 text-lg leading-7 tracking-tight">
                    FootballHub
                  </div>
                  <div className="text-[#a1a1a1] text-xs leading-4">
                    Booking confirmation
                  </div>
                </div>
              </div>
              <div className="shadow-sm rounded-full bg-neutral-900 text-[#a1a1a1] text-xs leading-4 border-white/30 border-1 border-solid flex px-4 py-2 items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-400" />
                Secure payment verified
              </div>
            </div>
            <div className="flex py-10 justify-center items-center flex-1">
              <div className="relative max-w-[760px] shadow-[0_30px_80px_rgba(0,0,0,0.55)] rounded-3xl bg-neutral-900/95 border-white/30 border-1 border-solid p-8 w-full overflow-hidden">
                <div className="opacity-40 bg-white absolute inset-0" />
                <div className="blur-3xl rounded-full bg-red-500/15 absolute -left-24 top-10 w-56 h-56" />
                <div className="blur-3xl rounded-full bg-red-500/10 absolute -right-20 bottom-0 w-64 h-64" />
                <div className="relative flex flex-col gap-8">
                  <div className="text-center flex flex-col items-center gap-5">
                    <div className="size-24 shadow-[0_0_0_10px_rgba(16,185,129,0.06),0_0_40px_rgba(16,185,129,0.22)] rounded-full bg-emerald-400/10 border-emerald-400/30 border-1 border-solid flex justify-center items-center">
                      <div className="size-16 shadow-[0_0_30px_rgba(16,185,129,0.35)] rounded-full bg-emerald-400/15 flex justify-center items-center">
                        <Check className="size-8 text-emerald-300" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h1 className="font-semibold text-neutral-50 text-4xl leading-10 tracking-tight">
                        Booking Confirmed!
                      </h1>
                      <p className="max-w-[560px] text-[#a1a1a1] text-sm leading-6">
                        Your turf is locked in. Arrive a little early, scan the
                        check-in code, and get ready to play.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6">
                    <div className="space-y-4 rounded-2xl bg-neutral-950/40 border-white/30 border-1 border-solid p-5">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl border-white/30 border-1 border-solid w-28 h-20 overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHR1cmZ8ZW58MXx8fHwxNzU0OTIzNzc3fDA&ixlib=rb-4.1.0&q=80&w=400"
                            alt="Turf thumbnail"
                            className="object-cover w-full h-full"
                            data-photoid="xvQxvQxvQxv"
                            data-authorname="Markus Spiske"
                            data-authorurl="https://unsplash.com/@markusspiske"
                            data-blurhash="L6H2?^?b?b?b?b?b?b?b?b?b"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold text-neutral-50 text-lg leading-7">
                            Arena 5v5 Pro Turf
                          </div>
                          <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-2">
                            <MapPin className="size-4 text-red-400" />
                            Downtown Sports District
                          </div>
                          <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-2">
                            <CalendarDays className="size-4" />
                            Saturday, 24 Aug 2026
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <div className="rounded-xl bg-neutral-900 border-white/30 border-1 border-solid p-4">
                          <div className="uppercase text-[#a1a1a1] text-xs leading-4 tracking-[3.2px]">
                            Selected time slot
                          </div>
                          <div className="font-medium text-neutral-50 text-base leading-6 mt-2">
                            18:00 - 19:00
                          </div>
                        </div>
                        <div className="rounded-xl bg-neutral-900 border-white/30 border-1 border-solid p-4">
                          <div className="uppercase text-[#a1a1a1] text-xs leading-4 tracking-[3.2px]">
                            Duration
                          </div>
                          <div className="font-medium text-neutral-50 text-base leading-6 mt-2">
                            60 minutes
                          </div>
                        </div>
                        <div className="rounded-xl bg-neutral-900 border-white/30 border-1 border-solid p-4">
                          <div className="uppercase text-[#a1a1a1] text-xs leading-4 tracking-[3.2px]">
                            Price paid
                          </div>
                          <div className="font-medium text-neutral-50 text-base leading-6 mt-2">
                            ₹2,400
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-2xl bg-neutral-950/40 border-white/30 border-1 border-solid p-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-neutral-50 text-sm leading-5">
                          Check-in code
                        </div>
                        <div className="text-[#a1a1a1] text-xs leading-4">
                          Show this at the turf entrance
                        </div>
                      </div>
                      <QrCode className="size-5 text-red-400" />
                    </div>
                    <div className="shadow-[0_0_0_1px_rgba(239,68,68,0.08),0_0_30px_rgba(239,68,68,0.12)] rounded-2xl bg-red-500/12 border-red-500/25 border-1 border-solid p-5">
                      <div className="grid grid-cols-6 gap-2">
                        <div className="col-span-6 font-semibold text-center rounded-lg bg-neutral-900 text-neutral-50 text-2xl leading-8 tracking-[5.6px] border-white/30 border-1 border-solid px-4 py-5">
                          FH-82419
                        </div>
                        <div className="col-span-2 rounded-md bg-neutral-50/90 h-10" />
                        <div className="col-span-1 rounded-md bg-neutral-50/90 h-10" />
                        <div className="col-span-3 rounded-md bg-neutral-50/90 h-10" />
                        <div className="col-span-1 rounded-md bg-neutral-50/90 h-10" />
                        <div className="col-span-2 rounded-md bg-neutral-50/90 h-10" />
                        <div className="col-span-3 rounded-md bg-neutral-50/90 h-10" />
                        <div className="col-span-6 text-center rounded-md bg-neutral-900 text-[#a1a1a1] text-xs leading-4 border-white/30 border-1 border-solid px-3 py-2">
                          Tap to enlarge at check-in
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <button className="transition-transform duration-200 shadow-[0_10px_30px_rgba(255,255,255,0.08)] rounded-xl bg-neutral-200 text-neutral-900 flex px-4 justify-center items-center h-11">
                        <CalendarPlus className="size-4 mr-2" />
                        Add to Calendar
                      </button>
                      <button className="transition-transform duration-200 rounded-xl bg-neutral-800 text-neutral-50 border-white/30 border-1 border-solid flex px-4 justify-center items-center h-11">
                        <Ticket className="size-4 mr-2" />
                        View Booking
                      </button>
                      <button className="transition-transform duration-200 rounded-xl text-[#a1a1a1] flex px-4 justify-center items-center h-11">
                        <ArrowLeft className="size-4 mr-2" />
                        Back to Home
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
