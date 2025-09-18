import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isTokenExpired, parseJwt } from '../../lib/jwt';
import { login as apiLogin, logout as apiLogout, refresh } from './api';
import { eventBus } from '../../lib/eventBus';
import type { LoginPayload, LoginResponse, Member } from './types';
import axios from 'axios';

type AuthState = {
  user: Member | null;
  isAdmin: boolean;
  isManager: boolean;
  loading: boolean;
  login: (p: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<boolean>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const memberFromToken = useCallback((token: string | null): Member | null => {
    if (!token) return null;
    const claims = parseJwt<any>(token);
    if (!claims) return null;

    return {
      id: Number(claims.sub ?? claims.id),
      email: String(claims.email ?? ''),
      username: String(claims.username ?? claims.name ?? ''),
      role: (claims.role ?? 'USER') as Member['role'],
    };
  }, []);

  const restore = useCallback(async (): Promise<boolean> => {
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken && !isTokenExpired(storedToken)) {
      setUser(memberFromToken(storedToken));
      setLoading(false);
      return true;
    }

    try {
      const token = await refresh();
      if (token) {
        setUser(memberFromToken(token));
        setLoading(false);
        return true;
      } else {
        setUser(null);
        localStorage.removeItem('accessToken');
        setLoading(false);
        return false;
      }
    } catch {
      setUser(null);
      localStorage.removeItem('accessToken');
      setLoading(false);
      return false;
    }
  }, [memberFromToken]);

  const login = useCallback(
    async (payload: LoginPayload): Promise<void> => {
      try {
        const res: LoginResponse = await apiLogin(payload);
        const token = res.data?.accessToken ?? null;
        const member =
          res.data?.member ?? (token ? memberFromToken(token) : null);

        setUser(member);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const msg = error.response?.data?.message ?? '로그인에 실패했습니다.';
          throw new Error(msg);
        }
        throw error;
      }
    },
    [memberFromToken],
  );

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  useEffect(() => {
    restore();
  }, [restore]);

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      localStorage.removeItem('accessToken');
    };
    eventBus.on('unauthorized', onUnauthorized);
    return () => eventBus.off('unauthorized', onUnauthorized);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAdmin: user?.role === 'ADMIN',
      isManager: user?.role === 'ADMIN' || user?.role === 'MANAGER',
      loading,
      login,
      logout,
      restore,
    }),
    [user, loading, login, logout, restore],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuthContext = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
