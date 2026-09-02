import type React from "react";
import { Link } from "@tanstack/react-router";

interface ShinyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
}

export function ShinyButton({
  children,
  onClick,
  className = "",
  type = "button",
  to,
  href,
  target,
  rel,
  disabled,
}: ShinyButtonProps) {
  const inner = (
    <>
      <span className="inline-flex items-center justify-center gap-2">{children}</span>

      <style>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        .shiny-cta {
          --bg: #000;
          --fg: #fff;
          --highlight: #167dcc;
          --duration: 3s;

          position: relative;
          overflow: hidden;
          cursor: pointer;
          isolation: isolate;
          padding: 0.875rem 1.75rem;
          border: 1px solid transparent;
          border-radius: 999px;
          color: var(--fg);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;

          background:
            linear-gradient(var(--bg), var(--bg)) padding-box,
            conic-gradient(
              from var(--gradient-angle),
              transparent,
              var(--highlight) 5%,
              white 10%,
              var(--highlight) 15%,
              transparent 20%
            ) border-box;

          animation:
            gradient-angle var(--duration) linear infinite;
        }

        .shiny-cta span {
          position: relative;
          z-index: 2;
        }

        .shiny-cta:active {
          transform: translateY(1px);
        }

        @keyframes gradient-angle {
          to {
            --gradient-angle: 360deg;
          }
        }
      `}</style>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`shiny-cta ${className}`} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={`shiny-cta ${className}`}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`shiny-cta ${className}`}>
      {inner}
    </button>
  );
}
