import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { ThemedText } from "../components/ThemedText";
import { Card } from "../components/Card";

export default function DashboardScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace("/login");
  };

  const handleCardPress = (action: string) => {
    console.log("Card pressed:", action);
  };

  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} backgroundColor={colors.surface}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <View>
          <ThemedText preset="caption" color={colors.textSecondary}>Good Morning,</ThemedText>
          <ThemedText preset="h1">Alex Johnson</ThemedText>
        </View>
        <Button 
          title="Log Out" 
          variant="outline" 
          onPress={handleLogout} 
          style={styles.logoutButton}
        />
      </View>

      <View style={styles.section}>
        <ThemedText preset="h2" style={styles.sectionTitle}>Today's Plan</ThemedText>
        
        <Card 
          title="Full Body Workout" 
          subtitle="45 mins • Intermediate"
          onPress={() => handleCardPress("full_body")}
        >
          <View style={styles.cardRow}>
            <View style={styles.tag}>
              <ThemedText preset="caption" color={colors.primary}>In Progress</ThemedText>
            </View>
            <ThemedText preset="caption" color={colors.textSecondary}>80% Complete</ThemedText>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: "80%" }]} />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <ThemedText preset="h2" style={styles.sectionTitle}>Your Progress</ThemedText>
        <View style={styles.statsRow}>
           <Card style={styles.statCard}>
             <ThemedText preset="h1" color={colors.primary}>12</ThemedText>
             <ThemedText preset="caption" color={colors.textSecondary}>Workouts</ThemedText>
           </Card>
           <View style={{ width: spacing.md }} />
           <Card style={styles.statCard}>
             <ThemedText preset="h1" color={colors.warning}>420</ThemedText>
             <ThemedText preset="caption" color={colors.textSecondary}>Minutes</ThemedText>
           </Card>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText preset="h2" style={styles.sectionTitle}>Recommended</ThemedText>
        <Card 
          title="Morning Yoga" 
          subtitle="20 mins • Relaxation"
          variant="outlined"
          onPress={() => handleCardPress("yoga")}
        >
           <ThemedText preset="body" numberOfLines={2} color={colors.textSecondary}>
             Start your day with calm and focus. A gentle flow to wake up your body.
           </ThemedText>
        </Card>
      </View>
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
    backgroundColor: colors.primaryMuted + "40", // 25% opacity approximation
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
});
