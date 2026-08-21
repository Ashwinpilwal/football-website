import { useEffect } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock3,
  Home,
  LampCeiling,
  LogOut,
  MapPin,
  MapPinned,
  MessageCircle,
  Navigation,
  Phone,
  Plus,
  Radio,
  Receipt,
  Settings,
  Sparkles,
  Star,
  Tag,
  User,
  Users,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function App() {
  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-[956px] bg-neutral-950 text-neutral-50 flex overflow-hidden">
          <aside className="shrink-0 bg-neutral-900/70 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex px-4 py-5 flex-col gap-6 w-65">
            <div className="shadow-[0_0_0_1px_rgba(255,255,255,0.02)] rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex p-4 items-center gap-3">
              <div className="size-11 rounded-full bg-neutral-800 text-neutral-50 border-white/10 border-1 border-solid flex justify-center items-center">
                <CalendarDays className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold text-lg leading-6">
                  FootballHub
                </div>
                <div className="text-[#a1a1a1] text-xs leading-4">
                  My bookings
                </div>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              <button className="font-medium text-left rounded-2xl bg-neutral-800 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid flex px-4 py-3 items-center gap-3 w-full">
                <Home className="size-4" />
                Home
              </button>
              <button className="text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <MapPin className="size-4" />
                Find Turfs
              </button>
              <button className="text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <Radio className="size-4" />
                Live Turfs
              </button>
              <button className="text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <Users className="size-4" />
                Matches
              </button>
              <button className="text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <MessageCircle className="size-4" />
                Messages
              </button>
              <button className="text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <Users2 className="size-4" />
                Groups
              </button>
              <button className="text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <Bell className="size-4" />
                Notifications
              </button>
              <button className="text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <Plus className="size-4" />
                Create Post
              </button>
              <button className="text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <User className="size-4" />
                Profile
              </button>
              <button className="text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3 w-full">
                <Settings className="size-4" />
                Settings
              </button>
              <button className="text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex mt-2 px-4 py-3 items-center gap-3 w-full">
                <LogOut className="size-4" />
                Logout
              </button>
            </nav>
          </aside>
          <main className="px-8 py-6 flex-1 overflow-hidden">
            <div className="flex flex-col gap-6 h-full">
              <header className="flex justify-between items-end gap-6">
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="leading-none font-semibold text-3xl leading-9 tracking-tight">
                      My Bookings
                    </h1>
                    <span className="rounded-full bg-neutral-800 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                      Premium account
                    </span>
                  </div>
                  <p className="max-w-2xl text-[#a1a1a1] text-sm leading-5">
                    Manage your football sessions and upcoming games.
                  </p>
                </div>
                <div className="shrink-0 rounded-full bg-neutral-900 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid flex px-3 py-2 items-center gap-2">
                  <Sparkles className="size-3.5 text-neutral-200" />
                  Live booking sync
                </div>
              </header>
              <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex p-2 items-center gap-2 w-full">
                <button className="font-medium rounded-xl bg-neutral-800 text-neutral-50 text-sm leading-5 px-4 py-2">
                  Upcoming
                </button>
                <button className="bg-transparent font-medium rounded-xl text-[#a1a1a1] text-sm leading-5 px-4 py-2">
                  Active
                </button>
                <button className="bg-transparent font-medium rounded-xl text-[#a1a1a1] text-sm leading-5 px-4 py-2">
                  Completed
                </button>
                <button className="bg-transparent font-medium rounded-xl text-[#a1a1a1] text-sm leading-5 px-4 py-2">
                  Cancelled
                </button>
              </div>
              <div className="grid grid-cols-[1.35fr_0.95fr] min-h-0 flex-1 gap-6">
                <div className="min-w-0 min-h-0 flex flex-col gap-6 overflow-hidden">
                  <section className="shadow-[0_0_40px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex rounded-full bg-[#ff6467]/10 text-[#ff6467] text-xs leading-4 border-[#ff6467]/30 border-1 border-solid px-3 py-1 items-center gap-2">
                            <Radio className="size-3.5" />
                            ACTIVE
                          </span>
                          <span className="inline-flex rounded-full bg-neutral-800 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1 items-center gap-2">
                            <Clock3 className="size-3.5" />
                            Live countdown
                          </span>
                        </div>
                        <h2 className="leading-tight max-w-xl font-semibold text-2xl leading-8 tracking-tight">
                          Your game is happening now.
                        </h2>
                        <p className="text-[#a1a1a1] text-sm leading-5">
                          Metro Arena • Slot 8:30 PM - 9:30 PM
                        </p>
                      </div>
                      <div className="shrink-0 text-right rounded-2xl bg-neutral-800 border-white/10 border-1 border-solid px-4 py-3">
                        <div className="text-[#a1a1a1] text-xs leading-4">
                          Time left
                        </div>
                        <div className="leading-none font-semibold text-2xl leading-8 mt-1">
                          18:42
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-[minmax(0,1.15fr)_220px] mt-5 items-stretch gap-5">
                      <div className="min-h-[300px] rounded-3xl bg-neutral-950 border-white/10 border-1 border-solid overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=1200&q=80"
                          alt="Active booking turf"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="min-h-[300px] rounded-3xl bg-neutral-950 border-white/10 border-1 border-solid flex p-5 flex-col justify-between gap-4">
                        <div className="flex justify-between items-start gap-3">
                          <div className="min-w-0">
                            <div className="text-[#a1a1a1] text-sm leading-5">
                              Turf
                            </div>
                            <div className="leading-tight font-semibold text-lg leading-7 mt-1">
                              Metro Arena
                            </div>
                          </div>
                          <MapPinned className="size-5 shrink-0 text-neutral-50" />
                        </div>
                        <div className="text-[#a1a1a1] text-sm leading-5 flex items-start gap-2">
                          <MapPin className="size-4 shrink-0 mt-0.5" />
                          <span>Central Avenue, 1.8 km away</span>
                        </div>
                        <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid p-4">
                          <div className="text-[#a1a1a1] text-xs leading-4">
                            Match status
                          </div>
                          <div className="text-sm leading-5 flex mt-2 items-center gap-2">
                            <CircleDot className="size-4 text-[#ff6467]" />
                            Live now
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex mt-5 flex-wrap gap-3">
                      <Button className="rounded-full bg-neutral-200 text-neutral-900 px-5">
                        <Navigation className="size-4 mr-2" />
                        Open Directions
                      </Button>
                      <Button variant="secondary" className="rounded-full px-5">
                        <Users className="size-4 mr-2" />
                        View Match
                      </Button>
                    </div>
                  </section>
                  <section className="grid min-h-0 gap-6">
                    <Card className="rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6 gap-4">
                      <CardHeader className="p-0 gap-2">
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <CardTitle className="text-xl leading-7">
                              Upcoming booking
                            </CardTitle>
                            <CardDescription>
                              Next session in your schedule
                            </CardDescription>
                          </div>
                          <span className="inline-flex shrink-0 rounded-full bg-emerald-500/10 text-emerald-400 text-xs leading-4 border-emerald-500/30 border-1 border-solid px-3 py-1 items-center gap-2">
                            <CheckCircle2 className="size-3.5" />
                            Confirmed
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 gap-4">
                        <div className="grid grid-cols-[180px_minmax(0,1fr)] items-start gap-4">
                          <img
                            src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80"
                            alt="Upcoming turf"
                            className="object-cover rounded-2xl w-full h-40"
                          />
                          <div className="space-y-3 min-w-0">
                            <div className="flex justify-between items-start gap-4">
                              <div className="min-w-0">
                                <div className="font-semibold text-lg leading-7">
                                  Skyline Turf
                                </div>
                                <div className="text-[#a1a1a1] text-sm leading-5 flex mt-1 items-start gap-2">
                                  <MapPin className="size-4 shrink-0 mt-0.5" />
                                  <span>North Ring Road • 2.4 km away</span>
                                </div>
                              </div>
                              <span className="shrink-0 rounded-full bg-neutral-800 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                                7v7
                              </span>
                            </div>
                            <div className="text-[#a1a1a1] text-sm leading-5 flex flex-wrap gap-2">
                              <span className="inline-flex rounded-full bg-neutral-950 border-white/10 border-1 border-solid px-3 py-1 items-center gap-2">
                                <CalendarDays className="size-3.5" />
                                Sat, 24 Aug
                              </span>
                              <span className="inline-flex rounded-full bg-neutral-950 border-white/10 border-1 border-solid px-3 py-1 items-center gap-2">
                                <Clock3 className="size-3.5" />
                                7:00 PM - 8:00 PM
                              </span>
                              <span className="inline-flex rounded-full bg-neutral-950 border-white/10 border-1 border-solid px-3 py-1 items-center gap-2">
                                <Receipt className="size-3.5" />
                                Booking ID: FH-48291
                              </span>
                              <span className="inline-flex rounded-full bg-neutral-950 border-white/10 border-1 border-solid px-3 py-1 items-center gap-2">
                                <Tag className="size-3.5" />
                                ₹2,100
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                variant="secondary"
                                className="rounded-full px-4"
                              >
                                View Booking
                              </Button>
                              <Button
                                variant="outline"
                                className="rounded-full px-4"
                              >
                                Get Directions
                              </Button>
                              <button className="rounded-full text-[#ff6467] text-sm leading-5 px-4 py-2">
                                Cancel Booking
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6 gap-4">
                      <CardHeader className="p-0 gap-2">
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <CardTitle className="text-xl leading-7">
                              Completed bookings
                            </CardTitle>
                            <CardDescription>
                              Review past sessions and ratings
                            </CardDescription>
                          </div>
                          <span className="inline-flex shrink-0 rounded-full bg-neutral-800 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1 items-center gap-2">
                            <Star className="size-3.5 text-neutral-200" />
                            4.8 average
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 gap-4">
                        <div className="grid grid-cols-[180px_minmax(0,1fr)] rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid p-4 items-start gap-4">
                          <img
                            src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=900&q=80"
                            alt="Completed turf"
                            className="object-cover rounded-2xl w-full h-40"
                          />
                          <div className="space-y-3 min-w-0">
                            <div className="flex justify-between items-start gap-4">
                              <div className="min-w-0">
                                <div className="font-semibold text-lg leading-7">
                                  Arena 7
                                </div>
                                <div className="text-[#a1a1a1] text-sm leading-5 flex mt-1 items-start gap-2">
                                  <MapPin className="size-4 shrink-0 mt-0.5" />
                                  <span>
                                    Central Avenue • Completed yesterday
                                  </span>
                                </div>
                              </div>
                              <span className="inline-flex shrink-0 rounded-full bg-emerald-500/10 text-emerald-400 text-xs leading-4 border-emerald-500/30 border-1 border-solid px-3 py-1 items-center gap-2">
                                <CheckCircle2 className="size-3.5" />
                                Completed
                              </span>
                            </div>
                            <div className="text-[#a1a1a1] text-sm leading-5 flex flex-wrap gap-2">
                              <span className="inline-flex rounded-full bg-neutral-800 border-white/10 border-1 border-solid px-3 py-1 items-center gap-2">
                                <CalendarDays className="size-3.5" />
                                Fri, 23 Aug
                              </span>
                              <span className="inline-flex rounded-full bg-neutral-800 border-white/10 border-1 border-solid px-3 py-1 items-center gap-2">
                                <Clock3 className="size-3.5" />
                                8:30 PM - 9:30 PM
                              </span>
                              <span className="inline-flex rounded-full bg-neutral-800 border-white/10 border-1 border-solid px-3 py-1 items-center gap-2">
                                <Tag className="size-3.5" />
                                ₹1,800
                              </span>
                              <span className="inline-flex rounded-full bg-neutral-800 border-white/10 border-1 border-solid px-3 py-1 items-center gap-2">
                                <Star className="size-3.5 text-neutral-200" />
                                Rated 5.0
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Button className="rounded-full bg-neutral-200 text-neutral-900 px-4">
                                Review Turf
                              </Button>
                              <Button
                                variant="outline"
                                className="rounded-full px-4"
                              >
                                View Review
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </section>
                </div>
                <aside className="min-w-0 flex flex-col gap-6">
                  <Card className="rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6 gap-4">
                    <Button className="rounded-full bg-neutral-200 text-neutral-900 px-4 self-start">
                      <Phone className="size-4 mr-2" />
                      Contact Turf
                    </Button>
                    <CardHeader className="p-0 gap-2">
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <CardTitle className="text-xl leading-7">
                            Booking details
                          </CardTitle>
                          <CardDescription>
                            Selected booking panel
                          </CardDescription>
                        </div>
                        <span className="shrink-0 rounded-full bg-neutral-800 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                          Open
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 gap-4">
                      <div className="grid grid-cols-3 rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid p-2 gap-2 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=600&q=80"
                          alt="Gallery 1"
                          className="object-cover rounded-xl w-full h-24"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
                          alt="Gallery 2"
                          className="object-cover rounded-xl w-full h-24"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80"
                          alt="Gallery 3"
                          className="object-cover rounded-xl w-full h-24"
                        />
                      </div>
                      <div className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <div className="font-semibold text-lg leading-7">
                              Metro Arena
                            </div>
                            <div className="text-[#a1a1a1] text-sm leading-5">
                              Booking #FH-48291
                            </div>
                          </div>
                          <span className="inline-flex shrink-0 rounded-full bg-emerald-500/10 text-emerald-400 text-xs leading-4 border-emerald-500/30 border-1 border-solid px-3 py-1 items-center gap-2">
                            <CheckCircle2 className="size-3.5" />
                            Paid
                          </span>
                        </div>
                        <div className="grid grid-cols-2 text-sm leading-5 mt-4 gap-3">
                          <div className="min-w-0 rounded-xl bg-neutral-900 border-white/10 border-1 border-solid p-3">
                            <div className="text-[#a1a1a1] text-xs leading-4">
                              Slot
                            </div>
                            <div className="font-medium leading-5 mt-1">
                              8:30 PM - 9:30 PM
                            </div>
                          </div>
                          <div className="min-w-0 rounded-xl bg-neutral-900 border-white/10 border-1 border-solid p-3">
                            <div className="text-[#a1a1a1] text-xs leading-4">
                              Price
                            </div>
                            <div className="font-medium leading-5 mt-1">
                              ₹2,100
                            </div>
                          </div>
                          <div className="min-w-0 rounded-xl bg-neutral-900 border-white/10 border-1 border-solid p-3">
                            <div className="text-[#a1a1a1] text-xs leading-4">
                              Facilities
                            </div>
                            <div className="text-xs leading-5 flex mt-1 items-center gap-2">
                              <LampCeiling className="size-3.5" />
                              Floodlights
                            </div>
                          </div>
                          <div className="min-w-0 rounded-xl bg-neutral-900 border-white/10 border-1 border-solid p-3">
                            <div className="text-[#a1a1a1] text-xs leading-4">
                              Status
                            </div>
                            <div className="text-xs leading-5 flex mt-1 items-center gap-2">
                              <Radio className="size-3.5 text-[#ff6467]" />
                              Live now
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <Button variant="secondary" className="rounded-full px-4">
                      <Navigation className="size-4 mr-2" />
                      Directions
                    </Button>
                  </Card>
                  <Card className="rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6 gap-4">
                    <CardHeader className="p-0 gap-2">
                      <CardTitle className="text-xl leading-7">
                        Football loader
                      </CardTitle>
                      <CardDescription>Used across FootballHub</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 gap-3">
                      <div className="relative rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid px-5 py-8 overflow-hidden">
                        <div className="top-1/2 bg-white/10 absolute inset-x-0 h-px" />
                        <div className="top-1/2 -translate-y-1/2 shadow-[0_0_30px_rgba(255,255,255,0.06)] rounded-full bg-neutral-900 border-white/10 border-1 border-solid absolute left-6 p-3">
                          <CircleDot className="size-5 text-neutral-200" />
                        </div>
                        <div className="space-y-2 text-center ml-20">
                          <div className="font-medium text-sm leading-5">
                            Getting you onto the pitch...
                          </div>
                          <div className="text-[#a1a1a1] text-xs leading-4">
                            Warming up your session
                          </div>
                        </div>
                        <div className="flex mt-6 justify-center items-center gap-2">
                          <div className="rounded-full bg-neutral-200 w-24 h-1.5" />
                          <div className="rounded-full bg-neutral-800 w-8 h-1.5" />
                          <div className="rounded-full bg-neutral-800 w-4 h-1.5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </aside>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
