import React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const variants = {
    default: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:scale-[0.98]",
    primary: "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold active:scale-[0.98] shadow-md shadow-emerald-500/20",
    secondary: "bg-white/10 hover:bg-white/15 text-white border border-white/10 active:scale-[0.98]",
    outline: "border border-white/15 bg-transparent hover:bg-white/5 text-neutral-200 active:scale-[0.98]",
    ghost: "hover:bg-white/10 text-neutral-200 hover:text-white",
    destructive: "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98] shadow-md shadow-red-500/20",
    link: "text-emerald-400 underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 rounded-xl px-3 text-xs",
    lg: "h-12 rounded-2xl px-8 text-base",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
