import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Lock,
  User,
  Activity,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { sliceLogin } from "@/features/authSlice";
import { authService } from "@/services/auth.service";
import { socket } from "@/utils/socket";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanInput = formData.emailOrUsername.trim();
    if (!cleanInput || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const isEmail = cleanInput.includes("@");
      const payload = {
        password: formData.password,
        ...(isEmail ? { email: cleanInput.toLowerCase() } : { username: cleanInput.toLowerCase() }),
      };

      const res = await authService.login(payload);
      if (res?.data?.user) {
        dispatch(sliceLogin(res.data.user));
        socket.connect();
        toast.success("Welcome back to FootballHub!");
        navigate("/");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-transparent text-neutral-100 flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="absolute top-1/4 left-1/3 size-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="max-w-md w-full backdrop-blur-xl shadow-2xl rounded-3xl bg-neutral-900/90 border border-white/15 p-6 md:p-8 space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-3">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-neutral-950 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <Activity className="size-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 mt-1">
              Sign in to manage bookings, connect with squads, and book pitches.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="emailOrUsername">Email or Username</Label>
            <div className="relative">
              <User className="size-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="emailOrUsername"
                type="text"
                placeholder="username or email"
                value={formData.emailOrUsername}
                onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs text-emerald-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="size-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
              <Checkbox
                checked={formData.rememberMe}
                onCheckedChange={(val) => setFormData({ ...formData, rememberMe: val })}
              />
              <span>Remember me</span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-3 rounded-2xl font-bold text-sm shadow-xl"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-white/10">
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald-400 font-bold hover:underline">
            Join FootballHub
          </Link>
        </div>
      </Card>
    </div>
  );
}
