import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Reveals `[data-reveal]` descendants as their section scrolls into view.
 *
 * Deliberately written as `set` + an explicit `onEnter`, rather than a
 * `gsap.from()` with an attached ScrollTrigger. The `from()` form leaves the
 * elements in their hidden start state if the trigger never fires — and it
 * won't fire when the page loads already scrolled past the section (a deep
 * link, or a restored scroll position). Content that silently stays invisible
 * is the worst failure mode here, so the trigger is only ever allowed to *show*
 * things, and anything already above the viewport is shown with no animation
 * at all.
 */
export function useReveal(
  scopeRef: RefObject<HTMLElement>,
  { enabled, dependencies = [] as unknown[] }: { enabled: boolean; dependencies?: unknown[] }
) {
  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      // `gsap.utils.toArray` queries the document and is NOT scoped by the
      // surrounding gsap.context the way selector strings passed to
      // gsap.to/from are — without the second argument every section's reveal
      // would grab every other section's targets.
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope);
      if (!targets.length) return;

      const show = () => gsap.set(targets, { clearProps: "all" });

      if (!enabled) {
        show();
        return;
      }

      // Already scrolled past it: show immediately, don't animate offscreen.
      if (scope.getBoundingClientRect().top < 0) {
        show();
        return;
      }

      gsap.set(targets, { y: 32, autoAlpha: 0 });

      ScrollTrigger.create({
        trigger: scope,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(targets, {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            overwrite: "auto",
            onComplete: show,
          }),
      });
    },
    { scope: scopeRef, dependencies: [enabled, ...dependencies] }
  );
}
