import HeroImage from "@/assets/heroImage.webp";
import AppleClip from "@/assets/apple-art.svg";
import { Icon } from "@iconify/react";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";

/**
 * Cinematic hero only. The bio, CTAs, socials and contact details all live in
 * About now — Home's job is the headline and the portrait that falls into it.
 */
function Home() {
  // Native scrollIntoView would fight Lenis for ownership of scroll position.
  const { scrollToSection, motionEnabled } = useSmoothScroll();

  return (
    <section
      id="home"
      className="relative w-full h-[100dvh] flex flex-col justify-center items-center p-4 md:px-20"
    >
      <div className="flex flex-col-reverse md:flex-row items-center gap-8 w-full max-w-7xl">
        {/* min-w-0 so the headline can't force the row past its container —
            flex items default to min-width:auto, which overflows on long words. */}
        <div
          className="p-2 md:p-4 w-full min-w-0 flex flex-col gap-6 items-start"
          data-hero-copy
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-500">
              Available for freelance work
            </span>
          </div>

          <div>
            <img
              src={AppleClip}
              alt=""
              aria-hidden
              className="-rotate-12 relative -bottom-8 md:-bottom-16 -left-8 md:-left-16 w-16 md:w-auto"
            />
            <h1 className="uppercase text-4xl md:text-[clamp(2.5rem,4.6vw,4.5rem)] leading-tight font-montserrat">
              Crafting Digital <br />
              <span className="font-bold gradient-text">Experiences</span>
            </h1>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0 flex justify-center relative">
          {/* Height-aware as well as width-aware: the section is a hard
              100dvh, so on short viewports a fixed-size portrait would push
              the headline and scroll cue into each other. */}
          <div className="relative w-[min(280px,38vh)] md:w-[min(400px,30vw,52vh)] aspect-square">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-full animate-spin-slow" />

            {/*
             * The portrait itself is rendered once by HeroPortraitLayer, which
             * scrubs it from this slot down into About's avatar ring. This div
             * only reserves the space and reports its rect.
             */}
            <div
              data-hero-slot="home"
              className="absolute inset-0 rounded-full overflow-hidden"
            >
              {!motionEnabled && (
                <img
                  src={HeroImage}
                  className="w-full h-full object-cover"
                  alt="James Yunana - Full Stack Developer"
                />
              )}
            </div>

            {/* Floating badges */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-lg animate-float z-20">
              <Icon icon="mdi:code-braces" className="w-6 h-6 text-green-500" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-lg animate-float-delayed z-20">
              <Icon icon="mdi:server" className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
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
