import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { parseJwt } from '../../lib/jwt';
import { login as apiLogin, logout as apiLogout, refresh } from './api';
import type { LoginPayload, Member } from './types';

type AuthState = {
  user: Member | null;
  isAdmin: boolean;
  isManager: boolean;
  loading: boolean;
  login: (p: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  function memberFromToken(token: string | null): Member | null {
    if (!token) return null;
    const claims = parseJwt<any>(token);
    if (!claims) return null;

    return {
      id: Number(claims.sub ?? claims.id),
      email: String(claims.email ?? ''),
      username: String(claims.username ?? claims.name ?? ''),
      role: (claims.role ?? 'USER') as Member['role'],
    };
  }

  const restore = async () => {
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken) {
      setUser(memberFromToken(storedToken));
      setLoading(false);
      return;
    }

    try {
      const token = await refresh();
      if (token) {
        setUser(memberFromToken(token));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restore();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAdmin: user?.role === 'ADMIN',
      isManager: user?.role === 'ADMIN' || user?.role === 'MANAGER',
      loading,
      login: async (payload) => {
        const res = await apiLogin(payload);
        const token = res.data?.accessToken; // 변경
        setUser(res.data?.member ?? memberFromToken(token));
      },

      logout: async () => {
        await apiLogout();
        setUser(null);
      },
      restore,
    }),
    [user, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuthContext = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
