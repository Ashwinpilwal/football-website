import React, { useState, memo, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomVideoPlayer from "./CustomVideoPlayer";

function PostMediaCarouselComponent({
  media = [],
  thumbnail = null,
  fitCover = false,
  className = "",
  onMediaClick = null,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch gesture coordinates for finger slide
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const minSwipeDistance = 35; // Minimum px distance to trigger slide

  // Normalize media items into an array
  const mediaList = Array.isArray(media) && media.length > 0
    ? media
    : thumbnail
    ? [{ url: thumbnail.url || thumbnail, type: "image" }]
    : [];

  const totalMedia = mediaList.length;

  const handlePrev = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const handleNext = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setCurrentIndex((prev) => (prev < totalMedia - 1 ? prev + 1 : prev));
  }, [totalMedia]);

  // Touch event handlers for finger sliding
  const handleTouchStart = (e) => {
    if (!e.targetTouches || e.targetTouches.length === 0) return;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!e.targetTouches || e.targetTouches.length === 0) return;
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (totalMedia <= 1) return;
    const distanceX = touchStartX.current - touchEndX.current;
    const distanceY = touchStartY.current - touchEndY.current;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) {
        // Swiped Left -> show next image without wrapping
        if (currentIndex < totalMedia - 1) {
          handleNext(e);
        }
      } else {
        // Swiped Right -> show previous image without wrapping
        if (currentIndex > 0) {
          handlePrev(e);
        }
      }
    }
  };

  if (mediaList.length === 0) return null;

  return (
    <div
      onClick={(e) => {
        if (onMediaClick) {
          onMediaClick(e);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ contain: "paint", aspectRatio: "3 / 4" }}
      className={`relative overflow-hidden select-none group w-full cursor-pointer touch-pan-y aspect-[3/4] rounded-2xl border border-neutral-200 dark:border-white/10 bg-black ${
        className ? className : ""
      }`}
    >
      {/* 60/120/144FPS GPU-Accelerated Hardware Track */}
      <div
        className="flex w-full h-full pointer-events-none"
        style={{
          transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
          transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
      >
        {mediaList.map((item, idx) => {
          const mediaUrl = item?.url || item;
          const isVideo =
            item?.type === "video" ||
            (typeof mediaUrl === "string" && mediaUrl.match(/\.(mp4|webm|mov|ogg)$/i));

          return (
            <div
              key={idx}
              className="w-full h-full shrink-0 flex items-center justify-center min-w-full bg-black overflow-hidden pointer-events-auto aspect-[3/4]"
              style={{
                aspectRatio: "3 / 4",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "translateZ(0)",
              }}
            >
              {isVideo ? (
                <CustomVideoPlayer
                  src={mediaUrl}
                  fitCover={fitCover}
                  className="w-full h-full"
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={`Slide ${idx + 1}`}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  className="w-full h-full max-w-full max-h-full object-contain select-none pointer-events-none"
                  style={{
                    objectFit: "contain",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "translateZ(0)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Multi-image navigation controls */}
      {mediaList.length > 1 && (
        <>
          {/* Left Button (only when not on first image) */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 size-7 sm:size-8 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer z-20 animate-in fade-in duration-150"
              title="Previous image"
            >
              <ChevronLeft className="size-4 sm:size-5 stroke-[2.5]" />
            </button>
          )}

          {/* Right Button (only when not on last image) */}
          {currentIndex < totalMedia - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 size-7 sm:size-8 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer z-20 animate-in fade-in duration-150"
              title="Next image"
            >
              <ChevronRight className="size-4 sm:size-5 stroke-[2.5]" />
            </button>
          )}

          {/* Slide Counter Badge */}
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/80 text-white text-[10px] sm:text-[11px] font-bold tracking-wider z-20 pointer-events-none">
            {currentIndex + 1} / {mediaList.length}
          </div>

          {/* Indicator Dots */}
          <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 pointer-events-none z-20">
            {mediaList.map((_, idx) => (
              <span
                key={idx}
                className={`size-1.5 rounded-full transition-[width,background-color] duration-200 ease-out ${
                  idx === currentIndex
                    ? "bg-emerald-400 w-3 sm:w-3.5"
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default memo(PostMediaCarouselComponent);
