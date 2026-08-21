import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  X,
  Lock,
  User,
  Activity,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sliceLogin } from "@/features/authSlice";
import { authService } from "@/services/auth.service";
import { socket } from "@/utils/socket";
import toast from "react-hot-toast";

export default function LoginModal({ isOpen, onClose, title = "Sign In to Interact", message = "Join the squad to like posts, participate in discussions, and reserve pitches." }) {
  const dispatch = useDispatch();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailOrUsername || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const isEmail = emailOrUsername.includes("@");
      const payload = {
        password,
        ...(isEmail ? { email: emailOrUsername } : { username: emailOrUsername }),
      };

      const res = await authService.login(payload);
      if (res?.data?.user) {
        dispatch(sliceLogin(res.data.user));
        socket.connect();
        toast.success("Welcome to FootballHub!");
        onClose();
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full rounded-3xl bg-[#0b1118] border border-white/15 p-6 md:p-8 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200 dynamic-sidebar-shift transition-transform duration-200 ease-out will-change-transform"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 size-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-neutral-950 flex items-center justify-center mx-auto shadow-md">
            <Activity className="size-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold text-white tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <Label htmlFor="modal-emailOrUsername">Email or Username</Label>
            <div className="relative">
              <User className="size-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="modal-emailOrUsername"
                type="text"
                placeholder="username or email"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="pl-9 h-10 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="modal-password">Password</Label>
              <Link to="/forgot-password" onClick={onClose} className="text-[11px] text-emerald-400 hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="size-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="modal-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-10 text-xs"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-2.5 rounded-xl font-bold text-xs shadow-md mt-1"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-white/10">
          New to FootballHub?{" "}
          <Link to="/register" onClick={onClose} className="text-emerald-400 font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
