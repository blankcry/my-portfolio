import { useEffect } from "react";
import type Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";
import { SECTION_IDS, SCROLL_EASE } from "@/lib/sections";

/** One gesture moves exactly one section. */
const TRANSITION_S = 0.85;
/**
 * Home <-> About is deliberately slower than every other move. The hero
 * portrait travels between those two sections during the transition, and at
 * the normal speed it reads as a jump-cut rather than a journey. The portrait
 * animation reads this same constant so the two stay locked together.
 */
export const PORTRAIT_TRANSITION_S = 1.8;
/** Ignore wheel noise below this — trackpads emit tiny deltas constantly. */
const DELTA_THRESHOLD = 12;
/**
 * Quiet period after a transition finishes. Trackpad inertia keeps firing wheel
 * events for a while after the finger lifts; without this the tail of one flick
 * would immediately trigger the next section.
 */
const COOLDOWN_MS = 260;
/** Minimum vertical swipe distance to count as a section change. */
const SWIPE_PX = 45;

interface Options {
  enabled: boolean;
  isSnappingRef: React.MutableRefObject<boolean>;
  /** Sticky-header height to subtract from each boundary (mobile). */
  offset: number;
}

/**
 * Hard section lock — one wheel gesture, swipe, or arrow key advances exactly
 * one section, and the page never rests part-way between two.
 *
 * This replaces the earlier "magnetic" behaviour (free scrolling that settled
 * onto a nearby boundary). Because the page must never free-scroll, we
 * preventDefault every wheel event and drive the transition ourselves through
 * `lenis.scrollTo`, rather than letting Lenis translate wheel input into
 * scroll. Lenis is still the only thing that writes scroll position.
 */
export function useSectionSnap(
  lenisRef: React.MutableRefObject<Lenis | null>,
  { enabled, isSnappingRef, offset }: Options
) {
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!enabled || !lenis) return;

    let boundaries: number[] = [];
    let index = 0;
    let cooldownUntil = 0;

    const measure = () => {
      const vh = window.innerHeight;
      if (vh === 0) return;
      const max = Math.max(0, document.documentElement.scrollHeight - vh);
      const next: number[] = [];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        next.push(Math.min(Math.max(0, top), max));
      }
      boundaries = [...new Set(next)].sort((a, b) => a - b);
      index = nearestIndex(window.scrollY);
    };

    const nearestIndex = (y: number) => {
      let best = 0;
      let bestDist = Infinity;
      boundaries.forEach((b, i) => {
        const d = Math.abs(b - y);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      return best;
    };

    const goTo = (target: number) => {
      if (!boundaries.length) return;
      const clamped = Math.min(Math.max(0, target), boundaries.length - 1);
      if (clamped === index && isSnappingRef.current) return;

      // Slow the one transition that carries the portrait between sections.
      const between = new Set([index, clamped]);
      const carriesPortrait = between.has(0) && between.has(1);

      index = clamped;
      isSnappingRef.current = true;
      lenis.scrollTo(boundaries[clamped], {
        duration: carriesPortrait ? PORTRAIT_TRANSITION_S : TRANSITION_S,
        easing: SCROLL_EASE,
        // lock: the whole point is that input can't interrupt mid-transition.
        lock: true,
        force: true,
        onComplete: () => {
          cooldownUntil = performance.now() + COOLDOWN_MS;
          isSnappingRef.current = false;
        },
      });
    };

    const busy = () => isSnappingRef.current || performance.now() < cooldownUntil;

    const onWheel = (e: WheelEvent) => {
      // Let genuinely scrollable inner regions (the Experience list, the mobile
      // work rail) keep their own scrolling.
      if ((e.target as HTMLElement | null)?.closest?.("[data-lenis-prevent]")) return;
      e.preventDefault();
      if (busy() || Math.abs(e.deltaY) < DELTA_THRESHOLD) return;
      goTo(index + (e.deltaY > 0 ? 1 : -1));
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.("[data-lenis-prevent]")) return;
      e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.("[data-lenis-prevent]")) return;
      if (busy()) return;
      const delta = touchStartY - (e.changedTouches[0]?.clientY ?? touchStartY);
      if (Math.abs(delta) < SWIPE_PX) return;
      goTo(index + (delta > 0 ? 1 : -1));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const forward = ["ArrowDown", "PageDown", " "].includes(e.key);
      const back = ["ArrowUp", "PageUp"].includes(e.key);
      if (!forward && !back && e.key !== "Home" && e.key !== "End") return;
      e.preventDefault();
      if (busy()) return;
      if (e.key === "Home") return goTo(0);
      if (e.key === "End") return goTo(boundaries.length - 1);
      goTo(index + (forward ? 1 : -1));
    };

    // passive:false is required — these handlers call preventDefault.
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    ScrollTrigger.addEventListener("refresh", measure);
    window.addEventListener("resize", measure);
    measure();

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      ScrollTrigger.removeEventListener("refresh", measure);
      window.removeEventListener("resize", measure);
    };
  }, [enabled, lenisRef, isSnappingRef, offset]);
}
