import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ADMIN_TOKEN_STORAGE_KEY } from "../constants/config";
import { adminApi } from "../services/adminApi";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  isReady: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    if (!stored) {
      setIsReady(true);
      return;
    }
    setToken(stored);
    adminApi
      .me()
      .then((res) => setUsername(res.admin.username))
      .catch(() => {
        localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
        setToken(null);
      })
      .finally(() => setIsReady(true));
  }, []);

  const login = useCallback(async (u: string, p: string) => {
    const res = await adminApi.login(u, p);
    localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, res.token);
    setToken(res.token);
    setUsername(res.admin.username);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setToken(null);
    setUsername(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated: !!token, isReady, username, login, logout }),
    [token, isReady, username, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
