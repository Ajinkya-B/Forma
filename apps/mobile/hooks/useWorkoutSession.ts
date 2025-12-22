import { useState } from 'react';
import { WorkoutSession } from '@forma/shared-types';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export function useWorkoutSession() {
  const { user, tokens } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startSession = async (workoutId: string): Promise<WorkoutSession> => {
    if (!user || !tokens) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/users/${user.id}/sessions/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({ workoutId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      const session = await response.json();
      return session;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start session');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveSession = async (workoutId: string): Promise<WorkoutSession | null> => {
    if (!user || !tokens) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/users/${user.id}/sessions/${workoutId}`, {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get session');
      }

      const session = await response.json();
      return session;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get session');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (
    sessionId: string,
    completedExercises: string[]
  ): Promise<WorkoutSession> => {
    if (!user || !tokens) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/users/${user.id}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({ completedExercises }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      const session = await response.json();
      return session;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update progress');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startSession,
    getActiveSession,
    updateProgress,
    isLoading,
    error,
  };
}
