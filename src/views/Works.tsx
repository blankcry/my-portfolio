import { useEffect, useRef } from "react";
import { useProjects } from "@/hooks/useProjects";
import { useReveal } from "@/hooks/useReveal";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectCard from "@/components/ProjectCard";
import { ProjectRing } from "@/components/works/ProjectRing";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";

/** The ring stops reading as a ring past a dozen nodes. */
const MAX_ON_RING = 12;

function Works() {
  const { projects, loading, error } = useProjects();
  const { requestRefresh, motionEnabled } = useSmoothScroll();
  const isMobile = useIsMobile();
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef, { enabled: motionEnabled });

  useEffect(() => {
    if (!loading) requestRefresh();
  }, [loading, projects.length, requestRefresh]);

  const onRing = projects.slice(0, MAX_ON_RING);

  // One tree, not `hidden md:block` on both — that would mount every dialog twice.
  const useRing = !isMobile && motionEnabled && onRing.length >= 3;

  return (
    <section
      id="works"
      ref={rootRef}
      className="w-full flex flex-col gap-8 p-4 md:px-24 py-12 gradient md:rounded-t-[7rem] rounded-xl"
    >
      <div className="flex flex-col gap-4 w-full text-center justify-center text-white">
        <span data-reveal className="capitalize font-bold text-[30px] md:text-[40px]">
          Explore my <span className="gradient-text">Projects.</span>
        </span>
        <p data-reveal className="max-w-2xl mx-auto text-white/80">
          A collection of my recent work and personal projects. Each project
          represents a unique challenge and solution.
        </p>
      </div>

      {loading && (
        // Skeleton nodes on the ring's footprint, so the section doesn't resize
        // when the real data lands.
        <div className="relative mx-auto aspect-square w-full max-w-[820px]">
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <Skeleton
                key={i}
                className="absolute left-1/2 top-1/2 h-[140px] w-[140px] rounded-2xl"
                style={{
                  transform: `translate(calc(-50% + ${Math.sin(a) * 38}%), calc(-50% + ${
                    -Math.cos(a) * 21
                  }%))`,
                }}
              />
            );
          })}
        </div>
      )}

      {error && <p className="text-center text-white">Error fetching projects: {error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p className="py-24 text-center text-2xl font-semibold text-white/80">
          Projects coming soon.
        </p>
      )}

      {!loading && !error && projects.length > 0 && (
        <>
          {useRing && <ProjectRing projects={onRing} motionEnabled={motionEnabled} />}

          {!useRing && isMobile && (
            // Touch has no hover, so the ring's whole interaction is unavailable.
            // A snap rail is the honest mobile equivalent. Horizontal CSS snap is
            // safe here: Lenis only owns vertical window scroll.
            <div
              data-lenis-prevent
              className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {projects.map((project) => (
                <div key={project.id} className="w-[82vw] shrink-0 snap-center">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}

          {!useRing && !isMobile && (
            // Too few projects for a ring, or reduced motion: plain grid.
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Works;
