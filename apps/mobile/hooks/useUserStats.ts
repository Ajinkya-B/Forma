import { useState, useEffect } from 'react';
import { UserStats } from '@forma/shared-types';
import { useAuth } from '../contexts/AuthContext';

// Mock data - replace with API call later
const mockStats: UserStats = {
  totalWorkouts: 12,
  totalMinutes: 420,
  currentStreak: 3,
  longestStreak: 7,
  weeklyGoal: 5,
  weeklyProgress: 3,
};

export function useUserStats() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    fetchUserStats();
  }, [user, isAuthenticated]);

  const fetchUserStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/users/${user.id}/stats`);
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStats(mockStats);
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
