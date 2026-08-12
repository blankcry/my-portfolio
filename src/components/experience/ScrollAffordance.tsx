import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

/** Ignore sub-pixel/rounding noise when deciding if an end has been reached. */
const EDGE_TOLERANCE = 4;
const STEP_RATIO = 0.7;

/**
 * Bouncing up/down affordances for a scrollable list.
 *
 * The Experience accordion scrolls inside a fixed-height column with a soft
 * mask at both edges, which hides the usual "content is cut off" cue — so
 * without something explicit the list reads as complete when it isn't. Each
 * arrow only appears when there is actually something in that direction.
 */
export function ScrollAffordance({
  targetRef,
  className = "",
}: {
  targetRef: React.RefObject<HTMLElement>;
  className?: string;
}) {
  const [canUp, setCanUp] = useState(false);
  const [canDown, setCanDown] = useState(false);
  const frame = useRef<number | undefined>(undefined);

  const measure = useCallback(() => {
    const el = targetRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setCanUp(scrollTop > EDGE_TOLERANCE);
    setCanDown(scrollTop + clientHeight < scrollHeight - EDGE_TOLERANCE);
  }, [targetRef]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const onScroll = () => {
      // Coalesce to one measurement per frame; scroll fires far more often.
      if (frame.current !== undefined) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = undefined;
        measure();
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    // The accordion changes height as panels open, and the list is populated
    // asynchronously — both change what's reachable without any scrolling.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    Array.from(el.children).forEach((child) => ro.observe(child));
    measure();

    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [targetRef, measure]);

  const nudge = (dir: 1 | -1) => {
    const el = targetRef.current;
    if (!el) return;
    el.scrollBy({ top: dir * el.clientHeight * STEP_RATIO, behavior: "smooth" });
  };

  const button = (dir: 1 | -1, visible: boolean) => (
    <button
      type="button"
      onClick={() => nudge(dir)}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      aria-label={dir === 1 ? "Show more experience" : "Show earlier experience"}
      className={
        "pointer-events-auto grid h-9 w-9 place-items-center rounded-full border border-black/15 bg-black/5 text-foreground backdrop-blur-sm transition-opacity duration-300 hover:bg-black/10 motion-safe:animate-bounce dark:border-white/25 dark:bg-white/10 dark:hover:bg-white/20 " +
        (visible ? "opacity-100" : "pointer-events-none opacity-0")
      }
    >
      <Icon icon={dir === 1 ? "carbon:chevron-down" : "carbon:chevron-up"} width={18} height={18} />
    </button>
  );

  return (
    <div
      className={`pointer-events-none flex flex-col items-center justify-between ${className}`}
    >
      {button(-1, canUp)}
      {button(1, canDown)}
    </div>
  );
}

export default ScrollAffordance;
