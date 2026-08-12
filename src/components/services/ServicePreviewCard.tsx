import type { Project } from "@/types";

interface ServicePreviewCardProps {
  project: Project;
  className?: string;
}

/** The floating (or, on touch, inline) project thumbnail shown per service category. */
export function ServicePreviewCard({ project, className = "" }: ServicePreviewCardProps) {
  return (
    <div
      className={`w-56 md:w-64 overflow-hidden rounded-xl border border-black/10 bg-card shadow-2xl dark:border-white/10 ${className}`}
    >
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={project.photo_url?.[0]}
          alt={project.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="px-3 py-2">
        <p className="truncate text-xs font-semibold text-foreground">{project.name}</p>
      </div>
    </div>
  );
}

export default ServicePreviewCard;
