import React, { useState, useEffect } from "react";
import { X, Save, Trash2, FolderPlus, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postService, sectionService } from "@/services/social.service";
import PostMediaCarousel from "./PostMediaCarousel";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import CreateSectionModal from "@/components/profile/CreateSectionModal";
import toast from "react-hot-toast";

export default function EditPostModal({
  post,
  isOpen,
  onClose,
  onPostUpdated,
  onPostDeleted,
}) {
  const [caption, setCaption] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);

  useEffect(() => {
    if (post) {
      setCaption(post.caption || "");
      setSelectedSection(post.section?._id || post.section || "");
    }
  }, [post]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchSections = async () => {
      setLoadingSections(true);
      try {
        const res = await sectionService.getMySections();
        if (res?.data) {
          setSections(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.log("Error loading sections:", err);
      } finally {
        setLoadingSections(false);
      }
    };
    fetchSections();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await postService.updatePost(post._id, {
        caption: caption.trim(),
        sectionId: selectedSection || null,
      });

      const updated = res?.data || {
        ...post,
        caption: caption.trim(),
        section: sections.find((s) => s._id === selectedSection) || null,
      };

      toast.success("Post updated successfully!");
      if (onPostUpdated) onPostUpdated(updated);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update post.");
    } finally {
      setSaving(false);
    }
  };


  const confirmDeletePost = async () => {
    setDeleting(true);
    try {
      await postService.deletePost(post._id);
      toast.success("Post deleted successfully.");
      setIsDeleteConfirmOpen(false);
      if (onPostDeleted) onPostDeleted(post._id);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete post.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-black/80 transition-opacity duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-xl w-full bg-white dark:bg-[#0c1219] border border-neutral-200 dark:border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh] relative dynamic-sidebar-shift transition-transform duration-200 ease-out will-change-transform cursor-default"
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#080d14] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-display font-bold text-base text-neutral-900 dark:text-white">Edit Pitch Post</h3>
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
            {/* Post Media Preview */}
            <div className="rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200 dark:border-white/10 h-48 relative shadow-inner">
              <PostMediaCarousel
                media={post.media}
                thumbnail={post.thumbnail}
                fitCover={true}
                className="w-full h-full rounded-none border-0"
              />
            </div>

            {/* Caption Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                Post Caption / Highlights
              </label>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe your match play, tactical move, or pitch moment..."
                className="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500/50 resize-none font-medium leading-relaxed shadow-inner"
              />
            </div>

            {/* Section Assignment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                  <span>Channel Section (Optional)</span>
                  {loadingSections && <span className="text-[10px] text-neutral-400 lowercase">loading...</span>}
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreateSectionOpen(true)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <FolderPlus className="size-3.5" />
                  <span>+ Create Section</span>
                </button>
              </div>

              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
              >
                <option value="" className="bg-white dark:bg-[#0b1118] text-neutral-500 dark:text-neutral-400">
                  None (General Wall)
                </option>
                {sections.map((sec) => (
                  <option key={sec._id} value={sec._id} className="bg-white dark:bg-[#0b1118] text-neutral-900 dark:text-white">
                    📁 {sec.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fixed Sticky Action Footer */}
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-[#080d14] flex items-center justify-between shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(true)}
              disabled={deleting || saving}
              className="rounded-xl text-xs h-10 px-4 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/15 hover:text-red-500 cursor-pointer font-bold gap-1.5"
            >
              <Trash2 className="size-3.5" />
              <span>Delete Post</span>
            </Button>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="rounded-xl text-xs h-10 px-4 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={saving || deleting}
                className="rounded-xl text-xs font-bold h-10 px-5 shadow-md shadow-emerald-500/20 cursor-pointer gap-1.5"
              >
                <Save className="size-3.5" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirm Delete Post Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        message="Are you sure you want to permanently delete this post and its media highlights? This action cannot be undone."
        loading={deleting}
      />

      {/* Quick Create Section Modal */}
      <CreateSectionModal
        isOpen={isCreateSectionOpen}
        onClose={() => setIsCreateSectionOpen(false)}
        onSectionCreated={(newSection) => {
          if (newSection?._id) {
            setSections((prev) => [newSection, ...prev]);
            setSelectedSection(newSection._id);
          }
        }}
      />
    </div>
  );
}
