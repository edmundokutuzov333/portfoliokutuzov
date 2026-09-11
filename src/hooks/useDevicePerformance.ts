import { useEffect, useState } from "react";

export interface DevicePerformanceProfile {
  isMobileOrTablet: boolean;
  isTouch: boolean;
  saveData: boolean;
  slowConnection: boolean;
}

const MOBILE_TABLET_QUERY = "(max-width: 1023px)";
const TOUCH_QUERY = "(pointer: coarse)";

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

function getConnection(): NetworkInformationLike | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
}

function readProfile(): DevicePerformanceProfile {
  if (typeof window === "undefined") {
    return { isMobileOrTablet: false, isTouch: false, saveData: false, slowConnection: false };
  }

  const isMobileOrTablet = window.matchMedia(MOBILE_TABLET_QUERY).matches;
  const isTouch = window.matchMedia(TOUCH_QUERY).matches;
  const connection = getConnection();
  const effectiveType = connection?.effectiveType;
  const slowConnection = Boolean(
    connection?.saveData || effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g",
  );

  return {
    isMobileOrTablet,
    isTouch,
    saveData: Boolean(connection?.saveData),
    slowConnection,
  };
}

export function useDevicePerformance(): DevicePerformanceProfile {
  const [profile, setProfile] = useState<DevicePerformanceProfile>(() => readProfile());

  useEffect(() => {
    const media = window.matchMedia(MOBILE_TABLET_QUERY);
    const touch = window.matchMedia(TOUCH_QUERY);
    const connection = getConnection();
    const refresh = () => setProfile(readProfile());

    media.addEventListener("change", refresh);
    touch.addEventListener("change", refresh);
    connection?.addEventListener?.("change", refresh);

    return () => {
      media.removeEventListener("change", refresh);
      touch.removeEventListener("change", refresh);
      connection?.removeEventListener?.("change", refresh);
    };
  }, []);

  return profile;
}
