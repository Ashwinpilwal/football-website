import React, { useState, useEffect } from "react";
import { X, FolderPlus, Upload, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sectionService } from "@/services/social.service";
import toast from "react-hot-toast";

export default function CreateSectionModal({
  isOpen,
  onClose,
  onSectionCreated,
}) {
  const [name, setName] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset form when opened/closed
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setCoverImageFile(null);
      setCoverImagePreview(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setCoverImageFile(file);
    setCoverImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Section name is required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }

      const res = await sectionService.createSection(formData);
      const createdSection = res?.data || res;

      toast.success(`Section "${name.trim()}" created successfully!`);
      if (onSectionCreated) {
        onSectionCreated(createdSection);
      }
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 bg-black/80 transition-opacity duration-150 cursor-pointer backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full rounded-3xl bg-white dark:bg-[#0c1219] border border-neutral-200 dark:border-white/15 overflow-hidden shadow-2xl relative dynamic-sidebar-shift transition-transform duration-200 ease-out will-change-transform cursor-default flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#080d14] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <FolderPlus className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white font-display leading-tight">
                Create Channel Section
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                Organize your highlights, clips, and match posts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5">
          {/* Section Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Section Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={40}
              placeholder="e.g. Free Kicks, Match Highlights, Skills"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500/50 font-medium transition-all"
            />
          </div>

          {/* Optional Cover Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
              <span>Cover Image (Optional)</span>
              {coverImagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-[11px] text-rose-500 hover:underline cursor-pointer lowercase"
                >
                  remove image
                </button>
              )}
            </label>

            {coverImagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 h-36 bg-neutral-950 group">
                <img
                  src={coverImagePreview}
                  alt="Section cover preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="px-3.5 py-1.5 rounded-xl bg-white/90 text-neutral-900 text-xs font-bold shadow-lg cursor-pointer hover:bg-white transition-colors">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-white/10 hover:border-emerald-500/50 bg-neutral-50/50 dark:bg-black/20 hover:bg-emerald-500/[0.03] transition-all cursor-pointer group">
                <div className="size-10 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
                  <Upload className="size-4.5" />
                </div>
                <div className="text-center space-y-0.5">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 group-hover:text-emerald-500 transition-colors">
                    Click to upload cover image
                  </span>
                  <span className="text-[10px] text-neutral-400 block">
                    PNG, JPG, WEBP up to 5MB
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200 dark:border-white/[0.08]">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl text-xs h-10 px-4 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer font-semibold"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={loading || !name.trim()}
              className="rounded-xl text-xs font-bold h-10 px-5 shadow-md shadow-emerald-500/20 cursor-pointer gap-1.5"
            >
              {loading ? (
                <>
                  <span className="size-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FolderPlus className="size-3.5" />
                  <span>Create Section</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
