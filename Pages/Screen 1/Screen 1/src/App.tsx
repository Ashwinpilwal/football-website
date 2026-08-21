import { useEffect } from "react";
import {
  Balloon,
  Bell,
  CalendarCheck,
  CalendarPlus,
  CheckCircle2,
  Heart,
  Home,
  LogOut,
  MapPin,
  MapPinned,
  MessageCircle,
  Plus,
  Radio,
  Search,
  Settings,
  Sparkles,
  Trophy,
  User,
  Users,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function App() {
  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-screen bg-white/6 text-neutral-50 flex">
          <aside className="shrink-0 bg-neutral-900/80 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid hidden px-6 py-8 w-72">
            <div className="flex items-center gap-3">
              <div className="size-11 shadow-[0_0_30px_rgba(255,255,255,0.12)] rounded-2xl bg-neutral-200 text-neutral-900 flex justify-center items-center">
                <Balloon className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg leading-7 tracking-tight">
                  FootballHub
                </span>
                <span className="text-[#a1a1a1] text-xs leading-4">
                  Premium football ecosystem
                </span>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <button className="font-medium text-left shadow-[0_0_24px_rgba(255,0,0,0.12)] rounded-xl bg-neutral-200/10 text-neutral-50 text-sm leading-5 border-neutral-200 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex px-4 py-3 items-center gap-3">
                <Home className="size-4 text-neutral-200" />
                Home
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <MapPin className="size-4" />
                Find Turfs
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Radio className="size-4" />
                Live Turfs
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Users className="size-4" />
                Matches
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <MessageCircle className="size-4" />
                Messages
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Users2 className="size-4" />
                Groups
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Bell className="size-4" />
                Notifications
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Plus className="size-4" />
                Create Post
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <User className="size-4" />
                Profile
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Settings className="size-4" />
                Settings
              </button>
              <button className="transition-colors text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <LogOut className="size-4" />
                Logout
              </button>
            </nav>
            <div className="rounded-2xl bg-neutral-800/60 border-white/10 border-1 border-solid mt-auto p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-neutral-800 flex justify-center items-center">
                  <MapPinned className="size-4 text-neutral-200" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm leading-5">
                    Current location
                  </span>
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    Bengaluru, India
                  </span>
                </div>
              </div>
            </div>
          </aside>
          <div className="min-w-0 flex flex-col flex-1">
            <main className="p-6 flex-1">
              <div className="max-w-[1140px] flex mx-auto flex-col gap-8">
                <section className="shadow-[0_24px_80px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900/90 border-white/10 border-1 border-solid p-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-3">
                        <span className="rounded-full bg-neutral-800 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                          Good evening, Arjun
                        </span>
                        <span className="rounded-full text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                          Koramangala, Bengaluru
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h1 className="font-semibold text-neutral-50 text-4xl leading-10 tracking-tight">
                          Find a turf near you
                        </h1>
                        <p className="max-w-2xl text-[#a1a1a1] text-sm leading-6">
                          Discover live availability, book instantly, and keep
                          football moving from turf search to match day.
                        </p>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid flex px-4 py-3 items-center gap-3">
                      <MapPin className="size-4 text-neutral-200" />
                      <div className="flex flex-col">
                        <span className="text-[#a1a1a1] text-xs leading-4">
                          Current area
                        </span>
                        <span className="font-medium text-sm leading-5">
                          Indiranagar, Bengaluru
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="shadow-[0_0_0_1px_rgba(255,255,255,0.02)] rounded-2xl bg-neutral-950/70 border-white/10 border-1 border-solid flex mt-6 p-4 items-center gap-3">
                    <div className="size-11 shadow-[0_0_24px_rgba(255,0,0,0.18)] rounded-2xl bg-neutral-200/15 text-neutral-200 flex justify-center items-center">
                      <Search className="size-5" />
                    </div>
                    <div className="flex flex-col flex-1 gap-1">
                      <span className="uppercase text-[#a1a1a1] text-xs leading-4 tracking-[3.2px]">
                        Search turf or location
                      </span>
                      <span className="text-neutral-50 text-base leading-6">
                        Search by turf name, locality, or live availability
                      </span>
                    </div>
                    <Button className="rounded-xl bg-neutral-200 text-neutral-900 px-5 py-3">
                      Search
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 mt-6 gap-3">
                    <Button className="text-left rounded-2xl bg-neutral-800 text-neutral-50 border-white/10 border-1 border-solid px-4 py-6 justify-start gap-3">
                      <MapPin className="size-4 text-neutral-200" />
                      Find Turf
                    </Button>
                    <Button className="text-left rounded-2xl bg-neutral-800 text-neutral-50 border-white/10 border-1 border-solid px-4 py-6 justify-start gap-3">
                      <CalendarPlus className="size-4 text-neutral-200" />
                      Book Turf
                    </Button>
                    <Button className="text-left rounded-2xl bg-neutral-800 text-neutral-50 border-white/10 border-1 border-solid px-4 py-6 justify-start gap-3">
                      <Users className="size-4 text-neutral-200" />
                      Find Players
                    </Button>
                    <Button className="text-left rounded-2xl bg-neutral-800 text-neutral-50 border-white/10 border-1 border-solid px-4 py-6 justify-start gap-3">
                      <Sparkles className="size-4 text-neutral-200" />
                      Create Match
                    </Button>
                  </div>
                </section>
                <section className="flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="font-semibold text-2xl leading-8 tracking-tight">
                        Nearby Turfs
                      </h2>
                      <p className="text-[#a1a1a1] text-sm leading-5">
                        High-demand venues with live availability and instant
                        booking.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-[#a1a1a1] text-sm leading-5"
                    >
                      View all
                    </Button>
                  </div>
                  <div className="overflow-x-auto flex pb-2 gap-4">
                    <Card className="min-w-[320px] transition-transform duration-300 shadow-[0_18px_50px_rgba(0,0,0,0.28)] rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-0 overflow-hidden">
                      <div className="relative h-52">
                        <img
                          src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                          alt="Nearby turf"
                          className="object-cover w-full h-full"
                        />
                        <div className="bg-gradient-to-t from-background via-background/10 to-transparent absolute inset-0" />
                        <div className="font-medium rounded-full bg-neutral-200 text-neutral-900 text-xs leading-4 absolute left-4 top-4 px-3 py-1">
                          5v5
                        </div>
                        <div className="rounded-full bg-neutral-950/80 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid absolute right-4 top-4 px-3 py-1">
                          Open
                        </div>
                      </div>
                      <CardContent className="p-5 gap-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-semibold text-lg leading-7">
                              Arena 11 Turf
                            </h3>
                            <p className="text-[#a1a1a1] text-sm leading-5">
                              1.2 km • Indiranagar
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sm leading-5">
                              ₹2,400/hr
                            </div>
                            <div className="text-[#a1a1a1] text-xs leading-4">
                              8 slots left
                            </div>
                          </div>
                        </div>
                        <div className="text-[#a1a1a1] text-sm leading-5 flex justify-between items-center">
                          <span>Rating 4.8</span>
                          <span>Floodlights • Parking</span>
                        </div>
                        <Button className="rounded-xl bg-neutral-200 text-neutral-900 w-full">
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className="min-w-[320px] transition-transform duration-300 shadow-[0_18px_50px_rgba(0,0,0,0.28)] rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-0 overflow-hidden">
                      <div className="relative h-52">
                        <img
                          src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                          alt="Nearby turf"
                          className="object-cover w-full h-full"
                        />
                        <div className="bg-gradient-to-t from-background via-background/10 to-transparent absolute inset-0" />
                        <div className="font-medium rounded-full bg-neutral-200 text-neutral-900 text-xs leading-4 absolute left-4 top-4 px-3 py-1">
                          7v7
                        </div>
                        <div className="rounded-full bg-neutral-950/80 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid absolute right-4 top-4 px-3 py-1">
                          Almost full
                        </div>
                      </div>
                      <CardContent className="p-5 gap-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-semibold text-lg leading-7">
                              Redline Arena
                            </h3>
                            <p className="text-[#a1a1a1] text-sm leading-5">
                              2.4 km • Koramangala
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sm leading-5">
                              ₹3,100/hr
                            </div>
                            <div className="text-[#a1a1a1] text-xs leading-4">
                              3 slots left
                            </div>
                          </div>
                        </div>
                        <div className="text-[#a1a1a1] text-sm leading-5 flex justify-between items-center">
                          <span>Rating 4.9</span>
                          <span>Changing room • Water</span>
                        </div>
                        <Button className="rounded-xl bg-neutral-200 text-neutral-900 w-full">
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className="min-w-[320px] transition-transform duration-300 shadow-[0_18px_50px_rgba(0,0,0,0.28)] rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-0 overflow-hidden">
                      <div className="relative h-52">
                        <img
                          src="https://images.unsplash.com/photo-1486286701208-1d58e9338013?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                          alt="Nearby turf"
                          className="object-cover w-full h-full"
                        />
                        <div className="bg-gradient-to-t from-background via-background/10 to-transparent absolute inset-0" />
                        <div className="font-medium rounded-full bg-neutral-200 text-neutral-900 text-xs leading-4 absolute left-4 top-4 px-3 py-1">
                          11v11
                        </div>
                        <div className="rounded-full bg-neutral-950/80 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid absolute right-4 top-4 px-3 py-1">
                          Closed
                        </div>
                      </div>
                      <CardContent className="p-5 gap-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-semibold text-lg leading-7">
                              Stadium Greens
                            </h3>
                            <p className="text-[#a1a1a1] text-sm leading-5">
                              4.1 km • HSR Layout
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sm leading-5">
                              ₹5,500/hr
                            </div>
                            <div className="text-[#a1a1a1] text-xs leading-4">
                              Next open 6 PM
                            </div>
                          </div>
                        </div>
                        <div className="text-[#a1a1a1] text-sm leading-5 flex justify-between items-center">
                          <span>Rating 4.7</span>
                          <span>Premium pitch • Seating</span>
                        </div>
                        <Button className="rounded-xl bg-neutral-200 text-neutral-900 w-full">
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </section>
                <section className="grid gap-8">
                  <div className="flex flex-col gap-8">
                    <section className="flex flex-col gap-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <h2 className="font-semibold text-2xl leading-8 tracking-tight">
                            Live Now
                          </h2>
                          <p className="text-[#a1a1a1] text-sm leading-5">
                            Active turfs with real-time match and player counts.
                          </p>
                        </div>
                      </div>
                      <div className="overflow-x-auto flex pb-2 gap-4">
                        <Card className="min-w-[280px] rounded-3xl bg-neutral-800 border-white/10 border-0 border-solid p-0">
                          <div className="relative rounded-t-3xl h-40 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                              alt="Live turf"
                              className="object-cover w-full h-full"
                            />
                            <div className="rounded-full bg-neutral-950/80 text-xs leading-4 flex absolute left-4 top-4 px-3 py-1 items-center gap-2">
                              <span className="size-2 animate-pulse shadow-[0_0_12px_rgba(255,0,0,0.8)] rounded-full bg-[#ff6467]" />
                              Live
                            </div>
                          </div>
                          <CardContent className="p-4 gap-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">Metro Kickoff</h3>
                                <p className="text-[#a1a1a1] text-xs leading-4">
                                  3.2 km • 18 players
                                </p>
                              </div>
                              <span className="text-[#a1a1a1] text-xs leading-4">
                                12 min left
                              </span>
                            </div>
                            <Button
                              variant="secondary"
                              className="rounded-xl w-full"
                            >
                              View Live
                            </Button>
                          </CardContent>
                        </Card>
                        <Card className="min-w-[280px] rounded-3xl bg-neutral-800 border-white/10 border-0 border-solid p-0">
                          <div className="relative rounded-t-3xl h-40 overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                              alt="Live turf"
                              className="object-cover w-full h-full"
                            />
                            <div className="rounded-full bg-neutral-950/80 text-xs leading-4 flex absolute left-4 top-4 px-3 py-1 items-center gap-2">
                              <span className="size-2 animate-pulse shadow-[0_0_12px_rgba(255,0,0,0.8)] rounded-full bg-[#ff6467]" />
                              Live
                            </div>
                          </div>
                          <CardContent className="p-4 gap-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">
                                  Night League 7s
                                </h3>
                                <p className="text-[#a1a1a1] text-xs leading-4">
                                  5.0 km • 14 players
                                </p>
                              </div>
                              <span className="text-[#a1a1a1] text-xs leading-4">
                                24 min left
                              </span>
                            </div>
                            <Button
                              variant="secondary"
                              className="rounded-xl w-full"
                            >
                              View Live
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </section>
                    <section className="flex flex-col gap-4">
                      <div>
                        <h2 className="font-semibold text-2xl leading-8 tracking-tight">
                          Upcoming Matches
                        </h2>
                        <p className="text-[#a1a1a1] text-sm leading-5">
                          Plan your next game and invite players.
                        </p>
                      </div>
                      <div className="grid gap-4">
                        <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-5">
                          <CardHeader className="p-0 gap-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[#a1a1a1] text-sm leading-5">
                                Today • 8:30 PM
                              </span>
                              <Badge className="rounded-full bg-neutral-200 text-neutral-900">
                                7v7
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-lg leading-7">
                              Blaze FC vs North United
                            </h3>
                          </CardHeader>
                          <CardContent className="px-0 pt-4 pb-0 gap-3">
                            <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-2">
                              <MapPin className="size-4" />
                              Redline Arena • Koramangala
                            </div>
                            <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-2">
                              <Users className="size-4" />
                              12/14 players confirmed
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-5">
                          <CardHeader className="p-0 gap-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[#a1a1a1] text-sm leading-5">
                                Tomorrow • 7:00 AM
                              </span>
                              <Badge className="rounded-full bg-neutral-200 text-neutral-900">
                                11v11
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-lg leading-7">
                              City Strikers Training
                            </h3>
                          </CardHeader>
                          <CardContent className="px-0 pt-4 pb-0 gap-3">
                            <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-2">
                              <MapPin className="size-4" />
                              Stadium Greens • HSR Layout
                            </div>
                            <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-2">
                              <Users className="size-4" />
                              18 players invited
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </section>
                  </div>
                  <div className="flex flex-col gap-8">
                    <section className="flex flex-col gap-4">
                      <div>
                        <h2 className="font-semibold text-2xl leading-8 tracking-tight">
                          Popular Turfs
                        </h2>
                        <p className="text-[#a1a1a1] text-sm leading-5">
                          Top-rated venues with premium facilities.
                        </p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-0 overflow-hidden">
                          <div className="flex p-4 gap-4">
                            <img
                              src="https://images.unsplash.com/photo-1547347298-4074fc3086f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                              alt="Popular turf"
                              className="object-cover rounded-2xl w-28 h-24"
                            />
                            <div className="flex flex-col flex-1 gap-2">
                              <div className="flex justify-between items-start gap-3">
                                <div>
                                  <h3 className="font-semibold">Prime Pitch</h3>
                                  <p className="text-[#a1a1a1] text-xs leading-4">
                                    2.1 km • 7v7
                                  </p>
                                </div>
                                <span className="font-medium text-sm leading-5">
                                  ₹2,900/hr
                                </span>
                              </div>
                              <div className="text-[#a1a1a1] text-xs leading-4 flex justify-between items-center">
                                <span>Rating 4.9</span>
                                <span>Open now</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                        <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-0 overflow-hidden">
                          <div className="flex p-4 gap-4">
                            <img
                              src="https://images.unsplash.com/photo-1511886929837-354d827aae26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                              alt="Popular turf"
                              className="object-cover rounded-2xl w-28 h-24"
                            />
                            <div className="flex flex-col flex-1 gap-2">
                              <div className="flex justify-between items-start gap-3">
                                <div>
                                  <h3 className="font-semibold">
                                    Goal Line Arena
                                  </h3>
                                  <p className="text-[#a1a1a1] text-xs leading-4">
                                    3.8 km • 5v5
                                  </p>
                                </div>
                                <span className="font-medium text-sm leading-5">
                                  ₹1,800/hr
                                </span>
                              </div>
                              <div className="text-[#a1a1a1] text-xs leading-4 flex justify-between items-center">
                                <span>Rating 4.8</span>
                                <span>Open now</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </section>
                    <section className="flex flex-col gap-4">
                      <div>
                        <h2 className="font-semibold text-2xl leading-8 tracking-tight">
                          Recent Football Activity
                        </h2>
                        <p className="text-[#a1a1a1] text-sm leading-5">
                          Bookings, check-ins, and match results.
                        </p>
                      </div>
                      <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-5">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start gap-3">
                            <div className="size-10 rounded-full bg-neutral-800 flex justify-center items-center">
                              <CalendarCheck className="size-4 text-neutral-200" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center gap-3">
                                <span className="font-medium">
                                  Booking confirmed
                                </span>
                                <span className="text-[#a1a1a1] text-xs leading-4">
                                  2m ago
                                </span>
                              </div>
                              <p className="text-[#a1a1a1] text-sm leading-5">
                                Arena 11 Turf booked for tonight at 8:00 PM.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="size-10 rounded-full bg-neutral-800 flex justify-center items-center">
                              <CheckCircle2 className="size-4 text-neutral-200" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center gap-3">
                                <span className="font-medium">
                                  Check-in complete
                                </span>
                                <span className="text-[#a1a1a1] text-xs leading-4">
                                  18m ago
                                </span>
                              </div>
                              <p className="text-[#a1a1a1] text-sm leading-5">
                                North United arrived at Redline Arena.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="size-10 rounded-full bg-neutral-800 flex justify-center items-center">
                              <Trophy className="size-4 text-neutral-200" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center gap-3">
                                <span className="font-medium">
                                  Match result
                                </span>
                                <span className="text-[#a1a1a1] text-xs leading-4">
                                  1h ago
                                </span>
                              </div>
                              <p className="text-[#a1a1a1] text-sm leading-5">
                                Blaze FC won 4-2 in a high-tempo 7v7 game.
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </section>
                    <section className="flex flex-col gap-4">
                      <div>
                        <h2 className="font-semibold text-2xl leading-8 tracking-tight">
                          Football Posts
                        </h2>
                        <p className="text-[#a1a1a1] text-sm leading-5">
                          Compact updates from players and friends.
                        </p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-4">
                          <div className="flex gap-4">
                            <img
                              src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                              alt="Football post"
                              className="object-cover rounded-2xl w-20 h-20"
                            />
                            <div className="flex flex-col flex-1 gap-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  Rahul • Striker
                                </span>
                                <span className="text-[#a1a1a1] text-xs leading-4">
                                  5m ago
                                </span>
                              </div>
                              <p className="text-[#a1a1a1] text-sm leading-5">
                                Night session at Redline Arena was unreal. Fast
                                turf, perfect lights, and a tight 3-2 finish.
                              </p>
                              <div className="text-[#a1a1a1] text-xs leading-4 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Heart className="size-3" />
                                  24
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="size-3" />6
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                        <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-4">
                          <div className="flex gap-4">
                            <img
                              src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                              alt="Football post"
                              className="object-cover rounded-2xl w-20 h-20"
                            />
                            <div className="flex flex-col flex-1 gap-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  Aman • Midfielder
                                </span>
                                <span className="text-[#a1a1a1] text-xs leading-4">
                                  22m ago
                                </span>
                              </div>
                              <p className="text-[#a1a1a1] text-sm leading-5">
                                Booked a 5v5 slot for tomorrow morning. Need two
                                more players for a full squad.
                              </p>
                              <div className="text-[#a1a1a1] text-xs leading-4 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Heart className="size-3" />
                                  18
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="size-3" />4
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </section>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
