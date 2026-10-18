import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Search,
  Bell,
  PlusCircle,
  Menu,
  Activity,
  User,
  Heart,
  MessageCircle,
  Loader2,
  ChevronRight,
  X,
  Sun,
  Moon,
  Radio,
  Home,
} from "lucide-react";
import NotificationModal from "../notifications/NotificationModal";
import { postService, tweetService } from "@/services/social.service";
import { authService } from "@/services/auth.service";
import { getMyFollowers } from "@/services/follow.service";
import { getAvatarUrl } from "@/utils/avatar.utils";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar({ onOpenMobile }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, status } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef(null);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  // Floating Instagram-style Activity Tooltip
  const [showActivityBubble, setShowActivityBubble] = useState(false);
  const [activityCounts, setActivityCounts] = useState({
    likes: 0,
    follows: 0,
    comments: 0,
  });
  const [rawSnapshot, setRawSnapshot] = useState({
    likeIds: [],
    followerIds: [],
    commentIds: [],
  });

  const isFetchingRef = useRef(false);

  const loadLiveActivityCounts = useCallback(async () => {
    if (!status || !userData || isFetchingRef.current) {
      return;
    }

    const myUserId = String(userData._id || userData.id || "");
    const myUsername = String(userData.username || "").toLowerCase();

    if (!myUserId && !myUsername) return;

    isFetchingRef.current = true;

    try {
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      const now = Date.now();

      const currentLikeIds = [];
      const currentCommentIds = [];

      // Parallel fetch: followers, posts, and community tweets
      const [followersResult, postsResult, tweetsResult] = await Promise.allSettled([
        getMyFollowers(),
        postService.getAllPosts(),
        tweetService.getCommunityTweets(),
      ]);

      // 1. Process followers (within last 24h)
      let followersList = [];
      if (followersResult.status === "fulfilled") {
        const rawFollowers = followersResult.value?.data || followersResult.value || [];
        followersList = Array.isArray(rawFollowers) ? rawFollowers : [];
      }

      const validFollowers = followersList.filter((f) => {
        const followTime = f.createdAt ? new Date(f.createdAt).getTime() : 0;
        return followTime === 0 || now - followTime <= ONE_DAY_MS;
      });

      const currentFollowerEntryIds = validFollowers.map(
        (f) => String(f._id || `${f.follower?._id || f.follower?.username || "user"}_${f.createdAt || ""}`)
      );

      // 2. Process posts (likes and comments within last 24h)
      if (postsResult.status === "fulfilled") {
        const rawPosts = postsResult.value?.data || postsResult.value || [];
        const posts = Array.isArray(rawPosts) ? rawPosts : [];

        const myPosts = posts.filter((p) => {
          const ownerId = String(p.owner?._id || p.owner || "");
          const ownerUsername = String(p.owner?.username || "").toLowerCase();
          return (ownerId && ownerId === myUserId) || (ownerUsername && ownerUsername === myUsername);
        });

        for (const p of myPosts) {
          // Likes on post (within 24h)
          if (Array.isArray(p.likes)) {
            p.likes.forEach((l, lIdx) => {
              const liker = l.likedBy || (typeof l === "object" ? l : {});
              const likerId = String(liker._id || liker || "");
              const likerUsername = String(liker.username || "").toLowerCase();

              // Skip self-like
              if ((likerId && likerId === myUserId) || (likerUsername && likerUsername === myUsername)) {
                return;
              }

              const likeTime = l.createdAt ? new Date(l.createdAt).getTime() : p.createdAt ? new Date(p.createdAt).getTime() : 0;
              if (likeTime > 0 && now - likeTime > ONE_DAY_MS) {
                return;
              }

              const likeId = String(
                l._id || `${p._id}_like_${likerId || likerUsername || lIdx}`
              );
              currentLikeIds.push(likeId);
            });
          }

          // Comments on post (within 24h)
          if (Array.isArray(p.comments)) {
            p.comments.forEach((c, cIdx) => {
              const commenter = c.owner || {};
              const commenterId = String(commenter._id || commenter || "");
              const commenterUsername = String(commenter.username || "").toLowerCase();

              // Skip self-comment
              if ((commenterId && commenterId === myUserId) || (commenterUsername && commenterUsername === myUsername)) {
                return;
              }

              const commentTime = c.createdAt ? new Date(c.createdAt).getTime() : 0;
              if (commentTime > 0 && now - commentTime > ONE_DAY_MS) {
                return;
              }

              const commentId = String(
                c._id || `${p._id}_comment_${cIdx}_${c.createdAt || ""}`
              );
              currentCommentIds.push(commentId);
            });
          }
        }

        // Check all posts for likes on comments authored by current user
        for (const p of posts) {
          if (Array.isArray(p.comments)) {
            p.comments.forEach((c, cIdx) => {
              const commenter = c.owner || {};
              const commenterId = String(commenter._id || commenter || "");
              const commenterUsername = String(commenter.username || "").toLowerCase();
              const isMyComment = (commenterId && commenterId === myUserId) || (commenterUsername && commenterUsername === myUsername);

              if (isMyComment && Array.isArray(c.likes)) {
                c.likes.forEach((cl, clIdx) => {
                  const clLiker = cl.likedBy || (typeof cl === "object" ? cl : {});
                  const clLikerId = String(clLiker._id || clLiker || "");
                  const clLikerUsername = String(clLiker.username || "").toLowerCase();

                  if ((clLikerId && clLikerId === myUserId) || (clLikerUsername && clLikerUsername === myUsername)) {
                    return;
                  }

                  const clTime = cl.createdAt ? new Date(cl.createdAt).getTime() : 0;
                  if (clTime > 0 && now - clTime > ONE_DAY_MS) {
                    return;
                  }

                  const commentLikeId = String(
                    cl._id || `comment_like_${c._id || cIdx}_${clLikerId || clLikerUsername || clIdx}`
                  );
                  currentLikeIds.push(commentLikeId);
                });
              }
            });
          }
        }
      }

      // 3. Process tweets (likes and comments within last 24h)
      if (tweetsResult.status === "fulfilled") {
        const rawTweets = tweetsResult.value?.data || tweetsResult.value || [];
        const tweets = Array.isArray(rawTweets) ? rawTweets : [];

        const myTweets = tweets.filter((t) => {
          const ownerId = String(t.owner?._id || t.owner || "");
          const ownerUsername = String(t.owner?.username || "").toLowerCase();
          return (ownerId && ownerId === myUserId) || (ownerUsername && ownerUsername === myUsername);
        });

        for (const t of myTweets) {
          // Likes (within 24h)
          if (Array.isArray(t.likes)) {
            t.likes.forEach((l, lIdx) => {
              const liker = l.likedBy || (typeof l === "object" ? l : {});
              const likerId = String(liker._id || liker || "");
              const likerUsername = String(liker.username || "").toLowerCase();

              if ((likerId && likerId === myUserId) || (likerUsername && likerUsername === myUsername)) {
                return;
              }

              const likeTime = l.createdAt ? new Date(l.createdAt).getTime() : t.createdAt ? new Date(t.createdAt).getTime() : 0;
              if (likeTime > 0 && now - likeTime > ONE_DAY_MS) {
                return;
              }

              const likeId = String(
                l._id || `tweet_${t._id}_like_${likerId || likerUsername || lIdx}`
              );
              currentLikeIds.push(likeId);
            });
          }

          // Comments (within 24h)
          if (Array.isArray(t.comments)) {
            t.comments.forEach((c, cIdx) => {
              const commenter = c.owner || {};
              const commenterId = String(commenter._id || commenter || "");
              const commenterUsername = String(commenter.username || "").toLowerCase();

              if ((commenterId && commenterId === myUserId) || (commenterUsername && commenterUsername === myUsername)) {
                return;
              }

              const commentTime = c.createdAt ? new Date(c.createdAt).getTime() : 0;
              if (commentTime > 0 && now - commentTime > ONE_DAY_MS) {
                return;
              }

              const commentId = String(
                c._id || `tweet_${t._id}_comment_${cIdx}_${c.createdAt || ""}`
              );
              currentCommentIds.push(commentId);
            });
          }
        }

        // Check all tweets for likes on comments authored by current user
        for (const t of tweets) {
          if (Array.isArray(t.comments)) {
            t.comments.forEach((c, cIdx) => {
              const commenter = c.owner || {};
              const commenterId = String(commenter._id || commenter || "");
              const commenterUsername = String(commenter.username || "").toLowerCase();
              const isMyComment = (commenterId && commenterId === myUserId) || (commenterUsername && commenterUsername === myUsername);

              if (isMyComment && Array.isArray(c.likes)) {
                c.likes.forEach((cl, clIdx) => {
                  const clLiker = cl.likedBy || (typeof cl === "object" ? cl : {});
                  const clLikerId = String(clLiker._id || clLiker || "");
                  const clLikerUsername = String(clLiker.username || "").toLowerCase();

                  if ((clLikerId && clLikerId === myUserId) || (clLikerUsername && clLikerUsername === myUsername)) {
                    return;
                  }

                  const clTime = cl.createdAt ? new Date(cl.createdAt).getTime() : 0;
                  if (clTime > 0 && now - clTime > ONE_DAY_MS) {
                    return;
                  }

                  const commentLikeId = String(
                    cl._id || `tweet_comment_like_${c._id || cIdx}_${clLikerId || clLikerUsername || clIdx}`
                  );
                  currentLikeIds.push(commentLikeId);
                });
              }
            });
          }
        }
      }

      const uniqueLikeIds = Array.from(new Set(currentLikeIds));
      const uniqueCommentIds = Array.from(new Set(currentCommentIds));
      const uniqueFollowerIds = Array.from(new Set(currentFollowerEntryIds));

      setRawSnapshot({
        likeIds: uniqueLikeIds,
        followerIds: uniqueFollowerIds,
        commentIds: uniqueCommentIds,
      });

      // Check local storage for previously seen activity snapshot
      const seenKey = `seen_activity_${myUserId}`;
      const storedSeen = localStorage.getItem(seenKey);
      let lastSeen = null;
      if (storedSeen) {
        try {
          lastSeen = JSON.parse(storedSeen);
        } catch (e) { }
      }

      // Calculate NEW unseen counts based on specific entry IDs
      let newLikes = 0;
      if (lastSeen?.likeIds && Array.isArray(lastSeen.likeIds)) {
        newLikes = uniqueLikeIds.filter(
          (id) => !lastSeen.likeIds.includes(id)
        ).length;
      } else if (lastSeen && typeof lastSeen.likes === "number") {
        newLikes = Math.max(0, uniqueLikeIds.length - lastSeen.likes);
      } else {
        newLikes = uniqueLikeIds.length;
      }

      let newComments = 0;
      if (lastSeen?.commentIds && Array.isArray(lastSeen.commentIds)) {
        newComments = uniqueCommentIds.filter(
          (id) => !lastSeen.commentIds.includes(id)
        ).length;
      } else if (lastSeen && typeof lastSeen.comments === "number") {
        newComments = Math.max(0, uniqueCommentIds.length - lastSeen.comments);
      } else {
        newComments = uniqueCommentIds.length;
      }

      let newFollows = 0;
      if (lastSeen?.followerIds && Array.isArray(lastSeen.followerIds)) {
        newFollows = uniqueFollowerIds.filter(
          (id) => !lastSeen.followerIds.includes(id)
        ).length;
      } else if (lastSeen && typeof lastSeen.follows === "number") {
        newFollows = Math.max(0, uniqueFollowerIds.length - lastSeen.follows);
      } else {
        newFollows = uniqueFollowerIds.length;
      }

      setActivityCounts({
        likes: newLikes,
        follows: newFollows,
        comments: newComments,
      });

      // Show floating bubble for only 2.5 seconds if there are unread/unseen items
      if (newLikes > 0 || newFollows > 0 || newComments > 0) {
        setShowActivityBubble(true);

        const timer = setTimeout(() => {
          setShowActivityBubble(false);
        }, 2600);

        return () => clearTimeout(timer);
      } else {
        setShowActivityBubble(false);
      }
    } catch (err) {
      console.log("Activity fetch error:", err);
    } finally {
      isFetchingRef.current = false;
    }
  }, [status, userData?._id, userData?.username]);

  // Load activity on route change & on 8s clean non-blocking interval
  useEffect(() => {
    loadLiveActivityCounts();

    const interval = setInterval(() => {
      loadLiveActivityCounts();
    }, 8000);

    return () => clearInterval(interval);
  }, [loadLiveActivityCounts, location.pathname]);

  // Debounced User Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      try {
        const res = await authService.getAllUsers({ query: searchQuery.trim() });
        const users = res?.data || res || [];
        setSearchResults(Array.isArray(users) ? users : []);
      } catch (err) {
        console.log("User search error:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUser = (username) => {
    setShowSearchDropdown(false);
    setSearchQuery("");
    navigate(`/channel/${username}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchResults.length > 0) {
      handleSelectUser(searchResults[0].username);
    } else {
      const cleanUsername = searchQuery.trim().replace(/^@/, "");
      navigate(`/channel/${encodeURIComponent(cleanUsername)}`);
      setShowSearchDropdown(false);
      setSearchQuery("");
    }
  };

  const handleOpenNotifications = () => {
    setShowActivityBubble(false);
    setActivityCounts({ likes: 0, follows: 0, comments: 0 });

    // Mark ALL current activity items as SEEN permanently in localStorage
    if (userData?._id) {
      const seenKey = `seen_activity_${userData._id}`;
      localStorage.setItem(
        seenKey,
        JSON.stringify({
          likeIds: rawSnapshot.likeIds,
          followerIds: rawSnapshot.followerIds,
          commentIds: rawSnapshot.commentIds,
          likes: rawSnapshot.likeIds.length,
          follows: rawSnapshot.followerIds.length,
          comments: rawSnapshot.commentIds.length,
          timestamp: Date.now(),
        })
      );
    }

    setIsNotifModalOpen(true);
  };

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-2 sm:top-4 z-30 mx-2 sm:mx-4 md:mx-6 my-2 sm:my-4 px-3 sm:px-5 md:px-7 py-2.5 sm:py-3 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#101722] border border-neutral-300/80 dark:border-white/20 shadow-xl dark:shadow-2xl flex items-center justify-between gap-2 sm:gap-4 relative transition-colors duration-200">
        {/* Background Layer with Overflow Hidden so pattern stays inside rounded corners without clipping popups */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
          {/* Football Pattern Background (Optimized WebP, 153KB vs 3.5MB original) */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-65 dark:opacity-50 transition-opacity duration-300"
            style={{
              backgroundImage: "url('/assets/football-pattern.webp')",
            }}
          />

          {/* Cinematic Vignette & Emerald Stadium Spotlight */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-white/50 dark:from-[#101722]/60 dark:via-transparent dark:to-[#101722]/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_50%_-10%,rgba(16,185,129,0.25),transparent)] dark:bg-[radial-gradient(ellipse_70%_90%_at_50%_-10%,rgba(16,185,129,0.35),transparent)]" />

          {/* Top Edge Specular Neon Accent */}
          <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />
        </div>

        {/* Mobile menu toggle & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 md:hidden relative z-10">
          <button
            onClick={onOpenMobile}
            className="size-9 sm:size-10 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-[#16212e] border border-neutral-300 dark:border-white/20 flex items-center justify-center text-neutral-800 dark:text-neutral-200 cursor-pointer shadow-xs active:scale-95"
            aria-label="Open Mobile Menu"
          >
            <Menu className="size-4.5 sm:size-5" />
          </button>
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
            <div className="size-7 sm:size-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-neutral-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/25 p-1 overflow-hidden">
              <img
                src="/assets/football.png"
                alt="REMONTADA Logo"
                className="size-full object-contain"
              />
            </div>
            <span className="font-display font-black text-sm sm:text-base text-neutral-900 dark:text-white tracking-tight">REMONTADA</span>
          </Link>
        </div>

        {/* Desktop User Search Bar with Live Suggestions Dropdown */}
        <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl relative z-10">
          <form onSubmit={handleSearch} className="w-full flex items-center relative">
            <Search className="size-4 text-neutral-500 dark:text-neutral-400 absolute left-4.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search footballers, players, @usernames..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) {
                  setShowSearchDropdown(true);
                }
              }}
              className="w-full h-11 pl-12 pr-10 rounded-2xl bg-white/90 dark:bg-[#16212e]/95 border border-neutral-300 dark:border-white/20 text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
            />
            {isSearching ? (
              <Loader2 className="size-4 text-emerald-400 absolute right-4 animate-spin pointer-events-none" />
            ) : searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchDropdown(false);
                }}
                className="size-5 rounded-full bg-neutral-200 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 text-neutral-600 dark:text-neutral-300 flex items-center justify-center absolute right-3.5 cursor-pointer text-xs"
              >
                <X className="size-3" />
              </button>
            ) : null}
          </form>

          {/* Live User Search Results Popover Dropdown */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute top-13 left-0 w-full z-50 rounded-2xl bg-white dark:bg-[#121a26] border border-neutral-200 dark:border-white/20 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 bg-neutral-50 dark:bg-[#0e1622] border-b border-neutral-200 dark:border-white/[0.08] flex items-center justify-between text-[11px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                <span>Players matching "{searchQuery}"</span>
                <span>{searchResults.length} {searchResults.length === 1 ? "player" : "players"}</span>
              </div>

              <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-1.5 space-y-1">
                {isSearching ? (
                  <div className="py-7 text-center text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin text-emerald-500" />
                    <span>Searching players...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => handleSelectUser(user.username)}
                      className="w-full p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/[0.08] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={getAvatarUrl(user)}
                          alt={user.fullName || user.username}
                          className="size-9 rounded-xl object-cover ring-1 ring-neutral-200 dark:ring-white/15 group-hover:ring-emerald-500/50 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate">
                            {user.fullName || user.username}
                          </div>
                          <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate flex items-center gap-2">
                            <span>@{user.username}</span>
                            {user.favouriteClub && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10">
                                {user.favouriteClub}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-semibold text-emerald-500 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Profile
                        </span>
                        <ChevronRight className="size-4 text-neutral-400 dark:text-neutral-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-7 text-center text-xs text-neutral-400 space-y-1">
                    <p className="font-semibold text-neutral-300">No footballers found</p>
                    <p className="text-[11px] text-neutral-500">Try searching with a different name or @username</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 relative z-10">
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`md:hidden size-9 sm:size-10 rounded-xl sm:rounded-2xl border flex items-center justify-center transition-colors cursor-pointer shadow-xs ${mobileSearchOpen
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-500"
                : "bg-white/90 dark:bg-[#16212e] border-neutral-300 dark:border-white/20 text-neutral-700 dark:text-neutral-200"
              }`}
            title="Search Players"
            aria-label="Toggle Player Search"
          >
            <Search className="size-4 sm:size-4.5" />
          </button>

          {/* Mobile Theme Toggle Button (Positioned between Search and Notifications) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="md:hidden relative size-9 sm:size-10 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-[#16212e] border border-neutral-300 dark:border-white/20 hover:border-emerald-500/50 text-neutral-700 dark:text-neutral-200 transition-colors flex items-center justify-center cursor-pointer shadow-xs group/theme active:scale-95 shrink-0"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label="Toggle Dark/Light Theme"
          >
            {theme === "dark" ? (
              <Sun className="size-4 sm:size-4.5 text-amber-400 group-hover/theme:rotate-45 transition-transform duration-200" />
            ) : (
              <Moon className="size-4 sm:size-4.5 text-indigo-400 group-hover/theme:-rotate-12 transition-transform duration-200" />
            )}
          </button>

          {/* LIVE MATCHES Button (Desktop) */}
          <Link
            to="/live-matches"
            className="hidden lg:flex items-center gap-2 h-10 px-3.5 rounded-2xl bg-white/90 dark:bg-[#16212e] hover:bg-neutral-100 dark:hover:bg-white/10 border border-red-500/30 hover:border-red-500/60 text-neutral-900 dark:text-white font-bold text-xs transition-all shadow-xs group active:scale-[0.98]"
          >
            <span className="size-2 rounded-full bg-red-500 animate-pulse group-hover:scale-125 transition-transform" />
            <span className="text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 font-extrabold uppercase tracking-wider text-[11px]">
              Live
            </span>
          </Link>

          {/* Quick Create Post (Desktop) */}
          <Link
            to="/create-post"
            className="hidden md:flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98]"
          >
            <PlusCircle className="size-3.5 sm:size-4 stroke-[2.5]" />
            <span>Create Post</span>
          </Link>

          {/* Notification Button & Floating Activity Tooltip Bubble */}
          <div className="relative">
            <button
              type="button"
              onClick={handleOpenNotifications}
              className="relative size-9 sm:size-10 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-[#16212e] border border-neutral-300 dark:border-white/20 hover:border-emerald-500/50 text-neutral-700 dark:text-neutral-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
              title="Open Notification Center"
            >
              <Bell className="size-4 sm:size-4.5" />
              {(activityCounts.likes > 0 || activityCounts.follows > 0 || activityCounts.comments > 0) && (
                <span className="absolute top-1.5 right-1.5 size-2 sm:size-2.5 rounded-full bg-[#ff3040] ring-2 ring-white dark:ring-[#101722] animate-pulse" />
              )}
            </button>

            {/* Instagram-Style Floating Activity Speech Bubble */}
            {showActivityBubble && (activityCounts.likes > 0 || activityCounts.follows > 0 || activityCounts.comments > 0) && (
              <div
                onClick={handleOpenNotifications}
                className="absolute top-12 sm:top-13 right-0 z-50 animate-in fade-in slide-in-from-top-2 duration-300 cursor-pointer select-none max-w-[calc(100vw-2rem)]"
              >
                {/* Pointer Arrow pointing UP to Bell */}
                <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[8px] border-b-[#ff3040] mr-3 ml-auto drop-shadow-sm" />

                {/* Bubble Container */}
                <div className="bg-[#ff3040] hover:bg-[#e02434] !text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-4 text-xs font-black tracking-tight border border-white/25 transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
                  <div className="flex items-center gap-1 !text-white">
                    <Heart className="size-3.5 fill-white stroke-none !text-white" />
                    <span className="!text-white text-white font-extrabold text-xs">{activityCounts.likes}</span>
                  </div>

                  <div className="flex items-center gap-1 !text-white">
                    <User className="size-3.5 fill-white stroke-none !text-white" />
                    <span className="!text-white text-white font-extrabold text-xs">{activityCounts.follows}</span>
                  </div>

                  <div className="flex items-center gap-1 !text-white">
                    <MessageCircle className="size-3.5 fill-white stroke-none !text-white" />
                    <span className="!text-white text-white font-extrabold text-xs">{activityCounts.comments}</span>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Theme Toggle Button (Visible on Desktop / Tablets) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden md:flex relative size-9 sm:size-10 rounded-xl sm:rounded-2xl bg-neutral-100 dark:bg-[#080d14] border border-neutral-300 dark:border-white/10 hover:border-emerald-500/50 text-neutral-700 dark:text-neutral-300 transition-colors items-center justify-center cursor-pointer shadow-xs group/theme active:scale-95 shrink-0"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label="Toggle Dark/Light Theme"
          >
            {theme === "dark" ? (
              <Sun className="size-4 sm:size-4.5 text-amber-400 group-hover/theme:rotate-45 group-hover/theme:scale-110 transition-transform duration-200" />
            ) : (
              <Moon className="size-4 sm:size-4.5 text-indigo-400 group-hover/theme:-rotate-12 group-hover/theme:scale-110 transition-transform duration-200" />
            )}
          </button>

          {/* User Profile Avatar (Desktop/PC only) */}
          {status && userData ? (
            <Link
              to={`/channel/${userData.username}`}
              className="hidden md:flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1 rounded-xl sm:rounded-2xl bg-neutral-100 dark:bg-[#080d14] border border-neutral-300 dark:border-white/10 hover:border-emerald-500/50 transition-colors group cursor-pointer shadow-xs shrink-0"
            >
              <img
                src={getAvatarUrl(userData)}
                alt={userData.fullName || "User"}
                className="size-7 sm:size-7.5 rounded-lg sm:rounded-xl object-cover ring-1 ring-emerald-500/40"
              />
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 hidden sm:inline max-w-[100px] md:max-w-[120px] truncate">
                {userData.fullName?.split(" ")[0] || userData.username}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 shrink-0"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Search Bar Dropdown when expanded */}
      {mobileSearchOpen && (
        <div className="md:hidden mx-2 sm:mx-4 -mt-1 mb-3 px-3 py-3 rounded-2xl bg-[#0d141f] border border-white/15 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 relative z-30">
          <form onSubmit={handleSearch} className="w-full flex items-center relative">
            <Search className="size-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Search footballers, @usernames..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              className="w-full h-10 pl-10 pr-9 rounded-xl bg-[#060a0f] border border-white/15 text-xs font-semibold text-white placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchDropdown(false);
                }}
                className="size-5 rounded-full bg-white/10 text-neutral-300 flex items-center justify-center absolute right-3 cursor-pointer"
              >
                <X className="size-3" />
              </button>
            )}
          </form>

          {/* Mobile Search Results */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="mt-2 max-h-60 overflow-y-auto custom-scrollbar divide-y divide-white/[0.06] bg-[#080d14] rounded-xl border border-white/10">
              {isSearching ? (
                <div className="py-5 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin text-emerald-500" />
                  <span>Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => {
                      handleSelectUser(user.username);
                      setMobileSearchOpen(false);
                    }}
                    className="w-full p-2.5 hover:bg-white/5 flex items-center justify-between gap-2.5 text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={getAvatarUrl(user)}
                        alt={user.fullName || user.username}
                        className="size-8 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {user.fullName || user.username}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="size-3.5 text-neutral-500 shrink-0" />
                  </button>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-neutral-400">
                  No footballers found
                </div>
              )}
            </div>
          )}
        </div>
      )}


      {/* Full Notification Center Modal */}
      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
      />
    </>
  );
}
