import { useEffect } from "react";
import {
  Balloon,
  Bell,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  Image,
  LogOut,
  MapPin,
  Maximize2,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Radio,
  Settings,
  Share2,
  Smile,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function App() {
  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-[956px] bg-neutral-950 text-neutral-50 flex w-full">
          <aside className="shrink-0 bg-neutral-900/70 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex px-4 py-6 flex-col w-65">
            <div className="flex mb-8 px-2 items-center gap-3">
              <div className="size-11 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] rounded-2xl bg-neutral-800/60 text-neutral-50 border-white/10 border-1 border-solid flex justify-center items-center">
                <Balloon className="size-5" />
              </div>
              <div>
                <div className="leading-none font-semibold text-lg leading-7">
                  FootballHub
                </div>
                <div className="text-[#a1a1a1] text-sm leading-5 mt-1">
                  Premium football social
                </div>
              </div>
            </div>
            <nav className="flex flex-col flex-1 gap-1">
              <Button
                variant="ghost"
                className="font-medium shadow-[0_0_0_1px_rgba(255,255,255,0.02)] rounded-2xl bg-neutral-800/60 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid px-4 py-3 justify-start gap-3"
              >
                <Home className="size-4" />
                Home
              </Button>
              <Button
                variant="ghost"
                className="font-medium rounded-2xl text-[#a1a1a1] text-sm leading-5 px-4 py-3 justify-start gap-3"
              >
                <MapPin className="size-4" />
                Find Turfs
              </Button>
              <Button
                variant="ghost"
                className="font-medium rounded-2xl text-[#a1a1a1] text-sm leading-5 px-4 py-3 justify-start gap-3"
              >
                <Radio className="size-4" />
                Live Turfs
              </Button>
              <Button
                variant="ghost"
                className="font-medium rounded-2xl text-[#a1a1a1] text-sm leading-5 px-4 py-3 justify-start gap-3"
              >
                <Users className="size-4" />
                Matches
              </Button>
              <Button
                variant="ghost"
                className="font-medium rounded-2xl text-[#a1a1a1] text-sm leading-5 px-4 py-3 justify-start gap-3"
              >
                <MessageCircle className="size-4" />
                Messages
              </Button>
              <Button
                variant="ghost"
                className="font-medium rounded-2xl text-[#a1a1a1] text-sm leading-5 px-4 py-3 justify-start gap-3"
              >
                <Users2 className="size-4" />
                Groups
              </Button>
              <Button
                variant="ghost"
                className="font-medium rounded-2xl text-[#a1a1a1] text-sm leading-5 px-4 py-3 justify-start gap-3"
              >
                <Bell className="size-4" />
                Notifications
              </Button>
              <Button
                variant="ghost"
                className="font-medium rounded-2xl text-[#a1a1a1] text-sm leading-5 px-4 py-3 justify-start gap-3"
              >
                <Plus className="size-4" />
                Create Post
              </Button>
              <Button
                variant="ghost"
                className="font-medium rounded-2xl text-[#a1a1a1] text-sm leading-5 px-4 py-3 justify-start gap-3"
              >
                <User className="size-4" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className="font-medium rounded-2xl text-[#a1a1a1] text-sm leading-5 px-4 py-3 justify-start gap-3"
              >
                <Settings className="size-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="font-medium rounded-2xl text-[#a1a1a1] text-sm leading-5 mt-auto px-4 py-3 justify-start gap-3"
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </nav>
          </aside>
          <main className="min-w-0 flex p-6 flex-1 gap-6">
            <section className="min-w-0 flex-[1.35] flex flex-col gap-4">
              <Card className="shadow-[0_20px_60px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-0 gap-0 overflow-hidden">
                <CardContent className="grid p-0 gap-0">
                  <div className="relative min-h-[860px] border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=1400&q=80"
                      alt="Football post media"
                      className="object-cover w-full h-full"
                    />
                    <div className="bg-gradient-to-t from-background/70 via-background/10 to-transparent absolute inset-0" />
                    <div className="backdrop-blur-sm rounded-full bg-neutral-950/70 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid flex absolute left-4 top-4 px-3 py-1.5 items-center gap-2">
                      <Image className="size-3.5" />
                      Photo
                    </div>
                    <div className="backdrop-blur-sm rounded-full bg-neutral-950/70 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid flex absolute right-4 top-4 px-3 py-1.5 items-center gap-2">
                      <Maximize2 className="size-3.5" />
                      Fullscreen
                    </div>
                    <div className="top-1/2 -translate-y-1/2 absolute left-4">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="size-11 shadow-lg rounded-full bg-neutral-950/80 text-neutral-50 border-white/10 border-1 border-solid"
                      >
                        <ChevronLeft className="size-5" />
                      </Button>
                    </div>
                    <div className="top-1/2 -translate-y-1/2 absolute right-4">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="size-11 shadow-lg rounded-full bg-neutral-950/80 text-neutral-50 border-white/10 border-1 border-solid"
                      >
                        <ChevronRight className="size-5" />
                      </Button>
                    </div>
                    <div className="backdrop-blur-sm font-medium rounded-full bg-neutral-950/80 text-neutral-50 text-xs leading-4 border-white/10 border-1 border-solid absolute right-4 bottom-4 px-3 py-1.5">
                      2/5
                    </div>
                  </div>
                  <div className="min-h-[860px] flex p-6 flex-col gap-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className="size-12 font-semibold rounded-full bg-neutral-800 text-neutral-50 text-sm leading-5 flex justify-center items-center">
                          AR
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h1 className="leading-none font-semibold text-lg leading-7">
                              Arjun Mehta
                            </h1>
                            <Badge
                              variant="secondary"
                              className="font-medium rounded-full text-[11px] px-2 py-0.5"
                            >
                              Match Reaction
                            </Badge>
                          </div>
                          <div className="text-[#a1a1a1] text-sm leading-5 mt-1">
                            @arjun_striker · 8 min ago
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-10 rounded-full text-[#a1a1a1]"
                      >
                        <MoreHorizontal className="size-5" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <p className="text-neutral-50 text-sm leading-6">
                        That second half was absolute madness. What a comeback.
                        <span className="text-neutral-200">🔥</span>
                      </p>
                      <div className="rounded-2xl bg-neutral-800/40 border-white/10 border-1 border-solid p-4">
                        <div className="text-[#a1a1a1] text-xs leading-4 flex justify-between items-center">
                          <span>Caption</span>
                          <Button
                            variant="ghost"
                            className="text-[#a1a1a1] text-xs leading-4 p-0 h-auto"
                          >
                            Show more
                          </Button>
                        </div>
                        <p className="text-[#a1a1a1] text-sm leading-6 mt-2">
                          A dramatic late turnaround at the turf. The squad
                          stayed compact, pressed high, and found the winner in
                          stoppage time.
                        </p>
                      </div>
                    </div>
                    <div className="border-y border-white/10 border-0 border-solid flex py-4 items-center gap-3">
                      <Button
                        variant="ghost"
                        className="rounded-full text-[#a1a1a1] px-3 gap-2"
                      >
                        <Heart className="size-4 fill-primary text-neutral-200" />
                        <span>42</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-full text-[#a1a1a1] px-3 gap-2"
                      >
                        <MessageCircle className="size-4" />
                        <span>12</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-full text-[#a1a1a1] px-3 gap-2"
                      >
                        <Share2 className="size-4" />
                        <span>5</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-full text-[#a1a1a1] px-3 gap-2"
                      >
                        <Bookmark className="size-4" />
                        <span>Save</span>
                      </Button>
                    </div>
                    <div className="min-h-0 rounded-3xl bg-neutral-950/40 border-white/10 border-1 border-solid flex p-4 flex-col flex-1 gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="font-semibold text-sm leading-5">
                            Comments
                          </h2>
                          <p className="text-[#a1a1a1] text-xs leading-4">
                            124 comments
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          className="text-[#a1a1a1] text-xs leading-4 px-0 h-auto"
                        >
                          Load more comments
                        </Button>
                      </div>
                      <div className="space-y-4 overflow-y-auto pr-1 flex-1">
                        <div className="flex gap-3">
                          <div className="size-9 shrink-0 font-semibold rounded-full bg-neutral-800 text-xs leading-4 flex justify-center items-center">
                            SK
                          </div>
                          <div className="min-w-0 rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid p-4 flex-1">
                            <div className="flex justify-between items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm leading-5">
                                  Sana Khan
                                </span>
                                <span className="text-[#a1a1a1] text-xs leading-4">
                                  · 2m
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                className="text-[#a1a1a1] text-xs leading-4 px-0 h-auto"
                              >
                                More
                              </Button>
                            </div>
                            <p className="text-[#a1a1a1] text-sm leading-6 mt-2">
                              That press in the final ten minutes changed
                              everything.
                            </p>
                            <div className="text-[#a1a1a1] text-xs leading-4 flex mt-3 items-center gap-4">
                              <Button
                                variant="ghost"
                                className="text-[#a1a1a1] text-xs leading-4 px-0 h-auto"
                              >
                                Like
                              </Button>
                              <Button
                                variant="ghost"
                                className="text-[#a1a1a1] text-xs leading-4 px-0 h-auto"
                              >
                                Reply
                              </Button>
                            </div>
                            <div className="border-white/10 border-t-0 border-r-0 border-b-0 border-l-1 border-solid mt-4 pl-4">
                              <div className="flex gap-3">
                                <div className="size-8 shrink-0 font-semibold rounded-full bg-neutral-800 text-[11px] flex justify-center items-center">
                                  AM
                                </div>
                                <div className="min-w-0 rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid p-3 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm leading-5">
                                      Arjun Mehta
                                    </span>
                                    <span className="text-[#a1a1a1] text-xs leading-4">
                                      · 1m
                                    </span>
                                  </div>
                                  <p className="text-[#a1a1a1] text-sm leading-6 mt-1">
                                    Exactly. The shape stayed compact and the
                                    counter was ruthless.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="size-9 shrink-0 font-semibold rounded-full bg-neutral-800 text-xs leading-4 flex justify-center items-center">
                            VT
                          </div>
                          <div className="min-w-0 rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid p-4 flex-1">
                            <div className="flex justify-between items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm leading-5">
                                  Vikram Team
                                </span>
                                <span className="text-[#a1a1a1] text-xs leading-4">
                                  · 12m
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                className="text-[#a1a1a1] text-xs leading-4 px-0 h-auto"
                              >
                                More
                              </Button>
                            </div>
                            <p className="text-[#a1a1a1] text-sm leading-6 mt-2">
                              Training clips from last night — the pressing
                              patterns are finally clicking.
                            </p>
                            <div className="text-[#a1a1a1] text-xs leading-4 flex mt-3 items-center gap-4">
                              <Button
                                variant="ghost"
                                className="text-[#a1a1a1] text-xs leading-4 px-0 h-auto"
                              >
                                Like
                              </Button>
                              <Button
                                variant="ghost"
                                className="text-[#a1a1a1] text-xs leading-4 px-0 h-auto"
                              >
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="sticky rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid bottom-0 p-3">
                        <div className="flex items-center gap-3">
                          <div className="size-10 font-semibold rounded-full bg-neutral-800 text-xs leading-4 flex justify-center items-center">
                            AM
                          </div>
                          <div className="rounded-full bg-neutral-950 text-[#a1a1a1] text-sm leading-5 border-white/10 border-1 border-solid flex px-4 py-3 items-center flex-1 gap-2">
                            <Smile className="size-4" />
                            Add a comment...
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-10 rounded-full text-[#a1a1a1]"
                          >
                            <Paperclip className="size-4" />
                          </Button>
                          <Button className="rounded-full bg-neutral-200 text-neutral-900 px-5">
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            <aside className="shrink-0 flex flex-col gap-4 w-80">
              <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-6 gap-4">
                <CardHeader className="p-0 gap-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-12 font-semibold rounded-full bg-neutral-800 text-sm leading-5 flex justify-center items-center">
                        AR
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base leading-6">
                            Arjun Mehta
                          </CardTitle>
                          <Badge className="rounded-full bg-neutral-800 text-neutral-50 text-[11px] px-2 py-0.5">
                            @arjun_striker
                          </Badge>
                        </div>
                        <CardDescription className="text-[#a1a1a1] text-sm leading-5 mt-1">
                          8 min ago · Football Discussion
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 rounded-full text-[#a1a1a1]"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 gap-3">
                  <div className="rounded-2xl bg-neutral-950/50 text-neutral-50 text-sm leading-6 border-white/10 border-1 border-solid p-4">
                    Should turf bookings include automatic rain-delay
                    protection?
                  </div>
                  <div className="text-[#a1a1a1] text-xs leading-4 flex items-center gap-3">
                    <span>Poll-style discussion</span>
                    <span>·</span>
                    <span>4 replies</span>
                    <span>·</span>
                    <span>18 likes</span>
                  </div>
                </CardContent>
                <CardFooter className="p-0 gap-2">
                  <div className="text-[#a1a1a1] text-xs leading-4 border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex pt-4 justify-between items-center w-full">
                    <span>Owner controls available</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="rounded-full bg-neutral-950/40 text-xs leading-4 border-white/10 border-0 border-solid px-3 py-2"
                      >
                        Edit Post
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full bg-neutral-950/40 text-[#ff6467] text-xs leading-4 border-white/10 border-0 border-solid px-3 py-2"
                      >
                        Delete Post
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              <Card className="rounded-3xl bg-neutral-900 border-white/10 border-0 border-solid p-6 gap-4">
                <CardHeader className="p-0 gap-2">
                  <CardTitle className="text-base leading-6">
                    Post details
                  </CardTitle>
                  <CardDescription className="text-[#a1a1a1] text-sm leading-5">
                    Media, reactions, and discussion context
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-neutral-950/50 border-white/10 border-1 border-solid p-4">
                      <div className="text-[#a1a1a1] text-xs leading-4">
                        Likes
                      </div>
                      <div className="font-semibold text-lg leading-7 mt-1">
                        42
                      </div>
                    </div>
                    <div className="rounded-2xl bg-neutral-950/50 border-white/10 border-1 border-solid p-4">
                      <div className="text-[#a1a1a1] text-xs leading-4">
                        Comments
                      </div>
                      <div className="font-semibold text-lg leading-7 mt-1">
                        124
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-neutral-950/50 border-white/10 border-1 border-solid p-4">
                    <div className="text-[#a1a1a1] text-xs leading-4">
                      Section
                    </div>
                    <div className="font-medium text-neutral-50 text-sm leading-5 mt-1">
                      Match Reaction
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
