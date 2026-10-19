import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Bell,
  X,
  Ticket,
  Heart,
  MessageSquare,
  UserPlus,
  CheckCircle2,
  Clock3,
  MapPin,
  Trash2,
  ChevronRight,
  ShieldCheck,
  User,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bookingService } from "@/services/turf.service";
import { postService, commentService, tweetService } from "@/services/social.service";
import { getMyFollowers } from "@/services/follow.service";
import { authService } from "@/services/auth.service";
import { getAvatarUrl, cleanAddress } from "@/utils/avatar.utils";

// Format exact human-readable date & time with time-of-day
function formatExactTime(dateInput) {
  if (!dateInput) return "Just now";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Recently";

  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);

  // Time string (e.g. 02:45 PM)
  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (diffSec < 60) return `Just now (${timeStr})`;
  if (diffMin < 60) return `${diffMin}m ago • ${timeStr}`;
  if (diffHours < 24 && now.getDate() === date.getDate()) {
    return `Today at ${timeStr}`;
  }
  if (
    diffHours < 48 &&
    (now.getDate() - date.getDate() === 1 || now.getDate() - date.getDate() === -30)
  ) {
    return `Yesterday at ${timeStr}`;
  }

  // Date with year and exact time (e.g. Aug 18, 2026 • 03:30 PM)
  const monthDay = date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: now.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
  });

  return `${monthDay} • ${timeStr}`;
}

