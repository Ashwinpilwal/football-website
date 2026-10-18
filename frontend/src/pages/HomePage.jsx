import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MapPin,
  Search,
  Radio,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  ArrowRight,
  Shield,
  Star,
  CheckCircle2,
  Send,
  Image as ImageIcon,
  PlusCircle,
  Flame,
  Maximize2,
  Edit3,
  Smile,
  Reply,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { turfService } from "@/services/turf.service";
import { postService, likeService, commentService, tweetService } from "@/services/social.service";
import { authService } from "@/services/auth.service";
import { followToggle } from "@/services/follow.service";
import PostMediaCarousel from "@/components/common/PostMediaCarousel";
import PostDetailModal from "@/components/common/PostDetailModal";
import EditPostModal from "@/components/common/EditPostModal";
import SharePostModal from "@/components/common/SharePostModal";
import PeopleToFollowModal from "@/components/common/PeopleToFollowModal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import LoginModal from "@/components/auth/LoginModal";
import EmojiPicker from "@/components/common/EmojiPicker";
import FootballLoader from "@/components/common/FootballLoader";
import { getAvatarUrl, cleanAddress, optimizeCloudinaryPostImage } from "@/utils/avatar.utils";
import toast from "react-hot-toast";

// Recursive Inline Comment Thread Component for Home Feed
function InlineCommentThreadItem({
  comment,
  repliesMap,
  expandedReplies,
  toggleReplies,
  startReply,
  handleToggleCommentLike,
  handleDeleteComment,
  userData,
  postId,
  postOwnerId,
  depth = 0,
}) {
  const commentIdStr = comment._id?.toString();
  const childReplies = repliesMap[commentIdStr] || [];
  const hasReplies = childReplies.length > 0;
  const isExpanded = !!expandedReplies[commentIdStr];

  const isCommentAuthor =
    userData &&
    ((comment.owner?._id && userData?._id && comment.owner._id.toString() === userData._id.toString()) ||
      (comment.owner?.username && userData?.username && comment.owner.username === userData.username));

  const isPostAuthor =
    userData &&
    ((postOwnerId && userData?._id && postOwnerId.toString() === userData._id.toString()) ||
      (userData?.role === "admin"));

  const canDelete = isCommentAuthor || isPostAuthor;
  const isLiked =
    comment.isLiked ||
    (Array.isArray(comment.likes) &&
      comment.likes.some((l) => (l.likedBy?._id || l.likedBy || l)?.toString() === userData?._id?.toString()));
  const likesCount = comment.likesCount ?? (Array.isArray(comment.likes) ? comment.likes.length : 0);

  return (
    <div className={`text-xs space-y-1.5 ${depth > 0 ? "pl-3 sm:pl-4 border-l-2 border-emerald-500/25 mt-1.5" : ""}`}>
      <div className="p-2.5 rounded-2xl bg-black/40 border border-white/[0.05] flex items-start justify-between gap-2.5 group/comment hover:border-white/10 transition-all">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <Link
            to={`/channel/${comment.owner?.username || "player"}`}
            className="shrink-0 group/av"
            title={`View @${comment.owner?.username || "player"}'s profile`}
          >
            <img
              src={getAvatarUrl(comment.owner)}
              alt="avatar"
              className="size-7 rounded-xl object-cover ring-1 ring-white/10 group-hover/av:ring-emerald-400 group-hover/av:scale-105 transition-all"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to={`/channel/${comment.owner?.username || "player"}`}
                className="font-bold text-white hover:text-emerald-400 text-xs transition-colors cursor-pointer"
              >
                @{comment.owner?.username || "user"}
              </Link>
              {comment.replyToUser && (
                <Link
                  to={`/channel/${comment.replyToUser.username || "player"}`}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-0.5"
                >
                  <span>↳</span> @{comment.replyToUser.username}
                </Link>
              )}
              {comment.createdAt && (
                <span className="text-[10px] text-neutral-500 font-medium">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <p className="text-neutral-200 mt-1 leading-relaxed text-xs sm:text-[13px] break-words">
              {comment.content}
            </p>

            <div className="flex items-center gap-3 pt-1">
              {/* Reply Button */}
              <button
                type="button"
                onClick={() => startReply(postId, comment)}
                className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <Reply className="size-3" />
                <span>Reply</span>
              </button>

              {/* View / Hide Replies Toggle Button */}
              {hasReplies && (
                <button
                  type="button"
                  onClick={() => toggleReplies(commentIdStr)}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="size-3" />
                      <span>Hide {childReplies.length} {childReplies.length === 1 ? "reply" : "replies"}</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="size-3" />
                      <span>View {childReplies.length} {childReplies.length === 1 ? "reply" : "replies"}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handleToggleCommentLike(postId, comment._id)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg transition-all text-xs font-semibold cursor-pointer shrink-0 ${isLiked
                ? "text-rose-400 bg-rose-500/15"
                : "text-neutral-400 hover:text-rose-400 hover:bg-white/5"
              }`}
            title={isLiked ? "Unlike comment" : "Like comment"}
          >
            <Heart className={`size-3.5 ${isLiked ? "fill-rose-400" : ""}`} />
            {likesCount > 0 && <span className="text-[10.5px] font-bold">{likesCount}</span>}
          </button>

          {canDelete && (
            <button
              type="button"
              onClick={() => handleDeleteComment(postId, comment._id)}
              className="size-5.5 rounded-md bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-all opacity-0 group-hover/comment:opacity-100 cursor-pointer"
              title="Delete comment & replies"
            >
              <Trash2 className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Render Nested Children when expanded */}
      {hasReplies && isExpanded && (
        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          {childReplies.map((child) => (
            <InlineCommentThreadItem
              key={child._id}
              comment={child}
              repliesMap={repliesMap}
              expandedReplies={expandedReplies}
              toggleReplies={toggleReplies}
              startReply={startReply}
              handleToggleCommentLike={handleToggleCommentLike}
              handleDeleteComment={handleDeleteComment}
              userData={userData}
              postId={postId}
              postOwnerId={postOwnerId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, status } = useSelector((state) => state.auth);
  const locationState = useSelector((state) => state.location);
  const [isHomeTweetEmojiOpen, setIsHomeTweetEmojiOpen] = useState(false);
  const [activeReplyEmojiTweetId, setActiveReplyEmojiTweetId] = useState(null);

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loadingMore, setLoadingMore] = useState(false);
  const feedObserverRef = useRef(null);
  const hasUserScrolledRef = useRef(false);

  const [turfs, setTurfs] = useState([]);
  const [loadingTurfs, setLoadingTurfs] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const [postText, setPostText] = useState("");
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyingToMap, setReplyingToMap] = useState({});
  const [expandedRepliesMap, setExpandedRepliesMap] = useState({});

  // Expanded Post Detail Modal & Edit Post Modal & Share Modal & People to Follow
  const [selectedPostModal, setSelectedPostModal] = useState(null);
  const [editingPostModal, setEditingPostModal] = useState(null);
  const [sharingPostModal, setSharingPostModal] = useState(null);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);

  // Auth modal state for guests
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("Please sign in to interact with posts and squads.");

  // Track if user has actually scrolled down to avoid auto-triggering on mount
  useEffect(() => {
    const handleUserScroll = () => {
      if (window.scrollY > 20) {
        hasUserScrolledRef.current = true;
      }
    };
    window.addEventListener("scroll", handleUserScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleUserScroll);
  }, []);

  // 1. Fetch Real Posts & Tweets from Backend
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchPostsAndTweets = async () => {
      setLoadingPosts(true);
      try {
        const [postsRes, tweetsRes] = await Promise.allSettled([
          postService.getAllPosts(),
          tweetService.getCommunityTweets(),
        ]);

        const postsData = postsRes.status === "fulfilled" ? postsRes.value?.data || [] : [];
        const tweetsData = tweetsRes.status === "fulfilled" ? tweetsRes.value?.data || [] : [];

        const formattedPosts = (Array.isArray(postsData) ? postsData : []).map((p) => ({
          ...p,
          itemType: "post",
          isLiked:
            userData?._id && Array.isArray(p.likes)
              ? p.likes.some(
                (l) =>
                  (l.likedBy?._id || l.likedBy || l)?.toString() ===
                  userData._id.toString()
              )
              : !!p.isLiked,
        }));

        const formattedTweets = (Array.isArray(tweetsData) ? tweetsData : []).map((t) => ({
          ...t,
          itemType: "tweet",
        }));

        setPosts(shuffleArray([...formattedPosts, ...formattedTweets]));
        setVisibleCount(3);
      } catch (err) {
        console.log("Error fetching posts & tweets:", err);
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPostsAndTweets();
  }, [userData?._id]);

  // Infinite Scroll: Reveal next 3 posts on scroll
  const loadMoreFeed = useCallback(() => {
    if (loadingMore || visibleCount >= posts.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 3, posts.length));
      setLoadingMore(false);
    }, 200);
  }, [loadingMore, visibleCount, posts.length]);

  useEffect(() => {
    if (visibleCount >= posts.length || loadingPosts) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Only trigger if intersecting AND user has actively scrolled
        if (entries[0].isIntersecting && hasUserScrolledRef.current) {
          loadMoreFeed();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const target = feedObserverRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [visibleCount, posts.length, loadingPosts, loadMoreFeed]);

  // 2. Fetch Real Turfs from Backend
  useEffect(() => {
    const fetchTurfs = async () => {
      setLoadingTurfs(true);
      try {
        const params = {};
        if (locationState?.latitude && locationState?.longitude) {
          params.lat = locationState.latitude;
          params.lng = locationState.longitude;
        }
        const res = await turfService.getNearbyTurfs(params);
        const turfsData = res?.data || [];
        setTurfs(Array.isArray(turfsData) ? turfsData : []);
      } catch (err) {
        console.log("Error fetching turfs:", err);
        setTurfs([]);
      } finally {
        setLoadingTurfs(false);
      }
    };
    fetchTurfs();
  }, [locationState]);

  // 3. Fetch Real Suggested Users from Backend
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await authService.getSuggestedUsers();
        if (res?.data) {
          setSuggestedUsers(res.data);
        }
      } catch (err) {
        console.log("Suggested users API:", err);
      }
    };
    if (status) {
      fetchSuggested();
    }
  }, [status]);

  // Real Like toggle (Protected for logged-in users only)
  const handleLikePost = async (postId) => {
    if (!status || !userData) {
      setModalMessage("Please sign in to like this match post.");
      setLoginModalOpen(true);
      return;
    }

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p._id === postId) {
          const isLiked = !p.isLiked;
          const currentCount = p.likesCount ?? (Array.isArray(p.likes) ? p.likes.length : 0);
          const newLikesCount = isLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
          return {
            ...p,
            isLiked,
            likesCount: newLikesCount,
            likes: isLiked
              ? [...(p.likes || []), { likedBy: { _id: userData._id, username: userData.username } }]
              : (p.likes || []).filter(
                (l) => (l.likedBy?._id || l.likedBy || l)?.toString() !== userData._id.toString()
              ),
          };
        }
        return p;
      })
    );

    if (selectedPostModal?._id === postId) {
      const isLiked = !selectedPostModal.isLiked;
      const currentCount =
        selectedPostModal.likesCount ??
        (Array.isArray(selectedPostModal.likes) ? selectedPostModal.likes.length : 0);
      const newLikesCount = isLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
      setSelectedPostModal({
        ...selectedPostModal,
        isLiked,
        likesCount: newLikesCount,
      });
    }

    try {
      const isTweet = posts.find((p) => p._id === postId)?.itemType === "tweet";
      if (isTweet) {
        await likeService.toggleTweetLike(postId);
      } else {
        await likeService.togglePostLike(postId);
      }
    } catch (err) {
      console.log("Like error:", err);
    }
  };

  // Helper to build comment tree
  const buildCommentTree = (comments = []) => {
    const roots = [];
    const map = {};
    (Array.isArray(comments) ? comments : []).forEach((c) => {
      const pId = c.parentComment?._id || c.parentComment;
      if (pId) {
        const key = pId.toString();
        if (!map[key]) map[key] = [];
        map[key].push(c);
      } else {
        roots.push(c);
      }
    });
    return { roots, repliesMap: map };
  };

  const startInlineReply = (postId, comment) => {
    if (!status || !userData) {
      setModalMessage("Please sign in to reply to comments.");
      setLoginModalOpen(true);
      return;
    }
    setReplyingToMap((prev) => ({
      ...prev,
      [postId]: {
        commentId: comment._id,
        userId: comment.owner?._id,
        username: comment.owner?.username || "user",
        fullName: comment.owner?.fullName || comment.owner?.username,
        snippet: comment.content?.slice(0, 40),
      },
    }));
    const rootId = comment.parentComment
      ? (comment.parentComment._id || comment.parentComment).toString()
      : comment._id.toString();
    setExpandedRepliesMap((prev) => ({
      ...prev,
      [rootId]: true,
      [comment._id.toString()]: true,
    }));
  };

  const toggleInlineReplies = (commentId) => {
    setExpandedRepliesMap((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const [deleteCommentModal, setDeleteCommentModal] = useState({
    isOpen: false,
    postId: null,
    commentId: null,
    loading: false,
  });

  const handleDeleteComment = (postId, commentId) => {
    setDeleteCommentModal({
      isOpen: true,
      postId,
      commentId,
      loading: false,
    });
  };

  const confirmDeleteComment = async () => {
    const { postId, commentId } = deleteCommentModal;
    if (!commentId) return;

    setDeleteCommentModal((prev) => ({ ...prev, loading: true }));
    try {
      const res = await commentService.deleteComment(commentId);
      const deletedIds = new Set(res?.data?.deletedIds || [commentId]);

      setPosts((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            const currentComments = (p.comments || []).filter(
              (c) => !deletedIds.has(c._id?.toString())
            );
            return {
              ...p,
              comments: currentComments,
              commentsCount: Math.max(
                0,
                (p.commentsCount || (p.comments?.length || 0)) - deletedIds.size
              ),
            };
          }
          return p;
        })
      );

      if (selectedPostModal?._id === postId) {
        const currentComments = (selectedPostModal.comments || []).filter(
          (c) => !deletedIds.has(c._id?.toString())
        );
        setSelectedPostModal({
          ...selectedPostModal,
          comments: currentComments,
          commentsCount: Math.max(
            0,
            (selectedPostModal.commentsCount || 1) - deletedIds.size
          ),
        });
      }

      toast.success(
        deletedIds.size > 1
          ? `Deleted comment and ${deletedIds.size - 1} ${deletedIds.size === 2 ? "reply" : "replies"
          }.`
          : "Comment deleted."
      );
      setDeleteCommentModal({ isOpen: false, postId: null, commentId: null, loading: false });
    } catch (err) {
      toast.error("Failed to delete comment.");
      setDeleteCommentModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Toggle comments drawer & load real comments if not loaded
  const handleToggleComments = async (postId) => {
    const isOpening = openCommentsPostId !== postId;
    setOpenCommentsPostId(isOpening ? postId : null);

    if (isOpening) {
      try {
        const res = await commentService.showAllComments(postId, 1, 50);
        const fetchedDocs = res?.data?.docs || (Array.isArray(res?.data) ? res.data : []);
        if (fetchedDocs.length > 0) {
          setPosts((prev) =>
            prev.map((p) =>
              p._id === postId
                ? { ...p, comments: fetchedDocs, commentsCount: res?.data?.totalDocs ?? fetchedDocs.length }
                : p
            )
          );
        }
      } catch (err) {
        console.log("Comments fetch error:", err);
      }
    }
  };

  // Toggle Comment Like
  const handleToggleCommentLike = async (postId, commentId) => {
    if (!status || !userData) {
      setModalMessage("Please sign in to like comments.");
      setLoginModalOpen(true);
      return;
    }

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p._id === postId && Array.isArray(p.comments)) {
          const updatedComments = p.comments.map((c) => {
            if (c._id === commentId) {
              const currentLiked =
                c.isLiked ||
                (Array.isArray(c.likes) &&
                  c.likes.some((l) => (l.likedBy?._id || l.likedBy || l)?.toString() === userData?._id?.toString()));
              const currentCount = c.likesCount ?? (Array.isArray(c.likes) ? c.likes.length : 0);
              return {
                ...c,
                isLiked: !currentLiked,
                likesCount: currentLiked ? Math.max(0, currentCount - 1) : currentCount + 1,
              };
            }
            return c;
          });
          return { ...p, comments: updatedComments };
        }
        return p;
      })
    );

    try {
      await likeService.toggleCommentLike(commentId);
    } catch (err) {
      toast.error("Failed to update comment like.");
    }
  };

  // Real Comment submit (Supports nested replies)
  const handleAddComment = async (postId) => {
    if (!status || !userData) {
      setModalMessage("Please sign in to write a comment.");
      setLoginModalOpen(true);
      return;
    }

    const content = commentInputs[postId];
    if (!content || !content.trim()) return;

    const replying = replyingToMap[postId];
    const textToSend = content.trim();

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    setReplyingToMap((prev) => ({ ...prev, [postId]: null }));

    const optimisticComment = {
      _id: `temp_${Date.now()}`,
      content: textToSend,
      owner: {
        _id: userData?._id,
        username: userData?.username || "you",
        fullName: userData?.fullName || "You",
        avatar: userData?.avatar,
      },
      parentComment: replying?.commentId || null,
      replyToUser: replying
        ? {
          _id: replying.userId,
          username: replying.username,
          fullName: replying.fullName,
        }
        : null,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p._id === postId) {
          const existing = p.comments || [];
          const currentCount = p.commentsCount ?? existing.length;
          return {
            ...p,
            comments: [...existing, optimisticComment],
            commentsCount: currentCount + 1,
          };
        }
        return p;
      })
    );

    try {
      const res = await commentService.addComment(postId, {
        content: textToSend,
        parentComment: replying?.commentId || null,
        replyToUser: replying?.userId || null,
      });

      if (res?.data) {
        const savedComment = res.data;
        setPosts((prev) =>
          prev.map((p) => {
            if (p._id === postId) {
              const updated = (p.comments || []).map((c) =>
                c._id === optimisticComment._id ? savedComment : c
              );
              return { ...p, comments: updated };
            }
            return p;
          })
        );
      }
      toast.success(replying ? "Reply posted!" : "Comment posted!");
    } catch (err) {
      console.log("Comment error:", err);
      toast.error("Failed to post comment.");
    }
  };

  // Real Follow toggle
  const handleToggleFollow = async (username) => {
    if (!status || !userData) {
      setModalMessage(`Please sign in to follow @${username}.`);
      setLoginModalOpen(true);
      return;
    }

    setSuggestedUsers((prev) =>
      prev.map((u) => {
        if (u.username === username) {
          const updated = !u.isFollowing;
          toast.success(updated ? `Following @${username}` : `Unfollowed @${username}`);
          return { ...u, isFollowing: updated };
        }
        return u;
      })
    );

    try {
      await followToggle(username);
    } catch (err) {
      console.log("Follow error:", err);
    }
  };

  // Quick tweet post
  const handleQuickShoutout = async (e) => {
    e.preventDefault();
    if (!status || !userData) {
      setModalMessage("Please sign in to publish a tweet.");
      setLoginModalOpen(true);
      return;
    }
    if (!postText.trim()) return;

    const content = postText.trim();
    setPostText("");
    try {
      const res = await tweetService.createTweet(content);
      const created = res?.data || {
        _id: `tw_${Date.now()}`,
        owner: {
          username: userData?.username || "you",
          fullName: userData?.fullName || "You",
          avatar: userData?.avatar,
        },
        content,
        createdAt: new Date().toISOString(),
        itemType: "tweet",
      };
      setPosts((prev) => [{ ...created, itemType: "tweet" }, ...prev]);
      toast.success("Tweet posted to pitch wall!");
    } catch (err) {
      toast.error("Failed to post tweet.");
      setPostText(content);
    }
  };

  const handleUpdatePostFromModal = (updatedPost) => {
    setSelectedPostModal(updatedPost);
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? { ...updatedPost, itemType: "post" } : p)));
  };

  const handleDeletePostFromHome = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm("Are you sure you want to delete this tweet?")) return;
    try {
      await tweetService.deleteTweet(tweetId);
      setPosts((prev) => prev.filter((p) => p._id !== tweetId));
      toast.success("Tweet deleted successfully!");
    } catch (err) {
      console.error("Delete tweet error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete tweet");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Clean & Uncluttered Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
            {userData ? `Hey, ${userData.fullName?.split(" ")[0] || userData.username}` : "Matchday Feed"}
          </h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-0.5">
            Latest highlights, match updates & nearby pitch radar
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/find-turfs">
            <Button variant="primary" size="sm" className="h-9.5 px-4 text-xs font-bold rounded-xl gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20">
              <MapPin className="size-3.5" /> Book Turf
            </Button>
          </Link>
          <Link to="/create-post">
            <Button variant="secondary" size="sm" className="h-9.5 px-4 text-xs font-bold rounded-xl gap-1.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 cursor-pointer">
              <PlusCircle className="size-3.5 text-emerald-400" /> New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: USER POSTS & SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CENTER / DOMINANT COLUMN: USER POSTS */}
        <div className="lg:col-span-8 space-y-7 max-w-2xl mx-auto w-full">
          {/* Post Composer Bar */}
          <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-cyan-500/30 space-y-4 shadow-2xl relative overflow-hidden transition-all">
            {/* Multi-Color Specular Gradient Top Accent */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500" />
            
            <div className="flex items-center gap-3 relative">
              <img
                src={getAvatarUrl(userData)}
                alt="Avatar"
                className="size-10 rounded-2xl object-cover ring-1 ring-cyan-500/30 shrink-0 shadow-sm"
              />
              <div className="flex-1 relative flex items-center min-w-0">
                <input
                  type="text"
                  placeholder="Share a match update, football thought, or shoutout..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleQuickShoutout();
                    }
                  }}
                  className="w-full h-11 pl-4 pr-10 rounded-2xl bg-black/40 border border-white/10 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setIsHomeTweetEmojiOpen((prev) => !prev)}
                  className={`absolute right-2.5 size-7 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                    isHomeTweetEmojiOpen ? "text-cyan-400 bg-cyan-500/20" : "text-neutral-400 hover:text-white"
                  }`}
                  title="Insert emoji"
                >
                  <Smile className="size-4 sm:size-4.5" />
                </button>
              </div>

              <EmojiPicker
                isOpen={isHomeTweetEmojiOpen}
                onClose={() => setIsHomeTweetEmojiOpen(false)}
                onSelectEmoji={(emoji) => {
                  setPostText((prev) => prev + emoji);
                }}
                className="bottom-14 left-0 sm:left-auto sm:right-0"
              />

              <Button
                onClick={handleQuickShoutout}
                disabled={!postText.trim()}
                size="sm"
                variant="primary"
                className="h-10 sm:h-11 px-3.5 sm:px-5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold shrink-0 shadow-md shadow-emerald-500/25 cursor-pointer"
              >
                <Send className="size-3.5 sm:size-4" />
                <span className="hidden sm:inline">Tweet</span>
              </Button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-neutral-400 font-medium">
              <Link to="/create-post" className="flex items-center gap-2 text-neutral-300 hover:text-cyan-400 transition-colors group/upload">
                <ImageIcon className="size-4.5 text-cyan-400 group-hover/upload:scale-110 transition-transform" />
                <span className="text-sm font-semibold">Upload Photos / Match Video</span>
              </Link>
              <Link to="/create-post" className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300">
                Media Studio →
              </Link>
            </div>
          </div>

          {/* Posts Stream */}
          <div className="space-y-7">
            {loadingPosts ? (
              <FootballLoader message="Loading matchday posts..." />
            ) : posts.length > 0 ? (
              <>
                {posts.slice(0, visibleCount).map((post) =>
                  post.itemType === "tweet" ? (
                    <div
                      key={`tw_${post._id}`}
                      className="glass-card rounded-3xl p-6 sm:p-7 border border-emerald-500/20 hover:border-emerald-500/40 space-y-4 shadow-2xl transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <Link to={`/channel/${post.owner?.username || "player"}`} className="flex items-center gap-3.5 group">
                          <img
                            src={getAvatarUrl(post.owner)}
                            alt="Author"
                            className="size-11 rounded-2xl object-cover ring-1 ring-emerald-500/30 group-hover:ring-emerald-400 transition-all shadow-md"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                                {post.owner?.fullName || post.owner?.username || "Footballer"}
                              </span>
                              <CheckCircle2 className="size-4 text-emerald-400" />
                            </div>
                            <span className="text-xs text-neutral-400 font-medium">
                              @{post.owner?.username || "player"} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
                            </span>
                          </div>
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            💬 Tweet
                          </span>
                          {/* Only tweet owner can delete */}
                          {Boolean(
                            userData &&
                            ((post.owner?._id && userData?._id && post.owner._id.toString() === userData._id.toString()) ||
                              (post.owner?.username && userData?.username && post.owner.username === userData.username))
                          ) && (
                              <button
                                type="button"
                                onClick={() => handleDeleteTweet(post._id)}
                                className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
                                title="Delete your tweet"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                        </div>
                      </div>

                      {post.content && (
                        <p className="text-[15.5px] text-neutral-100 leading-relaxed font-normal pt-1">
                          {post.content}
                        </p>
                      )}

                      {/* Tweet Photo Attachment with Cloudinary optimization */}
                      {post.photo?.url && (
                        <div className="rounded-2xl overflow-hidden border border-white/10 max-h-96 bg-black/40">
                          <img
                            src={optimizeCloudinaryPostImage(post.photo.url)}
                            alt="Tweet photo attachment"
                            loading="lazy"
                            className="w-full h-auto max-h-96 object-cover hover:scale-[1.01] transition-transform cursor-pointer"
                            onClick={() => window.open(post.photo.url, "_blank")}
                          />
                        </div>
                      )}

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-neutral-400">
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          onClick={() => handleLikePost(post._id)}
                          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${post.isLiked
                              ? "bg-red-500/15 border-red-500/30 text-red-400 font-bold"
                              : "bg-white/[0.04] border-white/[0.06] hover:text-white"
                            }`}
                        >
                          <Heart className={`size-4 ${post.isLiked ? "fill-red-400" : ""}`} />
                          <span>{post.likesCount || 0}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleComments(post._id)}
                          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${openCommentsPostId === post._id
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-bold"
                              : "bg-white/[0.04] border-white/[0.06] hover:text-white"
                            }`}
                        >
                          <MessageCircle className="size-4" />
                          <span>{post.commentsCount ?? post.comments?.length ?? 0}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSharingPostModal(post)}
                          className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer"
                          title="Share Tweet"
                        >
                          <Share2 className="size-4" />
                        </button>
                      </div>

                      <span className="text-xs text-neutral-500 font-mono">Tweet</span>
                    </div>

                    {/* Interactive Tweet Comments Drawer */}
                    {openCommentsPostId === post._id && (
                      <div className="pt-3.5 border-t border-white/[0.08] space-y-3.5" onClick={(e) => e.stopPropagation()}>
                        {/* New Comment Input */}
                        <div className="flex items-center gap-2.5 relative">
                          <img
                            src={getAvatarUrl(userData)}
                            alt="You"
                            className="size-8 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                          />
                          <div className="flex-1 flex items-center relative">
                            <input
                              type="text"
                              value={commentInputs[post._id] || ""}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddComment(post._id);
                                }
                              }}
                              placeholder="Write a reply to this tweet..."
                              className="w-full h-9.5 pl-3.5 pr-9 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveReplyEmojiTweetId(activeReplyEmojiTweetId === post._id ? null : post._id);
                              }}
                              className={`absolute right-2 size-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${activeReplyEmojiTweetId === post._id
                                  ? "text-emerald-400 bg-emerald-500/20"
                                  : "text-neutral-400 hover:text-white"
                                }`}
                              title="Add Emoji to Reply"
                            >
                              <Smile className="size-3.5" />
                            </button>
                          </div>

                          <EmojiPicker
                            isOpen={activeReplyEmojiTweetId === post._id}
                            onClose={() => setActiveReplyEmojiTweetId(null)}
                            onSelectEmoji={(emoji) => {
                              setCommentInputs((prev) => ({
                                ...prev,
                                [post._id]: (prev[post._id] || "") + emoji,
                              }));
                            }}
                            className="bottom-12 left-0 sm:left-6"
                          />

                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            onClick={() => handleAddComment(post._id)}
                            disabled={!commentInputs[post._id]?.trim()}
                            className="h-9.5 px-3.5 rounded-xl text-xs font-bold gap-1 cursor-pointer shrink-0"
                          >
                            <Send className="size-3" />
                          </Button>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                          {post.comments && post.comments.length > 0 ? (
                            post.comments.map((c) => {
                              const isCommentOwner =
                                (c.owner?._id && userData?._id && c.owner._id.toString() === userData._id.toString()) ||
                                (c.owner?.username && userData?.username && c.owner.username === userData.username);
                              const isTweetOwner =
                                (post.owner?._id && userData?._id && post.owner._id.toString() === userData._id.toString()) ||
                                (post.owner?.username && userData?.username && post.owner.username === userData.username);

                              return (
                                <div
                                  key={c._id}
                                  className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-start justify-between gap-3 group/cmt"
                                >
                                  <div className="flex items-start gap-2.5 min-w-0">
                                    <Link
                                      to={`/channel/${c.owner?.username || "player"}`}
                                      className="shrink-0 group/av"
                                      title={`View @${c.owner?.username || "player"}'s profile`}
                                    >
                                      <img
                                        src={getAvatarUrl(c.owner)}
                                        alt={c.owner?.fullName || "User"}
                                        className="size-7 rounded-lg object-cover ring-1 ring-white/10 group-hover/av:ring-emerald-400 group-hover/av:scale-105 transition-all mt-0.5"
                                      />
                                    </Link>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <Link
                                          to={`/channel/${c.owner?.username || "player"}`}
                                          className="font-bold text-xs text-white hover:text-emerald-400 transition-colors truncate"
                                        >
                                          {c.owner?.fullName || c.owner?.username || "Player"}
                                        </Link>
                                        <Link
                                          to={`/channel/${c.owner?.username || "player"}`}
                                          className="text-[10px] text-neutral-400 hover:text-emerald-400 font-mono transition-colors"
                                        >
                                          @{c.owner?.username}
                                        </Link>
                                      </div>
                                      <p className="text-xs text-neutral-200 mt-1 leading-relaxed break-words font-normal">
                                        {c.content}
                                      </p>
                                    </div>
                                  </div>

                                  {(isCommentOwner || isTweetOwner) && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteComment(post._id, c._id)}
                                      className="opacity-0 group-hover/cmt:opacity-100 text-neutral-500 hover:text-red-400 p-1 transition-opacity cursor-pointer shrink-0"
                                      title="Delete reply"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </button>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-xs text-neutral-500 italic py-1.5 text-center">
                              No replies yet. Be the first to comment!
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    key={post._id}
                    className="glass-card rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-neutral-200 dark:border-white/[0.09] space-y-3 sm:space-y-4.5 shadow-xl dark:shadow-2xl transition-all"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between">
                      <Link to={`/channel/${post.owner?.username || "player"}`} className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0">
                        <img
                          src={getAvatarUrl(post.owner)}
                          alt="Author"
                          className="size-9 sm:size-11 rounded-xl sm:rounded-2xl object-cover ring-1 ring-neutral-200 dark:ring-white/10 group-hover:ring-emerald-400 transition-all shadow-md shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="font-display font-bold text-xs sm:text-base text-neutral-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate">
                              {post.owner?.fullName || post.owner?.username || "Footballer"}
                            </span>
                            <CheckCircle2 className="size-3.5 sm:size-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                          </div>
                          <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate block">
                            @{post.owner?.username || "player"} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
                          </span>
                        </div>
                      </Link>

                      <div className="flex items-center gap-2.5">
                        {/* Edit Post for Post Owner */}
                        {userData &&
                          ((post.owner?._id && userData?._id && post.owner._id.toString() === userData._id.toString()) ||
                            (post.owner?.username && userData?.username && post.owner.username === userData.username)) && (
                            <button
                              onClick={() => setEditingPostModal(post)}
                              className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-all cursor-pointer shadow-xs"
                              title="Edit this post"
                            >
                              <Edit3 className="size-4" />
                            </button>
                          )}

                        <button
                          onClick={() => setSelectedPostModal(post)}
                          className="p-2 rounded-xl bg-neutral-100 dark:bg-white/[0.04] hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer"
                          title="Expand View"
                        >
                          <Maximize2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Multi-Image & Video Carousel */}
                    <div
                      onClick={() =>
                        navigate(`/post/${post._id}`, {
                          state: { from: location.pathname + location.search },
                        })
                      }
                      className="cursor-pointer group relative rounded-2xl overflow-hidden max-w-[560px] mx-auto w-full aspect-[3/4]"
                    >
                      <PostMediaCarousel media={post.media} thumbnail={post.thumbnail} fitCover={false} />
                    </div>

                    {/* Caption Under the Post */}
                    {post.caption && (
                      <p
                        onClick={() =>
                          navigate(`/post/${post._id}`, {
                            state: { from: location.pathname + location.search },
                          })
                        }
                        className="text-[14.5px] text-neutral-800 dark:text-neutral-100 leading-relaxed font-normal cursor-pointer hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors px-1"
                      >
                        <span className="font-bold text-neutral-900 dark:text-white mr-2">
                          @{post.owner?.username || "player"}
                        </span>
                        {post.caption}
                      </p>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-neutral-200 dark:border-white/[0.06] text-xs text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
                        <button
                          onClick={() => handleLikePost(post._id)}
                          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${post.isLiked
                              ? "bg-red-500/15 border-red-500/30 text-red-500 dark:text-red-400 font-bold shadow-sm shadow-red-500/10"
                              : "bg-neutral-100 dark:bg-black/40 border-neutral-200 dark:border-white/[0.08] hover:text-neutral-900 dark:hover:text-white text-neutral-700 dark:text-neutral-300"
                            }`}
                        >
                          <Heart className={`size-4 sm:size-4.5 ${post.isLiked ? "fill-red-500 dark:fill-red-400" : ""}`} />
                          <span>{post.likesCount ?? (Array.isArray(post.likes) ? post.likes.length : 0)}</span>
                        </button>

                        <button
                          onClick={() => handleToggleComments(post._id)}
                          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/[0.08] hover:text-neutral-900 dark:hover:text-white text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                        >
                          <MessageCircle className="size-4 sm:size-4.5" />
                          <span>
                            {post.commentsCount ?? (Array.isArray(post.comments) ? post.comments.length : 0)}
                            <span className="hidden xs:inline sm:inline ml-1">Comments</span>
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!status) {
                              setModalMessage("Sign in to share posts with squad groups and friends.");
                              setLoginModalOpen(true);
                              return;
                            }
                            setSharingPostModal(post);
                          }}
                          className="p-2 sm:p-2.5 rounded-xl bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/[0.08] hover:text-emerald-400 hover:border-emerald-500/30 text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer"
                          title="Share Post"
                        >
                          <Share2 className="size-4 sm:size-4.5" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/post/${post._id}`, {
                            state: { from: location.pathname + location.search },
                          })
                        }
                        className="text-xs sm:text-sm text-emerald-400 hover:underline font-bold cursor-pointer whitespace-nowrap shrink-0 ml-auto"
                      >
                        <span className="hidden sm:inline">View Full Post →</span>
                        <span className="sm:hidden">Full Post →</span>
                      </button>
                    </div>

                    {/* Interactive Comments Drawer with Nested Replies */}
                    {openCommentsPostId === post._id && (() => {
                      const { roots, repliesMap } = buildCommentTree(post.comments);
                      const replying = replyingToMap[post._id];

                      return (
                        <div className="pt-4 border-t border-white/[0.06] space-y-3 animate-in fade-in">
                          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                            {roots.length > 0 ? (
                              roots.map((c) => (
                                <InlineCommentThreadItem
                                  key={c._id}
                                  comment={c}
                                  repliesMap={repliesMap}
                                  expandedReplies={expandedRepliesMap}
                                  toggleReplies={toggleInlineReplies}
                                  startReply={startInlineReply}
                                  handleToggleCommentLike={handleToggleCommentLike}
                                  handleDeleteComment={handleDeleteComment}
                                  userData={userData}
                                  postId={post._id}
                                  postOwnerId={post.owner?._id || post.owner}
                                  depth={0}
                                />
                              ))
                            ) : (
                              <div className="text-xs text-neutral-400 py-4 text-center font-medium">
                                No comments yet. Write the first one!
                              </div>
                            )}
                          </div>

                          {/* Replying Banner */}
                          {replying && (
                            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-between text-xs animate-in fade-in slide-in-from-bottom-1 duration-150 shadow-inner">
                              <div className="flex items-center gap-1.5 text-emerald-300 font-medium truncate min-w-0">
                                <CornerDownRight className="size-3.5 text-emerald-400 shrink-0" />
                                <span className="truncate">
                                  Replying to <strong className="text-white">@{replying.username}</strong>
                                </span>
                                {replying.snippet && (
                                  <span className="text-neutral-400 italic text-[11px] truncate hidden sm:inline">
                                    "{replying.snippet}"
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setReplyingToMap((prev) => ({ ...prev, [post._id]: null }))
                                }
                                className="size-5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer shrink-0 ml-2"
                                title="Cancel reply"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              placeholder={
                                replying
                                  ? `Reply to @${replying.username}...`
                                  : status
                                    ? "Write a comment..."
                                    : "Sign in to write a comment..."
                              }
                              value={commentInputs[post._id] || ""}
                              onChange={(e) =>
                                setCommentInputs({ ...commentInputs, [post._id]: e.target.value })
                              }
                              onKeyDown={(e) => e.key === "Enter" && handleAddComment(post._id)}
                              className="flex-1 h-10 px-4 rounded-xl bg-black/50 border border-white/[0.09] text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 font-medium"
                            />
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleAddComment(post._id)}
                              className="h-10 px-4.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                            >
                              <Send className="size-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ))}

                {/* IntersectionObserver Sentinel for Infinite Scroll (loads next 3 posts) */}
                {visibleCount < posts.length && (
                  <div ref={feedObserverRef} className="py-6 flex flex-col items-center justify-center">
                    {loadingMore ? (
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-400">
                        <span className="size-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                        <span>Loading more posts...</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          hasUserScrolledRef.current = true;
                          loadMoreFeed();
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer"
                      >
                        Scroll or click to load more
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="glass-card rounded-3xl p-14 text-center space-y-3.5 shadow-xl">
                <ImageIcon className="size-11 text-neutral-500 mx-auto" />
                <h3 className="font-display text-lg font-bold text-white">No Posts on Feed Yet</h3>
                <p className="text-sm text-neutral-400 font-medium">
                  Be the first to share a match highlight, goal, or training reel!
                </p>
                <Link to="/create-post" className="inline-block pt-2">
                  <Button variant="primary" size="sm" className="text-sm font-bold rounded-2xl gap-2 px-5 py-2.5 shadow-md">
                    <PlusCircle className="size-4" /> Create First Post
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR (4 Cols): Nearby Turfs & Suggested Footballers */}
        <div className="lg:col-span-4 space-y-6">
          {/* Nearby Turfs & Grounds */}
          <div className="glass-card rounded-3xl p-5 md:p-6 border border-white/[0.09] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
              <div className="flex items-center gap-2.5">
                <MapPin className="size-4.5 text-emerald-400" />
                <h3 className="font-display font-bold text-base text-white">Nearby Turfs</h3>
              </div>
              <Link to="/find-turfs" className="text-xs font-bold text-emerald-400 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {loadingTurfs ? (
                <FootballLoader inline size="xs" message="Loading grounds..." />
              ) : turfs.length > 0 ? (
                turfs.slice(0, 3).map((turf) => {
                  const turfImage =
                    turf.thumbnail ||
                    turf.images?.[0] ||
                    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500";

                  return (
                    <div
                      key={turf._id}
                      className="p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-black/40 border border-neutral-200 dark:border-white/[0.06] space-y-2.5 hover:border-emerald-500/30 transition-all group overflow-hidden"
                    >
                      {/* Turf Image Preview */}
                      <Link
                        to={`/turfs/${turf._id}`}
                        className="block relative w-full h-28 rounded-xl overflow-hidden bg-neutral-900/40 border border-black/5 dark:border-white/10"
                      >
                        <img
                          src={turfImage}
                          alt={turf.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        {turf.type && (
                          <span className="absolute top-2 left-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-black/60 text-emerald-400 backdrop-blur-xs border border-white/10">
                            {turf.type}
                          </span>
                        )}

                        {turf.pricePerHour && (
                          <span className="absolute bottom-2 right-2 text-xs font-black text-emerald-300 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded-lg border border-white/10 font-mono shadow-sm">
                            ₹{turf.pricePerHour}/hr
                          </span>
                        )}
                      </Link>

                      <div className="flex items-start justify-between gap-2 pt-0.5">
                        <Link
                          to={`/turfs/${turf._id}`}
                          className="font-bold text-sm text-neutral-900 dark:text-white truncate hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                        >
                          {turf.name}
                        </Link>
                      </div>

                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate flex items-center gap-1">
                        <MapPin className="size-3 text-neutral-400 shrink-0" />
                        <span className="truncate">{cleanAddress(turf.address)}</span>
                      </p>

                      <Link to={`/turfs/${turf._id}`} className="block pt-0.5">
                        <Button
                          size="sm"
                          variant="primary"
                          className="w-full h-8.5 text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                        >
                          Book Slot
                        </Button>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-neutral-400 text-center py-3">
                  No registered grounds in this area.
                </div>
              )}
            </div>
          </div>

          {/* Live Radar Card */}
          <div className="glass-card rounded-3xl p-5 md:p-6 border border-white/[0.09] space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
              <div className="flex items-center gap-2.5">
                <Radio className="size-4.5 text-emerald-400" />
                <h3 className="font-display font-bold text-base text-white">Pitch Radar</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">LIVE</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-medium">
              Track live geospatial ground occupancy and public municipal pitches.
            </p>
            <Link to="/live-turfs" className="block pt-1">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-2xl bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white h-9.5">
                Open Live Radar →
              </Button>
            </Link>
          </div>

          {/* Suggested Players */}
          <div className="glass-card rounded-3xl p-5 md:p-6 border border-white/[0.09] space-y-4 shadow-xl">
            <div
              onClick={() => {
                if (!status || !userData) {
                  setModalMessage("Please sign in to explore and follow players.");
                  setLoginModalOpen(true);
                  return;
                }
                setIsPeopleModalOpen(true);
              }}
              className="flex items-center justify-between border-b border-white/[0.07] pb-3 cursor-pointer group select-none"
              title="Click to discover all players to follow"
            >
              <div className="flex items-center gap-2.5">
                <Users className="size-4.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                  Players to Follow
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-bold group-hover:underline flex items-center gap-1">
                View All →
              </span>
            </div>

            <div className="space-y-3">
              {suggestedUsers.length > 0 ? (
                suggestedUsers.slice(0, 4).map((user) => (
                  <div key={user._id} className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-black/40 border border-white/[0.05]">
                    <Link to={`/channel/${user.username}`} className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={getAvatarUrl(user, user.fullName || user.username)}
                        alt={user.fullName}
                        className="size-9 rounded-xl object-cover shrink-0 ring-1 ring-white/10"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{user.fullName || user.username}</div>
                        <div className="text-xs text-neutral-400 truncate">@{user.username}</div>
                      </div>
                    </Link>

                    <button
                      onClick={() => handleToggleFollow(user.username)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${user.isFollowing
                          ? "bg-neutral-800 text-neutral-300 border border-white/10 hover:text-red-400"
                          : "bg-emerald-500 text-neutral-950 hover:bg-emerald-400 shadow-sm"
                        }`}
                    >
                      {user.isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-xs text-neutral-400 text-center py-3 font-medium">
                  Connect with footballers on the matchwall.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Post Detail Modal */}
      <PostDetailModal
        post={selectedPostModal}
        isOpen={!!selectedPostModal}
        onClose={() => setSelectedPostModal(null)}
        onRequireAuth={(msg) => {
          setModalMessage(msg);
          setLoginModalOpen(true);
        }}
        onUpdatePost={handleUpdatePostFromModal}
        onDeletePost={handleDeletePostFromHome}
      />

      {/* Direct Edit Post Modal */}
      {editingPostModal && (
        <EditPostModal
          post={editingPostModal}
          isOpen={!!editingPostModal}
          onClose={() => setEditingPostModal(null)}
          onPostUpdated={handleUpdatePostFromModal}
          onPostDeleted={handleDeletePostFromHome}
        />
      )}

      {/* Share Post & Tweet Modal */}
      {sharingPostModal && (
        <SharePostModal
          post={sharingPostModal}
          isOpen={!!sharingPostModal}
          onClose={() => setSharingPostModal(null)}
        />
      )}

      {/* In-App Login Modal for Guests */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        message={modalMessage}
      />

      {/* Discover People to Follow Modal (Opens all unfollowed players in randomized order) */}
      <PeopleToFollowModal
        isOpen={isPeopleModalOpen}
        onClose={() => setIsPeopleModalOpen(false)}
        onFollowChange={(username, isFollowing) => {
          setSuggestedUsers((prev) =>
            prev.map((u) => (u.username === username ? { ...u, isFollowing } : u))
          );
        }}
      />

      {/* Confirm Delete Comment Modal */}
      <ConfirmDeleteModal
        isOpen={deleteCommentModal.isOpen}
        onClose={() => setDeleteCommentModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDeleteComment}
        title="Confirm Delete"
        message="Are you sure you want to delete this comment?"
        loading={deleteCommentModal.loading}
      />
    </div>
  );
}
