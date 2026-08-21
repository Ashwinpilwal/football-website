import { useEffect } from "react";
import {
  BadgeCheck,
  Balloon,
  Bell,
  Bookmark,
  Ellipsis,
  Heart,
  Home,
  Image,
  LogOut,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  PenLine,
  Play,
  Plus,
  Radio,
  Settings,
  Share2,
  Sparkles,
  Trophy,
  User,
  Users,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function App() {
  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-[956px] bg-neutral-950 text-neutral-50 flex w-full">
          <aside className="shrink-0 bg-neutral-900/40 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex px-4 py-6 flex-col w-62.5">
            <div className="flex mb-8 px-2 items-center gap-3">
              <div className="size-11 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_0_24px_rgba(255,255,255,0.04)] rounded-2xl bg-neutral-950/60 text-neutral-200 border-white/10 border-1 border-solid flex justify-center items-center">
                <Balloon className="size-5 text-neutral-200" />
              </div>
              <div>
                <div className="font-semibold text-lg leading-7 tracking-tight">
                  FootballHub
                </div>
                <div className="text-[#a1a1a1] text-xs leading-4">
                  Premium football social
                </div>
              </div>
            </div>
            <nav className="flex flex-col justify-start items-start flex-1 gap-1">
              <button className="font-medium text-left shadow-[0_0_24px_rgba(255,255,255,0.03)] rounded-xl bg-neutral-800/60 text-neutral-50 text-sm leading-5 border-neutral-200 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex p-3 items-center gap-3 w-full">
                <Home className="size-4 text-neutral-200" />
                Home
              </button>
              <button className="border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex p-3 items-center gap-3 w-full">
                <MapPin className="size-4" />
                Find Turfs
              </button>
              <button className="border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex p-3 items-center gap-3 w-full">
                <Radio className="size-4" />
                Live Turfs
              </button>
              <button className="border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex p-3 items-center gap-3 w-full">
                <Users className="size-4" />
                Matches
              </button>
              <button className="border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex p-3 items-center gap-3 w-full">
                <MessageCircle className="size-4" />
                Messages
              </button>
              <button className="border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex p-3 items-center gap-3 w-full">
                <Users2 className="size-4" />
                Groups
              </button>
              <button className="border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex p-3 items-center gap-3 w-full">
                <Bell className="size-4" />
                Notifications
              </button>
              <button className="border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex p-3 items-center gap-3 w-full">
                <Plus className="size-4" />
                Create Post
              </button>
              <button className="border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex p-3 items-center gap-3 w-full">
                <User className="size-4" />
                Profile
              </button>
              <button className="border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex p-3 items-center gap-3 w-full">
                <Settings className="size-4" />
                Settings
              </button>
              <button className="border-transparent text-left rounded-xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex mt-auto p-3 items-center gap-3 w-full">
                <LogOut className="size-4" />
                Logout
              </button>
            </nav>
          </aside>
          <main className="flex p-6 flex-1 gap-6">
            <section className="min-w-0 flex flex-col flex-1 gap-4">
              <div className="rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex p-4 justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="size-11 font-semibold rounded-full bg-neutral-800 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid flex justify-center items-center">
                    AM
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm leading-5">
                      What's happening in football?
                    </div>
                    <div className="text-[#a1a1a1] text-xs leading-4">
                      Share a match reaction, turf review, or hot take
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    className="rounded-full px-4 gap-2"
                  >
                    <Image className="size-4" />
                    Photo / Video
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-full text-[#a1a1a1] px-4 gap-2"
                  >
                    <PenLine className="size-4" />
                    Text update
                  </Button>
                  <Button className="rounded-full bg-neutral-200 text-neutral-900 px-5 gap-2">
                    <Plus className="size-4" />
                    Create Post
                  </Button>
                </div>
              </div>
              <div className="rounded-full bg-neutral-900 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid flex px-4 py-2 justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="size-2 shadow-[0_0_12px_oklch(0.922_0_0/.7)] rounded-full bg-neutral-200" />
                  New football posts from your network
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3 text-neutral-200" />
                  Live feed
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Card className="shadow-[0_0_0_1px_rgba(255,255,255,0.02)] rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-5 gap-4">
                  <CardHeader className="p-0 gap-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3">
                        <div className="size-11 font-semibold rounded-full bg-neutral-800 text-sm leading-5 flex justify-center items-center">
                          AR
                        </div>
                        <div>
                          <div className="font-semibold text-sm leading-5 flex items-center gap-2">
                            Arjun Mehta
                            <BadgeCheck className="size-4 text-neutral-200" />
                          </div>
                          <div className="text-[#a1a1a1] text-xs leading-4">
                            @arjun_striker • 8 min ago • Match Reaction
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full text-[#a1a1a1]"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 gap-3">
                    <p className="text-neutral-50 text-sm leading-6">
                      That second half was absolute madness. What a comeback. 🔥
                    </p>
                    <div className="rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid p-3">
                      <div className="text-[#a1a1a1] text-xs leading-4 flex justify-between items-center">
                        <span>Threaded replies</span>
                        <span>12 replies</span>
                      </div>
                      <div className="rounded-xl bg-neutral-800/40 flex mt-3 p-3 items-center gap-3">
                        <div className="size-8 rounded-full bg-neutral-950 text-xs leading-4 flex justify-center items-center">
                          SK
                        </div>
                        <div className="text-[#a1a1a1] text-sm leading-5">
                          "Best comeback of the season."
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex p-0 justify-between items-center gap-3">
                    <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-4">
                      <button className="flex items-center gap-2">
                        <Heart className="size-4" />
                        42
                      </button>
                      <button className="flex items-center gap-2">
                        <MessageCircle className="size-4" />
                        12
                      </button>
                      <button className="flex items-center gap-2">
                        <Share2 className="size-4" />5
                      </button>
                      <button className="flex items-center gap-2">
                        <Bookmark className="size-4" />
                        Save
                      </button>
                    </div>
                    <div className="text-[#a1a1a1] text-xs leading-4 flex items-center gap-3">
                      <span>1.2k views</span>
                      <Ellipsis className="size-4" />
                    </div>
                  </CardFooter>
                </Card>
                <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-5 gap-4">
                  <CardHeader className="p-0 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-11 font-semibold rounded-full bg-neutral-800 text-sm leading-5 flex justify-center items-center">
                        NH
                      </div>
                      <div>
                        <div className="font-semibold text-sm leading-5 flex items-center gap-2">
                          Nikhil Rao
                          <BadgeCheck className="size-4 text-neutral-200" />
                        </div>
                        <div className="text-[#a1a1a1] text-xs leading-4">
                          @nikhilplays • 18 min ago • Turf Experience
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 gap-3">
                    <div className="rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid overflow-hidden">
                      <div className="relative aspect-[16/9] w-full">
                        <img
                          src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                          alt="Football turf"
                          className="object-cover w-full h-full"
                          data-photoid="photo-1517927033932-b3d18e61fb3a"
                          data-authorname="Markus Spiske"
                          data-authorurl="https://unsplash.com/@markusspiske"
                          data-blurhash="L6PZ%2?~q%2?~q%2?~q%2?~q%2?~q"
                        />
                        <div className="backdrop-blur-sm font-medium rounded-full bg-neutral-950/80 text-neutral-50 text-xs leading-4 absolute left-3 top-3 px-3 py-1">
                          Photo post
                        </div>
                      </div>
                    </div>
                    <p className="text-[#a1a1a1] text-sm leading-5">
                      Arena 7 was immaculate tonight — fast surface, bright
                      floodlights, and zero dead spots. Booked again for next
                      week.
                    </p>
                  </CardContent>
                  <CardFooter className="flex p-0 justify-between items-center gap-3">
                    <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-4">
                      <button className="flex items-center gap-2">
                        <Heart className="size-4" />
                        128
                      </button>
                      <button className="flex items-center gap-2">
                        <MessageCircle className="size-4" />
                        24
                      </button>
                      <button className="flex items-center gap-2">
                        <Share2 className="size-4" />
                        11
                      </button>
                      <button className="flex items-center gap-2">
                        <Bookmark className="size-4" />
                        Save
                      </button>
                    </div>
                    <div className="text-[#a1a1a1] text-xs leading-4 flex items-center gap-3">
                      <span>3.4k views</span>
                      <Ellipsis className="size-4" />
                    </div>
                  </CardFooter>
                </Card>
                <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-5 gap-4">
                  <CardHeader className="p-0 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-11 font-semibold rounded-full bg-neutral-800 text-sm leading-5 flex justify-center items-center">
                        VT
                      </div>
                      <div>
                        <div className="font-semibold text-sm leading-5 flex items-center gap-2">
                          Vikram Team
                          <BadgeCheck className="size-4 text-neutral-200" />
                        </div>
                        <div className="text-[#a1a1a1] text-xs leading-4">
                          @vikramteam • 31 min ago • Video
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 gap-3">
                    <div className="rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid overflow-hidden">
                      <div className="relative aspect-[16/9] w-full">
                        <img
                          src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                          alt="Football video thumbnail"
                          className="object-cover w-full h-full"
                          data-photoid="photo-1579952363873-27f3bade9f55"
                          data-authorname="Mick Haupt"
                          data-authorurl="https://unsplash.com/@rocinante_11"
                          data-blurhash="L9B4%2?~q%2?~q%2?~q%2?~q%2?~q"
                        />
                        <div className="bg-gradient-to-t from-background/70 via-transparent to-transparent absolute inset-0" />
                        <div className="font-semibold rounded-full bg-neutral-200 text-neutral-900 text-xs leading-4 absolute left-3 top-3 px-3 py-1">
                          LIVE REPLAY
                        </div>
                        <div className="flex absolute inset-0 justify-center items-center">
                          <div className="size-14 shadow-[0_0_24px_rgba(255,255,255,0.08)] rounded-full bg-neutral-950/70 text-neutral-50 border-white/20 border-1 border-solid flex justify-center items-center">
                            <Play className="size-6 fill-current" />
                          </div>
                        </div>
                        <div className="rounded-full bg-neutral-950/80 text-neutral-50 text-xs leading-4 absolute right-3 bottom-3 px-2 py-1">
                          2/5
                        </div>
                      </div>
                    </div>
                    <p className="text-[#a1a1a1] text-sm leading-5">
                      Training clips from last night — the pressing patterns are
                      finally clicking.
                    </p>
                  </CardContent>
                  <CardFooter className="flex p-0 justify-between items-center gap-3">
                    <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-4">
                      <button className="flex items-center gap-2">
                        <Heart className="size-4" />
                        76
                      </button>
                      <button className="flex items-center gap-2">
                        <MessageCircle className="size-4" />9
                      </button>
                      <button className="flex items-center gap-2">
                        <Share2 className="size-4" />
                        14
                      </button>
                      <button className="flex items-center gap-2">
                        <Bookmark className="size-4" />
                        Save
                      </button>
                    </div>
                    <div className="text-[#a1a1a1] text-xs leading-4 flex items-center gap-3">
                      <span>2.1k views</span>
                      <Ellipsis className="size-4" />
                    </div>
                  </CardFooter>
                </Card>
                <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-5 gap-4">
                  <CardHeader className="p-0 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-11 font-semibold rounded-full bg-neutral-800 text-sm leading-5 flex justify-center items-center">
                        DS
                      </div>
                      <div>
                        <div className="font-semibold text-sm leading-5 flex items-center gap-2">
                          Deepak Singh
                          <BadgeCheck className="size-4 text-neutral-200" />
                        </div>
                        <div className="text-[#a1a1a1] text-xs leading-4">
                          @deepak90 • 44 min ago • Football Discussion
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 gap-3">
                    <div className="rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid p-4">
                      <div className="text-neutral-50 text-sm leading-6">
                        "Should turf bookings include automatic rain-delay
                        protection?"
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4 mt-2">
                        Poll-style discussion • 4 replies • 18 likes
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex p-0 justify-between items-center gap-3">
                    <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-4">
                      <button className="flex items-center gap-2">
                        <Heart className="size-4" />
                        18
                      </button>
                      <button className="flex items-center gap-2">
                        <MessageCircle className="size-4" />4
                      </button>
                      <button className="flex items-center gap-2">
                        <Share2 className="size-4" />2
                      </button>
                      <button className="flex items-center gap-2">
                        <Bookmark className="size-4" />
                        Save
                      </button>
                    </div>
                    <div className="text-[#a1a1a1] text-xs leading-4 flex items-center gap-3">
                      <span>640 views</span>
                      <Ellipsis className="size-4" />
                    </div>
                  </CardFooter>
                </Card>
                <div className="text-center rounded-3xl bg-neutral-900/40 border-white/10 border-1 border-dashed p-8">
                  <div className="size-12 rounded-full bg-neutral-800 text-neutral-200 flex mx-auto mb-3 justify-center items-center">
                    <Balloon className="size-5" />
                  </div>
                  <div className="font-medium text-sm leading-5">
                    You're all caught up
                  </div>
                  <div className="text-[#a1a1a1] text-sm leading-5 mt-1">
                    More football stories will appear here as the feed
                    refreshes.
                  </div>
                </div>
                <div className="rounded-2xl bg-neutral-900 text-[#a1a1a1] text-sm leading-5 border-white/10 border-1 border-solid flex p-4 justify-center items-center gap-3">
                  <div className="size-8 rounded-full bg-neutral-950/60 border-white/10 border-1 border-solid flex justify-center items-center">
                    <Balloon className="size-4 animate-spin" />
                  </div>
                  Getting you more football posts...
                </div>
              </div>
            </section>
            <aside className="shrink-0 flex flex-col gap-4 w-80">
              <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-5 gap-4">
                <CardHeader className="p-0 gap-2">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-sm leading-5">
                      Nearby Turfs
                    </div>
                    <MapPin className="size-4 text-neutral-200" />
                  </div>
                </CardHeader>
                <CardContent className="p-0 gap-3">
                  <div className="rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid flex p-3 items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Turf"
                      className="object-cover rounded-xl w-14 h-14"
                      data-photoid="photo-1517927033932-b3d18e61fb3a"
                      data-authorname="Markus Spiske"
                      data-authorurl="https://unsplash.com/@markusspiske"
                      data-blurhash="L6PZ%2?~q%2?~q%2?~q%2?~q%2?~q"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm leading-5">
                        Arena 7
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4">
                        1.8 km • 4.8 rating
                      </div>
                      <div className="flex mt-1 justify-between items-center">
                        <span className="text-neutral-200 text-xs leading-4">
                          From ₹1,800
                        </span>
                        <Button size="sm" className="rounded-full px-3 h-7">
                          Book
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid flex p-3 items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Turf"
                      className="object-cover rounded-xl w-14 h-14"
                      data-photoid="photo-1508098682722-e99c43a406b2"
                      data-authorname="Mick Haupt"
                      data-authorurl="https://unsplash.com/@rocinante_11"
                      data-blurhash="L9B4%2?~q%2?~q%2?~q%2?~q%2?~q"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm leading-5">
                        Skyline Turf
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4">
                        2.4 km • 4.7 rating
                      </div>
                      <div className="flex mt-1 justify-between items-center">
                        <span className="text-neutral-200 text-xs leading-4">
                          From ₹2,100
                        </span>
                        <Button size="sm" className="rounded-full px-3 h-7">
                          Book
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-5 gap-4">
                <CardHeader className="p-0 gap-2">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-sm leading-5">
                      Live Turfs
                    </div>
                    <div className="rounded-full bg-neutral-200/10 text-neutral-200 text-xs leading-4 flex px-2 py-1 items-center gap-2">
                      <span className="size-2 animate-pulse rounded-full bg-neutral-200" />
                      LIVE
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 gap-3">
                  <div className="rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid p-3">
                    <div className="font-medium text-sm leading-5">
                      Metro Arena
                    </div>
                    <div className="text-[#a1a1a1] text-xs leading-4">
                      7 players • 1 match active
                    </div>
                    <div className="flex mt-2 justify-between items-center">
                      <span className="text-[#a1a1a1] text-xs leading-4">
                        Central Avenue
                      </span>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full px-3 h-7"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid p-3">
                    <div className="font-medium text-sm leading-5">
                      Northside Grounds
                    </div>
                    <div className="text-[#a1a1a1] text-xs leading-4">
                      11 players • 2 matches active
                    </div>
                    <div className="flex mt-2 justify-between items-center">
                      <span className="text-[#a1a1a1] text-xs leading-4">
                        North Ring Road
                      </span>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full px-3 h-7"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-5 gap-4">
                <CardHeader className="p-0 gap-2">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-sm leading-5">
                      Upcoming Matches
                    </div>
                    <Trophy className="size-4 text-neutral-200" />
                  </div>
                </CardHeader>
                <CardContent className="p-0 gap-3">
                  <div className="rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid p-3">
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="size-8 font-semibold rounded-full bg-neutral-800 text-xs leading-4 flex justify-center items-center">
                          AR
                        </div>
                        <div className="font-medium text-sm leading-5">
                          Arena FC
                        </div>
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4">
                        8:30 PM
                      </div>
                    </div>
                    <div className="text-[#a1a1a1] text-xs leading-4 flex mt-2 justify-between items-center">
                      <span>Premier Turf League</span>
                      <span>Scheduled</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid p-3">
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="size-8 font-semibold rounded-full bg-neutral-800 text-xs leading-4 flex justify-center items-center">
                          NS
                        </div>
                        <div className="font-medium text-sm leading-5">
                          North Stars
                        </div>
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4">
                        9:15 PM
                      </div>
                    </div>
                    <div className="text-[#a1a1a1] text-xs leading-4 flex mt-2 justify-between items-center">
                      <span>Weekend Cup</span>
                      <span>Kickoff soon</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}
