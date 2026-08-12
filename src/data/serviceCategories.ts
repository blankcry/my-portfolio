import type { Project } from "@/types";

export interface ServiceCategory {
  name: string;
  icon: string;
  desc: string;
  /** Lowercase substrings checked against a project's name + desc + stack. */
  matchKeywords: string[];
}

/**
 * Consolidated from the previous 6-entry `src/data/services.ts` (still on
 * disk, unused) down to 4 categories, matching the reference section's count.
 * Each category links to whichever existing Works project best fits it, so
 * the hover preview has something real to show without needing new assets.
 */
export const serviceCategories: ServiceCategory[] = [
  {
    name: "Web Development",
    icon: "bx:bx-code-alt",
    desc: "Fast, responsive, accessible web applications built with modern frameworks — from marketing sites to full SPAs.",
    matchKeywords: ["react", "next", "tailwind", "antdesign", "typescript"],
  },
  {
    name: "API & Database",
    icon: "bx:bx-data",
    desc: "Custom REST and GraphQL APIs, plus database architecture — schema design, query optimization, scalable data solutions.",
    matchKeywords: ["node", "sequelize", "mysql", "knex", "microservices", "rabbitmq", "nestjs", "rest", "graphql"],
  },
  {
    name: "Payments & E-commerce",
    icon: "bx:bx-credit-card",
    desc: "Payment collection and disbursement integrations, plus custom or CMS-based e-commerce builds tailored to the business.",
    matchKeywords: ["shopify", "cms", "pay", "commerce", "electricity", "bill"],
  },
  {
    name: "Support & Maintenance",
    icon: "bx:bx-support",
    desc: "Ongoing updates, backups, and security checks to keep an existing product running smoothly.",
    matchKeywords: ["maintenance", "support"],
  },
];

const haystackOf = (project: Project) =>
  `${project.name} ${project.desc} ${project.stack?.join(" ") ?? ""}`.toLowerCase();

const scoreOf = (category: ServiceCategory, project: Project) =>
  category.matchKeywords.reduce(
    (n, keyword) => n + (haystackOf(project).includes(keyword) ? 1 : 0),
    0
  );

/**
 * One project per category, picked by keyword-match score, assigned greedily
 * so categories don't collide on the same project where an alternative exists.
 *
 * A naive "first project matching any keyword" approach collapses badly here —
 * `Payable Africa` (order_index 0) is a payments product built on a heavy
 * Node/microservices/React stack, so it matches nearly every category's
 * keyword list and would win every one of them by being first. Scoring by
 * match *count* and claiming projects in best-score-first order fixes that:
 * Payable Africa still wins API & Database (its strongest fit), but Web
 * Development goes to whichever project is actually more frontend-heavy, and
 * Payments & E-commerce goes to whichever project's copy is actually about
 * payments/commerce, rather than whoever happens to be first.
 */
export function matchProjectsToCategories(
  categories: ServiceCategory[],
  projects: Project[]
): Map<string, Project | null> {
  const result = new Map<string, Project | null>();
  if (projects.length === 0) {
    categories.forEach((c) => result.set(c.name, null));
    return result;
  }

  const claimed = new Set<string>();

  // Best-fit first: categories with a stronger, more specific match get first
  // pick, so a broad-matching project doesn't get claimed by a weaker fit
  // before the category it's actually best suited for is considered.
  const byBestScore = [...categories].sort((a, b) => {
    const bestA = Math.max(...projects.map((p) => scoreOf(a, p)));
    const bestB = Math.max(...projects.map((p) => scoreOf(b, p)));
    return bestB - bestA;
  });

  for (const category of byBestScore) {
    const ranked = [...projects]
      .map((project) => ({ project, score: scoreOf(category, project) }))
      .sort((a, b) => b.score - a.score);

    const bestUnclaimed = ranked.find((r) => !claimed.has(r.project.id));
    const bestScored = ranked.find((r) => r.score > 0);

    // Prefer an unclaimed project with a real match; fall back to the best
    // scored project even if already claimed (better than nothing); if
    // nothing scores at all, fall back to the first unclaimed project so
    // categories still end up visually distinct rather than all defaulting
    // to project[0].
    const pick =
      (bestUnclaimed && bestUnclaimed.score > 0 ? bestUnclaimed : undefined) ??
      bestScored ??
      ranked.find((r) => !claimed.has(r.project.id)) ??
      ranked[0];

    result.set(category.name, pick.project);
    claimed.add(pick.project.id);
  }

  return result;
}
