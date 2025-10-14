import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  images: string[];
  post_type: 'general' | 'analysis' | 'news' | 'question' | 'announcement';
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
}

export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async (postData: Pick<Post, 'content' | 'images' | 'post_type'>) => {
    if (!user) return { error: new Error('User not authenticated') };
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({ ...postData, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      setPosts(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Failed to create post') };
    }
  };

  const likePost = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return { error: new Error('Post not found') };

    const { error } = await supabase
      .from('posts')
      .update({ likes_count: post.likes_count + 1 })
      .eq('id', postId);

    if (error) return { error };

    setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
    return { error: null };
  };

  return { posts, loading, error, createPost, likePost };
};