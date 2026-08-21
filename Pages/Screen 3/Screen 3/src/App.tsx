import { useEffect } from "react";
import {
  Balloon,
  Bell,
  CalendarRange,
  CircleDot,
  Clock3,
  Home,
  LogOut,
  MapPin,
  MapPinned,
  MessageCircle,
  Navigation,
  Plus,
  Radio,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Star,
  Tag,
  User,
  Users,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
        <div className="min-h-[956px] bg-neutral-950 text-neutral-50 flex">
          <aside className="shrink-0 bg-neutral-900/70 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid hidden px-6 py-8 w-70">
            <div className="flex items-center gap-3">
              <div className="size-11 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_0_24px_rgba(255,0,0,0.12)] rounded-2xl bg-neutral-800 text-neutral-200 border-white/10 border-1 border-solid flex justify-center items-center">
                <Balloon className="size-5 text-[#ff6467]" />
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-lg leading-7 tracking-tight">
                  FootballHub
                </div>
                <div className="text-[#a1a1a1] text-xs leading-4">
                  Find turfs. Book games. Play now.
                </div>
              </div>
            </div>
            <nav className="flex flex-col items-start flex-1 gap-2">
              <Button
                variant="ghost"
                className="border-transparent bg-transparent font-medium rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid px-4 py-3 justify-start gap-3 w-full"
              >
                <Home className="size-4" />
                Home
              </Button>
              <Button
                variant="ghost"
                className="font-medium shadow-[0_0_24px_rgba(255,0,0,0.12)] rounded-xl bg-[#ff6467]/10 text-neutral-50 text-sm leading-5 border-[#ff6467] border-t-0 border-r-0 border-b-0 border-l-2 border-solid px-4 py-3 justify-start gap-3 w-full"
              >
                <MapPin className="size-4 text-[#ff6467]" />
                Find Turfs
              </Button>
              <Button
                variant="ghost"
                className="border-transparent bg-transparent font-medium rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid px-4 py-3 justify-start gap-3 w-full"
              >
                <Radio className="size-4" />
                Live Turfs
              </Button>
              <Button
                variant="ghost"
                className="border-transparent bg-transparent font-medium rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid px-4 py-3 justify-start gap-3 w-full"
              >
                <Users className="size-4" />
                Matches
              </Button>
              <Button
                variant="ghost"
                className="border-transparent bg-transparent font-medium rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid px-4 py-3 justify-start gap-3 w-full"
              >
                <MessageCircle className="size-4" />
                Messages
              </Button>
              <Button
                variant="ghost"
                className="border-transparent bg-transparent font-medium rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid px-4 py-3 justify-start gap-3 w-full"
              >
                <Users2 className="size-4" />
                Groups
              </Button>
              <Button
                variant="ghost"
                className="border-transparent bg-transparent font-medium rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid px-4 py-3 justify-start gap-3 w-full"
              >
                <Bell className="size-4" />
                Notifications
              </Button>
              <Button
                variant="ghost"
                className="border-transparent bg-transparent font-medium rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid px-4 py-3 justify-start gap-3 w-full"
              >
                <Plus className="size-4" />
                Create Post
              </Button>
              <Button
                variant="ghost"
                className="border-transparent bg-transparent font-medium rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid px-4 py-3 justify-start gap-3 w-full"
              >
                <User className="size-4" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className="border-transparent bg-transparent font-medium rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid px-4 py-3 justify-start gap-3 w-full"
              >
                <Settings className="size-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="border-transparent bg-transparent font-medium rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid mt-auto px-4 py-3 justify-start gap-3 w-full"
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </nav>
          </aside>
          <main className="p-6 flex-1">
            <div className="flex flex-col gap-6 h-full">
              <section className="shadow-[0_0_0_1px_rgba(255,255,255,0.02)] rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6">
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-2">
                      <MapPin className="size-4 text-[#ff6467]" />
                      <span>Find Turfs</span>
                    </div>
                    <h1 className="font-semibold text-3xl leading-9 tracking-tight">
                      Discover a turf near you
                    </h1>
                    <p className="max-w-2xl text-[#a1a1a1] text-sm leading-5">
                      Search live availability, compare turf types, and book
                      your next football session in seconds.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-neutral-800 border-white/10 border-1 border-solid flex px-4 py-3 items-center gap-3">
                    <MapPinned className="size-4 text-[#ff6467]" />
                    <div className="text-sm leading-5">
                      <div className="font-medium">Koramangala</div>
                      <div className="text-[#a1a1a1]">Bengaluru, India</div>
                    </div>
                  </div>
                </div>
                <div className="flex mt-6 flex-col gap-3">
                  <div className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid flex px-4 py-3 items-center flex-1 gap-3">
                    <Search className="size-4 text-[#a1a1a1]" />
                    <input
                      value="Search turfs, locations, or clubs"
                      className="bg-transparent outline-none text-sm leading-5 w-full"
                    />
                  </div>
                  <Button className="rounded-2xl bg-neutral-200 text-neutral-900 px-5 py-3">
                    <Navigation className="size-4 mr-2" />
                    Use current location
                  </Button>
                </div>
                <div className="flex mt-4 flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    className="rounded-full bg-neutral-800 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid px-4 py-2"
                  >
                    <SlidersHorizontal className="size-4 mr-2" />
                    Distance
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-full bg-neutral-800 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid px-4 py-2"
                  >
                    <Tag className="size-4 mr-2" />
                    Price range
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-full bg-neutral-800 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid px-4 py-2"
                  >
                    <Shield className="size-4 mr-2" />
                    5v5 / 7v7 / 11v11
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-full bg-neutral-800 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid px-4 py-2"
                  >
                    <Star className="size-4 mr-2" />
                    Rating
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-full bg-neutral-800 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid px-4 py-2"
                  >
                    <Clock3 className="size-4 mr-2" />
                    Availability
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-full bg-neutral-800 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid px-4 py-2"
                  >
                    <CalendarRange className="size-4 mr-2" />
                    Time slot
                  </Button>
                </div>
              </section>
              <div className="grid flex-1 gap-6">
                <section className="rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <h2 className="font-semibold text-xl leading-7 tracking-tight">
                        Nearby turfs
                      </h2>
                      <p className="text-[#a1a1a1] text-sm leading-5">
                        Live availability and premium turf options around you.
                      </p>
                    </div>
                    <div className="rounded-full bg-neutral-800 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                      12 results
                    </div>
                  </div>
                  <div className="max-h-[720px] overflow-y-auto flex mt-5 pr-1 flex-col gap-4">
                    <Card className="group transition-all duration-300 bg-neutral-800/40 border-white/10 border-0 border-solid p-0 gap-0 overflow-hidden">
                      <div className="grid gap-0">
                        <div className="relative h-44">
                          <img
                            src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                            alt="Urban turf"
                            className="object-cover w-full h-full"
                          />
                          <div className="bg-gradient-to-r from-background/10 via-transparent to-transparent absolute inset-0" />
                        </div>
                        <div className="flex p-5 flex-col gap-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg leading-7">
                                  Arena 11
                                </h3>
                                <Badge className="rounded-full bg-[#ff6467]/15 text-[#ff6467]">
                                  Live availability
                                </Badge>
                              </div>
                              <div className="text-[#a1a1a1] text-sm leading-5 flex mt-1 items-center gap-3">
                                <span>1.8 km away</span>
                                <span>•</span>
                                <span>Koramangala</span>
                              </div>
                            </div>
                            <div className="font-medium text-sm leading-5 flex items-center gap-1">
                              <Star className="size-4 fill-yellow-400 text-yellow-400" />
                              4.8
                            </div>
                          </div>
                          <div className="text-xs leading-4 flex flex-wrap items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="rounded-full bg-neutral-950 text-neutral-50"
                            >
                              7v7
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="rounded-full bg-neutral-950 text-neutral-50"
                            >
                              Open now
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="rounded-full bg-neutral-950 text-neutral-50"
                            >
                              ₹2,400/hr
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-[#a1a1a1] text-sm leading-5">
                              Next slot: 7:00 PM - 8:00 PM
                            </div>
                            <Button className="rounded-full bg-neutral-200 text-neutral-900 px-4 py-2">
                              View details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                    <Card className="group transition-all duration-300 bg-neutral-800/40 border-white/10 border-0 border-solid p-0 gap-0 overflow-hidden">
                      <div className="grid gap-0">
                        <div className="relative h-44">
                          <img
                            src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                            alt="Floodlit turf"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex p-5 flex-col gap-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg leading-7">
                                  Redline Grounds
                                </h3>
                                <Badge className="rounded-full bg-[#ff6467]/15 text-[#ff6467]">
                                  Almost full
                                </Badge>
                              </div>
                              <div className="text-[#a1a1a1] text-sm leading-5 flex mt-1 items-center gap-3">
                                <span>3.2 km away</span>
                                <span>•</span>
                                <span>Indiranagar</span>
                              </div>
                            </div>
                            <div className="font-medium text-sm leading-5 flex items-center gap-1">
                              <Star className="size-4 fill-yellow-400 text-yellow-400" />
                              4.7
                            </div>
                          </div>
                          <div className="text-xs leading-4 flex flex-wrap items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="rounded-full bg-neutral-950 text-neutral-50"
                            >
                              5v5
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="rounded-full bg-neutral-950 text-neutral-50"
                            >
                              Open now
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="rounded-full bg-neutral-950 text-neutral-50"
                            >
                              ₹1,800/hr
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-[#a1a1a1] text-sm leading-5">
                              2 slots left tonight
                            </div>
                            <Button
                              variant="secondary"
                              className="rounded-full bg-neutral-950 text-neutral-50 border-white/10 border-1 border-solid px-4 py-2"
                            >
                              View details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                    <Card className="group transition-all duration-300 bg-neutral-800/40 border-white/10 border-0 border-solid p-0 gap-0 overflow-hidden">
                      <div className="grid gap-0">
                        <div className="relative h-44">
                          <img
                            src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                            alt="Night turf"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex p-5 flex-col gap-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg leading-7">
                                  Stadium 7
                                </h3>
                                <Badge className="rounded-full bg-[#ff6467]/15 text-[#ff6467]">
                                  Closed
                                </Badge>
                              </div>
                              <div className="text-[#a1a1a1] text-sm leading-5 flex mt-1 items-center gap-3">
                                <span>5.6 km away</span>
                                <span>•</span>
                                <span>HSR Layout</span>
                              </div>
                            </div>
                            <div className="font-medium text-sm leading-5 flex items-center gap-1">
                              <Star className="size-4 fill-yellow-400 text-yellow-400" />
                              4.9
                            </div>
                          </div>
                          <div className="text-xs leading-4 flex flex-wrap items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="rounded-full bg-neutral-950 text-neutral-50"
                            >
                              11v11
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="rounded-full bg-neutral-950 text-neutral-50"
                            >
                              Floodlights
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="rounded-full bg-neutral-950 text-neutral-50"
                            >
                              ₹4,500/hr
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-[#a1a1a1] text-sm leading-5">
                              Reopens tomorrow 6:00 AM
                            </div>
                            <Button
                              variant="secondary"
                              className="rounded-full bg-neutral-950 text-neutral-50 border-white/10 border-1 border-solid px-4 py-2"
                            >
                              View details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </section>
                <section className="rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold text-xl leading-7 tracking-tight">
                        Map view
                      </h2>
                      <p className="text-[#a1a1a1] text-sm leading-5">
                        Nearby turfs with live marker glow.
                      </p>
                    </div>
                    <Badge className="rounded-full bg-[#ff6467]/15 text-[#ff6467]">
                      Selected turf
                    </Badge>
                  </div>
                  <div className="relative rounded-3xl bg-[#0b0b0b] border-white/10 border-1 border-solid mt-5 overflow-hidden">
                    <img
                      src="https://screens-image-components-public.s3.eu-north-1.amazonaws.com/city-navigation-map.png"
                      alt="Map"
                      className="object-cover opacity-80 w-full h-180"
                    />
                    <div className="bg-[#ff0000]/12 absolute inset-0" />
                    <div className="left-[18%] top-[28%] flex absolute items-center gap-2">
                      <div className="size-4 shadow-[0_0_0_8px_rgba(255,0,0,0.12),0_0_24px_rgba(255,0,0,0.55)] rounded-full bg-[#ff6467]" />
                      <div className="font-medium rounded-full bg-neutral-950/90 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                        Arena 11
                      </div>
                    </div>
                    <div className="left-[52%] top-[44%] flex absolute items-center gap-2">
                      <div className="size-4 shadow-[0_0_0_8px_rgba(255,0,0,0.08),0_0_18px_rgba(255,0,0,0.35)] rounded-full bg-[#ff6467]/80" />
                      <div className="font-medium rounded-full bg-neutral-950/90 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                        Redline Grounds
                      </div>
                    </div>
                    <div className="left-[68%] top-[62%] flex absolute items-center gap-2">
                      <div className="size-4 shadow-[0_0_0_8px_rgba(255,0,0,0.06),0_0_16px_rgba(255,0,0,0.28)] rounded-full bg-[#ff6467]/70" />
                      <div className="font-medium rounded-full bg-neutral-950/90 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                        Stadium 7
                      </div>
                    </div>
                    <Card className="shadow-[0_0_30px_rgba(0,0,0,0.35)] bg-neutral-900/95 border-white/10 border-0 border-solid absolute left-4 bottom-4 p-4 gap-3 w-70">
                      <CardHeader className="p-0 gap-1">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base leading-6">
                            Arena 11
                          </CardTitle>
                          <CircleDot className="size-4 text-[#ff6467]" />
                        </div>
                        <CardDescription>
                          1.8 km away • Koramangala
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-[#a1a1a1] text-sm leading-5 p-0 gap-2">
                        <div className="flex justify-between items-center">
                          <span>7v7 • Open now</span>
                          <span className="text-neutral-50">₹2,400/hr</span>
                        </div>
                        <div className="text-[#ff6467] text-xs leading-4 flex items-center gap-2">
                          <Radio className="size-3.5" />
                          Live marker selected
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
