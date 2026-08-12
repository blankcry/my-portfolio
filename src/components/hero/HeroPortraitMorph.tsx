import { useCallback, useEffect, useRef, useState } from "react";
import HeroImage from "@/assets/heroImage.webp";
import { gsap, useGSAP } from "@/lib/gsap";
import { useCanHover } from "@/hooks/useCanHover";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { PORTRAIT_TRANSITION_S } from "@/hooks/useSectionSnap";

type Phase = "idle" | "morphing" | "button" | "flying" | "gone";

/** Size of the circular nav button the portrait becomes. */
const BUTTON_SIZE = 68;
const BUTTON_MARGIN = 28;
/** Give up waiting for the target to settle and just fly anyway. */
const SETTLE_TIMEOUT_MS = 2500;

/**
 * The hero portrait, which turns itself into a navigation control.
 *
 * On hover it bounces twice, flips five times like a spinning coin, then dives
 * to the bottom of the screen and stays there as a round button. Clicking it —
 * or simply snapping to About — flies it into the position of About's avatar.
 *
 * Positioning note: the portrait sits in normal flow while it's still part of
 * the hero, so it scrolls away with the section like any other content. Only at
 * the dive does it switch to `position: fixed`, measured from its live rect at
 * that exact moment so the switch is seamless. It has to be fixed from then on,
 * because a nav button that scrolls off screen isn't a nav button.
 */
