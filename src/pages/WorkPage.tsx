import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useProjects } from "@/hooks/useProjects";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { useReveal } from "@/hooks/useReveal";
import { WorkCard } from "@/components/works/WorkCard";
import { ProjectCardSkeleton } from "@/components/ProjectCardSkeleton";
import { categoryOf } from "@/lib/projects";
import { PROJECT_CATEGORIES } from "@/types";

const TABS = ["All", ...PROJECT_CATEGORIES] as const;

/** /work — the full listing. Ordinary scrolling page, no section snapping. */
export function WorkPage() {
  const { projects, loading, error } = useProjects();
  const { motionEnabled } = useSmoothScroll();
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef, { enabled: motionEnabled });

  const [tab, setTab] = useState<(typeof TABS)[number]>("All");

  const filtered = useMemo(
    () => (tab === "All" ? projects : projects.filter((p) => categoryOf(p) === tab)),
    [projects, tab]
  );

  return (
    <div ref={rootRef} className="w-full px-4 py-12 md:px-16 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          data-reveal
          to="/"
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
        >
          <Icon icon="carbon:arrow-left" width={16} height={16} />
          Back
        </Link>

        <div className="mb-8 flex flex-col gap-3">
          <span data-reveal className="text-xs uppercase tracking-[0.3em] text-gray-500">
            /All Work
          </span>
          <h1 data-reveal className="text-3xl font-extrabold uppercase md:text-5xl">
            Everything I've <span className="gradient-text">Built.</span>
          </h1>
        </div>

        <div data-reveal className="mb-8 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={
                "rounded-full px-4 py-2 text-sm transition-colors " +
                (tab === t
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "border border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5")
              }
            >
              {t}
            </button>
          ))}
        </div>

        {error && <p className="py-12 text-center">Error fetching projects: {error}</p>}

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <WorkCard key={project.id} project={project} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="py-16 text-center text-gray-500">
                No projects in this category yet.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default WorkPage;
