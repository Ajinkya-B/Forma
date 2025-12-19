import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthTokens, LoginCredentials, SignupCredentials, AuthResponse } from '@forma/shared-types';
import { storage } from '../lib/storage';

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
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          email: credentials.email,
          name: 'Alex Johnson',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      };

      // Persist to storage
      await Promise.all([
        storage.setUser(mockResponse.user),
        storage.setTokens(mockResponse.tokens),
      ]);

      setUser(mockResponse.user);
      setTokens(mockResponse.tokens);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          email: credentials.email,
          name: credentials.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      };

      await Promise.all([
        storage.setUser(mockResponse.user),
        storage.setTokens(mockResponse.tokens),
      ]);

      setUser(mockResponse.user);
      setTokens(mockResponse.tokens);
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
