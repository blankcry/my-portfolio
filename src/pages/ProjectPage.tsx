import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useProjects } from "@/hooks/useProjects";
import { useSmoothScroll } from "@/components/scroll/SmoothScrollProvider";
import { useReveal } from "@/hooks/useReveal";
import { WorkCard } from "@/components/works/WorkCard";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryOf, findProject, serviceOf } from "@/lib/projects";

/** /work/:slug — single project. Ordinary scrolling page, no section snapping. */
export function ProjectPage() {
  const { slug } = useParams();
  const { projects, loading, error } = useProjects();
  const { motionEnabled } = useSmoothScroll();
  const rootRef = useRef<HTMLDivElement>(null);

  const project = findProject(projects, slug);
  // Keyed on the resolved project so the reveal re-runs once async data lands.
  useReveal(rootRef, { enabled: motionEnabled, dependencies: [project?.id] });

  const backPill = (
    <Link
      to="/work"
      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-black/5 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
    >
      <Icon icon="carbon:arrow-left" width={16} height={16} />
      Back
    </Link>
  );

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-16 md:py-20">
        <Skeleton className="mb-10 h-9 w-24 rounded-full" />
        <Skeleton className="mb-4 h-14 w-2/3" />
        <Skeleton className="mb-10 h-5 w-1/2" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center md:px-16">
        <h1 className="text-2xl font-bold md:text-4xl">
          {error ? "Couldn't load that project." : "Project not found."}
        </h1>
        {error && <p className="text-gray-500">{error}</p>}
        {backPill}
      </div>
    );
  }

  const others = projects.filter((p) => p.id !== project.id).slice(0, 2);
  const service = serviceOf(project);
  const tools = (project.stack ?? []).slice(0, 6);

  return (
    <div ref={rootRef} className="w-full px-4 py-8 md:px-16 md:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div data-reveal className="mb-12 flex items-center justify-between gap-4">
          {backPill}
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm backdrop-blur-sm dark:border-white/15 dark:bg-white/5">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Available for New Project
          </span>
        </div>

        {/* ---- Title block + right-aligned meta ---- */}
        <div className="mb-14 flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 flex-col gap-5 md:max-w-xl">
            <div data-reveal className="flex flex-wrap gap-2">
              {[categoryOf(project), ...(project.stack ?? []).slice(0, 1)].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/10 px-4 py-1.5 text-sm dark:border-white/15"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 data-reveal className="flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-extrabold md:text-6xl">{project.name}</span>
              <span className="text-base text-gray-500 md:text-lg">
                /{categoryOf(project)}
              </span>
            </h1>

            {project.desc && (
              <p data-reveal className="text-base text-gray-600 dark:text-gray-400">
                {project.desc}
              </p>
            )}

            <div data-reveal className="mt-2 flex flex-wrap gap-3">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 dark:bg-white dark:text-black"
                >
                  Live Preview
                  <Icon icon="carbon:arrow-up-right" width={16} height={16} />
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-medium transition-transform hover:scale-105 dark:border-white/20"
                >
                  <Icon icon="carbon:logo-github" width={16} height={16} />
                  Source
                </a>
              )}
              <Link
                to="/#contacts"
                className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-medium transition-transform hover:scale-105 dark:border-white/20"
              >
                Contact Me
              </Link>
            </div>
          </div>

          <dl data-reveal className="flex shrink-0 flex-col gap-8 md:items-end md:text-right">
            <div>
              <dt className="text-sm text-gray-500">Service</dt>
              <dd className="mt-1 text-lg font-semibold md:text-xl">{service}</dd>
            </div>
            {project.timeline && (
              <div>
                <dt className="text-sm text-gray-500">Timeline</dt>
                <dd className="mt-1 text-lg font-semibold md:text-xl">{project.timeline}</dd>
              </div>
            )}
            {tools.length > 0 && (
              <div>
                <dt className="text-sm text-gray-500">Tools</dt>
                <dd className="mt-2 flex flex-wrap gap-2 md:justify-end">
                  {tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-medium shadow-sm dark:border-white/10 dark:bg-neutral-900"
                    >
                      {tool}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* ---- Gallery ---- */}
        {project.photo_url?.length > 0 && (
          <div className="flex flex-col gap-6 md:gap-10">
            {project.photo_url.map((photo, i) => (
              <div
                key={i}
                data-reveal
                className="overflow-hidden rounded-2xl border border-black/5 bg-neutral-100 dark:border-white/10 dark:bg-neutral-900"
              >
                <img
                  src={photo}
                  alt={`${project.name} — screen ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* ---- More work ---- */}
        {others.length > 0 && (
          <div className="mt-20">
            <h2 data-reveal className="mb-8 text-xl font-extrabold uppercase md:text-3xl">
              /More Work
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {others.map((p) => (
                <WorkCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}

        {/* ---- Closing CTA ---- */}
        <div className="mt-24 flex flex-col items-center gap-6 border-t border-black/10 pt-16 text-center dark:border-white/10">
          <h2 data-reveal className="text-2xl font-extrabold uppercase md:text-4xl">
            Have a project in mind?
          </h2>
          <Link
            data-reveal
            to="/#contacts"
            className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition-transform hover:scale-105 dark:bg-white dark:text-black"
          >
            Contact Me
            <Icon icon="carbon:arrow-up-right" width={16} height={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
