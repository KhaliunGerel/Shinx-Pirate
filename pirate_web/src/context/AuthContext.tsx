/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getBalance } from "../lib/api";

type AuthContextValue = {
  username: string | null;
  token: string | null;
  balance: number | null;
  updatedBalance: number | null;
  login: (username: string, token: string) => void;
  logout: () => void;
  setBalance: (value: number) => void;
  setUpdatedBalance: (value: number) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [updatedBalance, setUpdatedBalance] = useState(0);

  // Load from localStorage on first mount
  useEffect(() => {
    const storedToken = localStorage.getItem("game_jwt_token");
    const storedUsername = localStorage.getItem("game_username1");
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
    }
  }, []);

  const login = (name: string, jwt: string) => {
    localStorage.setItem("game_jwt_token", jwt);
    localStorage.setItem("game_username1", name);
    setUsername(name);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("game_jwt_token");
    localStorage.removeItem("game_username1");
    setUsername(null);
    setToken(null);
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (token) {
      getBalance()
        .then(async (res) => {
          setBalance(res.game_coin);
          await delay(200);
          setUpdatedBalance(Date.now());
        })
        .catch(console.log);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        username,
        token,
        balance,
        updatedBalance,
        login,
        logout,
        setBalance,
        setUpdatedBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

declare global {
  interface Window {
    unityInstance?: {
      SendMessage: (obj: string, method: string, value?: any) => void;
    };
  }
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
