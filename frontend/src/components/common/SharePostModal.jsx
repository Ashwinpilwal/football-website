import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Share2,
  Search,
  Send,
  Check,
  Users,
  User,
  Copy,
  CheckCheck,
  X,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatService } from "@/services/social.service";
import { getMyFollowing } from "@/services/follow.service";
import { getAvatarUrl, optimizeGroupIcon } from "@/utils/avatar.utils";
import { socket } from "@/utils/socket";
import toast from "react-hot-toast";

export default function SharePostModal({ post, isOpen, onClose }) {
  const { userData, status } = useSelector((state) => state.auth);

  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [customCaption, setCustomCaption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "recent" | "squads" | "following"
  const [allChats, setAllChats] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentChatIds, setSentChatIds] = useState(new Set());
  const [sendingId, setSendingId] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Close on Escape key and reset on open
  useEffect(() => {
    if (!isOpen) return;
    setSelectedTargetId(null);
    setCustomCaption("");
    setSearchQuery("");
    setSentChatIds(new Set());

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !status || !userData) return;

    let isMounted = true;
    const loadShareTargets = async () => {
      setLoading(true);
      try {
        const [chatsRes, followingRes] = await Promise.allSettled([
          chatService.getAllUserChats(),
          getMyFollowing(),
        ]);

        if (!isMounted) return;

        const chatsData =
          chatsRes.status === "fulfilled" ? chatsRes.value?.data || [] : [];
        setAllChats(Array.isArray(chatsData) ? chatsData : []);

        const followingData =
          followingRes.status === "fulfilled"
            ? followingRes.value?.data || []
            : [];
        const extracted = (Array.isArray(followingData) ? followingData : [])
          .map((item) => item.following || item)
          .filter((u) => u && u._id);
        setFollowingUsers(extracted);
      } catch (err) {
        console.log("Error loading share targets:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadShareTargets();
    return () => {
      isMounted = false;
    };
  }, [isOpen, status, userData?._id]);

  // Extract cover image
  const postThumbnail = useMemo(() => {
    if (!post) return null;
    if (typeof post.thumbnail === "string" && post.thumbnail.trim()) return post.thumbnail.trim();
    if (post.thumbnail?.url && typeof post.thumbnail.url === "string") return post.thumbnail.url.trim();

    if (Array.isArray(post.media) && post.media.length > 0) {
      const first = post.media[0];
      if (typeof first === "string" && first.trim()) return first.trim();
      if (first?.url && typeof first.url === "string") return first.url.trim();
      if (first?.path && typeof first.path === "string") return first.path.trim();
      if (first?.mediaUrl && typeof first.mediaUrl === "string") return first.mediaUrl.trim();
    }

    if (typeof post.photo === "string" && post.photo.trim()) return post.photo.trim();
    if (post.photo?.url) return post.photo.url.trim();
    if (typeof post.image === "string" && post.image.trim()) return post.image.trim();
    if (post.image?.url) return post.image.url.trim();
    if (typeof post.video === "string" && post.video.trim()) return post.video.trim();
    if (post.video?.url) return post.video.url.trim();

    return null;
  }, [post]);

  const postAuthor = post?.owner?.fullName || post?.owner?.username || "Player";
  const postCaption = post?.caption || post?.content || "Match Highlight";
  const postUrl = `${window.location.origin}/channel/${
    post?.owner?.username || userData?.username || "player"
  }`;

  // Memoized Targets Cache for Instant Search & Zero-Lag Scrolling
  const shareTargets = useMemo(() => {
    const targets = [];
    const myId = String(userData?._id || userData?.id || "");
    const followingIds = new Set(followingUsers.map((u) => String(u._id || "")));

    // 1. Existing Chats (1-on-1 & Squads)
    allChats.forEach((c) => {
      if (c.isGroupChat) {
        targets.push({
          id: `chat_${c._id}`,
          chatId: c._id,
          isGroup: true,
          isFollowing: false,
          name: c.groupName || "Squad Group",
          username: null,
          avatar: c.groupIcon?.url || c.groupIcon || c.avatar?.url || c.avatar || null,
          subtitle: `${c.participants?.length || 1} squad members`,
          type: "squads",
        });
      } else {
        const other = Array.isArray(c.participants)
          ? c.participants.find((p) => (p._id || p)?.toString() !== myId)
          : null;
        if (other) {
          const otherId = String(other._id || "");
          const isFollowed = followingIds.has(otherId);

          targets.push({
            id: `chat_${c._id}`,
            chatId: c._id,
            userId: other._id,
            isGroup: false,
            isFollowing: isFollowed,
            name: other.fullName || other.username || "Player",
            username: other.username || "player",
            avatar: other.avatar?.url || other.avatar,
            user: other,
            subtitle: `@${other.username || "player"}${isFollowed ? " • Following" : " • Recent 1-on-1"}`,
            type: "recent",
          });
        }
      }
    });

    // 2. Followed Users who don't have an existing chat yet
    followingUsers.forEach((u) => {
      const uId = String(u._id || "");
      const exists = targets.some((t) => !t.isGroup && String(t.userId || "") === uId);
      if (!exists && uId !== myId) {
        targets.push({
          id: `user_${u._id}`,
          chatId: null,
          userId: u._id,
          isGroup: false,
          isFollowing: true,
          name: u.fullName || u.username || "Player",
          username: u.username || "player",
          avatar: u.avatar?.url || u.avatar,
          user: u,
          subtitle: `@${u.username || "player"} • Followed Player`,
          type: "following",
        });
      }
    });

    return targets;
  }, [allChats, followingUsers, userData?._id]);

  const filteredTargets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return shareTargets.filter((t) => {
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.username && t.username.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (activeTab === "all") return true;
      if (activeTab === "recent") return Boolean(t.chatId && !t.isGroup);
      if (activeTab === "squads") return Boolean(t.isGroup);
      if (activeTab === "following") return Boolean(t.isFollowing);
      return true;
    });
  }, [shareTargets, searchQuery, activeTab]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopiedLink(true);
    toast.success("Post link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareToTarget = async (target) => {
    let chatId = target.chatId;
    setSendingId(target.id);

    try {
      if (!chatId && target.userId) {
        const chatRes = await chatService.getOrCreateChat(target.userId);
        chatId = chatRes?.data?._id;
      }

      if (!chatId) {
        toast.error("Could not initiate conversation.");
        setSendingId(null);
        return;
      }

      const sharedPostPayload = {
        postId: post._id,
        owner: {
          _id: post.owner?._id,
          username: post.owner?.username || "player",
          fullName: post.owner?.fullName || post.owner?.username || "Player",
          avatar: post.owner?.avatar?.url || post.owner?.avatar || null,
        },
        caption: postCaption,
        thumbnail: postThumbnail,
        media: Array.isArray(post.media) && post.media.length > 0
          ? post.media
          : post.photo?.url
          ? [{ url: post.photo.url, type: "image" }]
          : [],
        itemType: post.itemType || (post.media ? "post" : "tweet"),
        likesCount: post.likesCount || 0,
        commentsCount: post.commentsCount || post.comments?.length || 0,
        createdAt: post.createdAt || new Date().toISOString(),
      };

      const shareMessage = customCaption.trim()
        ? customCaption.trim()
        : postCaption
        ? `Shared a match post: "${postCaption.slice(0, 80)}${postCaption.length > 80 ? "..." : ""}"`
        : `Shared a post by @${post.owner?.username || "player"}`;

      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("send-message", {
        chatId,
        message: shareMessage,
        attachment: "post",
        sharedPost: {
          ...sharedPostPayload,
          userComment: customCaption.trim() || undefined,
        },
      });

      setSentChatIds((prev) => new Set([...prev, target.id]));
      toast.success(`Shared with ${target.name}!`);
    } catch (err) {
      console.log("Share error:", err);
      toast.error("Failed to share post.");
    } finally {
      setSendingId(null);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-[#0b1118] border border-white/15 p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 flex flex-col max-h-[88vh] contain-paint dynamic-sidebar-shift transition-transform duration-200 ease-out will-change-transform"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <Share2 className="size-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-display">Share Post</h3>
              <p className="text-[11px] text-neutral-400">Send directly to recent chats or squad groups</p>
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

        {/* Post Preview Snippet */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center gap-3 shrink-0">
          {postThumbnail ? (
            <img
              src={postThumbnail}
              alt="Post thumbnail"
              className="size-12 rounded-xl object-cover ring-1 ring-white/10 shrink-0 shadow-sm"
              loading="lazy"
            />
          ) : (
            <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="size-5" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">{postAuthor}</span>
              <span className="text-[10px] text-neutral-400 truncate">@{post.owner?.username || "player"}</span>
            </div>
            <p className="text-[11.5px] text-neutral-300 truncate mt-0.5 font-medium">
              {postCaption}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative shrink-0">
          <Search className="size-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recent chats, squads, or followed players..."
            className="w-full h-10.5 pl-9.5 pr-4 rounded-2xl bg-black/60 border border-white/10 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 p-1 rounded-2xl bg-black/50 border border-white/10 text-center gap-1 shrink-0">
          {[
            { id: "all", label: "All" },
            { id: "recent", label: "Recent" },
            { id: "squads", label: "Squads" },
            { id: "following", label: "Following" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hardware-Accelerated Targets List with Inline Caption Drawer */}
        <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar min-h-[220px] max-h-[320px] pr-1 overscroll-contain">
          {loading ? (
            <div className="p-10 text-center text-xs text-neutral-400 space-y-2">
              <div className="size-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Loading recent chats & squads...</p>
            </div>
          ) : filteredTargets.length > 0 ? (
            filteredTargets.map((target) => {
              const isSent = sentChatIds.has(target.id);
              const isSending = sendingId === target.id;
              const isSelected = selectedTargetId === target.id;
              const avatarSrc = typeof target.avatar === "string" ? target.avatar : target.avatar?.url;

              return (
                <div
                  key={target.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-emerald-950/20 border-emerald-500/40 shadow-lg"
                      : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]"
                  }`}
                >
                  <div
                    onClick={() => {
                      if (!isSent) {
                        setSelectedTargetId(isSelected ? null : target.id);
                      }
                    }}
                    className="flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        {target.isGroup ? (
                          avatarSrc ? (
                            <img
                              src={optimizeGroupIcon(avatarSrc)}
                              alt={target.name}
                              className="size-10 rounded-2xl object-cover ring-1 ring-emerald-500/30 shadow-sm"
                              loading="lazy"
                            />
                          ) : (
                            <div className="size-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-sm">
                              <Users className="size-4.5" />
                            </div>
                          )
                        ) : (
                          <img
                            src={getAvatarUrl(target.avatar || target.user, target.name)}
                            alt={target.name}
                            className="size-10 rounded-full aspect-square object-cover ring-1 ring-white/10 shadow-sm"
                            loading="lazy"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                          {target.name}
                        </h4>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5 font-medium">
                          {target.subtitle}
                        </p>
                      </div>
                    </div>

                    {isSent ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shrink-0">
                        <Check className="size-3.5" /> Sent
                      </div>
                    ) : isSending ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 text-neutral-300 text-xs font-medium shrink-0">
                        <span className="size-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : null}
                  </div>

                  {/* Inline Caption Box Under Selected Target */}
                  {isSelected && !isSent && (
                    <div className="pt-2.5 mt-2.5 border-t border-white/[0.08] flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 border border-emerald-500/40 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/30">
                        <MessageSquare className="size-3.5 text-emerald-400 shrink-0" />
                        <input
                          type="text"
                          autoFocus
                          value={customCaption}
                          onChange={(e) => setCustomCaption(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleShareToTarget(target);
                            }
                          }}
                          placeholder={`Add a caption for ${target.name}... (optional)`}
                          maxLength={280}
                          className="w-full bg-transparent text-xs text-white placeholder:text-neutral-500 focus:outline-none font-medium"
                        />
                        {customCaption && (
                          <button
                            type="button"
                            onClick={() => setCustomCaption("")}
                            className="size-4 rounded-full bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
                            title="Clear caption"
                          >
                            <X className="size-2.5" />
                          </button>
                        )}
                      </div>

                      <Button
                        type="button"
                        onClick={() => handleShareToTarget(target)}
                        disabled={isSending}
                        size="sm"
                        variant="primary"
                        className="rounded-xl text-xs font-bold px-3.5 h-8 shrink-0 shadow-md shadow-emerald-500/20 cursor-pointer gap-1"
                      >
                        <Send className="size-3" />
                        <span>Send</span>
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-neutral-400 space-y-2">
              <Users className="size-7 text-neutral-600 mx-auto" />
              <p className="font-semibold text-neutral-300">
                {activeTab === "following"
                  ? "No followed players found."
                  : activeTab === "squads"
                  ? "No squads found."
                  : activeTab === "recent"
                  ? "No recent chats found."
                  : "No chats or squads found."}
              </p>
              <p className="text-[11px] text-neutral-500">
                {searchQuery
                  ? "Try a different search keyword."
                  : activeTab === "following"
                  ? "Follow footballers across the community to share posts with them here."
                  : activeTab === "squads"
                  ? "Create or join a squad in Messaging to share directly."
                  : "Start conversations in the Messaging tab to share posts directly."}
              </p>
            </div>
          )}
        </div>

        {/* Footer: Copy Direct Post Link */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyLink}
            className="w-full rounded-2xl text-xs font-bold gap-2 border-white/15 hover:bg-white/5 cursor-pointer h-10 transition-colors"
          >
            {copiedLink ? (
              <>
                <CheckCheck className="size-4 text-emerald-400" />
                <span className="text-emerald-400">Post Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-4 text-neutral-400" />
                <span>Copy Direct Post Link</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