export function HeroPortraitMorph({ className = "" }: { className?: string }) {
  const { scrollToSection, activeSection, motionEnabled, setHeroPortraitArrived } =
    useSmoothScroll();
  const canHover = useCanHover();

  const btnRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  // Mirrors `phase` for use inside GSAP callbacks, which close over stale state.
  const phaseRef = useRef<Phase>("idle");
  const [phase, setPhase] = useState<Phase>("idle");

  const enabled = motionEnabled && canHover;

  const to = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const { contextSafe } = useGSAP({ dependencies: [] });

  /**
   * Detach the portrait from the hero's layout so it can travel across
   * sections. Idempotent — safe to call whichever route got here first.
   */
  const detach = (el: HTMLElement) => {
    if (getComputedStyle(el).position === "fixed") return;
    // A transformed ancestor becomes the containing block for a fixed
    // descendant, which would anchor the portrait to that ancestor's box
    // rather than the viewport.
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const t = getComputedStyle(p).transform;
      if (t && t !== "none") gsap.set(p, { clearProps: "transform" });
    }
    const r = el.getBoundingClientRect();
    gsap.set(el, {
      position: "fixed",
      left: r.left,
      top: r.top,
      // `absolute inset-0` leaves right/bottom at 0; against the viewport that
      // is over-constrained and can stretch the element full-screen.
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
  };

  const flyToAbout = contextSafe((duration = 0.75) => {
    const el = btnRef.current;
    const target = document.querySelector<HTMLElement>("[data-about-avatar]");
    if (!el) return;

    if (!target) {
      // Nothing to merge into — just retire it rather than stranding a button.
      gsap.to(el, { autoAlpha: 0, duration: 0.2, onComplete: () => to("gone") });
      return;
    }

    detach(el);
    const t = target.getBoundingClientRect();
    gsap
      .timeline({ onComplete: () => to("gone") })
      .to(el, {
        left: t.left,
        top: t.top,
        width: t.width,
        height: t.height,
        borderRadius: 9999,
        duration,
        ease: "power2.inOut",
      })
      // About's real avatar is already sitting underneath, so fading out here
      // reads as the two merging rather than one replacing the other.
      .to(el, { autoAlpha: 0, duration: Math.min(0.3, duration * 0.3) }, `-=${Math.min(0.25, duration * 0.25)}`);
  }) as (duration?: number) => void;

  /**
   * The return leg: bring the portrait back out of About and into the hero.
   * Ends by handing it back to normal flow, so Home is left exactly as it
   * started rather than with a fixed element parked on top of it.
   */
  const flyToHero = contextSafe((duration = 0.75) => {
    const el = btnRef.current;
    const slot = el?.parentElement;
    if (!el || !slot) return;

    detach(el);
    const s = slot.getBoundingClientRect();
    gsap.to(el, {
      left: s.left,
      top: s.top,
      width: s.width,
      height: s.height,
      borderRadius: 0,
      autoAlpha: 1,
      duration,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(el, { clearProps: "all" });
        const img = imgRef.current;
        if (img) gsap.set(img, { clearProps: "objectFit,objectPosition" });
        to("idle");
      },
    });
  }) as (duration?: number) => void;

  /**
   * Fly only once the destination has actually stopped moving.
   *
   * Timing this with a fixed delay is a trap: the scroll transition, the
   * section reveal that nudges the avatar into place, and the flight all have
   * independent durations, so any constant is wrong the moment one of them is
   * retuned — and measuring a target that is still travelling sends the
   * portrait to where the avatar *used to be*. Watching the target's own rect
   * settle covers every one of those cases at once.
   */
  const flyWhenSettled = useCallback((duration?: number) => {
    const started = performance.now();
    let lastTop = Number.POSITIVE_INFINITY;
    let lastLeft = Number.POSITIVE_INFINITY;
    let stableFrames = 0;

    const check = () => {
      const target = document.querySelector<HTMLElement>("[data-about-avatar]");
      if (!target) return flyToAbout(duration);

      if (performance.now() - started > SETTLE_TIMEOUT_MS) return flyToAbout(duration);

      // About's section reveal tweens an ancestor of the avatar, so the avatar
      // can be mid-flight even though the scroll itself has stopped. Asking
      // GSAP directly is exact, where watching the rect alone is a guess.
      const revealHost = target.closest<HTMLElement>("[data-reveal]");
      const animating =
        gsap.isTweening(target) || (revealHost ? gsap.isTweening(revealHost) : false);

      const { top, left } = target.getBoundingClientRect();
      const still = Math.abs(top - lastTop) < 0.5 && Math.abs(left - lastLeft) < 0.5;
      lastTop = top;
      lastLeft = left;
      // Several consecutive still frames, so a single coincidental match
      // part-way through an ease doesn't read as "arrived".
      stableFrames = still && !animating ? stableFrames + 1 : 0;

      if (stableFrames >= 3) return flyToAbout(duration);
      requestAnimationFrame(check);
    };

    requestAnimationFrame(check);
  }, [flyToAbout]);

  const startMorph = contextSafe(() => {
    const el = btnRef.current;
    const img = imgRef.current;
    if (!el || !img || phaseRef.current !== "idle") return;
    to("morphing");

    // Perspective must be a constant, never a tweened property. GSAP would
    // animate it up from its default of 0, and a perspective approaching zero
    // projects a rotating element to effectively infinite size — the flip
    // visibly explodes across the screen before settling.
    gsap.set(el, { transformPerspective: 900, transformOrigin: "50% 50%" });

    gsap
      .timeline({ onComplete: () => to("button") })
      // Two slow bounces.
      .to(el, { y: -34, duration: 0.42, ease: "power2.out" })
      .to(el, { y: 0, duration: 0.55, ease: "bounce.out" })
      .to(el, { y: -34, duration: 0.42, ease: "power2.out" })
      .to(el, { y: 0, duration: 0.55, ease: "bounce.out" })
      // Five fast flips. 5 x 360 lands it face-on again.
      .to(el, { rotationY: "+=1800", duration: 0.9, ease: "power1.inOut" })
      // Hand over from flow to fixed, using the live rect so nothing jumps.
      .add(() => {
        // Any transformed ancestor becomes the containing block for a fixed
        // descendant, which would silently offset the button by that
        // ancestor's position instead of anchoring it to the viewport.
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const t = getComputedStyle(p).transform;
          if (t && t !== "none") gsap.set(p, { clearProps: "transform" });
        }
        const r = el.getBoundingClientRect();
        gsap.set(el, {
          position: "fixed",
          left: r.left,
          top: r.top,
          // The element is `absolute inset-0`; leaving right/bottom at 0 while
          // it is fixed leaves it over-constrained against the viewport, which
          // can stretch it full-screen for a frame.
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
        // The hero art is a full-body cutout; once it's a small circle only a
        // head-and-shoulders crop reads at that size.
        gsap.set(img, { objectFit: "cover", objectPosition: "50% 12%" });
      })
      // Dive to the bottom-right corner, where it lives as a nav button.
      .to(el, {
        left: () => window.innerWidth - BUTTON_SIZE - BUTTON_MARGIN,
        top: () => window.innerHeight - BUTTON_SIZE - BUTTON_MARGIN,
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: 9999,
        duration: 0.85,
        ease: "power3.in",
      })
      // Land with a little squash-and-settle.
      .to(el, { scale: 1.15, duration: 0.12, ease: "power2.out" })
      .to(el, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.45)" });
  }) as () => void;

  // Idle invitation once it has settled as a button: a slow bob plus a
  // breathing halo, so it reads as an interactive control rather than a
  // stray image parked in the corner.
  useGSAP(
    () => {
      if (phase !== "button" || !btnRef.current) return;
      const el = btnRef.current;
      const bob = gsap.to(el, {
        y: -7,
        duration: 0.85,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      const halo = gsap.to(el, {
        boxShadow: "0 0 0 10px rgba(52,168,83,0.22), 0 10px 26px rgba(0,0,0,0.45)",
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      return () => {
        bob.kill();
        halo.kill();
        gsap.set(el, { y: 0, clearProps: "boxShadow" });
      };
    },
    // revertOnUpdate is required, not cosmetic: useGSAP defers cleanup to
    // unmount when dependencies are present, so without it these two infinite
    // tweens outlive the button phase — the halo keeps painting a rectangular
    // glow onto the restored hero portrait, and the bob keeps writing `y`
    // while the flight is trying to animate the same element.
    { dependencies: [phase], revertOnUpdate: true }
  );

  /**
   * Drive the portrait purely from section changes.
   *
   * The hover morph is optional — most visitors will just scroll. In that case
   * the portrait still has to get from the hero into About's slot and back, so
   * the same journey runs on the plain Home <-> About transition, timed to the
   * (deliberately slowed) snap so the two move as one. `button` reaches About
   * the same way, which is what makes the nav button and the scroll feel like
   * the same mechanism rather than two competing ones.
   */
  useEffect(() => {
    const phase = phaseRef.current;

    if (activeSection === "about" && (phase === "idle" || phase === "button")) {
      to("flying");
      setHeroPortraitArrived(true);
      flyWhenSettled(PORTRAIT_TRANSITION_S * 0.8);
      return;
    }

    // Coming back to the hero returns the portrait to its slot, so Home is
    // never left with an empty hole — and About goes back to being text-only.
    if (activeSection === "home" && (phase === "gone" || phase === "flying")) {
      to("flying");
      setHeroPortraitArrived(false);
      flyToHero(PORTRAIT_TRANSITION_S * 0.8);
    }
  }, [activeSection, setHeroPortraitArrived, flyWhenSettled, flyToHero]);

  const handleClick = useCallback(() => {
    if (phaseRef.current === "button") {
      // The section-change effect above runs the travel; this only moves the page.
      scrollToSection("about");
      return;
    }
    // Touch has no hover, so a tap is the only way in — run the same sequence
    // rather than leaving the whole interaction unreachable on mobile.
    if (phaseRef.current === "idle") {
      if (motionEnabled && !canHover) startMorph();
      else scrollToSection("about");
    }
  }, [scrollToSection, motionEnabled, canHover, startMorph]);

  const isButton = phase === "button" || phase === "flying";

  return (
    // data-hero-portrait: Home's entrance timeline animates this wrapper.
    <div data-hero-portrait className={`relative ${className}`}>
      {/* Reserves the hero's layout space; the animated copy sits on top and is
          free to leave the flow without collapsing the composition. */}
      <img src={HeroImage} alt="" aria-hidden className="invisible h-auto w-full" />

      <button
        ref={btnRef}
        type="button"
        onMouseEnter={enabled ? startMorph : undefined}
        onClick={handleClick}
        aria-label={isButton ? "Go to About" : "James Yunana — go to About"}
        title={isButton ? "Go to About" : undefined}
        className={
          "absolute inset-0 block cursor-pointer will-change-transform " +
          (isButton ? "shadow-2xl ring-2 ring-white/70 dark:ring-white/30" : "drop-shadow-2xl")
        }
      >
        <img
          ref={imgRef}
          src={HeroImage}
          alt="James Yunana"
          className="h-full w-full object-contain"
        />
      </button>
    </div>
  );
}

export default HeroPortraitMorph;
