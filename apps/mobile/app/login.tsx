import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useRouter, Stack } from "expo-router";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Screen } from "../components/Screen";
import { ThemedText } from "../components/ThemedText";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Validation state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Simple validation check
    const isValidEmail = email.includes("@") && email.length > 5;
    const isValidPassword = password.length >= 6;
    setIsFormValid(isValidEmail && isValidPassword);
    
    // Clear errors when typing
    if (isValidEmail) setEmailError("");
    if (isValidPassword) setPasswordError("");
  }, [email, password]);

  const validate = () => {
    let valid = true;
    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      await login({ email, password });
      // Navigation will happen automatically via useEffect
    } catch (error) {
      Alert.alert("Login Failed", "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToSignup = () => {
    router.push("/signup");
  };

  return (
    <Screen preset="scroll" contentContainerStyle={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <ThemedText preset="title" centered style={styles.title}>Welcome Back</ThemedText>
        <ThemedText preset="body" color={colors.textSecondary} centered>
          Sign in to continue to Forma
        </ThemedText>
      </View>

      <View style={styles.form}>
        <Input
          label="Email Address"
          placeholder="hello@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={emailError}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={passwordError}
        />
        
        <View style={styles.spacer} />

        <Button 
          title="Sign In" 
          onPress={handleLogin}
          loading={loading}
          disabled={!isFormValid && false}
          style={[styles.button, { opacity: isFormValid ? 1 : 0.6 }]}
        />
        
        <Button 
          title="Create Account" 
          variant="outline" 
          onPress={handleGoToSignup}
          style={styles.button}
        />
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
    marginTop: spacing.md,
  },
});
