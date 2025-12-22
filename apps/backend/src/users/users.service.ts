import { Injectable } from '@nestjs/common';
import { UserStats, WorkoutPlan, Workout, WorkoutProgress, WorkoutSession } from '@forma/shared-types';

// Mock data storage - replace with real database
const userStats = new Map<string, UserStats>();
const workoutPlans = new Map<string, WorkoutPlan[]>();
const workoutProgress = new Map<string, WorkoutProgress[]>();
const workoutSessions = new Map<string, WorkoutSession[]>();

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
      { id: 'e1', name: 'Push-ups', sets: 3, reps: 12, restTime: 60 },
      { id: 'e2', name: 'Squats', sets: 3, reps: 15, restTime: 60 },
      { id: 'e3', name: 'Plank', duration: 60, sets: 3, restTime: 45 },
      { id: 'e4', name: 'Lunges', sets: 3, reps: 12, restTime: 60 },
      { id: 'e5', name: 'Rows', sets: 3, reps: 10, restTime: 60 },
    ],
  },
  {
    id: '2',
    title: 'Morning Yoga',
    description: 'Start your day with calm and focus',
    duration: 20,
    difficulty: 'beginner',
    category: 'Flexibility',
    tags: ['yoga', 'morning'],
    exercises: [
      { id: 'e4', name: 'Sun Salutation', duration: 300 },
      { id: 'e5', name: 'Warrior Pose', duration: 120 },
    ],
  },
  {
    id: '3',
    title: 'HIIT Cardio',
    description: 'High intensity interval training',
    duration: 30,
    difficulty: 'advanced',
    category: 'Cardio',
    tags: ['hiit', 'cardio'],
    exercises: [
      { id: 'e6', name: 'Burpees', sets: 4, reps: 10, restTime: 30 },
      { id: 'e7', name: 'Mountain Climbers', duration: 45, sets: 4, restTime: 30 },
    ],
  },
];

@Injectable()
export class UsersService {
  getUserStats(userId: string): UserStats {
    if (!userStats.has(userId)) {
      // Initialize default stats for new users
      userStats.set(userId, {
        totalWorkouts: 12,
        totalMinutes: 420,
        currentStreak: 3,
        longestStreak: 7,
        weeklyGoal: 5,
        weeklyProgress: 3,
      });
    }
    return userStats.get(userId)!;
  }

  getActivePlan(userId: string): WorkoutPlan | null {
    if (!workoutPlans.has(userId)) {
      // Create default plan for new users with progress tracking
      const workoutsWithProgress = mockWorkouts.map(workout => ({
        ...workout,
        progressPercentage: this.calculateWorkoutProgress(userId, workout.id, workout.exercises.length),
      }));

      const plan: WorkoutPlan = {
        id: 'plan-1',
        userId,
        title: 'Beginner Fitness Journey',
        description: '4-week program to build strength and endurance',
        workouts: workoutsWithProgress,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isActive: true,
      };
      workoutPlans.set(userId, [plan]);
    }
    
    const plans = workoutPlans.get(userId)!;
    const activePlan = plans.find(p => p.isActive) || null;
    
    // Update progress for all workouts in the plan
    if (activePlan) {
      activePlan.workouts = activePlan.workouts.map(workout => ({
        ...workout,
        progressPercentage: this.calculateWorkoutProgress(userId, workout.id, workout.exercises.length),
      }));
    }
    
    return activePlan;
  }

  private calculateWorkoutProgress(userId: string, workoutId: string, totalExercises: number): number {
    const sessions = workoutSessions.get(userId) || [];
    const activeSession = sessions.find(s => s.workoutId === workoutId && s.isActive);
    
    if (!activeSession || totalExercises === 0) {
      return 0;
    }
    
    const completedCount = activeSession.completedExercises.length;
    return Math.round((completedCount / totalExercises) * 100);
  }

  getActiveSession(userId: string, workoutId: string): WorkoutSession | null {
    const sessions = workoutSessions.get(userId) || [];
    return sessions.find(s => s.workoutId === workoutId && s.isActive) || null;
  }

  startWorkoutSession(userId: string, workoutId: string): WorkoutSession {
    if (!workoutSessions.has(userId)) {
      workoutSessions.set(userId, []);
    }

    // End any existing active sessions for this workout
    const sessions = workoutSessions.get(userId)!;
    sessions.forEach(s => {
      if (s.workoutId === workoutId && s.isActive) {
        s.isActive = false;
      }
    });

    const newSession: WorkoutSession = {
      id: `session_${Date.now()}`,
      userId,
      workoutId,
      startedAt: new Date(),
      completedExercises: [],
      isActive: true,
    };

    sessions.push(newSession);
    return newSession;
  }

  updateSessionProgress(userId: string, sessionId: string, completedExercises: string[]): WorkoutSession {
    const sessions = workoutSessions.get(userId) || [];
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    session.completedExercises = completedExercises;
    return session;
  }

  getRecommendedWorkouts(userId: string): Workout[] {
    // Return workouts based on user level (mock logic)
    return [mockWorkouts[1], mockWorkouts[2]];
  }

  getWorkoutProgress(userId: string, workoutId?: string): WorkoutProgress[] {
    if (!workoutProgress.has(userId)) {
      // Initialize with some mock progress
      workoutProgress.set(userId, [
        {
          id: 'p1',
          userId,
          workoutId: '1',
          completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          duration: 42,
          notes: 'Great session!',
        },
        {
          id: 'p2',
          userId,
          workoutId: '2',
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          duration: 22,
        },
      ]);
    }

    const progress = workoutProgress.get(userId)!;
    
    if (workoutId) {
      return progress.filter(p => p.workoutId === workoutId);
    }
    
    return progress;
  }

  logWorkout(
    userId: string,
    data: Omit<WorkoutProgress, 'id' | 'userId'>
  ): WorkoutProgress {
    const newProgress: WorkoutProgress = {
      ...data,
      id: `p${Date.now()}`,
      userId,
    };

    if (!workoutProgress.has(userId)) {
      workoutProgress.set(userId, []);
    }

    workoutProgress.get(userId)!.push(newProgress);

    // Update stats
    const stats = this.getUserStats(userId);
    stats.totalWorkouts += 1;
    stats.totalMinutes += data.duration;
    stats.weeklyProgress = Math.min((stats.weeklyProgress || 0) + 1, stats.weeklyGoal || 5);

    return newProgress;
  }
}
