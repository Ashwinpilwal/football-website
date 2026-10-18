import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldHalf, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("Password reset instructions sent to your email.");
  };

  return (
    <div className="min-h-screen relative bg-transparent text-neutral-100 flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="absolute top-1/3 left-1/3 size-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="max-w-md w-full backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] rounded-3xl bg-neutral-900/95 border border-white/15 p-8 space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-3">
          <div className="size-14 rounded-2xl bg-neutral-800/80 border border-white/15 flex items-center justify-center mx-auto text-neutral-200 shadow-[0_0_30px_rgba(255,255,255,0.08)]">
            <ShieldHalf className="size-7 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Reset Your Password</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Enter your registered email address and we'll send a secure password recovery link.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="size-8 text-emerald-400 mx-auto" />
            <p className="text-xs text-emerald-300">
              Reset email dispatched to <strong className="text-white">{email}</strong>. Check your inbox!
            </p>
            <Link to="/login" className="block pt-2">
              <Button variant="primary" size="sm" className="w-full text-xs font-bold rounded-xl">
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="size-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="arjun@footballhub.pro"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3 rounded-2xl font-bold text-sm shadow-xl">
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-white/10">
          <Link to="/login" className="text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-1.5 font-medium">
            <ArrowLeft className="size-3.5" /> Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
