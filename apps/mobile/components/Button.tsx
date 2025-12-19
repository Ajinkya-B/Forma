import React from "react";
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
}

export function Button({ title, variant = "primary", loading, style, ...props }: ButtonProps) {
  const getBackgroundColor = () => {
    if (props.disabled) return colors.textMuted;
    switch (variant) {
      case "primary": return colors.primary;
      case "secondary": return colors.surface;
      case "outline": return "transparent";
      default: return colors.primary;
    }
  };

  const getTextColor = () => {
    if (props.disabled) return colors.background;
    switch (variant) {
      case "primary": return colors.textPrimaryDark; // Contrast for primary
      case "secondary": return colors.textPrimary;
      case "outline": return colors.primary;
      default: return colors.textPrimaryDark;
    }
  };

  const getBorderColor = () => {
    if (variant === "outline") return colors.primary;
    return "transparent";
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === "outline" ? 1 : 0,
        },
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  text: {
    fontSize: typography.body,
    fontWeight: "600",
  },
});
