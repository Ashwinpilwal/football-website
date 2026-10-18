import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  RotateCcw,
} from "lucide-react";
import { getCloudinaryVideoThumbnail } from "@/utils/cloudinary.utils";

export default function CustomVideoPlayer({
  src,
  poster = null,
  fitCover = false,
  className = "",
  autoPlay = false,
  isActive = true,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideControlsTimeout = useRef(null);

  const resolvedPoster = poster || getCloudinaryVideoThumbnail(src);
  const [hasStartedPlay, setHasStartedPlay] = useState(autoPlay);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(autoPlay);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  // Sound is enabled all the time by default (unmuted, volume 1)
  // Track viewport visibility, active carousel status, and manual user pause
  const isVisibleRef = useRef(false);
  const isActiveRef = useRef(isActive);
  const isUserPausedRef = useRef(false);

  // Format seconds to mm:ss
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === null) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const scheduleHideControls = useCallback(() => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2400);
  }, [isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
    scheduleHideControls();
  };

  // Attempt playback with sound enabled (handling browser autoplay policies)
  const attemptPlayWithSound = useCallback(async (video) => {
    if (!video) return;
    video.muted = false;
    video.volume = 1;

    try {
      await video.play();
      setIsPlaying(true);
      setIsLoading(false);
      setIsEnded(false);
    } catch (err) {
      // If browser blocks unmuted playback before first interaction, temporarily start muted
      // and immediately unmute on the first user interaction (scroll, click, tap)
      if (err.name === "NotAllowedError") {
        video.muted = true;
        try {
          await video.play();
          setIsPlaying(true);
          setIsLoading(false);
        } catch (e) {}

        const enableSoundOnGesture = () => {
          if (videoRef.current && isVisibleRef.current && isActiveRef.current && !isUserPausedRef.current) {
            videoRef.current.muted = false;
            videoRef.current.volume = 1;
          }
          window.removeEventListener("click", enableSoundOnGesture, true);
          window.removeEventListener("touchstart", enableSoundOnGesture, true);
          window.removeEventListener("scroll", enableSoundOnGesture, true);
          window.removeEventListener("keydown", enableSoundOnGesture, true);
        };
        window.addEventListener("click", enableSoundOnGesture, true);
        window.addEventListener("touchstart", enableSoundOnGesture, true);
        window.addEventListener("scroll", enableSoundOnGesture, true);
        window.addEventListener("keydown", enableSoundOnGesture, true);
      }
    }
  }, []);

  // IntersectionObserver: When watching in viewport, turn sound ON and play.
  // When scrolled away, turn sound OFF and pause.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isWatching = entry.isIntersecting && entry.intersectionRatio >= 0.45;
        isVisibleRef.current = isWatching;

        const video = videoRef.current;
        if (!video) return;

        if (isWatching && isActiveRef.current) {
          // When watching and active slide: turn sound ON & play
          if (!isUserPausedRef.current) {
            setHasStartedPlay(true);
            attemptPlayWithSound(video);
          }
        } else {
          // When scrolled away or out of view: turn sound OFF & pause
          video.muted = true;
          video.pause();
          setIsPlaying(false);
        }
      },
      {
        threshold: [0, 0.2, 0.45, 0.7, 1.0],
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.pause();
      }
    };
  }, [attemptPlayWithSound]);

  // Carousel slide change: When sliding to another item, turn sound OFF & pause.
  // When sliding back to this video, turn sound ON & resume.
  useEffect(() => {
    isActiveRef.current = isActive;
    const video = videoRef.current;
    if (!video) return;

    if (!isActive) {
      // Slid away: turn sound off immediately and pause
      video.muted = true;
      video.pause();
      setIsPlaying(false);
    } else {
      // Slid onto this video: if in viewport, turn sound ON and play
      if (isVisibleRef.current && !isUserPausedRef.current) {
        setHasStartedPlay(true);
        attemptPlayWithSound(video);
      }
    }
  }, [isActive, attemptPlayWithSound]);

  const togglePlay = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const video = videoRef.current;
    if (!video) return;

    if (!hasStartedPlay) {
      setHasStartedPlay(true);
      setIsLoading(true);
    }

    if (isEnded) {
      video.currentTime = 0;
      isUserPausedRef.current = false;
      attemptPlayWithSound(video);
      return;
    }

    if (video.paused) {
      isUserPausedRef.current = false;
      attemptPlayWithSound(video);
    } else {
      isUserPausedRef.current = true;
      video.pause();
      setIsPlaying(false);
    }
    setShowControls(true);
    scheduleHideControls();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onTouchStart={handleMouseMove}
      className={`relative w-full h-full flex items-center justify-center bg-black overflow-hidden group/player select-none ${className}`}
      style={{ contain: "paint" }}
    >
      {/* Pre-play Poster Thumbnail Overlay */}
      {!hasStartedPlay && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 z-15 flex items-center justify-center bg-black cursor-pointer group/thumb"
        >
          {/* Skeleton placeholder while thumbnail loads */}
          {!posterLoaded && (
            <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
              <div className="size-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
            </div>
          )}

          {resolvedPoster && (
            <img
              src={resolvedPoster}
              alt="Video thumbnail"
              loading="lazy"
              decoding="async"
              onLoad={() => setPosterLoaded(true)}
              className={`w-full h-full ${
                fitCover ? "object-cover" : "object-contain"
              } select-none transition-all duration-500 group-hover/thumb:scale-105 ${
                posterLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Prominent Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover/thumb:bg-black/15 transition-colors">
            <button
              type="button"
              onClick={togglePlay}
              className="size-14 sm:size-16 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all duration-300 group-hover/thumb:scale-110 active:scale-95 cursor-pointer ring-4 ring-black/40"
              title="Play Video"
            >
              <Play className="size-7 stroke-[2.5] ml-0.5 fill-neutral-950" />
            </button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={hasStartedPlay ? src : undefined}
        poster={resolvedPoster}
        preload={hasStartedPlay ? "auto" : "none"}
        playsInline
        autoPlay={hasStartedPlay}
        muted={false}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadStart={() => setIsLoading(true)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsBuffering(false);
          setIsPlaying(true);
          setIsEnded(false);
        }}
        onCanPlay={() => {
          setIsLoading(false);
          setIsBuffering(false);
        }}
        loop
        onEnded={() => {
          if (videoRef.current && isVisibleRef.current && isActiveRef.current && !isUserPausedRef.current) {
            videoRef.current.currentTime = 0;
            attemptPlayWithSound(videoRef.current);
          }
        }}
        onClick={togglePlay}
        className={`w-full h-full max-w-full max-h-full ${
          fitCover ? "object-cover" : "object-contain"
        } cursor-pointer`}
        style={{
          objectFit: "contain",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />

      {/* Animated Loading Wheel in Initial / Buffering State */}
      {(isLoading || isBuffering) && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none animate-in fade-in duration-200">
          <div className="relative size-12 sm:size-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md animate-pulse" />
            <svg
              className="size-full animate-spin text-emerald-400"
              viewBox="0 0 50 50"
              fill="none"
            >
              <circle
                className="opacity-20 stroke-white/40"
                cx="25"
                cy="25"
                r="20"
                strokeWidth="4"
              />
              <circle
                className="opacity-90 stroke-emerald-400"
                cx="25"
                cy="25"
                r="20"
                strokeWidth="4"
                strokeDasharray="95"
                strokeDashoffset="35"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="mt-2.5 text-[11px] font-bold text-white/80 tracking-wider uppercase font-mono drop-shadow">
            Loading Video...
          </span>
        </div>
      )}

      {/* Big Center Play / Replay Button when paused and not loading */}
      {!isPlaying && !isLoading && !isBuffering && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-auto z-20 size-13 sm:size-15 rounded-full bg-black/70 hover:bg-emerald-500 text-white hover:text-black border border-white/20 flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          title={isEnded ? "Replay Video" : "Play Video"}
        >
          {isEnded ? (
            <RotateCcw className="size-6 stroke-[2.5]" />
          ) : (
            <Play className="size-6 stroke-[2.5] ml-0.5" />
          )}
        </button>
      )}

      {/* Modern Gradient & Glass Bottom Controls Overlay (Sound button removed, sound always enabled) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute inset-x-0 bottom-0 z-25 pt-8 pb-3 px-3 sm:px-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 pointer-events-auto ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Scrubber Bar */}
        <div className="relative w-full group/scrubber flex items-center mb-2.5 cursor-pointer">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer focus:outline-none accent-emerald-400 group-hover/scrubber:h-2.5 transition-all"
            style={{
              background: `linear-gradient(to right, #10b981 ${progressPercent}%, rgba(255, 255, 255, 0.2) ${progressPercent}%)`,
            }}
          />
        </div>

        {/* Bottom Control Icons & Meta */}
        <div className="flex items-center justify-between gap-3 text-white text-xs">
          {/* Left: Play/Pause & Timestamp */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="size-4 stroke-[2.5]" />
              ) : (
                <Play className="size-4 stroke-[2.5]" />
              )}
            </button>

            <span className="text-[11px] sm:text-xs font-mono font-medium text-white/90 tracking-tight">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right: Fullscreen (Sound button removed, sound always on) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="size-4" />
              ) : (
                <Maximize className="size-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
