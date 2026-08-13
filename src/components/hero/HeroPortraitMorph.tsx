import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import HeroImage from "@/assets/heroImage.webp";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { SECTION_IDS } from "@/lib/sections";

type Phase = "idle" | "bouncing" | "moving" | "nav";

/** Size of the persistent circular nav button. */
const BUTTON_SIZE = 68;
const BUTTON_MARGIN = 28;
/** Gap after the intro before the auto-sequence starts, so it doesn't fight
 * Home's own text/portrait entrance for attention. */
const AUTO_START_DELAY_S = 1.3;

/**
 * The hero portrait, which introduces itself, then becomes the app's
 * permanent section-navigation control.
 *
 * Lifecycle, entirely automatic — no hover or tap needed to trigger it:
 *  1. On page visit, once the intro has settled, it bounces twice in place.
 *  2. It then slides down into a fixed bottom-right button and its content
 *     crossfades from the photo to a chevron — it stops being a picture.
 *  3. From then on it persists for the rest of the session: click advances to
 *     the next section, and — since "next" runs out at the end — the last
 *     section flips it to point up and step back to the previous one instead.
 */
export function HeroPortraitMorph({ className = "" }: { className?: string }) {
  const { scrollToSection, motionEnabled, introDone, activeSection } = useSmoothScroll();

  const btnRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<Phase>("idle");
  const [phase, setPhase] = useState<Phase>("idle");

  const to = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const currentIndex = Math.max(0, SECTION_IDS.indexOf(activeSection as (typeof SECTION_IDS)[number]));
  const isLast = currentIndex === SECTION_IDS.length - 1;
  const target = isLast ? SECTION_IDS[currentIndex - 1] : SECTION_IDS[currentIndex + 1];

  const settle = (fixedEl: HTMLElement) => {
    gsap.set(fixedEl, {
      left: () => window.innerWidth - BUTTON_SIZE - BUTTON_MARGIN,
      top: () => window.innerHeight - BUTTON_SIZE - BUTTON_MARGIN,
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      borderRadius: 9999,
    });
  };

  // Auto-run once: bounce twice, then move-and-become-arrow. Reduced motion
  // skips straight to the resting nav button — no picture phase at all, since
  // there's nothing left for the photo to do once it can't animate into place.
  useGSAP(
    () => {
      if (!introDone) return;
      const el = btnRef.current;
      const img = imgRef.current;
      const arrow = arrowRef.current;
      if (!el || !img || !arrow) return;

      if (!motionEnabled) {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          if (getComputedStyle(p).transform !== "none") gsap.set(p, { clearProps: "transform" });
        }
        gsap.set(el, { position: "fixed", margin: 0, x: 0, y: 0, zIndex: 60 });
        settle(el);
        gsap.set(img, { autoAlpha: 0 });
        gsap.set(arrow, { autoAlpha: 1 });
        to("nav");
        return;
      }

      const startSequence = () => {
        if (phaseRef.current !== "idle") return;
        to("bouncing");

        gsap
          .timeline()
          .to(el, { y: -34, duration: 0.42, ease: "power2.out" })
          .to(el, { y: 0, duration: 0.55, ease: "bounce.out" })
          .to(el, { y: -34, duration: 0.42, ease: "power2.out" })
          .to(el, { y: 0, duration: 0.55, ease: "bounce.out" })
          .add(() => {
            to("moving");
            // Any transformed ancestor becomes the containing block for a
            // fixed descendant, which would anchor the button to that
            // ancestor's box rather than the viewport.
            for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
              if (getComputedStyle(p).transform !== "none") gsap.set(p, { clearProps: "transform" });
            }
            const r = el.getBoundingClientRect();
            gsap.set(el, {
              position: "fixed",
              left: r.left,
              top: r.top,
              // `absolute inset-0` leaves right/bottom at 0; against the
              // viewport that is over-constrained and can stretch the
              // element full-screen.
              right: "auto",
              bottom: "auto",
              width: r.width,
              height: r.height,
              margin: 0,
              x: 0,
              y: 0,
              zIndex: 60,
              overflow: "hidden",
            });
          })
          .to(el, {
            left: () => window.innerWidth - BUTTON_SIZE - BUTTON_MARGIN,
            top: () => window.innerHeight - BUTTON_SIZE - BUTTON_MARGIN,
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            borderRadius: 9999,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => to("nav"),
          })
          // It stops being a picture here: photo fades out, arrow fades in,
          // timed to the tail of the move rather than a hard cut.
          .to(img, { autoAlpha: 0, duration: 0.3 }, "-=0.35")
          .fromTo(arrow, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.35 }, "-=0.3");
      };

      const t = gsap.delayedCall(AUTO_START_DELAY_S, startSequence);
      return () => {
        t.kill();
      };
    },
    { dependencies: [introDone, motionEnabled], scope: btnRef }
  );

  // Once resting, keep it centered through viewport resizes — it's promised
  // to stay correctly placed for the rest of the session, not just at the
  // moment it landed.
  useEffect(() => {
    if (phase !== "nav") return;
    const onResize = () => {
      const el = btnRef.current;
      if (el) settle(el);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase]);

  // Idle invitation once it has settled — a slow bob, so it still reads as an
  // interactive control rather than a static icon parked on screen.
  useGSAP(
    () => {
      if (phase !== "nav" || !motionEnabled || !btnRef.current) return;
      const el = btnRef.current;
      const bob = gsap.to(el, { y: -7, duration: 0.85, ease: "sine.inOut", repeat: -1, yoyo: true });
      return () => {
        bob.kill();
        gsap.set(el, { y: 0 });
      };
    },
    { dependencies: [phase, motionEnabled], revertOnUpdate: true }
  );

  const isNav = phase === "nav";

  return (
    // data-hero-portrait: Home's entrance timeline animates this wrapper.
    <div data-hero-portrait className={`relative ${className}`}>
      {/* Reserves the hero's layout space; the animated copy sits on top and is
          free to leave the flow without collapsing the composition. */}
      <img src={HeroImage} alt="" aria-hidden className="invisible h-auto w-full" />

      <button
        ref={btnRef}
        type="button"
        onClick={() => isNav && scrollToSection(target)}
        aria-label={isNav ? (isLast ? "Previous section" : "Next section") : "James Yunana"}
        title={isNav ? (isLast ? "Previous section" : "Next section") : undefined}
        tabIndex={isNav ? 0 : -1}
        className={
          "absolute inset-0 block will-change-transform " +
          (isNav
            ? "cursor-pointer bg-black shadow-2xl ring-2 ring-white/70 transition-transform hover:scale-110 dark:bg-white dark:ring-white/30"
            : "drop-shadow-2xl")
        }
      >
        <img
          ref={imgRef}
          src={HeroImage}
          alt="James Yunana"
          className="absolute inset-0 h-full w-full object-contain"
        />
        <span
          ref={arrowRef}
          className="absolute inset-0 grid place-items-center text-white opacity-0 dark:text-black"
        >
          <Icon icon={isLast ? "carbon:chevron-up" : "carbon:chevron-down"} width={26} height={26} />
        </span>
      </button>
    </div>
  );
}

export default HeroPortraitMorph;
