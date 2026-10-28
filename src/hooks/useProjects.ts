import { projects } from "@/data/projects";
import type { Project } from "@/types";

export function useProjects(): {
  projects: Project[];
  loading: boolean;
  error: string | null;
} {
  return {
    projects,
    loading: false,
    error: null,
  };
}
