import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  MessageCircle,
  Search,
  Plus,
  Send,
  Users,
  Check,
  CheckCheck,
  Pencil,
  Trash2,
  ShieldCheck,
  UserCheck,
  UserPlus,
  User,
  ExternalLink,
  MapPin,
  Compass,
  Sparkles,
  RefreshCw,
  X,
  Radio,
  CheckCircle2,
  Inbox,
  MailQuestion,
  Clock,
  Smile,
  Building2,
  Ticket,
  Download,
  ArrowRight,
  Play,
  Image as ImageIcon,
  Heart,
  Reply,
  CornerDownRight,
  Edit3,
  Camera,
  Settings,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { socket } from "@/utils/socket";
import { chatService } from "@/services/social.service";
import { getMyFollowing, followToggle } from "@/services/follow.service";
import { authService } from "@/services/auth.service";
import { bookingService, turfService } from "@/services/turf.service";
import EmojiPicker from "@/components/common/EmojiPicker";
import PostDetailModal from "@/components/common/PostDetailModal";
import EditGroupModal from "@/components/chat/EditGroupModal";
import AddMemberModal from "@/components/chat/AddMemberModal";
import DeleteMessageModal from "@/components/common/DeleteMessageModal";
import { generateAndDownloadMatchPass } from "@/utils/passGenerator.utils";
import { getAvatarUrl, getCoverUrl } from "@/utils/avatar.utils";
import { optimizeGroupIcon, optimizeCloudinaryPostImage } from "@/utils/cloudinary.utils";
import toast from "react-hot-toast";

// Helper: Extract cover image: if thumbnail exists use it, otherwise use first image in post
const getSharedPostCover = (post) => {
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
  if (post.photo?.url && typeof post.photo.url === "string") return post.photo.url.trim();
  if (typeof post.image === "string" && post.image.trim()) return post.image.trim();
  if (post.image?.url && typeof post.image.url === "string") return post.image.url.trim();
  if (typeof post.video === "string" && post.video.trim()) return post.video.trim();
  if (post.video?.url && typeof post.video.url === "string") return post.video.url.trim();

  return null;
};

// Helper: Format relative timestamp (Latest to Oldest)
const formatRecentTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const now = new Date();
  const diffInSec = Math.floor((now - date) / 1000);

  if (diffInSec < 60) return "Just now";
  if (diffInSec < 3600) return `${Math.floor(diffInSec / 60)}m ago`;
  if (diffInSec < 86400) return `${Math.floor(diffInSec / 3600)}h ago`;
  if (diffInSec < 172800) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

