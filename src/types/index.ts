export interface Project {
  id: string;
  name: string;
  desc: string;
  url: string;
  repo_url: string | null;
  stack: string[];
  photo_url: string[];
  type: string | null;
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
