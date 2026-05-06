import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import clsx from "clsx";

export function WhatsAppButton({
  message,
  variant = "primary",
  className,
  children,
}: {
  message?: string;
  variant?: "primary" | "ghost" | "icon";
  className?: string;
  children?: React.ReactNode;
}) {
  const href = whatsappLink(message);
  const base =
    "inline-flex items-center gap-2 rounded-full text-sm font-medium transition";
  if (variant === "icon") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={clsx(
          "h-10 w-10 grid place-items-center rounded-full border border-emerald-300/30 bg-emerald-300/[0.07] text-emerald-200 hover:border-emerald-300/60 hover:bg-emerald-300/[0.12] transition",
          className
        )}
      >
        <MessageCircle size={15} strokeWidth={1.8} />
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        base,
        variant === "primary"
          ? "bg-emerald-300 text-[#01040A] px-5 py-3 hover:bg-emerald-200"
          : "border border-emerald-300/30 text-emerald-200 px-4 py-2 hover:border-emerald-300/55 hover:bg-emerald-300/[0.06]",
        className
      )}
    >
      <MessageCircle size={15} strokeWidth={1.8} />
      {children ?? "Chat on WhatsApp"}
    </a>
  );
}
