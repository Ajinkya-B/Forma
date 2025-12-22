import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { ThemedText } from "../components/ThemedText";
import { Card } from "../components/Card";
import { useAuth } from "../contexts/AuthContext";
import { useUserStats } from "../hooks/useUserStats";
import { useWorkoutPlans } from "../hooks/useWorkoutPlans";

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { stats, isLoading: statsLoading } = useUserStats();
  const { activePlan, recommendedWorkouts, isLoading: plansLoading } = useWorkoutPlans();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCardPress = (workoutId: string) => {
    console.log("Workout pressed:", workoutId);
    // TODO: Navigate to workout detail screen
    // router.push(`/workout/${workoutId}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const isLoading = statsLoading || plansLoading;

  // Get today's workout (first workout in active plan)
  const todaysWorkout = activePlan?.workouts[0];
  
  // Use progress from API (defaults to 0 if not set)
  const workoutProgress = todaysWorkout?.progressPercentage || 0;

  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} backgroundColor={colors.surface}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <View>
          <ThemedText preset="caption" color={colors.textSecondary}>
            {getGreeting()},
          </ThemedText>
          <ThemedText preset="h1">{user?.name || "User"}</ThemedText>
        </View>
        <Button 
          title="Log Out" 
          variant="outline" 
          onPress={handleLogout} 
          style={styles.logoutButton}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText preset="body" color={colors.textSecondary} style={styles.loadingText}>
            Loading your workout data...
          </ThemedText>
        </View>
      ) : (
        <>
          {/* Today's Plan Section */}
          {todaysWorkout && (
            <View style={styles.section}>
              <ThemedText preset="h2" style={styles.sectionTitle}>Today's Plan</ThemedText>
              
              <Card 
                title={todaysWorkout.title}
                subtitle={`${todaysWorkout.duration} mins • ${todaysWorkout.difficulty}`}
                onPress={() => handleCardPress(todaysWorkout.id)}
              >
                <View style={styles.cardRow}>
                  <View style={styles.tag}>
                    <ThemedText preset="caption" color={colors.primary}>In Progress</ThemedText>
                  </View>
                  <ThemedText preset="caption" color={colors.textSecondary}>
                    {workoutProgress}% Complete
                  </ThemedText>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${workoutProgress}%` }]} />
                </View>
              </Card>
            </View>
          )}

          {/* Stats Section */}
          {stats && (
            <View style={styles.section}>
              <ThemedText preset="h2" style={styles.sectionTitle}>Your Progress</ThemedText>
              <View style={styles.statsRow}>
                <Card style={styles.statCard}>
                  <ThemedText preset="h1" color={colors.primary}>
                    {stats.totalWorkouts}
                  </ThemedText>
                  <ThemedText preset="caption" color={colors.textSecondary}>
                    Workouts
                  </ThemedText>
                </Card>
                <View style={{ width: spacing.md }} />
                <Card style={styles.statCard}>
                  <ThemedText preset="h1" color={colors.warning}>
                    {stats.totalMinutes}
                  </ThemedText>
                  <ThemedText preset="caption" color={colors.textSecondary}>
                    Minutes
                  </ThemedText>
                </Card>
              </View>

              {/* Weekly Progress */}
              {stats.weeklyGoal && stats.weeklyProgress !== undefined && (
                <Card style={styles.weeklyCard}>
                  <View style={styles.weeklyHeader}>
                    <ThemedText preset="body" weight="600">Weekly Goal</ThemedText>
                    <ThemedText preset="caption" color={colors.textSecondary}>
                      {stats.weeklyProgress} / {stats.weeklyGoal} workouts
                    </ThemedText>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[
                      styles.progressBarFill, 
                      { width: `${(stats.weeklyProgress / stats.weeklyGoal) * 100}%` }
                    ]} />
                  </View>
                </Card>
              )}
            </View>
          )}

          {/* Recommended Section */}
          {recommendedWorkouts.length > 0 && (
            <View style={styles.section}>
              <ThemedText preset="h2" style={styles.sectionTitle}>Recommended</ThemedText>
              {recommendedWorkouts.map((workout) => (
                <Card 
                  key={workout.id}
                  title={workout.title}
                  subtitle={`${workout.duration} mins • ${workout.difficulty}`}
                  variant="outlined"
                  onPress={() => handleCardPress(workout.id)}
                >
                  {workout.description && (
                    <ThemedText preset="body" numberOfLines={2} color={colors.textSecondary}>
                      {workout.description}
                    </ThemedText>
                  )}
                </Card>
              ))}
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  logoutButton: {
    minHeight: 32,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    width: "auto",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl * 2,
  },
  loadingText: {
    marginTop: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  tag: {
    backgroundColor: colors.primaryMuted + "40",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: "row",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
  },
  weeklyCard: {
    marginTop: spacing.md,
  },
  weeklyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
});
