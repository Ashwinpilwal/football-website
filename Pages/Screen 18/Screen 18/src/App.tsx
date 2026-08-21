import { useEffect } from "react";
import {
  Bell,
  Crop,
  Home,
  LogOut,
  MapPin,
  MessageCircle,
  Plus,
  Radio,
  RefreshCw,
  Settings,
  Upload,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function App() {
  return (
    <div>
      <div className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="min-h-[956px] bg-neutral-950 text-neutral-50 flex">
          <aside className="shrink-0 bg-neutral-950 border-white/10 border-t-0 border-r-1 border-b-0 border-l-0 border-solid flex px-4 py-5 flex-col w-62">
            <div className="shadow-[0_0_0_1px_rgba(255,255,255,0.02)] rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex px-4 py-3 items-center gap-3">
              <div className="size-10 rounded-full bg-neutral-800 text-neutral-50 border-white/10 border-1 border-solid flex justify-center items-center">
                <Settings className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm leading-5">
                  FootballHub
                </div>
                <div className="text-[#a1a1a1] text-xs leading-4 mt-1">
                  Settings
                </div>
              </div>
            </div>
            <nav className="flex mt-5 flex-col flex-1 gap-1">
              <button className="font-medium text-left rounded-2xl bg-neutral-800 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid flex px-4 py-3 items-center gap-3">
                <Home className="size-4" />
                Home
              </button>
              <button className="border-transparent text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3">
                <MapPin className="size-4" />
                Find Turfs
              </button>
              <button className="border-transparent text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3">
                <Radio className="size-4" />
                Live Turfs
              </button>
              <button className="border-transparent text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3">
                <Users className="size-4" />
                Matches
              </button>
              <button className="border-transparent text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3">
                <MessageCircle className="size-4" />
                Messages
              </button>
              <button className="border-transparent text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3">
                <Users2 className="size-4" />
                Groups
              </button>
              <button className="border-transparent text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3">
                <Bell className="size-4" />
                Notifications
              </button>
              <button className="border-transparent text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3">
                <Plus className="size-4" />
                Create Post
              </button>
              <button className="border-transparent text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex px-4 py-3 items-center gap-3">
                <User className="size-4" />
                Profile
              </button>
              <button className="font-medium text-left rounded-2xl bg-neutral-800 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid flex px-4 py-3 items-center gap-3">
                <Settings className="size-4" />
                Settings
              </button>
              <button className="border-transparent text-left rounded-2xl text-[#a1a1a1] text-sm leading-5 border-black/1 border-1 border-solid flex mt-auto px-4 py-3 items-center gap-3">
                <LogOut className="size-4" />
                Logout
              </button>
            </nav>
          </aside>
          <main className="min-w-0 flex px-8 py-6 flex-col flex-1">
            <div className="w-full">
              <div className="flex justify-between items-start gap-6">
                <div>
                  <h1 className="font-semibold text-3xl leading-9 tracking-tight">
                    Edit Profile
                  </h1>
                  <p className="text-[#a1a1a1] text-sm leading-5 mt-2">
                    Build your football identity.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 mt-6 gap-6 w-full">
                <Card className="shadow-[0_20px_60px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6 gap-4 w-full">
                  <CardHeader className="p-0 gap-2">
                    <div className="flex justify-between items-center gap-4">
                      <div>
                        <CardTitle className="text-xl leading-7">
                          Profile header
                        </CardTitle>
                        <CardDescription>
                          Update your cover image and avatar.
                        </CardDescription>
                      </div>
                      <Button className="rounded-full bg-neutral-800 text-neutral-50">
                        <Upload className="size-4 mr-2" />
                        Change Cover
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 gap-4">
                    <div className="relative rounded-3xl bg-neutral-800/10 border-white/10 border-1 border-solid overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                        alt="Football stadium cover"
                        className="object-cover opacity-80 w-full h-64"
                        data-photoid="cover-footballhub"
                        data-authorname="Chris Chow"
                        data-authorurl="https://unsplash.com/@chrischow"
                        data-blurhash="L9F$%h?b?b?b~qofj[ay?bofj[ay"
                      />
                      <div className="bg-gradient-to-t from-background/75 via-background/20 to-transparent absolute inset-0" />
                      <div className="rounded-full bg-neutral-950/80 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid absolute left-6 top-6 px-3 py-1">{`Drag & drop to replace`}</div>
                      <div className="flex absolute right-6 bottom-6 gap-2">
                        <Button className="rounded-full bg-neutral-800 text-neutral-50">
                          <Crop className="size-4 mr-2" />
                          Crop Cover
                        </Button>
                        <Button className="rounded-full bg-neutral-200 text-neutral-900">
                          <RefreshCw className="size-4 mr-2" />
                          Replace
                        </Button>
                      </div>
                    </div>
                    <div className="relative flex -mt-14 px-2 items-end gap-4">
                      <div className="relative">
                        <div className="size-28 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] rounded-full bg-neutral-900 border-neutral-950 border-4 border-solid overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                            alt="Profile avatar"
                            className="object-cover w-full h-full"
                            data-photoid="avatar-footballhub"
                            data-authorname="Ayo Ogunseinde"
                            data-authorurl="https://unsplash.com/@ayoogunseinde"
                            data-blurhash="L6PZ%#M|?b%M~q%M%M%M%M%M%M%M"
                          />
                        </div>
                        <div className="rounded-full bg-neutral-800 text-[#a1a1a1] text-[10px] border-white/10 border-1 border-solid absolute -right-2 -bottom-2 px-2 py-1">
                          Uploading
                        </div>
                      </div>
                      <div className="pb-2">
                        <div className="font-semibold text-lg leading-7">
                          Arjun Mehta
                        </div>
                        <div className="text-[#a1a1a1] text-sm leading-5 mt-1">
                          Football creator • Striker • Turf regular
                        </div>
                        <div className="flex mt-3 gap-2">
                          <Button className="rounded-full bg-neutral-800 text-neutral-50">
                            <Upload className="size-4 mr-2" />
                            Change Avatar
                          </Button>
                          <Button className="rounded-full bg-neutral-950 text-neutral-50 border-white/10 border-1 border-solid">
                            <Crop className="size-4 mr-2" />
                            Crop Avatar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6 gap-4 w-full">
                  <CardHeader className="p-0 gap-2">
                    <CardTitle className="text-xl leading-7">
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Keep your public profile accurate and easy to find.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid p-0 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Full Name</Label>
                        <Input
                          value="Arjun Mehta"
                          className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Username</Label>
                        <Input
                          value="arjun_striker"
                          className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <Label>Bio</Label>
                        <span className="text-[#a1a1a1] text-xs leading-4">
                          248 / 500
                        </span>
                      </div>
                      <Textarea
                        value="Weekend striker, turf regular, and matchday storyteller."
                        className="min-h-[120px] rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input
                          value="arjun@footballhub.app"
                          className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid"
                        />
                        <p className="text-[#a1a1a1] text-xs leading-4">
                          Verified for booking and login alerts.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label>Phone Number</Label>
                        <Input
                          value="+91 98765 43210"
                          className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid"
                        />
                        <p className="text-[#ff6467] text-xs leading-4">
                          Please enter a valid mobile number.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6 gap-6 w-full">
                  <CardHeader className="p-0 gap-2">
                    <CardTitle className="text-xl leading-7">
                      Football Profile
                    </CardTitle>
                    <CardDescription>
                      Tell FootballHub how you play.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid p-0 gap-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="grid gap-3">
                        <Label>Favourite Country</Label>
                        <Select defaultValue="India">
                          <SelectTrigger className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid px-4 h-14">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="India">
                              <div className="flex py-1 items-center gap-3">
                                <img
                                  src="https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfGFsbHx8fHx8fHx8fDE3NTUxNTQ2MDl8&ixlib=rb-4.1.0&q=80&w=400"
                                  alt="India thumbnail"
                                  className="size-8 object-cover rounded-full"
                                  data-photoid="saE7xiecGkM"
                                  data-authorname="Ferhat Deniz Fors"
                                  data-authorurl="https://unsplash.com/@ferhat"
                                  data-blurhash="LePp+GXSfls,MyMetQx[.jjctPoy"
                                />
                                <span>India</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Brazil">
                              <div className="flex py-1 items-center gap-3">
                                <img
                                  src="https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfGFsbHx8fHx8fHx8fDE3NTUxNTQ2MDl8&ixlib=rb-4.1.0&q=80&w=400"
                                  alt="Brazil thumbnail"
                                  className="size-8 object-cover rounded-full"
                                  data-photoid="saE7xiecGkM"
                                  data-authorname="Ferhat Deniz Fors"
                                  data-authorurl="https://unsplash.com/@ferhat"
                                  data-blurhash="LePp+GXSfls,MyMetQx[.jjctPoy"
                                />
                                <span>Brazil</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Spain">
                              <div className="flex py-1 items-center gap-3">
                                <img
                                  src="https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfGFsbHx8fHx8fHx8fDE3NTUxNTQ2MDl8&ixlib=rb-4.1.0&q=80&w=400"
                                  alt="Spain thumbnail"
                                  className="size-8 object-cover rounded-full"
                                  data-photoid="saE7xiecGkM"
                                  data-authorname="Ferhat Deniz Fors"
                                  data-authorurl="https://unsplash.com/@ferhat"
                                  data-blurhash="LePp+GXSfls,MyMetQx[.jjctPoy"
                                />
                                <span>Spain</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label>Favourite Club</Label>
                        <Select defaultValue="Arsenal">
                          <SelectTrigger className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid px-4 h-14">
                            <SelectValue placeholder="Select club" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arsenal">
                              <div className="flex py-1 items-center gap-3">
                                <img
                                  src="https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfGFsbHx8fHx8fHx8fDE3NTUxNTQ2MDl8&ixlib=rb-4.1.0&q=80&w=400"
                                  alt="Arsenal thumbnail"
                                  className="size-8 object-cover rounded-full"
                                  data-photoid="saE7xiecGkM"
                                  data-authorname="Ferhat Deniz Fors"
                                  data-authorurl="https://unsplash.com/@ferhat"
                                  data-blurhash="LePp+GXSfls,MyMetQx[.jjctPoy"
                                />
                                <span>Arsenal</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Real Madrid">
                              <div className="flex py-1 items-center gap-3">
                                <img
                                  src="https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfGFsbHx8fHx8fHx8fDE3NTUxNTQ2MDl8&ixlib=rb-4.1.0&q=80&w=400"
                                  alt="Real Madrid thumbnail"
                                  className="size-8 object-cover rounded-full"
                                  data-photoid="saE7xiecGkM"
                                  data-authorname="Ferhat Deniz Fors"
                                  data-authorurl="https://unsplash.com/@ferhat"
                                  data-blurhash="LePp+GXSfls,MyMetQx[.jjctPoy"
                                />
                                <span>Real Madrid</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Barcelona">
                              <div className="flex py-1 items-center gap-3">
                                <img
                                  src="https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfGFsbHx8fHx8fHx8fDE3NTUxNTQ2MDl8&ixlib=rb-4.1.0&q=80&w=400"
                                  alt="Barcelona thumbnail"
                                  className="size-8 object-cover rounded-full"
                                  data-photoid="saE7xiecGkM"
                                  data-authorname="Ferhat Deniz Fors"
                                  data-authorurl="https://unsplash.com/@ferhat"
                                  data-blurhash="LePp+GXSfls,MyMetQx[.jjctPoy"
                                />
                                <span>Barcelona</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="grid gap-3">
                        <Label>Favourite Player</Label>
                        <Select defaultValue="Messi">
                          <SelectTrigger className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid px-4 h-14">
                            <SelectValue placeholder="Select player" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Messi">
                              <div className="flex py-1 items-center gap-3">
                                <img
                                  src="https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfGFsbHx8fHx8fHx8fDE3NTUxNTQ2MDl8&ixlib=rb-4.1.0&q=80&w=400"
                                  alt="Lionel Messi thumbnail"
                                  className="size-8 object-cover rounded-full"
                                  data-photoid="saE7xiecGkM"
                                  data-authorname="Ferhat Deniz Fors"
                                  data-authorurl="https://unsplash.com/@ferhat"
                                  data-blurhash="LePp+GXSfls,MyMetQx[.jjctPoy"
                                />
                                <span>Lionel Messi</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Ronaldo">
                              <div className="flex py-1 items-center gap-3">
                                <img
                                  src="https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfGFsbHx8fHx8fHx8fDE3NTUxNTQ2MDl8&ixlib=rb-4.1.0&q=80&w=400"
                                  alt="Cristiano Ronaldo thumbnail"
                                  className="size-8 object-cover rounded-full"
                                  data-photoid="saE7xiecGkM"
                                  data-authorname="Ferhat Deniz Fors"
                                  data-authorurl="https://unsplash.com/@ferhat"
                                  data-blurhash="LePp+GXSfls,MyMetQx[.jjctPoy"
                                />
                                <span>Cristiano Ronaldo</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="KDB">
                              <div className="flex py-1 items-center gap-3">
                                <img
                                  src="https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfGFsbHx8fHx8fHx8fDE3NTUxNTQ2MDl8&ixlib=rb-4.1.0&q=80&w=400"
                                  alt="Kevin De Bruyne thumbnail"
                                  className="size-8 object-cover rounded-full"
                                  data-photoid="saE7xiecGkM"
                                  data-authorname="Ferhat Deniz Fors"
                                  data-authorurl="https://unsplash.com/@ferhat"
                                  data-blurhash="LePp+GXSfls,MyMetQx[.jjctPoy"
                                />
                                <span>Kevin De Bruyne</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label>Playing Position</Label>
                        <Select defaultValue="Striker">
                          <SelectTrigger className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid px-4 h-14">
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Striker">Striker</SelectItem>
                            <SelectItem value="Midfielder">
                              Midfielder
                            </SelectItem>
                            <SelectItem value="Defender">Defender</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="grid gap-3">
                        <Label>Preferred Foot</Label>
                        <Select defaultValue="Right">
                          <SelectTrigger className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid px-4 h-14">
                            <SelectValue placeholder="Select foot" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Right">Right</SelectItem>
                            <SelectItem value="Left">Left</SelectItem>
                            <SelectItem value="Both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label>Skill Level</Label>
                        <Select defaultValue="Advanced">
                          <SelectTrigger className="rounded-2xl bg-neutral-950 border-white/10 border-1 border-solid px-4 h-14">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
