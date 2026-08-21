import React, { useState, useEffect, useRef } from "react";
import { X, Camera, Users, Loader2, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatService } from "@/services/social.service";
import toast from "react-hot-toast";

export default function EditGroupModal({ isOpen, onClose, chat, onGroupUpdated }) {
  const [groupName, setGroupName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [removeIcon, setRemoveIcon] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chat && isOpen) {
      setGroupName(chat.groupName || "");
      setPreviewUrl(chat.groupIcon || null);
      setSelectedFile(null);
      setRemoveIcon(false);
    }
  }, [chat, isOpen]);

  if (!isOpen || !chat) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file (PNG, JPG, WEBP).");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image file size must be under 10MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRemoveIcon(false);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRemoveIcon(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.error("Please provide a squad group name.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("groupName", groupName.trim());

      if (selectedFile) {
        formData.append("groupIcon", selectedFile);
      } else if (removeIcon) {
        formData.append("groupIcon", "");
      }

      const res = await chatService.updateGroupChat(chat._id, formData);
      if (res?.data) {
        toast.success("Squad group updated successfully! ⚽✨");
        if (onGroupUpdated) {
          onGroupUpdated(res.data);
        }
        onClose();
      }
    } catch (err) {
      console.error("Update group error:", err);
      toast.error(err?.response?.data?.message || "Failed to update squad group.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200 cursor-pointer">
      <div
        className="w-full max-w-md bg-[#0b1118] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 dynamic-sidebar-shift transition-transform duration-200 ease-out will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#070b10]/80">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="size-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-display">Edit Squad Group</h3>
              <p className="text-[11px] text-neutral-400">All squad members can update details</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Group Profile Picture Picker */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative group">
              <div className="size-24 rounded-3xl overflow-hidden bg-neutral-950 border-2 border-emerald-500/40 ring-4 ring-emerald-500/10 flex items-center justify-center shadow-xl">
                {previewUrl ? (
                  <img src={previewUrl} alt="Group Icon" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500/25 to-emerald-800/40 flex items-center justify-center text-emerald-400">
                    <Users className="size-10" />
                  </div>
                )}
              </div>

              {/* Upload Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-3xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md gap-1"
                title="Change Group Icon"
              >
                <Camera className="size-6 text-emerald-400" />
                <span className="text-[10px] font-bold">Change</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Camera className="size-3.5 text-emerald-400" />
                <span>{previewUrl ? "Change Photo" : "Upload Photo"}</span>
              </button>

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-semibold text-red-300 hover:text-red-200 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Remove custom photo"
                >
                  <Trash2 className="size-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          {/* Group Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
              Squad Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Users className="size-4 text-emerald-400" />
              </div>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Real Madrid Fans / Sunday Pitch Squad"
                maxLength={60}
                required
                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-black/60 border border-white/15 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
              />
            </div>
            <p className="text-[11px] text-neutral-500">
              Pick a recognizable squad name for all participating footballers.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-2xl py-3 text-xs font-bold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving || !groupName.trim()}
              className="flex-1 rounded-2xl py-3 text-xs font-bold gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="size-4 stroke-[3]" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
