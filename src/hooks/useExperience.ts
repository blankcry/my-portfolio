import { experience } from "@/data/experience";
import type { Experience } from "@/types";

export function useExperience(): {
  experience: Experience[];
  loading: boolean;
  error: string | null;
} {
  return {
    experience,
    loading: false,
    error: null,
  };
}
