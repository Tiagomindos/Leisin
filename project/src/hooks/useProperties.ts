import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Property {
  id: string;
  spe_id: string;
  name: string;
  description: string | null;
  property_type: 'residential' | 'commercial' | 'land' | 'mixed';
  address: any;
  coordinates: any;
  total_area: number | null;
  total_units: number | null;
  construction_status: 'planning' | 'construction' | 'completed';
  total_value: number;
  token_symbol: string;
  total_tokens: number;
  available_tokens: number;
  price_per_token: number;
  min_investment: number;
  expected_yield: number | null;
  rental_status: 'none' | 'partial' | 'full';
  images: any[];
  documents: any[];
  vyner_3d_url: string | null;
  listed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useProperties = (filters?: {
  property_type?: string;
  construction_status?: string;
  min_yield?: number;
  max_price?: number;
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('properties')
          .select('*')
          .not('listed_at', 'is', null)
          .order('created_at', { ascending: false });

        if (filters?.property_type) {
          query = query.eq('property_type', filters.property_type);
        }

        if (filters?.construction_status) {
          query = query.eq('construction_status', filters.construction_status);
        }

        if (filters?.min_yield) {
          query = query.gte('expected_yield', filters.min_yield);
        }

        if (filters?.max_price) {
          query = query.lte('price_per_token', filters.max_price);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setProperties(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar propriedades');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const getPropertyById = (id: string) => {
    return properties.find(p => p.id === id);
  };

  const getFeaturedProperties = () => {
    return properties
      .filter(p => p.expected_yield && p.expected_yield > 10)
      .slice(0, 3);
  };

  return {
    properties,
    loading,
    error,
    getPropertyById,
    getFeaturedProperties,
  };
};
