import { Link } from "react-router-dom";
import type { Project } from "@/types";
import { categoryOf, slugify } from "@/lib/projects";

interface WorkCardProps {
  project: Project;
  /** Marks the card for the section's staggered entrance timeline. */
  reveal?: boolean;
  /**
   * Fill the grid cell's height instead of deriving height from the image's
   * aspect ratio. The Selected Work section is a hard 100vh, so there the card
   * must adapt to the space available rather than dictate it — an aspect-ratio
   * card overflows the section and silently clips the header.
   */
  dense?: boolean;
}

/**
 * Project card used by the Selected Work section, the /work listing and the
 * "more work" strip on a detail page. Whole card is a link to the detail route.
 */
export function WorkCard({ project, reveal = false, dense = false }: WorkCardProps) {
  const tags = [categoryOf(project), ...(project.stack ?? []).slice(0, 1)];

  return (
    <Link
      to={`/work/${slugify(project.name)}`}
      {...(reveal ? { "data-work-card": "" } : {})}
      className={
        "group flex min-h-0 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900 " +
        (dense ? "h-full" : "")
      }
    >
      <div
        className={
          "relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 " +
          (dense ? "min-h-0 flex-1" : "aspect-[16/10]")
        }
      >
        {project.photo_url?.[0] && (
          <img
            src={project.photo_url[0]}
            alt={project.name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-black backdrop-blur-sm">
          {categoryOf(project)}
        </span>
      </div>

      <div
        className={
          "flex shrink-0 flex-col gap-2 " + (dense ? "p-3 md:p-4" : "flex-1 gap-3 p-4 md:p-5")
        }
      >
        <h3 className="line-clamp-2 text-base font-semibold leading-snug md:text-lg">
          {project.name}
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.filter(Boolean).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/10 px-3 py-1 text-xs text-gray-600 dark:border-white/15 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default WorkCard;
