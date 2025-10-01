'use client';
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { useMutation } from '@tanstack/react-query';

// --- Type Definitions ---
interface AuthToken {
  access: string;
  refresh: string;
}

interface User {
  user_id: number;
  email: string;
  username?: string;
  is_social?: boolean;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthToken | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  socialLogin: (provider: 'google', accessToken: string) => Promise<void>;
  loading: boolean;
}

// --- Create Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- API URL ---
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Session Storage Helpers ---
const storeTokens = (tokens: AuthToken) =>
  sessionStorage.setItem('authTokens', JSON.stringify(tokens));

const getStoredTokens = (): AuthToken | null => {
  const stored = sessionStorage.getItem('authTokens');
  return stored ? JSON.parse(stored) : null;
};

const clearStoredTokens = () => sessionStorage.removeItem('authTokens');

// --- Provider Component ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<AuthToken | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parsedTokens = getStoredTokens();
    if (parsedTokens) {
      try {
        const decoded: User = jwtDecode(parsedTokens.access);
        setTokens(parsedTokens);
        setUser(decoded);
      } catch (_err) {
        console.error('Invalid token, clearing session');
        clearStoredTokens();
      }
    }
    setLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await fetch(`${API_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      return (await response.json()) as AuthToken;
    },
    onSuccess: (data) => {
      storeTokens(data);
      setTokens(data);
      setUser(jwtDecode(data.access));
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const socialLogin = async (provider: 'google', accessToken: string) => {
    const res = await fetch(`${API_URL}/auth/${provider}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: accessToken }),
    });
    if (!res.ok) throw new Error('Social login failed');
    const data: AuthToken = await res.json();
    storeTokens(data);
    setTokens(data);
    setUser(jwtDecode(data.access));
  };

  const logout = () => {
    setTokens(null);
    setUser(null);
    clearStoredTokens();
  };

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout, socialLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
};

export default AuthContext;
