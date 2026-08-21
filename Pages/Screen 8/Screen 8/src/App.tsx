import { useEffect } from "react";
import {
  AtSign,
  Balloon,
  Lock,
  Mail,
  ShieldCheck,
  Upload,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FallbackComponent } from "./CustomComponents";

export default function App() {
  return (
    <div>
      <div className="min-h-screen relative bg-neutral-950 text-neutral-50 w-full h-fit overflow-hidden h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="bg-white/6 absolute inset-0" />
        <div className="opacity-20 bg-white/3 absolute inset-0" />
        <div className="bg-white/8 absolute inset-0" />
        <div className="relative z-10 min-h-screen flex p-12 justify-center items-center">
          <Card className="backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_80px_rgba(0,0,0,0.55)] rounded-3xl bg-neutral-900/95 border-white/70 border-0 border-solid p-8 gap-6 w-130">
            <CardHeader className="text-center p-0 gap-4">
              <div className="size-14 shadow-[0_0_30px_rgba(255,0,0,0.12)] rounded-2xl bg-neutral-950/70 border-white/70 border-1 border-solid flex mx-auto justify-center items-center">
                <Balloon className="size-7 text-neutral-200" />
              </div>
              <div className="space-y-2">
                <CardTitle className="font-semibold text-neutral-50 text-3xl leading-9 tracking-tight">
                  Join FootballHub
                </CardTitle>
                <CardDescription className="text-[#a1a1a1] text-sm leading-5">
                  Create your player profile and start booking
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 gap-6">
              <div className="rounded-2xl bg-neutral-950/40 border-white/70 border-1 border-solid flex p-4 items-center gap-4">
                <div className="group relative size-20 transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.03)] rounded-full bg-neutral-800/20 border-neutral-200/40 border-2 border-solid flex justify-center items-center">
                  <User className="size-8 text-[#a1a1a1]" />
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <Button className="rounded-xl bg-neutral-800 text-neutral-50 text-sm leading-5 px-4 py-2 w-fit">
                    <Upload className="size-4 mr-2" />
                    Upload photo
                  </Button>
                  <p className="text-[#a1a1a1] text-xs leading-4">
                    PNG, JPG or WEBP up to 5MB. Square crops work best.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-neutral-50 text-sm leading-5">
                    Full name
                  </Label>
                  <div className="relative">
                    <User className="pointer-events-none top-1/2 size-4 -translate-y-1/2 text-[#a1a1a1] absolute left-3" />
                    <Input
                      className="rounded-xl bg-neutral-950/60 text-neutral-50 border-white/70 border-0 border-solid pl-10 h-12"
                      placeholder="Arjun Mehta"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-50 text-sm leading-5">
                    Username
                  </Label>
                  <div className="relative">
                    <AtSign className="pointer-events-none top-1/2 size-4 -translate-y-1/2 text-[#a1a1a1] absolute left-3" />
                    <Input
                      className="rounded-xl bg-neutral-950/60 text-neutral-50 border-[#ff6467]/70 border-0 border-solid pl-10 h-12"
                      placeholder="arjun_striker"
                    />
                  </div>
                  <p className="text-[#ff6467] text-xs leading-4">
                    Username already taken
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-50 text-sm leading-5">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none top-1/2 size-4 -translate-y-1/2 text-[#a1a1a1] absolute left-3" />
                    <Input
                      className="rounded-xl bg-neutral-950/60 text-neutral-50 border-white/70 border-0 border-solid pl-10 h-12"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-50 text-sm leading-5">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none top-1/2 size-4 -translate-y-1/2 text-[#a1a1a1] absolute left-3" />
                    <Input
                      className="rounded-xl bg-neutral-950/60 text-neutral-50 border-white/70 border-0 border-solid pl-10 h-12"
                      type="password"
                      placeholder="Create a strong password"
                    />
                  </div>
                  <div className="space-y-2 rounded-xl bg-neutral-950/40 border-white/70 border-1 border-solid p-3">
                    <div className="text-[#a1a1a1] text-xs leading-4 flex justify-between items-center">
                      <span>Password strength</span>
                      <span className="text-[#ff6467]">Weak</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="rounded-full bg-[#ff6467] flex-1 h-1.5" />
                      <div className="rounded-full bg-neutral-800 flex-1 h-1.5" />
                      <div className="rounded-full bg-neutral-800 flex-1 h-1.5" />
                      <div className="rounded-full bg-neutral-800 flex-1 h-1.5" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-50 text-sm leading-5">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <ShieldCheck className="pointer-events-none top-1/2 size-4 -translate-y-1/2 text-[#a1a1a1] absolute left-3" />
                    <Input
                      className="rounded-xl bg-neutral-950/60 text-neutral-50 border-[#ff6467]/70 border-0 border-solid pl-10 h-12"
                      type="password"
                      placeholder="Repeat your password"
                    />
                  </div>
                  <p className="text-[#ff6467] text-xs leading-4">
                    Passwords do not match
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-neutral-950/40 border-white/70 border-1 border-solid flex p-4 items-start gap-3">
                <Checkbox className="border-white/10 border-0 border-solid mt-0.5" />
                <p className="text-[#a1a1a1] text-sm leading-6">
                  I agree to the<span className="text-neutral-200">Terms</span>
                  and<span className="text-neutral-200">Privacy Policy</span>
                </p>
              </div>
              <Button className="shadow-[0_0_30px_rgba(255,0,0,0.22)] rounded-xl bg-neutral-200 text-neutral-900 w-full h-12">
                Create Account
              </Button>
              <div className="flex py-1 items-center gap-3">
                <div className="bg-white/70 flex-1 h-px" />
                <span className="uppercase text-[#a1a1a1] text-xs leading-4 tracking-[3.84px]">
                  or continue with
                </span>
                <div className="bg-white/70 flex-1 h-px" />
              </div>
              <Button className="rounded-xl bg-neutral-800 text-neutral-50 border-white/70 border-1 border-solid w-full h-12">
                <FallbackComponent className="size-4 mr-2" />
                Sign up with Google
              </Button>
            </CardContent>
            <CardFooter className="text-[#a1a1a1] text-sm leading-5 px-0 pt-2 pb-0 justify-center gap-2">
              <span>Already have an account?</span>
              <Button className="text-neutral-200 text-sm leading-5 p-0 h-auto">
                Sign in
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
