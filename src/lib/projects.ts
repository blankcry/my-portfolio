import type { Project, ProjectCategory } from "@/types";

/** URL-safe slug from a project name, so detail routes read `/work/payable-africa`. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Resolve a route param to a project. Matches on slug first (the pretty URL we
 * link to) and falls back to raw id, so older/shared links by id keep working.
 */
export function findProject(projects: Project[], param: string | undefined) {
  if (!param) return undefined;
  return (
    projects.find((p) => slugify(p.name) === param) ?? projects.find((p) => p.id === param)
  );
}

export const categoryOf = (project: Project): ProjectCategory =>
  project.category ?? "Web App";

/** Derived fallback so the detail page's Service row is never empty. */
export function serviceOf(project: Project): string {
  if (project.service) return project.service;

  const stack = (project.stack ?? []).map((s) => s.toLowerCase());
  const has = (...keys: string[]) => keys.some((k) => stack.some((s) => s.includes(k)));

  const parts: string[] = [];
  if (has("react native")) parts.push("Mobile Development");
  else if (has("react", "next", "vue", "tailwind")) parts.push("Frontend Development");
  if (has("node", "nest", "express", "sequelize", "knex", "graphql", "rest"))
    parts.push("Backend & API");
  if (has("mysql", "postgres", "mongo", "redis")) parts.push("Database Design");
  if (has("shopify", "cms")) parts.push("E-commerce");

  return parts.length ? parts.slice(0, 2).join(", ") : "Full Stack Development";
}
