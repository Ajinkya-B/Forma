import { useState, useEffect } from 'react';
import { Workout, WorkoutPlan } from '@forma/shared-types';
import { useAuth } from '../contexts/AuthContext';

// Mock workout data
const mockWorkouts: Workout[] = [
  {
    id: '1',
    title: 'Full Body Workout',
    description: 'Complete full body strength training session',
    duration: 45,
    difficulty: 'intermediate',
    category: 'Strength',
    tags: ['full-body', 'strength'],
    exercises: [
      {
        id: 'e1',
        name: 'Push-ups',
        sets: 3,
        reps: 12,
        restTime: 60,
      },
      {
        id: 'e2',
        name: 'Squats',
        sets: 3,
        reps: 15,
        restTime: 60,
      },
      {
        id: 'e3',
        name: 'Plank',
        duration: 60,
        sets: 3,
        restTime: 45,
      },
    ],
  },
  {
    id: '2',
    title: 'Morning Yoga',
    description: 'Start your day with calm and focus. A gentle flow to wake up your body.',
    duration: 20,
    difficulty: 'beginner',
    category: 'Flexibility',
    tags: ['yoga', 'morning', 'relaxation'],
    exercises: [
      {
        id: 'e4',
        name: 'Sun Salutation',
        duration: 300,
      },
      {
        id: 'e5',
        name: 'Warrior Pose',
        duration: 120,
      },
    ],
  },
  {
    id: '3',
    title: 'HIIT Cardio',
    description: 'High intensity interval training for maximum calorie burn',
    duration: 30,
    difficulty: 'advanced',
    category: 'Cardio',
    tags: ['hiit', 'cardio', 'fat-burn'],
    exercises: [
      {
        id: 'e6',
        name: 'Burpees',
        sets: 4,
        reps: 10,
        restTime: 30,
      },
      {
        id: 'e7',
        name: 'Mountain Climbers',
        duration: 45,
        sets: 4,
        restTime: 30,
      },
    ],
  },
];

const mockActivePlan: WorkoutPlan = {
  id: 'plan-1',
  userId: '1',
  title: 'Beginner Fitness Journey',
  description: '4-week program to build strength and endurance',
  workouts: mockWorkouts,
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Started 1 week ago
  isActive: true,
};

export function useWorkoutPlans() {
  const { user, isAuthenticated } = useAuth();
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);
  const [recommendedWorkouts, setRecommendedWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setActivePlan(null);
      setRecommendedWorkouts([]);
      setIsLoading(false);
      return;
    }

    fetchWorkoutPlans();
  }, [user, isAuthenticated]);

  const fetchWorkoutPlans = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API calls
      // const [planRes, recommendedRes] = await Promise.all([
      //   fetch(`/api/users/${user.id}/active-plan`),
      //   fetch(`/api/users/${user.id}/recommended-workouts`)
      // ]);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setActivePlan(mockActivePlan);
      setRecommendedWorkouts([mockWorkouts[1], mockWorkouts[2]]);
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
