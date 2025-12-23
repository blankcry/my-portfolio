import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Project } from '@/types';
import { getCache, setCache } from '@/lib/cache';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      const cachedProjects = getCache<Project[]>('projects');
      if (cachedProjects) {
        setProjects(cachedProjects);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          setCache('projects', data);
          setProjects(data);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, loading, error };
}
