import React from "react";
import { View, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { ThemedText } from "./ThemedText";

interface CardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: "elevated" | "outlined";
}

export function Card({ 
  title, 
  subtitle, 
  children, 
  style, 
  onPress,
  variant = "elevated" 
}: CardProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container 
      style={[
        styles.container, 
        variant === "elevated" ? styles.elevated : styles.outlined,
        style
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <ThemedText preset="h2" style={styles.title}>{title}</ThemedText>}
          {subtitle && <ThemedText preset="caption" color={colors.textSecondary}>{subtitle}</ThemedText>}
        </View>
      )}
      {children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  elevated: {
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  header: {
    marginBottom: spacing.sm,
  },
  title: {
    marginBottom: 2,
  },
  content: {
    // Content wrapper
  },
});