export default function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, status } = useSelector((state) => state.auth);
  const locationState = useSelector((state) => state.location);
  const [searchParams] = useSearchParams();
  const targetUserIdFromUrl = searchParams.get("userId");

  // View Mode: "primary" | "following" | "requests" | "turfs" | "squads" | "nearby" | "discover"
  const [viewMode, setViewMode] = useState("primary");

  // More Dropdown State
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Followed Players
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loadingFollowing, setLoadingFollowing] = useState(true);

  // Booked Turf Owners
  const [bookedTurfOwners, setBookedTurfOwners] = useState([]);
  const [loadingTurfOwners, setLoadingTurfOwners] = useState(false);

  // Nearby Players
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);

  // Discover / Random Players
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [loadingDiscover, setLoadingDiscover] = useState(false);

  // All Users Pool for Online Section
  const [allSystemUsers, setAllSystemUsers] = useState([]);
  const [loadingOnlineUsers, setLoadingOnlineUsers] = useState(false);

  // Chats & Active Conversation
  const [allChats, setAllChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchChat, setSearchChat] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [showMembersPanel, setShowMembersPanel] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedSharedPost, setSelectedSharedPost] = useState(null);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openingDirectChat, setOpeningDirectChat] = useState(false);

  // All turfs cache for resolving direct turf detail page links
  const [allTurfsList, setAllTurfsList] = useState([]);

  useEffect(() => {
    turfService
      .getNearbyTurfs()
      .then((res) => {
        if (Array.isArray(res?.data)) {
          setAllTurfsList(res.data);
        }
      })
      .catch(() => { });
  }, []);

  const getTurfDetailPageUrl = (msg) => {
    if (!msg) return "/find-turfs";
    if (msg.matchPass?.turfId) return `/turf/${msg.matchPass.turfId}`;
    if (msg.matchPass?.turf?._id) return `/turf/${msg.matchPass.turf._id}`;
    if (msg.matchPass?.turf && typeof msg.matchPass.turf === "string") return `/turf/${msg.matchPass.turf}`;

    // Resolve by turf name from matchPass or parsed from message text
    const turfName =
      msg.matchPass?.turfName ||
      msg.message?.match(/Venue:\s*([^\n]+)/i)?.[1]?.trim() ||
      "";

    if (turfName && allTurfsList.length > 0) {
      const match = allTurfsList.find(
        (t) => t.name?.toLowerCase().trim() === turfName.toLowerCase().trim()
      );
      if (match?._id) return `/turf/${match._id}`;

      const partialMatch = allTurfsList.find(
        (t) =>
          t.name?.toLowerCase().includes(turfName.toLowerCase()) ||
          turfName.toLowerCase().includes(t.name?.toLowerCase())
      );
      if (partialMatch?._id) return `/turf/${partialMatch._id}`;
    }

    return "/find-turfs";
  };

  // Real-time Online Users State
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());

  useEffect(() => {
    const handleOnlineUsers = (userIds) => {
      if (Array.isArray(userIds)) {
        setOnlineUserIds(new Set(userIds.map((id) => id?.toString())));
      }
    };

    const handleUserStatusChange = ({ userId, isOnline, lastSeen }) => {
      if (!userId) return;
      setAllChats((prev) =>
        prev.map((c) => {
          if (!c.participants) return c;
          const updatedParticipants = c.participants.map((p) => {
            if ((p._id || p)?.toString() === userId.toString()) {
              return { ...p, lastSeen: lastSeen || new Date(), isOnline };
            }
            return p;
          });
          return { ...c, participants: updatedParticipants };
        })
      );

      setActiveChat((prev) => {
        if (!prev || !prev.participants) return prev;
        const updatedParticipants = prev.participants.map((p) => {
          if ((p._id || p)?.toString() === userId.toString()) {
            return { ...p, lastSeen: lastSeen || new Date(), isOnline };
          }
          return p;
        });
        return { ...prev, participants: updatedParticipants };
      });
    };

    socket.on("get-online-users", handleOnlineUsers);
    socket.on("user-status-change", handleUserStatusChange);
    socket.emit("get-online-users-req");

    return () => {
      socket.off("get-online-users", handleOnlineUsers);
      socket.off("user-status-change", handleUserStatusChange);
    };
  }, []);

  // Track viewed turf owner passes so the "1" badge disappears after clicking view ticket
  const [viewedTurfOwnerIds, setViewedTurfOwnerIds] = useState(() => {
    try {
      const saved = localStorage.getItem("viewed_turf_owner_passes");
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  const markTurfPassAsViewed = (ownerId) => {
    if (!ownerId) return;
    setViewedTurfOwnerIds((prev) => {
      const updated = new Set([...prev, ownerId.toString()]);
      try {
        localStorage.setItem(
          "viewed_turf_owner_passes",
          JSON.stringify([...updated])
        );
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const formatLastSeen = (dateInput) => {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Last seen just now";
    if (diffMins < 60) return `Last seen ${diffMins}m ago`;
    if (diffHours < 24 && now.getDate() === date.getDate()) {
      return `Last seen today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diffDays === 1 || (diffHours < 48 && now.getDate() - date.getDate() === 1)) {
      return `Last seen yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diffDays < 7) {
      return `Last seen ${diffDays}d ago`;
    }
    return `Last seen ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  };

  const getUserOnlineState = (user) => {
    if (!user || !user._id) return { isVisible: false, isOnline: false, statusText: null };
    const uId = user._id.toString();

    // If user explicitly configured privacy to hide online/offline status, NEVER show!
    const isStatusHidden =
      user.showOnlineStatus === false ||
      user.privacy?.showOnlineStatus === false;

    if (isStatusHidden) {
      return { isVisible: false, isOnline: false, statusText: null };
    }

    const isOnline = onlineUserIds.has(uId);
    if (isOnline) {
      return { isVisible: true, isOnline: true, statusText: "Online" };
    }

    // When offline, check if lastSeen is allowed to be shown
    const isLastSeenHidden = user.privacy?.showLastSeen === false;
    if (!isLastSeenHidden && user.lastSeen) {
      const formatted = formatLastSeen(user.lastSeen);
      return {
        isVisible: true,
        isOnline: false,
        statusText: formatted || "Offline",
      };
    }

    return { isVisible: true, isOnline: false, statusText: "Offline" };
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesContainerRef.current) {
      if (behavior === "auto") {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      } else {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }
  };

  // 1. Load Followed Users & All User Chats (Sorted latest to oldest)
  useEffect(() => {
    const loadInitialData = async () => {
      if (!status || !userData) {
        setLoading(false);
        setLoadingFollowing(false);
        return;
      }
      setLoading(true);
      setLoadingFollowing(true);

      try {
        // Fetch followed users
        const followingRes = await getMyFollowing();
        const followingData = followingRes?.data || [];
        const extractedUsers = (Array.isArray(followingData) ? followingData : [])
          .map((item) => item.following || item)
          .filter((u) => u && u._id);

        setFollowingUsers(extractedUsers);

        // Fetch all chats (1-on-1 and groups)
        const chatsRes = await chatService.getAllUserChats();
        const chatsData = chatsRes?.data || [];
        const formattedChats = (Array.isArray(chatsData) ? chatsData : []).sort((a, b) => {
          const timeA = new Date(a.lastMessage?.createdAt || a.updatedAt || a.createdAt || 0).getTime();
          const timeB = new Date(b.lastMessage?.createdAt || b.updatedAt || b.createdAt || 0).getTime();
          return timeB - timeA;
        });

        setAllChats(formattedChats);

        // Fetch all users in background for Online list counter
        authService
          .getAllUsers()
          .then((res) => {
            const data = res?.data || [];
            setAllSystemUsers(Array.isArray(data) ? data : []);
          })
          .catch(() => { });

        // Check for returned chat ID from post close (via location.state) or target user from url
        const returnChatId = location.state?.returnChatId;
        const returnViewMode = location.state?.returnViewMode;
        const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

        // Clean up any stale sessionStorage items
        sessionStorage.removeItem("messages_return_chat_id");
        sessionStorage.removeItem("messages_return_view_mode");

        if (returnViewMode) {
          setViewMode(returnViewMode);
        }

        if (targetUserIdFromUrl) {
          handleOpenDirectChat(targetUserIdFromUrl);
        } else if (returnChatId && formattedChats.length > 0) {
          const matchedChat = formattedChats.find(
            (c) => c._id?.toString() === returnChatId.toString()
          );
          if (matchedChat) {
            setActiveChat(matchedChat);
          } else if (isDesktop) {
            setActiveChat(formattedChats[0]);
          } else {
            setActiveChat(null);
          }
        } else if (isDesktop && formattedChats.length > 0) {
          // On desktop (>= 768px), default to first direct chat
          const firstDirect = formattedChats.find((c) => !c.isGroupChat);
          setActiveChat(firstDirect || formattedChats[0] || null);
        } else {
          // On mobile (< 768px), show the chat list by default
          setActiveChat(null);
        }
      } catch (err) {
        console.log("Error loading chats or following list:", err);
      } finally {
        setLoading(false);
        setLoadingFollowing(false);
      }
    };

    loadInitialData();
  }, [status, userData?._id, targetUserIdFromUrl]);

  // 2. Load Booked Turf Owners
  const loadBookedTurfOwners = async () => {
    setLoadingTurfOwners(true);
    try {
      const res = await bookingService.getMyBookings();
      const bookings = res?.data || [];
      if (Array.isArray(bookings)) {
        const ownerMap = new Map();
        bookings.forEach((b) => {
          const turf = b.turf;
          const owner = turf?.owner;
          if (owner && (owner._id || owner.username) && String(owner._id) !== String(userData?._id)) {
            const ownerId = String(owner._id || owner.username);
            const bookingItem = {
              turfName: turf.name || "Turf Ground",
              bookingDate: b.date,
              status: b.status,
              slots: b.slots,
              bookingId: b._id,
            };

            if (!ownerMap.has(ownerId)) {
              ownerMap.set(ownerId, {
                ...owner,
                turfs: [bookingItem],
                latestBookingDate: b.date || b.createdAt,
              });
            } else {
              const existing = ownerMap.get(ownerId);
              existing.turfs.push(bookingItem);
              if (new Date(b.date || b.createdAt) > new Date(existing.latestBookingDate)) {
                existing.latestBookingDate = b.date || b.createdAt;
              }
            }
          }
        });

        const ownersList = Array.from(ownerMap.values()).sort(
          (a, b) => new Date(b.latestBookingDate).getTime() - new Date(a.latestBookingDate).getTime()
        );
        setBookedTurfOwners(ownersList);
      }
    } catch (err) {
      console.log("Error loading booked turf owners:", err);
    } finally {
      setLoadingTurfOwners(false);
    }
  };

  useEffect(() => {
    if (status && userData) {
      loadBookedTurfOwners();
    }
  }, [status, userData?._id]);

  // 3. Load Nearby Players
  const loadNearbyPlayers = async () => {
    setLoadingNearby(true);
    try {
      const lat = locationState?.latitude || userData?.location?.lat;
      const lon = locationState?.longitude || userData?.location?.lon;
      const res = await authService.getNearbyUsers({ lat, lon });
      const data = res?.data || [];
      setNearbyUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Nearby players error:", err);
    } finally {
      setLoadingNearby(false);
    }
  };

  // 4. Load Discover / Random Players
  const loadDiscoverPlayers = async () => {
    setLoadingDiscover(true);
    try {
      const res = await authService.getDiscoverUsers();
      const data = res?.data || [];
      setDiscoverUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Discover players error:", err);
    } finally {
      setLoadingDiscover(false);
    }
  };

  // 4b. Load All System Players for Online Users list
  const loadOnlineUsersList = async () => {
    setLoadingOnlineUsers(true);
    try {
      const res = await authService.getAllUsers();
      const data = res?.data || [];
      setAllSystemUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Online players list error:", err);
    } finally {
      setLoadingOnlineUsers(false);
    }
  };

  useEffect(() => {
    if (!status || !userData) return;
    if (viewMode === "nearby" && nearbyUsers.length === 0) {
      loadNearbyPlayers();
    } else if (viewMode === "discover" && discoverUsers.length === 0) {
      loadDiscoverPlayers();
    } else if (viewMode === "turfs" && bookedTurfOwners.length === 0) {
      loadBookedTurfOwners();
    } else if (viewMode === "online" && allSystemUsers.length === 0) {
      loadOnlineUsersList();
    }
  }, [viewMode, status, userData]);

  // 5. Open or Create 1-on-1 Direct Chat with Target User
  const handleOpenDirectChat = async (targetUserId) => {
    if (!targetUserId || !status || !userData) return;
    setOpeningDirectChat(true);
    try {
      const res = await chatService.getOrCreateChat(targetUserId);
      const chat = res?.data;
      if (chat && chat._id) {
        setActiveChat(chat);

        // Update allChats cache and sort latest to oldest
        setAllChats((prev) => {
          const exists = prev.some((c) => c._id === chat._id);
          const updated = exists ? prev.map((c) => (c._id === chat._id ? chat : c)) : [chat, ...prev];
          return [...updated].sort((a, b) => {
            const timeA = new Date(a.lastMessage?.createdAt || a.updatedAt || a.createdAt || 0).getTime();
            const timeB = new Date(b.lastMessage?.createdAt || b.updatedAt || b.createdAt || 0).getTime();
            return timeB - timeA;
          });
        });
      }
    } catch (err) {
      console.log("Error opening direct chat:", err);
      toast.error(err?.response?.data?.message || "Failed to open direct conversation.");
    } finally {
      setOpeningDirectChat(false);
    }
  };

  // 6. Follow player from inside chat
  const handleToggleFollowFromChat = async (targetUsername) => {
    if (!targetUsername || !status || !userData) return;
    try {
      await followToggle(targetUsername);
      toast.success(`You are now following @${targetUsername}!`);
      // Refresh following list
      const followingRes = await getMyFollowing();
      const followingData = followingRes?.data || [];
      const extractedUsers = (Array.isArray(followingData) ? followingData : [])
        .map((item) => item.following || item)
        .filter((u) => u && u._id);
      setFollowingUsers(extractedUsers);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to follow player.");
    }
  };

  // 7. Load Messages for Active Chat with Pagination
  const [messagesPage, setMessagesPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!status || !userData || !activeChat?._id) return;
      setMessagesPage(1);
      setEditingMessage(null);
      try {
        const res = await chatService.getAllMessages(activeChat._id, 1, 30);
        const data = res?.data;
        const docs = data?.docs || (Array.isArray(data) ? data : []);
        setMessages(docs);
        setHasMoreMessages(Boolean(data?.hasNextPage));

        // Mark incoming messages as seen immediately
        if (socket.connected) {
          socket.emit("mark-seen", { chatId: activeChat._id });
        }
        chatService.markMessagesAsSeen(activeChat._id).catch(() => { });

        // Smooth scroll to bottom upon initial chat switch OR restore exact scroll level when returning from post
        const savedScrollTop =
          sessionStorage.getItem("messages_return_scroll_top") ||
          (location.state?.returnScrollTop !== undefined && location.state?.returnScrollTop !== null
            ? String(location.state.returnScrollTop)
            : null);

        setTimeout(() => {
          if (messagesContainerRef.current) {
            if (savedScrollTop !== null && savedScrollTop !== undefined && !isNaN(Number(savedScrollTop))) {
              messagesContainerRef.current.scrollTop = Number(savedScrollTop);
              sessionStorage.removeItem("messages_return_scroll_top");
            } else {
              messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            }
          }
        }, 70);
      } catch (err) {
        console.log("Messages load error:", err);
      }
    };
    loadInitialMessages();
  }, [activeChat?._id, status, userData?._id]);

  const handleLoadOlderMessages = async () => {
    if (loadingOlderMessages || !hasMoreMessages || !activeChat?._id) return;

    const nextPage = messagesPage + 1;
    setLoadingOlderMessages(true);

    const container = messagesContainerRef.current;
    const previousScrollHeight = container ? container.scrollHeight : 0;
    const previousScrollTop = container ? container.scrollTop : 0;

    try {
      const res = await chatService.getAllMessages(activeChat._id, nextPage, 30);
      const data = res?.data;
      const olderDocs = data?.docs || (Array.isArray(data) ? data : []);
      const hasNext = Boolean(data?.hasNextPage);

      setMessagesPage(nextPage);
      setHasMoreMessages(hasNext);

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m._id?.toString()));
        const uniqueOlder = olderDocs.filter((m) => !existingIds.has(m._id?.toString()));
        return [...uniqueOlder, ...prev];
      });

      // Preserve scroll position so conversation doesn't jerk
      setTimeout(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
        }
      }, 30);
    } catch (err) {
      console.log("Error loading older messages:", err);
      toast.error("Failed to load older messages.");
    } finally {
      setLoadingOlderMessages(false);
    }
  };

  // 8. Socket listener for real-time messaging, editing, and read receipts
  useEffect(() => {
    if (!status || !userData) return;
    if (!socket.connected) {
      socket.connect();
    }

    const handleReceiveMessage = (newMsg) => {
      const msgChatId = newMsg.chat?._id || newMsg.chat || newMsg.chatId;
      const currentChatId = activeChat?._id;

      if (msgChatId?.toString() === currentChatId?.toString()) {
        // If we are actively in this chat, mark incoming message as seen immediately
        const senderId = newMsg.sender?._id || newMsg.sender;
        const isFromMe = senderId?.toString() === userData?._id?.toString();
        if (!isFromMe) {
          socket.emit("mark-seen", { chatId: currentChatId });
          chatService.markMessagesAsSeen(currentChatId).catch(() => { });
        }

        const container = messagesContainerRef.current;
        const isNearBottom = container
          ? container.scrollHeight - container.scrollTop - container.clientHeight < 180
          : true;

        setMessages((prev) => {
          if (prev.some((m) => m._id === newMsg._id)) return prev;

          const myId = userData?._id;

          if (senderId && myId && senderId.toString() === myId.toString()) {
            const tempIdx = prev.findIndex(
              (m) =>
                String(m._id).startsWith("temp_") &&
                m.message?.trim() === newMsg.message?.trim()
            );
            if (tempIdx !== -1) {
              const updated = [...prev];
              updated[tempIdx] = newMsg;
              return updated;
            }
          }

          return [...prev, newMsg];
        });

        // Only auto-scroll down if user was already at/near the bottom or if it's user's own sent message
        if (isNearBottom || isFromMe) {
          setTimeout(() => {
            if (messagesContainerRef.current) {
              messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            }
          }, 30);
        }
      }

      // Update last message in allChats list and bump to top (latest to oldest)
      setAllChats((prev) => {
        const updated = prev.map((c) => {
          if (c._id?.toString() === msgChatId?.toString()) {
            return {
              ...c,
              lastMessage: newMsg,
              updatedAt: newMsg.createdAt || new Date().toISOString(),
            };
          }
          return c;
        });

        return [...updated].sort((a, b) => {
          const timeA = new Date(a.lastMessage?.createdAt || a.updatedAt || a.createdAt || 0).getTime();
          const timeB = new Date(b.lastMessage?.createdAt || b.updatedAt || b.createdAt || 0).getTime();
          return timeB - timeA;
        });
      });
    };

    const handleMessageEdited = (editedMsg) => {
      const { _id, chatId, message, isEdited, updatedAt } = editedMsg;
      if (chatId?.toString() === activeChat?._id?.toString()) {
        const container = messagesContainerRef.current;
        const currentScrollTop = container ? container.scrollTop : 0;
        setMessages((prev) =>
          prev.map((m) =>
            m._id?.toString() === _id?.toString()
              ? { ...m, message, isEdited: true, updatedAt: updatedAt || new Date().toISOString() }
              : m
          )
        );
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = currentScrollTop;
          }
        }, 0);
      }
      setAllChats((prev) =>
        prev.map((c) => {
          if (c._id?.toString() === chatId?.toString() && c.lastMessage?._id?.toString() === _id?.toString()) {
            return {
              ...c,
              lastMessage: { ...c.lastMessage, message, isEdited: true },
            };
          }
          return c;
        })
      );
    };

    const handleMessagesSeen = ({ chatId }) => {
      if (chatId?.toString() === activeChat?._id?.toString()) {
        setMessages((prev) =>
          prev.map((m) => {
            const sId = m.sender?._id || m.sender;
            if (sId?.toString() === userData?._id?.toString()) {
              return { ...m, isRead: true };
            }
            return m;
          })
        );
      }
    };

    const handleMessagesDeleted = ({ chatId, deletedIds }) => {
      if (chatId?.toString() === activeChat?._id?.toString() && Array.isArray(deletedIds)) {
        const deletedSet = new Set(deletedIds.map((id) => id?.toString()));
        const container = messagesContainerRef.current;
        const currentScrollTop = container ? container.scrollTop : 0;
        setMessages((prev) => prev.filter((m) => !deletedSet.has(m._id?.toString())));
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = currentScrollTop;
          }
        }, 0);
      }
    };

    const handleGroupUpdated = (updatedChat) => {
      if (!updatedChat?._id) return;
      setAllChats((prev) =>
        prev.map((c) => (c._id?.toString() === updatedChat._id?.toString() ? { ...c, ...updatedChat } : c))
      );
      setActiveChat((prev) =>
        prev?._id?.toString() === updatedChat._id?.toString() ? { ...prev, ...updatedChat } : prev
      );
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("message-edited", handleMessageEdited);
    socket.on("messages-seen", handleMessagesSeen);
    socket.on("messages-deleted", handleMessagesDeleted);
    socket.on("group-updated", handleGroupUpdated);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("message-edited", handleMessageEdited);
      socket.off("messages-seen", handleMessagesSeen);
      socket.off("messages-deleted", handleMessagesDeleted);
      socket.off("group-updated", handleGroupUpdated);
    };
  }, [activeChat?._id, userData?._id]);

  const handleGroupUpdatedSuccess = (updatedChat) => {
    if (!updatedChat?._id) return;
    setAllChats((prev) =>
      prev.map((c) => (c._id?.toString() === updatedChat._id?.toString() ? { ...c, ...updatedChat } : c))
    );
    setActiveChat((prev) =>
      prev?._id?.toString() === updatedChat._id?.toString() ? { ...prev, ...updatedChat } : prev
    );
  };

  // 9. Cascading Replies Count Memo & Delete Confirmation
  const repliesToDeleteCount = useMemo(() => {
    if (!messageToDelete) return 0;
    const targetId = messageToDelete._id?.toString();
    const toDeleteSet = new Set([targetId]);
    let queue = [targetId];

    while (queue.length > 0) {
      const parent = queue.shift();
      messages.forEach((m) => {
        const replyParentId = m.replyTo?.messageId?.toString() || m.replyTo?._id?.toString();
        if (replyParentId === parent && !toDeleteSet.has(m._id?.toString())) {
          toDeleteSet.add(m._id?.toString());
          queue.push(m._id?.toString());
        }
      });
    }
    return toDeleteSet.size - 1;
  }, [messageToDelete, messages]);

  const confirmDeleteMessage = async () => {
    if (!messageToDelete?._id || !activeChat?._id) return;
    setIsDeletingMessage(true);
    await handleDeleteMessage(messageToDelete);
    setIsDeletingMessage(false);
    setMessageToDelete(null);
  };

  // 10. Delete Message (with cascading deletion of all replies)
  const handleDeleteMessage = async (msg) => {
    if (!msg?._id || !activeChat?._id) return;

    const targetId = msg._id.toString();
    const container = messagesContainerRef.current;
    const currentScrollTop = container ? container.scrollTop : 0;

    // Cascading delete: find all messages in local state replying to targetId recursively
    const toDeleteSet = new Set([targetId]);
    let queue = [targetId];

    while (queue.length > 0) {
      const parent = queue.shift();
      messages.forEach((m) => {
        const replyParentId = m.replyTo?.messageId?.toString() || m.replyTo?._id?.toString();
        if (replyParentId === parent && !toDeleteSet.has(m._id?.toString())) {
          toDeleteSet.add(m._id?.toString());
          queue.push(m._id?.toString());
        }
      });
    }

    // Optimistically remove all deleted messages
    setMessages((prev) => prev.filter((m) => !toDeleteSet.has(m._id?.toString())));

    // Restore exact scroll position
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = currentScrollTop;
      }
    }, 0);

    if (editingMessage && toDeleteSet.has(editingMessage._id?.toString())) {
      setEditingMessage(null);
      setMessageInput("");
    }
    if (replyingToMessage && toDeleteSet.has(replyingToMessage._id?.toString())) {
      setReplyingToMessage(null);
    }

    if (socket.connected) {
      socket.emit("delete-message", {
        messageId: msg._id,
        chatId: activeChat._id,
      });
    }

    try {
      await chatService.deleteMessage(msg._id);
      toast.success(
        toDeleteSet.size > 1
          ? `Deleted message and ${toDeleteSet.size - 1} ${toDeleteSet.size === 2 ? "reply" : "replies"}.`
          : "Message deleted."
      );
    } catch (err) {
      console.log("Delete message error:", err);
      toast.error("Failed to delete message.");
    }
  };

  // 11. Send or Edit Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const content = messageInput.trim();
    if (!content || !activeChat?._id) return;

    // Handle Edit Mode
    if (editingMessage) {
      const msgId = editingMessage._id;
      setMessages((prev) =>
        prev.map((m) =>
          m._id === msgId ? { ...m, message: content, isEdited: true } : m
        )
      );

      setEditingMessage(null);
      setMessageInput("");
      setIsEmojiPickerOpen(false);

      if (socket.connected) {
        socket.emit("edit-message", {
          messageId: msgId,
          chatId: activeChat._id,
          newContent: content,
        });
      }

      try {
        await chatService.editMessage(msgId, content);
        toast.success("Message edited!");
      } catch (err) {
        console.log("Edit message error:", err);
      }
      return;
    }

    const payload = {
      chatId: activeChat._id,
      message: content,
      attachment: "text",
    };

    let replySnippet = null;
    if (replyingToMessage) {
      replySnippet = {
        messageId: replyingToMessage._id,
        senderName: replyingToMessage.sender?.fullName || replyingToMessage.sender?.username || "Player",
        username: replyingToMessage.sender?.username || "player",
        messageText: replyingToMessage.message || "Shared attachment",
      };
      payload.replyTo = replySnippet;
    }

    const tempId = `temp_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const optimistic = {
      _id: tempId,
      sender: {
        _id: userData?._id,
        username: userData?.username || "you",
        fullName: userData?.fullName || "You",
        avatar: userData?.avatar,
      },
      message: content,
      chat: activeChat._id,
      replyTo: replySnippet,
      createdAt: nowIso,
      isRead: false,
      isEdited: false,
    };

    setMessages((prev) => [...prev, optimistic]);
    setMessageInput("");
    setReplyingToMessage(null);
    setIsEmojiPickerOpen(false);

    // Smooth scroll to bottom on own message
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 20);

    // Re-sort chats list immediately on sending
    setAllChats((prev) => {
      const updated = prev.map((c) => {
        if (c._id?.toString() === activeChat._id?.toString()) {
          return {
            ...c,
            lastMessage: optimistic,
            updatedAt: nowIso,
          };
        }
        return c;
      });

      return [...updated].sort((a, b) => {
        const timeA = new Date(a.lastMessage?.createdAt || a.updatedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.lastMessage?.createdAt || b.updatedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
    });

    try {
      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("send-message", payload);
    } catch (err) {
      console.log("Socket send error:", err);
    }
  };

  // 10. Create Squad Group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      const res = await chatService.createGroupChat(groupName.trim(), []);
      if (res?.data) {
        setAllChats([res.data, ...allChats]);
        setActiveChat(res.data);
        setViewMode("squads");
      }
      setIsGroupModalOpen(false);
      setGroupName("");
      toast.success(`Squad Group "${groupName}" created!`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create squad chat.");
    }
  };

  // Download match pass voucher directly from chat announcement message
  const handleDownloadPassFromMessage = (msg) => {
    try {
      const pass = msg.matchPass || {};

      let turfName = pass.turfName;
      let turfAddress = pass.turfAddress;
      let date = pass.date;
      let slots = pass.slots;
      let bookingId = pass.bookingId;

      if (!turfName && msg.message) {
        const venueMatch = msg.message.match(/Venue:\s*([^\n\r]+)/i);
        if (venueMatch) turfName = venueMatch[1].trim();

        const locMatch = msg.message.match(/Location:\s*([^\n\r]+)/i);
        if (locMatch) turfAddress = locMatch[1].trim();

        const dateMatch = msg.message.match(/Date:\s*([^\n\r]+)/i);
        if (dateMatch) date = dateMatch[1].trim();

        const slotsMatch = msg.message.match(/Time Slots:\s*([^\n\r]+)/i);
        if (slotsMatch) slots = slotsMatch[1].trim();
      }

      generateAndDownloadMatchPass({
        bookingId: bookingId || msg._id || "MATCH-PASS",
        turfName: turfName || "Football Turf Ground",
        turfAddress: turfAddress || "Bengaluru Pitch",
        date: date || new Date(),
        slots: slots || "Reserved Slot",
        expiresAt: pass.expiresAt,
        bookerName: activeChat?.groupName || userData?.fullName || "Squad Team",
        status: "CONFIRMED & ACTIVE",
      });

      toast.success("Match Pass voucher downloaded from squad chat! 🎟️⚽");
    } catch (err) {
      console.error("Match pass download error:", err);
      toast.error("Failed to download match pass.");
    }
  };

  const groupChats = allChats.filter((c) => c.isGroupChat);

  // Helper: Find other participant in 1-on-1 chat
  const getOtherParticipant = (chat) => {
    if (!chat || chat.isGroupChat || !Array.isArray(chat.participants)) return null;
    return chat.participants.find(
      (p) => (p._id || p)?.toString() !== userData?._id?.toString()
    );
  };

  const activeOtherUser = getOtherParticipant(activeChat);
  const participantsList = Array.isArray(activeChat?.participants) ? activeChat.participants : [];

  // Check if active other user is an owner of a booked turf
  const bookedTurfOwnerInfo = activeOtherUser
    ? bookedTurfOwners.find(
      (o) =>
        o._id?.toString() === activeOtherUser._id?.toString() ||
        (o.username && activeOtherUser.username && o.username.toLowerCase() === activeOtherUser.username.toLowerCase())
    )
    : null;

  // Check if active 1-on-1 partner is followed by logged in user
  const isOtherUserFollowed = activeOtherUser
    ? followingUsers.some(
      (f) =>
        f._id?.toString() === activeOtherUser._id?.toString() ||
        (f.username &&
          activeOtherUser.username &&
          f.username.toLowerCase() === activeOtherUser.username.toLowerCase())
    )
    : false;

  // Helper: Find existing 1-on-1 chat with a user
  const getChatWithUser = (userId) => {
    if (!userId) return null;
    return allChats.find(
      (c) =>
        !c.isGroupChat &&
        Array.isArray(c.participants) &&
        c.participants.some((p) => (p._id || p)?.toString() === userId.toString())
    );
  };

  // Helper: Check if a user is an owner of a turf booked by the logged in user
  const isBookedTurfOwner = (user) => {
    if (!user) return false;
    const uId = (user._id || user)?.toString();
    const uName = user.username?.toLowerCase();

    return bookedTurfOwners.some((o) => {
      const oId = (o._id || o)?.toString();
      const oName = o.username?.toLowerCase();
      return (uId && oId && uId === oId) || (uName && oName && uName === oName);
    });
  };

  // 1-on-1 Direct chats from people you DO NOT follow (Message Requests)
  // Excludes turf owners from bookings — they belong strictly in the Turfs section!
  const nonFollowedChats = allChats.filter((c) => {
    if (c.isGroupChat) return false;
    const other = getOtherParticipant(c);
    if (!other) return false;

    // Check if user is followed
    const isFollowed = followingUsers.some(
      (f) =>
        f._id?.toString() === other._id?.toString() ||
        (f.username && other.username && f.username.toLowerCase() === other.username.toLowerCase())
    );
    if (isFollowed) return false;

    // Check if user is a booked turf owner -> strictly goes to Turfs tab, NEVER Requests tab
    if (isBookedTurfOwner(other)) return false;

    return true;
  });

  // Unified Primary List: Recent chats by default, and comprehensive search across all recent messages, followed footballers, and squad groups
  const filteredPrimaryList = useMemo(() => {
    const q = searchChat.toLowerCase().trim();

    // Default (no search query): All existing chats sorted latest to oldest
    if (!q) {
      return [...allChats]
        .map((chat) => ({ type: "chat", data: chat }))
        .sort((a, b) => {
          const timeA = new Date(a.data.lastMessage?.createdAt || a.data.updatedAt || a.data.createdAt || 0).getTime();
          const timeB = new Date(b.data.lastMessage?.createdAt || b.data.updatedAt || b.data.createdAt || 0).getTime();
          return timeB - timeA;
        });
    }

    const results = [];
    const matchedUserIds = new Set();
    const matchedChatIds = new Set();

    // 1. Search existing chats (Group chats & 1-on-1 direct conversations)
    allChats.forEach((chat) => {
      if (!chat) return;
      if (chat.isGroupChat) {
        if (
          chat.groupName?.toLowerCase().includes(q) ||
          chat.lastMessage?.message?.toLowerCase().includes(q)
        ) {
          results.push({
            type: "chat",
            data: chat,
            timestamp: new Date(chat.lastMessage?.createdAt || chat.updatedAt || 0).getTime(),
          });
          matchedChatIds.add(chat._id?.toString());
        }
      } else {
        const other = getOtherParticipant(chat);
        const otherId = (other?._id || other)?.toString();
        if (
          other?.fullName?.toLowerCase().includes(q) ||
          other?.username?.toLowerCase().includes(q) ||
          chat.lastMessage?.message?.toLowerCase().includes(q)
        ) {
          results.push({
            type: "chat",
            data: chat,
            timestamp: new Date(chat.lastMessage?.createdAt || chat.updatedAt || 0).getTime(),
          });
          matchedChatIds.add(chat._id?.toString());
          if (otherId) matchedUserIds.add(otherId);
        }
      }
    });

    // 2. Search followed footballers (everyone I follow, even if conversation hasn't started yet)
    followingUsers.forEach((user) => {
      if (!user?._id) return;
      const uId = user._id.toString();
      if (matchedUserIds.has(uId)) return; // Already included via chat match

      if (
        user.fullName?.toLowerCase().includes(q) ||
        user.username?.toLowerCase().includes(q)
      ) {
        const existingChat = getChatWithUser(user._id);
        if (existingChat && !matchedChatIds.has(existingChat._id?.toString())) {
          results.push({
            type: "chat",
            data: existingChat,
            timestamp: new Date(existingChat.lastMessage?.createdAt || existingChat.updatedAt || 0).getTime(),
          });
          matchedChatIds.add(existingChat._id?.toString());
        } else if (!existingChat) {
          results.push({
            type: "user",
            data: user,
            timestamp: 0,
          });
        }
        matchedUserIds.add(uId);
      }
    });

    // Sort: Active conversations by latest activity first, followed by new contacts
    return results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [allChats, followingUsers, searchChat]);

  // Filtered direct followed users — Sorted Latest Message to Oldest!
  const filteredFollowing = [...followingUsers]
    .filter((u) => {
      const q = searchChat.toLowerCase();
      return u.fullName?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const chatA = getChatWithUser(a._id);
      const chatB = getChatWithUser(b._id);
      const timeA = new Date(chatA?.lastMessage?.createdAt || chatA?.updatedAt || 0).getTime();
      const timeB = new Date(chatB?.lastMessage?.createdAt || chatB?.updatedAt || 0).getTime();
      return timeB - timeA;
    });

  // Filtered booked turf owners — Sorted Latest to Oldest!
  const filteredTurfOwners = [...bookedTurfOwners]
    .filter((o) => {
      const q = searchChat.toLowerCase();
      return (
        o.fullName?.toLowerCase().includes(q) ||
        o.username?.toLowerCase().includes(q) ||
        o.turfs?.some((t) => t.turfName?.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      const chatA = getChatWithUser(a._id);
      const chatB = getChatWithUser(b._id);
      const timeA = new Date(chatA?.lastMessage?.createdAt || chatA?.updatedAt || a.latestBookingDate || 0).getTime();
      const timeB = new Date(chatB?.lastMessage?.createdAt || chatB?.updatedAt || b.latestBookingDate || 0).getTime();
      return timeB - timeA;
    });

  // Filtered non-followed chats (Requests) — Sorted Latest to Oldest!
  const filteredRequests = [...nonFollowedChats]
    .filter((c) => {
      const other = getOtherParticipant(c);
      const q = searchChat.toLowerCase();
      return (
        other?.fullName?.toLowerCase().includes(q) ||
        other?.username?.toLowerCase().includes(q) ||
        c.lastMessage?.message?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const timeA = new Date(a.lastMessage?.createdAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.lastMessage?.createdAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    });

  // Filtered nearby users
  const filteredNearby = nearbyUsers.filter((u) => {
    const q = searchChat.toLowerCase();
    return u.fullName?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q);
  });

  // Collect all user IDs who you have ever texted or shared a group chat with
  const excludedDiscoverUserIds = new Set();
  if (userData?._id) {
    excludedDiscoverUserIds.add(userData._id.toString());
  }

  allChats.forEach((c) => {
    if (Array.isArray(c.participants)) {
      c.participants.forEach((p) => {
        const pId = (p._id || p)?.toString();
        if (pId) {
          excludedDiscoverUserIds.add(pId);
        }
      });
    }
  });

  // Filtered discover users: strictly brand new footballers never texted and not in any group chat
  const filteredDiscover = discoverUsers.filter((u) => {
    const uId = u._id?.toString();
    if (uId && excludedDiscoverUserIds.has(uId)) return false;
    const q = searchChat.toLowerCase();
    return u.fullName?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q);
  });

  // Filtered Online Users Pool:
  // Top: People I follow who are online
  // Bottom: People I do NOT follow who are online
  const chatParticipants = allChats
    .flatMap((c) => (Array.isArray(c.participants) ? c.participants : []))
    .filter((p) => p && (p._id || p)?.toString() !== userData?._id?.toString());

  const userPoolMap = new Map();
  [...followingUsers, ...allSystemUsers, ...discoverUsers, ...nearbyUsers, ...chatParticipants].forEach((u) => {
    if (u && (u._id || u)) {
      const idStr = (u._id || u).toString();
      if (idStr !== userData?._id?.toString()) {
        userPoolMap.set(idStr, u._id ? u : { _id: u });
      }
    }
  });

  const onlineUsersPool = Array.from(userPoolMap.values()).filter((u) =>
    u._id && onlineUserIds.has(u._id.toString())
  );

  const followingIdsSet = new Set(
    followingUsers.map((f) => (f._id || f)?.toString())
  );

  const onlineFollowedUsers = onlineUsersPool.filter((u) =>
    u._id && followingIdsSet.has(u._id.toString())
  );

  const onlineNonFollowedUsers = onlineUsersPool.filter(
    (u) => u._id && !followingIdsSet.has(u._id.toString())
  );

  const filteredOnlineFollowed = onlineFollowedUsers.filter((u) => {
    if (!searchChat.trim()) return true;
    const q = searchChat.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q)
    );
  });

  const filteredOnlineNonFollowed = onlineNonFollowedUsers.filter((u) => {
    if (!searchChat.trim()) return true;
    const q = searchChat.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q)
    );
  });

  // Filtered group chats — Sorted Latest to Oldest!
  const filteredGroups = [...groupChats]
    .filter((c) => {
      const q = searchChat.toLowerCase();
      return c.groupName?.toLowerCase().includes(q) || c.lastMessage?.message?.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const timeA = new Date(a.lastMessage?.createdAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.lastMessage?.createdAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    });

  // Unviewed turf passes count for Turfs badge popup
  const unviewedTurfCount = bookedTurfOwners.filter(
    (o) => !viewedTurfOwnerIds.has(o._id?.toString())
  ).length;

  // Guest gatekeeper: No fetching chats/groups for unauthenticated users
  if (!status || !userData) {
    return (
      <div className="h-[calc(100vh-140px)] min-h-[520px] rounded-3xl bg-[#0b1118] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="max-w-md w-full space-y-6">
          <div className="size-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-2xl shadow-emerald-500/10">
            <MessageCircle className="size-10 stroke-[2.2]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
              Login to Chat
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm mx-auto">
              Sign in to connect with followed footballers, chat with owners of your booked turfs, join squad group channels, and message local players.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="size-4 stroke-[2.5]" />
              <span>Sign In to Chat</span>
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm border border-white/10 transition-all flex items-center justify-center cursor-pointer"
            >
              <span>Create Free Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-130px)] md:h-[calc(100vh-140px)] min-h-[500px] md:min-h-[580px] rounded-2xl md:rounded-3xl bg-[#0b1118] border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in duration-300">
      {/* Left Column: Direct Messages & Squad Groups Sidebar */}
      <div className={`${activeChat ? "hidden md:flex" : "flex"} w-full md:w-88 lg:w-[395px] bg-[#070b10]/95 border-r border-white/10 flex-col shrink-0 h-full overflow-hidden`}>
        {/* Top Header & 6-Mode Segmented Switcher */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MessageCircle className="size-5 text-emerald-400" />
              <h2 className="font-bold text-base text-white font-display">Player Messaging</h2>
            </div>
            {viewMode === "squads" && (
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-all cursor-pointer shadow-sm"
                title="Create Squad Group"
              >
                <Plus className="size-4" />
              </button>
            )}
            {viewMode === "turfs" && (
              <button
                onClick={loadBookedTurfOwners}
                className="p-1.5 rounded-xl bg-white/[0.04] text-neutral-300 hover:text-emerald-400 hover:bg-white/10 transition-all cursor-pointer"
                title="Refresh Turf Owners"
              >
                <RefreshCw className={`size-3.5 ${loadingTurfOwners ? "animate-spin" : ""}`} />
              </button>
            )}
            {viewMode === "discover" && (
              <button
                onClick={loadDiscoverPlayers}
                className="p-1.5 rounded-xl bg-white/[0.04] text-neutral-300 hover:text-emerald-400 hover:bg-white/10 transition-all cursor-pointer"
                title="Shuffle Random Players"
              >
                <RefreshCw className={`size-3.5 ${loadingDiscover ? "animate-spin" : ""}`} />
              </button>
            )}
            {viewMode === "nearby" && (
              <button
                onClick={loadNearbyPlayers}
                className="p-1.5 rounded-xl bg-white/[0.04] text-neutral-300 hover:text-emerald-400 hover:bg-white/10 transition-all cursor-pointer"
                title="Refresh Nearby Radar"
              >
                <RefreshCw className={`size-3.5 ${loadingNearby ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>

          {/* 4-Tab View Switcher (Primary, Turfs, Following, More) */}
          <div className="grid grid-cols-4 p-1 rounded-2xl bg-black/60 border border-white/10 text-center gap-1 relative">
            {/* 1. Primary */}
            <button
              type="button"
              onClick={() => {
                setViewMode("primary");
                setIsMoreMenuOpen(false);
              }}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${viewMode === "primary"
                  ? "bg-emerald-500 text-neutral-950 shadow-md font-extrabold"
                  : "text-neutral-400 hover:text-white"
                }`}
              title="Primary inbox: recent messages, followed players & squad channels"
            >
              <Inbox className="size-4" />
              <span>Primary</span>
            </button>

            {/* 2. Turfs */}
            <button
              type="button"
              onClick={() => {
                setViewMode("turfs");
                setIsMoreMenuOpen(false);
              }}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 relative cursor-pointer ${viewMode === "turfs"
                  ? "bg-emerald-500 text-neutral-950 shadow-md font-extrabold"
                  : "text-neutral-400 hover:text-white"
                }`}
              title="Owners of Turfs you booked recently"
            >
              <Building2 className="size-4" />
              <span>Turfs</span>
              {unviewedTurfCount > 0 && (
                <span className="absolute -top-1 -right-0.5 size-4 rounded-full bg-emerald-400 text-neutral-950 font-mono text-[9px] font-black flex items-center justify-center shadow-md">
                  {unviewedTurfCount}
                </span>
              )}
            </button>

            {/* 3. Following */}
            <button
              type="button"
              onClick={() => {
                setViewMode("following");
                setIsMoreMenuOpen(false);
              }}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${viewMode === "following"
                  ? "bg-emerald-500 text-neutral-950 shadow-md font-extrabold"
                  : "text-neutral-400 hover:text-white"
                }`}
              title="People you follow"
            >
              <UserCheck className="size-4" />
              <span>Following</span>
            </button>

            {/* 4. More (Dropdown for Online, Requests, Squads, Nearby, Discover) */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                className={`w-full h-full py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 relative cursor-pointer ${["online", "requests", "squads", "nearby", "discover"].includes(viewMode)
                    ? "bg-emerald-500 text-neutral-950 shadow-md font-extrabold"
                    : "text-neutral-400 hover:text-white"
                  }`}
                title="More messaging sections (Online, Requests, Squads, Nearby, Discover)"
              >
                <div className="flex items-center gap-0.5">
                  <MoreHorizontal className="size-4" />
                  <ChevronDown className={`size-3 transition-transform ${isMoreMenuOpen ? "rotate-180" : ""}`} />
                </div>
                <span className="capitalize">
                  {["online", "requests", "squads", "nearby", "discover"].includes(viewMode)
                    ? viewMode === "online"
                      ? "Online"
                      : viewMode === "squads"
                        ? "Squads"
                        : viewMode === "requests"
                          ? "Requests"
                          : viewMode === "nearby"
                            ? "Nearby"
                            : "Discover"
                    : "More"}
                </span>
                {onlineUsersPool.length > 0 && viewMode !== "online" ? (
                  <span className="absolute -top-1 -right-0.5 size-3.5 rounded-full bg-emerald-400 text-neutral-950 font-mono text-[8px] font-black flex items-center justify-center shadow-md animate-pulse">
                    {onlineUsersPool.length}
                  </span>
                ) : nonFollowedChats.length > 0 && viewMode !== "requests" ? (
                  <span className="absolute -top-1 -right-0.5 size-3.5 rounded-full bg-amber-400 text-neutral-950 font-mono text-[8px] font-black flex items-center justify-center shadow-md">
                    {nonFollowedChats.length}
                  </span>
                ) : null}
              </button>

              {/* Dropdown Popover */}
              {isMoreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 z-50 rounded-2xl bg-[#0f1722] border border-white/10 shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  {/* Online Players */}
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("online");
                      setIsMoreMenuOpen(false);
                      if (allSystemUsers.length === 0) loadOnlineUsersList();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${viewMode === "online"
                        ? "bg-emerald-500 text-neutral-950 shadow-sm font-extrabold"
                        : "text-neutral-300 hover:text-white hover:bg-white/[0.06]"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center">
                        <Radio className="size-4" />
                        <span className="size-1.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-ping" />
                      </div>
                      <span>Online Players</span>
                    </div>
                    {onlineUsersPool.length > 0 && (
                      <span
                        className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full ${viewMode === "online"
                            ? "bg-neutral-950 text-emerald-400"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                      >
                        {onlineUsersPool.length} active
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("requests");
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${viewMode === "requests"
                        ? "bg-emerald-500 text-neutral-950 shadow-sm"
                        : "text-neutral-300 hover:text-white hover:bg-white/[0.06]"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <MailQuestion className="size-4" />
                      <span>Requests</span>
                    </div>
                    {nonFollowedChats.length > 0 && (
                      <span className="size-4 rounded-full bg-amber-400 text-neutral-950 font-mono text-[9px] font-black flex items-center justify-center">
                        {nonFollowedChats.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("squads");
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${viewMode === "squads"
                        ? "bg-emerald-500 text-neutral-950 shadow-sm"
                        : "text-neutral-300 hover:text-white hover:bg-white/[0.06]"
                      }`}
                  >
                    <Users className="size-4" />
                    <span>Squad Channels</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("nearby");
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${viewMode === "nearby"
                        ? "bg-emerald-500 text-neutral-950 shadow-sm"
                        : "text-neutral-300 hover:text-white hover:bg-white/[0.06]"
                      }`}
                  >
                    <MapPin className="size-4" />
                    <span>Nearby Radar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("discover");
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${viewMode === "discover"
                        ? "bg-emerald-500 text-neutral-950 shadow-sm"
                        : "text-neutral-300 hover:text-white hover:bg-white/[0.06]"
                      }`}
                  >
                    <Compass className="size-4" />
                    <span>Discover Players</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="size-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchChat}
              onChange={(e) => setSearchChat(e.target.value)}
              placeholder={
                viewMode === "primary"
                  ? "Search recent, followed players & groups..."
                  : viewMode === "turfs"
                    ? "Search turf owners or pitches..."
                    : viewMode === "following"
                      ? "Search followed players..."
                      : viewMode === "online"
                        ? "Search active online footballers..."
                        : viewMode === "requests"
                          ? "Search message requests..."
                          : viewMode === "squads"
                            ? "Search squad groups..."
                            : viewMode === "nearby"
                              ? "Search nearby players..."
                              : "Search discover players..."
              }
              className="w-full h-9.5 pl-9.5 pr-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Sidebar List Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04] custom-scrollbar">
          {/* 0. PRIMARY MESSAGES LIST (All active chats, followed players & groups searchable) */}
          {viewMode === "primary" && (
            loading ? (
              <div className="p-10 text-center text-xs text-neutral-400 space-y-2">
                <div className="size-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Loading primary conversations...</p>
              </div>
            ) : filteredPrimaryList.length > 0 ? (
              filteredPrimaryList.map((item) => {
                // Render Existing Chat Item
                if (item.type === "chat") {
                  const chat = item.data;
                  const isSelected = activeChat?._id?.toString() === chat._id?.toString();
                  const lastMsg = chat.lastMessage?.message;
                  const recentTimeStr = chat.lastMessage?.createdAt || chat.updatedAt;

                  if (chat.isGroupChat) {
                    const membersCount = Array.isArray(chat.participants) ? chat.participants.length : 1;
                    const senderName =
                      chat.lastMessage?.sender?.fullName?.split(" ")[0] || chat.lastMessage?.sender?.username;

                    return (
                      <div
                        key={chat._id}
                        onClick={() => setActiveChat(chat)}
                        className={`p-3.5 flex items-center gap-3 transition-all cursor-pointer ${isSelected
                            ? "bg-white/[0.08] border-l-3 border-emerald-400"
                            : "hover:bg-white/[0.03]"
                          }`}
                      >
                        <div className="relative shrink-0">
                          {chat.groupIcon ? (
                            <img
                              src={optimizeGroupIcon(chat.groupIcon)}
                              alt={chat.groupName}
                              className="size-10 rounded-2xl object-cover ring-1 ring-emerald-500/30 shadow-md"
                              loading="lazy"
                            />
                          ) : (
                            <div className="size-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                              <Users className="size-5" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display flex items-center gap-1.5">
                              <span className="truncate">{chat.groupName}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 shrink-0">
                                Squad
                              </span>
                            </h4>
                            <span className="text-[9.5px] text-neutral-400 font-mono shrink-0">
                              {recentTimeStr ? formatRecentTime(recentTimeStr) : "Active"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-0.5">
                            <p className={`text-[11px] truncate font-medium ${lastMsg ? "text-neutral-300" : "text-neutral-500"}`}>
                              {lastMsg ? (senderName ? `${senderName}: ${lastMsg}` : lastMsg) : "Squad group channel"}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-[9px] px-1.5 py-0 border-white/15 text-neutral-400 shrink-0"
                            >
                              {membersCount} players
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // 1-on-1 Direct Chat
                  const otherUser = getOtherParticipant(chat);
                  const isTurfOwner = otherUser && isBookedTurfOwner(otherUser);
                  const isFollowed = otherUser && followingUsers.some((f) => f._id?.toString() === otherUser._id?.toString());

                  return (
                    <div
                      key={chat._id}
                      onClick={() => setActiveChat(chat)}
                      className={`p-3.5 flex items-center gap-3 transition-all cursor-pointer ${isSelected
                          ? "bg-white/[0.08] border-l-3 border-emerald-400"
                          : "hover:bg-white/[0.03]"
                        }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={getAvatarUrl(otherUser, otherUser?.fullName || "Player")}
                          alt={otherUser?.fullName || "Player"}
                          className="size-10 rounded-2xl object-cover ring-1 ring-white/10 shadow-sm"
                        />
                        {isTurfOwner && (
                          <span
                            className="size-3 rounded-full bg-emerald-400 ring-2 ring-[#070b10] absolute -bottom-0.5 -right-0.5"
                            title="Turf Owner"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                              {otherUser?.fullName || otherUser?.username || "Player"}
                            </h4>
                            {isTurfOwner ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 shrink-0">
                                Turf Owner
                              </span>
                            ) : !isFollowed ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shrink-0">
                                Request
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[9.5px] text-neutral-400 font-mono shrink-0">
                            {recentTimeStr ? formatRecentTime(recentTimeStr) : "Active"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p className={`text-[11px] truncate font-medium ${lastMsg ? "text-neutral-300" : "text-neutral-500"}`}>
                            {lastMsg || `@${otherUser?.username || "player"}`}
                          </p>
                          {otherUser?.username && (
                            <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                              @{otherUser.username}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Render Followed User (Direct Start Chat)
                const user = item.data;
                const isSelected =
                  !activeChat?.isGroupChat &&
                  activeChat?.participants?.some(
                    (p) => (p._id || p)?.toString() === user._id?.toString()
                  );

                return (
                  <div
                    key={user._id}
                    onClick={() => handleOpenDirectChat(user._id)}
                    className={`p-3.5 flex items-center gap-3 transition-all cursor-pointer ${isSelected
                        ? "bg-white/[0.08] border-l-3 border-emerald-400"
                        : "hover:bg-white/[0.03]"
                      }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={getAvatarUrl(user, user.fullName || "Player")}
                        alt={user.fullName || "Player"}
                        className="size-10 rounded-2xl object-cover ring-1 ring-white/10 shadow-sm"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                            {user.fullName || user.username}
                          </h4>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 shrink-0">
                            Following
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-[11px] truncate font-medium text-neutral-400 flex items-center gap-1">
                          <UserCheck className="size-3 text-emerald-400 inline shrink-0" />
                          <span>Start conversation</span>
                        </p>
                        <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                          @{user.username}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400 space-y-3">
                <Inbox className="size-8 text-neutral-600 mx-auto" />
                <p className="font-semibold text-neutral-300">
                  {searchChat.trim() ? "No matching messages, players, or squads." : "No conversations yet."}
                </p>
                <p className="text-[11px] text-neutral-500">
                  {searchChat.trim()
                    ? "Try searching by a different name, username, or message keyword."
                    : "Start chatting with followed footballers, pitch owners, or create squad channels."}
                </p>
                {!searchChat.trim() && (
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <Button
                      onClick={() => setViewMode("following")}
                      size="sm"
                      variant="primary"
                      className="text-xs font-bold rounded-xl cursor-pointer"
                    >
                      <UserCheck className="size-3.5 mr-1" /> Followed Players
                    </Button>
                  </div>
                )}
              </div>
            )
          )}

          {/* 1. FOLLOWING LIST */}
          {viewMode === "following" && (
            loadingFollowing ? (
              <div className="p-10 text-center text-xs text-neutral-400 space-y-2">
                <div className="size-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Loading footballers you follow...</p>
              </div>
            ) : filteredFollowing.length > 0 ? (
              filteredFollowing.map((user) => {
                const existingChat = getChatWithUser(user._id);

                const isSelected =
                  !activeChat?.isGroupChat &&
                  activeChat?.participants?.some(
                    (p) => (p._id || p)?.toString() === user._id.toString()
                  );

                const lastMsg = existingChat?.lastMessage?.message;
                const recentTimeStr = existingChat?.lastMessage?.createdAt || existingChat?.updatedAt;

                return (
                  <div
                    key={user._id}
                    onClick={() => handleOpenDirectChat(user._id)}
                    className={`p-3.5 flex items-center gap-3 transition-all cursor-pointer ${isSelected
                        ? "bg-white/[0.08] border-l-3 border-emerald-400"
                        : "hover:bg-white/[0.03]"
                      }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={getAvatarUrl(user, user.fullName || user.username)}
                        alt={user.fullName || user.username}
                        className="size-10 rounded-2xl object-cover ring-1 ring-white/10 shadow-md"
                      />
                      <span
                        className={`size-2.5 rounded-full ring-2 ring-[#070b10] absolute -bottom-0.5 -right-0.5 ${onlineUserIds.has(user._id?.toString())
                            ? "bg-emerald-400"
                            : "bg-neutral-600"
                          }`}
                        title={onlineUserIds.has(user._id?.toString()) ? "Online" : "Offline"}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                          {user.fullName || user.username}
                        </h4>
                        <span className="text-[9.5px] text-neutral-400 font-mono shrink-0">
                          {recentTimeStr ? formatRecentTime(recentTimeStr) : "Followed"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className={`text-[11px] truncate font-medium ${lastMsg ? "text-neutral-300" : "text-neutral-500"}`}>
                          {lastMsg || `@${user.username}`}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 shrink-0"
                        >
                          1-on-1
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400 space-y-3">
                <UserCheck className="size-8 text-neutral-600 mx-auto" />
                <p className="font-semibold text-neutral-300">No followed footballers found.</p>
                <p className="text-[11px] text-neutral-500">
                  Follow players to start 1-on-1 direct conversations.
                </p>
                <Link to="/community">
                  <Button size="sm" variant="primary" className="text-xs font-bold rounded-xl mt-1 cursor-pointer">
                    <Compass className="size-3.5 mr-1" /> Discover Players
                  </Button>
                </Link>
              </div>
            )
          )}

          {/* 2. MESSAGE REQUESTS */}
          {viewMode === "requests" && (
            filteredRequests.length > 0 ? (
              filteredRequests.map((chat) => {
                const other = getOtherParticipant(chat);
                const isSelected = activeChat?._id === chat._id;
                const lastMsg = chat.lastMessage?.message;
                const recentTimeStr = chat.lastMessage?.createdAt || chat.updatedAt;

                return (
                  <div
                    key={chat._id}
                    onClick={() => setActiveChat(chat)}
                    className={`p-3.5 flex items-center gap-3 transition-all cursor-pointer ${isSelected
                        ? "bg-white/[0.08] border-l-3 border-amber-400"
                        : "hover:bg-white/[0.03]"
                      }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={getAvatarUrl(other, other?.fullName || other?.username)}
                        alt={other?.fullName || other?.username}
                        className="size-10 rounded-2xl object-cover ring-1 ring-white/10 shadow-md"
                      />
                      <span
                        className={`size-2.5 rounded-full ring-2 ring-[#070b10] absolute -bottom-0.5 -right-0.5 ${other?._id && onlineUserIds.has(other._id.toString())
                            ? "bg-emerald-400"
                            : "bg-neutral-600"
                          }`}
                        title={
                          other?._id && onlineUserIds.has(other._id.toString())
                            ? "Online"
                            : "Offline"
                        }
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                          {other?.fullName || other?.username || "Player"}
                        </h4>
                        <span className="text-[9.5px] text-neutral-400 font-mono shrink-0">
                          {recentTimeStr ? formatRecentTime(recentTimeStr) : "New"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-[11px] text-neutral-300 truncate font-medium">
                          {lastMsg || `@${other?.username || "user"}`}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 border-amber-500/40 bg-amber-500/10 text-amber-300 shrink-0"
                        >
                          Request
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400 space-y-3">
                <Inbox className="size-8 text-amber-500/60 mx-auto" />
                <p className="font-semibold text-neutral-200">No message requests.</p>
                <p className="text-[11px] text-neutral-500">
                  When players you don't follow send you a direct message, it will appear here safely in your request inbox.
                </p>
              </div>
            )
          )}

          {/* 3. RECENTLY BOOKED TURF OWNERS */}
          {viewMode === "turfs" && (
            loadingTurfOwners ? (
              <div className="p-10 text-center text-xs text-neutral-400 space-y-2">
                <div className="size-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Loading owners of pitches you booked...</p>
              </div>
            ) : filteredTurfOwners.length > 0 ? (
              filteredTurfOwners.map((owner) => {
                const existingChat = getChatWithUser(owner._id);
                const isSelected =
                  !activeChat?.isGroupChat &&
                  activeChat?.participants?.some(
                    (p) => (p._id || p)?.toString() === owner._id?.toString()
                  );

                const primaryTurf = owner.turfs?.[0];
                const lastMsg = existingChat?.lastMessage?.message;
                const recentTimeStr = existingChat?.lastMessage?.createdAt || existingChat?.updatedAt || owner.latestBookingDate;

                return (
                  <div
                    key={owner._id || owner.username}
                    onClick={() => {
                      handleOpenDirectChat(owner._id);
                      markTurfPassAsViewed(owner._id);
                    }}
                    className={`p-3.5 flex items-center gap-3 transition-all cursor-pointer ${isSelected
                        ? "bg-white/[0.08] border-l-3 border-emerald-400"
                        : "hover:bg-white/[0.03]"
                      }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={getAvatarUrl(owner, owner.fullName || owner.username)}
                        alt={owner.fullName || owner.username}
                        className="size-10 rounded-2xl object-cover ring-1 ring-emerald-500/30 shadow-md"
                      />
                      <span className="size-3 rounded-full bg-emerald-400 ring-2 ring-[#070b10] absolute -bottom-0.5 -right-0.5 flex items-center justify-center">
                        <Building2 className="size-2 text-neutral-950" />
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                          {owner.fullName || owner.username}
                        </h4>
                        <span className="text-[9.5px] text-neutral-400 font-mono shrink-0">
                          {recentTimeStr ? formatRecentTime(recentTimeStr) : "Booked"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className={`text-[11px] truncate font-medium ${lastMsg ? "text-neutral-300" : "text-emerald-300 flex items-center gap-1"}`}>
                          {lastMsg ? (
                            <span>{lastMsg}</span>
                          ) : (
                            <>
                              <Building2 className="size-3 text-emerald-400 shrink-0" />
                              <span>{primaryTurf?.turfName || "Turf Pitch"}</span>
                            </>
                          )}
                        </p>
                        <Badge
                          variant="emerald"
                          className="text-[9px] px-1.5 py-0 font-bold shrink-0"
                        >
                          Turf Owner
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400 space-y-3">
                <Building2 className="size-8 text-emerald-500/60 mx-auto" />
                <p className="font-semibold text-neutral-300">No recently booked turfs found.</p>
                <p className="text-[11px] text-neutral-500">
                  When you reserve a turf or match slot, the pitch owner will appear here for direct matchday coordination.
                </p>
                <Link to="/turfs">
                  <Button size="sm" variant="primary" className="text-xs font-bold rounded-xl mt-1 cursor-pointer">
                    <Building2 className="size-3.5 mr-1" /> Browse Available Turfs
                  </Button>
                </Link>
              </div>
            )
          )}

          {/* 4. NEARBY PLAYERS RADAR */}
          {viewMode === "nearby" && (
            loadingNearby ? (
              <div className="p-10 text-center text-xs text-neutral-400 space-y-2">
                <div className="size-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Scanning nearby footballers around your pitch area...</p>
              </div>
            ) : filteredNearby.length > 0 ? (
              filteredNearby.map((user) => {
                const existingChat = getChatWithUser(user._id);
                const isSelected =
                  !activeChat?.isGroupChat &&
                  activeChat?.participants?.some(
                    (p) => (p._id || p)?.toString() === user._id?.toString()
                  );

                return (
                  <div
                    key={user._id}
                    onClick={() => handleOpenDirectChat(user._id)}
                    className={`p-3.5 flex items-center gap-3 transition-all cursor-pointer ${isSelected
                        ? "bg-white/[0.08] border-l-3 border-emerald-400"
                        : "hover:bg-white/[0.03]"
                      }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={getAvatarUrl(user, user.fullName || user.username)}
                        alt={user.fullName || user.username}
                        className="size-10 rounded-2xl object-cover ring-1 ring-emerald-500/20 shadow-md"
                      />
                      <span
                        className={`size-2.5 rounded-full ring-2 ring-[#070b10] absolute -bottom-0.5 -right-0.5 ${onlineUserIds.has(user._id?.toString())
                            ? "bg-emerald-400"
                            : "bg-neutral-600"
                          }`}
                        title={onlineUserIds.has(user._id?.toString()) ? "Online" : "Offline"}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                          {user.fullName || user.username}
                        </h4>
                        <span className="text-[9.5px] text-emerald-400 font-mono font-bold shrink-0">
                          {user.distanceKm ? `${user.distanceKm} km` : "Nearby"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-[11px] text-neutral-400 truncate flex items-center gap-1">
                          <MapPin className="size-3 text-emerald-400 shrink-0" />
                          <span>{user.location?.city || user.location?.name || "Bengaluru Pitch Area"}</span>
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 shrink-0"
                        >
                          Radar
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400 space-y-3">
                <Radio className="size-8 text-neutral-600 mx-auto" />
                <p className="font-semibold text-neutral-300">No nearby footballers found.</p>
                <p className="text-[11px] text-neutral-500">
                  Update your location or browse followed and discover players.
                </p>
              </div>
            )
          )}

          {/* 5. DISCOVER RANDOM PLAYERS */}
          {viewMode === "discover" && (
            loadingDiscover ? (
              <div className="p-10 text-center text-xs text-neutral-400 space-y-2">
                <div className="size-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Finding new players for you to connect...</p>
              </div>
            ) : filteredDiscover.length > 0 ? (
              filteredDiscover.map((user) => {
                const isSelected =
                  !activeChat?.isGroupChat &&
                  activeChat?.participants?.some(
                    (p) => (p._id || p)?.toString() === user._id?.toString()
                  );

                return (
                  <div
                    key={user._id}
                    onClick={() => handleOpenDirectChat(user._id)}
                    className={`p-3.5 flex items-center gap-3 transition-all cursor-pointer ${isSelected
                        ? "bg-white/[0.08] border-l-3 border-emerald-400"
                        : "hover:bg-white/[0.03]"
                      }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={getAvatarUrl(user, user.fullName || user.username)}
                        alt={user.fullName || user.username}
                        className="size-10 rounded-2xl object-cover ring-1 ring-white/10 shadow-md"
                      />
                      <span
                        className={`size-2.5 rounded-full ring-2 ring-[#070b10] absolute -bottom-0.5 -right-0.5 ${onlineUserIds.has(user._id?.toString())
                            ? "bg-emerald-400"
                            : "bg-neutral-600"
                          }`}
                        title={onlineUserIds.has(user._id?.toString()) ? "Online" : "Offline"}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                          {user.fullName || user.username}
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                          @{user.username}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {user.bio || "Football enthusiast ready for matchday!"}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400 space-y-3">
                <Compass className="size-8 text-neutral-600 mx-auto" />
                <p className="font-semibold text-neutral-300">No new footballers available.</p>
                <p className="text-[11px] text-neutral-500">
                  You are already in touch with all available players in this sector!
                </p>
              </div>
            )
          )}

          {/* 6. SQUAD GROUPS */}
          {viewMode === "squads" && (
            filteredGroups.length > 0 ? (
              filteredGroups.map((group) => {
                const isSelected = activeChat?._id === group._id;
                const membersCount = Array.isArray(group.participants) ? group.participants.length : 1;
                const lastMsg = group.lastMessage?.message;
                const recentTimeStr = group.lastMessage?.createdAt || group.updatedAt;

                return (
                  <div
                    key={group._id}
                    onClick={() => setActiveChat(group)}
                    className={`p-3.5 flex items-center gap-3 transition-all cursor-pointer ${isSelected
                        ? "bg-white/[0.08] border-l-3 border-emerald-400"
                        : "hover:bg-white/[0.03]"
                      }`}
                  >
                    <div className="relative shrink-0">
                      {group.groupIcon ? (
                        <img
                          src={optimizeGroupIcon(group.groupIcon)}
                          alt={group.groupName}
                          className="size-10 rounded-2xl object-cover ring-1 ring-emerald-500/30 shadow-md"
                          loading="lazy"
                        />
                      ) : (
                        <div className="size-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                          <Users className="size-5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                          {group.groupName}
                        </h4>
                        <span className="text-[9.5px] text-neutral-400 font-mono shrink-0">
                          {recentTimeStr ? formatRecentTime(recentTimeStr) : "Active"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className={`text-[11px] truncate font-medium ${lastMsg ? "text-neutral-300" : "text-neutral-500"}`}>
                          {lastMsg || "Squad group channel"}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 border-white/15 text-neutral-400 shrink-0"
                        >
                          {membersCount} players
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400 space-y-3">
                <Users className="size-8 text-neutral-600 mx-auto" />
                <p className="font-semibold text-neutral-300">No squad groups yet.</p>
                <p className="text-[11px] text-neutral-500">
                  Create a squad group to coordinate matches and share digital match passes with team members.
                </p>
                <Button
                  onClick={() => setIsGroupModalOpen(true)}
                  size="sm"
                  variant="primary"
                  className="text-xs font-bold rounded-xl mt-1 cursor-pointer"
                >
                  <Plus className="size-3.5 mr-1" /> Create Squad
                </Button>
              </div>
            )
          )}

          {/* 7. ONLINE USERS SECTION (Top: Followed Online, Bottom: Non-Followed Online) */}
          {viewMode === "online" && (
            loadingOnlineUsers && allSystemUsers.length === 0 ? (
              <div className="p-10 text-center text-xs text-neutral-400 space-y-2">
                <div className="size-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Locating active footballers online...</p>
              </div>
            ) : filteredOnlineFollowed.length === 0 && filteredOnlineNonFollowed.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400 space-y-3">
                <Radio className="size-8 text-neutral-600 mx-auto animate-pulse" />
                <p className="font-semibold text-neutral-300">
                  {searchChat.trim() ? "No matching online players." : "No players currently online."}
                </p>
                <p className="text-[11px] text-neutral-500">
                  {searchChat.trim()
                    ? "Try searching another player name or clear search."
                    : "When footballers you follow or other players log in, they will appear live here."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {/* SECTION A: PEOPLE I FOLLOW (ONLINE) - TOP OF LIST */}
                <div className="bg-emerald-950/20 px-3.5 py-2 border-y border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 font-display">
                    <UserCheck className="size-3.5" />
                    <span>People I Follow ({filteredOnlineFollowed.length})</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/80 font-mono font-bold">Online Now</span>
                </div>

                {filteredOnlineFollowed.length > 0 ? (
                  filteredOnlineFollowed.map((user) => {
                    const existingChat = getChatWithUser(user._id);
                    const isSelected =
                      !activeChat?.isGroupChat &&
                      activeChat?.participants?.some(
                        (p) => (p._id || p)?.toString() === user._id?.toString()
                      );
                    const lastMsg = existingChat?.lastMessage?.message;

                    return (
                      <div
                        key={user._id}
                        onClick={() => handleOpenDirectChat(user._id)}
                        className={`p-3.5 flex items-center gap-3 transition-all cursor-pointer ${isSelected
                            ? "bg-white/[0.08] border-l-3 border-emerald-400"
                            : "hover:bg-white/[0.03]"
                          }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={getAvatarUrl(user, user.fullName || user.username)}
                            alt={user.fullName || user.username}
                            className="size-10 rounded-2xl object-cover ring-1 ring-white/10 shadow-md"
                          />
                          <span
                            className="size-3 rounded-full bg-emerald-400 ring-2 ring-[#070b10] absolute -bottom-0.5 -right-0.5 animate-pulse"
                            title="Online"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                              {user.fullName || user.username}
                            </h4>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 shrink-0">
                              Following
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-0.5">
                            <p className="text-[11px] text-emerald-400/90 truncate flex items-center gap-1 font-medium">
                              <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
                              <span>{lastMsg ? `${lastMsg}` : "Active now • Tap to chat"}</span>
                            </p>
                            <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                              @{user.username}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-neutral-500 italic">
                    None of the players you follow are currently active.
                  </div>
                )}

                {/* SECTION B: PEOPLE I DON'T FOLLOW (ONLINE) - BOTTOM OF LIST */}
                <div className="bg-white/[0.02] px-3.5 py-2 border-y border-white/[0.08] flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 font-display">
                    <Users className="size-3.5 text-neutral-400" />
                    <span>Other Players ({filteredOnlineNonFollowed.length})</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">Not Followed</span>
                </div>

                {filteredOnlineNonFollowed.length > 0 ? (
                  filteredOnlineNonFollowed.map((user) => {
                    const existingChat = getChatWithUser(user._id);
                    const isSelected =
                      !activeChat?.isGroupChat &&
                      activeChat?.participants?.some(
                        (p) => (p._id || p)?.toString() === user._id?.toString()
                      );
                    const lastMsg = existingChat?.lastMessage?.message;

                    return (
                      <div
                        key={user._id}
                        onClick={() => handleOpenDirectChat(user._id)}
                        className={`p-3.5 flex items-center gap-3 transition-all cursor-pointer ${isSelected
                            ? "bg-white/[0.08] border-l-3 border-emerald-400"
                            : "hover:bg-white/[0.03]"
                          }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={getAvatarUrl(user, user.fullName || user.username)}
                            alt={user.fullName || user.username}
                            className="size-10 rounded-2xl object-cover ring-1 ring-white/10 shadow-md"
                          />
                          <span
                            className="size-3 rounded-full bg-emerald-400 ring-2 ring-[#070b10] absolute -bottom-0.5 -right-0.5 animate-pulse"
                            title="Online"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                              {user.fullName || user.username}
                            </h4>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white/10 text-neutral-300 font-bold border border-white/15 shrink-0">
                              Player
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-0.5">
                            <p className="text-[11px] text-neutral-400 truncate flex items-center gap-1">
                              <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
                              <span>{lastMsg ? `${lastMsg}` : "Online • Start conversation"}</span>
                            </p>
                            <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                              @{user.username}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-neutral-500 italic">
                    No other players currently online.
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Right Column: Chat Conversation Stream & Messaging Viewport */}
      <div className={`${!activeChat ? "hidden md:flex" : "flex"} flex-1 flex-col bg-[#0b1118] min-w-0 h-full overflow-hidden`}>
        {activeChat ? (
          <>
            {/* Chat Top Header */}
            <div className="px-3 py-2.5 sm:px-5 sm:py-3.5 border-b border-white/[0.08] flex items-center justify-between gap-2 bg-[#070b10]/95 shrink-0">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                {/* Mobile Back Button to Chat List */}
                <button
                  type="button"
                  onClick={() => setActiveChat(null)}
                  className="md:hidden size-8.5 rounded-xl bg-white/[0.06] hover:bg-white/15 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer shrink-0 active:scale-95 transition-all"
                  title="Back to Chats"
                  aria-label="Back to chat list"
                >
                  <ChevronLeft className="size-5" />
                </button>

                {/* User / Group Header Info (Clickable for direct user profile) */}
                {!activeChat.isGroupChat && activeOtherUser?.username ? (
                  <Link
                    to={`/channel/${activeOtherUser.username}`}
                    className="flex items-center gap-2.5 min-w-0 flex-1 group/headeruser transition-all"
                    title={`View @${activeOtherUser.username}'s profile`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={getAvatarUrl(activeOtherUser, activeOtherUser?.fullName || activeOtherUser?.username)}
                        alt="Avatar"
                        className="size-9 sm:size-10 rounded-2xl object-cover ring-1 ring-white/10 shadow-md group-hover/headeruser:ring-emerald-400/50 transition-all"
                      />
                      {(() => {
                        const onlineState = getUserOnlineState(activeOtherUser);
                        if (!onlineState.isVisible) return null;
                        return (
                          <span
                            className={`size-2.5 rounded-full ring-2 ring-[#070b10] absolute -bottom-0.5 -right-0.5 ${onlineState.isOnline
                                ? "bg-emerald-400 animate-pulse"
                                : "bg-neutral-600"
                              }`}
                            title={onlineState.statusText || (onlineState.isOnline ? "Online" : "Offline")}
                          />
                        );
                      })()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-white truncate font-display group-hover/headeruser:text-emerald-400 transition-colors">
                          {activeOtherUser?.fullName || activeOtherUser?.username || "Player"}
                        </h3>
                        <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 truncate">
                        {(() => {
                          const onlineState = getUserOnlineState(activeOtherUser);
                          if (onlineState.isVisible) {
                            return (
                              <span
                                className={`font-semibold shrink-0 ${onlineState.isOnline ? "text-emerald-400" : "text-neutral-400"
                                  }`}
                              >
                                {onlineState.statusText}
                              </span>
                            );
                          }
                          return null;
                        })()}
                        {getUserOnlineState(activeOtherUser).isVisible && <span>•</span>}
                        {bookedTurfOwnerInfo ? (
                          <span className="text-emerald-300 font-semibold truncate flex items-center gap-1">
                            <Building2 className="size-3 shrink-0" /> {bookedTurfOwnerInfo.turfs?.[0]?.turfName || "Turf Owner"}
                          </span>
                        ) : (
                          <span className={`truncate ${isOtherUserFollowed ? "text-neutral-400" : "text-amber-300/90"}`}>
                            @{activeOtherUser?.username || "player"}{!isOtherUserFollowed ? " (Request)" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="relative shrink-0 group/headericon">
                      {activeChat.groupIcon ? (
                        <img
                          src={optimizeGroupIcon(activeChat.groupIcon)}
                          alt={activeChat.groupName}
                          className="size-9 sm:size-10 rounded-2xl object-cover ring-1 ring-emerald-500/30 shadow-md"
                        />
                      ) : (
                        <div className="size-9 sm:size-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                          <Users className="size-4.5" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsEditGroupModalOpen(true)}
                        className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center text-emerald-400 opacity-0 group-hover/headericon:opacity-100 transition-opacity cursor-pointer shadow-sm"
                        title="Edit Squad Profile Pic & Name"
                      >
                        <Camera className="size-3.5" />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-white truncate font-display">
                          {activeChat.groupName}
                        </h3>
                        <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 truncate">
                        <span className="truncate">{participantsList.length} squad footballers</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons in Header (Only for Group Chats) */}
              {activeChat.isGroupChat && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer shadow-sm h-8 sm:h-9 active:scale-95"
                    title="Add Footballers to Squad"
                  >
                    <UserPlus className="size-3.5" />
                    <span className="hidden sm:inline">Add Member</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditGroupModalOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-emerald-500/20 hover:border-emerald-500/30 text-xs font-bold text-neutral-300 hover:text-emerald-300 transition-all cursor-pointer shadow-sm h-8 sm:h-9"
                    title="Edit Squad Group Profile & Name"
                  >
                    <Edit3 className="size-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Edit Squad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMembersPanel(!showMembersPanel)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer h-8 sm:h-9 ${showMembersPanel
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-white/[0.05] text-neutral-300 border-white/10 hover:text-white"
                      }`}
                    title="View Group Members"
                  >
                    <Users className="size-3.5" />
                    <span className="hidden sm:inline">Members ({participantsList.length})</span>
                    <span className="sm:hidden">{participantsList.length}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Non-Followed Player Warning & Follow Back Banner */}
            {!activeChat.isGroupChat && activeOtherUser && !isOtherUserFollowed && !bookedTurfOwnerInfo && (
              <div className="px-3.5 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between gap-2.5 text-xs text-amber-200 animate-in fade-in duration-200 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <UserPlus className="size-3.5 text-amber-400 shrink-0" />
                  <span className="truncate text-[11.5px]">
                    Message request from <strong className="text-white">@{activeOtherUser.username}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleFollowFromChat(activeOtherUser.username)}
                  className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  <UserPlus className="size-3" /> Follow Back
                </button>
              </div>
            )}

            {/* Booked Turf Owner Official Banner */}
            {!activeChat.isGroupChat && activeOtherUser && bookedTurfOwnerInfo && (
              <div className="px-3.5 py-2 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between gap-2.5 text-xs text-emerald-200 animate-in fade-in duration-200 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="size-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate text-[11.5px]">
                    Pitch Manager for <strong className="text-white">{bookedTurfOwnerInfo.turfs?.[0]?.turfName || "your booking"}</strong>
                  </span>
                </div>
                <Link
                  to={
                    bookedTurfOwnerInfo.turfs?.[0]?.bookingId
                      ? `/booking-confirmation/${bookedTurfOwnerInfo.turfs[0].bookingId}`
                      : "/my-bookings"
                  }
                  onClick={() => markTurfPassAsViewed(bookedTurfOwnerInfo._id)}
                >
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-sm border border-white/10"
                  >
                    <Ticket className="size-3 text-emerald-400" /> Match Pass
                  </button>
                </Link>
              </div>
            )}

            {/* Message History Feed */}
            <div
              ref={messagesContainerRef}
              className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-2.5 sm:space-y-3 custom-scrollbar"
            >
              {/* Load Older Messages Button */}
              {hasMoreMessages && (
                <div className="text-center pb-2">
                  <button
                    type="button"
                    onClick={handleLoadOlderMessages}
                    disabled={loadingOlderMessages}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                  >
                    {loadingOlderMessages ? (
                      <>
                        <span className="size-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        <span>Loading older messages...</span>
                      </>
                    ) : (
                      <span>Load older messages</span>
                    )}
                  </button>
                </div>
              )}

              {messages.length > 0 ? (
                messages.map((msg) => {
                  const senderId = msg.sender?._id || msg.sender;
                  const isOwn = senderId?.toString() === userData?._id?.toString();
                  const senderName = msg.sender?.fullName || (isOwn ? "You" : msg.sender?.username || "Player");
                  const username = msg.sender?.username || (isOwn ? userData?.username : "player");

                  return (
                    <div
                      key={msg._id}
                      className={`group flex items-end gap-2 max-w-[88%] sm:max-w-[75%] ${isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
                        }`}
                    >
                      {/* Sender Avatar for incoming messages */}
                      {!isOwn && (
                        <img
                          src={getAvatarUrl(msg.sender, senderName)}
                          alt={senderName}
                          className="size-7 sm:size-8 rounded-full aspect-square object-cover ring-1 ring-white/10 shrink-0 shadow-sm mb-0.5"
                        />
                      )}

                      {/* Chat Message Bubble */}
                      <div
                        className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-sm leading-relaxed space-y-1 shadow-md max-w-full ${msg.message?.includes("MATCHDAY PASS APPROVED")
                            ? "bg-[#080f14] border border-emerald-500/40 text-white ring-1 ring-emerald-500/20 rounded-bl-none shadow-emerald-500/10"
                            : isOwn
                              ? "bg-emerald-500 text-neutral-950 font-medium rounded-br-none"
                              : "bg-[#121a24] border border-white/[0.08] text-white rounded-bl-none"
                          }`}
                      >
                        {/* Only show sender name on Group Chats */}
                        {activeChat.isGroupChat && !isOwn && (
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 flex-wrap pb-0.5">
                            <span>{senderName}</span>
                            <span className="text-[10px] text-neutral-400 font-normal">@{username}</span>
                            {(msg.message?.includes("MATCHDAY PASS APPROVED") ||
                              msg.message?.includes("MATCHDAY RESERVED") ||
                              msg.sender?.role === "admin") && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold tracking-wider flex items-center gap-1">
                                  <ShieldCheck className="size-2.5 text-emerald-400" /> Admin
                                </span>
                              )}
                          </div>
                        )}

                        {/* Quoted Replied Message Box */}
                        {msg.replyTo && (
                          <div className="mb-1.5 p-2 rounded-xl bg-black/40 border-l-2 border-emerald-400 text-xs space-y-0.5 shadow-inner">
                            <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              <CornerDownRight className="size-2.5" />
                              <span>
                                Replied to @{msg.replyTo.username || msg.replyTo.senderName || "player"}
                              </span>
                            </div>
                            <p className="text-[10.5px] text-neutral-300 line-clamp-1 italic font-normal">
                              "{msg.replyTo.messageText || msg.replyTo.message || "Shared message"}"
                            </p>
                          </div>
                        )}

                        {/* Embedded Match Pass Action Card for Squad & Group Members */}
                        {(msg.attachment === "match_pass" || msg.message?.includes("MATCHDAY PASS APPROVED")) && (
                          <div className="mt-1 p-3.5 rounded-2xl bg-black/70 border border-emerald-500/30 space-y-2.5 shadow-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                                <Ticket className="size-4" />
                                <span>Official Digital Match Pass</span>
                              </div>
                              <Badge variant="emerald" className="text-[9px] px-1.5 py-0 font-bold">
                                CONFIRMED
                              </Badge>
                            </div>

                            <p className="text-[11.5px] text-neutral-300">
                              Pitch owner confirmed this reservation! All squad members can download and save their digital pass voucher.
                            </p>

                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <Button
                                type="button"
                                size="sm"
                                variant="primary"
                                onClick={() => handleDownloadPassFromMessage(msg)}
                                className="text-xs font-bold rounded-xl gap-1.5 h-8 px-3 shadow-md shadow-emerald-500/20 cursor-pointer"
                              >
                                <Download className="size-3.5" /> Download Pass (PNG)
                              </Button>

                              {msg.matchPass?.bookingId && (
                                <Link to={`/booking-confirmation/${msg.matchPass.bookingId}`}>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="text-xs font-semibold rounded-xl gap-1.5 h-8 px-2.5 hover:border-emerald-500/40 cursor-pointer"
                                  >
                                    <ExternalLink className="size-3.5" /> View Voucher
                                  </Button>
                                </Link>
                              )}

                              {/* View Turf Navigation Button (Opens Main Turf Page /turf/:turfId) */}
                              <Link to={getTurfDetailPageUrl(msg)}>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="text-xs font-semibold rounded-xl gap-1.5 h-8 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:text-emerald-200 cursor-pointer shadow-sm"
                                >
                                  <Building2 className="size-3.5 text-emerald-400" /> View Turf
                                </Button>
                              </Link>
                            </div>
                          </div>
                        )}

                        {/* Instagram-style Shared Post Card (Rendered at top of bubble) */}
                        {(msg.attachment === "post" || msg.sharedPost) && (
                          <div
                            onClick={() => {
                              const targetPostId =
                                msg.sharedPost?.postId || msg.sharedPost?._id || msg.sharedPost?.id;
                              if (!targetPostId) return;

                              const currentScroll = messagesContainerRef.current ? messagesContainerRef.current.scrollTop : 0;
                              if (activeChat?._id) {
                                sessionStorage.setItem("messages_return_chat_id", activeChat._id);
                              }
                              if (viewMode) {
                                sessionStorage.setItem("messages_return_view_mode", viewMode);
                              }
                              sessionStorage.setItem("messages_return_scroll_top", String(currentScroll));

                              navigate(`/post/${targetPostId}`, {
                                state: {
                                  post: {
                                    ...msg.sharedPost,
                                    _id: targetPostId,
                                  },
                                  from: location.pathname + location.search,
                                  chatId: activeChat?._id,
                                  viewMode: viewMode,
                                  scrollTop: currentScroll,
                                },
                              });
                            }}
                            className="rounded-2xl overflow-hidden bg-black/70 border border-white/15 hover:border-emerald-500/50 transition-all cursor-pointer shadow-xl max-w-sm group/post"
                          >
                            {/* Post Author Header */}
                            <div className="p-2.5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={getAvatarUrl(msg.sharedPost?.owner)}
                                  alt={msg.sharedPost?.owner?.fullName || "Author"}
                                  className="size-6 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-white truncate">
                                      {msg.sharedPost?.owner?.fullName || msg.sharedPost?.owner?.username || "Player"}
                                    </span>
                                    <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                                  </div>
                                  <span className="text-[9.5px] text-neutral-400 block font-mono">
                                    @{msg.sharedPost?.owner?.username || "player"}
                                  </span>
                                </div>
                              </div>

                              <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-white/20 text-neutral-300">
                                Match Post
                              </Badge>
                            </div>

                            {/* Post Media Thumbnail with Cover Fallback */}
                            {(() => {
                              const coverUrl = getSharedPostCover(msg.sharedPost);
                              return coverUrl ? (
                                <div className="relative aspect-video max-h-48 bg-black/80 overflow-hidden">
                                  <img
                                    src={optimizeCloudinaryPostImage(coverUrl)}
                                    alt="Shared Post"
                                    className="w-full h-full object-cover group-hover/post:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                  {msg.sharedPost.media?.[0]?.type === "video" && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      <div className="size-9 rounded-full bg-emerald-500/90 text-neutral-950 flex items-center justify-center shadow-lg">
                                        <Play className="size-4.5 fill-current ml-0.5" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : msg.sharedPost?.caption ? (
                                <div className="p-3 bg-emerald-950/20 border-y border-white/5">
                                  <p className="text-xs text-neutral-200 italic line-clamp-3">
                                    "{msg.sharedPost.caption}"
                                  </p>
                                </div>
                              ) : null;
                            })()}

                            {/* Post Caption & Action Footer */}
                            <div className="p-2.5 space-y-1.5 bg-[#080d14]">
                              {msg.sharedPost?.caption && (
                                <p className="text-xs text-neutral-200 line-clamp-2 leading-relaxed font-normal">
                                  <span className="font-bold text-white mr-1.5">
                                    @{msg.sharedPost.owner?.username || "player"}
                                  </span>
                                  {msg.sharedPost.caption}
                                </p>
                              )}

                              <div className="pt-1 border-t border-white/[0.06] flex items-center justify-between text-[10.5px] text-emerald-400 font-bold">
                                <span className="flex items-center gap-1 group-hover/post:underline">
                                  View full post <ArrowRight className="size-3" />
                                </span>
                                <span className="text-[9.5px] text-neutral-500 font-normal">
                                  FootballHub Media
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Message Text / Custom Caption */}
                        {msg.message && !msg.message?.includes("MATCHDAY PASS APPROVED") && (
                          <p className={`text-[13.5px] sm:text-[14.5px] whitespace-pre-wrap break-words leading-snug ${(msg.attachment === "post" || msg.sharedPost) ? "pt-1 font-medium" : ""
                            }`}>
                            {msg.message}
                          </p>
                        )}

                        <div
                          className={`text-[9.5px] text-right font-mono font-medium flex items-center justify-end gap-1 -mt-0.5 ${isOwn && !msg.message?.includes("MATCHDAY PASS APPROVED")
                              ? "text-neutral-950/70"
                              : "text-neutral-400"
                            }`}
                        >
                          {msg.isEdited && (
                            <span className="italic text-[8.5px] opacity-80">(edited)</span>
                          )}
                          <span>
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              : "Just now"}
                          </span>
                          {isOwn && (
                            <span
                              className="inline-flex items-center ml-0.5"
                              title={msg.isRead ? "Seen" : "Sent"}
                            >
                              {msg.isRead ? (
                                <CheckCheck className="size-3 text-neutral-950 font-bold" />
                              ) : (
                                <Check className="size-2.5 text-neutral-950/60" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quick Action Buttons on Hover (Delete, Edit & Reply) */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 self-center shrink-0">
                        {(isOwn || (activeChat.isGroupChat && activeChat.admin?.toString() === userData?._id?.toString())) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMessageToDelete(msg);
                            }}
                            className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500 hover:text-white text-neutral-400 cursor-pointer shadow-sm transition-all"
                            title="Delete message"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                        {isOwn && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMessage(msg);
                              setReplyingToMessage(null);
                              setMessageInput(msg.message);
                            }}
                            className="p-1.5 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-neutral-950 text-neutral-400 cursor-pointer shadow-sm transition-all"
                            title="Edit message"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingToMessage(msg);
                            setEditingMessage(null);
                          }}
                          className="p-1.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-neutral-950 text-neutral-400 cursor-pointer shadow-sm transition-all"
                          title="Reply to message"
                        >
                          <Reply className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-10 text-center text-sm text-neutral-400 space-y-2">
                  <MessageCircle className="size-8 text-neutral-500 mx-auto" />
                  <p className="font-semibold text-white">
                    {activeChat.isGroupChat
                      ? "No messages in this squad chat yet."
                      : `Direct conversation with @${activeOtherUser?.username || "player"}`}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Send a message to start direct matchday coordination!
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar with Emoji Support, Active Reply Banner & Active Edit Banner */}
            <div className="relative border-t border-white/[0.08] bg-[#070b10]/95 shrink-0">
              {/* Active Replying-to Banner */}
              {replyingToMessage && (
                <div className="px-3.5 py-2 bg-emerald-950/40 border-b border-emerald-500/20 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-150">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
                      <Reply className="size-3" />
                    </div>
                    <div className="min-w-0 text-xs">
                      <span className="font-bold text-emerald-400 mr-1.5">
                        Replying to @{replyingToMessage.sender?.username || "player"}:
                      </span>
                      <span className="text-neutral-300 truncate inline-block max-w-[200px] sm:max-w-md align-bottom italic font-normal text-[11px]">
                        "{replyingToMessage.message || "Shared attachment"}"
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setReplyingToMessage(null)}
                    className="size-6 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                    title="Cancel reply"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Active Editing Message Banner */}
              {editingMessage && (
                <div className="px-3.5 py-2 bg-amber-950/50 border-b border-amber-500/30 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-150">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
                      <Pencil className="size-3" />
                    </div>
                    <div className="min-w-0 text-xs">
                      <span className="font-bold text-amber-400 mr-1.5">
                        Editing message:
                      </span>
                      <span className="text-neutral-300 truncate inline-block max-w-[200px] sm:max-w-md align-bottom italic font-normal text-[11px]">
                        "{editingMessage.message}"
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingMessage(null);
                      setMessageInput("");
                    }}
                    className="size-6 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                    title="Cancel edit"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Floating Emoji Picker Component */}
              <EmojiPicker
                isOpen={isEmojiPickerOpen}
                onClose={() => setIsEmojiPickerOpen(false)}
                onSelectEmoji={(emoji) => {
                  setMessageInput((prev) => prev + emoji);
                }}
              />

              {/* Quick Reaction Emoji Chips */}
              <div className="px-3 pt-2 pb-0.5 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
                <span className="text-[9.5px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-0.5">
                  Quick:
                </span>
                {[
                  { emoji: "⚽", label: "Football" },
                  { emoji: "😂", label: "Laughing" },
                  { emoji: "🔥", label: "Fire" },
                  { emoji: "❤️", label: "Heart" },
                  { emoji: "👏", label: "Clap" },
                  { emoji: "👍", label: "Thumbs Up" },
                ].map(({ emoji, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setMessageInput((prev) => prev + emoji)}
                    className="h-6.5 px-2 rounded-lg bg-white/[0.04] hover:bg-emerald-500/20 border border-white/[0.06] text-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95 shrink-0"
                    title={`Add ${label} (${emoji})`}
                  >
                    <span>{emoji}</span>
                  </button>
                ))}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-2.5 sm:p-3 pt-1.5 flex items-center gap-2"
              >
                {/* Emoji Button */}
                <button
                  type="button"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className={`size-10 sm:size-11 rounded-2xl border flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm ${isEmojiPickerOpen
                      ? "bg-emerald-500/25 border-emerald-500/50 text-emerald-300 ring-2 ring-emerald-500/30"
                      : "bg-black/50 border-white/15 text-neutral-300 hover:text-white hover:bg-white/10 hover:border-emerald-500/30"
                    }`}
                  title="View All Emojis"
                >
                  <span className="text-base sm:text-lg">😊</span>
                </button>

                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={
                    editingMessage
                      ? "Edit message..."
                      : activeChat.isGroupChat
                        ? "Message squad..."
                        : `Message @${activeOtherUser?.username || "player"}...`
                  }
                  className={`flex-1 h-10 sm:h-11 px-3.5 rounded-2xl bg-black/60 border text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none font-medium transition-all ${editingMessage
                      ? "border-amber-500/50 focus:ring-1 focus:ring-amber-500 bg-amber-950/20"
                      : "border-white/10 focus:ring-1 focus:ring-emerald-500"
                    }`}
                />
                <Button
                  type="submit"
                  disabled={!messageInput.trim()}
                  variant="primary"
                  className={`size-10 sm:size-11 rounded-2xl p-0 shrink-0 shadow-md cursor-pointer transition-all ${editingMessage
                      ? "bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/20"
                      : ""
                    }`}
                  title={editingMessage ? "Save changes" : "Send message"}
                >
                  {editingMessage ? (
                    <Check className="size-4.5 font-bold" />
                  ) : (
                    <Send className="size-4.5" />
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-neutral-400">
            <MessageCircle className="size-12 text-neutral-600" />
            <h3 className="text-base font-bold text-white font-display">Select a Conversation</h3>
            <p className="text-xs max-w-sm">
              Pick a followed player, chat with owners of your booked turfs, check message requests, or chat with your squad.
            </p>
          </div>
        )}
      </div>

      {/* Right Column: Group Members Panel (Only for group chats) */}
      {activeChat?.isGroupChat && showMembersPanel && (
        <div className="w-full md:w-72 lg:w-80 bg-[#070b10]/95 border-l border-white/10 flex flex-col shrink-0 animate-in slide-in-from-right-4 duration-200">
          <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="size-4.5 text-emerald-400" />
              <h3 className="font-bold text-sm text-white font-display">Squad Members</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditGroupModalOpen(true)}
                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-emerald-500/20 text-neutral-400 hover:text-emerald-300 border border-white/10 transition-colors cursor-pointer"
                title="Edit Squad Group Details"
              >
                <Edit3 className="size-3.5" />
              </button>
              <span className="text-xs text-neutral-400 font-bold px-2 py-0.5 rounded-full bg-white/[0.05]">
                {participantsList.length}
              </span>
            </div>
          </div>

          <div className="p-3 border-b border-white/[0.06] bg-white/[0.02]">
            <button
              type="button"
              onClick={() => setIsAddMemberModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold text-emerald-300 hover:text-emerald-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
            >
              <UserPlus className="size-4 text-emerald-400" />
              <span>Add Member to Squad</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {participantsList.length > 0 ? (
              participantsList.map((member) => {
                const isAdmin =
                  activeChat.admin?._id === member._id ||
                  activeChat.admin === member._id;
                const isYou = member._id === userData?._id;

                return (
                  <div
                    key={member._id}
                    className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={getAvatarUrl(member, member.fullName || member.username)}
                        alt={member.fullName || member.username}
                        className="size-9 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white truncate">
                            {member.fullName || member.username}
                          </span>
                          {isYou && (
                            <span className="text-[10px] text-emerald-400 font-semibold">(You)</span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-400 block truncate font-medium">
                          @{member.username || "player"}
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <Badge variant="emerald" className="text-[9.5px] px-2 py-0.5 font-bold shrink-0">
                        ADMIN
                      </Badge>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-neutral-400">
                No member details available.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 transition-opacity duration-150">
          <div className="max-w-md w-full rounded-3xl bg-[#0b1118] border border-white/15 p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white font-display">Create Squad Group Chat</h3>
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Squad Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Squad name (e.g. Koramangala 7s)"
                  className="w-full h-11 px-4 rounded-xl bg-black/60 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" className="text-xs font-bold rounded-xl px-5 cursor-pointer">
                  Create Group
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Group Modal (All squad members can update group name & group picture) */}
      {isEditGroupModalOpen && activeChat?.isGroupChat && (
        <EditGroupModal
          isOpen={isEditGroupModalOpen}
          onClose={() => setIsEditGroupModalOpen(false)}
          chat={activeChat}
          onGroupUpdated={handleGroupUpdatedSuccess}
        />
      )}

      {/* Add Member to Squad Group Modal */}
      {isAddMemberModalOpen && activeChat?.isGroupChat && (
        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          chat={activeChat}
          followingUsers={followingUsers}
          allUsers={allSystemUsers}
          onMembersAdded={handleGroupUpdatedSuccess}
        />
      )}

      {/* Instagram-style Post Detail Viewer Modal */}
      {selectedSharedPost && (
        <PostDetailModal
          post={{
            _id: selectedSharedPost.postId || selectedSharedPost._id,
            owner: selectedSharedPost.owner,
            caption: selectedSharedPost.caption,
            content: selectedSharedPost.caption,
            media:
              Array.isArray(selectedSharedPost.media) && selectedSharedPost.media.length > 0
                ? selectedSharedPost.media
                : selectedSharedPost.thumbnail
                  ? [{ url: selectedSharedPost.thumbnail, type: "image" }]
                  : [],
            thumbnail: selectedSharedPost.thumbnail,
            likesCount: selectedSharedPost.likesCount || 0,
            commentsCount: selectedSharedPost.commentsCount || 0,
            createdAt: selectedSharedPost.createdAt,
            itemType: selectedSharedPost.itemType || "post",
          }}
          isOpen={Boolean(selectedSharedPost)}
          onClose={() => setSelectedSharedPost(null)}
        />
      )}

      {/* Confirmation Dialog before Message Deletion */}
      <DeleteMessageModal
        isOpen={Boolean(messageToDelete)}
        message={messageToDelete}
        repliesCount={repliesToDeleteCount}
        onClose={() => setMessageToDelete(null)}
        onConfirm={confirmDeleteMessage}
        loading={isDeletingMessage}
      />
    </div>
  );
}
