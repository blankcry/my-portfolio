import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Experience } from '@/types';
import { getCache, setCache } from '@/lib/cache';

export function useExperience() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperience() {
      const cachedExperience = getCache<Experience[]>('experience');
      if (cachedExperience) {
        setExperience(cachedExperience);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('experience')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          setCache('experience', data);
          setExperience(data);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchExperience();
  }, []);

  return { experience, loading, error };
}
