import { useEffect } from "react";
import {
  AlertTriangle,
  Balloon,
  Bath,
  Bell,
  CarFront,
  CircleCheckBig,
  Droplets,
  Home,
  LampCeiling,
  Lock,
  LogOut,
  MapPin,
  MessageCircle,
  MessageSquareMore,
  Navigation,
  Plus,
  Radio,
  Receipt,
  Ruler,
  Settings,
  Shirt,
  Sparkles,
  Star,
  Tag,
  User,
  Users,
  Users2,
  Wrench,
  X,
} from "lucide-react";

export default function App() {
  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-screen bg-neutral-950 text-neutral-50 flex w-full">
          <aside className="shrink-0 bg-neutral-900/80 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid hidden px-6 py-8 w-72">
            <div className="flex items-center gap-3">
              <div className="size-11 shadow-[0_0_24px_rgba(239,68,68,0.18)] rounded-2xl bg-red-500/10 text-red-400 border-red-500/30 border-1 border-solid flex justify-center items-center">
                <Balloon className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg leading-7 tracking-tight">
                  FootballHub
                </span>
                <span className="text-[#a1a1a1] text-xs leading-4">{`Turf booking & live football`}</span>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              <button className="font-medium shadow-[0_0_24px_rgba(239,68,68,0.12)] rounded-xl bg-red-500/10 text-neutral-50 text-sm leading-5 border-red-500 border-t-0 border-r-0 border-b-0 border-l-4 border-solid flex px-4 py-3 items-center gap-3">
                <Home className="size-4 text-red-400" />
                Home
              </button>
              <button className="transition-colors rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <MapPin className="size-4" />
                Find Turfs
              </button>
              <button className="transition-colors rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Radio className="size-4" />
                Live Turfs
              </button>
              <button className="transition-colors rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Users className="size-4" />
                Matches
              </button>
              <button className="transition-colors rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <MessageCircle className="size-4" />
                Messages
              </button>
              <button className="transition-colors rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Users2 className="size-4" />
                Groups
              </button>
              <button className="transition-colors rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Bell className="size-4" />
                Notifications
              </button>
              <button className="transition-colors rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Plus className="size-4" />
                Create Post
              </button>
              <button className="transition-colors rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <User className="size-4" />
                Profile
              </button>
              <button className="transition-colors rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Settings className="size-4" />
                Settings
              </button>
              <button className="transition-colors rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <LogOut className="size-4" />
                Logout
              </button>
            </nav>
            <div className="rounded-3xl bg-neutral-950/60 border-white/10 border-1 border-solid mt-auto p-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-red-500/10 text-red-400 p-2">
                  <Sparkles className="size-6" />
                </div>
                <div>
                  <p className="font-medium text-sm leading-5">
                    Premium turf access
                  </p>
                  <p className="text-[#a1a1a1] text-xs leading-4">
                    Fast booking, live availability
                  </p>
                </div>
              </div>
            </div>
          </aside>
          <main className="p-6 flex-1">
            <div className="grid gap-6">
              <section className="flex flex-col gap-6">
                <div className="shadow-[0_24px_80px_rgba(0,0,0,0.45)] rounded-4xl bg-neutral-900 border-white/10 border-1 border-solid overflow-hidden">
                  <div className="relative h-105">
                    <img
                      src="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHR1cmYlMjBzdGFkaXVtJTIwbmlnaHQlMjBwaXRjaCUyMGxpZ2h0c3xlbnwxfDB8fHwxNzg3MDMzMDI4fDA&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Turf gallery"
                      className="object-cover w-full h-full"
                      data-photoid="deGn9vSwXIM"
                      data-authorname="Bence Balla-Schottner"
                      data-authorurl="https://unsplash.com/@ballaschottner"
                      data-blurhash="L79kG-%dM+xt?rM}agay~qs:x?t6"
                    />
                    <div className="bg-black/8 absolute inset-0" />
                    <div className="backdrop-blur-sm font-medium rounded-full bg-black/40 text-white text-xs leading-4 tracking-wide border-white/10 border-1 border-solid absolute left-6 top-6 px-4 py-2">
                      Premium turf gallery
                    </div>
                    <div className="flex absolute inset-x-6 bottom-6 justify-between items-end gap-4">
                      <div className="max-w-xl">
                        <p className="text-white/80 text-sm leading-5">
                          FootballHub / Turf Details
                        </p>
                        <h1 className="font-semibold text-white text-4xl leading-10 tracking-tight mt-2">
                          Stadium Prime Arena
                        </h1>
                        <div className="text-white/85 text-sm leading-5 flex mt-3 flex-wrap items-center gap-4">
                          <span className="flex items-center gap-1.5">
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                            4.9
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="size-4 text-red-400" />
                            Downtown Sports District
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Navigation className="size-4" />
                            2.4 km from you
                          </span>
                        </div>
                      </div>
                      <div className="backdrop-blur-sm text-right rounded-2xl bg-black/40 border-white/10 border-1 border-solid hidden px-4 py-3">
                        <p className="uppercase text-white/60 text-xs leading-4 tracking-[3.2px]">
                          Price
                        </p>
                        <p className="font-semibold text-white text-2xl leading-8">
                          $85/hr
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 bg-neutral-950 border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid p-4 gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHR1cmYlMjBzdGFkaXVtJTIwbmlnaHQlMjBwaXRjaCUyMGxpZ2h0c3xlbnwxfDB8fHwxNzg3MDMzMDI4fDA&ixlib=rb-4.1.0&q=80&w=400"
                      alt="Thumbnail 1"
                      className="object-cover ring-1 ring-white/10 rounded-2xl w-full h-20"
                      data-photoid="deGn9vSwXIM"
                      data-authorname="Bence Balla-Schottner"
                      data-authorurl="https://unsplash.com/@ballaschottner"
                      data-blurhash="L79kG-%dM+xt?rM}agay~qs:x?t6"
                    />
                    <div className="rounded-2xl bg-neutral-800/20 border-white/10 border-1 border-solid h-20" />
                    <div className="rounded-2xl bg-neutral-800/20 border-white/10 border-1 border-solid h-20" />
                    <div className="rounded-2xl bg-neutral-800/20 border-white/10 border-1 border-solid h-20" />
                    <div className="rounded-2xl bg-neutral-800/20 border-white/10 border-1 border-solid h-20" />
                  </div>
                </div>
                <div className="grid gap-6">
                  <div className="rounded-4xl bg-neutral-900 border-white/10 border-1 border-solid flex p-6 flex-col gap-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h2 className="font-semibold text-2xl leading-8 tracking-tight">
                          Stadium Prime Arena
                        </h2>
                        <p className="text-[#a1a1a1] text-sm leading-5 mt-2">
                          Elite 7v7 turf with cinematic lighting and premium
                          surface quality.
                        </p>
                      </div>
                      <div className="rounded-full bg-neutral-950 text-sm leading-5 border-white/10 border-1 border-solid flex px-3 py-1 items-center gap-1">
                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                        <span>4.9</span>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <div className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid p-4">
                        <div className="font-medium text-sm leading-5 flex items-center gap-2">
                          <Ruler className="size-4 text-red-400" />
                          Turf Specifications
                        </div>
                        <div className="grid grid-cols-2 text-[#a1a1a1] text-sm leading-5 mt-4 gap-3">
                          <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid p-3">
                            7v7
                          </div>
                          <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid p-3">
                            FIFA-grade turf
                          </div>
                          <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid p-3">
                            Indoor/outdoor
                          </div>
                          <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid p-3">
                            Night play ready
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid p-4">
                        <div className="font-medium text-sm leading-5 flex items-center gap-2">
                          <Wrench className="size-4 text-red-400" />
                          Facilities
                        </div>
                        <div className="grid grid-cols-2 text-[#a1a1a1] text-sm leading-5 mt-4 gap-3">
                          <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid flex p-3 items-center gap-2">
                            <CarFront className="size-4 text-red-400" />
                            Parking
                          </div>
                          <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid flex p-3 items-center gap-2">
                            <LampCeiling className="size-4 text-red-400" />
                            Floodlights
                          </div>
                          <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid flex p-3 items-center gap-2">
                            <Shirt className="size-4 text-red-400" />
                            Changing room
                          </div>
                          <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid flex p-3 items-center gap-2">
                            <Bath className="size-4 text-red-400" />
                            Washroom
                          </div>
                          <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid flex p-3 items-center gap-2">
                            <Droplets className="size-4 text-red-400" />
                            Drinking water
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid p-4">
                      <div className="font-medium text-sm leading-5 flex items-center gap-2">
                        <Tag className="size-4 text-red-400" />
                        {`Pricing & Policies`}
                      </div>
                      <div className="flex mt-3 justify-between items-end gap-4">
                        <div>
                          <p className="font-semibold text-white text-3xl leading-9">
                            $85
                            <span className="text-[#a1a1a1] text-base leading-6">
                              / hour
                            </span>
                          </p>
                          <p className="text-[#a1a1a1] text-sm leading-5 mt-2">
                            Peak hours may include a small premium. Cancellation
                            allowed up to 2 hours before kickoff.
                          </p>
                        </div>
                        <div className="rounded-2xl bg-neutral-900 text-[#a1a1a1] text-sm leading-5 border-white/10 border-1 border-solid px-4 py-3">
                          No outside food • Clean boots only • Respect slot
                          timings
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid p-4">
                      <div className="font-medium text-sm leading-5 flex items-center gap-2">
                        <MessageSquareMore className="size-4 text-red-400" />
                        Reviews
                      </div>
                      <div className="flex mt-4 flex-col gap-4">
                        <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex p-4 gap-3">
                          <div className="size-11 rounded-full bg-red-500/15" />
                          <div className="flex-1">
                            <div className="flex justify-between items-center gap-3">
                              <p className="font-medium">Ayaan</p>
                              <div className="text-yellow-400 flex items-center gap-1">
                                <Star className="size-4 fill-yellow-400" />
                                <Star className="size-4 fill-yellow-400" />
                                <Star className="size-4 fill-yellow-400" />
                                <Star className="size-4 fill-yellow-400" />
                                <Star className="size-4 fill-yellow-400" />
                              </div>
                            </div>
                            <p className="text-[#a1a1a1] text-sm leading-5 mt-2">
                              Excellent surface and lighting. Booking was smooth
                              and the turf felt premium.
                            </p>
                          </div>
                        </div>
                        <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex p-4 gap-3">
                          <div className="size-11 rounded-full bg-neutral-800" />
                          <div className="flex-1">
                            <div className="flex justify-between items-center gap-3">
                              <p className="font-medium">Rohan</p>
                              <div className="text-yellow-400 flex items-center gap-1">
                                <Star className="size-4 fill-yellow-400" />
                                <Star className="size-4 fill-yellow-400" />
                                <Star className="size-4 fill-yellow-400" />
                                <Star className="size-4 fill-yellow-400" />
                                <Star className="size-4 text-[#a1a1a1]" />
                              </div>
                            </div>
                            <p className="text-[#a1a1a1] text-sm leading-5 mt-2">
                              Great floodlights and parking. Perfect for late
                              evening matches.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <aside className="shadow-[0_24px_80px_rgba(0,0,0,0.35)] rounded-4xl bg-neutral-900 border-white/10 border-1 border-solid flex p-6 flex-col gap-6">
                    <div className="flex justify-between items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-xl leading-7 tracking-tight">
                          Booking
                        </h3>
                        <p className="text-[#a1a1a1] text-sm leading-5">
                          Choose a date and slot to reserve your turf.
                        </p>
                      </div>
                      <div className="font-medium shadow-[0_0_18px_rgba(239,68,68,0.18)] rounded-full bg-red-500/10 text-red-300 text-xs leading-4 border-red-500/30 border-1 border-solid px-3 py-1">
                        Live availability
                      </div>
                    </div>
                    <div className="overflow-x-auto flex pb-1 gap-2">
                      <button>Today</button>
                      <button>Tomorrow</button>
                      <button>Sat 24</button>
                      <button>Sun 25</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button>
                        <div className="font-medium text-sm leading-5 flex justify-between items-center">
                          <span>09:00 - 10:00</span>
                          <CircleCheckBig className="size-4 text-emerald-400" />
                        </div>
                        <p className="text-[#a1a1a1] text-xs leading-4 mt-2">
                          Available
                        </p>
                        <p className="font-semibold text-sm leading-5 mt-3">
                          $85
                        </p>
                      </button>
                      <button className="text-left rounded-2xl bg-amber-400/10 border-amber-400/50 border-1 border-solid p-4">
                        <div className="font-medium text-sm leading-5 flex justify-between items-center">
                          <span>10:00 - 11:00</span>
                          <AlertTriangle className="size-4 text-amber-400" />
                        </div>
                        <p className="text-[#a1a1a1] text-xs leading-4 mt-2">
                          Almost full
                        </p>
                        <p className="font-semibold text-sm leading-5 mt-3">
                          $95
                        </p>
                      </button>
                      <button className="text-left opacity-70 rounded-2xl bg-neutral-800/20 border-white/10 border-1 border-solid p-4">
                        <div className="line-through font-medium text-sm leading-5 flex justify-between items-center">
                          <span>11:00 - 12:00</span>
                          <Lock className="size-4 text-[#a1a1a1]" />
                        </div>
                        <p className="text-[#a1a1a1] text-xs leading-4 mt-2">
                          Booked
                        </p>
                        <p className="font-semibold text-sm leading-5 mt-3">
                          $95
                        </p>
                      </button>
                      <button className="text-left shadow-[0_0_22px_rgba(239,68,68,0.18)] rounded-2xl bg-red-500/10 border-red-500/60 border-1 border-solid p-4">
                        <div className="font-medium text-sm leading-5 flex justify-between items-center">
                          <span>12:00 - 13:00</span>
                          <Radio className="size-4 animate-pulse text-red-400" />
                        </div>
                        <p className="text-[#a1a1a1] text-xs leading-4 mt-2">
                          Currently playing
                        </p>
                        <p className="font-semibold text-sm leading-5 mt-3">
                          $105
                        </p>
                      </button>
                      <button className="col-span-2 text-left opacity-50 rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid p-4">
                        <div className="font-medium text-sm leading-5 flex justify-between items-center">
                          <span>13:00 - 14:00</span>
                          <X className="size-4 text-[#a1a1a1]" />
                        </div>
                        <p className="text-[#a1a1a1] text-xs leading-4 mt-2">
                          Unavailable
                        </p>
                        <p className="font-semibold text-sm leading-5 mt-3">
                          $105
                        </p>
                      </button>
                      <button>
                        <div className="font-medium text-sm leading-5 flex justify-between items-center">
                          <span>18:00 - 19:00</span>
                          <Sparkles className="size-4 text-red-400" />
                        </div>
                        <p className="text-[#a1a1a1] text-xs leading-4 mt-2">
                          Selected slot
                        </p>
                        <p className="font-semibold text-sm leading-5 mt-3">
                          $125
                        </p>
                      </button>
                    </div>
                    <div className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid p-4">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm leading-5">
                          Booking summary
                        </p>
                        <Receipt className="size-4 text-red-400" />
                      </div>
                      <div className="space-y-3 text-[#a1a1a1] text-sm leading-5 mt-4">
                        <div className="flex justify-between items-center">
                          <span>Turf</span>
                          <span className="text-neutral-50">
                            Stadium Prime Arena
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Date</span>
                          <span className="text-neutral-50" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Time</span>
                          <span className="text-neutral-50" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Duration</span>
                          <span className="text-neutral-50">1 hour</span>
                        </div>
                        <div className="border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex pt-3 justify-between items-center">
                          <span>Total</span>
                          <span className="font-semibold text-white text-lg leading-7">
                            $125
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="transition-transform font-semibold shadow-[0_18px_40px_rgba(239,68,68,0.28)] rounded-2xl bg-red-500 text-white text-base leading-6 px-5 py-4">
                      Confirm Booking
                    </button>
                  </aside>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
