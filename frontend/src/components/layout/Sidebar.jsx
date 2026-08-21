import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Home,
  MapPin,
  Radio,
  Users,
  MessageCircle,
  CalendarDays,
  User,
  Settings,
  LogOut,
  PlusCircle,
  Activity,
  Compass,
  Sparkles,
} from "lucide-react";
import { sliceLogout } from "@/features/authSlice";
import { authService } from "@/services/auth.service";
import { chatService } from "@/services/social.service";
import { socket } from "@/utils/socket";
import toast from "react-hot-toast";

export default function Sidebar({ onCloseMobile, isMobile = false, isExpanded = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const routeLocation = useLocation();
  const { userData, status } = useSelector((state) => state.auth);
  const userLocation = useSelector((state) => state.location);

  const [hasUnreadMessages, setHasUnreadMessages] = useState(() => {
    try {
      return localStorage.getItem("has_unread_messages") === "true";
    } catch {
      return false;
    }
  });

  // Clear unread badge when user navigates to messages page
  useEffect(() => {
    if (routeLocation.pathname === "/messages") {
      setHasUnreadMessages(false);
      try {
        localStorage.removeItem("has_unread_messages");
        localStorage.setItem("last_seen_messages_timestamp", Date.now().toString());
      } catch (err) {
        console.error(err);
      }
    }
  }, [routeLocation.pathname]);

  // Initial check: inspect user's chats for any messages received after last seen timestamp
  useEffect(() => {
    if (!status || !userData) {
      setHasUnreadMessages(false);
      return;
    }

    const checkExistingUnread = async () => {
      try {
        if (routeLocation.pathname === "/messages") return;

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
        console.log("Unread messages check error:", err);
      }
    };

    checkExistingUnread();
  }, [status, userData?._id, routeLocation.pathname]);

  // Global socket listener: show red dot when ANY message is received for the user
  useEffect(() => {
    if (!status || !userData) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handleIncomingMessage = (newMsg) => {
      const senderId = String(newMsg?.sender?._id || newMsg?.sender || "");
      const myId = String(userData._id || userData.id || "");

      // If message is from another user/pitch owner/squad member
      if (senderId && senderId !== myId) {
        // If not currently inside the messages page, show the red dot
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

  const handleLogout = async () => {
    try {
      if (socket.connected) {
        socket.disconnect();
      }
      await authService.logout();
    } catch (e) {
      console.log("Logout error:", e);
    }
    dispatch(sliceLogout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { name: "Home Feed", path: "/", icon: Home },
    { name: "Football AI", path: "/ai", icon: Sparkles, badge: "AI" },
    { name: "Find Turfs", path: "/find-turfs", icon: MapPin },
    { name: "Live Radar", path: "/live-turfs", icon: Radio, badge: "LIVE" },
    { name: "Community", path: "/feed", icon: Users },
    { name: "Messages", path: "/messages", icon: MessageCircle },
    { name: "My Bookings", path: "/my-bookings", icon: CalendarDays },
    {
      name: "Player Profile",
      path: userData?.username ? `/channel/${userData.username}` : "/login",
      icon: User,
    },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  if (isMobile) {
    return (
      <aside className="w-72 h-full bg-[#0e1520] border-r border-white/10 flex flex-col p-6 overflow-y-auto">
        {/* Brand */}
        <div className="flex items-center gap-3.5 mb-8">
          <div className="size-11 rounded-2xl bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-bold overflow-hidden p-2">
            <img
              src="/assets/football.png"
              alt="REMONTADA Logo"
              className="size-full object-contain"
            />
          </div>
          <div>
            <span className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5">
              REMONTADA
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span className="text-neutral-400 text-xs font-medium">Matchday & Turf Network</span>
          </div>
        </div>

        {/* Mobile Navigation List */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${isActive
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm"
                    : "text-neutral-300 hover:text-white hover:bg-white/[0.04]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <Icon className="size-4.5 text-emerald-400" />
                        {item.path === "/messages" && hasUnreadMessages && !isActive && (
                          <span className="absolute -top-1 -right-1 size-2 rounded-full bg-rose-500 ring-2 ring-[#0e1520] animate-pulse" />
                        )}
                      </div>
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.path === "/messages" && hasUnreadMessages && !isActive && (
                        <span className="size-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-[#0e1520]" />
                      )}
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Create Post Action */}
        <div className="my-4">
          <NavLink
            to="/create-post"
            onClick={onCloseMobile}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm shadow-md shadow-emerald-500/20"
          >
            <PlusCircle className="size-4.5 stroke-[2.5]" />
            <span>New Match Post</span>
          </NavLink>
        </div>

        {/* Auth / Logout */}
        {status ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        ) : (
          <NavLink
            to="/login"
            onClick={onCloseMobile}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white/10 text-white text-sm font-semibold border border-white/10"
          >
            <span>Sign In / Join</span>
          </NavLink>
        )}
      </aside>
    );
  }

  // Instagram-Style Hover-Expanding Floating Sidebar for Desktop (Hardware Accelerated)
  return (
    <aside
      className={`h-[calc(100vh-3rem)] fixed top-6 left-6 z-40 rounded-[32px] bg-[#0e1520] border border-white/10 shadow-2xl flex flex-col items-start py-5 justify-between select-none sidebar-desktop-aside overflow-hidden ${
        isExpanded ? "w-64" : "w-20"
      }`}
      style={{ isolation: "isolate" }}
    >
      {/* Brand Icon & Name */}
      <NavLink
        to="/"
        className="w-full flex items-center px-3.5 gap-3.5 group shrink-0"
        title="REMONTADA Home"
      >
        <div className="size-11 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform duration-300 shrink-0 font-bold overflow-hidden p-2 group-hover:rotate-12">
          <img
            src="/assets/football.png"
            alt="REMONTADA Logo"
            className="size-full object-contain"
          />
        </div>
        <div
          className={`sidebar-text-reveal whitespace-nowrap overflow-hidden ${
            isExpanded
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 pointer-events-none"
          }`}
        >
          <span className="font-display font-black text-lg tracking-tight text-white flex items-center gap-1.5">
            REMONTADA
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          </span>
          <span className="text-[11px] text-neutral-400 block font-medium">Matchday & Turf Network</span>
        </div>
      </NavLink>

      {/* Navigation List */}
      <nav className="flex flex-col gap-1.5 items-start w-full px-2.5 my-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `w-full h-11 rounded-2xl flex items-center transition-colors duration-200 group cursor-pointer overflow-hidden ${
                  isActive
                    ? "bg-emerald-500 text-neutral-950 font-bold shadow-lg shadow-emerald-500/25"
                    : "text-neutral-300 hover:text-white hover:bg-white/[0.08]"
                }`
              }
              title={item.name}
            >
              {({ isActive }) => (
                <div className="flex items-center w-full px-3.5 gap-3.5">
                  <div className="relative shrink-0 flex items-center justify-center size-6">
                    <Icon
                      className={`size-5 transition-transform duration-300 group-hover:scale-110 ${
                        isActive ? "stroke-[2.5]" : ""
                      }`}
                    />

                    {/* Micro red dot indicator for unread messages */}
                    {item.path === "/messages" && hasUnreadMessages && !isActive && (
                      <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-rose-500 ring-2 ring-[#0e1520] animate-pulse shadow-sm shadow-rose-500/60" />
                    )}
                  </div>

                  {/* Text Label: revealed when expanded */}
                  <span
                    className={`sidebar-text-reveal text-sm font-semibold whitespace-nowrap overflow-hidden flex-1 ${
                      isExpanded
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2 pointer-events-none"
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Badge when expanded */}
                  {item.badge && !isActive && (
                    <span
                      className={`sidebar-text-reveal text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0 ${
                        isExpanded
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-90 pointer-events-none"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions (Create Post + Logout) */}
      <div className="flex flex-col items-start gap-2 w-full px-2.5 pt-3 border-t border-white/10 shrink-0">
        <NavLink
          to="/create-post"
          className="w-full h-11 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-400 border border-emerald-500/30 flex items-center transition-colors duration-200 shadow-md group cursor-pointer overflow-hidden"
          title="Create New Post"
        >
          <div className="flex items-center w-full px-3.5 gap-3.5">
            <div className="shrink-0 flex items-center justify-center size-6">
              <PlusCircle className="size-5 stroke-[2.2] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span
              className={`sidebar-text-reveal text-sm font-bold whitespace-nowrap overflow-hidden truncate ${
                isExpanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2 pointer-events-none"
              }`}
            >
              New Match Post
            </span>
          </div>
        </NavLink>

        {status ? (
          <button
            onClick={handleLogout}
            className="w-full h-10 rounded-2xl hover:bg-red-500/15 text-neutral-400 hover:text-red-400 flex items-center transition-colors duration-200 cursor-pointer overflow-hidden"
            title="Sign Out"
          >
            <div className="flex items-center w-full px-3.5 gap-3.5">
              <div className="shrink-0 flex items-center justify-center size-6">
                <LogOut className="size-4.5" />
              </div>
              <span
                className={`sidebar-text-reveal text-sm font-semibold whitespace-nowrap overflow-hidden truncate ${
                  isExpanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 pointer-events-none"
                }`}
              >
                Sign Out
              </span>
            </div>
          </button>
        ) : (
          <NavLink
            to="/login"
            className="w-full h-10 rounded-2xl bg-white/10 hover:bg-white/15 text-white flex items-center transition-colors duration-200 cursor-pointer border border-white/10 overflow-hidden"
            title="Sign In / Join"
          >
            <div className="flex items-center w-full px-3.5 gap-3.5">
              <div className="shrink-0 flex items-center justify-center size-6">
                <User className="size-4.5" />
              </div>
              <span
                className={`sidebar-text-reveal text-sm font-semibold whitespace-nowrap overflow-hidden truncate ${
                  isExpanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 pointer-events-none"
                }`}
              >
                Sign In
              </span>
            </div>
          </NavLink>
        )}
      </div>
    </aside>
  );
}
