import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { NICKNAME_STORAGE_KEY } from "../constants/config";
import { playersApi } from "../services/playersApi";

interface NicknameContextValue {
  nickname: string | null;
  isReady: boolean;
  needsOnboarding: boolean;
  setNickname: (nickname: string) => Promise<void>;
  clearNickname: () => void;
}

const NicknameContext = createContext<NicknameContextValue | undefined>(undefined);

export function NicknameProvider({ children }: { children: ReactNode }) {
  const [nickname, setNicknameState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(NICKNAME_STORAGE_KEY);
    setNicknameState(stored);
    setIsReady(true);
  }, []);

  const setNickname = useCallback(async (next: string) => {
    await playersApi.upsert(next);
    localStorage.setItem(NICKNAME_STORAGE_KEY, next);
    setNicknameState(next);
  }, []);

  const clearNickname = useCallback(() => {
    localStorage.removeItem(NICKNAME_STORAGE_KEY);
    setNicknameState(null);
  }, []);

  const value = useMemo(
    () => ({
      nickname,
      isReady,
      needsOnboarding: isReady && !nickname,
      setNickname,
      clearNickname,
    }),
    [nickname, isReady, setNickname, clearNickname]
  );

  return <NicknameContext.Provider value={value}>{children}</NicknameContext.Provider>;
}

export function useNickname() {
  const ctx = useContext(NicknameContext);
  if (!ctx) throw new Error("useNickname must be used within NicknameProvider");
  return ctx;
}
