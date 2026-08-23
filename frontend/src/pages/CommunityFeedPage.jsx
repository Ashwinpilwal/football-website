import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Sparkles,
  Users,
  CheckCircle2,
  Flame,
  Image as ImageIcon,
  MessageSquare,
  Shuffle,
  Repeat2,
  Maximize2,
  Trash2,
  Edit3,
  X,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { postService, likeService, commentService, tweetService } from "@/services/social.service";
import { authService } from "@/services/auth.service";
import { followToggle } from "@/services/follow.service";
import PostMediaCarousel from "@/components/common/PostMediaCarousel";
import PostDetailModal from "@/components/common/PostDetailModal";
import EditPostModal from "@/components/common/EditPostModal";
import SharePostModal from "@/components/common/SharePostModal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import EmojiPicker from "@/components/common/EmojiPicker";
import FootballLoader from "@/components/common/FootballLoader";
import { getAvatarUrl } from "@/utils/avatar.utils";
import toast from "react-hot-toast";

export default function CommunityFeedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, status } = useSelector((state) => state.auth);

  const [feedItems, setFeedItems] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [newTweetContent, setNewTweetContent] = useState("");
  const [tweetPhoto, setTweetPhoto] = useState(null);
  const [tweetPhotoPreview, setTweetPhotoPreview] = useState(null);
  const tweetPhotoInputRef = React.useRef(null);
  const [isTweetEmojiOpen, setIsTweetEmojiOpen] = useState(false);
  const [activeReplyEmojiTweetId, setActiveReplyEmojiTweetId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [isPostingTweet, setIsPostingTweet] = useState(false);
  const [selectedPostModal, setSelectedPostModal] = useState(null);
  const [editingPostModal, setEditingPostModal] = useState(null);
  const [sharingPostModal, setSharingPostModal] = useState(null);

  // Fisher-Yates array shuffling
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadFeed = async () => {
    setLoadingFeed(true);
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

      // Combine both posts & tweets and shuffle
      const combined = [...formattedPosts, ...formattedTweets];
      setFeedItems(shuffleArray(combined));
    } catch (e) {
      console.log("Feed error:", e);
      setFeedItems([]);
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [userData?._id]);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const res = await authService.getSuggestedUsers();
        if (res?.data) setSuggestedUsers(res.data);
      } catch (e) {
        console.log("Suggestions error:", e);
      }
    };
    if (status) loadSuggestions();
  }, [status]);

  // Handle Post Like
  const handleLikePost = async (e, postId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setFeedItems((prev) =>
      prev.map((item) => {
        if (item.itemType === "post" && item._id === postId) {
          const isLiked = !item.isLiked;
          return {
            ...item,
            isLiked,
            likesCount: isLiked ? (item.likesCount || 0) + 1 : Math.max(0, (item.likesCount || 0) - 1),
          };
        }
        return item;
      })
    );

    if (selectedPostModal?._id === postId) {
      const isLiked = !selectedPostModal.isLiked;
      setSelectedPostModal({
        ...selectedPostModal,
        isLiked,
        likesCount: isLiked
          ? (selectedPostModal.likesCount || 0) + 1
          : Math.max(0, (selectedPostModal.likesCount || 0) - 1),
      });
    }

    try {
      await likeService.togglePostLike(postId);
    } catch (err) {
      console.log("Like error:", err);
    }
  };

  // Handle Tweet Like
  const handleLikeTweet = async (e, tweetId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setFeedItems((prev) =>
      prev.map((item) => {
        if (item.itemType === "tweet" && item._id === tweetId) {
          const isLiked = !item.isLiked;
          return {
            ...item,
            isLiked,
            likesCount: isLiked ? (item.likesCount || 0) + 1 : Math.max(0, (item.likesCount || 0) - 1),
          };
        }
        return item;
      })
    );

    try {
      await likeService.toggleTweetLike(tweetId);
    } catch (err) {
      console.log("Tweet like error:", err);
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setTweetPhoto(file);
      setTweetPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setTweetPhoto(null);
    if (tweetPhotoPreview) {
      URL.revokeObjectURL(tweetPhotoPreview);
      setTweetPhotoPreview(null);
    }
    if (tweetPhotoInputRef.current) {
      tweetPhotoInputRef.current.value = "";
    }
  };

  // Handle Create Tweet (with optional or only photo)
  const handleCreateTweet = async (e) => {
    if (e) e.preventDefault();
    if (!newTweetContent.trim() && !tweetPhoto) return;

    setIsPostingTweet(true);
    const content = newTweetContent.trim();
    const photoToUpload = tweetPhoto;
    const previewToKeep = tweetPhotoPreview;

    setNewTweetContent("");
    setTweetPhoto(null);
    setTweetPhotoPreview(null);
    if (tweetPhotoInputRef.current) tweetPhotoInputRef.current.value = "";

    try {
      const res = await tweetService.createTweet({
        content,
        photo: photoToUpload,
      });

      const created = res?.data || {
        _id: `tw_${Date.now()}`,
        owner: {
          username: userData?.username || "you",
          fullName: userData?.fullName || "You",
          avatar: userData?.avatar,
        },
        content,
        photo: { url: previewToKeep || "" },
        createdAt: new Date().toISOString(),
        itemType: "tweet",
      };

      setFeedItems((prev) => [{ ...created, itemType: "tweet" }, ...prev]);
      toast.success("Tweet published to pitch wall!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to publish tweet.");
      setNewTweetContent(content);
      setTweetPhoto(photoToUpload);
      setTweetPhotoPreview(previewToKeep);
    } finally {
      setIsPostingTweet(false);
    }
  };

  const handleAddComment = async (e, targetId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const text = commentInputs[targetId];
    if (!text || !text.trim()) return;

    const newComment = {
      _id: `c_${Date.now()}`,
      owner: {
        _id: userData?._id,
        username: userData?.username || "you",
        fullName: userData?.fullName || "You",
        avatar: userData?.avatar,
      },
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setFeedItems((prev) =>
      prev.map((item) => {
        if (item._id === targetId) {
          const currentComments = item.comments || [];
          return {
            ...item,
            comments: [...currentComments, newComment],
            commentsCount: (item.commentsCount || currentComments.length) + 1,
          };
        }
        return item;
      })
    );

    setCommentInputs({ ...commentInputs, [targetId]: "" });

    try {
      await commentService.addComment(targetId, text.trim());
      toast.success("Comment added!");
    } catch (err) {
      console.log("Comment error:", err);
      toast.error("Failed to add comment.");
    }
  };

  const handleToggleCommentLike = async (e, targetId, commentId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!status || !userData) {
      toast.error("Please sign in to like comments!");
      return;
    }

    setFeedItems((prev) =>
      prev.map((item) => {
        if (item._id === targetId && Array.isArray(item.comments)) {
          const updatedComments = item.comments.map((c) => {
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
          return { ...item, comments: updatedComments };
        }
        return item;
      })
    );

    try {
      await likeService.toggleCommentLike(commentId);
    } catch (err) {
      toast.error("Failed to update comment like.");
    }
  };

  const [deleteCommentModal, setDeleteCommentModal] = useState({
    isOpen: false,
    targetId: null,
    commentId: null,
    loading: false,
  });

  const handleDeleteComment = (targetId, commentId) => {
    setDeleteCommentModal({
      isOpen: true,
      targetId,
      commentId,
      loading: false,
    });
  };

  const confirmDeleteComment = async () => {
    const { targetId, commentId } = deleteCommentModal;
    if (!commentId) return;

    setDeleteCommentModal((prev) => ({ ...prev, loading: true }));
    try {
      const res = await commentService.deleteComment(commentId);
      const deletedIds = new Set(res?.data?.deletedIds || [commentId]);

      setFeedItems((prev) =>
        prev.map((item) => {
          if (item._id === targetId) {
            const currentComments = (item.comments || []).filter((c) => !deletedIds.has(c._id?.toString()));
            return {
              ...item,
              comments: currentComments,
              commentsCount: Math.max(0, (item.commentsCount || currentComments.length + deletedIds.size) - deletedIds.size),
            };
          }
          return item;
        })
      );

      if (selectedPostModal?._id === targetId) {
        const currentComments = (selectedPostModal.comments || []).filter((c) => !deletedIds.has(c._id?.toString()));
        setSelectedPostModal({
          ...selectedPostModal,
          comments: currentComments,
          commentsCount: Math.max(0, (selectedPostModal.commentsCount || 1) - deletedIds.size),
        });
      }

      toast.success(
        deletedIds.size > 1
          ? `Deleted comment and ${deletedIds.size - 1} ${deletedIds.size === 2 ? "reply" : "replies"
          }.`
          : "Comment deleted."
      );
      setDeleteCommentModal({ isOpen: false, targetId: null, commentId: null, loading: false });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete comment.");
      setDeleteCommentModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleToggleFollow = async (username) => {
    setSuggestedUsers((prev) =>
      prev.map((u) => {
        if (u.username === username) {
          const newStatus = !u.isFollowing;
          toast.success(newStatus ? `Following @${username}` : `Unfollowed @${username}`);
          return { ...u, isFollowing: newStatus };
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

  const handleUpdatePostFromModal = (updatedPost) => {
    setSelectedPostModal(updatedPost);
    setFeedItems((prev) =>
      prev.map((item) => (item._id === updatedPost._id ? { ...updatedPost, itemType: "post" } : item))
    );
  };

  const handleDeletePostFromFeed = (deletedId) => {
    setFeedItems((prev) => prev.filter((item) => item._id !== deletedId));
  };

  const handleDeleteTweetFromFeed = async (tweetId) => {
    if (!window.confirm("Are you sure you want to delete this tweet?")) return;
    try {
      await tweetService.deleteTweet(tweetId);
      setFeedItems((prev) => prev.filter((item) => item._id !== tweetId));
      toast.success("Tweet deleted successfully!");
    } catch (err) {
      console.error("Delete tweet error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete tweet");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
      {/* Expanded Post Detail Modal */}
      {selectedPostModal && (
        <PostDetailModal
          post={selectedPostModal}
          isOpen={!!selectedPostModal}
          onClose={() => setSelectedPostModal(null)}
          onLike={(e) => handleLikePost(e, selectedPostModal._id)}
          onUpdatePost={handleUpdatePostFromModal}
          onDeletePost={handleDeletePostFromFeed}
        />
      )}

      {/* Direct Edit Post Modal */}
      {editingPostModal && (
        <EditPostModal
          post={editingPostModal}
          isOpen={!!editingPostModal}
          onClose={() => setEditingPostModal(null)}
          onPostUpdated={handleUpdatePostFromModal}
          onPostDeleted={handleDeletePostFromFeed}
        />
      )}

      {/* Share Post with Recent Chats & Groups Modal */}
      {sharingPostModal && (
        <SharePostModal
          post={sharingPostModal}
          isOpen={!!sharingPostModal}
          onClose={() => setSharingPostModal(null)}
        />
      )}

      {/* Center Feed Column */}
      <div className="lg:col-span-8 space-y-6 max-w-2xl mx-auto w-full">
        {/* Quick Microblog / Tweet Post Form */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0a0f16] border border-white/10 shadow-xl space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
              <img
                src={getAvatarUrl(userData)}
                alt="User"
                className="size-9 sm:size-11 rounded-xl sm:rounded-2xl object-cover ring-2 ring-emerald-500/40 shrink-0"
              />
              <input
                type="text"
                value={newTweetContent}
                onChange={(e) => setNewTweetContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCreateTweet();
                  }
                }}
                placeholder="Share a match update, goal highlight, or attach a photo..."
                className="flex-1 h-10 sm:h-12 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-[#060a0f] border border-white/10 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium min-w-0"
              />
            </div>

            {/* Hidden File Input for Tweet Photo */}
            <input
              type="file"
              ref={tweetPhotoInputRef}
              onChange={handlePhotoSelect}
              accept="image/*"
              className="hidden"
            />

            {/* Action Buttons Row */}
            <div className="flex items-center justify-end gap-2 shrink-0">
              {/* Emoji Picker Button for Tweet Composer */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTweetEmojiOpen(!isTweetEmojiOpen)}
                  className={`size-10 sm:size-12 rounded-xl sm:rounded-2xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${isTweetEmojiOpen
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30"
                      : "bg-[#060a0f] border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                  title="Add Emoji to Tweet"
                >
                  <Smile className="size-4.5 sm:size-5" />
                </button>

                <EmojiPicker
                  isOpen={isTweetEmojiOpen}
                  onClose={() => setIsTweetEmojiOpen(false)}
                  onSelectEmoji={(emoji) => {
                    setNewTweetContent((prev) => prev + emoji);
                  }}
                  className="bottom-14 left-0 sm:left-auto sm:right-0"
                />
              </div>

              {/* Attach Photo Button */}
              <button
                type="button"
                onClick={() => tweetPhotoInputRef.current?.click()}
                className={`size-10 sm:size-12 rounded-xl sm:rounded-2xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${tweetPhoto
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30"
                    : "bg-[#060a0f] border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                title="Attach Photo"
              >
                <ImageIcon className="size-4.5 sm:size-5" />
              </button>

              <Button
                onClick={handleCreateTweet}
                disabled={(!newTweetContent.trim() && !tweetPhoto) || isPostingTweet}
                size="sm"
                variant="primary"
                className="rounded-xl sm:rounded-2xl text-xs px-4 sm:px-5 h-10 sm:h-12 font-bold cursor-pointer shrink-0 shadow-md"
              >
                <Send className="size-3.5" />
                <span>{isPostingTweet ? "Posting..." : "Tweet"}</span>
              </Button>
            </div>
          </div>

          {/* Photo Preview Thumbnail */}
          {tweetPhotoPreview && (
            <div className="relative inline-block rounded-2xl overflow-hidden border border-emerald-500/40 bg-black/50 p-1 group">
              <img
                src={tweetPhotoPreview}
                alt="Tweet attachment preview"
                className="h-28 w-auto rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-2 right-2 size-6 rounded-full bg-black/80 hover:bg-red-500 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Remove Photo"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-neutral-400">
            <button
              type="button"
              onClick={loadFeed}
              className="flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <Shuffle className="size-3.5 text-emerald-400" />
              <span>Shuffle Feed</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => tweetPhotoInputRef.current?.click()}
                className="text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="size-3.5" /> Attach Photo
              </button>
              <Link to="/create-post" className="text-neutral-400 font-medium hover:text-white flex items-center gap-1">
                Media Studio →
              </Link>
            </div>
          </div>
        </div>

        {/* Combined Posts & Tweets Feed Stream */}
        <div className="space-y-6">
          {loadingFeed ? (
            <FootballLoader message="Loading community posts & tweets from pitch wall..." />
          ) : feedItems.length > 0 ? (
            feedItems.map((item) => {
              // 1. RENDER TWEET CARD
              if (item.itemType === "tweet") {
                const ownerUsername = item.owner?.username || "player";
                const ownerName = item.owner?.fullName || item.owner?.username || "Footballer";
                const avatarUrl = getAvatarUrl(item.owner);

                return (
                  <Card
                    key={`tw_${item._id}`}
                    className="p-6 bg-[#0a0f16] border border-emerald-500/20 hover:border-emerald-500/40 transition-all rounded-3xl space-y-3.5 shadow-xl group"
                  >
                    <div className="flex items-center justify-between">
                      <Link to={`/channel/${ownerUsername}`} className="flex items-center gap-3 group/author">
                        <img
                          src={avatarUrl}
                          alt={ownerName}
                          className="size-10 rounded-2xl object-cover ring-1 ring-emerald-500/30 group-hover/author:ring-emerald-400 transition-all"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white group-hover/author:text-emerald-400 transition-colors">
                              {ownerName}
                            </span>
                            <CheckCircle2 className="size-3.5 text-emerald-400" />
                          </div>
                          <span className="text-xs text-neutral-400">
                            @{ownerUsername} • {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                          </span>
                        </div>
                      </Link>

                      <div className="flex items-center gap-2">
                        <Badge variant="emerald" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                          💬 Tweet
                        </Badge>
                        {/* Only tweet owner can delete */}
                        {Boolean(
                          userData &&
                          ((item.owner?._id && userData?._id && item.owner._id.toString() === userData._id.toString()) ||
                            (item.owner?.username && userData?.username && item.owner.username === userData.username))
                        ) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteTweetFromFeed(item._id)}
                              className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
                              title="Delete your tweet"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                      </div>
                    </div>

                    {item.content && (
                      <p className="text-[14.5px] text-neutral-100 leading-relaxed font-normal pt-1">
                        {item.content}
                      </p>
                    )}

                    {/* Tweet Photo Attachment */}
                    {item.photo?.url && (
                      <div className="rounded-2xl overflow-hidden border border-white/10 max-h-96 bg-black/40">
                        <img
                          src={item.photo.url}
                          alt="Tweet photo attachment"
                          className="w-full h-auto max-h-96 object-cover hover:scale-[1.01] transition-transform cursor-pointer"
                          onClick={() => window.open(item.photo.url, "_blank")}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-neutral-400">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => handleLikeTweet(e, item._id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${item.isLiked
                              ? "bg-red-500/15 border-red-500/30 text-red-400 font-bold"
                              : "bg-[#060a0f] border-white/5 hover:text-white"
                            }`}
                        >
                          <Heart className={`size-4 ${item.isLiked ? "fill-red-400" : ""}`} />
                          <span>{item.likesCount || 0}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleToggleComments(item._id, e)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${openCommentsPostId === item._id
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-bold"
                              : "bg-[#060a0f] border-white/5 hover:text-white"
                            }`}
                        >
                          <MessageCircle className="size-4" />
                          <span>{item.commentsCount ?? item.comments?.length ?? 0}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSharingPostModal(item);
                          }}
                          className="p-2 rounded-xl bg-[#060a0f] border border-white/5 hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer"
                          title="Share Tweet"
                        >
                          <Share2 className="size-4" />
                        </button>
                      </div>

                      <span className="text-[11px] text-neutral-500 font-mono">
                        Tweet
                      </span>
                    </div>

                    {/* Interactive Tweet Comments Drawer */}
                    {openCommentsPostId === item._id && (
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
                              value={commentInputs[item._id] || ""}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [item._id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddComment(e, item._id);
                                }
                              }}
                              placeholder="Write a reply to this tweet..."
                              className="w-full h-9.5 pl-3.5 pr-9 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveReplyEmojiTweetId(activeReplyEmojiTweetId === item._id ? null : item._id);
                              }}
                              className={`absolute right-2 size-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${activeReplyEmojiTweetId === item._id
                                  ? "text-emerald-400 bg-emerald-500/20"
                                  : "text-neutral-400 hover:text-white"
                                }`}
                              title="Add Emoji to Reply"
                            >
                              <Smile className="size-3.5" />
                            </button>
                          </div>

                          <EmojiPicker
                            isOpen={activeReplyEmojiTweetId === item._id}
                            onClose={() => setActiveReplyEmojiTweetId(null)}
                            onSelectEmoji={(emoji) => {
                              setCommentInputs((prev) => ({
                                ...prev,
                                [item._id]: (prev[item._id] || "") + emoji,
                              }));
                            }}
                            className="bottom-12 left-0 sm:left-6"
                          />

                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            onClick={(e) => handleAddComment(e, item._id)}
                            disabled={!commentInputs[item._id]?.trim()}
                            className="h-9.5 px-3.5 rounded-xl text-xs font-bold gap-1 cursor-pointer shrink-0"
                          >
                            <Send className="size-3" />
                          </Button>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                          {item.comments && item.comments.length > 0 ? (
                            item.comments.map((c) => {
                              const isCommentOwner =
                                (c.owner?._id && userData?._id && c.owner._id.toString() === userData._id.toString()) ||
                                (c.owner?.username && userData?.username && c.owner.username === userData.username);
                              const isTweetOwner =
                                (item.owner?._id && userData?._id && item.owner._id.toString() === userData._id.toString()) ||
                                (item.owner?.username && userData?.username && item.owner.username === userData.username);

                              const isLiked =
                                c.isLiked ||
                                (Array.isArray(c.likes) &&
                                  c.likes.some((l) => (l.likedBy?._id || l.likedBy || l)?.toString() === userData?._id?.toString()));
                              const likesCount = c.likesCount ?? (Array.isArray(c.likes) ? c.likes.length : 0);

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

                                  <div className="flex items-center gap-1 shrink-0">
                                    {/* Like Comment Button */}
                                    <button
                                      type="button"
                                      onClick={(e) => handleToggleCommentLike(e, item._id, c._id)}
                                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-all text-xs font-semibold cursor-pointer ${isLiked
                                          ? "text-rose-400 bg-rose-500/15"
                                          : "text-neutral-400 hover:text-rose-400 hover:bg-white/5"
                                        }`}
                                      title={isLiked ? "Unlike reply" : "Like reply"}
                                    >
                                      <Heart className={`size-3 ${isLiked ? "fill-rose-400" : ""}`} />
                                      {likesCount > 0 && <span className="text-[10px] font-bold">{likesCount}</span>}
                                    </button>

                                    {(isCommentOwner || isTweetOwner) && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteComment(item._id, c._id)}
                                        className="opacity-0 group-hover/cmt:opacity-100 text-neutral-500 hover:text-red-400 p-1 transition-opacity cursor-pointer shrink-0"
                                        title="Delete reply"
                                      >
                                        <Trash2 className="size-3.5" />
                                      </button>
                                    )}
                                  </div>
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
                  </Card>
                );
              }

              // 2. RENDER MULTI-MEDIA POST (Clickable anywhere to open detail modal)
              return (
                <Card
                  key={`post_${item._id}`}
                  onClick={() => setSelectedPostModal(item)}
                  className="p-3.5 sm:p-6 bg-[#0a0f16] border-white/10 rounded-2xl sm:rounded-3xl space-y-3 sm:space-y-4 shadow-xl hover:border-emerald-500/30 transition-all cursor-pointer group"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/channel/${item.owner?.username || "player"}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2.5 sm:gap-3 group/author min-w-0"
                    >
                      <img
                        src={item.owner?.avatar?.url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                        alt={item.owner?.fullName}
                        className="size-9 sm:size-10 rounded-xl sm:rounded-2xl object-cover ring-1 ring-white/10 group-hover/author:ring-emerald-400 transition-all shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-white group-hover/author:text-emerald-400 transition-colors">
                            {item.owner?.fullName || item.owner?.username || "Footballer"}
                          </span>
                          <CheckCircle2 className="size-3.5 text-emerald-400" />
                        </div>
                        <span className="text-xs text-neutral-400">
                          @{item.owner?.username || "player"} • {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2">

                      {/* Edit Post for Post Owner */}
                      {userData &&
                        ((item.owner?._id && userData?._id && item.owner._id.toString() === userData._id.toString()) ||
                          (item.owner?.username && userData?.username && item.owner.username === userData.username)) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPostModal(item);
                            }}
                            className="p-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer shadow-sm"
                            title="Edit this post"
                          >
                            <Edit3 className="size-3.5" />
                          </button>
                        )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/post/${item._id}`, {
                            state: { from: location.pathname + location.search },
                          });
                        }}
                        className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
                        title="Expand View"
                      >
                        <Maximize2 className="size-4" />
                      </button>
                    </div>
                  </div>

                    {/* Multi-Image & Video Carousel (Clicking image opens dedicated post page) */}
                    <div className="max-w-[560px] mx-auto w-full aspect-[3/4]">
                      <PostMediaCarousel
                        media={item.media}
                        thumbnail={item.thumbnail}
                        fitCover={false}
                        onMediaClick={() =>
                          navigate(`/post/${item._id}`, {
                            state: { from: location.pathname + location.search },
                          })
                        }
                      />
                    </div>

                    {/* Caption Under the Post */}
                    {item.caption && (
                      <p
                        onClick={() =>
                          navigate(`/post/${item._id}`, {
                            state: { from: location.pathname + location.search },
                          })
                        }
                        className="text-sm text-neutral-100 leading-relaxed font-normal cursor-pointer hover:text-cyan-400 transition-colors px-1"
                      >
                        <span className="font-bold text-white mr-2">
                          @{item.owner?.username || "player"}
                        </span>
                        {item.caption}
                      </p>
                    )}

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs text-neutral-400">
                    <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
                      <button
                        onClick={(e) => handleLikePost(e, item._id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${item.isLiked
                            ? "bg-red-500/15 border-red-500/30 text-red-400 font-bold"
                            : "bg-[#060a0f] border-white/5 hover:text-white"
                          }`}
                      >
                        <Heart className={`size-4 ${item.isLiked ? "fill-red-400" : ""}`} />
                        <span>{item.likesCount || 0}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenCommentsPostId(openCommentsPostId === item._id ? null : item._id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#060a0f] border border-white/5 hover:text-white transition-all cursor-pointer text-xs"
                      >
                        <MessageCircle className="size-4" />
                        <span>
                          {item.comments?.length || item.commentsCount || 0}
                          <span className="hidden xs:inline sm:inline ml-1">Comments</span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSharingPostModal(item);
                        }}
                        className="p-1.5 sm:p-2 rounded-xl bg-[#060a0f] border border-white/5 hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer"
                        title="Share Post"
                      >
                        <Share2 className="size-4" />
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/post/${item._id}`, {
                          state: { from: location.pathname + location.search },
                        })
                      }
                      className="text-xs text-emerald-400 hover:underline font-bold cursor-pointer whitespace-nowrap shrink-0 ml-auto"
                    >
                      <span className="hidden sm:inline">View Full Post →</span>
                      <span className="sm:hidden">Full Post →</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {openCommentsPostId === item._id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="space-y-4 pt-4 border-t border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={commentInputs[item._id] || ""}
                          onChange={(e) =>
                            setCommentInputs({ ...commentInputs, [item._id]: e.target.value })
                          }
                          placeholder="Write a comment..."
                          className="flex-1 h-9 px-3 rounded-xl bg-[#060a0f] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={(e) => handleAddComment(e, item._id)}
                          className="rounded-xl text-xs px-3"
                        >
                          Comment
                        </Button>
                      </div>

                      {item.comments && item.comments.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {item.comments.map((c, i) => {
                            const isCommentAuthor =
                              userData &&
                              ((c.owner?._id && userData?._id && c.owner._id.toString() === userData._id.toString()) ||
                                (c.owner?.username && userData?.username && c.owner.username === userData.username));

                            const isPostAuthor =
                              userData &&
                              ((item.owner?._id && userData?._id && item.owner._id.toString() === userData._id.toString()) ||
                                (item.owner?.username && userData?.username && item.owner.username === userData.username));

                            const canDelete = isCommentAuthor || isPostAuthor;
                            const isLiked =
                              c.isLiked ||
                              (Array.isArray(c.likes) &&
                                c.likes.some((l) => (l.likedBy?._id || l.likedBy || l)?.toString() === userData?._id?.toString()));
                            const likesCount = c.likesCount ?? (Array.isArray(c.likes) ? c.likes.length : 0);

                            return (
                              <div
                                key={c._id || i}
                                className="p-3 rounded-2xl bg-[#060a0f] border border-white/5 space-y-1.5 group/comment"
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <Link
                                    to={`/channel/${c.owner?.username || "player"}`}
                                    className="font-bold text-white hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                                  >
                                    <span>{c.owner?.fullName || c.owner?.username || "Player"}</span>
                                    <span className="text-[10px] text-neutral-400 font-mono">@{c.owner?.username}</span>
                                  </Link>

                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-neutral-500">
                                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
                                    </span>

                                    {/* Like Comment Button */}
                                    <button
                                      type="button"
                                      onClick={(e) => handleToggleCommentLike(e, item._id, c._id)}
                                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-all text-xs font-semibold cursor-pointer ${isLiked
                                          ? "text-rose-400 bg-rose-500/15"
                                          : "text-neutral-400 hover:text-rose-400 hover:bg-white/5"
                                        }`}
                                      title={isLiked ? "Unlike comment" : "Like comment"}
                                    >
                                      <Heart className={`size-3 ${isLiked ? "fill-rose-400" : ""}`} />
                                      {likesCount > 0 && <span className="text-[10px] font-bold">{likesCount}</span>}
                                    </button>

                                    {canDelete && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteComment(item._id, c._id)}
                                        className="size-5 rounded-md bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-all opacity-0 group-hover/comment:opacity-100 cursor-pointer"
                                        title={
                                          isPostAuthor && !isCommentAuthor
                                            ? "Delete comment (as Post Owner)"
                                            : "Delete your comment"
                                        }
                                      >
                                        <Trash2 className="size-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-neutral-300 break-words">{c.content}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })
          ) : (
            <div className="p-12 rounded-3xl bg-[#0a0f16] border border-white/10 text-center space-y-3">
              <MessageSquare className="size-8 text-neutral-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Posts or Tweets Yet</h3>
              <p className="text-xs text-neutral-400">Be the first to share match updates or photos with the community!</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Suggested Players */}
      <div className="hidden lg:block lg:col-span-4 space-y-6">
        <div className="p-6 rounded-3xl bg-[#0a0f16] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
              <Users className="size-4 text-emerald-400" />
              <span>Suggested Players</span>
            </h3>
            <Badge variant="outline" className="text-[10px]">
              Local
            </Badge>
          </div>

          <div className="space-y-3">
            {suggestedUsers.length > 0 ? (
              suggestedUsers.slice(0, 5).map((user) => (
                <div key={user._id} className="flex items-center justify-between gap-3">
                  <Link to={`/channel/${user.username}`} className="flex items-center gap-2.5 min-w-0 group">
                    <img
                      src={user.avatar?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                      alt={user.fullName}
                      className="size-8 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-emerald-400 transition-all"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                        {user.fullName || user.username}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">@{user.username}</p>
                    </div>
                  </Link>

                  <Button
                    onClick={() => handleToggleFollow(user.username)}
                    size="sm"
                    variant={user.isFollowing ? "outline" : "primary"}
                    className="rounded-xl text-[11px] h-7 px-2.5 font-bold cursor-pointer"
                  >
                    {user.isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500 py-2">No player suggestions at the moment.</p>
            )}
          </div>
        </div>
      </div>

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
