import { useEffect } from "react";
import { Apple, AtSign, Balloon, Lock, Mail, Sparkles } from "lucide-react";
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
        <div className="h-1/3 bg-white/3 absolute inset-x-0 bottom-0" />
        <div className="opacity-30 bg-white/4 absolute inset-x-0 bottom-0 h-40" />
        <div className="bg-white/5 absolute inset-x-0 top-0 h-56" />
        <div className="flex absolute inset-x-0 top-10 justify-center">
          <div className="blur-3xl rounded-full bg-white/8 w-190 h-40" />
        </div>
        <div className="relative z-10 min-h-screen flex p-12 justify-center items-center">
          <Card className="max-w-[520px] backdrop-blur-sm shadow-[0_30px_80px_rgba(0,0,0,0.55)] rounded-3xl bg-neutral-900/95 border-white/70 border-1 border-solid p-8 gap-6 w-full">
            <CardHeader className="p-0 gap-4">
              <div className="flex items-center gap-3">
                <div className="size-11 shadow-[0_0_24px_rgba(255,255,255,0.06)] rounded-2xl bg-neutral-800/80 border-white/70 border-1 border-solid flex justify-center items-center">
                  <Balloon className="size-5 text-neutral-200" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-neutral-50 text-lg leading-7 tracking-tight">
                    FootballHub
                  </span>
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    Secure sign-in
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="font-semibold text-neutral-50 text-3xl leading-9 tracking-tight">
                  Welcome back
                </CardTitle>
                <CardDescription className="max-w-md text-[#a1a1a1] text-sm leading-6">
                  Sign in to get back on the pitch
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 gap-5">
              <div className="space-y-2">
                <Label className="text-neutral-50 text-sm leading-5">
                  Email / Username
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none top-1/2 size-4 -translate-y-1/2 text-[#a1a1a1] absolute left-3" />
                  <Input
                    value=""
                    className="shadow-[0_0_0_1px_rgba(255,0,0,0.08)] bg-neutral-950/70 text-neutral-50 border-[#ff6467]/70 border-0 border-solid pl-10 h-12"
                  />
                </div>
                <p className="text-[#ff6467] text-xs leading-4">
                  Enter a valid email
                </p>
                <p className="text-[#a1a1a1] text-xs leading-4">
                  Use your registered email or club username.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-50 text-sm leading-5">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none top-1/2 size-4 -translate-y-1/2 text-[#a1a1a1] absolute left-3" />
                  <Input
                    type="password"
                    value=""
                    className="shadow-[0_0_0_1px_rgba(255,0,0,0.08)] bg-neutral-950/70 text-neutral-50 border-[#ff6467]/70 border-0 border-solid pl-10 h-12"
                  />
                </div>
                <p className="text-[#ff6467] text-xs leading-4">
                  Password is required
                </p>
                <p className="text-[#a1a1a1] text-xs leading-4">
                  At least 8 characters with a mix of letters and numbers.
                </p>
              </div>
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox checked={false} />
                  <span className="text-[#a1a1a1] text-sm leading-5">
                    Remember me
                  </span>
                </div>
                <Button
                  variant="link"
                  className="text-[#a1a1a1] text-sm leading-5 p-0 h-auto"
                >
                  Forgot password?
                </Button>
              </div>
              <Button className="transition-transform shadow-[0_0_28px_rgba(255,255,255,0.12)] rounded-xl bg-neutral-200 text-neutral-900 w-full h-12">
                Login
              </Button>
              <div className="flex py-1 items-center gap-3">
                <div className="bg-white/10 flex-1 h-px" />
                <span className="uppercase text-[#a1a1a1] text-xs leading-4 tracking-[3.84px]">
                  or continue with
                </span>
                <div className="bg-white/10 flex-1 h-px" />
              </div>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="rounded-xl bg-neutral-800/70 text-neutral-50 border-white/10 border-0 border-solid justify-center gap-3 w-full h-12"
                >
                  <FallbackComponent className="size-4" />
                  Continue with Google
                </Button>
                <div className="flex justify-center items-center gap-3">
                  <Button
                    variant="outline"
                    className="size-11 rounded-full bg-neutral-800/70 text-neutral-50 border-white/10 border-0 border-solid p-0"
                  >
                    <Apple className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-11 rounded-full bg-neutral-800/70 text-neutral-50 border-white/10 border-0 border-solid p-0"
                  >
                    <AtSign className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex p-0 flex-col gap-3">
              <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-2">
                <span>New to FootballHub?</span>
                <Button
                  variant="link"
                  className="text-neutral-200 text-sm leading-5 p-0 h-auto"
                >
                  Create an account
                </Button>
              </div>
              <div className="text-[#a1a1a1] text-xs leading-4 flex items-center gap-2">
                <Sparkles className="size-3.5 text-neutral-200" />
                <span>Smooth transition</span>
                <span>•</span>
                <span>Slide and fade into signup</span>
              </div>
              <p className="text-[#a1a1a1] text-xs leading-4">
                Secure sign-in with encrypted session handling and device
                verification.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
