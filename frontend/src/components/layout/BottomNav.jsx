import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  MapPin,
  Radio,
  Users,
  MessageCircle,
  Sparkles,
  User,
} from "lucide-react";
import { socket } from "@/utils/socket";
import { chatService } from "@/services/social.service";
import { getAvatarUrl } from "@/utils/avatar.utils";

export default function BottomNav() {
  const location = useLocation();
  const { userData, status } = useSelector((state) => state.auth);

  const [hasUnreadMessages, setHasUnreadMessages] = useState(() => {
    try {
      return localStorage.getItem("has_unread_messages") === "true";
    } catch {
      return false;
    }
  });

  // Clear unread badge when user navigates to messages
  useEffect(() => {
    if (location.pathname === "/messages") {
      setHasUnreadMessages(false);
      try {
        localStorage.removeItem("has_unread_messages");
        localStorage.setItem("last_seen_messages_timestamp", Date.now().toString());
      } catch (err) {
        console.error(err);
      }
    }
  }, [location.pathname]);

  // Initial check for unread messages
  useEffect(() => {
    if (!status || !userData) {
      setHasUnreadMessages(false);
      return;
    }

    const checkExistingUnread = async () => {
      try {
        if (location.pathname === "/messages") return;
        const res = await chatService.getAllUserChats();
        const chats = res?.data || res || [];
        if (!Array.isArray(chats)) return;

        const lastSeen = Number(localStorage.getItem("last_seen_messages_timestamp") || 0);
        const myId = String(userData._id || userData.id || "");

        const hasNew = chats.some((chat) => {
          const lastMsg = chat.lastMessage;
          if (!lastMsg) return false;
          const senderId = String(lastMsg.sender?._id || lastMsg.sender || "");
          if (!senderId || senderId === myId) return false;

          const msgTime = new Date(lastMsg.createdAt || chat.updatedAt || 0).getTime();
          return msgTime > lastSeen;
        });

        if (hasNew) {
          setHasUnreadMessages(true);
          localStorage.setItem("has_unread_messages", "true");
        }
      } catch (err) {
        console.log("BottomNav unread check error:", err);
      }
    };

    checkExistingUnread();
  }, [status, userData?._id, location.pathname]);

  // Socket listener for incoming messages
  useEffect(() => {
    if (!status || !userData) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handleIncomingMessage = (newMsg) => {
      const senderId = String(newMsg?.sender?._id || newMsg?.sender || "");
      const myId = String(userData._id || userData.id || "");

      if (senderId && senderId !== myId) {
        if (window.location.pathname !== "/messages") {
          setHasUnreadMessages(true);
          try {
            localStorage.setItem("has_unread_messages", "true");
          } catch (err) {
            console.error(err);
          }
        }
      }
    };

    socket.on("receive-message", handleIncomingMessage);
    return () => {
      socket.off("receive-message", handleIncomingMessage);
    };
  }, [status, userData?._id]);

  const navLinks = [
    {
      name: "Home",
      to: "/",
      icon: Home,
    },
    {
      name: "Turfs",
      to: "/find-turfs",
      icon: MapPin,
    },
    {
      name: "Radar",
      to: "/live-turfs",
      icon: Radio,
      badge: "LIVE",
    },
    {
      name: "Feed",
      to: "/feed",
      icon: Users,
    },
    {
      name: "Chat",
      to: "/messages",
      icon: MessageCircle,
      hasDot: hasUnreadMessages,
    },
    {
      name: status && userData ? "Profile" : "Sign In",
      to: status && userData?.username ? `/channel/${userData.username}` : "/login",
      icon: User,
      isAvatar: Boolean(status && userData),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0c121a]/95 dark:bg-[#070b10]/95 backdrop-blur-xl border-t border-neutral-300/40 dark:border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.3)] transition-all"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      aria-label="Mobile Navigation Bar"
    >
      <div className="flex items-center justify-around px-2 pt-2">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[50px] py-1 px-1 rounded-2xl relative transition-all duration-200 ${isActive
                  ? "text-emerald-500 dark:text-emerald-400 font-bold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon or Avatar */}
                  <div className="relative flex items-center justify-center size-7 mb-0.5">
                    {item.isAvatar ? (
                      <img
                        src={getAvatarUrl(userData)}
                        alt={userData.fullName || "Avatar"}
                        className={`size-6 rounded-lg object-cover ring-1 transition-all ${isActive
                          ? "ring-emerald-400 scale-110 shadow-sm shadow-emerald-500/40"
                          : "ring-white/20"
                          }`}
                      />
                    ) : (
                      <Icon
                        className={`size-5 transition-transform duration-200 ${isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
                          }`}
                      />
                    )}

                    {/* Unread red dot */}
                    {item.hasDot && !isActive && (
                      <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-rose-500 ring-2 ring-[#0c121a] animate-pulse" />
                    )}

                    {/* Live pulse dot for radar */}
                    {item.badge === "LIVE" && !isActive && (
                      <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>

                  {/* Label */}
                  <span className="text-[10px] tracking-tight leading-none truncate max-w-[54px]">
                    {item.name}
                  </span>

                  {/* Active bottom glow bar */}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-3 h-0.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
