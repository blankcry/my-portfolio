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
  desc: string[];
  skills: string[];
  order_index: number;
  is_published: boolean;
  created_at: string;
}
