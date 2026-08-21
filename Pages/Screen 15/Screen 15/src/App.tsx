import { useEffect } from "react";
import {
  Activity,
  Bell,
  BellRing,
  Bookmark,
  CalendarDays,
  CircleHelp,
  Clock3,
  CreditCard,
  Database,
  Eye,
  FileText,
  Globe2,
  Heart,
  HeartHandshake,
  History,
  IdCard,
  Inbox,
  Info,
  Languages,
  LayoutGrid,
  LockKeyhole,
  LogOut,
  Mail,
  MailOpen,
  MapPin,
  MessageCircle,
  MessageCircleMore,
  MessageSquare,
  MessageSquareMore,
  MessagesSquare,
  MoonStar,
  PenLine,
  Save,
  Settings,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Trash2,
  Trophy,
  Upload,
  User,
  UserX,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { FallbackComponent } from "./CustomComponents";

export default function App() {
  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-[956px] bg-neutral-950 text-neutral-50 flex w-full">
          <aside className="shrink-0 bg-neutral-900/70 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex px-4 py-6 flex-col w-62.5">
            <div className="flex mb-8 px-2 items-center gap-3">
              <div className="size-10 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] rounded-xl bg-neutral-950/60 border-white/10 border-1 border-solid flex justify-center items-center">
                <Settings className="size-5 text-neutral-200" />
              </div>
              <div>
                <div className="leading-none font-semibold text-lg leading-7">
                  FootballHub
                </div>
                <div className="text-[#a1a1a1] text-xs leading-4">Settings</div>
              </div>
            </div>
            <div className="overflow-y-auto pr-1 flex-1">
              <div className="space-y-6">
                <div>
                  <div className="font-medium text-[#a1a1a1] text-[11px] tracking-[3.52px] px-2 pb-2">
                    ACCOUNT
                  </div>
                  <div className="space-y-1">
                    <button className="text-left shadow-[0_0_24px_rgba(255,255,255,0.03)] rounded-xl bg-neutral-800/70 text-neutral-50 text-sm leading-5 border-neutral-200 border-t-0 border-r-0 border-b-0 border-l-2 border-solid flex px-3 py-2.5 items-center gap-3 w-full">
                      <User className="size-4 text-neutral-200" />
                      <span>Edit Profile</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <IdCard className="size-4" />
                      <span>Account Information</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <LockKeyhole className="size-4" />
                      <span>Change Password</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Mail className="size-4" />
                      <span>{`Email & Security`}</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-[#a1a1a1] text-[11px] tracking-[3.52px] px-2 pb-2">
                    FOOTBALL PROFILE
                  </div>
                  <div className="space-y-1">
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Globe2 className="size-4" />
                      <span>Favourite Country</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Shield className="size-4" />
                      <span>Favourite Club</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Sparkles className="size-4" />
                      <span>Favourite Player</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <FallbackComponent className="size-4" />
                      <span>Playing Position</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Trophy className="size-4" />
                      <span>Football Preferences</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-[#a1a1a1] text-[11px] tracking-[3.52px] px-2 pb-2">
                    CONTENT
                  </div>
                  <div className="space-y-1">
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <FileText className="size-4" />
                      <span>My Posts</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <LayoutGrid className="size-4" />
                      <span>Manage Sections</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <PenLine className="size-4" />
                      <span>Drafts</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Bookmark className="size-4" />
                      <span>Saved Posts</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-[#a1a1a1] text-[11px] tracking-[3.52px] px-2 pb-2">
                    SOCIAL
                  </div>
                  <div className="space-y-1">
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Users className="size-4" />
                      <span>Following/Followers</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <UserX className="size-4" />
                      <span>Blocked Users</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Users2 className="size-4" />
                      <span>Groups</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <MailOpen className="size-4" />
                      <span>Group Invitations</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-[#a1a1a1] text-[11px] tracking-[3.52px] px-2 pb-2">{`TURF & BOOKINGS`}</div>
                  <div className="space-y-1">
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <CalendarDays className="size-4" />
                      <span>My Bookings</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Heart className="size-4" />
                      <span>Saved/Favourite Turfs</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <SlidersHorizontal className="size-4" />
                      <span>Booking Preferences</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <CreditCard className="size-4" />
                      <span>Payment Methods</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <BellRing className="size-4" />
                      <span>Booking Notifications</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-[#a1a1a1] text-[11px] tracking-[3.52px] px-2 pb-2">
                    MESSAGING
                  </div>
                  <div className="space-y-1">
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <MessageSquare className="size-4" />
                      <span>Chat Settings</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Inbox className="size-4" />
                      <span>Message Requests</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <MessagesSquare className="size-4" />
                      <span>Group Chat Settings</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-[#a1a1a1] text-[11px] tracking-[3.52px] px-2 pb-2">
                    NOTIFICATIONS
                  </div>
                  <div className="space-y-1">
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <HeartHandshake className="size-4" />
                      <span>{`Likes & Comments`}</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <MessageCircle className="size-4" />
                      <span>Messages</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Users className="size-4" />
                      <span>Match Invitations</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <MapPin className="size-4" />
                      <span>Turf Booking Updates</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Bell className="size-4" />
                      <span>Match Reminders</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Activity className="size-4" />
                      <span>Group Activity</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-[#a1a1a1] text-[11px] tracking-[3.52px] px-2 pb-2">
                    PRIVACY
                  </div>
                  <div className="space-y-1">
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Eye className="size-4" />
                      <span>Profile Visibility</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <MessageCircleMore className="size-4" />
                      <span>Who can message me</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <MessageSquareMore className="size-4" />
                      <span>Who can comment on my posts</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Clock3 className="size-4" />
                      <span>Activity visibility</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-[#a1a1a1] text-[11px] tracking-[3.52px] px-2 pb-2">
                    SECURITY
                  </div>
                  <div className="space-y-1">
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <LockKeyhole className="size-4" />
                      <span>Change Password</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Smartphone className="size-4" />
                      <span>Active Sessions</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <History className="size-4" />
                      <span>Login History</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <ShieldCheck className="size-4" />
                      <span>Two-factor authentication</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-[#a1a1a1] text-[11px] tracking-[3.52px] px-2 pb-2">
                    APP
                  </div>
                  <div className="space-y-1">
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <MoonStar className="size-4" />
                      <span>Appearance</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Languages className="size-4" />
                      <span>Language</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Database className="size-4" />
                      <span>Data Usage</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <CircleHelp className="size-4" />
                      <span>{`Help & Support`}</span>
                    </button>
                    <button className="text-left rounded-xl text-[#a1a1a1] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Info className="size-4" />
                      <span>About FootballHub</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-[#ff6467]/90 text-[11px] tracking-[3.52px] px-2 pb-2">
                    DANGER ZONE
                  </div>
                  <div className="space-y-1">
                    <button className="text-left rounded-xl text-[#ff6467] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <LogOut className="size-4" />
                      <span>Logout</span>
                    </button>
                    <button className="text-left rounded-xl text-[#ff6467] text-sm leading-5 flex px-3 py-2.5 items-center gap-3 w-full">
                      <Trash2 className="size-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <main className="min-w-0 bg-neutral-950 flex flex-col flex-1">
            <div className="min-h-0 flex p-8 flex-1 gap-6">
              <section className="min-w-0 flex flex-col flex-1 gap-6">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="font-semibold text-3xl leading-9 tracking-tight">
                      Settings
                    </div>
                    <div className="text-[#a1a1a1] text-sm leading-5 mt-2">
                      Manage your FootballHub profile, privacy, security, and
                      app preferences.
                    </div>
                  </div>
                  <div className="rounded-full bg-neutral-900 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid px-4 py-2">
                    Premium account
                  </div>
                </div>
                <Card className="shadow-[0_24px_80px_rgba(0,0,0,0.35)] bg-neutral-900 border-white/10 border-0 border-solid p-6 gap-6">
                  <CardHeader className="p-0 gap-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl leading-7">
                          Edit Profile
                        </CardTitle>
                        <CardDescription>
                          Update your public identity and football profile.
                        </CardDescription>
                      </div>
                      <Badge className="rounded-full bg-neutral-800 text-neutral-50">
                        Live preview
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="grid p-0 gap-6">
                    <div className="grid rounded-2xl bg-neutral-950/40 border-white/10 border-1 border-solid p-4 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="size-20 font-semibold rounded-full bg-neutral-800/60 text-neutral-50 text-2xl leading-8 border-white/10 border-1 border-solid flex justify-center items-center">
                          AM
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium text-sm leading-5">
                            Profile photo
                          </div>
                          <div className="text-[#a1a1a1] text-sm leading-5">
                            Upload a clear headshot or club avatar.
                          </div>
                          <Button className="bg-neutral-200 text-neutral-900">
                            <Upload className="size-4 mr-2" />
                            Upload Photo
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="full-name">Full name</Label>
                        <Input
                          id="full-name"
                          value="Arjun Mehta"
                          className="bg-neutral-950 border-white/10 border-0 border-solid"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value="arjun_striker"
                          className="bg-neutral-950 border-white/10 border-0 border-solid"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value="Weekend striker, turf regular, and matchday storyteller."
                        className="min-h-[120px] bg-neutral-950 border-white/10 border-0 border-solid"
                      />
                    </div>
                    <div className="grid rounded-2xl bg-neutral-950/40 border-white/10 border-1 border-solid p-4 gap-4">
                      <div className="grid gap-2">
                        <Label>Favourite club</Label>
                        <Select value="arsenal">
                          <SelectTrigger className="bg-neutral-950 border-white/10 border-0 border-solid">
                            <SelectValue placeholder="Select club" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arsenal">Arsenal</SelectItem>
                            <SelectItem value="barcelona">Barcelona</SelectItem>
                            <SelectItem value="real">Real Madrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Playing position</Label>
                        <Select value="striker">
                          <SelectTrigger className="bg-neutral-950 border-white/10 border-0 border-solid">
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="striker">Striker</SelectItem>
                            <SelectItem value="midfielder">
                              Midfielder
                            </SelectItem>
                            <SelectItem value="defender">Defender</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Preferred format</Label>
                        <Select value="7v7">
                          <SelectTrigger className="bg-neutral-950 border-white/10 border-0 border-solid">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5v5">5v5</SelectItem>
                            <SelectItem value="7v7">7v7</SelectItem>
                            <SelectItem value="11v11">11v11</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid rounded-2xl bg-neutral-950/40 border-white/10 border-1 border-solid p-4 gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm leading-5">
                            Football preferences summary
                          </div>
                          <div className="text-[#a1a1a1] text-sm leading-5">
                            Your profile helps match you with the right games
                            and turfs.
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="rounded-full text-[#a1a1a1] border-white/10 border-0 border-solid"
                        >
                          Updated
                        </Badge>
                      </div>
                      <div className="grid gap-3">
                        <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid p-4">
                          <div className="uppercase text-[#a1a1a1] text-xs leading-4 tracking-[3.2px]">
                            Country
                          </div>
                          <div className="font-medium text-sm leading-5 mt-2">
                            India
                          </div>
                        </div>
                        <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid p-4">
                          <div className="uppercase text-[#a1a1a1] text-xs leading-4 tracking-[3.2px]">
                            Club
                          </div>
                          <div className="font-medium text-sm leading-5 mt-2">
                            Arsenal
                          </div>
                        </div>
                        <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid p-4">
                          <div className="uppercase text-[#a1a1a1] text-xs leading-4 tracking-[3.2px]">
                            Position
                          </div>
                          <div className="font-medium text-sm leading-5 mt-2">
                            Striker
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid rounded-2xl bg-neutral-950/40 border-white/10 border-1 border-solid p-4 gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm leading-5">
                            Subscriptions
                          </div>
                          <div className="text-[#a1a1a1] text-sm leading-5">
                            Manage active plans and billing access.
                          </div>
                        </div>
                        <Badge className="rounded-full bg-neutral-800 text-neutral-50">
                          3 active
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid flex p-4 justify-between items-center">
                          <div>
                            <div className="font-medium">FootballHub Pro</div>
                            <div className="text-[#a1a1a1] text-sm leading-5">
                              Renews monthly • Includes advanced turf insights
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch defaultChecked={true} />
                            <Button
                              variant="outline"
                              className="bg-transparent border-white/10 border-0 border-solid"
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                        <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid flex p-4 justify-between items-center">
                          <div>
                            <div className="font-medium">Match Alerts Plus</div>
                            <div className="text-[#a1a1a1] text-sm leading-5">
                              Weekly reminders and booking updates
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch defaultChecked={false} />
                            <Button
                              variant="outline"
                              className="bg-transparent border-white/10 border-0 border-solid"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                        <div className="rounded-xl bg-neutral-900 border-white/10 border-1 border-solid flex p-4 justify-between items-center">
                          <div>
                            <div className="font-medium">Creator Boost</div>
                            <div className="text-[#a1a1a1] text-sm leading-5">
                              Boosts post visibility in the football feed
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch defaultChecked={true} />
                            <Button
                              variant="outline"
                              className="bg-transparent border-white/10 border-0 border-solid"
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex px-0 pt-2 pb-0 justify-between items-center">
                    <div className="text-[#a1a1a1] text-sm leading-5">
                      Changes are saved securely to your FootballHub profile.
                    </div>
                    <Button className="bg-neutral-200 text-neutral-900 px-6">
                      <Save className="size-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
