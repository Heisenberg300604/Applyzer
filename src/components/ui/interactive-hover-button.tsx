import React from "react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-orange-500 px-8 py-3 font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-black hover:shadow-xl active:scale-95",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-13deg)_translateX(100%)]">
        <div className="relative h-full w-10 bg-white/20" />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
