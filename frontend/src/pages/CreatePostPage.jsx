import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Upload,
  Image as ImageIcon,
  X,
  PlusCircle,
  ChevronLeft,
  GripHorizontal,
  ChevronRight as ChevronRightIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { postService } from "@/services/social.service";
import { getAvatarUrl } from "@/utils/avatar.utils";
import toast from "react-hot-toast";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { userData, status } = useSelector((state) => state.auth);

  const [caption, setCaption] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Drag and Drop reordering state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleFilesSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setMediaFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setMediaPreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveMedia = (index) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
    setMediaPreviews(mediaPreviews.filter((_, i) => i !== index));
  };

  // Reorder helper
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Drag event handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (index) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setMediaFiles((prev) => reorder(prev, draggedIndex, dropIndex));
    setMediaPreviews((prev) => reorder(prev, draggedIndex, dropIndex));

    if (dropIndex === 0 || draggedIndex === 0) {
      toast.success("Cover image updated!", { id: "cover-update", duration: 1500 });
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Button move helpers
  const moveItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= mediaPreviews.length) return;
    setMediaFiles((prev) => reorder(prev, fromIndex, toIndex));
    setMediaPreviews((prev) => reorder(prev, fromIndex, toIndex));
  };

  const setAsCover = (index) => {
    if (index === 0) return;
    setMediaFiles((prev) => reorder(prev, index, 0));
    setMediaPreviews((prev) => reorder(prev, index, 0));
    toast.success("Set as post cover!");
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!status) {
      toast.error("Please sign in to publish posts.");
      navigate("/login");
      return;
    }

    if (!mediaFiles.length) {
      toast.error("At least one image or video is required.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      mediaFiles.forEach((file) => {
        formData.append("media", file);
      });

      await postService.createPost(formData);
      toast.success("Post published to FootballHub feed!");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to publish post.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">Create Match Post</h1>
            <p className="text-xs text-neutral-400">Share match highlights, goals, boots, and pitch updates.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form onSubmit={handlePublish} className="lg:col-span-7 space-y-6">
          {/* Dropzone Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-emerald-400", "bg-emerald-500/10");
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-emerald-400", "bg-emerald-500/10");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-emerald-400", "bg-emerald-500/10");
              const files = Array.from(e.dataTransfer.files || []);
              if (files.length) {
                setMediaFiles((prev) => [...prev, ...files]);
                const previews = files.map((file) => URL.createObjectURL(file));
                setMediaPreviews((prev) => [...prev, ...previews]);
                toast.success(`Added ${files.length} media file${files.length > 1 ? "s" : ""}!`);
              }
            }}
            className="p-7 rounded-3xl bg-[#0b1118] border-2 border-dashed border-white/15 hover:border-emerald-500/50 transition-all text-center space-y-3 shadow-xl"
          >
            <div className="size-13 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <Upload className="size-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">Drag & Drop Photos & Videos Here</h4>
              <p className="text-xs text-neutral-400 mt-0.5">or browse from your device (Supports MP4, MOV, PNG, JPG)</p>
            </div>

            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-extrabold cursor-pointer transition-all shadow-md">
              <ImageIcon className="size-4 text-neutral-950" />
              <span>Browse Files</span>
              <input type="file" multiple accept="image/*,video/*" onChange={handleFilesSelect} className="hidden" />
            </label>
          </div>

          {/* Interactive Drag & Drop Reordering Strip */}
          {mediaPreviews.length > 0 && (
            <div className="p-5 rounded-3xl bg-[#0b1118] border border-white/10 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripHorizontal className="size-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white font-display">
                    Selected Media ({mediaPreviews.length})
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 font-medium">
                  Hold & drag left/right to reorder cover
                </span>
              </div>

              <div className="flex flex-wrap gap-3.5 pt-1">
                {mediaPreviews.map((src, idx) => {
                  const isCover = idx === 0;
                  const isDragging = draggedIndex === idx;
                  const isDragOver = dragOverIndex === idx;

                  return (
                    <div
                      key={src + idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragLeave={() => handleDragLeave(idx)}
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`relative size-28 rounded-2xl overflow-hidden bg-neutral-950 border transition-all select-none cursor-grab active:cursor-grabbing group shadow-md ${isCover
                        ? "ring-2 ring-emerald-500 border-emerald-400 shadow-emerald-500/20"
                        : "border-white/10 hover:border-white/30"
                        } ${isDragging ? "opacity-40 scale-95 border-dashed border-emerald-400" : ""} ${isDragOver && !isDragging
                          ? "border-emerald-400 scale-105 ring-2 ring-emerald-400/50 bg-emerald-500/10"
                          : ""
                        }`}
                    >
                      <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover pointer-events-none" />

                      {/* Position / Cover Badge */}
                      <div className="absolute top-1.5 left-1.5 pointer-events-none">
                        {isCover ? (
                          <Badge variant="emerald" className="text-[9px] px-2 py-0.5 font-black shadow-md">
                            COVER
                          </Badge>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-black/80 text-neutral-300 border border-white/10 font-mono">
                            #{idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveMedia(idx);
                        }}
                        className="absolute top-1.5 right-1.5 size-6 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer shadow-md"
                        title="Remove"
                      >
                        <X className="size-3" />
                      </button>

                      {/* Quick Move / Set as Cover Hover Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => moveItem(idx, idx - 1)}
                            className="size-5 rounded-md bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-[10px] cursor-pointer"
                            title="Move Left"
                          >
                            ←
                          </button>
                        )}

                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => setAsCover(idx)}
                            className="text-[9.5px] font-bold text-emerald-400 hover:underline px-1 cursor-pointer"
                          >
                            Set Cover
                          </button>
                        )}

                        {idx < mediaPreviews.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveItem(idx, idx + 1)}
                            className="size-5 rounded-md bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-[10px] cursor-pointer ml-auto"
                            title="Move Right"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption" className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Caption & Matchday Notes
            </Label>
            <Textarea
              id="caption"
              rows={4}
              placeholder="What happened in this match? Mention turf venue, scoreline, or team shoutouts..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="rounded-2xl bg-[#0b1118] border-white/10 text-sm font-medium focus:border-emerald-500"
            />
          </div>

          <Button
            type="submit"
            disabled={isUploading || mediaFiles.length === 0}
            variant="primary"
            className="w-full py-4 rounded-2xl font-bold text-sm shadow-xl cursor-pointer"
          >
            {isUploading ? "Uploading to Cloudinary..." : "Publish Post"}
          </Button>
        </form>

        {/* Right: Live Preview showing Media[0] Cover */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Live Post Preview</span>
            {mediaPreviews.length > 0 && (
              <span className="text-[11px] text-emerald-400 font-bold font-mono">
                Cover: Item #1 of {mediaPreviews.length}
              </span>
            )}
          </div>

          <Card className="p-6 bg-[#0b1118] border-white/10 space-y-4.5 rounded-3xl shadow-2xl sticky top-24">
            <div className="flex items-center gap-3">
              <img
                src={getAvatarUrl(userData, userData?.fullName || "Your Name")}
                alt="user"
                className="size-11 rounded-2xl object-cover ring-1 ring-emerald-500/40 shadow-sm"
              />
              <div>
                <h4 className="text-sm font-bold text-white font-display">{userData?.fullName || "Your Name"}</h4>
                <span className="text-xs text-neutral-400">@{userData?.username || "username"} • Just now</span>
              </div>
            </div>

            <p className="text-sm text-neutral-200 leading-relaxed min-h-[36px] font-normal">
              {caption || "Your caption will appear here..."}
            </p>

            {/* Dynamic Cover Image Display reflecting mediaPreviews[0] */}
            <div className="h-56 sm:h-64 rounded-2xl overflow-hidden bg-neutral-950 border border-white/10 relative shadow-inner">
              {mediaPreviews.length > 0 ? (
                <>
                  <img
                    src={mediaPreviews[0]}
                    alt="Cover Preview"
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/85 text-[10px] font-extrabold text-emerald-400 border border-white/10">
                    FEED COVER
                  </div>
                  {mediaPreviews.length > 1 && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/85 text-[10px] font-bold text-white border border-white/10 font-mono">
                      +{mediaPreviews.length - 1} more media
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-2 text-neutral-500">
                  <ImageIcon className="size-8 text-neutral-600" />
                  <span className="text-xs">No media attached</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
