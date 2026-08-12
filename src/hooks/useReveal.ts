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

      // Already scrolled past it (deep link, restored position): show it now
      // rather than animating something nobody can see. The trigger is still
      // registered below, so scrolling back up replays it normally.
      const startedPast = scope.getBoundingClientRect().top < 0;
      gsap.set(targets, startedPast ? { clearProps: "all" } : { y: 32, autoAlpha: 0 });

      let tween: gsap.core.Tween | null = null;

      const play = () => {
        // One clean run per entry: if a previous run is still going, leave it
        // alone rather than restarting it half-way and making it stutter.
        if (tween?.isActive()) return;
        gsap.set(targets, { y: 32, autoAlpha: 0 });
        tween = gsap.to(targets, {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          overwrite: "auto",
          onComplete: show,
        });
      };

      // Replays on every entry, from either direction, rather than firing once
      // for the lifetime of the page — sections are snapped to repeatedly, and
      // arriving at one should always feel like it just assembled itself.
      ScrollTrigger.create({
        trigger: scope,
        start: "top 85%",
        end: "bottom 15%",
        onEnter: play,
        onEnterBack: play,
      });
    },
    { scope: scopeRef, dependencies: [enabled, ...dependencies] }
  );
}
