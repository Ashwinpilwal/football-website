import React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-white/10 bg-neutral-800 text-neutral-200",
    secondary: "border-white/10 bg-white/10 text-white",
    destructive: "border-red-500/30 bg-red-500/15 text-red-400",
    success: "border-emerald-500/30 bg-emerald-500/20 text-emerald-400",
    outline: "text-neutral-300 border border-white/15",
    emerald: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
