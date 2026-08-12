import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CompanyLogo } from "@/components/experience/CompanyLogo";
import type { Experience } from "@/types";

const SPEED_PX_PER_SEC = 60;

interface LogoMarqueeProps {
  items: Experience[];
  motionEnabled: boolean;
  onSelect?: (id: string) => void;
}

/**
 * Seamless end-to-end logo loop.
 *
 * Technique: render N identical tracks side by side and translate the wrapper by
 * exactly one track width, wrapping with `modifiers`. Measuring a real track
 * (rather than using `xPercent` on items) keeps it seamless with variable-width
 * items, and the copy count is derived from the measurement so it fills any
 * viewport without a hard-coded guess.
 */
export function LogoMarquee({ items, motionEnabled, onSelect }: LogoMarqueeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [copies, setCopies] = useState(2);

  // The seed has 9 rows but only 8 companies — Varroe appears twice.
  const companies = Array.from(
    new Map(items.map((e) => [e.company, e])).values()
  );

  // How many copies it takes to cover the viewport is a function of viewport
  // width, so it has to be re-derived on resize — measuring once would leave a
  // visible gap in the belt on a much wider screen.
  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!motionEnabled || !track || !viewport) return;

    const measure = () => {
      const single = track.offsetWidth;
      if (single <= 0 || viewport.offsetWidth <= 0) return;
      const needed = Math.max(2, Math.ceil((viewport.offsetWidth * 2) / single) + 1);
      // Only set when it actually changes, or this loops with the render.
      setCopies((current) => (current === needed ? current : needed));
    };

    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(track);
    measure();
    return () => ro.disconnect();
  }, [motionEnabled, companies.length]);

  useGSAP(
    () => {
      if (!motionEnabled || companies.length === 0) return;
      const wrap = wrapRef.current;
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!wrap || !track || !viewport) return;

      const single = track.offsetWidth;
      if (single <= 0) return;

      const tween = gsap.to(wrap, {
        x: -single,
        duration: single / SPEED_PX_PER_SEC,
        ease: "none",
        repeat: -1,
        modifiers: { x: gsap.utils.unitize((x: string) => parseFloat(x) % single) },
      });
      tweenRef.current = tween;

      // Don't burn frames while the section is offscreen.
      ScrollTrigger.create({
        trigger: "#experience",
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
        onUpdate: (self) => {
          // Scroll velocity nudges the belt along — cheap, and reads expensive.
          const boost = gsap.utils.clamp(1, 4, 1 + Math.abs(self.getVelocity()) / 1500);
          tween.timeScale(boost);
        },
      });

      let settle: number | undefined;
      const onScroll = () => {
        window.clearTimeout(settle);
        settle = window.setTimeout(() => gsap.to(tween, { timeScale: 1, duration: 0.6 }), 120);
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        window.clearTimeout(settle);
        window.removeEventListener("scroll", onScroll);
        tweenRef.current = null;
      };
    },
    { dependencies: [copies, companies.length, motionEnabled], revertOnUpdate: true }
  );

  if (companies.length === 0) return null;

  const slowDown = () => {
    if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 0.25, duration: 0.4 });
  };
  const speedUp = () => {
    if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6 });
  };

  const renderTrack = (key: number, ref?: React.Ref<HTMLUListElement>) => (
    <ul key={key} ref={ref} className="flex shrink-0 items-center gap-10 pr-10">
      {companies.map((exp) => (
        <li key={exp.id}>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => onSelect?.(exp.id)}
            className="flex items-center gap-3 opacity-70 transition-opacity duration-300 hover:opacity-100"
          >
            <CompanyLogo company={exp.company} logoUrl={exp.logo_url} size={48} />
            <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-wide">
              {exp.company}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="-mx-4 border-t border-black/10 px-4 py-4 dark:border-white/15 md:-mx-16 md:px-16">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Companies I've built for
      </p>

      {motionEnabled ? (
        // Decorative: every company here is already listed in the accordion.
        <div
          ref={viewportRef}
          aria-hidden
          className="overflow-hidden"
          onMouseEnter={slowDown}
          onMouseLeave={speedUp}
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <div ref={wrapRef} className="flex w-max will-change-transform">
            {Array.from({ length: copies }).map((_, i) =>
              renderTrack(i, i === 0 ? trackRef : undefined)
            )}
          </div>
        </div>
      ) : (
        // Reduced motion: a plain wrapped row, no tween.
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {renderTrack(0)}
        </div>
      )}
    </div>
  );
}

export default LogoMarquee;
