import { useEffect } from "react";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SECTION_IDS, SCROLL_EASE } from "@/lib/sections";

/** Only snap when a boundary is this close — the magnetic-vs-trapping knob. */
const CAPTURE_RATIO = 0.35;
/** Quiet period after the last scroll event before we consider snapping. */
const SETTLE_MS = 90;
/** Skip while the user is still flinging. */
const VELOCITY_MAX = 0.15;
const MIN_DELTA = 4;
/** Never snap right at the top/bottom of the document. */
const EDGE_GUARD = 80;
/** Boundaries in the direction of travel are preferred by this factor. */
const DIRECTIONAL_BIAS = 0.6;

interface Options {
  enabled: boolean;
  isSnappingRef: React.MutableRefObject<boolean>;
  /** Sticky-header height to subtract from each boundary (mobile). */
  offset: number;
}

/**
 * Magnetic section snapping.
 *
 * Snapping goes through `lenis.scrollTo(..., { lock: false })` rather than
 * ScrollTrigger's built-in `snap`, because ScrollTrigger writes `window.scrollTo`
 * directly — a second writer alongside Lenis, which produces the classic
 * "snaps, then jumps back". Rule: Lenis is the only thing that writes scroll.
 */
export function useSectionSnap(
  lenisRef: React.MutableRefObject<Lenis | null>,
  { enabled, isSnappingRef, offset }: Options
) {
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!enabled || !lenis) return;

    let boundaries: number[] = [];
    let dir: 1 | -1 = 1;
    let timer: number | undefined;
    let pointerDown = false;

    const capture = () => CAPTURE_RATIO * window.innerHeight;

    const measure = () => {
      const vh = window.innerHeight;
      // Backgrounded/zero-size viewports report 0; every boundary would be bogus.
      if (vh === 0) return;
      const max = Math.max(0, document.documentElement.scrollHeight - vh);
      const clamp = gsap.utils.clamp(0, max);
      const next: number[] = [];

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        next.push(clamp(top));
        // Sections taller than the viewport get a second resting point aligned
        // to their end, so their long middle stretch stays free-scrolling.
        if (el.offsetHeight > vh * 1.2) next.push(clamp(top + el.offsetHeight - vh));
      }

      boundaries = [...new Set(next)].sort((a, b) => a - b);
    };

    const nearest = (y: number) => {
      const cap = capture();
      let best: number | null = null;
      let bestCost = Infinity;

      for (const b of boundaries) {
        const delta = b - y;
        if (Math.abs(delta) > cap) continue;
        const cost = Math.abs(delta) * (Math.sign(delta) === dir ? DIRECTIONAL_BIAS : 1);
        if (cost < bestCost) {
          bestCost = cost;
          best = b;
        }
      }
      return best;
    };

    const trySnap = () => {
      if (isSnappingRef.current || pointerDown) return;
      if (window.innerHeight === 0 || !boundaries.length) return;
      if (Math.abs(lenis.velocity) > VELOCITY_MAX) return;

      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (y < EDGE_GUARD || y > max - EDGE_GUARD) return;

      const target = nearest(y);
      if (target === null || Math.abs(target - y) < MIN_DELTA) return;

      const ratio = Math.min(1, Math.abs(target - y) / capture());
      isSnappingRef.current = true;
      lenis.scrollTo(target, {
        duration: 0.45 + 0.45 * ratio,
        easing: SCROLL_EASE,
        lock: false,
        onComplete: () => {
          isSnappingRef.current = false;
        },
      });
    };

    const onScroll = (instance: Lenis) => {
      if (isSnappingRef.current) return;
      if (instance.velocity) dir = instance.velocity > 0 ? 1 : -1;
      window.clearTimeout(timer);
      timer = window.setTimeout(trySnap, SETTLE_MS);
    };

    // Fresh user input aborts an in-flight snap. This is the whole difference
    // between "magnetic" and "trapped".
    const cancel = () => {
      if (!isSnappingRef.current) return;
      isSnappingRef.current = false;
      lenis.scrollTo(lenis.animatedScroll, { immediate: true, force: true });
    };

    const onTouchStart = () => {
      pointerDown = true;
      cancel();
    };
    const onTouchEnd = () => {
      pointerDown = false;
    };

    lenis.on("scroll", onScroll);
    ScrollTrigger.addEventListener("refresh", measure);
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", cancel);
    window.addEventListener("resize", measure);
    measure();

    return () => {
      window.clearTimeout(timer);
      lenis.off("scroll", onScroll);
      ScrollTrigger.removeEventListener("refresh", measure);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", cancel);
      window.removeEventListener("resize", measure);
    };
  }, [enabled, lenisRef, isSnappingRef, offset]);
}
