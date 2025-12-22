import { useState, useEffect } from 'react';
import { WorkoutProgress } from '@forma/shared-types';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export function useWorkoutProgress(workoutId?: string) {
  const { user, tokens, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<WorkoutProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user || !tokens) {
      setProgress([]);
      setIsLoading(false);
      return;
    }

    fetchProgress();
  }, [user, tokens, isAuthenticated, workoutId]);

  const fetchProgress = async () => {
    if (!user || !tokens) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getWorkoutProgress(user.id, tokens.accessToken, workoutId);
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch progress'));
      console.error('Error fetching workout progress:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logWorkout = async (workoutProgress: Omit<WorkoutProgress, 'id' | 'userId'>) => {
    if (!user || !tokens) {
      throw new Error('User not authenticated');
    }

    try {
      const newProgress = await api.logWorkout(user.id, tokens.accessToken, workoutProgress);
      
      // Optimistically update local state
      setProgress(prev => [newProgress, ...prev]);
      
      return newProgress;
    } catch (err) {
      console.error('Error logging workout:', err);
      throw err;
    }
  };

  const refetch = () => {
    fetchProgress();
  };

  return {
    progress,
    isLoading,
    error,
    logWorkout,
    refetch,
  };
}
