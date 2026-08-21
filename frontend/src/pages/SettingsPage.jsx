import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  User,
  Shield,
  Trophy,
  Lock,
  Upload,
  UploadCloud,
  Save,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Star,
  Eye,
  Grid,
  Edit3,
  Heart,
  MessageCircle,
  PlusCircle,
  Sparkles,
  Camera,
  Image as ImageIcon,
  X,
  RefreshCw,
  Mail,
  KeyRound,
  ExternalLink,
  Check,
  EyeOff,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { sliceLogin } from "@/features/authSlice";
import { authService } from "@/services/auth.service";
import { postService } from "@/services/social.service";
import { countries, clubs, players } from "@/components/FootballPreferences/FootballPreferences";
import { clubsByLeague } from "@/data/clubsByLeague";
import { countriesByTournament } from "@/data/countriesByTournament";
import LeagueClubPicker from "@/components/profile/LeagueClubPicker";
import CountryPicker from "@/components/profile/CountryPicker";
import PlayerPicker from "@/components/profile/PlayerPicker";
import { getAvatarUrl, getCoverUrl } from "@/utils/avatar.utils";
import EditPostModal from "@/components/common/EditPostModal";
import { socket } from "@/utils/socket";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("profile");

  const [fullName, setFullName] = useState(userData?.fullName || "");
  const [email, setEmail] = useState(userData?.email || "");

  // Privacy & Online Status States
  const [showOnlineStatus, setShowOnlineStatus] = useState(
    userData?.privacy?.showOnlineStatus ?? userData?.showOnlineStatus ?? true
  );
  const [showLastSeen, setShowLastSeen] = useState(
    userData?.privacy?.showLastSeen ?? true
  );
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Football Identity Preferences with live public image resolution
  const [favouriteCountry, setFavouriteCountry] = useState(
    userData?.favouriteCountry?.name || "Argentina"
  );
  const [favouriteClub, setFavouriteClub] = useState(
    userData?.favouriteClub?.name || "Real Madrid"
  );
  const [favouritePlayer, setFavouritePlayer] = useState(
    userData?.favouritePlayer?.name || "Lionel Messi"
  );

  // Avatar & Cover Upload State + Previews + Drag & Drop
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const coverInputRef = useRef(null);

  // Password Form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Manage Posts Tab State
  const [myPosts, setMyPosts] = useState([]);
  const [loadingMyPosts, setLoadingMyPosts] = useState(false);
  const [editingPostModal, setEditingPostModal] = useState(null);

  const loadMyPosts = async () => {
    if (!userData?._id) return;
    setLoadingMyPosts(true);
    try {
      const res = await postService.getUserPosts(userData._id);
      const data = res?.data || [];
      setMyPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error loading user posts:", err);
      setMyPosts([]);
    } finally {
      setLoadingMyPosts(false);
    }
  };

  useEffect(() => {
    if (activeTab === "posts") {
      loadMyPosts();
    }
  }, [activeTab, userData?._id]);

  // Always load fresh user profile on settings mount
  useEffect(() => {
    const fetchFreshUser = async () => {
      try {
        const res = await authService.getCurrentUser();
        const freshUser = res?.data?.user || res?.data;
        if (freshUser) {
          dispatch(sliceLogin(freshUser));
        }
      } catch (err) {
        console.log("Error loading fresh user in settings:", err);
      }
    };
    fetchFreshUser();
  }, [dispatch]);

  // Sync state if userData changes
  useEffect(() => {
    if (userData) {
      setFullName(userData.fullName || "");
      setEmail(userData.email || "");
      if (userData.favouriteCountry?.name) setFavouriteCountry(userData.favouriteCountry.name);
      if (userData.favouriteClub?.name) setFavouriteClub(userData.favouriteClub.name);
      if (userData.favouritePlayer?.name) setFavouritePlayer(userData.favouritePlayer.name);
      if (userData.showOnlineStatus !== undefined) {
        setShowOnlineStatus(Boolean(userData.showOnlineStatus));
      } else if (userData.privacy?.showOnlineStatus !== undefined) {
        setShowOnlineStatus(Boolean(userData.privacy.showOnlineStatus));
      }
      if (userData.privacy?.showLastSeen !== undefined) {
        setShowLastSeen(Boolean(userData.privacy.showLastSeen));
      }
    }
  }, [userData]);

  // Avatar Drag & Drop Handlers
  const handleAvatarDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAvatar(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      toast.success("Avatar image selected!");
    } else {
      toast.error("Please drop a valid image file.");
    }
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  // Cover Drag & Drop Handlers
  const handleCoverDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      toast.success("Cover image selected!");
    } else {
      toast.error("Please drop a valid image file.");
    }
  };

  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  // Resolve current active public images for live preview
  const foundTournamentCountry = countriesByTournament
    .flatMap((t) => t.countries)
    .find((c) => c.name.toLowerCase() === favouriteCountry.toLowerCase());

  const currentCountryObj =
    foundTournamentCountry ||
    countries.find(
      (c) => c.name.toLowerCase() === favouriteCountry.toLowerCase()
    ) || { name: favouriteCountry, image: "/country/fifa-world-cup-2026.football-logos.cc/argentina-national-team.football-logos.cc.png" };

  const foundLeagueClub = clubsByLeague
    .flatMap((l) => l.clubs)
    .find((c) => c.name.toLowerCase() === favouriteClub.toLowerCase());

  const currentClubObj =
    foundLeagueClub ||
    clubs.find(
      (c) => c.name.toLowerCase() === favouriteClub.toLowerCase()
    ) || { name: favouriteClub, image: "/club/english-premier-league-2026-2027.football-logos.cc/arsenal.football-logos.cc.png" };

  const currentPlayerObj = players.find(
    (p) => p.name.toLowerCase() === favouritePlayer.toLowerCase()
  ) || { name: favouritePlayer, image: "/player/messi.png" };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update text & preference details with public image paths
      await authService.updateAccountDetails({
        fullName,
        email,
        favouriteCountry: {
          name: currentCountryObj.name,
          flag: currentCountryObj.image,
        },
        favouriteClub: {
          name: currentClubObj.name,
          logo: currentClubObj.image,
        },
        favouritePlayer: {
          name: currentPlayerObj.name,
          image: currentPlayerObj.image,
        },
      });

      // 2. Upload avatar if selected
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatarFile);
        await authService.updateAvatar(avatarFormData);
      }

      // 3. Upload cover if selected
      if (coverFile) {
        const coverFormData = new FormData();
        coverFormData.append("coverImage", coverFile);
        await authService.updateCoverImage(coverFormData);
      }

      // 4. Fetch updated user profile
      const userRes = await authService.getCurrentUser();
      const freshUser = userRes?.data?.user || userRes?.data;
      if (freshUser) {
        dispatch(sliceLogin(freshUser));
      }

      toast.success("Profile & images updated successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await authService.changeCurrentPassword({ oldPassword, newPassword });
      toast.success("Password changed successfully! 🔒✨");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password change error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOnlinePrivacy = async (newValue) => {
    setShowOnlineStatus(newValue);
    setSavingPrivacy(true);
    try {
      const res = await authService.updateAccountDetails({
        showOnlineStatus: newValue,
        privacy: {
          showOnlineStatus: newValue,
          showLastSeen: showLastSeen,
        },
      });
      const updated = res?.data?.user || res?.data;
      if (updated) {
        dispatch(sliceLogin(updated));
      }
      try {
        socket.emit("update-privacy-settings");
      } catch (e) {
        console.log("Socket emit error:", e);
      }
      toast.success(
        newValue
          ? "Online status is now visible to other players."
          : "Online status is now hidden. You are appearing offline."
      );
    } catch (err) {
      console.log("Error updating privacy:", err);
      toast.error("Failed to update privacy settings.");
      setShowOnlineStatus(!newValue);
    } finally {
      setSavingPrivacy(false);
    }
  };

  const handleToggleLastSeenPrivacy = async (newValue) => {
    setShowLastSeen(newValue);
    setSavingPrivacy(true);
    try {
      const res = await authService.updateAccountDetails({
        privacy: {
          showOnlineStatus: showOnlineStatus,
          showLastSeen: newValue,
        },
      });
      const updated = res?.data?.user || res?.data;
      if (updated) {
        dispatch(sliceLogin(updated));
      }
      toast.success(
        newValue
          ? "Last active timestamp is now visible."
          : "Last active timestamp is now hidden."
      );
    } catch (err) {
      console.log("Error updating last seen privacy:", err);
      toast.error("Failed to update privacy settings.");
      setShowLastSeen(!newValue);
    } finally {
      setSavingPrivacy(false);
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setMyPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  const handlePostDeleted = (deletedId) => {
    setMyPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  // Active current displayed images
  const displayAvatar =
    avatarPreview ||
    getAvatarUrl(userData, "Player");

  const displayCover =
    coverPreview ||
    getCoverUrl(userData);

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-in fade-in duration-300 pb-16">
      {/* Reusable Edit Post Modal */}
      {editingPostModal && (
        <EditPostModal
          post={editingPostModal}
          isOpen={!!editingPostModal}
          onClose={() => setEditingPostModal(null)}
          onPostUpdated={handlePostUpdated}
          onPostDeleted={handlePostDeleted}
        />
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
              Account & Football Settings
            </h1>
            <Badge variant="emerald" className="text-xs px-2.5 py-0.5 font-bold">
              Pro Hub
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Customize your player profile, avatar, pitch cover banner, privacy controls, and manage your published posts.
          </p>
        </div>

        {userData?.username && (
          <Link
            to={`/channel/${userData.username}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-emerald-400 transition-all shadow-sm"
          >
            <span>View Public Channel</span>
            <ExternalLink className="size-3.5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Navigation Tabs */}
        <div className="md:col-span-4 flex md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0 gap-2 md:gap-2.5 custom-scrollbar">
          {[
            {
              id: "profile",
              label: "Player Profile",
              desc: "Avatar, Cover & Personal details",
              icon: User,
            },
            {
              id: "football",
              label: "Football Identity",
              desc: "Country, Club & Idol preferences",
              icon: Trophy,
            },
            {
              id: "privacy",
              label: "Privacy & Visibility",
              desc: "Online presence & status controls",
              icon: ShieldCheck,
            },
            {
              id: "posts",
              label: "Manage & Edit Posts",
              desc: `${myPosts.length} pitch posts published`,
              icon: Grid,
              badge: myPosts.length,
            },
            {
              id: "security",
              label: "Password & Security",
              desc: "Account password & credentials",
              icon: Lock,
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl sm:rounded-3xl text-left transition-all cursor-pointer group border shrink-0 md:shrink md:w-full ${isActive
                    ? "bg-emerald-500 text-neutral-950 border-emerald-400 shadow-xl shadow-emerald-500/20 font-extrabold"
                    : "bg-[#0b1118] text-neutral-300 hover:bg-white/[0.04] border-white/10"
                  }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                  <div
                    className={`size-8 sm:size-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isActive
                        ? "bg-neutral-950/20 text-neutral-950"
                        : "bg-white/5 text-emerald-400 group-hover:bg-emerald-500/15"
                      }`}
                  >
                    <Icon className="size-4 sm:size-5" />
                  </div>
                  <div className="min-w-0">
                    <h4
                      className={`text-xs sm:text-sm font-bold truncate ${isActive ? "text-neutral-950" : "text-white"
                        }`}
                    >
                      {item.label}
                    </h4>
                    <p
                      className={`hidden md:block text-[11px] truncate mt-0.5 ${isActive ? "text-neutral-900/80 font-semibold" : "text-neutral-400"
                        }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-bold shrink-0 ml-2 ${isActive
                        ? "bg-neutral-950/20 text-neutral-950"
                        : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-8">
          {/* TAB 1: PLAYER PROFILE & DRAG-DROP MEDIA */}
          {activeTab === "profile" && (
            <Card className="p-6 sm:p-7 bg-[#0b1118] border-white/10 rounded-3xl space-y-7 shadow-2xl">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                    <User className="size-5 text-emerald-400" />
                    <span>Personal Profile & Visuals</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Drag and drop images to update your avatar and cover banner.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* 1. COVER BANNER DRAG & DROP ZONE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="size-3.5 text-emerald-400" /> Cover Banner
                    </Label>
                    {coverFile && (
                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        className="text-[11px] text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <X className="size-3" /> Reset Cover
                      </button>
                    )}
                  </div>

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingCover(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDraggingCover(false);
                    }}
                    onDrop={handleCoverDrop}
                    onClick={() => coverInputRef.current?.click()}
                    className={`relative w-full h-44 sm:h-52 rounded-3xl overflow-hidden border-2 border-dashed transition-all cursor-pointer group flex flex-col items-center justify-center text-center p-4 ${isDraggingCover
                        ? "border-emerald-400 bg-emerald-500/15 scale-[1.01]"
                        : "border-white/15 bg-black/40 hover:border-emerald-500/50 hover:bg-black/60"
                      }`}
                  >
                    {/* Background Cover Image Preview */}
                    <img
                      src={displayCover}
                      alt="Cover Preview"
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-30 group-hover:scale-105 transition-all duration-300"
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1118] via-black/40 to-transparent" />

                    {/* Drag Drop Call to Action */}
                    <div className="relative z-10 space-y-2 max-w-sm px-4">
                      <div className="size-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                        <UploadCloud className="size-6" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-white font-display">
                          {isDraggingCover ? "Drop cover image here" : "Drag & drop cover banner here"}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          or click to browse from device (Recommended 1920x600)
                        </p>
                      </div>
                      {coverFile && (
                        <Badge variant="emerald" className="text-[10px] py-0.5 px-3 font-bold">
                          ✓ {coverFile.name}
                        </Badge>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={coverInputRef}
                      onChange={handleCoverSelect}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* 2. AVATAR DRAG & DROP ZONE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="size-3.5 text-emerald-400" /> Footballer Avatar
                    </Label>
                    {avatarFile && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="text-[11px] text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <X className="size-3" /> Reset Avatar
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-3xl bg-black/40 border border-white/10">
                    {/* Avatar Preview Dropzone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingAvatar(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDraggingAvatar(false);
                      }}
                      onDrop={handleAvatarDrop}
                      onClick={() => avatarInputRef.current?.click()}
                      className={`relative size-24 sm:size-28 rounded-3xl overflow-hidden border-2 border-dashed transition-all cursor-pointer group shrink-0 ${isDraggingAvatar
                          ? "border-emerald-400 bg-emerald-500/20 scale-105"
                          : "border-white/20 hover:border-emerald-500/60"
                        }`}
                    >
                      <img
                        src={displayAvatar}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                        <Camera className="size-5 text-emerald-400" />
                        <span className="text-[10px] font-bold mt-1">Change</span>
                      </div>

                      <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleAvatarSelect}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white">Drag & drop profile avatar</h4>
                      <p className="text-xs text-neutral-400">
                        Supports PNG, JPG, or GIF up to 5MB. Circular cropped on profile wall.
                      </p>
                      <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => avatarInputRef.current?.click()}
                          className="h-8 rounded-xl text-xs font-bold gap-1.5 cursor-pointer bg-white/10 hover:bg-white/15"
                        >
                          <Upload className="size-3.5" /> Select Avatar
                        </Button>
                        {avatarFile && (
                          <Badge variant="emerald" className="text-[10px] py-1 px-2.5 font-bold">
                            ✓ {avatarFile.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. TEXT INPUTS: FULL NAME & EMAIL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs text-neutral-300 font-semibold">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="size-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="pl-9.5 h-11 rounded-2xl bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-emerald-500 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs text-neutral-300 font-semibold">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="size-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="pl-9.5 h-11 rounded-2xl bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-emerald-500 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    className="py-3 px-7 rounded-2xl text-xs sm:text-sm font-bold gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <Save className="size-4" /> {loading ? "Saving Profile..." : "Save Profile & Visuals"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 2: FOOTBALL IDENTITY */}
          {activeTab === "football" && (
            <Card className="p-6 sm:p-7 bg-[#0b1118] border-white/10 rounded-3xl space-y-7 shadow-2xl">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                  <Trophy className="size-5 text-emerald-400" />
                  <span>Football Allegiance & Idol</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Pick your favorite national team, club, and player to display on your channel.
                </p>
              </div>

              {/* Live Preview Cards (Prominent Sizing) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-3xl bg-black/50 border border-white/10">
                {/* 1. Country */}
                <div className="flex flex-col items-center justify-between p-4 rounded-2xl bg-[#0f1722] border border-white/10 hover:border-emerald-500/40 transition-all group shadow-lg">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    National Team
                  </span>
                  <div className="size-28 sm:size-32 rounded-2xl bg-[#141f2d] border border-white/10 flex items-center justify-center p-3 shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
                    <img
                      src={currentCountryObj.image}
                      alt={currentCountryObj.name}
                      className="w-full h-full object-contain drop-shadow-xl"
                    />
                  </div>
                  <span className="text-sm font-extrabold text-white text-center mt-2.5 truncate max-w-full font-display">
                    {currentCountryObj.name}
                  </span>
                </div>

                {/* 2. Club */}
                <div className="flex flex-col items-center justify-between p-4 rounded-2xl bg-[#0f1722] border border-white/10 hover:border-emerald-500/40 transition-all group shadow-lg">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Football Club
                  </span>
                  <div className="size-28 sm:size-32 rounded-2xl bg-[#141f2d] border border-white/10 flex items-center justify-center p-3 shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
                    <img
                      src={currentClubObj.image}
                      alt={currentClubObj.name}
                      className="w-full h-full object-contain drop-shadow-xl"
                    />
                  </div>
                  <span className="text-sm font-extrabold text-white text-center mt-2.5 truncate max-w-full font-display">
                    {currentClubObj.name}
                  </span>
                </div>

                {/* 3. Player / Idol */}
                <div className="flex flex-col items-center justify-between p-4 rounded-2xl bg-[#0f1722] border border-white/10 hover:border-emerald-500/40 transition-all group shadow-lg">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Football Idol / GOAT
                  </span>
                  <div className="size-28 sm:size-32 rounded-2xl bg-[#141f2d] border border-white/10 flex items-center justify-center p-1.5 shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
                    <img
                      src={currentPlayerObj.image}
                      alt={currentPlayerObj.name}
                      className="w-full h-full object-cover rounded-xl drop-shadow-xl"
                    />
                  </div>
                  <span className="text-sm font-extrabold text-white text-center mt-2.5 truncate max-w-full font-display">
                    {currentPlayerObj.name}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Beautiful Country / National Team Visual Selector */}
                <CountryPicker
                  selectedCountry={favouriteCountry}
                  onChange={(name) => setFavouriteCountry(name)}
                />

                {/* Beautiful League & Club Visual Selector */}
                <LeagueClubPicker
                  selectedClub={favouriteClub}
                  onChange={(clubName) => setFavouriteClub(clubName)}
                />

                {/* Beautiful Football Idol Visual Selector */}
                <PlayerPicker
                  selectedPlayer={favouritePlayer}
                  onChange={(playerName) => setFavouritePlayer(playerName)}
                />

                <div className="pt-3 border-t border-white/10 flex items-center justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    className="py-3 px-7 rounded-2xl text-xs sm:text-sm font-bold gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <Save className="size-4" /> {loading ? "Saving..." : "Save Identity Preferences"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 3: MANAGE & EDIT POSTS */}
          {activeTab === "posts" && (
            <Card className="p-6 sm:p-7 bg-[#0b1118] border-white/10 rounded-3xl space-y-6 shadow-2xl">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                    <Grid className="size-5 text-emerald-400" />
                    <span>Manage Published Posts</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    You have published {myPosts.length} pitch post{myPosts.length === 1 ? "" : "s"}.
                  </p>
                </div>

                <Link to="/create-post">
                  <Button variant="primary" size="sm" className="rounded-2xl text-xs gap-1.5 font-bold cursor-pointer shadow-md">
                    <PlusCircle className="size-4" /> New Post
                  </Button>
                </Link>
              </div>

              {loadingMyPosts ? (
                <div className="p-12 text-center text-xs text-neutral-400 space-y-2">
                  <div className="size-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Loading your pitch posts...</p>
                </div>
              ) : myPosts.length > 0 ? (
                <div className="space-y-3.5">
                  {myPosts.map((post) => {
                    const mediaUrl =
                      post.thumbnail?.url ||
                      (Array.isArray(post.media) && post.media[0]?.url) ||
                      post.media?.[0] ||
                      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300";

                    return (
                      <div
                        key={post._id}
                        className="p-4 rounded-3xl bg-black/40 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={mediaUrl}
                            alt="Post thumbnail"
                            className="size-16 rounded-2xl object-cover ring-1 ring-white/10 shrink-0 bg-neutral-900 shadow-sm"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[280px]">
                                {post.caption || "No caption"}
                              </span>
                              {post.section?.name && (
                                <Badge variant="emerald" className="text-[10px] py-0 px-2 font-bold">
                                  {post.section.name}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-medium">
                              <span>
                                {post.createdAt
                                  ? new Date(post.createdAt).toLocaleDateString()
                                  : "Recent"}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-red-400">
                                <Heart className="size-3 fill-red-400" />
                                {post.likesCount || 0}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-neutral-300">
                                <MessageCircle className="size-3" />
                                {post.commentsCount || 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => setEditingPostModal(post)}
                          size="sm"
                          variant="secondary"
                          className="rounded-2xl text-xs font-bold h-9 px-4.5 bg-white/10 hover:bg-emerald-500 hover:text-neutral-950 border border-white/10 gap-1.5 cursor-pointer shrink-0 w-full sm:w-auto transition-all shadow-sm"
                        >
                          <Edit3 className="size-3.5" /> Edit Post
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center rounded-3xl bg-black/30 border border-white/5 space-y-3">
                  <Grid className="size-8 text-neutral-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">No Posts Published Yet</h4>
                  <p className="text-xs text-neutral-400">
                    Publish your match photos, highlights, or videos to manage them here.
                  </p>
                  <Link to="/create-post">
                    <Button variant="primary" size="sm" className="rounded-2xl text-xs mt-2 font-bold cursor-pointer">
                      Upload First Post
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          )}

          {/* TAB 4: PASSWORD & SECURITY */}
          {activeTab === "security" && (
            <Card className="p-6 sm:p-7 bg-[#0b1118] border-white/10 rounded-3xl space-y-6 shadow-2xl">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                  <Lock className="size-5 text-emerald-400" />
                  <span>Password & Security</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Ensure your account is using a strong and secure password.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="oldPassword" className="text-xs text-neutral-300 font-semibold">
                    Current Password
                  </Label>
                  <div className="relative">
                    <KeyRound className="size-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="oldPassword"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="pl-9.5 h-11 rounded-2xl bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-emerald-500 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-xs text-neutral-300 font-semibold">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="size-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pl-9.5 h-11 rounded-2xl bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-emerald-500 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs text-neutral-300 font-semibold">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="size-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="pl-9.5 h-11 rounded-2xl bg-black/50 border-white/10 text-white focus:ring-1 focus:ring-emerald-500 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    className="py-3 px-7 rounded-2xl text-xs sm:text-sm font-bold gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <Lock className="size-4" /> {loading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 5: PRIVACY & VISIBILITY CONTROLS */}
          {activeTab === "privacy" && (
            <Card className="p-6 sm:p-7 bg-[#0b1118] border-white/10 rounded-3xl space-y-7 shadow-2xl animate-in fade-in">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-400" />
                  <span>Privacy & Online Presence</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Choose who can see when you are active on FootballHub and manage your visibility across chats and radars.
                </p>
              </div>

              <div className="space-y-6">
                {/* Setting 1: Show Online Status */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-2.5 rounded-full ${showOnlineStatus
                            ? "bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse"
                            : "bg-neutral-600"
                          }`}
                      />
                      <h4 className="text-sm font-bold text-white font-display">
                        Show Online / Active Status
                      </h4>
                      <Badge
                        variant={showOnlineStatus ? "emerald" : "outline"}
                        className="text-[10px] py-0 px-2 font-bold"
                      >
                        {showOnlineStatus ? "Online Visible" : "Hidden (Offline)"}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      When enabled, friends and other footballers can see the green active indicator when you are online in messaging, lobbies, and radar lists. When disabled, you will appear completely offline to everyone.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleOnlinePrivacy(!showOnlineStatus)}
                    disabled={savingPrivacy}
                    className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showOnlineStatus ? "bg-emerald-500 shadow-md shadow-emerald-500/30" : "bg-neutral-800"
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${showOnlineStatus ? "translate-x-6" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

                {/* Setting 2: Last Seen Timestamp */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="size-4 text-emerald-400" />
                      <h4 className="text-sm font-bold text-white font-display">
                        Last Active / Last Seen Time
                      </h4>
                      <Badge
                        variant={showLastSeen ? "emerald" : "outline"}
                        className="text-[10px] py-0 px-2 font-bold"
                      >
                        {showLastSeen ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Allow other players to see when you were last active on FootballHub inside direct message headers and user profiles.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleLastSeenPrivacy(!showLastSeen)}
                    disabled={savingPrivacy}
                    className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showLastSeen ? "bg-emerald-500 shadow-md shadow-emerald-500/30" : "bg-neutral-800"
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${showLastSeen ? "translate-x-6" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

                {/* Privacy Info Notice */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <Sparkles className="size-4 text-emerald-400" />
                    <span>Ghost Mode & Privacy Protection</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Turning off your active status instantly updates the live socket server. You can still send messages, explore feeds, and join matches seamlessly while staying completely incognito.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
