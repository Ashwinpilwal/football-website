import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserPlus,
  Search,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getUserFollowers,
  getUserFollowing,
  getMyFollowing,
  followToggle,
} from "@/services/follow.service";
import { getAvatarUrl } from "@/utils/avatar.utils";
import toast from "react-hot-toast";

export default function FollowersModal({
  isOpen,
  onClose,
  username,
  initialTab = "followers",
  onFollowChange,
}) {
  const { userData, status } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState(initialTab); // "followers" | "following"
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersPage, setFollowersPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);
  const [hasMoreFollowers, setHasMoreFollowers] = useState(false);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(false);
  const [myFollowingIds, setMyFollowingIds] = useState(new Set());
  const [togglingId, setTogglingId] = useState(null);

  // Sync initial tab when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSearchQuery("");
      setFollowersPage(1);
      setFollowingPage(1);
    }
  }, [isOpen, initialTab]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch initial followers, following, and my own following list
  useEffect(() => {
    if (!isOpen || !username) return;

    let isMounted = true;

    const loadFollowData = async () => {
      setLoading(true);
      try {
        const promises = [
          getUserFollowers(username, 1, 30),
          getUserFollowing(username, 1, 30),
        ];

        // If logged in, fetch logged-in user's own following list for accurate follow toggle state
        if (status && userData?._id) {
          promises.push(getMyFollowing(1, 100));
        }

        const [followersRes, followingRes, myFollowingRes] =
          await Promise.allSettled(promises);

        if (!isMounted) return;

        // Process Followers
        if (followersRes.status === "fulfilled") {
          const raw = followersRes.value?.data;
          const docs = raw?.docs || (Array.isArray(raw) ? raw : []);
          const extracted = docs
            .map((item) => item.follower || item)
            .filter((u) => u && u._id);
          setFollowers(extracted);
          setHasMoreFollowers(Boolean(raw?.hasNextPage));
        }

        // Process Following
        if (followingRes.status === "fulfilled") {
          const raw = followingRes.value?.data;
          const docs = raw?.docs || (Array.isArray(raw) ? raw : []);
          const extracted = docs
            .map((item) => item.following || item)
            .filter((u) => u && u._id);
          setFollowing(extracted);
          setHasMoreFollowing(Boolean(raw?.hasNextPage));
        }

        // Process My Following Set
        if (myFollowingRes && myFollowingRes.status === "fulfilled") {
          const raw = myFollowingRes.value?.data;
          const docs = raw?.docs || (Array.isArray(raw) ? raw : []);
          const ids = new Set(
            docs
              .map((item) => item.following?._id || item._id)
              .filter(Boolean)
              .map((id) => id.toString())
          );
          setMyFollowingIds(ids);
        }
      } catch (err) {
        console.log("Error loading follow list:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFollowData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, username, status, userData?._id]);

  // Load More Handler for current active tab
  const handleLoadMore = async () => {
    if (loadingMore || !username) return;
    setLoadingMore(true);

    try {
      if (activeTab === "followers" && hasMoreFollowers) {
        const nextPage = followersPage + 1;
        const res = await getUserFollowers(username, nextPage, 30);
        const raw = res?.data;
        const docs = raw?.docs || (Array.isArray(raw) ? raw : []);
        const extracted = docs
          .map((item) => item.follower || item)
          .filter((u) => u && u._id);

        setFollowers((prev) => {
          const existingIds = new Set(prev.map((u) => u._id?.toString()));
          const unique = extracted.filter((u) => !existingIds.has(u._id?.toString()));
          return [...prev, ...unique];
        });
        setFollowersPage(nextPage);
        setHasMoreFollowers(Boolean(raw?.hasNextPage));
      } else if (activeTab === "following" && hasMoreFollowing) {
        const nextPage = followingPage + 1;
        const res = await getUserFollowing(username, nextPage, 30);
        const raw = res?.data;
        const docs = raw?.docs || (Array.isArray(raw) ? raw : []);
        const extracted = docs
          .map((item) => item.following || item)
          .filter((u) => u && u._id);

        setFollowing((prev) => {
          const existingIds = new Set(prev.map((u) => u._id?.toString()));
          const unique = extracted.filter((u) => !existingIds.has(u._id?.toString()));
          return [...prev, ...unique];
        });
        setFollowingPage(nextPage);
        setHasMoreFollowing(Boolean(raw?.hasNextPage));
      }
    } catch (err) {
      console.log("Error loading more users:", err);
      toast.error("Failed to load more.");
    } finally {
      setLoadingMore(false);
    }
  };

  // Toggle follow/unfollow for a user in the list
  const handleToggleFollow = async (targetUser) => {
    if (!status || !userData) {
      toast.error("Please sign in to follow players.");
      return;
    }

    const targetId = targetUser._id?.toString();
    if (!targetId || targetId === userData._id?.toString()) return;

    setTogglingId(targetId);
    try {
      const res = await followToggle(targetUser.username);
      const isNowFollowing = res?.data?.isFollowing ?? !myFollowingIds.has(targetId);

      setMyFollowingIds((prev) => {
        const next = new Set(prev);
        if (isNowFollowing) {
          next.add(targetId);
        } else {
          next.delete(targetId);
        }
        return next;
      });

      toast.success(
        isNowFollowing
          ? `Followed @${targetUser.username}`
          : `Unfollowed @${targetUser.username}`
      );

      if (onFollowChange) {
        onFollowChange();
      }
    } catch (err) {
      console.log("Follow toggle error:", err);
      toast.error("Failed to update follow status.");
    } finally {
      setTogglingId(null);
    }
  };

  const currentList = activeTab === "followers" ? followers : following;

  // Filtered by Search Query
  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return currentList;
    return currentList.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q)
    );
  }, [currentList, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-[#0b1118] border border-white/15 p-5 sm:p-6 shadow-2xl space-y-4.5 animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh] contain-paint dynamic-sidebar-shift transition-transform duration-200 ease-out will-change-transform"
      >
        {/* Header & Tabs */}
        <div className="space-y-3 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                <Users className="size-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white font-display">
                  @{username}
                </h3>
                <p className="text-[11px] text-neutral-400">Community Connections</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/50 border border-white/10 text-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("followers")}
              className={`py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${activeTab === "followers"
                ? "bg-emerald-500 text-neutral-950 shadow-sm"
                : "text-neutral-400 hover:text-white"
                }`}
            >
              <span>Followers</span>
              <span
                className={`text-[10.5px] px-2 py-0.5 rounded-full font-mono font-black ${activeTab === "followers"
                  ? "bg-neutral-950/20 text-neutral-950"
                  : "bg-white/10 text-neutral-300"
                  }`}
              >
                {followers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("following")}
              className={`py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${activeTab === "following"
                ? "bg-emerald-500 text-neutral-950 shadow-sm"
                : "text-neutral-400 hover:text-white"
                }`}
            >
              <span>Following</span>
              <span
                className={`text-[10.5px] px-2 py-0.5 rounded-full font-mono font-black ${activeTab === "following"
                  ? "bg-neutral-950/20 text-neutral-950"
                  : "bg-white/10 text-neutral-300"
                  }`}
              >
                {following.length}
              </span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative shrink-0">
          <Search className="size-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full h-10 pl-9.5 pr-4 rounded-2xl bg-black/60 border border-white/10 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Users List with Hardware-Accelerated Fast Native Scrolling */}
        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar min-h-[220px] max-h-[360px] pr-1 overscroll-contain">
          {loading ? (
            <div className="p-12 text-center text-xs text-neutral-400 space-y-2">
              <div className="size-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Loading {activeTab}...</p>
            </div>
          ) : filteredList.length > 0 ? (
            <>
              {filteredList.map((user) => {
                const userId = user._id?.toString();
                const isSelf = userData?._id?.toString() === userId;
                const isFollowing = myFollowingIds.has(userId);
                const isToggling = togglingId === userId;
                const avatarUrl = getAvatarUrl(user, user.fullName || user.username);

                return (
                  <div
                    key={userId}
                    className="p-2.5 sm:p-3 flex items-center justify-between gap-3 hover:bg-white/[0.04] transition-colors rounded-2xl group"
                  >
                    <Link
                      to={`/channel/${user.username}`}
                      onClick={onClose}
                      className="flex items-center gap-3 min-w-0 flex-1 group/link"
                    >
                      <img
                        src={avatarUrl}
                        alt={user.fullName || user.username}
                        className="size-10.5 rounded-2xl object-cover ring-1 ring-white/10 group-hover/link:ring-emerald-400 shrink-0 shadow-sm transition-all"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover/link:text-emerald-400 truncate font-display transition-colors">
                            {user.fullName || user.username || "Footballer"}
                          </h4>
                          <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate font-medium">
                          @{user.username || "player"}
                        </p>
                      </div>
                    </Link>

                    {/* Follow / Following Toggle Button for Other Users */}
                    {!isSelf && status && (
                      <Button
                        type="button"
                        size="sm"
                        variant={isFollowing ? "outline" : "primary"}
                        onClick={() => handleToggleFollow(user)}
                        disabled={isToggling}
                        className={`rounded-xl text-xs font-bold px-3.5 h-8.5 shrink-0 transition-transform active:scale-95 cursor-pointer ${isFollowing
                          ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                          : "shadow-md shadow-emerald-500/20"
                          }`}
                      >
                        {isToggling ? (
                          <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isFollowing ? (
                          <span className="flex items-center gap-1">
                            <UserCheck className="size-3.5" /> Following
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <UserPlus className="size-3.5" /> Follow
                          </span>
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}

              {((activeTab === "followers" && hasMoreFollowers) ||
                (activeTab === "following" && hasMoreFollowing)) &&
                !searchQuery && (
                  <div className="pt-2 pb-1 text-center">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                    >
                      {loadingMore ? (
                        <>
                          <span className="size-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                          <span>Loading more...</span>
                        </>
                      ) : (
                        <span>Load more {activeTab}</span>
                      )}
                    </button>
                  </div>
                )}
            </>
          ) : (
            <div className="p-10 text-center text-xs text-neutral-400 space-y-2">
              <Users className="size-8 text-neutral-600 mx-auto" />
              <p className="font-semibold text-neutral-300">
                {searchQuery
                  ? "No users matching your search."
                  : activeTab === "followers"
                    ? `@${username} has no followers yet.`
                    : `@${username} is not following anyone yet.`}
              </p>
              <p className="text-[11px] text-neutral-500">
                {searchQuery
                  ? "Try searching with a different name or username."
                  : activeTab === "followers"
                    ? "Be the first to follow and connect!"
                    : "Followed footballers will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
