import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Users, Search, RefreshCw, X, UserPlus, Check, Sparkles, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/auth.service";
import { followToggle } from "@/services/follow.service";
import { getAvatarUrl } from "@/utils/avatar.utils";
import toast from "react-hot-toast";

// Fisher-Yates Shuffle
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function PeopleToFollowModal({
  isOpen,
  onClose,
  onFollowChange,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [followingStates, setFollowingStates] = useState({});
  const [togglingId, setTogglingId] = useState(null);

  // Fetch & shuffle unfollowed users every time the modal opens
  const fetchAndShuffleUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authService.getSuggestedUsers({ limit: 100 });
      const rawUsers = Array.isArray(res?.data) ? res.data : [];
      // Randomize order each time
      const randomized = shuffleArray(rawUsers);
      setUsers(randomized);

      // Initialize follow state map
      const initialFollowMap = {};
      randomized.forEach((u) => {
        initialFollowMap[u.username] = false;
      });
      setFollowingStates(initialFollowMap);
    } catch (err) {
      console.log("Error loading people to follow:", err);
      toast.error("Failed to load suggested players.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      fetchAndShuffleUsers();
    }
  }, [isOpen, fetchAndShuffleUsers]);

  // Keyboard close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Follow / Unfollow toggle
  const handleToggleFollow = async (user) => {
    if (!user?.username) return;
    const username = user.username;
    const isCurrentlyFollowing = !!followingStates[username];
    const newFollowState = !isCurrentlyFollowing;

    setTogglingId(user._id);

    // Optimistic update
    setFollowingStates((prev) => ({
      ...prev,
      [username]: newFollowState,
    }));

    try {
      await followToggle(username);
      if (onFollowChange) {
        onFollowChange(username, newFollowState);
      }
      toast.success(
        newFollowState
          ? `Now following ${user.fullName || `@${username}`}!`
          : `Unfollowed @${username}`
      );
    } catch (err) {
      console.log("Follow toggle error:", err);
      // Rollback
      setFollowingStates((prev) => ({
        ...prev,
        [username]: isCurrentlyFollowing,
      }));
      toast.error("Could not update follow status.");
    } finally {
      setTogglingId(null);
    }
  };

  // Filtered by Search
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.fullName && u.fullName.toLowerCase().includes(q)) ||
        (u.username && u.username.toLowerCase().includes(q)) ||
        (u.footballRole && u.footballRole.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/75 transition-opacity duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-lg w-full rounded-3xl bg-[#090e15] border border-white/10 p-5 sm:p-6 space-y-4 shadow-2xl relative transition-transform duration-150 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
              <Users className="size-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white font-display tracking-tight">
                  People to Follow
                </h3>
                <Badge variant="emerald" className="text-[10px] px-2 py-0 font-bold">
                  {users.length} Players
                </Badge>
              </div>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">
                Discover footballers and squad captains in random order
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={fetchAndShuffleUsers}
              disabled={loading}
              title="Reshuffle player list"
              className="size-8.5 rounded-2xl bg-white/5 hover:bg-emerald-500/20 text-neutral-300 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="size-8.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative shrink-0">
          <Search className="size-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search footballers by name, @username, or role..."
            className="w-full h-10.5 pl-9.5 pr-4 rounded-2xl bg-black/60 border border-white/10 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="size-5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* Player List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-[250px]">
          {loading ? (
            <div className="p-12 text-center text-xs text-neutral-400 space-y-2.5">
              <div className="size-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-semibold text-neutral-300">Shuffling players...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isFollowing = !!followingStates[user.username];
              const isToggling = togglingId === user._id;

              return (
                <div
                  key={user._id}
                  className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-emerald-500/30 transition-all flex items-center justify-between gap-3 group"
                >
                  <Link
                    to={`/channel/${user.username}`}
                    onClick={onClose}
                    className="flex items-center gap-3 min-w-0 flex-1 group/user"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={getAvatarUrl(user, user.fullName || user.username)}
                        alt={user.fullName || user.username}
                        className="size-11 rounded-full aspect-square object-cover ring-1 ring-white/10 shadow-sm group-hover/user:ring-emerald-500/50 transition-all"
                        loading="lazy"
                      />
                      {user.role === "admin" && (
                        <div className="absolute -bottom-1 -right-1 size-4.5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-md">
                          <ShieldCheck className="size-3 stroke-[2.5]" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white group-hover/user:text-emerald-400 transition-colors truncate font-display">
                          {user.fullName || user.username}
                        </h4>
                      </div>
                      <p className="text-xs text-neutral-400 truncate mt-0.5 font-medium">
                        @{user.username}
                        {user.footballRole ? ` • ${user.footballRole}` : ""}
                      </p>
                    </div>
                  </Link>

                  <Button
                    type="button"
                    onClick={() => handleToggleFollow(user)}
                    disabled={isToggling}
                    size="sm"
                    variant={isFollowing ? "outline" : "primary"}
                    className={`rounded-xl text-xs font-bold px-4 h-8.5 shrink-0 transition-all cursor-pointer ${
                      isFollowing
                        ? "bg-neutral-800/80 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-400 border-white/10 hover:border-rose-500/30"
                        : "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20"
                    }`}
                  >
                    {isToggling ? (
                      <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isFollowing ? (
                      <span className="flex items-center gap-1">
                        <Check className="size-3.5" /> Following
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <UserPlus className="size-3.5" /> Follow
                      </span>
                    )}
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="p-10 text-center text-xs text-neutral-400 space-y-2">
              <Users className="size-8 text-neutral-600 mx-auto" />
              <p className="font-semibold text-white">No players found</p>
              <p className="text-neutral-500">
                {searchQuery ? `No players match "${searchQuery}"` : "You are following everyone on the radar!"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs text-neutral-400 shrink-0">
          <span className="flex items-center gap-1.5 text-neutral-400">
            <Sparkles className="size-3.5 text-emerald-400" />
            <span>Randomized each time you open</span>
          </span>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs font-bold text-neutral-300 hover:text-white"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
