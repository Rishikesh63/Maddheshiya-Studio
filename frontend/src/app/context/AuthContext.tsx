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
  is_admin_user?: boolean;
  is_superuser?: boolean;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthToken | null;
  login: (username: string, password: string) => Promise<void>;
  loginWithTokens: (access: string, refresh: string) => Promise<void>;
  logout: () => void;
  socialLogin: (provider: 'google', accessToken: string) => Promise<void>;
  loading: boolean;
  getValidToken: () => Promise<string | null>;
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

const isExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000 - 30_000; // 30s buffer
  } catch {
    return true;
  }
};

const doRefresh = async (refresh: string): Promise<AuthToken | null> => {
  try {
    const res = await fetch(apiUrl('/api/auth/token/refresh/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    // SimpleJWT with ROTATE_REFRESH_TOKENS returns a new refresh token too
    return { access: data.access, refresh: data.refresh ?? refresh };
  } catch {
    return null;
  }
};

// --- Provider Component ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<AuthToken | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const stored = getStoredTokens();
      if (!stored) { setLoading(false); return; }

      let active = stored;

      // Refresh access token if it's expired or about to expire
      if (isExpired(stored.access)) {
        const refreshed = await doRefresh(stored.refresh);
        if (!refreshed) { clearStoredTokens(); setLoading(false); return; }
        storeTokens(refreshed);
        active = refreshed;
      }

      try {
        const decoded: User = jwtDecode(active.access);
        setTokens(active);
        setUser(decoded);
        fetch(apiUrl('/api/users/me/'), {
          headers: { Authorization: `Bearer ${active.access}` },
        })
          .then((r) => r.ok ? r.json() : null)
          .then((profile) => {
            if (profile) {
              setUser((prev) => prev ? {
                ...prev,
                name: profile.name || profile.first_name || prev.username,
                is_admin_user: profile.is_admin_user,
                is_superuser: profile.is_superuser,
              } : prev);
            }
          })
          .catch(() => {});
      } catch {
        clearStoredTokens();
      }
      setLoading(false);
    };
    init();
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
          decoded.is_admin_user = profile.is_admin_user;
          decoded.is_superuser = profile.is_superuser;
        }
      } catch { /* use decoded fallback */ }
      setUser(decoded);
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const loginWithTokens = async (access: string, refresh: string) => {
    const data: AuthToken = { access, refresh };
    storeTokens(data);
    setTokens(data);
    const decoded: User = jwtDecode(access);
    try {
      const res = await fetch(apiUrl('/api/users/me/'), {
        headers: { Authorization: `Bearer ${access}` },
      });
      if (res.ok) {
        const profile = await res.json();
        decoded.name = profile.name || profile.first_name || decoded.username;
        decoded.is_admin_user = profile.is_admin_user;
        decoded.is_superuser = profile.is_superuser;
      }
    } catch { /* use decoded fallback */ }
    setUser(decoded);
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

  // Returns a valid access token, refreshing it first if expired
  const getValidToken = async (): Promise<string | null> => {
    if (!tokens) return null;
    if (!isExpired(tokens.access)) return tokens.access;
    const refreshed = await doRefresh(tokens.refresh);
    if (!refreshed) { logout(); return null; }
    storeTokens(refreshed);
    setTokens(refreshed);
    return refreshed.access;
  };

  return (
    <AuthContext.Provider value={{ user, tokens, login, loginWithTokens, logout, socialLogin, loading, getValidToken }}>
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
