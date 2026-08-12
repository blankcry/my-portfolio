// LEGACY — retired along with the falling-portrait scrub between Home and
// About (Home no longer exposes [data-hero-slot="home"] / [data-hero-proxy]).
// Not imported anywhere. Kept for reference / easy revert.
import { useRef } from "react";
import HeroImage from "@/assets/heroImage.webp";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * The single portrait on the page, scrubbed from Home's hero slot down into
 * About's avatar ring as the user scrolls.
 *
 * Implementation note: this is an absolutely-positioned proxy inside a layer
 * that spans the whole document, NOT GSAP Flip and NOT `position: fixed`.
 *
 * - Flip captures state at one instant and plays once; this transition is
 *   scrubbed and has to survive refresh, resize and the `md:` breakpoint.
 * - `position: fixed` would force per-frame `- window.scrollY` arithmetic.
 *
 * Because the layer spans the document, document coordinates *are* the
 * coordinate system, so the whole thing is one `fromTo` with function-based
 * values that re-resolve on every `invalidateOnRefresh`.
 */
export function HeroPortraitLayer() {
  const layerRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef<HTMLImageElement>(null);
  const { motionEnabled, introDone } = useSmoothScroll();

  useGSAP(
    () => {
      // Wait for the preloader to hand the proxy over. Creating the scrub any
      // earlier would immediately snap the portrait to its progress-0 position
      // and stomp the intro. By the time this runs the proxy is already sitting
      // exactly on the home slot, so progress 0 is a no-op — no seam.
      if (!motionEnabled || !introDone) return;

      const layer = layerRef.current;
      const proxy = proxyRef.current;
      if (!layer || !proxy) return;

      const homeSlot = document.querySelector<HTMLElement>('[data-hero-slot="home"]');
      const aboutSlot = document.querySelector<HTMLElement>('[data-hero-slot="about"]');
      const resting = document.querySelector<HTMLElement>("[data-hero-resting]");
      if (!homeSlot || !aboutSlot) return;

      /** Slot geometry expressed in the layer's own coordinate space. */
      const rectIn = (el: HTMLElement): Rect => {
        const l = layer.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return { x: r.left - l.left, y: r.top - l.top, w: r.width, h: r.height };
      };

      const from = () => rectIn(homeSlot);
      const to = () => rectIn(aboutSlot);

      gsap.set(proxy, { transformOrigin: "50% 50%", autoAlpha: 1, clearProps: "clipPath" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          endTrigger: "#about",
          // End when About's avatar reaches roughly the middle of the viewport.
          end: () => `top top+=${Math.max(0, window.innerHeight * 0.25)}`,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Hand off to plain, layout-stable DOM once the fall completes, so
            // nothing absolute is fighting a resize while the user reads on.
            const landed = self.progress > 0.995;
            gsap.set(proxy, { autoAlpha: landed ? 0 : 1 });
            if (resting) gsap.set(resting, { autoAlpha: landed ? 1 : 0 });
          },
        },
      });

      tl.fromTo(
        proxy,
        {
          x: () => from().x,
          y: () => from().y,
          width: () => from().w,
          height: () => from().h,
        },
        {
          x: () => to().x,
          y: () => to().y,
          width: () => to().w,
          height: () => to().h,
          ease: "none",
        },
        0
      )
        // Character: a full turn with a little scale overshoot mid-fall.
        .fromTo(proxy, { rotate: 0 }, { rotate: 360, ease: "power2.inOut" }, 0)
        .to(proxy, { scale: 1.08, duration: 0.6, ease: "power1.out" }, 0)
        .to(proxy, { scale: 1, duration: 0.4, ease: "power2.in" }, 0.6);

      // Home's copy clears out over the first 40% of the fall.
      gsap.to("[data-hero-copy], [data-hero-cue]", {
        y: -60,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: () => `+=${window.innerHeight * 0.4}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Once past About the layer has no job; stop it costing anything.
      ScrollTrigger.create({
        trigger: "#experience",
        start: "top bottom",
        onEnter: () => gsap.set(layer, { display: "none" }),
        onLeaveBack: () => gsap.set(layer, { display: "block" }),
      });
    },
    { dependencies: [motionEnabled, introDone], revertOnUpdate: true }
  );

  // Reduced motion: Home and About render their own plain <img> instead.
  if (!motionEnabled) return null;

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-30" aria-hidden>
      <img
        ref={proxyRef}
        data-hero-proxy
        src={HeroImage}
        alt=""
        decoding="async"
        className="absolute left-0 top-0 rounded-full object-cover shadow-2xl will-change-transform opacity-0"
      />
    </div>
  );
}

export default HeroPortraitLayer;
