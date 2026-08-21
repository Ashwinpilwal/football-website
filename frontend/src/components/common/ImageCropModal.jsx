import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop as CropIcon,
  Check,
  RefreshCw,
  Move,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImageCropModal({
  isOpen,
  imageSrc,
  fileName = "cropped_image.jpg",
  title = "Crop Image",
  aspectRatio = 1, // 1 for avatar (1:1), 3 for cover (3:1)
  isCircular = false,
  onCropComplete,
  onClose,
}) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Reset states whenever modal opens or new image is provided
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setImageLoaded(false);
    }
  }, [isOpen, imageSrc]);

  // Handle Drag / Pan start
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Support for Mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setScale((prev) => Math.min(Math.max(0.5, prev + delta), 4));
  };

  // Rotate 90 deg clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset transform
  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Generate cropped output canvas and export file
  const handleApplyCrop = () => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const cropBox = containerRef.current.getBoundingClientRect();

    // Output target dimensions
    const outputWidth = aspectRatio === 1 ? 600 : 1200;
    const outputHeight = Math.round(outputWidth / aspectRatio);

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Enable high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Clear background
    ctx.clearRect(0, 0, outputWidth, outputHeight);

    // Calculate scale factor between UI crop frame and exported canvas
    const scaleRatio = outputWidth / cropBox.width;

    ctx.save();
    // Move origin to canvas center
    ctx.translate(outputWidth / 2, outputHeight / 2);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply scaling and translation
    const totalScale = scale * scaleRatio;
    ctx.scale(totalScale, totalScale);

    // If rotated 90 or 270, swap translation axes
    const rad = (-rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rotatedX = (position.x * cos - position.y * sin) / scale;
    const rotatedY = (position.x * sin + position.y * cos) / scale;

    // Render image centered
    const imgNaturalWidth = img.naturalWidth;
    const imgNaturalHeight = img.naturalHeight;

    // Base display size in UI before user scale
    // Calculate how the image was fitted inside cropbox
    const imgDisplayWidth = img.width;
    const imgDisplayHeight = img.height;

    // Ratio of intrinsic natural pixels to rendered CSS pixels
    const natRatio = imgNaturalWidth / imgDisplayWidth;

    ctx.drawImage(
      img,
      -imgDisplayWidth / 2 + rotatedX,
      -imgDisplayHeight / 2 + rotatedY,
      imgDisplayWidth,
      imgDisplayHeight
    );

    ctx.restore();

    // Convert canvas to Blob / File
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const cleanName = fileName.replace(/\.[^/.]+$/, "") + ".jpg";
        const croppedFile = new File([blob], cleanName, { type: "image/jpeg" });
        const croppedUrl = URL.createObjectURL(blob);
        onCropComplete(croppedFile, croppedUrl);
        onClose();
      },
      "image/jpeg",
      0.92
    );
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-lg w-full bg-[#0b1118] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-white flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CropIcon className="size-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-display">{title}</h3>
              <p className="text-[11px] text-neutral-400">Drag to reposition, use slider to zoom</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Viewport Workspace */}
        <div
          className="relative w-full bg-black/80 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 select-none touch-none cursor-grab active:cursor-grabbing"
          style={{ height: aspectRatio === 1 ? "280px" : "220px" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          {/* Moving Image */}
          <div
            className="absolute pointer-events-none transition-transform duration-75 origin-center will-change-transform"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            }}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Source to crop"
              onLoad={() => setImageLoaded(true)}
              className="max-w-none max-h-none object-contain"
              style={{
                width: aspectRatio === 1 ? "260px" : "360px",
                height: "auto",
              }}
              draggable={false}
            />
          </div>

          {/* Fixed Target Crop Box Frame */}
          <div
            ref={containerRef}
            className={`pointer-events-none absolute border-2 border-emerald-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] ${
              isCircular ? "rounded-full" : "rounded-2xl"
            }`}
            style={{
              width: aspectRatio === 1 ? "220px" : "90%",
              height: aspectRatio === 1 ? "220px" : `${Math.round(290 / aspectRatio)}px`,
              maxWidth: "420px",
            }}
          >
            {/* Corner guide markers */}
            {!isCircular && (
              <>
                <div className="absolute -top-1 -left-1 size-3.5 border-t-2 border-l-2 border-white" />
                <div className="absolute -top-1 -right-1 size-3.5 border-t-2 border-r-2 border-white" />
                <div className="absolute -bottom-1 -left-1 size-3.5 border-b-2 border-l-2 border-white" />
                <div className="absolute -bottom-1 -right-1 size-3.5 border-b-2 border-r-2 border-white" />
                {/* 3x3 Grid Overlay */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-25">
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-white" />
                  <div className="border-r border-white" />
                  <div />
                </div>
              </>
            )}
          </div>

          {/* Hint Overlay */}
          <div className="absolute top-2 left-2 pointer-events-none px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] text-neutral-300 font-medium flex items-center gap-1 border border-white/10">
            <Move className="size-3 text-emerald-400" />
            <span>Drag to position</span>
          </div>
        </div>

        {/* Controls (Zoom Slider & Rotate / Reset) */}
        <div className="space-y-3.5 pt-1">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
              className="size-8 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="size-4" />
            </button>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="range"
                min="0.5"
                max="3.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[11px] font-mono text-neutral-400 w-10 text-right">
                {Math.round(scale * 100)}%
              </span>
            </div>
            <button
              type="button"
              onClick={() => setScale((prev) => Math.min(3.5, prev + 0.1))}
              className="size-8 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="size-4" />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer text-xs font-semibold"
                title="Rotate 90°"
              >
                <RotateCw className="size-3.5 text-emerald-400" />
                <span>Rotate</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer text-xs font-semibold"
                title="Reset crop"
              >
                <RefreshCw className="size-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-neutral-500">
              {aspectRatio === 1 ? "1 : 1 (Square)" : "3 : 1 (Banner)"}
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs font-bold text-neutral-400 hover:text-white cursor-pointer px-4"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleApplyCrop}
            className="rounded-xl text-xs font-bold gap-1.5 px-5 cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <Check className="size-4" /> Apply & Save Crop
          </Button>
        </div>
      </div>
    </div>
  );
}
