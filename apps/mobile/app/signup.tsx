import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, Stack } from "expo-router";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Screen } from "../components/Screen";
import { ThemedText } from "../components/ThemedText";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValidName = name.trim().length > 1;
    const isValidEmail = email.includes("@") && email.length > 5;
    const isValidPassword = password.length >= 6;
    setIsFormValid(isValidName && isValidEmail && isValidPassword);
    
    // Clear errors proactively
    if (isValidName) setErrors(e => ({ ...e, name: "" }));
    if (isValidEmail) setErrors(e => ({ ...e, email: "" }));
    if (isValidPassword) setErrors(e => ({ ...e, password: "" }));
  }, [name, email, password]);

  const handleSignup = () => {
    if (!isFormValid) {
      setErrors({
        name: name.trim().length <= 1 ? "Name is required" : "",
        email: !email.includes("@") ? "Valid email is required" : "",
        password: password.length < 6 ? "Password min 6 chars" : "",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/dashboard");
    }, 1500);
  };

  const handleGoToLogin = () => {
    router.back();
  };

  return (
    <Screen preset="scroll" contentContainerStyle={styles.container}>
      <Stack.Screen options={{ 
        headerShown: true,
        headerTitle: "",
        headerTransparent: true,
        headerTintColor: colors.textPrimary,
      }} />
      
      <View style={styles.header}>
        <ThemedText preset="title" centered style={styles.title}>Create Account</ThemedText>
        <ThemedText preset="body" color={colors.textSecondary} centered>
          Join Forma today
        </ThemedText>
      </View>

      <View style={styles.form}>
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <Input
          label="Email Address"
          placeholder="hello@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <Input
          label="Password"
          placeholder="Create a password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
        
        <View style={styles.spacer} />

        <Button 
          title="Sign Up" 
          onPress={handleSignup}
          loading={loading}
          style={[styles.button, { opacity: isFormValid ? 1 : 0.6 }]}
        />
        
        <View style={styles.footer}>
          <ThemedText color={colors.textSecondary}>Already have an account? </ThemedText>
          <ThemedText color={colors.primary} weight="600" onPress={handleGoToLogin}>Log in</ThemedText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl,
    justifyContent: "center",
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  form: {
    width: "100%",
  },
  spacer: {
    height: spacing.md,
  },
  button: {
    width: "100%",
  },
  footer: {
    marginTop: spacing.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
