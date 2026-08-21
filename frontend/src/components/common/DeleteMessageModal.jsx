import React, { useEffect } from "react";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteMessageModal({
  isOpen,
  message,
  repliesCount = 0,
  onClose,
  onConfirm,
  loading = false,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !message) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 transition-opacity duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-[340px] w-full rounded-2xl bg-[#0f1722] border border-white/15 p-5 space-y-4 shadow-2xl relative transition-transform duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
              <Trash2 className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-display">
              Confirm Delete
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-7 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Message preview / description */}
        <div className="space-y-1.5 text-xs text-neutral-300">
          <p className="line-clamp-2 italic text-neutral-400 bg-black/30 p-2.5 rounded-xl border border-white/5">
            "{message.message || "Attachment"}"
          </p>
          <p className="text-[11.5px] text-neutral-400 pt-0.5">
            {repliesCount > 0
              ? `Delete this message and its ${repliesCount} ${repliesCount === 1 ? "reply" : "replies"} for everyone?`
              : "Are you sure you want to delete this message for everyone?"}
          </p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="h-9 rounded-xl border-white/15 hover:bg-white/10 text-white font-semibold text-xs cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className="h-9 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Confirm Delete</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
