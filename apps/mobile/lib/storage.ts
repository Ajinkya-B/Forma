import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokens, User } from '@forma/shared-types';

const STORAGE_KEYS = {
  USER: '@forma/user',
  TOKENS: '@forma/tokens',
} as const;

export const storage = {
  // User
  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user from storage:', error);
      return null;
    }
  },

  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user in storage:', error);
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error removing user from storage:', error);
    }
  },

  // Tokens
  async getTokens(): Promise<AuthTokens | null> {
    try {
      const tokensData = await AsyncStorage.getItem(STORAGE_KEYS.TOKENS);
      return tokensData ? JSON.parse(tokensData) : null;
    } catch (error) {
      console.error('Error getting tokens from storage:', error);
      return null;
    }
  },

  async setTokens(tokens: AuthTokens): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
    } catch (error) {
      console.error('Error setting tokens in storage:', error);
    }
  },

  async removeTokens(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKENS);
    } catch (error) {
      console.error('Error removing tokens from storage:', error);
    }
  },

  // Clear all auth data
  async clearAuth(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKENS),
      ]);
    } catch (error) {
      console.error('Error clearing auth from storage:', error);
    }
  },
};
