import { useState, useEffect } from 'react';
import { WorkoutProgress } from '@forma/shared-types';
import { useAuth } from '../contexts/AuthContext';

// Mock progress data
const mockProgress: WorkoutProgress[] = [
  {
    id: 'p1',
    userId: '1',
    workoutId: '1',
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: 42,
    notes: 'Great session!',
  },
  {
    id: 'p2',
    userId: '1',
    workoutId: '2',
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: 22,
  },
];

export function useWorkoutProgress(workoutId?: string) {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<WorkoutProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProgress([]);
      setIsLoading(false);
      return;
    }

    fetchProgress();
  }, [user, isAuthenticated, workoutId]);

  const fetchProgress = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const url = workoutId 
      //   ? `/api/users/${user.id}/progress?workoutId=${workoutId}`
      //   : `/api/users/${user.id}/progress`;
      // const response = await fetch(url);
      // const data = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const filteredProgress = workoutId
        ? mockProgress.filter(p => p.workoutId === workoutId)
        : mockProgress;
      
      setProgress(filteredProgress);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch progress'));
      console.error('Error fetching workout progress:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logWorkout = async (workoutProgress: Omit<WorkoutProgress, 'id' | 'userId'>) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/users/${user.id}/progress`, {
      //   method: 'POST',
      //   body: JSON.stringify(workoutProgress),
      // });
      
      const newProgress: WorkoutProgress = {
        ...workoutProgress,
        id: `p${Date.now()}`,
        userId: user!.id,
      };
      
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
