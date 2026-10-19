import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  X,
  Heart,
  MessageCircle,
  Send,
  CheckCircle2,
  Trash2,
  Edit3,
  Reply,
  Smile,
  MoreHorizontal,
  Share2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PostMediaCarousel from "@/components/common/PostMediaCarousel";
import EditPostModal from "@/components/common/EditPostModal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import SharePostModal from "@/components/common/SharePostModal";
import EmojiPicker from "@/components/common/EmojiPicker";
import FootballLoader from "@/components/common/FootballLoader";
import { postService, likeService, commentService } from "@/services/social.service";
import { getAvatarUrl } from "@/utils/avatar.utils";
import toast from "react-hot-toast";

// Helper: Relative time format
function formatInstagramTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return `${Math.max(1, diffInSeconds)}s`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFullTimeAgo(dateString) {
  if (!dateString) return "RECENT";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${Math.max(1, mins)} ${mins <= 1 ? "MINUTE" : "MINUTES"} AGO`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "HOUR" : "HOURS"} AGO`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  if (days < 30) {
    return `${days} ${days === 1 ? "DAY" : "DAYS"} AGO`;
  }
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();
}

// Polished Comment Thread Item
function CommentThreadItem({
  comment,
  repliesMap,
  expandedReplies,
  toggleReplies,
  startReply,
  handleToggleCommentLike,
  requestDeleteComment,
  userData,
  post,
  depth = 0,
}) {
  const commentIdStr = (comment._id || comment.id)?.toString();
  const childReplies = repliesMap[commentIdStr] || [];
  const hasReplies = childReplies.length > 0;
  const isExpanded = Boolean(expandedReplies[commentIdStr]);

  const isLiked =
    comment.isLiked ||
    (Array.isArray(comment.likes) &&
      comment.likes.some((l) => (l.likedBy?._id || l.likedBy || l)?.toString() === userData?._id?.toString()));

  const likesCount = comment.likesCount ?? (Array.isArray(comment.likes) ? comment.likes.length : 0);

  const isPostOwner = Boolean(
    userData &&
    ((post.owner?._id && userData?._id && post.owner._id.toString() === userData._id.toString()) ||
      (post.owner?.username && userData?.username && post.owner.username === userData.username))
  );

  const isCommentOwner = Boolean(
    userData &&
    ((comment.owner?._id && userData?._id && comment.owner._id.toString() === userData._id.toString()) ||
      (comment.owner?.username && userData?.username && comment.owner.username === userData.username))
  );

  const canDelete = isCommentOwner || isPostOwner;

  return (
    <div className={`space-y-2 ${depth > 0 ? "pl-6 sm:pl-8 border-l-2 border-emerald-500/20 ml-2 mt-2" : ""}`}>
      <div className="flex items-start gap-2.5 sm:gap-3 group/item">
        {/* User Avatar */}
        <Link to={`/channel/${comment.owner?.username || "player"}`} className="shrink-0 pt-0.5 group/av">
          <img
            src={getAvatarUrl(comment.owner)}
            alt={comment.owner?.fullName || comment.owner?.username || "avatar"}
            className="size-7 sm:size-8 rounded-xl object-cover ring-1 ring-white/10 group-hover/av:ring-emerald-400 transition-all"
          />
        </Link>

        {/* Comment Bubble & Metadata */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-white/10 transition-colors">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to={`/channel/${comment.owner?.username || "player"}`}
                className="font-bold text-xs sm:text-[13px] text-white hover:text-emerald-400 transition-colors"
              >
                @{comment.owner?.username || "user"}
              </Link>

              {comment.replyToUser && (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5">
                  <span>↳</span> @{comment.replyToUser.username}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-[13px] text-neutral-200 mt-1 leading-relaxed break-words font-normal">
              {comment.content}
            </p>
          </div>

          {/* Sub-row: Timestamp, Likes Count, Reply, Delete */}
          <div className="flex items-center gap-3.5 mt-1.5 px-1 text-[11px] font-semibold text-neutral-400">
            <span>{formatInstagramTime(comment.createdAt) || "1m"}</span>

            {likesCount > 0 && (
              <span className="text-neutral-300 font-bold">
                {likesCount} {likesCount === 1 ? "like" : "likes"}
              </span>
            )}

            <button
              type="button"
              onClick={() => startReply(comment)}
              className="hover:text-emerald-400 text-neutral-400 transition-colors cursor-pointer"
            >
              Reply
            </button>

            {canDelete && (
              <button
                type="button"
                onClick={() => requestDeleteComment(comment._id)}
                className="hover:text-red-400 text-neutral-500 transition-colors opacity-0 group-hover/item:opacity-100 cursor-pointer"
                title="Delete comment"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Right side Comment Heart Button */}
        <button
          type="button"
          onClick={() => handleToggleCommentLike(comment._id)}
          className={`pt-2 shrink-0 transition-transform active:scale-125 cursor-pointer ${isLiked ? "text-rose-500" : "text-neutral-500 hover:text-rose-400"
            }`}
          title={isLiked ? "Unlike" : "Like"}
        >
          <Heart className={`size-3.5 sm:size-4 ${isLiked ? "fill-rose-500" : ""}`} />
        </button>
      </div>

      {/* Replies toggle */}
      {hasReplies && (
        <div className="pl-8 sm:pl-10">
          <button
            type="button"
            onClick={() => toggleReplies(commentIdStr)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="size-3" />
                <span>
                  Hide {childReplies.length} {childReplies.length === 1 ? "reply" : "replies"}
                </span>
              </>
            ) : (
              <>
                <ChevronDown className="size-3" />
                <span>
                  View {childReplies.length} {childReplies.length === 1 ? "reply" : "replies"}
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Child replies */}
      {hasReplies && isExpanded && (
        <div className="space-y-2 animate-in fade-in duration-150">
          {childReplies.map((child) => (
            <CommentThreadItem
              key={child._id || child.id}
              comment={child}
              repliesMap={repliesMap}
              expandedReplies={expandedReplies}
              toggleReplies={toggleReplies}
              startReply={startReply}
              handleToggleCommentLike={handleToggleCommentLike}
              requestDeleteComment={requestDeleteComment}
              userData={userData}
              post={post}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, status } = useSelector((state) => state.auth);

  const statePost = location.state?.post;
  const [post, setPost] = useState(statePost || null);
  const [loading, setLoading] = useState(!statePost);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [isMobileCommentsOpen, setIsMobileCommentsOpen] = useState(false);

  const [deleteCommentModal, setDeleteCommentModal] = useState({
    isOpen: false,
    commentId: null,
    loading: false,
  });

  const commentInputRef = useRef(null);

  // Return to previous page using navigation history / state
  const handleClose = () => {
    if (location.state?.from) {
      navigate(location.state.from, {
        state: {
          returnChatId: location.state?.chatId,
          returnViewMode: location.state?.viewMode,
          returnScrollTop: location.state?.scrollTop,
        },
      });
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "Escape" &&
        !isOptionsMenuOpen &&
        !isShareModalOpen &&
        !isEditingPost &&
        !isDeletePostModalOpen &&
        !deleteCommentModal.isOpen
      ) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOptionsMenuOpen,
    isShareModalOpen,
    isEditingPost,
    isDeletePostModalOpen,
    deleteCommentModal.isOpen,
    location.state,
  ]);

  // Load post & comments
  useEffect(() => {
    if (!postId && !statePost) return;

    const fetchPostData = async () => {
      try {
        let loadedPost = null;

        // 1. Attempt direct single post fetch
        if (postId) {
          try {
            const postRes = await postService.getPostById(postId);
            if (postRes?.data) loadedPost = postRes.data;
          } catch (err) {
            console.log("Single post fetch error, trying pool search:", err);
          }
        }

        // 2. Search in all posts pool if not found by direct ID
        if (!loadedPost && postId) {
          try {
            const allRes = await postService.getAllPosts();
            const list = allRes?.data || (Array.isArray(allRes) ? allRes : []);
            const found = list.find(
              (p) =>
                p._id?.toString() === postId.toString() ||
                p.id?.toString() === postId.toString()
            );
            if (found) loadedPost = found;
          } catch (err) {
            console.log("All posts pool search fallback error:", err);
          }
        }

        // 3. Fallback to location.state.post if available
        if (!loadedPost && statePost) {
          loadedPost = {
            ...statePost,
            _id: statePost.postId || statePost._id || postId,
          };
        }

        if (loadedPost) {
          let commentsDocs = loadedPost.comments || [];
          let totalComments = loadedPost.commentsCount || commentsDocs.length;
          const targetIdForComments = loadedPost._id || postId;

          if (targetIdForComments) {
            try {
              const commentsRes = await commentService.showAllComments(targetIdForComments, 1, 50);
              if (commentsRes?.data) {
                commentsDocs =
                  commentsRes.data.docs ||
                  (Array.isArray(commentsRes.data) ? commentsRes.data : commentsDocs);
                totalComments = commentsRes.data.totalDocs ?? commentsDocs.length;
              }
            } catch (err) {
              console.log("Comments fetch error:", err);
            }
          }

          const isLiked =
            userData?._id && Array.isArray(loadedPost.likes)
              ? loadedPost.likes.some(
                (l) => (l.likedBy?._id || l.likedBy || l)?.toString() === userData._id.toString()
              )
              : !!loadedPost.isLiked;

          setPost({
            ...loadedPost,
            caption: loadedPost.caption || loadedPost.content || "",
            comments: commentsDocs,
            commentsCount: totalComments,
            isLiked,
          });
        }
      } catch (err) {
        console.error("Failed to load post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId, statePost, userData?._id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <FootballLoader message="Loading match post & discussion..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="size-16 rounded-3xl bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400">
          <MessageCircle className="size-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-display">Post Not Found</h2>
        <p className="text-sm text-neutral-400 max-w-sm">
          This post might have been removed or is currently unavailable.
        </p>
        <Button onClick={handleClose} variant="primary" className="rounded-xl font-bold">
          <ArrowLeft className="size-4" /> Go Back
        </Button>
      </div>
    );
  }

  // Build recursive tree
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
    return { rootComments: roots, repliesMap: map };
  };

  const { rootComments, repliesMap } = buildCommentTree(post.comments);

  const isOwner = Boolean(
    userData &&
    ((post.owner?._id && userData?._id && post.owner._id.toString() === userData._id.toString()) ||
      (post.owner?.username && userData?.username && post.owner.username === userData.username))
  );

  const handleLike = async () => {
    if (!status || !userData) {
      toast.error("Please sign in to like posts!");
      return;
    }

    const currentLiked = !post.isLiked;
    const currentCount = post.likesCount ?? (Array.isArray(post.likes) ? post.likes.length : 0);
    const newLikesCount = currentLiked ? currentCount + 1 : Math.max(0, currentCount - 1);

    setPost((prev) => ({
      ...prev,
      isLiked: currentLiked,
      likesCount: newLikesCount,
    }));

    try {
      await likeService.togglePostLike(post._id);
    } catch (err) {
      toast.error("Failed to update like.");
    }
  };

  const startReply = (comment) => {
    if (!status || !userData) {
      toast.error("Please sign in to reply to comments.");
      return;
    }
    setReplyingTo({
      commentId: comment._id,
      userId: comment.owner?._id,
      username: comment.owner?.username || "user",
      snippet: comment.content?.slice(0, 40),
    });
    setExpandedReplies((prev) => ({
      ...prev,
      [(comment.parentComment?._id || comment.parentComment || comment._id).toString()]: true,
      [comment._id.toString()]: true,
    }));
    commentInputRef.current?.focus();
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleAddComment = async (e) => {
    if (e) e.preventDefault();
    if (!status || !userData) {
      toast.error("Please sign in to write a comment.");
      return;
    }

    if (!commentText.trim()) return;
    const textToSend = commentText.trim();
    const currentReplying = replyingTo;

    setCommentText("");
    setReplyingTo(null);
    setSubmitting(true);

    const tempComment = {
      _id: `temp_${Date.now()}`,
      content: textToSend,
      owner: {
        _id: userData._id,
        username: userData.username,
        fullName: userData.fullName || userData.username,
        avatar: userData.avatar,
      },
      parentComment: currentReplying?.commentId || null,
      replyToUser: currentReplying
        ? {
          _id: currentReplying.userId,
          username: currentReplying.username,
        }
        : null,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
    };

    const existingComments = post.comments || [];
    const updatedComments = [...existingComments, tempComment];
    const newCommentsCount = (post.commentsCount || existingComments.length) + 1;

    setPost((prev) => ({
      ...prev,
      comments: updatedComments,
      commentsCount: newCommentsCount,
    }));

    try {
      const res = await commentService.addComment(post._id, {
        content: textToSend,
        parentComment: currentReplying?.commentId || null,
        replyToUser: currentReplying?.userId || null,
      });

      if (res?.data) {
        const savedComment = res.data;
        setPost((prev) => ({
          ...prev,
          comments: updatedComments.map((c) => (c._id === tempComment._id ? savedComment : c)),
          commentsCount: newCommentsCount,
        }));
      }
      toast.success(currentReplying ? "Reply posted!" : "Comment posted!");
    } catch (err) {
      console.log("Comment error:", err);
      toast.error("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    if (!status || !userData) {
      toast.error("Please sign in to like comments!");
      return;
    }

    if (Array.isArray(post.comments)) {
      const updatedComments = post.comments.map((c) => {
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
      setPost((prev) => ({ ...prev, comments: updatedComments }));
    }

    try {
      await likeService.toggleCommentLike(commentId);
    } catch (err) {
      toast.error("Failed to update comment like.");
    }
  };

  const confirmDeleteComment = async () => {
    const commentId = deleteCommentModal.commentId;
    if (!commentId) return;

    setDeleteCommentModal((prev) => ({ ...prev, loading: true }));
    try {
      const res = await commentService.deleteComment(commentId);
      const deletedIds = new Set(res?.data?.deletedIds || [commentId]);
      const updatedComments = (post.comments || []).filter((c) => !deletedIds.has(c._id?.toString()));
      const newCommentsCount = Math.max(0, (post.commentsCount || (post.comments?.length || 0)) - deletedIds.size);

      setPost((prev) => ({
        ...prev,
        comments: updatedComments,
        commentsCount: newCommentsCount,
      }));
      toast.success("Comment deleted.");
      setDeleteCommentModal({ isOpen: false, commentId: null, loading: false });
    } catch (err) {
      toast.error("Failed to delete comment.");
      setDeleteCommentModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleConfirmDeletePost = async () => {
    try {
      await postService.deletePost(post._id);
      toast.success("Post deleted successfully.");
      setIsDeletePostModalOpen(false);
      handleClose();
    } catch (err) {
      toast.error("Failed to delete post.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pt-1 pb-4 animate-in fade-in duration-200">
      {/* Main Post Container: 2-Column Split (Left Media Showcase, Right Discussion Bar) */}
      <div className="w-full bg-[#0e1520] text-white rounded-3xl border border-white/15 shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[550px] lg:min-h-[640px] max-h-[88vh] relative">
        {/* LEFT: Media Showcase with Strict 3:4 Containment */}
        <div className="w-full md:flex-1 bg-black flex items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10 shrink-0 md:shrink p-0">
          {/* Quick Back Button on Top Left of Media Box */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3.5 left-3.5 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-bold border border-white/20 transition-all cursor-pointer shadow-xl active:scale-95"
            title="Go Back"
          >
            <ArrowLeft className="size-3.5 stroke-[2.5]" />
            <span>Back</span>
          </button>

          <div className="w-full h-full max-h-full max-w-full aspect-[3/4] flex items-center justify-center overflow-hidden">
            <PostMediaCarousel
              media={post.media}
              thumbnail={post.thumbnail}
              fitCover={false}
              className="w-full h-full max-h-full aspect-[3/4] rounded-none border-0 bg-black shadow-none"
            />
          </div>
        </div>

        {/* RIGHT: Sidebar (Header, Comments Stream, Actions Bar, Composer) */}
        <div className="w-full md:w-[380px] lg:w-[460px] flex flex-col flex-1 min-h-0 bg-[#0a0f16] justify-between overflow-hidden">
          {/* 1. Header Bar with Prominent Close Button */}
          <div className="h-16 px-4 sm:px-5 flex items-center justify-between border-b border-white/[0.08] bg-[#0e1520] shrink-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Link to={`/channel/${post.owner?.username || "player"}`} className="shrink-0 group/av">
                <img
                  src={getAvatarUrl(post.owner)}
                  alt={post.owner?.fullName || post.owner?.username || "Author"}
                  className="size-9 sm:size-10 rounded-2xl object-cover ring-1 ring-white/15 group-hover/av:ring-emerald-400 transition-all shadow-sm"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/channel/${post.owner?.username || "player"}`}
                    className="font-bold text-xs sm:text-sm text-white hover:text-emerald-400 transition-colors truncate"
                  >
                    {post.owner?.fullName || post.owner?.username || "Player"}
                  </Link>
                  <CheckCircle2 className="size-3.5 text-emerald-400 fill-emerald-400/20 shrink-0" />
                </div>
                <span className="text-[11px] text-neutral-400 block truncate">
                  @{post.owner?.username || "player"}
                </span>
              </div>
            </div>

            {/* Header Action Buttons & Clearly Visible Top-Right X Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsOptionsMenuOpen(true)}
                className="size-9 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/[0.06] flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="More options"
              >
                <MoreHorizontal className="size-4.5" />
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="size-9 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-400 border border-white/15 hover:border-red-500/30 flex items-center justify-center text-white transition-all cursor-pointer active:scale-90"
                title="Close (Esc)"
                aria-label="Close"
              >
                <X className="size-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* 2. Top Action Bar (Like, Comment Count, Share) - Always Visible */}
          <div className="px-4 py-2.5 bg-[#0a0f16] border-b border-white/[0.06] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              {/* Heart / Like Button */}
              <button
                type="button"
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${post.isLiked
                  ? "bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-sm shadow-rose-500/10"
                  : "bg-white/[0.04] border-white/[0.06] text-neutral-300 hover:text-white"
                  }`}
              >
                <Heart className={`size-4 ${post.isLiked ? "fill-rose-400" : ""}`} />
                <span>{(post.likesCount || 0).toLocaleString()}</span>
              </button>

              {/* Comment Count Button */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileCommentsOpen(true);
                  setTimeout(() => commentInputRef.current?.focus(), 150);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-neutral-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <MessageCircle className="size-4" />
                <span>{post.commentsCount ?? (Array.isArray(post.comments) ? post.comments.length : 0)}</span>
              </button>

              {/* Share Post Button */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-neutral-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer"
                title="Share Post"
              >
                <Share2 className="size-4" />
              </button>
            </div>

            <span className="text-[10.5px] font-mono text-neutral-500">{formatFullTimeAgo(post.createdAt)}</span>
          </div>

          {/* 3. Desktop Comments Stream & Composer (Hidden on mobile) */}
          <div className="hidden md:flex md:flex-col md:flex-1 min-h-0 overflow-hidden justify-between">
            {/* Scrollable Comments Stream */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4 min-h-[160px] max-h-[420px] bg-[#0a0f16]">
              {/* Caption Card at Top */}
              {post.caption && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={getAvatarUrl(post.owner)}
                      alt="Owner"
                      className="size-6 rounded-lg object-cover ring-1 ring-white/10"
                    />
                    <span className="font-bold text-xs text-white">@{post.owner?.username || "player"}</span>
                    <span className="text-[10px] text-neutral-500 font-mono ml-auto">
                      {formatInstagramTime(post.createdAt) || "Recent"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13.5px] text-neutral-100 leading-relaxed font-normal">
                    {post.caption}
                  </p>
                </div>
              )}

              {/* Comments List */}
              {rootComments.length > 0 ? (
                <div className="space-y-3">
                  {rootComments.map((c) => (
                    <CommentThreadItem
                      key={c._id || c.id}
                      comment={c}
                      repliesMap={repliesMap}
                      expandedReplies={expandedReplies}
                      toggleReplies={toggleReplies}
                      startReply={startReply}
                      handleToggleCommentLike={handleToggleCommentLike}
                      requestDeleteComment={(commentId) =>
                        setDeleteCommentModal({ isOpen: true, commentId, loading: false })
                      }
                      userData={userData}
                      post={post}
                      depth={0}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-xs text-neutral-500 space-y-1">
                  <MessageCircle className="size-8 text-neutral-600 mx-auto stroke-[1.5]" />
                  <p className="font-semibold text-neutral-400 pt-1">No comments yet</p>
                  <p className="text-[11px]">Be the first to share your thoughts on this match!</p>
                </div>
              )}
            </div>

            {/* Desktop Sticky Bottom Composer */}
            <div className="border-t border-white/[0.08] bg-[#0e1520] shrink-0 p-3 sm:p-4 space-y-3">
              {/* Replying Banner */}
              {replyingTo && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-between text-xs animate-in fade-in">
                  <span className="text-emerald-300 truncate">
                    Replying to <strong className="text-white">@{replyingTo.username}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Comment Input Composer */}
              <form onSubmit={handleAddComment} className="flex items-center gap-2 relative">
                <div className="flex-1 flex items-center relative min-w-0">
                  <input
                    ref={commentInputRef}
                    type="text"
                    placeholder={
                      replyingTo
                        ? `Reply to @${replyingTo.username}...`
                        : "Add a comment..."
                    }
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full h-10 pl-3.5 pr-10 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-2.5 size-7 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Add emoji"
                  >
                    <Smile className="size-4" />
                  </button>
                  <EmojiPicker
                    isOpen={showEmojiPicker}
                    onClose={() => setShowEmojiPicker(false)}
                    onSelectEmoji={(emoji) => setCommentText((prev) => prev + emoji)}
                    className="bottom-12 right-0"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!commentText.trim() || submitting}
                  className="h-10 px-4 rounded-xl text-xs font-bold gap-1.5 cursor-pointer shrink-0"
                >
                  {submitting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Send className="size-3.5" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE COMMENTS BOTTOM SHEET (Slides from bottom to top on mobile only) */}
      {isMobileCommentsOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          {/* Backdrop click to dismiss */}
          <div
            className="flex-1 w-full"
            onClick={() => setIsMobileCommentsOpen(false)}
          />

          {/* Bottom Sheet Modal Container */}
          <div
            className="w-full bg-[#0b1118] border-t border-white/15 rounded-t-3xl shadow-2xl flex flex-col max-h-[82vh] h-[75vh] animate-in slide-in-from-bottom duration-300 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Drag Handle & Close X Button */}
            <div className="px-4 py-3.5 border-b border-white/[0.08] bg-[#0e1520] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white font-display">
                  Comments ({post.commentsCount ?? (Array.isArray(post.comments) ? post.comments.length : 0)})
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileCommentsOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Close comments"
              >
                <X className="size-5 stroke-[2.2]" />
              </button>
            </div>

            {/* Scrollable Comments List on Mobile */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3.5 bg-[#0a0f16]">
              {/* Post Caption Preview */}
              {post.caption && (
                <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <img
                      src={getAvatarUrl(post.owner)}
                      alt="Owner"
                      className="size-6 rounded-lg object-cover ring-1 ring-white/10"
                    />
                    <span className="font-bold text-xs text-white">@{post.owner?.username || "player"}</span>
                    <span className="text-[10px] text-neutral-500 font-mono ml-auto">
                      {formatInstagramTime(post.createdAt) || "Recent"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-100 leading-relaxed font-normal">
                    {post.caption}
                  </p>
                </div>
              )}

              {/* Comments Stream */}
              {rootComments.length > 0 ? (
                <div className="space-y-3">
                  {rootComments.map((c) => (
                    <CommentThreadItem
                      key={c._id || c.id}
                      comment={c}
                      repliesMap={repliesMap}
                      expandedReplies={expandedReplies}
                      toggleReplies={toggleReplies}
                      startReply={(targetComment) => {
                        startReply(targetComment);
                        commentInputRef.current?.focus();
                      }}
                      handleToggleCommentLike={handleToggleCommentLike}
                      requestDeleteComment={(commentId) =>
                        setDeleteCommentModal({ isOpen: true, commentId, loading: false })
                      }
                      userData={userData}
                      post={post}
                      depth={0}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-neutral-500 space-y-1">
                  <MessageCircle className="size-8 text-neutral-600 mx-auto stroke-[1.5]" />
                  <p className="font-semibold text-neutral-400 pt-1">No comments yet</p>
                  <p className="text-[11px]">Be the first to share your thoughts on this match!</p>
                </div>
              )}
            </div>

            {/* Mobile Bottom Input Composer */}
            <div className="border-t border-white/[0.08] bg-[#0e1520] shrink-0 p-3 space-y-2">
              {replyingTo && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-between text-xs animate-in fade-in">
                  <span className="text-emerald-300 truncate">
                    Replying to <strong className="text-white">@{replyingTo.username}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              <form onSubmit={handleAddComment} className="flex items-center gap-2 relative">
                <div className="flex-1 flex items-center relative min-w-0">
                  <input
                    ref={commentInputRef}
                    type="text"
                    placeholder={
                      replyingTo
                        ? `Reply to @${replyingTo.username}...`
                        : "Add a comment..."
                    }
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full h-10 pl-3.5 pr-10 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-2.5 size-6 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Add emoji"
                  >
                    <Smile className="size-4" />
                  </button>
                  <EmojiPicker
                    isOpen={showEmojiPicker}
                    onClose={() => setShowEmojiPicker(false)}
                    onSelectEmoji={(emoji) => setCommentText((prev) => prev + emoji)}
                    className="bottom-12 right-0"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!commentText.trim() || submitting}
                  className="h-10 px-3.5 rounded-xl text-xs font-bold gap-1 cursor-pointer shrink-0"
                >
                  {submitting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Send className="size-3.5" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Options Action Sheet (•••) */}
      {isOptionsMenuOpen && (
        <div
          onClick={() => setIsOptionsMenuOpen(false)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-150 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#0e1520] border border-white/15 rounded-3xl overflow-hidden shadow-2xl text-center divide-y divide-white/10 text-xs sm:text-sm font-semibold"
          >
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsOptionsMenuOpen(false);
                    setIsDeletePostModalOpen(true);
                  }}
                  className="w-full py-3.5 px-4 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  Delete Post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOptionsMenuOpen(false);
                    setIsEditingPost(true);
                  }}
                  className="w-full py-3.5 px-4 text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Edit Post
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOptionsMenuOpen(false);
                setIsShareModalOpen(true);
              }}
              className="w-full py-3.5 px-4 text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Share Post
            </button>

            <button
              type="button"
              onClick={() => setIsOptionsMenuOpen(false)}
              className="w-full py-3.5 px-4 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {isEditingPost && (
        <EditPostModal
          post={post}
          isOpen={isEditingPost}
          onClose={() => setIsEditingPost(false)}
          onPostUpdated={(updated) => setPost((prev) => ({ ...prev, ...updated }))}
          onPostDeleted={handleClose}
        />
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <SharePostModal post={post} isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
      )}

      {/* Delete Post Modal */}
      <ConfirmDeleteModal
        isOpen={isDeletePostModalOpen}
        onClose={() => setIsDeletePostModalOpen(false)}
        onConfirm={handleConfirmDeletePost}
        title="Delete Pitch Post"
        message="Are you sure you want to delete this match post? This action cannot be undone."
      />

      {/* Delete Comment Modal */}
      <ConfirmDeleteModal
        isOpen={deleteCommentModal.isOpen}
        onClose={() => setDeleteCommentModal({ isOpen: false, commentId: null, loading: false })}
        onConfirm={confirmDeleteComment}
        title="Delete Comment"
        message="Are you sure you want to delete this comment and its replies?"
        loading={deleteCommentModal.loading}
      />
    </div>
  );
}
