import { useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Header is always shown within this many px of the top, regardless of direction. */
const REVEAL_ZONE = 40;

interface Options {
  /** Forces the header visible — e.g. while the mobile menu is open. */
  paused?: boolean;
  /** Re-arms the reveal zone and clears `hidden` — pass the route pathname. */
  resetKey?: string;
}

/**
 * Drives the header's "hide on scroll down, show on scroll up (or near the
 * top)" behaviour, plus a `scrolled` flag for swapping in a translucent
 * backdrop once content has moved underneath it.
 */
export function useHeaderScrollState({ paused = false, resetKey }: Options = {}) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useGSAP(
    () => {
      setHidden(false);
      setScrolled(window.scrollY > 8);

      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          setScrolled(y > 8);
          setHidden(!paused && y > REVEAL_ZONE && self.direction === 1);
        },
      });

      return () => st.kill();
    },
    { dependencies: [paused, resetKey] }
  );

  return { hidden: paused ? false : hidden, scrolled };
}
