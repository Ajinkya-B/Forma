import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export interface ThemedTextProps extends TextProps {
  preset?: "title" | "h1" | "h2" | "body" | "caption";
  color?: string;
  weight?: "400" | "500" | "600" | "700";
  centered?: boolean;
}

export function ThemedText({ 
  children, 
  preset = "body", 
  color = colors.textPrimary, 
  weight,
  centered,
  style, 
  ...props 
}: ThemedTextProps) {
  
  const getPresetStyle = (): TextStyle => {
    switch (preset) {
      case "title": return { fontSize: typography.title, lineHeight: 34, fontWeight: "700" };
      case "h1": return { fontSize: typography.h1, lineHeight: 28, fontWeight: "600" };
      case "h2": return { fontSize: typography.h2, lineHeight: 24, fontWeight: "600" };
      case "body": return { fontSize: typography.body, lineHeight: 24, fontWeight: "400" };
      case "caption": return { fontSize: typography.caption, lineHeight: 18, fontWeight: "400" };
      default: return {};
    }
  };

  const stylesToApply = [
    getPresetStyle(),
    { color },
    weight ? { fontWeight: weight } : undefined,
    centered ? { textAlign: "center" as const } : undefined,
    style,
  ].filter(Boolean) as TextStyle[];

  return (
    <Text style={stylesToApply} {...props}>
      {children}
    </Text>
  );
}
