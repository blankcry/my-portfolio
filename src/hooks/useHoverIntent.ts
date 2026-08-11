import { useCallback, useEffect, useRef } from "react";

interface Options {
  enterDelay?: number;
  leaveDelay?: number;
  /** When false the handlers are inert — pass `useCanHover()`. */
  enabled?: boolean;
}

/**
 * Hover intent with a single shared timer.
 *
 * The shared timer is the point: sweeping the pointer across five accordion
 * rows should open the one you land on, not fire five opens in sequence. Each
 * new enter cancels whatever was pending.
 */
export function useHoverIntent<T>(
  onEnter: (value: T) => void,
  onLeave: () => void,
  { enterDelay = 120, leaveDelay = 260, enabled = true }: Options = {}
) {
  const timer = useRef<number | undefined>(undefined);
  const enterRef = useRef(onEnter);
  const leaveRef = useRef(onLeave);

  enterRef.current = onEnter;
  leaveRef.current = onLeave;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleEnter = useCallback(
    (value: T) => {
      if (!enabled) return;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => enterRef.current(value), enterDelay);
    },
    [enabled, enterDelay]
  );

  const handleLeave = useCallback(() => {
    if (!enabled) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => leaveRef.current(), leaveDelay);
  }, [enabled, leaveDelay]);

  return { handleEnter, handleLeave };
}
