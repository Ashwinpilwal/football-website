import { useEffect } from "react";
import {
  Balloon,
  Bell,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Home,
  LogOut,
  MapPin,
  MessageCircle,
  Plus,
  QrCode,
  Radio,
  Settings,
  Sparkles,
  TimerReset,
  User,
  Users,
  Users2,
} from "lucide-react";

export default function App() {
  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-[956px] bg-neutral-950 text-neutral-50 flex">
          <aside className="shrink-0 bg-neutral-900/70 border-white/70 border-t-0 border-r-1 border-b-0 border-l-0 border-solid hidden px-6 py-8 w-70">
            <div className="flex items-center gap-3">
              <div className="size-11 shadow-[0_0_24px_rgba(255,255,255,0.06)] rounded-2xl bg-neutral-800 text-neutral-200 border-white/70 border-1 border-solid flex justify-center items-center">
                <Balloon className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg leading-7 tracking-tight">
                  FootballHub
                </span>
                <span className="text-[#a1a1a1] text-xs leading-4">
                  Premium turf booking
                </span>
              </div>
            </div>
            <nav className="flex flex-col items-start flex-1 gap-1">
              <button className="font-medium text-left shadow-[0_0_24px_rgba(255,255,255,0.04)] rounded-xl bg-neutral-800/70 text-neutral-50 text-sm leading-5 border-neutral-200 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex px-4 py-3 items-center gap-3 w-full">
                <Home className="size-4 text-neutral-200" />
                Home
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <MapPin className="size-4" />
                Find Turfs
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <Radio className="size-4" />
                Live Turfs
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <Users className="size-4" />
                Matches
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <MessageCircle className="size-4" />
                Messages
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <Users2 className="size-4" />
                Groups
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <Bell className="size-4" />
                Notifications
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <Plus className="size-4" />
                Create Post
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <User className="size-4" />
                Profile
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <Settings className="size-4" />
                Settings
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <LogOut className="size-4" />
                Logout
              </button>
            </nav>
            <div className="rounded-2xl bg-neutral-950/60 border-white/70 border-1 border-solid p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-neutral-800 text-neutral-200 flex justify-center items-center">
                  <Clock3 className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-sm leading-5">Next booking</p>
                  <p className="text-[#a1a1a1] text-xs leading-4">
                    Kickoff in 02:14:36
                  </p>
                </div>
              </div>
            </div>
          </aside>
          <main className="px-6 py-8 flex-1">
            <div className="max-w-[1120px] flex mx-auto flex-col gap-6">
              <section className="shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.45)] rounded-3xl bg-neutral-900/80 border-white/70 border-1 border-solid p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-2">
                      <CalendarDays className="size-4" />
                      My Bookings
                    </div>
                    <h1 className="font-semibold text-4xl leading-10 tracking-tight">
                      My Bookings
                    </h1>
                    <p className="max-w-2xl text-[#a1a1a1] text-sm leading-5">
                      Track upcoming games, active turf sessions, completed
                      matches, and cancellations in one premium football
                      timeline.
                    </p>
                  </div>
                  <div className="rounded-full bg-neutral-950/70 border-white/70 border-1 border-solid flex p-1 items-center gap-2">
                    <button className="font-medium shadow-[0_0_24px_rgba(255,255,255,0.08)] rounded-full bg-neutral-200 text-neutral-900 text-sm leading-5 px-4 py-2">
                      Upcoming
                    </button>
                    <button className="transition-colors rounded-full text-[#a1a1a1] text-sm leading-5 px-4 py-2">
                      Active
                    </button>
                    <button className="transition-colors rounded-full text-[#a1a1a1] text-sm leading-5 px-4 py-2">
                      Completed
                    </button>
                    <button className="transition-colors rounded-full text-[#a1a1a1] text-sm leading-5 px-4 py-2">
                      Cancelled
                    </button>
                  </div>
                </div>
              </section>
              <section className="shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.45)] rounded-3xl bg-neutral-900/80 border-white/70 border-1 border-solid p-6">
                <div className="flex mb-5 justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="size-10 shadow-[0_0_24px_rgba(255,255,255,0.08)] rounded-full bg-neutral-200/15 text-neutral-200 flex justify-center items-center">
                      <Radio className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium uppercase text-[#a1a1a1] text-sm leading-5 tracking-[3.2px]">
                        Active Booking
                      </p>
                      <p className="font-semibold text-lg leading-7">
                        Kickoff at 08:30 PM
                      </p>
                    </div>
                  </div>
                  <div className="font-medium shadow-[0_0_24px_rgba(255,255,255,0.08)] rounded-full bg-neutral-200/10 text-neutral-200 text-xs leading-4 border-neutral-200/30 border-1 border-solid px-3 py-1">
                    Live countdown
                  </div>
                </div>
                <div className="grid gap-6">
                  <div className="rounded-3xl bg-neutral-950/60 border-white/70 border-1 border-solid overflow-hidden">
                    <div className="relative h-65">
                      <img
                        src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBwaXRjaHxlbnwxfHx8fDE3NTQ5MjM3NzN8MA&ixlib=rb-4.1.0&q=80&w=1200"
                        alt="Football turf"
                        className="object-cover w-full h-full"
                        data-photoid="photo-1517927033932-b3d18e61fb3a"
                        data-authorname=""
                        data-authorurl=""
                        data-blurhash=""
                      />
                      <div className="bg-gradient-to-r from-background/90 via-background/35 to-transparent absolute inset-0" />
                      <div className="opacity-30 bg-white/8 absolute inset-0" />
                      <div className="rounded-full bg-neutral-950/70 text-neutral-50 text-xs leading-4 border-white/70 border-1 border-solid flex absolute left-6 top-6 px-3 py-1 items-center gap-2">
                        <MapPin className="size-3 text-neutral-200" />
                        Arena 7, Downtown Sports Complex
                      </div>
                      <div className="flex absolute left-6 bottom-6 flex-col gap-2">
                        <h2 className="font-semibold text-3xl leading-9 tracking-tight">
                          Arena 7
                        </h2>
                        <p className="max-w-xl text-[#a1a1a1] text-sm leading-5">
                          5v5 premium turf · Slot 08:30 PM - 09:30 PM · 1.8 km
                          away
                        </p>
                        <div className="flex items-center gap-3">
                          <button className="font-medium shadow-[0_0_24px_rgba(255,255,255,0.08)] rounded-full bg-neutral-200 text-neutral-900 text-sm leading-5 px-4 py-2">
                            Directions
                          </button>
                          <button className="rounded-full bg-neutral-950/70 text-neutral-50 text-sm leading-5 border-white/70 border-1 border-solid px-4 py-2">
                            View Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="rounded-3xl bg-neutral-950/60 border-white/70 border-1 border-solid p-5">
                      <div className="flex justify-between items-center">
                        <p className="text-[#a1a1a1] text-sm leading-5">
                          Countdown to kickoff
                        </p>
                        <TimerReset className="size-4 text-neutral-200" />
                      </div>
                      <div className="grid grid-cols-4 text-center mt-3 gap-2">
                        <div className="rounded-2xl bg-neutral-800/70 border-white/70 border-1 border-solid p-3">
                          <div className="font-semibold text-2xl leading-8">
                            02
                          </div>
                          <div className="uppercase text-[#a1a1a1] text-[11px] tracking-[3.2px]">
                            Hours
                          </div>
                        </div>
                        <div className="rounded-2xl bg-neutral-800/70 border-white/70 border-1 border-solid p-3">
                          <div className="font-semibold text-2xl leading-8">
                            14
                          </div>
                          <div className="uppercase text-[#a1a1a1] text-[11px] tracking-[3.2px]">
                            Min
                          </div>
                        </div>
                        <div className="rounded-2xl bg-neutral-800/70 border-white/70 border-1 border-solid p-3">
                          <div className="font-semibold text-2xl leading-8">
                            36
                          </div>
                          <div className="uppercase text-[#a1a1a1] text-[11px] tracking-[3.2px]">
                            Sec
                          </div>
                        </div>
                        <div className="rounded-2xl bg-neutral-800/70 border-white/70 border-1 border-solid p-3">
                          <div className="font-semibold text-2xl leading-8">
                            01
                          </div>
                          <div className="uppercase text-[#a1a1a1] text-[11px] tracking-[3.2px]">
                            Slot
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid rounded-3xl bg-neutral-950/60 border-white/70 border-1 border-solid p-5 gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[#a1a1a1] text-sm leading-5">
                            Check-in code
                          </p>
                          <p className="font-semibold text-lg leading-7">
                            FBH-7824
                          </p>
                        </div>
                        <div className="size-16 rounded-2xl bg-neutral-800 text-neutral-200 border-white/70 border-1 border-solid flex justify-center items-center">
                          <QrCode className="size-8" />
                        </div>
                      </div>
                      <div className="rounded-2xl bg-neutral-800/50 border-white/70 border-1 border-solid flex p-4 justify-between items-center">
                        <div>
                          <p className="font-medium text-sm leading-5">
                            Confirmed players
                          </p>
                          <p className="text-[#a1a1a1] text-xs leading-4">
                            8 of 10 ready
                          </p>
                        </div>
                        <div className="-space-x-2 flex">
                          <div className="size-9 font-semibold rounded-full bg-neutral-200 text-neutral-900 text-xs leading-4 border-neutral-950 border-1 border-solid flex justify-center items-center">
                            AR
                          </div>
                          <div className="size-9 font-semibold rounded-full bg-neutral-800 text-xs leading-4 border-neutral-950 border-1 border-solid flex justify-center items-center">
                            MK
                          </div>
                          <div className="size-9 font-semibold rounded-full bg-neutral-800 text-xs leading-4 border-neutral-950 border-1 border-solid flex justify-center items-center">
                            JS
                          </div>
                          <div className="size-9 font-semibold rounded-full bg-neutral-800 text-xs leading-4 border-neutral-950 border-1 border-solid flex justify-center items-center">
                            +5
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.45)] rounded-3xl bg-neutral-900/80 border-white/70 border-1 border-solid p-6">
                <div className="flex mb-5 justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-xl leading-7 tracking-tight">
                      Upcoming bookings
                    </h2>
                    <p className="text-[#a1a1a1] text-sm leading-5">
                      Selected tab bookings with clear status and quick actions.
                    </p>
                  </div>
                  <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-2">
                    <Sparkles className="size-4 text-neutral-200" />
                    Smooth tab transitions
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="group grid transition-all duration-300 rounded-3xl bg-neutral-950/60 border-white/70 border-1 border-solid p-4 gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHR1cmYlMjBsaWdodHN8ZW58MXx8fHwxNzU0OTIzNzczfDA&ixlib=rb-4.1.0&q=80&w=600"
                      alt="Turf thumbnail"
                      className="object-cover rounded-2xl w-full h-32"
                      data-photoid="photo-1518091043644-c1d4457512c6"
                      data-authorname=""
                      data-authorurl=""
                      data-blurhash=""
                    />
                    <div className="flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg leading-7">
                            Skyline Turf
                          </h3>
                          <span className="inline-flex font-medium rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] border-emerald-500/30 border-1 border-solid px-2 py-1 items-center gap-1">
                            <Circle className="size-2 fill-emerald-400 text-emerald-400" />
                            Upcoming
                          </span>
                        </div>
                        <p className="text-[#a1a1a1] text-sm leading-5 mt-1">
                          Tomorrow · 07:00 PM - 08:00 PM · Marina District
                        </p>
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4 flex flex-wrap gap-2">
                        <span className="rounded-full border-white/70 border-1 border-solid px-3 py-1">
                          5v5
                        </span>
                        <span className="rounded-full border-white/70 border-1 border-solid px-3 py-1">
                          ₹1,800
                        </span>
                        <span className="rounded-full border-white/70 border-1 border-solid px-3 py-1">
                          8 players
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="font-medium rounded-full bg-neutral-200 text-neutral-900 text-sm leading-5 px-4 py-2">
                        View Details
                      </button>
                      <button className="rounded-full bg-neutral-800/60 text-neutral-50 text-sm leading-5 border-white/70 border-1 border-solid px-4 py-2">
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div className="group grid transition-all duration-300 rounded-3xl bg-neutral-950/60 border-white/70 border-1 border-solid p-4 gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGZpZWxkJTIwbmlnaHR8ZW58MXx8fHwxNzU0OTIzNzczfDA&ixlib=rb-4.1.0&q=80&w=600"
                      alt="Turf thumbnail"
                      className="object-cover rounded-2xl w-full h-32"
                      data-photoid="photo-1508098682722-e99c43a406b2"
                      data-authorname=""
                      data-authorurl=""
                      data-blurhash=""
                    />
                    <div className="flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg leading-7">
                            Metro Arena
                          </h3>
                          <span className="inline-flex font-medium rounded-full bg-neutral-200/10 text-neutral-200 text-[11px] border-neutral-200/30 border-1 border-solid px-2 py-1 items-center gap-1">
                            <Clock3 className="size-3" />
                            Active
                          </span>
                        </div>
                        <p className="text-[#a1a1a1] text-sm leading-5 mt-1">
                          Today · 08:30 PM - 09:30 PM · Central Avenue
                        </p>
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4 flex flex-wrap gap-2">
                        <span className="rounded-full border-white/70 border-1 border-solid px-3 py-1">
                          7v7
                        </span>
                        <span className="rounded-full border-white/70 border-1 border-solid px-3 py-1">
                          ₹2,400
                        </span>
                        <span className="rounded-full border-white/70 border-1 border-solid px-3 py-1">
                          In progress
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="font-medium rounded-full bg-neutral-200 text-neutral-900 text-sm leading-5 px-4 py-2">
                        View Details
                      </button>
                      <button className="rounded-full bg-neutral-800/60 text-neutral-50 text-sm leading-5 border-white/70 border-1 border-solid px-4 py-2">
                        Directions
                      </button>
                    </div>
                  </div>
                  <div className="group grid transition-all duration-300 rounded-3xl bg-neutral-950/60 border-white/70 border-1 border-solid p-4 gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1511886929837-354d827aae26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHR1cmYlMjBwbGF5ZXJzfGVufDF8fHx8MTc1NDkyMzc3M3ww&ixlib=rb-4.1.0&q=80&w=600"
                      alt="Turf thumbnail"
                      className="object-cover rounded-2xl w-full h-32"
                      data-photoid="photo-1511886929837-354d827aae26"
                      data-authorname=""
                      data-authorurl=""
                      data-blurhash=""
                    />
                    <div className="flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg leading-7">
                            Northside Grounds
                          </h3>
                          <span className="inline-flex font-medium rounded-full bg-slate-500/10 text-slate-300 text-[11px] border-slate-500/30 border-1 border-solid px-2 py-1 items-center gap-1">
                            <CheckCircle2 className="size-3" />
                            Completed
                          </span>
                        </div>
                        <p className="text-[#a1a1a1] text-sm leading-5 mt-1">
                          Yesterday · 06:00 PM - 07:00 PM · North Ring Road
                        </p>
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4 flex flex-wrap gap-2">
                        <span className="rounded-full border-white/70 border-1 border-solid px-3 py-1">
                          11v11
                        </span>
                        <span className="rounded-full border-white/70 border-1 border-solid px-3 py-1">
                          ₹3,600
                        </span>
                        <span className="rounded-full border-white/70 border-1 border-solid px-3 py-1">
                          Rated 4.9
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="font-medium rounded-full bg-neutral-200 text-neutral-900 text-sm leading-5 px-4 py-2">
                        Rebook
                      </button>
                      <button className="rounded-full bg-neutral-800/60 text-neutral-50 text-sm leading-5 border-white/70 border-1 border-solid px-4 py-2">
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
