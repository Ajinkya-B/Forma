import { 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials,
  UserStats,
  WorkoutPlan,
  Workout,
  WorkoutProgress,
} from '@forma/shared-types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // User endpoints (authenticated)
  async getUserStats(userId: string, token: string): Promise<UserStats> {
    return this.request<UserStats>(`/users/${userId}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getActivePlan(userId: string, token: string): Promise<WorkoutPlan | null> {
    return this.request<WorkoutPlan | null>(`/users/${userId}/active-plan`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getRecommendedWorkouts(userId: string, token: string): Promise<Workout[]> {
    return this.request<Workout[]>(`/users/${userId}/recommended-workouts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getWorkoutProgress(
    userId: string,
    token: string,
    workoutId?: string
  ): Promise<WorkoutProgress[]> {
    const query = workoutId ? `?workoutId=${workoutId}` : '';
    return this.request<WorkoutProgress[]>(`/users/${userId}/progress${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async logWorkout(
    userId: string,
    token: string,
    data: Omit<WorkoutProgress, 'id' | 'userId'>
  ): Promise<WorkoutProgress> {
    return this.request<WorkoutProgress>(`/users/${userId}/progress`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
