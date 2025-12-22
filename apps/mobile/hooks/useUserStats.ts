import { useState, useEffect } from 'react';
import { UserStats } from '@forma/shared-types';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export function useUserStats() {
  const { user, tokens, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user || !tokens) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    fetchUserStats();
  }, [user, tokens, isAuthenticated]);

  const fetchUserStats = async () => {
    if (!user || !tokens) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getUserStats(user.id, tokens.accessToken);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      console.error('Error fetching user stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchUserStats();
  };

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
}
