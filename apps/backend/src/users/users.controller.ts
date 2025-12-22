import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserStats, WorkoutPlan, Workout, WorkoutProgress, WorkoutSession } from '@forma/shared-types';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id/stats')
  getUserStats(
    @Param('id') userId: string,
    @CurrentUser() user: User,
  ): UserStats {
    // Ensure user can only access their own stats
    if (user.id !== userId) {
      throw new Error('Unauthorized');
    }
    return this.usersService.getUserStats(userId);
  }

  @Get(':id/active-plan')
  getActivePlan(
    @Param('id') userId: string,
    @CurrentUser() user: User,
  ): WorkoutPlan | null {
    if (user.id !== userId) {
      throw new Error('Unauthorized');
    }
    return this.usersService.getActivePlan(userId);
  }

  @Get(':id/recommended-workouts')
  getRecommendedWorkouts(
    @Param('id') userId: string,
    @CurrentUser() user: User,
  ): Workout[] {
    if (user.id !== userId) {
      throw new Error('Unauthorized');
    }
    return this.usersService.getRecommendedWorkouts(userId);
  }

  @Get(':id/progress')
  getWorkoutProgress(
    @Param('id') userId: string,
    @Query('workoutId') workoutId: string | undefined,
    @CurrentUser() user: User,
  ): WorkoutProgress[] {
    if (user.id !== userId) {
      throw new Error('Unauthorized');
    }
    return this.usersService.getWorkoutProgress(userId, workoutId);
  }

  @Post(':id/progress')
  logWorkout(
    @Param('id') userId: string,
    @Body() data: Omit<WorkoutProgress, 'id' | 'userId'>,
    @CurrentUser() user: User,
  ): WorkoutProgress {
    if (user.id !== userId) {
      throw new Error('Unauthorized');
    }
    return this.usersService.logWorkout(userId, data);
  }

  @Post(':id/sessions/start')
  startWorkoutSession(
    @Param('id') userId: string,
    @Body() data: { workoutId: string },
    @CurrentUser() user: User,
  ): WorkoutSession {
    if (user.id !== userId) {
      throw new Error('Unauthorized');
    }
    return this.usersService.startWorkoutSession(userId, data.workoutId);
  }

  @Get(':id/sessions/:workoutId')
  getActiveSession(
    @Param('id') userId: string,
    @Param('workoutId') workoutId: string,
    @CurrentUser() user: User,
  ): WorkoutSession | null {
    if (user.id !== userId) {
      throw new Error('Unauthorized');
    }
    return this.usersService.getActiveSession(userId, workoutId);
  }

  @Put(':id/sessions/:sessionId')
  updateSessionProgress(
    @Param('id') userId: string,
    @Param('sessionId') sessionId: string,
    @Body() data: { completedExercises: string[] },
    @CurrentUser() user: User,
  ): WorkoutSession {
    if (user.id !== userId) {
      throw new Error('Unauthorized');
    }
    return this.usersService.updateSessionProgress(userId, sessionId, data.completedExercises);
  }
}
