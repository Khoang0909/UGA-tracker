'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  // TODO: Replace with real API call to /api/auth/login
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock validation
    if (!email || !password) {
      setIsLoading(false);
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      setIsLoading(false);
      throw new Error('Invalid credentials');
    }

    // Create mock user
    const mockUser: User = {
      id: '1',
      username: email.split('@')[0],
      email: email,
    };

    setUser(mockUser);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  // Mock signup function
  // TODO: Replace with real API call to /api/auth/signup
  const signup = async (username: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (!username || !email || !password) {
      setIsLoading(false);
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      setIsLoading(false);
      throw new Error('Password must be at least 6 characters');
    }

    // Create mock user
    const mockUser: User = {
      id: '1',
      username: username,
      email: email,
    };

    setUser(mockUser);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  // Mock logout function
  // TODO: Replace with real API call to /api/auth/logout and clear httpOnly cookies
  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
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
