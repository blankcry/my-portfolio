import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useProjects } from "@/hooks/useProjects";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { WorkCard } from "@/components/works/WorkCard";
import { ProjectCardSkeleton } from "@/components/ProjectCardSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { categoryOf } from "@/lib/projects";
import { PROJECT_CATEGORIES } from "@/types";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const TABS = ["All", ...PROJECT_CATEGORIES] as const;
/** The section is one viewport tall: a 2x2 grid fits on desktop, 2 stacked on mobile. */
const VISIBLE_DESKTOP = 4;
const VISIBLE_MOBILE = 2;

/**
 * "Selected Work" — redesigned to match the reference reel: PORTFOLIO
 * watermark, centred header, filter tabs and View All Work on one line, then a
 * 2x2 grid. Everything fades in as a staggered sequence when the section snaps
 * into view. See Works.legacy.tsx for the previous circular-ring version.
 */
function Works() {
  const { projects, loading, error } = useProjects();
  const { requestRefresh, motionEnabled } = useSmoothScroll();
  const isMobile = useIsMobile();
  const rootRef = useRef<HTMLElement>(null);

  const [tab, setTab] = useState<(typeof TABS)[number]>("All");

  const filtered = useMemo(
    () => (tab === "All" ? projects : projects.filter((p) => categoryOf(p) === tab)),
    [projects, tab]
  );
  const shown = filtered.slice(0, isMobile ? VISIBLE_MOBILE : VISIBLE_DESKTOP);

  useEffect(() => {
    if (!loading) requestRefresh();
  }, [loading, projects.length, requestRefresh]);

  // Entrance sequence, in the reference's order: header, then the filter/CTA
  // row, then the cards. Fires when the section snaps into view.
  useGSAP(
    () => {
      if (!motionEnabled || loading) return;
      const targets = gsap.utils.toArray<HTMLElement>("[data-work-seq]", rootRef.current);
      const cards = gsap.utils.toArray<HTMLElement>("[data-work-card]", rootRef.current);
      if (!targets.length && !cards.length) return;

      const all = [...targets, ...cards];
      const show = () => gsap.set(all, { clearProps: "all" });

      // Already past it (e.g. deep link): show immediately rather than
      // animating offscreen. The trigger is still registered, so coming back
      // to the section replays the sequence.
      const startedPast = (rootRef.current?.getBoundingClientRect().top ?? 0) < -10;
      gsap.set(all, startedPast ? { clearProps: "all" } : { y: 24, autoAlpha: 0 });

      let tl: gsap.core.Timeline | null = null;

      const play = () => {
        // One clean run per entry — don't restart a sequence already playing.
        if (tl?.isActive()) return;
        gsap.set(all, { y: 24, autoAlpha: 0 });
        tl = gsap
          .timeline({ defaults: { ease: "power3.out" }, onComplete: show })
          .to(targets, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.12 })
          .to(cards, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.09 }, "-=0.2");
      };

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: play,
        onEnterBack: play,
      });
    },
    // revertOnUpdate: without it useGSAP defers cleanup to unmount, so every
    // filter change would stack another ScrollTrigger on top of the last.
    { scope: rootRef, dependencies: [motionEnabled, loading, tab], revertOnUpdate: true }
  );

  return (
    <section
      id="works"
      ref={rootRef}
      className="relative flex section-vh w-full flex-col overflow-hidden px-4 py-8 md:px-12"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 select-none whitespace-nowrap text-[16vw] font-extrabold uppercase leading-none tracking-tight text-black/[0.04] dark:text-white/[0.05]"
      >
        Portfolio
      </span>

      <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col gap-4">
        <h2
          data-work-seq
          className="text-center text-3xl font-extrabold uppercase md:text-5xl"
        >
          /Selected Work
        </h2>

        <div
          data-work-seq
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex flex-wrap items-center gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                aria-pressed={tab === t}
                className={
                  "rounded-full px-3 py-1.5 text-sm transition-colors " +
                  (tab === t
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {t}
              </button>
            ))}
          </div>

          <Link
            to="/work"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium shadow-sm transition-transform hover:scale-105 dark:border-white/15 dark:bg-neutral-900"
          >
            View All Work
            <Icon icon="carbon:arrow-up-right" width={16} height={16} />
          </Link>
        </div>

        {error && <p className="py-8 text-center">Error fetching projects: {error}</p>}

        {loading && (
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-2">
            {Array.from({ length: isMobile ? VISIBLE_MOBILE : VISIBLE_DESKTOP }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !error && shown.length > 0 && (
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-2">
            {shown.map((project) => (
              <WorkCard key={project.id} project={project} reveal dense />
            ))}
          </div>
        )}

        {!loading && !error && shown.length === 0 && (
          <p className="py-12 text-center text-gray-500">
            No projects in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}

export default Works;
