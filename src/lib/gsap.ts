import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * The single place in the app that imports from "gsap".
 *
 * `vite-prerender-plugin` SSR-transforms the whole module graph at build time,
 * so this file is evaluated in Node. Anything touching `window` at module scope
 * breaks `yarn build` — hence the guard. Inside a `useGSAP`/`useLayoutEffect`
 * body nothing runs during SSR, so those are safe without guards.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.6 });
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Height of the mobile sticky header. Must stay in sync with Navbar's `h-16`. */
export const MOBILE_HEADER_H = 64;

export { gsap, ScrollTrigger, useGSAP };
