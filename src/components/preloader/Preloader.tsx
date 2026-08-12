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

/**
 * Counter + wipe only — no portrait handoff. The falling-portrait scrub this
 * used to hand off into was retired (Home no longer scrubs its portrait into
 * About); Home now runs its own on-mount entrance timeline once `introDone`
 * flips, gated the same way this component already gates itself.
 */
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
          duration: 1.4,
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

      // Wipe the overlay away; Home's own entrance timeline takes it from here.
      tl.to(
        rootRef.current,
        { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "power4.inOut" },
        ">-0.1"
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
