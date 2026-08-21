import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  User,
  Mail,
  Lock,
  Upload,
  Activity,
  AlertCircle,
  Shield,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sliceLogin } from "@/features/authSlice";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [role, setRole] = useState("user"); // "user" | "admin"
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!avatarFile) {
      setError("Please upload an avatar image.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName.trim());
      data.append("username", formData.username.trim().toLowerCase());
      data.append("email", formData.email.trim().toLowerCase());
      data.append("password", formData.password);
      data.append("role", role);
      data.append("avatar", avatarFile);

      const res = await authService.register(data);
      if (res?.data) {
        dispatch(sliceLogin(res.data));
        toast.success(
          role === "admin"
            ? "Turf Owner Admin Account created successfully!"
            : "Footballer Player Account created successfully!"
        );
        navigate("/");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Registration failed. Please check your inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-neutral-950 text-neutral-100 flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 size-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="max-w-md w-full backdrop-blur-xl shadow-2xl rounded-3xl bg-[#0e1520] border border-white/15 p-6 md:p-8 space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-2">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-neutral-950 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <Activity className="size-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-display">
            Join FootballHub
          </h1>
          <p className="text-xs text-neutral-400">
            Create your account and start booking pitches or managing your turf.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Type Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-neutral-300">Account Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setRole("user")}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${role === "user"
                    ? "bg-emerald-500/15 border-emerald-500 text-white shadow-md"
                    : "bg-[#080d14] border-white/10 text-neutral-400 hover:border-white/20"
                  }`}
              >
                <div className="flex items-center gap-1.5">
                  <Trophy className={`size-4 ${role === "user" ? "text-emerald-400" : "text-neutral-400"}`} />
                  <span className="text-xs font-bold">Player / Fan</span>
                </div>
                <span className="text-[10px] text-neutral-400 leading-tight">Book turfs & share highlights</span>
              </div>

              <div
                onClick={() => setRole("admin")}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${role === "admin"
                    ? "bg-emerald-500/15 border-emerald-500 text-white shadow-md"
                    : "bg-[#080d14] border-white/10 text-neutral-400 hover:border-white/20"
                  }`}
              >
                <div className="flex items-center gap-1.5">
                  <Shield className={`size-4 ${role === "admin" ? "text-emerald-400" : "text-neutral-400"}`} />
                  <span className="text-xs font-bold">Turf Owner</span>
                </div>
                <span className="text-[10px] text-neutral-400 leading-tight">Create turfs & approve passes</span>
              </div>
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#080d14] border border-white/10">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="size-14 rounded-2xl object-cover ring-2 ring-emerald-500/40"
              />
            ) : (
              <div className="size-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400">
                <User className="size-6" />
              </div>
            )}
            <div className="flex-1 space-y-1">
              <span className="text-xs font-semibold text-white block">
                Avatar Photo (Required)
              </span>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-neutral-200 font-medium cursor-pointer transition-all border border-white/10">
                <Upload className="size-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="e.g. Ashwin Pilwal"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="e.g. ashwin"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@footballhub.pro"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create password..."
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-xl"
          >
            {loading
              ? "Creating Account..."
              : role === "admin"
                ? "Create Turf Owner Admin Account"
                : "Create Player Account"}
          </Button>
        </form>

        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-white/10">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
