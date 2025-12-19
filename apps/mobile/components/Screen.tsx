import React from "react";
import { 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet, 
  View, 
  ViewStyle, 
  StatusBar,
  ScrollView,
  ScrollViewProps
} from "react-native";
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

interface ScreenProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  safeAreaEdges?: SafeAreaViewProps["edges"];
  preset?: "fixed" | "scroll";
  backgroundColor?: string;
  statusBarStyle?: "light-content" | "dark-content";
}

export function Screen({ 
  children, 
  style, 
  contentContainerStyle,
  safeAreaEdges, 
  preset = "fixed",
  backgroundColor = colors.background,
  statusBarStyle = "dark-content",
}: ScreenProps) {
  
  if (preset === "scroll") {
    return (
      <SafeAreaView 
        style={[styles.container, { backgroundColor }]} 
        edges={safeAreaEdges}
      >
        <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            style={[styles.scrollWrapper, style]}
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor }]} 
      edges={safeAreaEdges}
    >
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <View style={[styles.wrapper, style]}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md, 
  }
});
