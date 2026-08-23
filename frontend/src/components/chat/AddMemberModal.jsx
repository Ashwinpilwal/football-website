import React, { useState, useEffect, useMemo } from "react";
import { X, Search, UserPlus, Check, Loader2, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatService } from "@/services/social.service";
import { getAvatarUrl } from "@/utils/avatar.utils";
import toast from "react-hot-toast";

export default function AddMemberModal({
  isOpen,
  onClose,
  chat,
  followingUsers = [],
  allUsers = [],
  onMembersAdded,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedUserIds(new Set());
    }
  }, [isOpen]);

  // Existing participant ID Set for quick lookup
  const existingParticipantIds = useMemo(() => {
    if (!chat?.participants) return new Set();
    return new Set(
      chat.participants.map((p) => (p._id || p?.id || p)?.toString())
    );
  }, [chat?.participants]);

  // Combined candidate pool of users: prioritized by followed users first, then rest of system users
  const candidateUsers = useMemo(() => {
    const map = new Map();

    // 1. Add following users first
    (Array.isArray(followingUsers) ? followingUsers : []).forEach((u) => {
      if (u && u._id) {
        map.set(u._id.toString(), { ...u, isFollowed: true });
      }
    });

    // 2. Add remaining system users
    (Array.isArray(allUsers) ? allUsers : []).forEach((u) => {
      if (u && u._id && !map.has(u._id.toString())) {
        map.set(u._id.toString(), { ...u, isFollowed: false });
      }
    });

    return Array.from(map.values());
  }, [followingUsers, allUsers]);

  // Filter candidates based on search
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return candidateUsers;

    return candidateUsers.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q)
    );
  }, [candidateUsers, searchQuery]);

  if (!isOpen || !chat) return null;

  const toggleSelectUser = (userId) => {
    if (existingParticipantIds.has(userId.toString())) return;

    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId.toString())) {
        next.delete(userId.toString());
      } else {
        next.add(userId.toString());
      }
      return next;
    });
  };

  const handleAddMembers = async () => {
    if (selectedUserIds.size === 0) {
      toast.error("Please select at least one player to add.");
      return;
    }

    setAdding(true);
    try {
      const memberIdsArray = Array.from(selectedUserIds);
      const res = await chatService.addMembersToGroupChat(chat._id, memberIdsArray);

      if (res?.data) {
        toast.success(`Added ${memberIdsArray.length} footballer(s) to ${chat.groupName}! ⚽🔥`);
        if (onMembersAdded) {
          onMembersAdded(res.data);
        }
        onClose();
      }
    } catch (err) {
      console.error("Add members error:", err);
      toast.error(err?.response?.data?.message || "Failed to add players to squad.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        className="w-full max-w-md bg-[#0b1118] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] transition-transform duration-200 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#070b10]/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <UserPlus className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-display">Add Members to Squad</h3>
              <p className="text-[11px] text-neutral-400">
                Squad: <strong className="text-emerald-400">{chat.groupName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-white/[0.06] bg-[#070b10]/40 shrink-0">
          <div className="relative">
            <Search className="size-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search footballers by name or @username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-9 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="size-5 rounded-full bg-white/10 text-neutral-300 flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-white/20 text-xs"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Players List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 custom-scrollbar min-h-[240px]">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const uId = (user._id || user.id).toString();
              const isAlreadyInGroup = existingParticipantIds.has(uId);
              const isSelected = selectedUserIds.has(uId);

              return (
                <div
                  key={uId}
                  onClick={() => !isAlreadyInGroup && toggleSelectUser(uId)}
                  className={`p-2.5 sm:p-3 rounded-2xl flex items-center justify-between gap-3 transition-all ${
                    isAlreadyInGroup
                      ? "bg-white/[0.02] border border-white/[0.03] opacity-60 cursor-not-allowed"
                      : isSelected
                      ? "bg-emerald-500/15 border border-emerald-500/40 cursor-pointer shadow-sm"
                      : "bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={getAvatarUrl(user)}
                      alt={user.fullName || user.username}
                      className="size-9 sm:size-10 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-white truncate">
                          {user.fullName || user.username}
                        </span>
                        {user.isFollowed && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 shrink-0">
                            Following
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400 block truncate font-medium">
                        @{user.username || "player"}
                      </span>
                    </div>
                  </div>

                  {/* Selection Indicator or Status */}
                  <div className="shrink-0">
                    {isAlreadyInGroup ? (
                      <span className="text-[10px] font-bold text-neutral-400 px-2 py-1 rounded-lg bg-white/[0.05] border border-white/5">
                        In Squad
                      </span>
                    ) : (
                      <div
                        className={`size-6 rounded-xl flex items-center justify-center border transition-all ${
                          isSelected
                            ? "bg-emerald-500 border-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/30 scale-105"
                            : "border-white/20 bg-black/40 text-transparent hover:border-emerald-400/60"
                        }`}
                      >
                        <Check className="size-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-neutral-400 space-y-2">
              <Users className="size-8 text-neutral-600 mx-auto" />
              <p className="font-semibold text-neutral-300">No footballers found</p>
              <p className="text-[11px] text-neutral-500">
                {searchQuery ? "Try searching with a different name or username." : "No candidates available to add."}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#070b10]/95 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-neutral-400 font-medium">
            {selectedUserIds.size > 0 ? (
              <span className="text-emerald-400 font-bold">
                {selectedUserIds.size} player{selectedUserIds.size === 1 ? "" : "s"} selected
              </span>
            ) : (
              <span>Select players to add</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={adding}
              className="rounded-xl px-3 text-xs font-bold cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAddMembers}
              disabled={adding || selectedUserIds.size === 0}
              className="rounded-xl px-4 text-xs font-bold gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              {adding ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <UserPlus className="size-3.5" />
                  <span>Add to Squad</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
