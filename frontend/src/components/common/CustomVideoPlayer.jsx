import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  RotateCcw,
} from "lucide-react";

export default function CustomVideoPlayer({
  src,
  poster = null,
  fitCover = false,
  className = "",
  autoPlay = true,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideControlsTimeout = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

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

  const togglePlay = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const video = videoRef.current;
    if (!video) return;

    if (isEnded) {
      video.currentTime = 0;
      video.play();
      setIsPlaying(true);
      setIsEnded(false);
      return;
    }

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
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

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
    if (!newMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      const muted = newVol === 0;
      setIsMuted(muted);
      videoRef.current.muted = muted;
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

  // Automatic video playback on mount / src change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(() => {
          // If browser policy blocks unmuted autoplay, retry with muted
          video.muted = true;
          setIsMuted(true);
          video.play()
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch(() => {});
        });
    }
  }, [src, isMuted]);

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
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        autoPlay={autoPlay}
        muted={isMuted}
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
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
            setIsEnded(false);
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

      {/* Beautiful Animated Loading Wheel in Initial / Buffering State */}
      {(isLoading || isBuffering) && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none animate-in fade-in duration-200">
          <div className="relative size-12 sm:size-14 flex items-center justify-center">
            {/* Ambient emerald glow ring */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md animate-pulse" />
            
            {/* Dual rotating SVG spinner ring */}
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

      {/* Quick Sound Toggle Floating Button */}
      <button
        type="button"
        onClick={toggleMute}
        className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-white/90 hover:text-white backdrop-blur-md shadow-lg transition-all active:scale-90 cursor-pointer"
        title={isMuted ? "Unmute Video" : "Mute Video"}
      >
        {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4 text-emerald-400" />}
      </button>

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

      {/* Modern Gradient & Glass Bottom Controls Overlay */}
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

          {/* Right: Volume & Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="size-4" />
                ) : volume < 0.5 ? (
                  <Volume1 className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-12 sm:w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer focus:outline-none accent-emerald-400 hidden group-hover/vol:inline-block transition-all"
                style={{
                  background: `linear-gradient(to right, #10b981 ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) ${(isMuted ? 0 : volume) * 100}%)`,
                }}
              />
            </div>

            {/* Fullscreen Button */}
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
