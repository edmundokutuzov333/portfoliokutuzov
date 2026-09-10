import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { installRouteTiming } from "@/lib/route-timing";

export function RouteTimingInstaller() {
  const router = useRouter();
  useEffect(() => installRouteTiming(router), [router]);
  return null;
}
