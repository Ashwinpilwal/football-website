import React, { useEffect } from "react";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this comment?",
  loading = false,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 transition-opacity duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-[340px] w-full rounded-3xl bg-white dark:bg-[#0f1722] border border-neutral-200 dark:border-white/15 p-5 space-y-4 shadow-2xl relative dynamic-sidebar-shift transition-transform duration-200 ease-out will-change-transform cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Trash2 className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-display">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-7 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Message */}
        <div className="text-xs text-neutral-600 dark:text-neutral-300">
          <p className="leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="h-9 rounded-xl border-neutral-300 dark:border-white/15 hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-white font-semibold text-xs cursor-pointer"
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
