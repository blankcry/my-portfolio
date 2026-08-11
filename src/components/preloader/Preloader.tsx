import { useRef, useState } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import Logo from "@/assets/logo_100x40.svg";

const SEEN_KEY = "bc:intro:v1";

/**
 * Session-gated, not localStorage-gated: a first-time visitor gets the full
 * intro, a reload in the same tab skips it. `?intro` forces it, `?intro=0`
 * skips it — both useful while iterating.
 */
function shouldPlayIntro() {
  if (typeof window === "undefined") return false;
  const q = new URLSearchParams(window.location.search);
  if (q.has("intro")) return q.get("intro") !== "0";
  if (prefersReducedMotion()) return false;
  try {
    return !sessionStorage.getItem(SEEN_KEY);
  } catch {
    return true;
  }
}

export function Preloader() {
  const { setIntroDone, lockScroll, motionEnabled } = useSmoothScroll();
  const [play] = useState(() => motionEnabled && shouldPlayIntro());
  const [finished, setFinished] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!play) {
        setIntroDone(true);
        return;
      }

      try {
        // Written on start, not on complete, so an abandoned load doesn't replay.
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* private mode — just play it every time */
      }

      // The intro only makes sense from the top.
      window.scrollTo(0, 0);
      lockScroll(true);

      const proxy = document.querySelector<HTMLImageElement>("[data-hero-proxy]");
      const homeSlot = document.querySelector<HTMLElement>('[data-hero-slot="home"]');
      const layer = proxy?.parentElement;

      /** Rect of `el` expressed in the hero layer's own coordinate space. */
      const rectIn = (el: HTMLElement) => {
        const l = layer!.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return { x: r.left - l.left, y: r.top - l.top, width: r.width, height: r.height };
      };

      // Park the portrait small and centred in the viewport before first paint.
      if (proxy && layer) {
        const l = layer.getBoundingClientRect();
        const size = Math.min(window.innerWidth, window.innerHeight) * 0.34;
        gsap.set(proxy, {
          width: size,
          height: size,
          x: window.innerWidth / 2 - l.left - size / 2,
          y: window.innerHeight / 2 - l.top - size / 2,
          autoAlpha: 0,
          scale: 0.85,
          clipPath: "circle(0% at 50% 50%)",
        });
      }

      // Kick decode off now so it overlaps the counter and is usually free.
      const decoded: Promise<unknown> = proxy
        ? Promise.race([
            proxy.decode().catch(() => undefined),
            new Promise((r) => setTimeout(r, 2500)),
          ])
        : Promise.resolve();

      const counter = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          lockScroll(false);
          setIntroDone(true);
          setFinished(true);
          ScrollTrigger.refresh();
        },
      });

      tl.to(
        counter,
        {
          v: 100,
          duration: 1.6,
          ease: "power2.inOut",
          snap: { v: 1 },
          onUpdate: () => {
            if (counterRef.current)
              counterRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            if (barRef.current) gsap.set(barRef.current, { scaleX: counter.v / 100 });
          },
        },
        0
      );

      if (proxy) {
        tl.to(
          proxy,
          {
            autoAlpha: 1,
            scale: 1,
            clipPath: "circle(75% at 50% 50%)",
            duration: 1.1,
            ease: "power3.out",
          },
          0.25
        );
      }

      // Hold the exit until the portrait can actually paint — otherwise the
      // circle reveals onto a blank hole on a slow connection. A timeline can't
      // await a promise, so pause the playhead and resume it from the promise.
      tl.addPause(">", () => {
        decoded.then(() => tl.play());
      });

      // Exit: the portrait flies into its slot as the overlay wipes upward.
      // Function-based values so the rect is read at execution time, not build
      // time — fonts and images may still have shifted the layout by then.
      if (proxy && homeSlot && layer) {
        tl.to(
          proxy,
          {
            x: () => rectIn(homeSlot).x,
            y: () => rectIn(homeSlot).y,
            width: () => rectIn(homeSlot).width,
            height: () => rectIn(homeSlot).height,
            duration: 0.9,
            ease: "power4.inOut",
          },
          ">"
        );
      }

      tl.to(
        rootRef.current,
        { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "power4.inOut" },
        "<0.1"
      ).from(
        "[data-hero-copy] > *",
        { y: 40, autoAlpha: 0, stagger: 0.08, duration: 0.7 },
        "<0.25"
      );

      return () => {
        lockScroll(false);
      };
    },
    { dependencies: [] }
  );

  if (!play || finished) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] bg-background grid place-items-center"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="flex flex-col items-center gap-6">
        <img src={Logo} alt="Blankcry" className="h-[64px]" />
        <span
          ref={counterRef}
          className="font-montserrat text-5xl md:text-7xl font-bold tabular-nums text-foreground"
        >
          000
        </span>
        <span className="block h-px w-40 md:w-64 bg-foreground/20 overflow-hidden">
          <span
            ref={barRef}
            className="block h-full w-full origin-left gradient"
            style={{ transform: "scaleX(0)" }}
          />
        </span>
      </div>
    </div>
  );
}

export default Preloader;
