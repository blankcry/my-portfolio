/** Filter tabs on the Works section and the /work listing page. */
export const PROJECT_CATEGORIES = ["Web App", "Mobile", "E-commerce"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface Project {
  id: string;
  name: string;
  desc: string;
  url: string;
  repo_url: string | null;
  stack: string[];
  photo_url: string[];
  type: string | null;
  /** What was delivered — "Service" on the detail page. Null falls back to a value derived from `stack`. */
  service: string | null;
  /** How long it took — "Timeline" on the detail page. Null hides that row. */
  timeline: string | null;
  /** Drives the filter tabs. Null is treated as "Web App". */
  category: ProjectCategory | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

export interface Experience {
  id: string;
  start_date: string;
  end_date: string | null;
  position: string;
  company: string;
  /**
   * Square company logo — absolute https URL (Supabase Storage public bucket)
   * or a `/public` path. SVG or transparent PNG, >= 128x128.
   * Null renders the gradient monogram fallback in `CompanyLogo`.
   */
  logo_url: string | null;
  desc: string[];
  skills: string[];
  order_index: number;
  is_published: boolean;
  created_at: string;
}
