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
import { apiUrl } from '@/app/lib/api';

// --- Type Definitions ---
interface AuthToken {
  access: string;
  refresh: string;
}

interface User {
  user_id: number;
  email: string;
  username?: string;
  name?: string;
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
        // Hydrate display name from profile
        fetch(apiUrl('/api/users/me/'), {
          headers: { Authorization: `Bearer ${parsedTokens.access}` },
        })
          .then((r) => r.ok ? r.json() : null)
          .then((profile) => {
            if (profile) {
              setUser((prev) => prev ? { ...prev, name: profile.name || profile.first_name || prev.username } : prev);
            }
          })
          .catch(() => {});
      } catch {
        clearStoredTokens();
      }
    }
    setLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await fetch(apiUrl('/api/auth/token/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const text = await response.text();
        let msg = 'Invalid email or password';
        try {
          const data = JSON.parse(text);
          msg = data.detail || data.non_field_errors?.[0] || msg;
        } catch { /* use default */ }
        throw new Error(msg);
      }
      return (await response.json()) as AuthToken;
    },
    onSuccess: async (data) => {
      storeTokens(data);
      setTokens(data);
      const decoded: User = jwtDecode(data.access);
      // Fetch full profile to get display name
      try {
        const res = await fetch(apiUrl('/api/users/me/'), {
          headers: { Authorization: `Bearer ${data.access}` },
        });
        if (res.ok) {
          const profile = await res.json();
          decoded.name = profile.name || profile.first_name || decoded.username;
        }
      } catch { /* use decoded fallback */ }
      setUser(decoded);
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const socialLogin = async (provider: 'google', accessToken: string) => {
    const res = await fetch(apiUrl(`/api/auth/${provider}/`), {
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
