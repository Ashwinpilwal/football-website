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
  Crop as CropIcon,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sliceLogin } from "@/features/authSlice";
import { authService } from "@/services/auth.service";
import ImageCropModal from "@/components/common/ImageCropModal";
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

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [rawAvatarSrc, setRawAvatarSrc] = useState(null);
  const [isAvatarCropOpen, setIsAvatarCropOpen] = useState(false);

  // Cover Image state
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [rawCoverSrc, setRawCoverSrc] = useState(null);
  const [isCoverCropOpen, setIsCoverCropOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Avatar Selection -> Open Crop Modal
  const handleAvatarFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawAvatarSrc(reader.result);
        setIsAvatarCropOpen(true);
      };
      reader.readAsDataURL(file);
      // Reset input value so re-selecting same file triggers event
      e.target.value = "";
    }
  };

  const handleAvatarCropComplete = (croppedFile, previewUrl) => {
    setAvatarFile(croppedFile);
    setAvatarPreview(previewUrl);
    toast.success("Profile photo cropped & ready!");
  };

  // Handle Cover Image Selection -> Open Crop Modal
  const handleCoverFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawCoverSrc(reader.result);
        setIsCoverCropOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleCoverCropComplete = (croppedFile, previewUrl) => {
    setCoverFile(croppedFile);
    setCoverPreview(previewUrl);
    toast.success("Cover banner cropped & ready!");
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setRawCoverSrc(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!avatarFile) {
      setError("Please upload and crop a profile avatar photo.");
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
      if (coverFile) {
        data.append("coverImage", coverFile);
      }

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

      <Card className="max-w-lg w-full backdrop-blur-xl shadow-2xl rounded-3xl bg-[#0e1520] border border-white/15 p-6 md:p-8 space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-2">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-neutral-950 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <Activity className="size-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-display">
            Join FootballHub
          </h1>
          <p className="text-xs text-neutral-400">
            Create your account, crop your profile visual assets, and start playing.
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
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
                  role === "user"
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
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
                  role === "admin"
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

          {/* Profile Photo & Cover Banner Upload with Live Cropping */}
          <div className="space-y-3 p-3.5 rounded-2xl bg-[#080d14] border border-white/10">
            {/* 1. Cover Banner Upload (3:1 Aspect Ratio) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <ImageIcon className="size-3.5 text-emerald-400" />
                  Cover Banner (Optional)
                </span>
                {coverPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="text-[10.5px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="size-3" /> Remove
                  </button>
                )}
              </div>

              {coverPreview ? (
                <div className="relative aspect-[3/1] rounded-xl overflow-hidden border border-emerald-500/30 group shadow-md">
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCoverCropOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <CropIcon className="size-3.5" /> Re-crop
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-white/15 hover:border-emerald-500/50 bg-white/[0.02] hover:bg-emerald-500/[0.04] text-xs text-neutral-400 hover:text-white transition-all cursor-pointer">
                  <Upload className="size-4 text-neutral-400 mb-1" />
                  <span className="font-semibold text-[11.5px]">Upload Cover Banner</span>
                  <span className="text-[9.5px] text-neutral-500">Supports 3:1 banner cropping</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* 2. Avatar Upload (1:1 Aspect Ratio) */}
            <div className="flex items-center gap-3.5 pt-2 border-t border-white/[0.06]">
              <div className="relative shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="size-14 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-md"
                  />
                ) : (
                  <div className="size-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400">
                    <User className="size-6" />
                  </div>
                )}
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => setIsAvatarCropOpen(true)}
                    className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform"
                    title="Re-crop avatar"
                  >
                    <CropIcon className="size-3 stroke-[2.5]" />
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <span className="text-xs font-semibold text-white block">
                  Profile Avatar (Required)
                </span>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-neutral-200 font-medium cursor-pointer transition-all border border-white/10">
                    <Upload className="size-3.5" />
                    <span>{avatarPreview ? "Change Photo" : "Upload & Crop"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileSelect}
                      className="hidden"
                    />
                  </label>

                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => setIsAvatarCropOpen(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-xs text-emerald-400 font-semibold cursor-pointer transition-all border border-emerald-500/30"
                    >
                      <CropIcon className="size-3" /> Re-crop
                    </button>
                  )}
                </div>
              </div>
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
            className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-xl cursor-pointer"
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

      {/* Avatar Image Cropper Modal (1:1 Aspect Ratio) */}
      <ImageCropModal
        isOpen={isAvatarCropOpen}
        imageSrc={rawAvatarSrc}
        title="Crop Profile Avatar"
        fileName="avatar.jpg"
        aspectRatio={1}
        isCircular={false}
        onCropComplete={handleAvatarCropComplete}
        onClose={() => setIsAvatarCropOpen(false)}
      />

      {/* Cover Banner Image Cropper Modal (3:1 Aspect Ratio) */}
      <ImageCropModal
        isOpen={isCoverCropOpen}
        imageSrc={rawCoverSrc}
        title="Crop Profile Banner"
        fileName="coverImage.jpg"
        aspectRatio={3}
        isCircular={false}
        onCropComplete={handleCoverCropComplete}
        onClose={() => setIsCoverCropOpen(false)}
      />
    </div>
  );
}

