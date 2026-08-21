import { useEffect } from "react";
import {
  Balloon,
  Bell,
  Clock3,
  Filter,
  Home,
  LogOut,
  MapPin,
  MessageCircle,
  Navigation,
  Plus,
  Radio,
  Settings,
  Sparkles,
  User,
  Users,
  Users2,
} from "lucide-react";

import { FallbackComponent } from "./CustomComponents";

export default function App() {
  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-[956px] bg-neutral-950 text-neutral-50 flex">
          <aside className="shrink-0 bg-neutral-900 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid hidden px-6 py-8 flex-col gap-8 w-64">
            <div className="flex items-center gap-3">
              <div className="size-11 shadow-[0_0_24px_rgba(255,255,255,0.05)] rounded-2xl bg-neutral-800 border-white/10 border-1 border-solid flex justify-center items-center">
                <Balloon className="size-5 text-neutral-200" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg leading-7 tracking-tight">
                  FootballHub
                </span>
                <span className="text-[#a1a1a1] text-xs leading-4">
                  Live turf intelligence
                </span>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <button className="bg-transparent border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3 w-full">
                <Home className="size-4" />
                <span>Home</span>
              </button>
              <button className="bg-transparent border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3 w-full">
                <MapPin className="size-4" />
                <span>Find Turfs</span>
              </button>
              <button className="text-left shadow-[0_0_24px_rgba(255,255,255,0.06)] rounded-xl bg-neutral-800 text-neutral-50 text-sm leading-5 border-neutral-200 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex px-4 py-3 items-center gap-3 w-full">
                <Radio className="size-4 text-neutral-200" />
                <span>Live Turfs</span>
              </button>
              <button className="bg-transparent border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3 w-full">
                <Users className="size-4" />
                <span>Matches</span>
              </button>
              <button className="bg-transparent border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3 w-full">
                <MessageCircle className="size-4" />
                <span>Messages</span>
              </button>
              <button className="bg-transparent border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3 w-full">
                <Users2 className="size-4" />
                <span>Groups</span>
              </button>
              <button className="bg-transparent border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3 w-full">
                <Bell className="size-4" />
                <span>Notifications</span>
              </button>
              <button className="bg-transparent border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3 w-full">
                <Plus className="size-4" />
                <span>Create Post</span>
              </button>
              <button className="bg-transparent border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3 w-full">
                <User className="size-4" />
                <span>Profile</span>
              </button>
              <button className="bg-transparent border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3 w-full">
                <Settings className="size-4" />
                <span>Settings</span>
              </button>
              <button className="bg-transparent border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3 w-full">
                <LogOut className="size-4" />
                <span>Logout</span>
              </button>
            </nav>
            <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex mt-auto p-4 flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 shrink-0 rounded-xl border-white/10 border-1 border-solid overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1487466365202-1afdb86c764e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHR1cmYlMjBuaWdodCUyMHN0YWRpdW0lMjBkYXJrJTIwY2luZW1hdGljJTIwcGl0Y2h8ZW58MXwwfHx8MTc4NzAzMzAyOHww&ixlib=rb-4.1.0&q=80&w=400"
                    alt="Football turf"
                    className="object-cover w-full h-full"
                    data-photoid="ARU18GpF6QQ"
                    data-authorname="Jonathan Petersson"
                    data-authorurl="https://unsplash.com/@grizzlybear"
                    data-blurhash="LX5aH-kVa#azY@afjuj[X3a{f%fQ"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm leading-5">
                    Tonight's live action
                  </span>
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    4 turfs active nearby
                  </span>
                </div>
              </div>
            </div>
          </aside>
          <main className="flex-1 overflow-hidden">
            <div className="relative min-h-[956px] p-8">
              <div className="pointer-events-none opacity-30 bg-white/4 absolute inset-0" />
              <div className="pointer-events-none bg-white/5 absolute inset-0" />
              <div className="relative flex flex-col gap-8">
                <header className="flex flex-col gap-6">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex flex-col gap-3">
                      <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-2">
                        <MapPin className="size-4 text-neutral-200" />
                        <span>Live Turfs • Bengaluru, India</span>
                      </div>
                      <h1 className="font-semibold text-4xl leading-10 tracking-tight">
                        Live Turfs
                      </h1>
                      <p className="max-w-2xl text-[#a1a1a1] text-sm leading-6">
                        Turfs currently active near you with live matches,
                        remaining time, and instant access to view what is
                        happening right now.
                      </p>
                    </div>
                    <div className="shadow-[0_0_24px_rgba(255,255,255,0.04)] rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex px-4 py-3 items-center gap-3">
                      <Sparkles className="size-4 text-neutral-200" />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm leading-5">
                          4 live turfs
                        </span>
                        <span className="text-[#a1a1a1] text-xs leading-4">
                          Updated moments ago
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex p-3 flex-wrap items-center gap-3">
                    <button className="rounded-xl bg-neutral-800 text-[#a1a1a1] text-sm leading-5 border-white/10 border-1 border-solid flex px-4 py-3 items-center gap-2">
                      <Filter className="size-4" />
                      <span>Sort by</span>
                    </button>
                    <button className="rounded-xl bg-neutral-800 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid flex px-4 py-3 items-center gap-2">
                      <Navigation className="size-4 text-neutral-200" />
                      <span>Distance</span>
                    </button>
                    <button className="rounded-xl bg-neutral-800 text-[#a1a1a1] text-sm leading-5 border-white/10 border-1 border-solid flex px-4 py-3 items-center gap-2">
                      <FallbackComponent className="size-4" />
                      <span>Turf type</span>
                    </button>
                    <div className="rounded-xl bg-neutral-800 text-[#a1a1a1] text-sm leading-5 border-white/10 border-1 border-solid flex ml-auto px-4 py-3 items-center gap-2">
                      <Clock3 className="size-4" />
                      <span>Last updated 2 min ago</span>
                    </div>
                  </div>
                </header>
                <section className="shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-4 overflow-hidden">
                  <div className="relative rounded-2xl bg-[#0f0f10] border-white/10 border-1 border-solid h-190 overflow-hidden">
                    <img
                      src="https://screens-image-components-public.s3.eu-north-1.amazonaws.com/city-navigation-map.png"
                      alt="FootballHub live turf map"
                      className="object-cover opacity-90 w-full h-full"
                    />
                    <div className="bg-white/6 absolute inset-0" />
                    <div className="font-semibold shadow-[0_0_24px_rgba(255,0,0,0.16)] rounded-full bg-[#ff6467]/15 text-[#ff6467] text-xs leading-4 tracking-[4.48px] border-[#ff6467]/30 border-1 border-solid flex absolute left-8 top-8 px-3 py-1 items-center gap-2">
                      <span className="size-2 animate-pulse rounded-full bg-[#ff6467]" />
                      LIVE MAP
                    </div>
                    <div className="rounded-full bg-neutral-900/90 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid absolute right-8 top-8 px-3 py-1">
                      4 active grounds nearby
                    </div>
                    <div className="left-[22%] top-[34%] flex absolute flex-col items-center gap-2">
                      <div className="size-5 shadow-[0_0_0_10px_rgba(255,255,255,0.03),0_0_24px_rgba(255,255,255,0.18)] rounded-full bg-neutral-200 border-neutral-200/60 border-1 border-solid" />
                      <div className="shadow-[0_0_24px_rgba(0,0,0,0.35)] rounded-full bg-neutral-900 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                        Arena 11
                      </div>
                    </div>
                    <div className="left-[58%] top-[42%] flex absolute flex-col items-center gap-2">
                      <div className="size-5 shadow-[0_0_0_10px_rgba(255,255,255,0.03),0_0_24px_rgba(255,255,255,0.18)] rounded-full bg-neutral-200 border-neutral-200/60 border-1 border-solid" />
                      <div className="shadow-[0_0_24px_rgba(0,0,0,0.35)] rounded-full bg-neutral-900 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                        Metro Arena
                      </div>
                    </div>
                    <div className="left-[74%] top-[28%] flex absolute flex-col items-center gap-2">
                      <div className="size-5 shadow-[0_0_0_10px_rgba(255,255,255,0.03),0_0_24px_rgba(255,255,255,0.18)] rounded-full bg-neutral-200 border-neutral-200/60 border-1 border-solid" />
                      <div className="shadow-[0_0_24px_rgba(0,0,0,0.35)] rounded-full bg-neutral-900 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                        North Field
                      </div>
                    </div>
                    <div className="left-[46%] top-[66%] flex absolute flex-col items-center gap-2">
                      <div className="size-5 shadow-[0_0_0_10px_rgba(255,255,255,0.03),0_0_24px_rgba(255,255,255,0.18)] rounded-full bg-neutral-200 border-neutral-200/60 border-1 border-solid" />
                      <div className="shadow-[0_0_24px_rgba(0,0,0,0.35)] rounded-full bg-neutral-900 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                        South Pitch
                      </div>
                    </div>
                    <div className="rounded-2xl bg-neutral-900/95 border-white/10 border-1 border-solid flex absolute inset-x-8 bottom-8 p-4 justify-between items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[#a1a1a1] text-xs leading-4">
                          Selected turf
                        </span>
                        <span className="font-medium text-sm leading-5">
                          Arena 11 Turf • Koramangala
                        </span>
                      </div>
                      <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-3">
                        <span className="rounded-full bg-neutral-800 border-white/10 border-1 border-solid px-3 py-2">
                          1.8 km
                        </span>
                        <span className="rounded-full bg-neutral-800 border-white/10 border-1 border-solid px-3 py-2">
                          18 players
                        </span>
                        <span className="rounded-full bg-neutral-800 border-white/10 border-1 border-solid px-3 py-2">
                          Live now
                        </span>
                      </div>
                    </div>
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
