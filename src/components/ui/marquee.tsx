import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number; // Duration in seconds
  pauseOnHover?: boolean;
  reverse?: boolean;
  children: React.ReactNode;
}

export function Marquee({
  speed = 35,
  pauseOnHover = true,
  reverse = false,
  className,
  children,
  style,
  ...props
}: MarqueeProps) {
  return (
    <div
      style={
        {
          "--duration": `${speed}s`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "group flex overflow-hidden p-2 [--gap:1.5rem] md:[--gap:2rem] gap-[var(--gap)]",
        "[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex shrink-0 justify-around gap-[var(--gap)] animate-marquee items-center",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 justify-around gap-[var(--gap)] animate-marquee items-center",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
