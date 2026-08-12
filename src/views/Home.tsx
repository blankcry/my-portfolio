import { useRef } from "react";
import { Icon } from "@iconify/react";
import { HeroPortraitMorph } from "@/components/hero/HeroPortraitMorph";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Cinematic hero, redesigned to match a reference reel: giant split-type
 * headline (outline word + solid word) with the portrait breaking its
 * baseline, role tag, single CTA, staggered entrance with the portrait
 * resolving last. See Home.legacy.tsx for the previous version (the one with
 * the falling-portrait scroll scrub into About — retired, since the reference
 * doesn't have an equivalent and a static in-place fade reads closer to it).
 */
function Home() {
  const { scrollToSection, motionEnabled, introDone } = useSmoothScroll();
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled || !introDone) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      // Text group first — pill, headline, role, CTA — matching the reference's
      // order where the frame is legible before the photo resolves.
      tl.from("[data-hero-el]", { y: 28, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, 0)
        // Portrait fades/scales in last and slower.
        // clearProps is load-bearing: a residual inline transform on this
        // wrapper would make it the containing block for its `position: fixed`
        // descendant, and HeroPortraitMorph's nav button relies on being
        // positioned against the viewport once it dives.
        .from(
          "[data-hero-portrait]",
          {
            autoAlpha: 0,
            scale: 0.92,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "transform",
          },
          0.35
        )
        .from("[data-hero-cue]", { autoAlpha: 0, duration: 0.5 }, "-=0.2");
    },
    { scope: rootRef, dependencies: [motionEnabled, introDone] }
  );

  return (
    <section
      ref={rootRef}
      id="home"
      // Exactly one viewport: sections snap hard now, so none may overflow.
      className="relative w-full section-vh flex flex-col items-center justify-center overflow-hidden px-4 py-16 md:px-12"
    >
      {/* Soft decorative backdrop — a nod to the reference's textured
          background, kept on-brand with the site's existing green/blue gradient
          rather than a literal cloud texture. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-green-500/10 via-blue-500/5 to-transparent blur-3xl" />
      </div>

      <div className="flex flex-col items-center gap-3 md:gap-4" data-hero-el>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-green-500">
            Available for freelance work
          </span>
        </div>
      </div>

      <div className="mt-3 md:mt-4 flex flex-col items-center">
        <h1
          data-hero-el
          className="relative z-0 select-none text-center font-montserrat font-extrabold uppercase leading-[0.92] text-[13vw] sm:text-[11vw] md:text-[7vw] lg:text-[6vw]"
        >
          <span className="text-stroke block">Crafting Digital</span>
          <span className="gradient-text block">Experiences</span>
        </h1>

        {/*
         * The portrait breaks the headline's baseline, overlapping the lower
         * half of the text. Deliberately normal-flow with a negative margin
         * rather than absolute positioning: the overlap amount is
         * viewport-relative (vw units, matching the headline's own scale), so
         * an absolutely-positioned portrait would need its overlap distance
         * calculated per breakpoint and everything below it would need a
         * matching manual height reservation to avoid being covered. A
         * negative margin overlaps upward by a fixed amount while still
         * contributing its full height to the flow — content after it always
         * clears it correctly, at any viewport, with no measurement needed.
         * heroImage.webp is already a background-removed cutout, so no
         * masking is needed to make the overlap read cleanly.
         */}
        <HeroPortraitMorph className="z-10 -mt-[11vw] w-[38vw] max-w-[220px] sm:-mt-[9.5vw] md:-mt-[7.5vw] md:max-w-[260px] lg:-mt-[6.5vw]" />
      </div>

      <div className="relative z-20 mt-2 md:mt-3 flex flex-col items-center gap-3 md:gap-4">
        <span
          data-hero-el
          className="text-sm md:text-base font-semibold italic text-gray-600 dark:text-gray-400"
        >
          Full Stack Developer
        </span>

        <button
          data-hero-el
          onClick={() => scrollToSection("works")}
          className="btn-jump dark:bg-white bg-black text-white dark:text-black py-3 px-7 md:py-4 md:px-8 font-medium flex items-center gap-3 text-sm md:text-base rounded-full shadow-lg"
        >
          Explore My Work
          <Icon icon="carbon:arrow-up-right" width="18" height="18" />
        </button>
      </div>

      <button
        data-hero-cue
        aria-label="Scroll to about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => scrollToSection("about")}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
          Scroll
        </span>
        <span className="relative block h-12 w-px overflow-hidden bg-gray-300 dark:bg-gray-700">
          <span
            data-hero-cue-line
            className="absolute inset-x-0 top-0 h-1/2 bg-green-500"
          />
        </span>
      </button>
    </section>
  );
}

export default Home;
