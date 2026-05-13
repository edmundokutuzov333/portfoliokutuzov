import { SITE_PHONE_DIGITS } from "./cms";

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(
    message ?? "Hello Edmundo, I found your portfolio and I would like to discuss a project.",
  );
  return `https://wa.me/${SITE_PHONE_DIGITS}?text=${text}`;
}
