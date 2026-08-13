import { useLocation } from "react-router-dom";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import type { SectionId } from "@/lib/sections";

/**
 * Shared "what counts as current" logic for every nav surface (desktop
 * header, mobile bottom nav). The one-pager tracks a section per scroll
 * position; /work and /work/:slug don't have sections at all, so "Works"
 * reads as current for that whole area.
 */
export function useNavActiveState() {
  const { pathname } = useLocation();
  const { activeSection } = useSmoothScroll();

  const isHome = pathname === "/";
  const isWorkRoute = pathname.startsWith("/work");

  const isActive = (href: SectionId) =>
    isHome ? activeSection === href : isWorkRoute && href === "works";

  return { isHome, isWorkRoute, isActive };
}
