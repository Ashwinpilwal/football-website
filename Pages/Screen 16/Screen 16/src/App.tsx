import { useEffect } from "react";
import {
  Banknote,
  Bell,
  BellOff,
  Clock3,
  Home,
  LogOut,
  MapPin,
  MapPinned,
  MessageCircle,
  Plus,
  Radio,
  Reply,
  RotateCcw,
  Settings,
  TimerReset,
  User,
  UserPlus,
  Users,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-[956px] bg-neutral-950 text-neutral-50 flex">
          <aside className="shrink-0 bg-neutral-900/40 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex px-4 py-5 flex-col w-65">
            <div className="shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_60px_rgba(0,0,0,0.35)] rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex mb-6 px-4 py-3 items-center gap-3">
              <div className="size-11 shadow-[0_0_24px_rgba(255,255,255,0.04)] rounded-2xl bg-neutral-950/80 text-neutral-50 border-white/10 border-1 border-solid flex justify-center items-center">
                <Bell className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="leading-none font-semibold text-lg leading-7">
                  FootballHub
                </div>
                <div className="text-[#a1a1a1] text-sm leading-5 mt-1">
                  Premium football social
                </div>
              </div>
            </div>
            <nav className="flex flex-col flex-1 gap-1">
              <button className="transition text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Home className="size-4" />
                Home
              </button>
              <button className="transition text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <MapPin className="size-4" />
                Find Turfs
              </button>
              <button className="transition text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Radio className="size-4" />
                Live Turfs
              </button>
              <button className="transition text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Users className="size-4" />
                Matches
              </button>
              <button className="transition text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <MessageCircle className="size-4" />
                Messages
              </button>
              <button className="transition text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Users2 className="size-4" />
                Groups
              </button>
              <button className="text-left shadow-[0_0_24px_rgba(255,255,255,0.03)] rounded-2xl bg-neutral-800 text-neutral-50 text-sm leading-5 border-neutral-200 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex px-4 py-3 items-center gap-3">
                <Bell className="size-4 text-neutral-200" />
                Notifications
              </button>
              <button className="transition text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Plus className="size-4" />
                Create Post
              </button>
              <button className="transition text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <User className="size-4" />
                Profile
              </button>
              <button className="transition text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex px-4 py-3 items-center gap-3">
                <Settings className="size-4" />
                Settings
              </button>
            </nav>
            <button className="transition text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 flex mt-4 px-4 py-3 items-center gap-3">
              <LogOut className="size-4" />
              Logout
            </button>
          </aside>
          <main className="relative bg-white/4 flex-1 overflow-hidden">
            <div className="[background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px] opacity-30 absolute inset-0" />
            <div className="relative max-w-[920px] flex mx-auto p-8 flex-col w-full h-full">
              <div className="flex justify-between items-start gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="font-semibold text-3xl leading-9 tracking-tight">
                      Notifications
                    </h1>
                    <span className="font-medium rounded-full bg-neutral-900 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                      12 unread
                    </span>
                  </div>
                  <p className="text-[#a1a1a1] text-sm leading-5 mt-2">
                    Stay on top of posts, matches, bookings, and turf activity.
                  </p>
                </div>
                <Button className="font-medium rounded-full bg-neutral-200 text-neutral-900 text-sm leading-5 px-4 py-2">
                  Mark all as read
                </Button>
              </div>
              <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex mt-6 p-2 items-center gap-2">
                <button className="font-medium shadow-[0_0_24px_rgba(255,255,255,0.06)] rounded-full bg-neutral-200 text-neutral-900 text-sm leading-5 px-4 py-2">
                  All
                </button>
                <button className="transition rounded-full text-[#a1a1a1] text-sm leading-5 px-4 py-2">
                  Football
                </button>
                <button className="transition rounded-full text-[#a1a1a1] text-sm leading-5 px-4 py-2">
                  Social
                </button>
                <button className="transition rounded-full text-[#a1a1a1] text-sm leading-5 px-4 py-2">
                  Bookings
                </button>
              </div>
              <div className="flex mt-6 flex-col gap-3">
                <div className="transition shadow-[0_18px_50px_rgba(0,0,0,0.35)] rounded-3xl bg-white/3 border-white/10 border-1 border-solid p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative size-11 shrink-0 rounded-2xl bg-neutral-900 text-neutral-50 flex justify-center items-center">
                      <span className="font-semibold text-sm leading-5">
                        AM
                      </span>
                      <span className="size-2.5 shadow-[0_0_12px_rgba(255,255,255,0.18)] rounded-full bg-neutral-200 absolute -right-0.5 -top-0.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-neutral-50 text-sm leading-6">
                            <span className="font-medium">Arjun</span>liked your
                            football post
                          </p>
                          <p className="text-[#a1a1a1] text-xs leading-4 mt-1">
                            2 minutes ago
                          </p>
                        </div>
                        <img
                          src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                          alt="Post thumbnail"
                          className="object-cover rounded-2xl border-white/10 border-1 border-solid w-14 h-14"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="transition shadow-[0_18px_50px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative size-11 shrink-0 rounded-2xl bg-neutral-900 text-neutral-50 flex justify-center items-center">
                      <span className="font-semibold text-sm leading-5">
                        SP
                      </span>
                      <span className="size-2.5 shadow-[0_0_12px_rgba(255,255,255,0.18)] rounded-full bg-neutral-200 absolute -right-0.5 -top-0.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-neutral-50 text-sm leading-6">
                            <span className="font-medium">Sana</span>commented
                            on your post
                          </p>
                          <p className="text-[#a1a1a1] text-xs leading-4 mt-1">
                            8 minutes ago
                          </p>
                        </div>
                        <img
                          src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                          alt="Comment thumbnail"
                          className="object-cover rounded-2xl border-white/10 border-1 border-solid w-14 h-14"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="transition shadow-[0_18px_50px_rgba(0,0,0,0.35)] rounded-3xl bg-white/3 border-white/10 border-1 border-solid p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative size-11 shrink-0 rounded-2xl bg-neutral-900 text-neutral-50 flex justify-center items-center">
                      <Users className="size-5 text-[#a1a1a1]" />
                      <span className="size-2.5 shadow-[0_0_12px_rgba(255,255,255,0.18)] rounded-full bg-neutral-200 absolute -right-0.5 -top-0.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-neutral-50 text-sm leading-6">
                            You were invited to a 7-a-side match
                          </p>
                          <p className="text-[#a1a1a1] text-xs leading-4 mt-1">
                            12 minutes ago
                          </p>
                        </div>
                        <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex justify-center items-center w-14 h-14">
                          <Users className="size-5 text-neutral-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="transition shadow-[0_18px_50px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative size-11 shrink-0 rounded-2xl bg-neutral-900 text-neutral-50 flex justify-center items-center">
                      <Clock3 className="size-5 text-[#a1a1a1]" />
                      <span className="size-2.5 shadow-[0_0_12px_rgba(255,255,255,0.18)] rounded-full bg-neutral-200 absolute -right-0.5 -top-0.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-neutral-50 text-sm leading-6">
                            Your match starts in 30 minutes
                          </p>
                          <p className="text-[#a1a1a1] text-xs leading-4 mt-1">
                            18 minutes ago
                          </p>
                        </div>
                        <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex justify-center items-center w-14 h-14">
                          <TimerReset className="size-5 text-neutral-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="transition shadow-[0_18px_50px_rgba(0,0,0,0.35)] rounded-3xl bg-white/3 border-white/10 border-1 border-solid p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative size-11 shrink-0 rounded-2xl bg-neutral-900 text-neutral-50 flex justify-center items-center">
                      <MapPinned className="size-5 text-[#a1a1a1]" />
                      <span className="size-2.5 shadow-[0_0_12px_rgba(255,255,255,0.18)] rounded-full bg-neutral-200 absolute -right-0.5 -top-0.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-neutral-50 text-sm leading-6">
                            Your turf booking at Arena 7 has been confirmed
                          </p>
                          <p className="text-[#a1a1a1] text-xs leading-4 mt-1">
                            25 minutes ago
                          </p>
                        </div>
                        <img
                          src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                          alt="Turf thumbnail"
                          className="object-cover rounded-2xl border-white/10 border-1 border-solid w-14 h-14"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="transition shadow-[0_18px_50px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative size-11 shrink-0 rounded-2xl bg-neutral-900 text-neutral-50 flex justify-center items-center">
                      <RotateCcw className="size-5 text-[#a1a1a1]" />
                      <span className="size-2.5 shadow-[0_0_12px_rgba(255,255,255,0.18)] rounded-full bg-neutral-200 absolute -right-0.5 -top-0.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-neutral-50 text-sm leading-6">
                            Your booking was cancelled and refunded
                          </p>
                          <p className="text-[#a1a1a1] text-xs leading-4 mt-1">
                            1 hour ago
                          </p>
                        </div>
                        <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex justify-center items-center w-14 h-14">
                          <Banknote className="size-5 text-neutral-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="transition shadow-[0_18px_50px_rgba(0,0,0,0.35)] rounded-3xl bg-white/3 border-white/10 border-1 border-solid p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative size-11 shrink-0 rounded-2xl bg-neutral-900 text-neutral-50 flex justify-center items-center">
                      <UserPlus className="size-5 text-[#a1a1a1]" />
                      <span className="size-2.5 shadow-[0_0_12px_rgba(255,255,255,0.18)] rounded-full bg-neutral-200 absolute -right-0.5 -top-0.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-neutral-50 text-sm leading-6">
                            Deepak joined your match
                          </p>
                          <p className="text-[#a1a1a1] text-xs leading-4 mt-1">
                            2 hours ago
                          </p>
                        </div>
                        <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex justify-center items-center w-14 h-14">
                          <Users className="size-5 text-neutral-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="transition shadow-[0_18px_50px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative size-11 shrink-0 rounded-2xl bg-neutral-900 text-neutral-50 flex justify-center items-center">
                      <Reply className="size-5 text-[#a1a1a1]" />
                      <span className="size-2.5 shadow-[0_0_12px_rgba(255,255,255,0.18)] rounded-full bg-neutral-200 absolute -right-0.5 -top-0.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-neutral-50 text-sm leading-6">
                            Someone replied to your comment
                          </p>
                          <p className="text-[#a1a1a1] text-xs leading-4 mt-1">
                            3 hours ago
                          </p>
                        </div>
                        <img
                          src="https://images.unsplash.com/photo-1511886929837-354d827aae26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                          alt="Reply thumbnail"
                          className="object-cover rounded-2xl border-white/10 border-1 border-solid w-14 h-14"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="transition shadow-[0_18px_50px_rgba(0,0,0,0.35)] rounded-3xl bg-white/3 border-white/10 border-1 border-solid p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative size-11 shrink-0 rounded-2xl bg-neutral-900 text-neutral-50 flex justify-center items-center">
                      <Users2 className="size-5 text-[#a1a1a1]" />
                      <span className="size-2.5 shadow-[0_0_12px_rgba(255,255,255,0.18)] rounded-full bg-neutral-200 absolute -right-0.5 -top-0.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-neutral-50 text-sm leading-6">
                            Turf Kings group has new activity
                          </p>
                          <p className="text-[#a1a1a1] text-xs leading-4 mt-1">
                            5 hours ago
                          </p>
                        </div>
                        <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex justify-center items-center w-14 h-14">
                          <Users2 className="size-5 text-neutral-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center rounded-3xl bg-neutral-900/40 border-white/10 border-1 border-dashed mt-4 p-10">
                  <div className="size-14 rounded-full bg-neutral-950/80 text-[#a1a1a1] border-white/10 border-1 border-solid flex mx-auto justify-center items-center">
                    <BellOff className="size-6" />
                  </div>
                  <h2 className="font-semibold text-lg leading-7 mt-4">
                    You’re all caught up
                  </h2>
                  <p className="text-[#a1a1a1] text-sm leading-5 mt-2">
                    New football updates, bookings, and match alerts will appear
                    here.
                  </p>
                </div>
                <div className="rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid mt-2 p-8">
                  <div className="text-center flex flex-col justify-center items-center gap-4">
                    <div className="relative shadow-[0_0_40px_rgba(255,255,255,0.04)] rounded-full bg-neutral-950/80 border-white/10 border-1 border-solid flex justify-center items-center w-16 h-16">
                      <Bell className="size-6 text-[#a1a1a1]" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg leading-7">
                        Getting you onto the pitch...
                      </div>
                      <div className="text-[#a1a1a1] text-sm leading-5 mt-1">
                        Warming up your session
                      </div>
                    </div>
                    <div className="max-w-[360px] flex items-center gap-2 w-full">
                      <div className="rounded-full bg-neutral-200/80 flex-1 h-1.5" />
                      <div className="rounded-full bg-neutral-800 w-8 h-1.5" />
                      <div className="rounded-full bg-neutral-800/70 w-4 h-1.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
