import { useEffect } from "react";
import {
  ArrowDown,
  Bell,
  CheckCheck,
  FileText,
  Home,
  Image,
  Info,
  LogOut,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  Radio,
  Search,
  Send,
  Settings,
  Smile,
  User,
  Users,
  Users2,
} from "lucide-react";

export default function App() {
  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-[956px] bg-neutral-950 text-neutral-50 flex w-full">
          <aside className="shrink-0 bg-neutral-900/70 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex px-4 py-6 flex-col w-62 h-239">
            <div className="flex mb-6 px-2 items-center gap-3">
              <div className="size-11 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_0_24px_rgba(255,255,255,0.04)] rounded-2xl bg-neutral-950/80 text-neutral-200 border-white/10 border-1 border-solid flex justify-center items-center">
                <MessageCircle className="size-5" />
              </div>
              <div>
                <div className="leading-none font-semibold text-lg leading-7">
                  FootballHub
                </div>
                <div className="text-[#a1a1a1] text-xs leading-4 mt-1">
                  Messages
                </div>
              </div>
            </div>
            <nav className="flex flex-col items-start flex-1 gap-1">
              <button className="rounded-xl text-[#a1a1a1] text-sm leading-5 flex p-3 items-center gap-3 w-full">
                <Home className="size-4" />
                <span>Home</span>
              </button>
              <button className="rounded-xl text-[#a1a1a1] text-sm leading-5 flex p-3 items-center gap-3 w-full">
                <MapPin className="size-4" />
                <span>Find Turfs</span>
              </button>
              <button className="rounded-xl text-[#a1a1a1] text-sm leading-5 flex p-3 items-center gap-3 w-full">
                <Radio className="size-4" />
                <span>Live Turfs</span>
              </button>
              <button className="rounded-xl text-[#a1a1a1] text-sm leading-5 flex p-3 items-center gap-3 w-full">
                <Users className="size-4" />
                <span>Matches</span>
              </button>
              <button className="shadow-[0_0_24px_rgba(255,255,255,0.04)] rounded-xl bg-neutral-800/40 text-neutral-50 text-sm leading-5 border-neutral-200 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex p-3 items-center gap-3 w-full">
                <MessageCircle className="size-4" />
                <span>Messages</span>
              </button>
              <button className="rounded-xl text-[#a1a1a1] text-sm leading-5 flex p-3 items-center gap-3 w-full">
                <Users2 className="size-4" />
                <span>Groups</span>
              </button>
              <button className="rounded-xl text-[#a1a1a1] text-sm leading-5 flex p-3 items-center gap-3 w-full">
                <Bell className="size-4" />
                <span>Notifications</span>
              </button>
              <button className="rounded-xl text-[#a1a1a1] text-sm leading-5 flex p-3 items-center gap-3 w-full">
                <Plus className="size-4" />
                <span>Create Post</span>
              </button>
              <button className="rounded-xl text-[#a1a1a1] text-sm leading-5 flex p-3 items-center gap-3 w-full">
                <User className="size-4" />
                <span>Profile</span>
              </button>
              <button className="rounded-xl text-[#a1a1a1] text-sm leading-5 flex p-3 items-center gap-3 w-full">
                <Settings className="size-4" />
                <span>Settings</span>
              </button>
              <button className="rounded-xl text-[#a1a1a1] text-sm leading-5 flex mt-auto p-3 items-center gap-3 w-full">
                <LogOut className="size-4" />
                <span>Logout</span>
              </button>
            </nav>
          </aside>
          <aside className="shrink-0 bg-neutral-950 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex px-5 py-6 flex-col w-80 h-239">
            <div className="mb-5">
              <div className="relative">
                <Search className="pointer-events-none top-1/2 size-4 -translate-y-1/2 text-[#a1a1a1] absolute left-4" />
                <input
                  value=""
                  placeholder="Search conversations"
                  className="outline-none rounded-2xl bg-neutral-900 text-neutral-50 text-sm leading-5 border-white/15 border-1 border-solid px-11 w-full h-12"
                />
              </div>
            </div>
            <div className="rounded-full bg-neutral-900 border-white/10 border-1 border-solid flex mb-5 p-1 items-center gap-2">
              <button className="font-medium shadow-[0_0_18px_rgba(255,255,255,0.08)] rounded-full bg-neutral-200 text-neutral-900 text-xs leading-4 px-4 py-2">
                All
              </button>
              <button className="font-medium rounded-full text-[#a1a1a1] text-xs leading-4 px-4 py-2">
                Direct
              </button>
              <button className="font-medium rounded-full text-[#a1a1a1] text-xs leading-4 px-4 py-2">
                Groups
              </button>
            </div>
            <div className="space-y-3 flex-1 overflow-hidden">
              <div className="shadow-[0_0_0_1px_rgba(255,255,255,0.02)] rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="size-12 font-semibold rounded-full bg-neutral-800 text-sm leading-5 flex justify-center items-center">
                      AR
                    </div>
                    <span className="size-3 shadow-[0_0_12px_rgba(16,185,129,0.7)] rounded-full bg-emerald-500 border-neutral-900 border-2 border-solid absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center gap-3">
                      <div className="truncate font-medium">Arjun Mehta</div>
                      <div className="text-[#a1a1a1] text-xs leading-4">2m</div>
                    </div>
                    <div className="truncate text-[#a1a1a1] text-sm leading-5 mt-1">
                      Can you join the 7v7 tonight?
                    </div>
                  </div>
                  <div className="font-semibold rounded-full bg-neutral-200 text-neutral-900 text-[11px] px-2.5 py-1">
                    3
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="size-12 font-semibold rounded-full bg-neutral-800 text-sm leading-5 flex justify-center items-center">
                      TG
                    </div>
                    <span className="size-3 shadow-[0_0_12px_rgba(16,185,129,0.7)] rounded-full bg-emerald-500 border-neutral-900 border-2 border-solid absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center gap-3">
                      <div className="truncate font-medium">Turf Kings</div>
                      <div className="text-[#a1a1a1] text-xs leading-4">
                        12m
                      </div>
                    </div>
                    <div className="truncate text-[#a1a1a1] text-sm leading-5 mt-1">
                      Rohan: I’ve shared the booking link.
                    </div>
                  </div>
                  <div className="font-semibold rounded-full bg-neutral-200 text-neutral-900 text-[11px] px-2.5 py-1">
                    8
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="size-12 font-semibold rounded-full bg-neutral-800 text-sm leading-5 flex justify-center items-center">
                      SP
                    </div>
                    <span className="size-3 rounded-full bg-zinc-500 border-neutral-900 border-2 border-solid absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center gap-3">
                      <div className="truncate font-medium">Sana Patel</div>
                      <div className="text-[#a1a1a1] text-xs leading-4">1h</div>
                    </div>
                    <div className="truncate text-[#a1a1a1] text-sm leading-5 mt-1">
                      Shared a turf location pin.
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="size-12 font-semibold rounded-full bg-neutral-800 text-sm leading-5 flex justify-center items-center">
                      FM
                    </div>
                    <span className="size-3 shadow-[0_0_12px_rgba(16,185,129,0.7)] rounded-full bg-emerald-500 border-neutral-900 border-2 border-solid absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center gap-3">
                      <div className="truncate font-medium">
                        Friday Match Crew
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4">
                        Yesterday
                      </div>
                    </div>
                    <div className="truncate text-[#a1a1a1] text-sm leading-5 mt-1">
                      Need one more defender for the lineup.
                    </div>
                  </div>
                  <div className="font-semibold rounded-full bg-neutral-200 text-neutral-900 text-[11px] px-2.5 py-1">
                    1
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <main className="bg-neutral-950 flex p-6 flex-col flex-1 h-239">
            <div className="rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid flex px-5 py-4 justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="size-12 font-semibold rounded-full bg-neutral-800 text-sm leading-5 flex justify-center items-center">
                    AR
                  </div>
                  <span className="size-3 shadow-[0_0_12px_rgba(16,185,129,0.7)] rounded-full bg-emerald-500 border-neutral-900 border-2 border-solid absolute -right-0.5 -bottom-0.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg leading-7">
                      Arjun Mehta
                    </h2>
                    <span className="font-medium rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] border-emerald-500/30 border-1 border-solid px-2 py-0.5">
                      Online
                    </span>
                  </div>
                  <div className="text-[#a1a1a1] text-sm leading-5 mt-1">
                    Last seen just now · Ready for tonight’s turf booking
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="size-10 rounded-full bg-neutral-950 text-[#a1a1a1] border-white/10 border-1 border-solid flex justify-center items-center">
                  <Phone className="size-4" />
                </button>
                <button className="size-10 rounded-full bg-neutral-950 text-[#a1a1a1] border-white/10 border-1 border-solid flex justify-center items-center">
                  <Info className="size-4" />
                </button>
                <button className="size-10 rounded-full bg-neutral-950 text-[#a1a1a1] border-white/10 border-1 border-solid flex justify-center items-center">
                  <MoreHorizontal className="size-4" />
                </button>
              </div>
            </div>
            <div className="rounded-3xl bg-neutral-900/60 border-white/10 border-1 border-solid mt-5 p-5 flex-1 overflow-hidden">
              <div className="flex flex-col justify-between gap-4 h-full">
                <div className="space-y-4 overflow-hidden">
                  <div className="flex justify-start">
                    <div className="max-w-[72%] rounded-tl-3xl rounded-tr-3xl rounded-bl-md rounded-br-3xl bg-neutral-950 border-white/10 border-1 border-solid px-4 py-3">
                      <div className="text-[#a1a1a1] text-sm leading-5">
                        Arjun replied to your message
                      </div>
                      <div className="rounded-2xl bg-neutral-900 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid mt-2 px-3 py-2">
                        We can book Arena 7 if the squad is ready.
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4 mt-2">
                        09:12
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[72%] shadow-[0_0_24px_rgba(255,255,255,0.06)] rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl rounded-br-md bg-neutral-200 text-neutral-900 border-neutral-200/30 border-1 border-solid px-4 py-3">
                      <div className="text-sm leading-5">
                        Perfect — I’ll send the turf link now.
                      </div>
                      <div className="opacity-80 text-xs leading-4 flex mt-2 justify-between items-center gap-3">
                        <span>09:13</span>
                        <span className="flex items-center gap-1">
                          <CheckCheck className="size-3.5" />
                          Seen
                        </span>
                      </div>
                      <div className="text-xs leading-4 flex mt-2 items-center gap-2">
                        <button className="rounded-full bg-neutral-950/15 px-2 py-1">
                          👍 2
                        </button>
                        <button className="rounded-full bg-neutral-950/15 px-2 py-1">
                          🔥 1
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[72%] rounded-tl-3xl rounded-tr-3xl rounded-bl-md rounded-br-3xl bg-neutral-950 border-white/10 border-1 border-solid px-4 py-3">
                      <div className="text-[#a1a1a1] text-xs leading-4">
                        Replying to: “I’ll send the turf link now.”
                      </div>
                      <div className="text-neutral-50 text-sm leading-5 mt-2">
                        Invite me if you need one more winger.
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4 mt-2">
                        09:14
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[72%] rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl rounded-br-md bg-neutral-900 border-white/10 border-1 border-solid px-4 py-3">
                      <div className="text-neutral-50 text-sm leading-5">
                        Shared the booking preview and turf location.
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4 flex mt-2 items-center gap-2">
                        <button className="rounded-full border-white/10 border-1 border-solid px-2 py-1">
                          Edit
                        </button>
                        <button className="rounded-full border-white/10 border-1 border-solid px-2 py-1">
                          Delete
                        </button>
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4 mt-2">
                        09:15
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="rounded-full bg-neutral-950 text-[#a1a1a1] text-sm leading-5 border-white/10 border-1 border-solid flex px-4 py-3 items-center gap-2">
                      <span className="flex gap-1">
                        <span className="size-2 animate-pulse rounded-full bg-[#a1a1a1]/70" />
                        <span className="size-2 animate-pulse [animation-delay:150ms] rounded-full bg-[#a1a1a1]/70" />
                        <span className="size-2 animate-pulse [animation-delay:300ms] rounded-full bg-[#a1a1a1]/70" />
                      </span>
                      <span>Arjun is typing</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl bg-neutral-950 border-white/10 border-1 border-solid flex p-4 justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button className="size-10 rounded-full bg-neutral-900 text-[#a1a1a1] border-white/10 border-1 border-solid flex justify-center items-center">
                      <Smile className="size-4" />
                    </button>
                    <button className="size-10 rounded-full bg-neutral-900 text-[#a1a1a1] border-white/10 border-1 border-solid flex justify-center items-center">
                      <Image className="size-4" />
                    </button>
                    <button className="size-10 rounded-full bg-neutral-900 text-[#a1a1a1] border-white/10 border-1 border-solid flex justify-center items-center">
                      <FileText className="size-4" />
                    </button>
                  </div>
                  <div className="px-2 flex-1">
                    <input
                      value=""
                      placeholder="Write a message..."
                      className="outline-none rounded-2xl bg-neutral-900 text-neutral-50 text-sm leading-5 border-white/15 border-1 border-solid px-4 w-full h-12"
                    />
                  </div>
                  <button className="font-medium shadow-[0_0_24px_rgba(255,255,255,0.08)] rounded-2xl bg-neutral-200 text-neutral-900 text-sm leading-5 flex px-5 items-center gap-2 h-12">
                    <Send className="size-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
            <button className="size-12 shadow-[0_0_24px_rgba(0,0,0,0.35)] rounded-full bg-neutral-900 text-[#a1a1a1] border-white/10 border-1 border-solid flex absolute right-8 bottom-8 justify-center items-center">
              <ArrowDown className="size-4" />
            </button>
          </main>
        </div>
      </div>
    </div>
  );
}
