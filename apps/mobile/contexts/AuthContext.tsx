import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthTokens, LoginCredentials, SignupCredentials } from '@forma/shared-types';
import { storage } from '../lib/storage';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted auth state on mount
  useEffect(() => {
    loadPersistedAuth();
  }, []);

  const loadPersistedAuth = async () => {
    try {
      const [storedUser, storedTokens] = await Promise.all([
        storage.getUser(),
        storage.getTokens(),
      ]);

      if (storedUser && storedTokens) {
        setUser(storedUser);
        setTokens(storedTokens);
      }
    } catch (error) {
      console.error('Error loading persisted auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await api.login(credentials);

      // Persist to storage
      await Promise.all([
        storage.setUser(response.user),
        storage.setTokens(response.tokens),
      ]);

      setUser(response.user);
      setTokens(response.tokens);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    try {
      const response = await api.signup(credentials);

      await Promise.all([
        storage.setUser(response.user),
        storage.setTokens(response.tokens),
      ]);

      setUser(response.user);
      setTokens(response.tokens);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // TODO: Call logout API endpoint if needed
      await storage.clearAuth();
      setUser(null);
      setTokens(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  const updateUser = useCallback(async (updatedUser: User) => {
    try {
      await storage.setUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated: !!user && !!tokens,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
