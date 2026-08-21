import React from "react";

export default function FootballLoader({
  message = "Loading matchday posts...",
  size = "md",
  inline = false,
  className = "",
}) {
  const sizeClasses = {
    xs: "size-4.5",
    sm: "size-5.5",
    md: "size-7",
    lg: "size-9",
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  if (inline) {
    return (
      <div className={`p-3 text-center space-y-1.5 flex flex-col items-center justify-center animate-in fade-in duration-200 ${className}`}>
        <img
          src="/assets/football.png"
          alt="Loading..."
          className={`${currentSize} object-contain animate-football-spin select-none`}
          loading="eager"
        />
        {message && (
          <p className="text-xs text-neutral-400 font-medium select-none">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`glass-card rounded-3xl p-8 sm:p-10 text-center space-y-3 shadow-xl border border-white/[0.08] flex flex-col items-center justify-center animate-in fade-in duration-200 ${className}`}
    >
      {/* Reduced size spinning football without any green glow */}
      <img
        src="/assets/football.png"
        alt="Loading..."
        className={`${currentSize} object-contain animate-football-spin select-none`}
        loading="eager"
      />

      {message && (
        <p className="font-semibold text-xs sm:text-sm text-neutral-300 tracking-wide select-none">
          {message}
        </p>
      )}
    </div>
  );
}
