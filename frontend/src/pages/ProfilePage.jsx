import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { sliceLogin } from "@/features/authSlice";
import ChangeClubModal from "@/components/profile/ChangeClubModal";
import { clubsByLeague } from "@/data/clubsByLeague";
import { countriesByTournament } from "@/data/countriesByTournament";
import {
  User,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  Grid,
  Video,
  Flame,
  CheckCircle2,
  UserPlus,
  UserCheck,
  Play,
  Trophy,
  Globe2,
  Shield,
  Layers,
  Send,
  ArrowLeft,
  ChevronRight,
  Maximize2,
  Trash2,
  FolderPlus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/auth.service";
import {
  postService,
  tweetService,
  sectionService,
  likeService,
  commentService,
} from "@/services/social.service";
import { followToggle } from "@/services/follow.service";
import PostMediaCarousel from "@/components/common/PostMediaCarousel";
import PostDetailModal from "@/components/common/PostDetailModal";
import EditPostModal from "@/components/common/EditPostModal";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import SharePostModal from "@/components/common/SharePostModal";
import FollowersModal from "@/components/common/FollowersModal";
import CreateSectionModal from "@/components/profile/CreateSectionModal";
import LoginModal from "@/components/auth/LoginModal";
import FootballLoader from "@/components/common/FootballLoader";
import { getAvatarUrl } from "@/utils/avatar.utils";
import { countries, clubs, players } from "@/components/FootballPreferences/FootballPreferences";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { username } = useParams();
  const { userData, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const targetUsername = username || userData?.username;
  const isOwnProfile = !username || (userData?.username && username.toLowerCase() === userData.username.toLowerCase());

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [isChangeClubOpen, setIsChangeClubOpen] = useState(false);
  const [previewPreference, setPreviewPreference] = useState(null);

  const [posts, setPosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [sections, setSections] = useState([]);

  // Tweet composer state on profile
  const [profileTweetInput, setProfileTweetInput] = useState("");
  const [isPostingProfileTweet, setIsPostingProfileTweet] = useState(false);

  // Selected Section for viewing its posts
  const [activeSection, setActiveSection] = useState(null);
  const [sectionPosts, setSectionPosts] = useState([]);
  const [loadingSectionPosts, setLoadingSectionPosts] = useState(false);

  // Post Detail Modal & Edit Post Modal
  const [selectedPostModal, setSelectedPostModal] = useState(null);
  const [editingPostModal, setEditingPostModal] = useState(null);
  const [sharingPostModal, setSharingPostModal] = useState(null);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [followModal, setFollowModal] = useState({ isOpen: false, tab: "followers" });

  // Auth modal state for guests
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("Please sign in to interact.");

  // Close image preview on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreviewPreference(null);
      }
    };
    if (previewPreference) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewPreference]);

  // Tweet Comments State
  const [openCommentsTweetId, setOpenCommentsTweetId] = useState(null);
  const [tweetCommentInputs, setTweetCommentInputs] = useState({});

  const handleToggleTweetComments = (tweetId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setOpenCommentsTweetId((prev) => (prev === tweetId ? null : tweetId));
  };

  const handleAddTweetComment = async (e, tweetId) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (!status || !userData) {
      setModalMessage("Please sign in to reply to this tweet.");
      setLoginModalOpen(true);
      return;
    }

    const text = tweetCommentInputs[tweetId];
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

    setTweets((prev) =>
      prev.map((tw) => {
        if (tw._id === tweetId) {
          const currentComments = tw.comments || [];
          return {
            ...tw,
            comments: [...currentComments, newComment],
            commentsCount: (tw.commentsCount || currentComments.length) + 1,
          };
        }
        return tw;
      })
    );

    setTweetCommentInputs((prev) => ({ ...prev, [tweetId]: "" }));

    try {
      await commentService.addComment(tweetId, text.trim());
      toast.success("Reply added!");
    } catch (err) {
      console.log("Tweet comment error:", err);
      toast.error("Failed to add reply.");
    }
  };

  const handleDeleteTweetComment = async (tweetId, commentId) => {
    setTweets((prev) =>
      prev.map((tw) => {
        if (tw._id === tweetId) {
          const currentComments = (tw.comments || []).filter((c) => c._id !== commentId);
          return {
            ...tw,
            comments: currentComments,
            commentsCount: Math.max(0, (tw.commentsCount || currentComments.length + 1) - 1),
          };
        }
        return tw;
      })
    );

    try {
      await commentService.deleteComment(commentId);
      toast.success("Reply deleted.");
    } catch (err) {
      toast.error("Failed to delete reply.");
    }
  };

  // Fetch Channel Profile & Content
  const fetchProfile = useCallback(async () => {
    if (!targetUsername) return;
    try {
      const res = await authService.getChannelProfile(targetUsername);
      if (res?.data) {
        setProfile(res.data);

        // Fetch user-specific posts
        if (res.data._id) {
          try {
            const postsRes = await postService.getUserPosts(res.data._id);
            const data = postsRes?.data || [];
            const formatted = (Array.isArray(data) ? data : []).map((p) => ({
              ...p,
              isLiked:
                userData?._id && Array.isArray(p.likes)
                  ? p.likes.some(
                    (l) =>
                      (l.likedBy?._id || l.likedBy || l)?.toString() ===
                      userData._id.toString()
                  )
                  : !!p.isLiked,
            }));
            setPosts(formatted);
          } catch (e) {
            setPosts([]);
          }
        }

        // Fetch user-specific tweets
        try {
          const tweetsRes = await tweetService.getAllTweets(res.data.username);
          setTweets(Array.isArray(tweetsRes?.data) ? tweetsRes.data : []);
        } catch (e) {
          setTweets([]);
        }

        // Fetch user sections
        try {
          const sectionsRes = await sectionService.getUserSections(res.data.username);
          setSections(Array.isArray(sectionsRes?.data) ? sectionsRes.data : []);
        } catch (e) {
          setSections([]);
        }
      }
    } catch (err) {
      console.log("Channel profile error:", err);
    } finally {
      setLoading(false);
    }
  }, [targetUsername, userData?._id]);

  useEffect(() => {
    setLoading(true);
    fetchProfile();
  }, [fetchProfile]);

  const handleToggleFollow = async () => {
    if (!status || !userData) {
      setModalMessage(`Please sign in to follow @${profile?.username || "player"}.`);
      setLoginModalOpen(true);
      return;
    }

    if (!profile) return;

    if (isOwnProfile || (userData?.username && profile?.username && userData.username.toLowerCase() === profile.username.toLowerCase())) {
      toast.error("You cannot follow yourself!");
      return;
    }

    const prevIsFollowing = !!profile.isFollowing;
    const prevCount = profile.followersCount || 0;
    const newStatus = !prevIsFollowing;

    // Instant optimistic update (0ms UI latency)
    setProfile((prev) => ({
      ...prev,
      isFollowing: newStatus,
      followersCount: newStatus
        ? prevCount + 1
        : Math.max(0, prevCount - 1),
    }));

    toast.success(newStatus ? `Following @${profile.username}` : `Unfollowed @${profile.username}`);

    try {
      const res = await followToggle(profile.username);
      if (res?.data?.isFollowing !== undefined) {
        setProfile((prev) => ({
          ...prev,
          isFollowing: res.data.isFollowing,
        }));
      }
    } catch (err) {
      // Revert on failure
      setProfile((prev) => ({
        ...prev,
        isFollowing: prevIsFollowing,
        followersCount: prevCount,
      }));
      toast.error(err?.response?.data?.message || "Failed to update follow status.");
    }
  };

  const handleLikePost = async (e, postId) => {
    e.stopPropagation();
    if (!status || !userData) {
      setModalMessage("Please sign in to like this match post.");
      setLoginModalOpen(true);
      return;
    }

    const updatePostsList = (list) =>
      list.map((p) => {
        if (p._id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? (p.likesCount || 0) + 1 : Math.max(0, (p.likesCount || 0) - 1),
          };
        }
        return p;
      });

    setPosts(updatePostsList);
    setSectionPosts(updatePostsList);

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
    } catch (e) {
      console.log("Like toggle error:", e);
    }
  };

  // Section post fetcher
  const handleSelectSection = async (sec) => {
    setActiveSection(sec);
    setLoadingSectionPosts(true);
    try {
      const res = await postService.getSectionPosts(sec._id);
      const data = res?.data || [];
      const formatted = (Array.isArray(data) ? data : []).map((p) => ({
        ...p,
        isLiked:
          userData?._id && Array.isArray(p.likes)
            ? p.likes.some(
              (l) =>
                (l.likedBy?._id || l.likedBy || l)?.toString() ===
                userData._id.toString()
            )
            : !!p.isLiked,
      }));
      setSectionPosts(formatted);
    } catch (err) {
      console.log("Section posts fetch error:", err);
      setSectionPosts([]);
    } finally {
      setLoadingSectionPosts(false);
    }
  };

  // Auto-select first section when Sections tab is opened
  useEffect(() => {
    if (activeTab === "sections" && !activeSection && sections.length > 0) {
      handleSelectSection(sections[0]);
    }
  }, [activeTab, sections, activeSection]);

  const handleCreateProfileTweet = async (e) => {
    if (e) e.preventDefault();
    if (!profileTweetInput.trim()) return;

    setIsPostingProfileTweet(true);
    const content = profileTweetInput.trim();
    setProfileTweetInput("");

    try {
      const res = await tweetService.createTweet(content);
      const created = res?.data || {
        _id: `tw_${Date.now()}`,
        owner: {
          username: profile?.username,
          fullName: profile?.fullName,
          avatar: profile?.avatar,
        },
        content,
        createdAt: new Date().toISOString(),
      };
      setTweets((prev) => [created, ...prev]);
      toast.success("Tweet posted to your wall!");
    } catch (err) {
      toast.error("Failed to publish tweet.");
      setProfileTweetInput(content);
    } finally {
      setIsPostingProfileTweet(false);
    }
  };

  const handleLikeTweet = async (e, tweetId) => {
    e.stopPropagation();
    if (!status || !userData) {
      setModalMessage("Please sign in to like this tweet.");
      setLoginModalOpen(true);
      return;
    }

    setTweets((prev) =>
      prev.map((tw) => {
        if (tw._id === tweetId) {
          const isLiked = !tw.isLiked;
          return {
            ...tw,
            isLiked,
            likesCount: isLiked
              ? (tw.likesCount || 0) + 1
              : Math.max(0, (tw.likesCount || 0) - 1),
          };
        }
        return tw;
      })
    );

    try {
      await likeService.toggleTweetLike(tweetId);
    } catch (err) {
      console.log("Tweet like error:", err);
    }
  };

  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    title: "Delete Tweet",
    message: "Are you sure you want to permanently delete this tweet? This action cannot be undone.",
    itemType: "Tweet",
    onConfirm: null,
    loading: false,
  });

  const requestDeleteTweet = (tweetId) => {
    setDeleteConfirmModal({
      isOpen: true,
      title: "Delete Tweet",
      message: "Are you sure you want to permanently delete this tweet from your wall? This action cannot be undone.",
      itemType: "Tweet",
      onConfirm: () => confirmDeleteTweet(tweetId),
      loading: false,
    });
  };

  const confirmDeleteTweet = async (tweetId) => {
    setDeleteConfirmModal((prev) => ({ ...prev, loading: true }));
    try {
      await tweetService.deleteTweet(tweetId);
      setTweets((prev) => prev.filter((tw) => tw._id !== tweetId));
      toast.success("Tweet deleted successfully.");
      setDeleteConfirmModal((prev) => ({ ...prev, isOpen: false, loading: false }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete tweet.");
      setDeleteConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleUpdatePostFromModal = (updatedPost) => {
    setSelectedPostModal(updatedPost);
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
    setSectionPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  // Resolve thumbnail as cover, prioritizing clean media image to avoid letterboxed canvas thumbnails
  const getPostCoverImage = (post) => {
    if (!post) return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600";

    // 1. Prefer pristine image from post media
    if (Array.isArray(post.media) && post.media.length > 0) {
      const firstImage = post.media.find((m) => {
        const url = m?.url || (typeof m === "string" ? m : "");
        const isVideo = m?.type === "video" || (typeof url === "string" && url.match(/\.(mp4|webm|mov|ogg)$/i));
        return !isVideo && url && url.trim() !== "";
      });

      if (firstImage) {
        return firstImage?.url || (typeof firstImage === "string" ? firstImage : "");
      }
    }

    // 2. Check dedicated thumbnail
    const thumb = post.thumbnail?.url || (typeof post.thumbnail === "string" && post.thumbnail);
    if (thumb && typeof thumb === "string" && thumb.trim() !== "") {
      return thumb;
    }

    // 3. Fallback to first item in post media
    if (Array.isArray(post.media) && post.media.length > 0) {
      const firstItem = post.media[0];
      return firstItem?.url || (typeof firstItem === "string" ? firstItem : "");
    }

    return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600";
  };

  if (loading) {
    return (
      <div className="py-16">
        <FootballLoader message="Loading footballer channel profile..." size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 rounded-3xl bg-neutral-900 border border-white/10 text-center space-y-3">
        <User className="size-10 text-neutral-500 mx-auto" />
        <h3 className="text-sm font-bold text-white">Player Not Found</h3>
        <p className="text-xs text-neutral-400">The requested profile @{targetUsername} does not exist.</p>
        <Link to="/">
          <Button variant="primary" size="sm" className="text-xs">
            Return to Feed
          </Button>
        </Link>
      </div>
    );
  }

  // Resolve preference images
  const playerImg =
    profile.favouritePlayer?.image ||
    players.find(
      (p) =>
        p.name?.toLowerCase() ===
        profile.favouritePlayer?.name?.toLowerCase()
    )?.image ||
    (profile.favouritePlayer?.name ? "/player/messi.png" : null);

  const foundTournamentCountry = countriesByTournament
    .flatMap((t) => t.countries)
    .find(
      (c) =>
        c.name?.toLowerCase() ===
        profile.favouriteCountry?.name?.toLowerCase()
    );

  const countryImg =
    profile.favouriteCountry?.flag ||
    foundTournamentCountry?.image ||
    countries.find(
      (c) =>
        c.name?.toLowerCase() ===
        profile.favouriteCountry?.name?.toLowerCase()
    )?.image ||
    (profile.favouriteCountry?.name ? "/country/fifa-world-cup-2026.football-logos.cc/argentina-national-team.football-logos.cc.png" : null);

  const foundLeagueClub = clubsByLeague
    .flatMap((l) => l.clubs)
    .find(
      (c) =>
        c.name?.toLowerCase() ===
        profile.favouriteClub?.name?.toLowerCase()
    );

  const clubImg =
    profile.favouriteClub?.logo ||
    foundLeagueClub?.image ||
    clubs.find(
      (c) =>
        c.name?.toLowerCase() ===
        profile.favouriteClub?.name?.toLowerCase()
    )?.image ||
    (profile.favouriteClub?.name ? "/club/english-premier-league-2026-2027.football-logos.cc/arsenal.football-logos.cc.png" : null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Cover Image & Profile Header */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0f16] shadow-2xl">
        {/* Cover Photo */}
        <div className="h-40 sm:h-56 md:h-64 lg:h-76 w-full bg-neutral-950 relative overflow-hidden">
          {profile.coverImage?.url ? (
            <img
              src={profile.coverImage.url}
              alt="Cover"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900" />
          )}
        </div>

        {/* Profile Details Bar */}
        <div className="px-4 sm:px-8 pt-0 pb-4 sm:pb-6 relative -mt-10 sm:-mt-16 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-5">
            <img
              src={getAvatarUrl(profile)}
              alt={profile.fullName}
              className="size-20 sm:size-28 md:size-32 rounded-2xl sm:rounded-3xl object-cover ring-4 ring-[#0a0f16] shadow-2xl bg-neutral-950"
            />
            <div className="text-center sm:text-left space-y-0.5 sm:space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight font-display">
                  {profile.fullName}
                </h1>
                <CheckCircle2 className="size-4 sm:size-5 text-emerald-400 fill-emerald-400/20" />
              </div>
              <p className="text-xs md:text-sm text-neutral-400 font-medium">
                @{profile.username}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 flex-wrap">
            {isOwnProfile ? (
              <Link to="/settings">
                <Button variant="secondary" size="sm" className="rounded-xl text-xs gap-1.5 font-semibold">
                  <Edit className="size-3.5" /> Edit Profile & Preferences
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  onClick={handleToggleFollow}
                  variant={profile.isFollowing ? "outline" : "primary"}
                  size="sm"
                  className="rounded-xl text-xs font-bold gap-1.5"
                >
                  {profile.isFollowing ? (
                    <>
                      <UserCheck className="size-3.5" /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="size-3.5" /> Follow
                    </>
                  )}
                </Button>
                <Link to={`/messages?userId=${profile._id}&username=${profile.username}`}>
                  <Button variant="secondary" size="sm" className="rounded-xl text-xs gap-1.5 cursor-pointer">
                    <MessageCircle className="size-3.5" /> Message
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Row 1: Followers & Following (Interactive buttons opening FollowersModal) */}
        <div className="flex items-center justify-center gap-6 sm:gap-16 py-3 sm:py-4 border-t border-white/[0.08] bg-[#070b10]/95 text-center">
          <button
            type="button"
            onClick={() => setFollowModal({ isOpen: true, tab: "followers" })}
            className="space-y-0.5 sm:space-y-1 group/stat px-3 sm:px-5 py-1.5 sm:py-2 rounded-2xl hover:bg-white/[0.05] transition-colors cursor-pointer select-none"
            title="View Followers"
          >
            <div className="text-[10px] sm:text-[11px] text-neutral-400 group-hover/stat:text-emerald-400 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1">
              <span>Followers</span>
            </div>
            <div className="text-xl sm:text-3xl font-black font-display text-white group-hover/stat:scale-105 transition-transform">
              {profile.followersCount || 0}
            </div>
          </button>

          <div className="h-8 sm:h-9 w-px bg-white/10" />

          <button
            type="button"
            onClick={() => setFollowModal({ isOpen: true, tab: "following" })}
            className="space-y-0.5 sm:space-y-1 group/stat px-3 sm:px-5 py-1.5 sm:py-2 rounded-2xl hover:bg-white/[0.05] transition-colors cursor-pointer select-none"
            title="View Following"
          >
            <div className="text-[10px] sm:text-[11px] text-neutral-400 group-hover/stat:text-emerald-400 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1">
              <span>Following</span>
            </div>
            <div className="text-xl sm:text-3xl font-black font-display text-white group-hover/stat:scale-105 transition-transform">
              {profile.followingCount || 0}
            </div>
          </button>
        </div>

        {/* Row 2: 3 Equal Items Directly Below (Player, Country, Club) - Enlarged High Impact */}
        <div className="grid grid-cols-3 gap-2 sm:gap-5 md:gap-8 p-3 sm:p-6 md:p-10 border-t border-white/[0.08] bg-[#090e15]/90 text-center">
          {/* 1. Star Player */}
          <div
            onClick={() =>
              playerImg &&
              setPreviewPreference({
                type: "Star Player",
                title: profile.favouritePlayer?.name || "Star Player",
                image: playerImg,
                isCover: true,
              })
            }
            className="flex flex-col items-center justify-center space-y-1.5 sm:space-y-3 group cursor-pointer"
            title="Click to view image"
          >
            <span className="text-[10px] sm:text-xs md:text-sm text-neutral-400 font-bold uppercase tracking-widest block transition-colors duration-300 group-hover:text-emerald-400 truncate max-w-full">
              Star Player
            </span>
            <div className="size-16 sm:size-24 md:size-32 lg:size-36 rounded-2xl sm:rounded-3xl bg-[#060a0f] border border-white/15 p-1 sm:p-1.5 shadow-2xl flex items-center justify-center group-hover:border-emerald-400 group-hover:scale-105 group-hover:shadow-emerald-500/20 transition-all duration-300 ease-out overflow-hidden ring-1 ring-white/5">
              {playerImg ? (
                <img
                  src={playerImg}
                  alt={profile.favouritePlayer?.name || "Star Player"}
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl transition-transform duration-300 ease-out group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <User className="size-8 sm:size-12 md:size-16 text-neutral-500 transition-colors duration-300 group-hover:text-emerald-400" />
              )}
            </div>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-black font-display text-emerald-400 truncate max-w-full px-1 transition-transform duration-300 group-hover:scale-105">
              {profile.favouritePlayer?.name || "Not specified"}
            </div>
          </div>

          {/* 2. Favourite Country */}
          <div
            onClick={() =>
              countryImg &&
              setPreviewPreference({
                type: "Favourite Country",
                title: profile.favouriteCountry?.name || "Favourite Country",
                image: countryImg,
                isCover: false,
              })
            }
            className="flex flex-col items-center justify-center space-y-1.5 sm:space-y-3 group cursor-pointer"
            title="Click to view image"
          >
            <span className="text-[10px] sm:text-xs md:text-sm text-neutral-400 font-bold uppercase tracking-widest block transition-colors duration-300 group-hover:text-emerald-400 truncate max-w-full">
              Country
            </span>
            <div className="size-16 sm:size-24 md:size-32 lg:size-36 rounded-2xl sm:rounded-3xl bg-[#060a0f] border border-white/15 p-2 sm:p-3 md:p-4 shadow-2xl flex items-center justify-center group-hover:border-emerald-400 group-hover:scale-105 group-hover:shadow-emerald-500/20 transition-all duration-300 ease-out overflow-hidden ring-1 ring-white/5">
              {countryImg ? (
                <img
                  src={countryImg}
                  alt={profile.favouriteCountry?.name || "Favourite Country"}
                  className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 ease-out group-hover:scale-110"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <Globe2 className="size-8 sm:size-12 md:size-16 text-neutral-500 transition-colors duration-300 group-hover:text-emerald-400" />
              )}
            </div>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-black font-display text-emerald-400 truncate max-w-full px-1 transition-transform duration-300 group-hover:scale-105">
              {profile.favouriteCountry?.name || "Not specified"}
            </div>
          </div>

          {/* 3. Favourite Club */}
          <div
            onClick={() =>
              clubImg &&
              setPreviewPreference({
                type: "Favourite Club",
                title: profile.favouriteClub?.name || "Favourite Club",
                image: clubImg,
                isCover: false,
              })
            }
            className="flex flex-col items-center justify-center space-y-1.5 sm:space-y-3 group cursor-pointer"
            title="Click to view image"
          >
            <span className="text-[10px] sm:text-xs md:text-sm text-neutral-400 font-bold uppercase tracking-widest block transition-colors duration-300 group-hover:text-emerald-400 truncate max-w-full">
              Club
            </span>

            <div className="size-16 sm:size-24 md:size-32 lg:size-36 rounded-2xl sm:rounded-3xl bg-[#060a0f] border border-white/15 p-2 sm:p-3 md:p-4 shadow-2xl flex items-center justify-center group-hover:border-emerald-400 group-hover:scale-105 group-hover:shadow-emerald-500/20 transition-all duration-300 ease-out overflow-hidden ring-1 ring-white/5">
              {clubImg ? (
                <img
                  src={clubImg}
                  alt={profile.favouriteClub?.name || "Favourite Club"}
                  className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <Shield className="size-8 sm:size-12 md:size-16 text-neutral-500 transition-colors duration-300 group-hover:text-emerald-400" />
              )}
            </div>

            <div className="text-xs sm:text-sm md:text-base lg:text-lg font-black font-display text-emerald-400 truncate max-w-full px-1 transition-transform duration-300 group-hover:scale-105">
              {profile.favouriteClub?.name || "Not specified"}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-3 border-b border-white/[0.08] pb-3 overflow-x-auto custom-scrollbar">
        {[
          { id: "posts", label: `Posts (${posts.length})`, icon: Grid },
          { id: "tweets", label: `Tweets (${tweets.length})`, icon: MessageCircle },
          { id: "sections", label: `Sections (${sections.length})`, icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.id);
                if (tab.id === "sections" && sections.length > 0 && !activeSection) {
                  handleSelectSection(sections[0]);
                }
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${activeTab === tab.id
                  ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                  : "text-neutral-300 hover:text-white hover:bg-white/[0.05]"
                }`}
            >
              <Icon className="size-3.5 sm:size-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Persistent Minimum Height Container to prevent scroll jumps */}
      <div className="min-h-[520px]">
        {/* Posts Tab: Edge-to-Edge Grid with Click to Open Expanded View */}
        {activeTab === "posts" && (
          <div>
            {posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => setSelectedPostModal(post)}
                    className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.08] hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg sm:shadow-xl flex flex-col justify-between"
                  >
                    {/* Top: Edge-to-Edge Thumbnail Post Cover */}
                    <div className="w-full relative bg-neutral-900 aspect-[4/3] overflow-hidden group/cover">
                      <img
                        src={getPostCoverImage(post)}
                        alt={post.caption || "Post cover"}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 select-none"
                        loading="lazy"
                      />
                      {Array.isArray(post.media) && post.media.length > 1 && (
                        <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/85 text-white text-[9px] sm:text-[11px] font-bold tracking-wider border border-white/15 flex items-center gap-0.5 sm:gap-1 shadow-lg pointer-events-none">
                          <Layers className="size-2.5 sm:size-3 text-emerald-400" />
                          <span>{post.media.length}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom: Caption & Metadata */}
                    <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-3 bg-[#0a0f16]/95 border-t border-white/[0.06] flex-1 flex flex-col justify-between">
                      {post.caption && (
                        <p className="text-[11px] sm:text-xs md:text-sm text-neutral-100 line-clamp-1 sm:line-clamp-2 leading-relaxed font-normal">
                          {post.caption}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-neutral-400 pt-1.5 sm:pt-2 border-t border-white/[0.05]">
                        <div className="flex items-center gap-1.5 sm:gap-3">
                          <button
                            type="button"
                            onClick={(e) => handleLikePost(e, post._id)}
                            className={`flex items-center gap-0.5 sm:gap-1 cursor-pointer text-[10px] sm:text-xs font-semibold ${
                              post.isLiked ? "text-red-400 font-bold" : "hover:text-white text-neutral-300"
                            }`}
                          >
                            <Heart className={`size-3 sm:size-3.5 ${post.isLiked ? "fill-red-400" : ""}`} />
                            <span>{post.likesCount ?? (Array.isArray(post.likes) ? post.likes.length : 0)}</span>
                          </button>

                          <span className="flex items-center gap-0.5 sm:gap-1 text-neutral-300 text-[10px] sm:text-xs font-semibold">
                            <MessageCircle className="size-3 sm:size-3.5" />
                            <span>{post.commentsCount ?? (Array.isArray(post.comments) ? post.comments.length : 0)}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-[9px] sm:text-[11px] text-neutral-400 font-medium hidden md:inline">
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
                          </span>

                          {isOwnProfile && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPostModal(post);
                              }}
                              className="size-5 sm:size-6 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-neutral-400 hover:text-emerald-300 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                              title="Edit post"
                            >
                              <Edit className="size-2.5 sm:size-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-14 rounded-3xl bg-neutral-900/60 border border-white/10 text-center space-y-3 shadow-xl">
                <Grid className="size-10 text-neutral-500 mx-auto" />
                <h4 className="text-base font-bold text-white font-display">No Posts Yet</h4>
                <p className="text-sm text-neutral-400 font-medium">@{profile.username} has not published any posts.</p>
              </div>
            )}
          </div>
        )}

        {/* Tweets Tab */}
        {activeTab === "tweets" && (
          <div className="space-y-6 max-w-3xl">
            {/* Quick Tweet Composer for Profile Owner */}
            {isOwnProfile && (
              <div className="p-5 rounded-3xl bg-[#0a0f16] border border-white/10 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatarUrl(profile)}
                    alt={profile.fullName}
                    className="size-10 rounded-2xl object-cover ring-2 ring-emerald-500/40 shrink-0"
                  />
                  <input
                    type="text"
                    value={profileTweetInput}
                    onChange={(e) => setProfileTweetInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleCreateProfileTweet();
                      }
                    }}
                    placeholder="Post a tweet to your wall..."
                    className="flex-1 h-11 px-4 rounded-2xl bg-[#060a0f] border border-white/10 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <Button
                    onClick={handleCreateProfileTweet}
                    disabled={!profileTweetInput.trim() || isPostingProfileTweet}
                    size="sm"
                    variant="primary"
                    className="rounded-2xl text-xs px-4 h-11 font-bold cursor-pointer shrink-0"
                  >
                    <Send className="size-3.5" />
                    <span>{isPostingProfileTweet ? "Posting..." : "Post"}</span>
                  </Button>
                </div>
              </div>
            )}

            {tweets.length > 0 ? (
              tweets.map((tw) => (
                <div
                  key={tw._id}
                  className="glass-card rounded-3xl p-5 sm:p-6 border border-white/[0.08] space-y-3.5 shadow-xl transition-all hover:border-emerald-500/30 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={getAvatarUrl(tw.owner || profile)}
                        alt={tw.owner?.fullName || profile.fullName}
                        className="size-10 rounded-2xl object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-bold text-sm text-white">
                            {tw.owner?.fullName || profile.fullName || profile.username}
                          </span>
                          <CheckCircle2 className="size-3.5 text-emerald-400" />
                        </div>
                        <span className="text-xs text-neutral-400 font-medium">
                          @{tw.owner?.username || profile.username}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-400 font-mono">
                        {tw.createdAt ? new Date(tw.createdAt).toLocaleDateString() : "Recent"}
                      </span>

                      {isOwnProfile && (
                        <button
                          type="button"
                          onClick={() => requestDeleteTweet(tw._id)}
                          className="size-7 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Delete tweet"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {tw.content && (
                    <p className="text-[15px] text-neutral-100 leading-relaxed font-normal pt-1">
                      {tw.content}
                    </p>
                  )}

                  {/* Tweet Photo Attachment */}
                  {tw.photo?.url && (
                    <div className="rounded-2xl overflow-hidden border border-white/10 max-h-96 bg-black/40">
                      <img
                        src={tw.photo.url}
                        alt="Tweet photo attachment"
                        className="w-full h-auto max-h-96 object-cover hover:scale-[1.01] transition-transform cursor-pointer"
                        onClick={() => window.open(tw.photo.url, "_blank")}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-neutral-400">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => handleLikeTweet(e, tw._id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${tw.isLiked
                            ? "bg-red-500/15 border-red-500/30 text-red-400 font-bold"
                            : "bg-[#060a0f] border-white/5 hover:text-white"
                          }`}
                      >
                        <Heart className={`size-4 ${tw.isLiked ? "fill-red-400" : ""}`} />
                        <span>{tw.likesCount || 0}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleToggleTweetComments(tw._id, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${openCommentsTweetId === tw._id
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-bold"
                            : "bg-[#060a0f] border-white/5 hover:text-white"
                          }`}
                      >
                        <MessageCircle className="size-4" />
                        <span>{tw.commentsCount ?? tw.comments?.length ?? 0}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSharingPostModal(tw)}
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

                  {/* Interactive Profile Tweet Comments Drawer */}
                  {openCommentsTweetId === tw._id && (
                    <div className="pt-3.5 border-t border-white/[0.08] space-y-3.5" onClick={(e) => e.stopPropagation()}>
                      {/* New Comment Input */}
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getAvatarUrl(userData)}
                          alt="You"
                          className="size-8 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                        />
                        <input
                          type="text"
                          value={tweetCommentInputs[tw._id] || ""}
                          onChange={(e) => setTweetCommentInputs({ ...tweetCommentInputs, [tw._id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddTweetComment(e, tw._id);
                            }
                          }}
                          placeholder="Write a reply to this tweet..."
                          className="flex-1 h-9.5 px-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          onClick={(e) => handleAddTweetComment(e, tw._id)}
                          disabled={!tweetCommentInputs[tw._id]?.trim()}
                          className="h-9.5 px-3.5 rounded-xl text-xs font-bold gap-1 cursor-pointer"
                        >
                          <Send className="size-3" />
                        </Button>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                        {tw.comments && tw.comments.length > 0 ? (
                          tw.comments.map((c) => {
                            const isCommentOwner =
                              (c.owner?._id && userData?._id && c.owner._id.toString() === userData._id.toString()) ||
                              (c.owner?.username && userData?.username && c.owner.username === userData.username);
                            const isTweetOwner =
                              (tw.owner?._id && userData?._id && tw.owner._id.toString() === userData._id.toString()) ||
                              (tw.owner?.username && userData?.username && tw.owner.username === userData.username);

                            return (
                              <div
                                key={c._id}
                                className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-start justify-between gap-3 group/cmt"
                              >
                                <div className="flex items-start gap-2.5 min-w-0">
                                  <img
                                    src={getAvatarUrl(c.owner)}
                                    alt={c.owner?.fullName || "User"}
                                    className="size-7 rounded-lg object-cover ring-1 ring-white/10 shrink-0 mt-0.5"
                                  />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-xs text-white truncate">
                                        {c.owner?.fullName || c.owner?.username || "Player"}
                                      </span>
                                      <span className="text-[10px] text-neutral-400 font-mono">
                                        @{c.owner?.username}
                                      </span>
                                    </div>
                                    <p className="text-xs text-neutral-200 mt-1 leading-relaxed break-words font-normal">
                                      {c.content}
                                    </p>
                                  </div>
                                </div>

                                {(isCommentOwner || isTweetOwner) && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTweetComment(tw._id, c._id)}
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
              ))
            ) : (
              <div className="p-14 rounded-3xl bg-neutral-900/60 border border-white/10 text-center space-y-3 shadow-xl">
                <MessageCircle className="size-10 text-neutral-500 mx-auto" />
                <h4 className="text-base font-bold text-white font-display">No Tweets Yet</h4>
                <p className="text-sm text-neutral-400 font-medium">@{profile.username} has not published any tweets.</p>
              </div>
            )}
          </div>
        )}

        {/* Sections Tab: Interactive Section Navigator + Post Viewer */}
        {activeTab === "sections" && (
          <div className="space-y-7">
            {/* Header / Filter bar with Create Section Button */}
            <div className="flex items-center justify-between gap-2.5 pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar flex-1 min-w-0 py-0.5">
                {sections.map((sec) => (
                  <button
                    key={sec._id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelectSection(sec);
                    }}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                      activeSection?._id === sec._id
                        ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 font-extrabold"
                        : "bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.07]"
                    }`}
                  >
                    <Layers className="size-3.5 sm:size-4" />
                    <span className="truncate max-w-[110px] sm:max-w-[180px]">{sec.name}</span>
                  </button>
                ))}
              </div>

              {/* Create Section CTA for Profile Owner */}
              {isOwnProfile && (
                <Button
                  onClick={() => setIsCreateSectionOpen(true)}
                  size="sm"
                  variant="primary"
                  className="rounded-xl text-[11px] sm:text-xs font-bold h-8 sm:h-9 px-2.5 sm:px-3.5 shadow-md shadow-emerald-500/20 cursor-pointer gap-1 sm:gap-1.5 shrink-0"
                >
                  <Plus className="size-3.5 stroke-[2.5]" />
                  <span>Create Section</span>
                </Button>
              )}
            </div>

            {sections.length > 0 ? (
              <div className="space-y-6">
                {/* Active Section Header & Posts View */}
                {activeSection && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Badge variant="emerald" className="text-xs px-3.5 py-1 font-bold">{activeSection.name}</Badge>
                        <span className="text-xs text-neutral-400 font-semibold">
                          ({sectionPosts.length} posts)
                        </span>
                      </div>
                    </div>

                    {loadingSectionPosts ? (
                      <FootballLoader message={`Fetching posts from "${activeSection.name}" section...`} />
                    ) : sectionPosts.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
                        {sectionPosts.map((post) => (
                          <div
                            key={post._id}
                            onClick={() => setSelectedPostModal(post)}
                            className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.08] hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg sm:shadow-xl flex flex-col justify-between"
                          >
                            {/* Top: Edge-to-Edge Thumbnail Post Cover */}
                            <div className="w-full relative bg-neutral-900 aspect-[4/3] overflow-hidden group/cover">
                              <img
                                src={getPostCoverImage(post)}
                                alt={post.caption || "Post cover"}
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 select-none"
                                loading="lazy"
                              />
                              {Array.isArray(post.media) && post.media.length > 1 && (
                                <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/85 text-white text-[9px] sm:text-[11px] font-bold tracking-wider border border-white/15 flex items-center gap-0.5 sm:gap-1 shadow-lg pointer-events-none">
                                  <Layers className="size-2.5 sm:size-3 text-emerald-400" />
                                  <span>{post.media.length}</span>
                                </div>
                              )}
                            </div>

                            <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-3 bg-[#0a0f16]/95 border-t border-white/[0.06] flex-1 flex flex-col justify-between">
                              {post.caption && (
                                <p className="text-[11px] sm:text-xs md:text-sm text-neutral-100 line-clamp-1 sm:line-clamp-2 leading-relaxed font-normal">
                                  {post.caption}
                                </p>
                              )}

                              <div className="flex items-center justify-between text-[10px] sm:text-xs text-neutral-400 pt-1.5 sm:pt-2 border-t border-white/[0.05]">
                                <div className="flex items-center gap-1.5 sm:gap-3">
                                  <button
                                    type="button"
                                    onClick={(e) => handleLikePost(e, post._id)}
                                    className={`flex items-center gap-0.5 sm:gap-1 cursor-pointer text-[10px] sm:text-xs font-semibold ${
                                      post.isLiked ? "text-red-400 font-bold" : "hover:text-white text-neutral-300"
                                    }`}
                                  >
                                    <Heart className={`size-3 sm:size-3.5 ${post.isLiked ? "fill-red-400" : ""}`} />
                                    <span>{post.likesCount ?? (Array.isArray(post.likes) ? post.likes.length : 0)}</span>
                                  </button>

                                  <span className="flex items-center gap-0.5 sm:gap-1 text-neutral-300 text-[10px] sm:text-xs font-semibold">
                                    <MessageCircle className="size-3 sm:size-3.5" />
                                    <span>{post.commentsCount ?? (Array.isArray(post.comments) ? post.comments.length : 0)}</span>
                                  </span>
                                </div>

                                <span className="text-[9px] sm:text-[11px] text-neutral-400 font-medium hidden md:inline">
                                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-14 rounded-3xl bg-neutral-900/60 border border-white/10 text-center space-y-3 shadow-xl">
                        <Grid className="size-10 text-neutral-500 mx-auto" />
                        <h4 className="text-base font-bold text-white font-display">No Posts in Section</h4>
                        <p className="text-sm text-neutral-400 font-medium">
                          No posts have been tagged under "{activeSection.name}" yet.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-14 rounded-3xl bg-neutral-900/60 border border-white/10 text-center space-y-4 shadow-xl max-w-lg mx-auto">
                <div className="size-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                  <FolderPlus className="size-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white font-display">No Custom Sections</h4>
                  <p className="text-sm text-neutral-400 font-medium leading-relaxed">
                    {isOwnProfile
                      ? "Create sections like 'Match Highlights' or 'Training Clips' to organize your wall."
                      : `@${profile.username} has not created any post sections yet.`}
                  </p>
                </div>
                {isOwnProfile && (
                  <Button
                    onClick={() => setIsCreateSectionOpen(true)}
                    variant="primary"
                    className="rounded-2xl text-xs font-bold h-11 px-6 shadow-md shadow-emerald-500/20 cursor-pointer gap-2"
                  >
                    <Plus className="size-4 stroke-[2.5]" />
                    <span>Create First Section</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
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
        onDeletePost={(deletedId) => {
          setPosts((prev) => prev.filter((p) => p._id !== deletedId));
          setSectionPosts((prev) => prev.filter((p) => p._id !== deletedId));
        }}
      />

      {/* Direct Edit Post Modal */}
      {editingPostModal && (
        <EditPostModal
          post={editingPostModal}
          isOpen={!!editingPostModal}
          onClose={() => setEditingPostModal(null)}
          onPostUpdated={handleUpdatePostFromModal}
          onPostDeleted={(deletedId) => {
            setPosts((prev) => prev.filter((p) => p._id !== deletedId));
            setSectionPosts((prev) => prev.filter((p) => p._id !== deletedId));
          }}
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

      {/* In-App Login Modal for Guests */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        message={modalMessage}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() => setDeleteConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={deleteConfirmModal.onConfirm}
        title={deleteConfirmModal.title}
        message={deleteConfirmModal.message}
        itemType={deleteConfirmModal.itemType}
        loading={deleteConfirmModal.loading}
      />

      {/* Followers & Following List Modal */}
      {followModal.isOpen && (
        <FollowersModal
          isOpen={followModal.isOpen}
          onClose={() => setFollowModal((prev) => ({ ...prev, isOpen: false }))}
          username={profile?.username || targetUsername}
          initialTab={followModal.tab}
          onFollowChange={fetchProfile}
        />
      )}

      {/* Change Favourite Club Modal */}
      {isChangeClubOpen && (
        <ChangeClubModal
          isOpen={isChangeClubOpen}
          onClose={() => setIsChangeClubOpen(false)}
          currentClubName={profile?.favouriteClub?.name}
          currentClubLogo={profile?.favouriteClub?.logo || clubImg}
          onClubSelected={async (selectedClub) => {
            const res = await authService.updateAccountDetails({
              favouriteClub: {
                name: selectedClub.name,
                logo: selectedClub.image,
              },
            });
            if (res?.data) {
              dispatch(sliceLogin(res.data));
              setProfile((prev) => ({
                ...prev,
                favouriteClub: {
                  name: selectedClub.name,
                  logo: selectedClub.image,
                },
              }));
            }
          }}
        />
      )}

      {/* Create Section Modal */}
      <CreateSectionModal
        isOpen={isCreateSectionOpen}
        onClose={() => setIsCreateSectionOpen(false)}
        onSectionCreated={(newSection) => {
          if (newSection?._id) {
            setSections((prev) => [newSection, ...prev]);
            handleSelectSection(newSection);
          }
        }}
      />

      {/* Fullscreen Big PNG Image Preview Lightbox for Player, Country, and Club */}
      {previewPreference && (
        <div
          onClick={() => setPreviewPreference(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-pointer animate-in fade-in duration-200 select-none"
        >
          <div
            onClick={() => setPreviewPreference(null)}
            className="relative max-w-sm sm:max-w-md w-full flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95 duration-200 text-center"
          >
            <div className="space-y-1.5">
              <span className="text-[11px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 rounded-full inline-block">
                {previewPreference.type}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                {previewPreference.title}
              </h3>
            </div>

            <div className="relative size-64 sm:size-80 md:size-96 rounded-3xl bg-[#060a0f] border border-white/20 p-4 sm:p-6 shadow-2xl flex items-center justify-center overflow-hidden ring-2 ring-emerald-500/40">
              <div className="absolute inset-0 bg-emerald-500/15 blur-2xl pointer-events-none" />
              <img
                src={previewPreference.image}
                alt={previewPreference.title}
                className={`w-full h-full ${
                  previewPreference.isCover
                    ? "object-cover rounded-2xl"
                    : "object-contain drop-shadow-2xl"
                } relative z-10 transition-transform duration-300 hover:scale-105`}
              />
            </div>

            <p className="text-xs text-neutral-400 font-medium bg-black/40 px-3 py-1 rounded-full border border-white/10">
              Click anywhere to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
