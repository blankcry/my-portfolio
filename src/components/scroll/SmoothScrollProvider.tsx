import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import {
  HEADER_H,
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
  useGSAP,
} from "@/lib/gsap";
import { SCROLL_EASE, type SectionId } from "@/lib/sections";
import { useSectionSnap } from "@/hooks/useSectionSnap";
import { useActiveSection } from "@/hooks/useActiveSection";

interface SmoothScrollValue {
  activeSection: SectionId | "";
  scrollToSection: (id: SectionId) => void;
  /** False when the user prefers reduced motion — the global animation kill switch. */
  motionEnabled: boolean;
  introDone: boolean;
  setIntroDone: (v: boolean) => void;
  lockScroll: (locked: boolean) => void;
  /** Debounced, paint-deferred, snap-aware `ScrollTrigger.refresh()`. */
  requestRefresh: () => void;
  /** True only on the one-pager route, where hard section snapping applies. */
  snapEnabled: boolean;
}

const SmoothScrollContext = createContext<SmoothScrollValue | null>(null);

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside <SmoothScrollProvider>");
  return ctx;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const isSnappingRef = useRef(false);
  const refreshTimer = useRef<number | undefined>(undefined);
  const { pathname } = useLocation();

  const [motionEnabled] = useState(() => !prefersReducedMotion());
  const [activeSection, setActiveSection] = useState<SectionId | "">("");
  const [introDone, setIntroDone] = useState(false);

  // Section snapping only makes sense on the one-pager. /work and /work/:slug
  // are ordinary documents that should scroll normally.
  const isHome = pathname === "/";
  const snapEnabled = motionEnabled && isHome;

  const requestRefresh = useCallback(() => {
    const schedule = () => {
      window.clearTimeout(refreshTimer.current);
      refreshTimer.current = window.setTimeout(() => {
        // Refreshing mid-transition yanks the scroll position; wait it out.
        if (isSnappingRef.current) return schedule();
        // Two frames: laid out, then painted.
        requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
      }, 150);
    };
    schedule();
  }, []);

  const lockScroll = useCallback((locked: boolean) => {
    // Both, because there are frames before Lenis exists.
    lenisRef.current?.[locked ? "stop" : "start"]();
    document.documentElement.classList.toggle("overflow-hidden", locked);
  }, []);

  // --- Lenis + the GSAP ticker ------------------------------------------------
  useGSAP(() => {
    // Don't let the browser restore a mid-page scroll position on reload.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    // Reduced motion: no Lenis at all, native scroll only.
    if (!motionEnabled) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: SCROLL_EASE,
      // smoothWheel is toggled per-route below: on the snapping one-pager the
      // hard-lock hook owns wheel input entirely and translates each gesture
      // into exactly one section jump, so Lenis must not also convert wheel
      // deltas into free scrolling.
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
      autoRaf: false,
    });
    lenisRef.current = lenis;

    // ScrollTrigger only reads; it never writes scroll position.
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Hand wheel ownership to the snap hook on the one-pager, give it back on
  // ordinary routes.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.options.smoothWheel = !snapEnabled;
  }, [snapEnabled]);

  // --- Toggling the OS setting mid-session: just reload -----------------------
  useGSAP(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => window.location.reload();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Declared after the Lenis effect so `lenisRef.current` is already populated.
  useSectionSnap(lenisRef, {
    enabled: snapEnabled,
    isSnappingRef,
    offset: HEADER_H,
  });

  useActiveSection(setActiveSection, isHome);

  // --- Route changes: back to the top, and re-measure -------------------------
  useEffect(() => {
    isSnappingRef.current = false;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    requestRefresh();
  }, [pathname, requestRefresh]);

  // --- Safety net for layout changes we didn't explicitly account for ---------
  useGSAP(() => {
    const ro = new ResizeObserver(() => requestRefresh());
    ro.observe(document.body);
    window.addEventListener("load", requestRefresh);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", requestRefresh);
    };
  }, []);

  const scrollToSection = useCallback(
    (id: SectionId) => {
      const el = document.getElementById(id);
      if (!el) return;

      setActiveSection(id); // optimistic highlight
      const offset = -HEADER_H;
      const lenis = lenisRef.current;

      if (!lenis) {
        window.scrollTo({ top: el.offsetTop + offset, behavior: "smooth" });
        return;
      }

      // Hold the snapper off for the duration so the two don't fight.
      isSnappingRef.current = true;
      lenis.scrollTo(el, {
        offset,
        duration: 1.1,
        easing: SCROLL_EASE,
        lock: true,
        force: true,
        onComplete: () => {
          isSnappingRef.current = false;
        },
      });
    },
    []
  );

  const value = useMemo(
    () => ({
      activeSection,
      scrollToSection,
      motionEnabled,
      introDone,
      setIntroDone,
      lockScroll,
      requestRefresh,
      snapEnabled,
    }),
    [
      activeSection,
      scrollToSection,
      motionEnabled,
      introDone,
      lockScroll,
      requestRefresh,
      snapEnabled,
    ]
  );

  return (
    <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>
  );
}
