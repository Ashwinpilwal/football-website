import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-white/15 bg-neutral-900/60 px-4 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-xs font-semibold text-neutral-300 uppercase tracking-wider select-none leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      onChange={(e) => {
        if (onChange) onChange(e);
        if (onCheckedChange) onCheckedChange(e.target.checked);
      }}
      className={cn(
        "size-4 rounded-md border border-white/20 bg-neutral-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-emerald-500 transition-all",
        className
      )}
      {...props}
    />
  );
});
Checkbox.displayName = "Checkbox";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-2xl border border-white/15 bg-neutral-900/60 p-4 text-sm text-neutral-100 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/80 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

const Select = ({ children, value, onValueChange, className }) => {
  return (
    <div className={cn("relative w-full", className)}>
      <select
        value={value}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        className="flex h-11 w-full rounded-2xl border border-white/15 bg-neutral-900 px-4 py-2 text-sm text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 appearance-none cursor-pointer"
      >
        {children}
      </select>
    </div>
  );
};

const SelectTrigger = ({ children, className }) => <div className={className}>{children}</div>;
const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => (
  <option value={value} className="bg-neutral-900 text-neutral-100 py-2">
    {children}
  </option>
);

export { Input, Label, Checkbox, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
