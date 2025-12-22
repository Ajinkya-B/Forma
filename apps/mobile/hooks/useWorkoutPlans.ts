import { useState, useEffect } from 'react';
import { Workout, WorkoutPlan } from '@forma/shared-types';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export function useWorkoutPlans() {
  const { user, tokens, isAuthenticated } = useAuth();
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);
  const [recommendedWorkouts, setRecommendedWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user || !tokens) {
      setActivePlan(null);
      setRecommendedWorkouts([]);
      setIsLoading(false);
      return;
    }

    fetchWorkoutPlans();
  }, [user, tokens, isAuthenticated]);

  const fetchWorkoutPlans = async () => {
    if (!user || !tokens) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const [plan, recommended] = await Promise.all([
        api.getActivePlan(user.id, tokens.accessToken),
        api.getRecommendedWorkouts(user.id, tokens.accessToken),
      ]);
      
      setActivePlan(plan);
      setRecommendedWorkouts(recommended);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workout plans'));
      console.error('Error fetching workout plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchWorkoutPlans();
  };

  return {
    activePlan,
    recommendedWorkouts,
    isLoading,
    error,
    refetch,
  };
}
