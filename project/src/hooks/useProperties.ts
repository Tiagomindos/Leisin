import { useState, useEffect } from 'react';
import { mockProperties } from '../data/mockData';

interface Property {
  id: string;
  spe_id?: string;
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
    setLoading(true);
    setError(null);
    let data = [...mockProperties];

    if (filters?.property_type) {
      data = data.filter(p => p.property_type === filters.property_type);
    }
    if (filters?.construction_status) {
      data = data.filter(p => p.construction_status === filters.construction_status);
    }
    if (typeof filters?.min_yield === 'number') {
      data = data.filter(p => (p.expected_yield ?? 0) >= (filters!.min_yield as number));
    }
    if (typeof filters?.max_price === 'number') {
      data = data.filter(p => p.price_per_token <= (filters!.max_price as number));
    }

    setProperties(data);
    setLoading(false);
  }, [filters]);

  const getPropertyById = (id: string) => properties.find(p => p.id === id);

  const getFeaturedProperties = () => {
    return properties.filter(p => (p.expected_yield ?? 0) > 10).slice(0, 3);
  };

  return {
    properties,
    loading,
    error,
    getPropertyById,
    getFeaturedProperties,
  };
};