export default function NotificationModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { userData, status } = useSelector((state) => state.auth);

  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "bookings" | "likes" | "comments" | "follows"
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load individual user-specific notifications for Turf Bookings, Likes, Comments, and Follows
  const loadUserNotifications = async () => {
    if (!status || !userData) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const list = [];

    try {
      // 1. Fetch User's Own Turf Match Passes
      try {
        const bookingsRes = await bookingService.getMyBookings();
        const bookings = bookingsRes?.data || [];
        if (Array.isArray(bookings)) {
          bookings.forEach((b) => {
            const statusLabel =
              b.status === "confirmed"
                ? "Match Pass Confirmed & Active"
                : b.status === "pending"
                  ? "Booking Awaiting Turf Admin Approval"
                  : b.status === "rejected"
                    ? "Booking Request Rejected"
                    : "Match Pass Cancelled";

            const iconColor =
              b.status === "confirmed"
                ? "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
                : b.status === "pending"
                  ? "text-amber-400 bg-amber-500/15 border-amber-500/30"
                  : "text-red-400 bg-red-500/15 border-red-500/30";

            list.push({
              id: `booking_${b._id}`,
              type: "bookings",
              title: `${b.turf?.name || "Ground Matchday"} — ${statusLabel}`,
              description: `Date: ${b.date ? new Date(b.date).toLocaleDateString() : "Match Day"
                } • Slots: ${b.slots?.map((s) => s.startTime).join(", ") || "Standard"
                } • Venue: ${cleanAddress(b.turf?.address) || "Pitch"}`,
              time: formatExactTime(b.createdAt || b.date),
              timestamp: b.createdAt ? new Date(b.createdAt).getTime() : 0,
              icon: Ticket,
              iconColor,
              link: "/my-bookings",
              read: false,
              rawBooking: b,
            });
          });
        }
      } catch (err) {
        console.log("Error loading booking notifications:", err);
      }

      // 1.5 If User is Turf Owner / Admin, fetch incoming booking requests for their turf
      try {
        const adminBookingsRes = await bookingService.getAdminBookingRequests();
        const adminBookings = adminBookingsRes?.data || [];
        if (Array.isArray(adminBookings)) {
          adminBookings.forEach((ab) => {
            const isPending = ab.status === "pending";
            const requester = ab.user || {};
            const requesterName = requester.fullName || requester.username || "Player";
            const requesterUsername = requester.username || "player";
            const requesterAvatar = getAvatarUrl(requester);

            list.push({
              id: `admin_booking_${ab._id}`,
              type: "bookings",
              avatarUrl: requesterAvatar,
              username: requesterUsername,
              fullName: requesterName,
              title: `🏟️ ${ab.turf?.name || "Turf"} — Pass Request (${ab.status?.toUpperCase()})`,
              description: `@${requesterUsername} requested ${ab.slots?.map((s) => s.startTime).join(", ")} on ${new Date(ab.date).toLocaleDateString()}. Action Required in Admin Desk!`,
              time: formatExactTime(ab.createdAt || ab.date),
              timestamp: ab.createdAt ? new Date(ab.createdAt).getTime() : 0,
              icon: ShieldAlert,
              iconColor: isPending
                ? "text-amber-400 bg-amber-500/15 border-amber-500/30"
                : "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
              link: "/my-bookings",
              read: false,
              rawBooking: ab,
            });
          });
        }
      } catch (adminErr) {
        // Ignore if user has no admin turfs
      }

      // 2. Fetch User's Real Followers (With User Info & Avatar)
      try {
        const followersRes = await getMyFollowers();
        const followers = Array.isArray(followersRes?.data) ? followersRes.data : Array.isArray(followersRes) ? followersRes : [];
        if (Array.isArray(followers)) {
          followers.forEach((f, idx) => {
            const followerUser = f.follower || f;
            const username = followerUser.username || "footballer";
            const fullName = followerUser.fullName || username;
            const avatarUrl = getAvatarUrl(followerUser);

            const followDate = f.createdAt || followerUser.createdAt || new Date();

            list.push({
              id: `follow_${f._id || followerUser._id || username}_${idx}`,
              type: "follows",
              username,
              fullName,
              avatarUrl,
              title: `@${username} started following you`,
              description: `${fullName} (@${username}) is now following your player profile and match updates.`,
              time: formatExactTime(followDate),
              timestamp: f.createdAt ? new Date(f.createdAt).getTime() : Date.now() - idx * 1000,
              icon: UserPlus,
              iconColor: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30",
              link: `/channel/${username}`,
              read: false,
            });
          });
        }
      } catch (err) {
        console.log("Error loading follower notifications:", err);
      }

      // 3. Fetch User's Posts, Tweets, and Directory to Extract Likes & Comments with User Info
      try {
        const myUserId = String(userData?._id || userData?.id || "");
        const myUsername = String(userData?.username || "").toLowerCase();

        const [postsRes, tweetsRes, allUsersRes] = await Promise.allSettled([
          postService.getAllPosts(),
          tweetService.getCommunityTweets(),
          authService.getAllUsers(),
        ]);

        // Build User Dictionary to guarantee 100% username and avatar resolution
        const usersDict = {};
        const registerUser = (u) => {
          if (!u) return;
          const userObj = typeof u === "object" ? u : null;
          const uId = String(userObj?._id || userObj?.id || (typeof u === "string" ? u : "") || "");
          const uName = String(userObj?.username || (typeof u === "string" ? u : "") || "").toLowerCase();
          if (uId && userObj?.username) usersDict[uId] = userObj;
          if (uName && userObj?.username) usersDict[uName] = userObj;
        };

        if (allUsersRes.status === "fulfilled") {
          const rawUsers = allUsersRes.value?.data || allUsersRes.value || [];
          const usersList = Array.isArray(rawUsers) ? rawUsers : Array.isArray(rawUsers?.users) ? rawUsers.users : [];
          usersList.forEach(registerUser);
        }

        const resolveUser = (candidate) => {
          if (!candidate) return { username: "player", fullName: "Player", avatar: null };

          if (typeof candidate === "object" && candidate.username && candidate.username !== "footballer" && candidate.username !== "player") {
            registerUser(candidate);
            return candidate;
          }

          const candId = String(candidate._id || candidate.id || (typeof candidate === "string" ? candidate : "") || "");
          const candUsername = String(candidate.username || (typeof candidate === "string" ? candidate : "") || "").toLowerCase();

          if (candId && usersDict[candId]) return usersDict[candId];
          if (candUsername && usersDict[candUsername]) return usersDict[candUsername];

          return typeof candidate === "object" ? candidate : { _id: candId, username: candUsername || "player" };
        };

        // Process Posts
        if (postsRes.status === "fulfilled") {
          const rawPosts = postsRes.value?.data || postsRes.value || [];
          const allPosts = Array.isArray(rawPosts) ? rawPosts : [];

          // Pre-populate users dictionary from all posts
          allPosts.forEach((p) => {
            if (p.owner) registerUser(p.owner);
            if (Array.isArray(p.likes)) p.likes.forEach((l) => registerUser(l.likedBy));
            if (Array.isArray(p.comments)) {
              p.comments.forEach((c) => {
                if (c.owner) registerUser(c.owner);
                if (Array.isArray(c.likes)) c.likes.forEach((cl) => registerUser(cl.likedBy));
              });
            }
          });

          const myPosts = allPosts.filter((p) => {
            const ownerId = String(p.owner?._id || p.owner || "");
            const ownerUsername = String(p.owner?.username || "").toLowerCase();
            return (ownerId && ownerId === myUserId) || (ownerUsername && ownerUsername === myUsername);
          });

          for (const post of myPosts) {
            // Process each individual like on user's post (Skip self-likes)
            if (Array.isArray(post.likes) && post.likes.length > 0) {
              post.likes.forEach((l, lIdx) => {
                const likerRaw = l.likedBy || (typeof l === "object" ? l : {});
                const liker = resolveUser(likerRaw);
                const likerId = String(liker._id || likerRaw._id || likerRaw || "");
                const likerUsername = String(liker.username || "").toLowerCase();

                // Filter out self-likes
                if ((likerId && likerId === myUserId) || (likerUsername && likerUsername === myUsername)) {
                  return;
                }

                const likerDisplayName = liker.username || "player";
                const likerFullName = liker.fullName || likerDisplayName;
                const likerAvatar = getAvatarUrl(liker, likerDisplayName);

                const likeDate = l.createdAt || post.updatedAt || post.createdAt;
                list.push({
                  id: `like_${post._id}_${likerId || likerDisplayName || lIdx}`,
                  type: "likes",
                  username: likerDisplayName,
                  fullName: likerFullName,
                  avatarUrl: likerAvatar,
                  title: `❤️ @${likerDisplayName} liked your post`,
                  description: `${likerFullName} cheered your match update: "${post.caption
                    ? post.caption.slice(0, 45) + "..."
                    : "Match highlight"
                    }"`,
                  time: formatExactTime(likeDate),
                  timestamp: likeDate ? new Date(likeDate).getTime() : Date.now(),
                  icon: Heart,
                  iconColor: "text-rose-400 bg-rose-500/15 border-rose-500/30",
                  link: `/channel/${userData.username}`,
                  read: false,
                });
              });
            }

            // Process each comment on user's post (Skip self-comments)
            let commentsList = [];
            if (Array.isArray(post.comments) && post.comments.length > 0) {
              commentsList = post.comments;
            } else {
              try {
                const commentsRes = await commentService.showAllComments(post._id);
                const fetched =
                  commentsRes?.data?.docs ||
                  commentsRes?.data ||
                  commentsRes?.docs ||
                  [];
                commentsList = Array.isArray(fetched) ? fetched : [];
              } catch (cErr) {
                commentsList = [];
              }
            }

            if (Array.isArray(commentsList) && commentsList.length > 0) {
              commentsList.forEach((c, cIdx) => {
                const commenterRaw = c.owner || {};
                const commenter = resolveUser(commenterRaw);
                const commenterId = String(commenter._id || commenterRaw._id || commenterRaw || "");
                const commenterUsername = String(commenter.username || "").toLowerCase();

                // Filter out self-comments
                if ((commenterId && commenterId === myUserId) || (commenterUsername && commenterUsername === myUsername)) {
                  return;
                }

                const commenterDisplayName = commenter.username || "player";
                const commenterName =
                  commenter.fullName || commenterDisplayName;
                const commenterAvatar = getAvatarUrl(commenter, commenterDisplayName);

                list.push({
                  id: `comment_${c._id || `${post._id}_comment_${cIdx}`}`,
                  type: "comments",
                  username: commenterDisplayName,
                  fullName: commenterName,
                  avatarUrl: commenterAvatar,
                  title: `💬 @${commenterDisplayName} commented on your post`,
                  description: `"${c.content?.slice(0, 60) || "Match commentary"
                    }" on "${post.caption?.slice(0, 25) || "Match Post"}..."`,
                  time: formatExactTime(c.createdAt || post.createdAt),
                  timestamp: c.createdAt
                    ? new Date(c.createdAt).getTime()
                    : Date.now(),
                  icon: MessageSquare,
                  iconColor:
                    "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
                  link: `/channel/${userData.username}`,
                  read: false,
                });
              });
            }
          }
        }

        // Process Tweets
        if (tweetsRes.status === "fulfilled") {
          const rawTweets = tweetsRes.value?.data || tweetsRes.value || [];
          const allTweets = Array.isArray(rawTweets) ? rawTweets : [];

          // Register tweet authors and likers
          allTweets.forEach((t) => {
            if (t.owner) registerUser(t.owner);
            if (Array.isArray(t.likes)) t.likes.forEach((l) => registerUser(l.likedBy));
            if (Array.isArray(t.comments)) t.comments.forEach((c) => registerUser(c.owner));
          });

          const myTweets = allTweets.filter((t) => {
            const ownerId = String(t.owner?._id || t.owner || "");
            const ownerUsername = String(t.owner?.username || "").toLowerCase();
            return (ownerId && ownerId === myUserId) || (ownerUsername && ownerUsername === myUsername);
          });

          for (const tweet of myTweets) {
            // Likes on tweet
            if (Array.isArray(tweet.likes) && tweet.likes.length > 0) {
              tweet.likes.forEach((l, lIdx) => {
                const likerRaw = l.likedBy || (typeof l === "object" ? l : {});
                const liker = resolveUser(likerRaw);
                const likerId = String(liker._id || likerRaw._id || likerRaw || "");
                const likerUsername = String(liker.username || "").toLowerCase();

                if ((likerId && likerId === myUserId) || (likerUsername && likerUsername === myUsername)) {
                  return;
                }

                const likerDisplayName = liker.username || "player";
                const likerFullName = liker.fullName || likerDisplayName;
                const likerAvatar = getAvatarUrl(liker, likerDisplayName);

                const likeDate = l.createdAt || tweet.updatedAt || tweet.createdAt;
                list.push({
                  id: `like_tweet_${tweet._id}_${likerId || likerDisplayName || lIdx}`,
                  type: "likes",
                  username: likerDisplayName,
                  fullName: likerFullName,
                  avatarUrl: likerAvatar,
                  title: `❤️ @${likerDisplayName} liked your tweet`,
                  description: `${likerFullName} cheered your community post: "${tweet.content
                    ? tweet.content.slice(0, 45) + "..."
                    : "Community update"
                    }"`,
                  time: formatExactTime(likeDate),
                  timestamp: likeDate ? new Date(likeDate).getTime() : Date.now(),
                  icon: Heart,
                  iconColor: "text-rose-400 bg-rose-500/15 border-rose-500/30",
                  link: "/community",
                  read: false,
                });
              });
            }

            // Comments on tweet
            if (Array.isArray(tweet.comments) && tweet.comments.length > 0) {
              tweet.comments.forEach((c, cIdx) => {
                const commenterRaw = c.owner || {};
                const commenter = resolveUser(commenterRaw);
                const commenterId = String(commenter._id || commenterRaw._id || commenterRaw || "");
                const commenterUsername = String(commenter.username || "").toLowerCase();

                if ((commenterId && commenterId === myUserId) || (commenterUsername && commenterUsername === myUsername)) {
                  return;
                }

                const commenterDisplayName = commenter.username || "player";
                const commenterName = commenter.fullName || commenterDisplayName;
                const commenterAvatar = getAvatarUrl(commenter, commenterDisplayName);

                list.push({
                  id: `comment_tweet_${c._id || `${tweet._id}_comment_${cIdx}`}`,
                  type: "comments",
                  username: commenterDisplayName,
                  fullName: commenterName,
                  avatarUrl: commenterAvatar,
                  title: `💬 @${commenterDisplayName} commented on your tweet`,
                  description: `"${c.content?.slice(0, 60) || "Match commentary"
                    }" on "${tweet.content?.slice(0, 25) || "Tweet"}..."`,
                  time: formatExactTime(c.createdAt || tweet.createdAt),
                  timestamp: c.createdAt
                    ? new Date(c.createdAt).getTime()
                    : Date.now(),
                  icon: MessageSquare,
                  iconColor:
                    "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
                  link: "/community",
                  read: false,
                });
              });
            }
          }
        }

        // Process Likes on User's Comments across all posts
        if (postsRes.status === "fulfilled") {
          const allPosts = Array.isArray(postsRes.value?.data || postsRes.value) ? (postsRes.value?.data || postsRes.value) : [];
          for (const post of allPosts) {
            if (Array.isArray(post.comments)) {
              post.comments.forEach((c, cIdx) => {
                const commenterRaw = c.owner || {};
                const commenter = resolveUser(commenterRaw);
                const commenterId = String(commenter._id || commenterRaw._id || commenterRaw || "");
                const commenterUsername = String(commenter.username || "").toLowerCase();
                const isMyComment = (commenterId && commenterId === myUserId) || (commenterUsername && commenterUsername === myUsername);

                if (isMyComment && Array.isArray(c.likes)) {
                  c.likes.forEach((cl, clIdx) => {
                    const clLikerRaw = cl.likedBy || (typeof cl === "object" ? cl : {});
                    const clLiker = resolveUser(clLikerRaw);
                    const clLikerId = String(clLiker._id || clLikerRaw._id || clLikerRaw || "");
                    const clLikerUsername = String(clLiker.username || "").toLowerCase();

                    if ((clLikerId && clLikerId === myUserId) || (clLikerUsername && clLikerUsername === myUsername)) {
                      return;
                    }

                    const likerDisplayName = clLiker.username || "player";
                    const likerFullName = clLiker.fullName || likerDisplayName;
                    const likerAvatar = getAvatarUrl(clLiker, likerDisplayName);
                    const likeDate = cl.createdAt || post.updatedAt || post.createdAt;

                    list.push({
                      id: `comment_like_${c._id || cIdx}_${clLikerId || clLikerUsername || clIdx}`,
                      type: "likes",
                      username: likerDisplayName,
                      fullName: likerFullName,
                      avatarUrl: likerAvatar,
                      title: `❤️ @${likerDisplayName} liked your comment`,
                      description: `${likerFullName} liked your comment: "${c.content ? c.content.slice(0, 45) + "..." : "Comment"}"`,
                      time: formatExactTime(likeDate),
                      timestamp: likeDate ? new Date(likeDate).getTime() : Date.now(),
                      icon: Heart,
                      iconColor: "text-rose-400 bg-rose-500/15 border-rose-500/30",
                      link: `/post/${post._id}`,
                      read: true,
                    });
                  });
                }
              });
            }
          }
        }
      } catch (err) {
        console.log("Error loading activity:", err);
      }

      // Filter out notifications older than 1 day (24 hours) and mark as read upon viewing
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      const now = Date.now();
      const freshList = list
        .filter((item) => {
          if (!item.timestamp) return true;
          return now - item.timestamp <= ONE_DAY_MS;
        })
        .map((item) => ({ ...item, read: true }));

      // Sort by newest first
      freshList.sort((a, b) => b.timestamp - a.timestamp);
      setNotifications(freshList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUserNotifications();
    }
  }, [isOpen, status, userData?._id]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDeleteItem = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (link) => {
    onClose();
    navigate(link);
  };

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-6 bg-black/85 transition-opacity duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c121a] border border-neutral-200 dark:border-white/15 shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[92dvh] dynamic-sidebar-shift transition-transform duration-200 ease-out will-change-transform cursor-default"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-neutral-200 dark:border-white/[0.08] flex items-center justify-between bg-white dark:bg-[#080d14] shrink-0 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="size-9 sm:size-11 rounded-xl sm:rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
              <Bell className="size-4.5 sm:size-5.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-extrabold text-neutral-900 dark:text-white font-display tracking-tight truncate">
                  Notification Center
                </h2>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate hidden sm:block">
                Matchday turf bookings, new followers, cheers, and comments.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-8 sm:size-9 rounded-full bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="size-4 sm:size-5" />
          </button>
        </div>

        {/* Filter Tabs & Quick Actions Bar */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-neutral-200 dark:border-white/[0.06] bg-neutral-100/80 dark:bg-[#080d14]/70 flex flex-wrap items-center justify-between gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 custom-scrollbar">
            {[
              { id: "all", label: "All Alerts", count: notifications.length },
              {
                id: "bookings",
                label: "Turf Bookings",
                count: notifications.filter((n) => n.type === "bookings").length,
              },
              {
                id: "follows",
                label: "Followers",
                count: notifications.filter((n) => n.type === "follows").length,
              },
              {
                id: "likes",
                label: "Likes",
                count: notifications.filter((n) => n.type === "likes").length,
              },
              {
                id: "comments",
                label: "Comments",
                count: notifications.filter((n) => n.type === "comments").length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${activeFilter === tab.id
                  ? "bg-emerald-500 text-neutral-950 shadow-md font-extrabold"
                  : "bg-white dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-white/[0.08] border border-neutral-200 dark:border-white/5 shadow-xs"
                  }`}
              >
                {tab.label} <span className="opacity-75 text-[10.5px]">({tab.count})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 text-xs shrink-0">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-200 dark:bg-white/5 hover:bg-red-500/15 text-neutral-700 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 border border-neutral-300 dark:border-white/10 font-semibold transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Notification Stream (Spacious, Uncluttered, High Performance) */}
        <div
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 custom-scrollbar overscroll-contain bg-neutral-50/50 dark:bg-[#0c121a]"
          style={{ willChange: "scroll-position", WebkitOverflowScrolling: "touch" }}
        >
          {loading ? (
            <div className="p-16 text-center text-sm text-neutral-500 dark:text-neutral-400 space-y-3">
              <div className="size-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-semibold">Loading your notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item.link)}
                  style={{ contentVisibility: "auto", containIntrinsicSize: "95px" }}
                  className={`p-4 sm:p-4.5 rounded-2xl transition-colors duration-100 cursor-pointer group flex items-start gap-4 ${!item.read
                    ? "bg-white dark:bg-[#090f17] hover:bg-neutral-100 dark:hover:bg-[#0e1622] border border-emerald-500/40 shadow-xs"
                    : "bg-white dark:bg-[#080d14]/80 hover:bg-neutral-100 dark:hover:bg-[#0e1622] border border-neutral-200 dark:border-white/[0.08] shadow-xs"
                    }`}
                >
                  {/* Left Avatar / Icon */}
                  {item.avatarUrl ? (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.username) {
                          onClose();
                          navigate(`/channel/${item.username}`);
                        } else {
                          handleNotificationClick(item.link);
                        }
                      }}
                      className="relative size-11 sm:size-12 shrink-0 cursor-pointer group/avatar"
                      title={item.username ? `View @${item.username}'s profile` : "View profile"}
                    >
                      <img
                        src={item.avatarUrl}
                        alt={item.username || "User"}
                        className="size-11 sm:size-12 rounded-2xl object-cover ring-1 ring-neutral-200 dark:ring-white/15 group-hover/avatar:ring-emerald-500/80 group-hover/avatar:scale-105 transition-all"
                      />
                      <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-white dark:bg-[#0c121a] border border-neutral-200 dark:border-white/20 flex items-center justify-center shadow-sm">
                        <Icon
                          className={`size-3 ${item.type === "likes"
                            ? "text-rose-500"
                            : item.type === "follows"
                              ? "text-cyan-600 dark:text-cyan-400"
                              : item.type === "bookings"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                        />
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`size-11 sm:size-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm ${item.iconColor}`}
                    >
                      <Icon className="size-5.5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <h4
                          onClick={(e) => {
                            if (item.username && (item.type === "follows" || item.type === "likes" || item.type === "comments")) {
                              e.stopPropagation();
                              onClose();
                              navigate(`/channel/${item.username}`);
                            }
                          }}
                          className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate font-display cursor-pointer"
                        >
                          {item.title}
                        </h4>
                        {item.type === "follows" && (
                          <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-bold shrink-0 hidden sm:inline">
                            Follower
                          </span>
                        )}
                        {item.type === "likes" && (
                          <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-bold shrink-0 hidden sm:inline">
                            Like
                          </span>
                        )}
                        {item.type === "comments" && (
                          <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold shrink-0 hidden sm:inline">
                            Comment
                          </span>
                        )}
                        {item.type === "bookings" && (
                          <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold shrink-0 hidden sm:inline">
                            Match Pass
                          </span>
                        )}
                      </div>

                      <span className="text-[10.5px] text-neutral-600 dark:text-neutral-400 font-mono shrink-0 font-medium ml-2">
                        {item.time}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed line-clamp-2 font-normal">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-200/80 dark:border-white/[0.04]">
                      {item.username ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            navigate(`/channel/${item.username}`);
                          }}
                          className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                        >
                          View @{item.username}'s Profile <ChevronRight className="size-3" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          {item.type === "bookings" ? "Open Booking Desk" : "View Activity"} <ChevronRight className="size-3" />
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-500 transition-opacity p-1 cursor-pointer"
                        title="Dismiss"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-16 text-center space-y-3.5">
              <ShieldCheck className="size-12 text-neutral-400 dark:text-neutral-600 mx-auto" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-white font-display">
                You're All Caught Up!
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
                No active notifications found. Your turf bookings, new followers, likes, and comments on your posts will appear right here.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#080d14] flex items-center justify-between text-xs shrink-0">
          <Link
            to="/my-bookings"
            onClick={onClose}
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Ticket className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>My Match Passes & Schedule</span>
          </Link>
          <Link
            to={`/channel/${userData?.username || "profile"}`}
            onClick={onClose}
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Heart className="size-3.5 text-rose-500 dark:text-rose-400" />
            <span>My Posts Activity</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
