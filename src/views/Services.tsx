import { useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useProjects } from "@/hooks/useProjects";
import { useCanHover } from "@/hooks/useCanHover";
import { useHoverIntent } from "@/hooks/useHoverIntent";
import { useReveal } from "@/hooks/useReveal";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { serviceCategories, matchProjectsToCategories } from "@/data/serviceCategories";
import { ServicePreviewCard } from "@/components/services/ServicePreviewCard";

/**
 * Redesigned to match a reference reel: dark full-bleed section, large
 * watermark type, a short list of categories with a hover-revealed project
 * preview. See Services.legacy.tsx for the previous 6-card icon grid.
 */
function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const { motionEnabled } = useSmoothScroll();
  useReveal(rootRef, { enabled: motionEnabled });

  const { projects } = useProjects();
  const canHover = useCanHover();
  // Floating hover-card path only makes sense with both motion and a real
  // hovering pointer; everything else gets the inline tap-to-expand fallback.
  const useFloatingCard = motionEnabled && canHover;

  const assignment = useMemo(
    () => matchProjectsToCategories(serviceCategories, projects),
    [projects]
  );

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { handleEnter, handleLeave } = useHoverIntent<number>(
    setHoveredIdx,
    () => setHoveredIdx(null),
    { enabled: useFloatingCard, enterDelay: 60, leaveDelay: 120 }
  );

  // Constant tilt/offset set once; only opacity+scale animate on hover, so
  // there's a single owner of the transform (GSAP) instead of fighting a raw
  // inline `transform` string set from JSX.
  useGSAP(
    () => {
      if (!useFloatingCard) return;
      cardRefs.current.forEach((el) => {
        if (el) gsap.set(el, { yPercent: -50, rotate: -4, transformOrigin: "center right" });
      });
    },
    { dependencies: [useFloatingCard, projects.length], scope: rootRef }
  );

  useGSAP(
    () => {
      if (!useFloatingCard) return;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const active = i === hoveredIdx;
        gsap.to(el, {
          autoAlpha: active ? 1 : 0,
          scale: active ? 1 : 0.9,
          duration: 0.45,
          ease: "power2.out",
        });
      });
    },
    { dependencies: [hoveredIdx, useFloatingCard], scope: rootRef }
  );

  return (
    <section
      id="services"
      ref={rootRef}
      className="relative flex section-vh w-full flex-col justify-center overflow-hidden px-4 py-12 md:px-24"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[2vw] left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[24vw] font-extrabold uppercase leading-none text-black/[0.04] dark:text-white/[0.06]"
      >
        /SERVICE
      </span>

      <div className="relative z-10 flex flex-col gap-10 md:gap-14">
        <div data-reveal className="flex flex-col gap-2 text-center md:text-left">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">/Service</span>
          <h2 className="text-2xl font-bold uppercase md:text-4xl">
            What I <span className="gradient-text">Can Do.</span>
          </h2>
        </div>

        <div
          data-reveal
          className="mx-auto w-full max-w-3xl divide-y divide-black/10 rounded-2xl border border-black/10 bg-black/[0.03] backdrop-blur-sm dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.03]"
        >
          {serviceCategories.map((category, i) => {
            const project = assignment.get(category.name) ?? null;
            const isExpanded = !useFloatingCard && expandedIdx === i;

            return (
              <div key={category.name} className="relative">
                <div
                  className="flex items-center justify-between gap-4 px-5 py-5 md:px-8 md:py-6"
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={handleLeave}
                  onFocus={() => handleEnter(i)}
                  onBlur={handleLeave}
                  onClick={
                    !useFloatingCard
                      ? () => setExpandedIdx((cur) => (cur === i ? null : i))
                      : undefined
                  }
                  tabIndex={0}
                  role={!useFloatingCard ? "button" : undefined}
                  aria-expanded={!useFloatingCard ? isExpanded : undefined}
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      icon={category.icon}
                      width={22}
                      height={22}
                      className="shrink-0 text-foreground/70"
                    />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide md:text-base">
                        {category.name}
                      </p>
                      <p className="mt-1 hidden max-w-md text-xs text-muted-foreground md:block">
                        {category.desc}
                      </p>
                    </div>
                  </div>
                  <Icon
                    icon="carbon:chevron-right"
                    width={18}
                    height={18}
                    className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
                      i === hoveredIdx || isExpanded ? "translate-x-1" : ""
                    }`}
                  />
                </div>

                {/* Floating preview — desktop, motion enabled. Always in the
                    DOM (not conditionally rendered) so GSAP has a stable node
                    to animate; visibility is opacity/scale only. */}
                {useFloatingCard && project && (
                  <div
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className="pointer-events-none invisible absolute right-4 top-1/2 z-20 opacity-0 md:right-10"
                  >
                    <ServicePreviewCard project={project} />
                  </div>
                )}

                {/* Inline fallback — touch, or reduced motion. */}
                {isExpanded && project && (
                  <div className="px-5 pb-5 md:px-8 md:pb-6">
                    <ServicePreviewCard project={project} className="w-full max-w-xs" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;
