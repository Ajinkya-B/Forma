export interface Exercise {
  id: string;
  name: string;
  description?: string;
  duration?: number; // in seconds
  sets?: number;
  reps?: number;
  restTime?: number; // in seconds
}

export interface Workout {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  category?: string;
  tags?: string[];
  progressPercentage?: number; // 0-100, calculated based on current session
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  title: string;
  description?: string;
  workouts: Workout[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutId: string;
  startedAt: Date;
  completedExercises: string[]; // Array of exercise IDs
  isActive: boolean;
}

export interface WorkoutProgress {
  id: string;
  userId: string;
  workoutId: string;
  completedAt: Date;
  duration: number; // actual duration in minutes
  notes?: string;
}

export interface UserStats {
  totalWorkouts: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  weeklyGoal?: number;
  weeklyProgress?: number;
}
