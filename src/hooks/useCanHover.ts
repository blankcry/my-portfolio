import { useEffect, useState } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

/**
 * Whether the device has a real hovering pointer.
 *
 * Preferred over a width breakpoint for hover-driven UI: a touchscreen laptop is
 * wide but can't hover, and hover must never be the only way to reach content.
 */
export function useCanHover() {
  const [canHover, setCanHover] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = () => setCanHover(mql.matches);
    mql.addEventListener("change", onChange);
    setCanHover(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return canHover;
}
