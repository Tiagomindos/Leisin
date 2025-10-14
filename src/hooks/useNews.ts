import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface News {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: 'real_estate' | 'crypto' | 'economy' | 'construction' | 'market';
  author: string;
  source_url: string;
  image_url: string;
  views_count: number;
  published_at: string;
  created_at: string;
}

export const useNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });

        if (error) throw error;
        setNews(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar notícias');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return { news, loading, error };
};