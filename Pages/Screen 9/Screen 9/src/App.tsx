import { useEffect } from "react";
import { AlertCircle, Mail, ShieldHalf } from "lucide-react";
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

export default function App() {
  return (
    <div>
      <div className="min-h-screen relative bg-neutral-950 text-neutral-50 w-full h-fit overflow-hidden h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="bg-white/6 absolute inset-0" />
        <div className="opacity-20 bg-white/3 absolute inset-0" />
        <div className="bg-black/35 absolute inset-0" />
        <div className="relative z-10 min-h-screen flex p-12 justify-center items-center">
          <Card className="max-w-[520px] backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_rgba(0,0,0,0.55)] rounded-3xl bg-neutral-900/95 border-white/70 border-0 border-solid p-8 gap-6 w-full">
            <CardHeader className="text-center p-0 gap-4">
              <div className="size-14 shadow-[0_0_30px_rgba(255,0,0,0.12)] rounded-2xl bg-neutral-800/70 border-white/70 border-1 border-solid flex mx-auto justify-center items-center">
                <ShieldHalf className="size-7 text-neutral-200" />
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-neutral-50 text-2xl leading-8 tracking-tight">
                  FootballHub
                </div>
                <CardTitle className="font-semibold text-neutral-50 text-3xl leading-9 tracking-tight">
                  Reset your password
                </CardTitle>
                <CardDescription className="text-[#a1a1a1] text-sm leading-6">
                  We’ll send a reset link to your email
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[#a1a1a1] text-sm leading-5"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none top-1/2 size-4 -translate-y-1/2 text-[#a1a1a1] absolute left-3" />
                  <Input
                    id="email"
                    value=""
                    placeholder="name@footballhub.com"
                    className="bg-neutral-950/60 text-neutral-50 border-white/70 border-0 border-solid pl-10 h-12"
                  />
                </div>
                <div className="text-[#ff6467] text-sm leading-5 flex items-center gap-2">
                  <AlertCircle className="size-4" />
                  <span>Email not found</span>
                </div>
              </div>
              <Button className="shadow-[0_0_24px_rgba(255,0,0,0.18)] rounded-xl bg-neutral-200 text-neutral-900 w-full h-12">
                Send reset link
              </Button>
              <Button
                variant="ghost"
                className="rounded-xl text-[#a1a1a1] w-full h-11"
              >
                Back to sign in
              </Button>
              <div className="rounded-2xl bg-neutral-800/40 text-[#a1a1a1] text-sm leading-6 border-white/60 border-1 border-solid p-4">
                Check your spam folder if you do not see the email. Reset links
                expire after a short time for security.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
