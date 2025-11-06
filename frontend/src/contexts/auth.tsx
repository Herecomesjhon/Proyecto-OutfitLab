// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../api"; // ajusta si tu api.ts está en src/

type User = { id: string; email: string; name?: string };

type Ctx = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (t: string, u: User) => Promise<void>; // útil para Google/Facebook
};

const AuthContext = createContext<Ctx>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  setSession: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [t, u] = await Promise.all([
          AsyncStorage.getItem("@auth_token"),
          AsyncStorage.getItem("@auth_user"),
        ]);
        if (t) setToken(t);
        if (u) setUser(JSON.parse(u));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setSession = async (t: string, u: User) => {
    setToken(t);
    setUser(u);
    await AsyncStorage.setItem("@auth_token", t);
    await AsyncStorage.setItem("@auth_user", JSON.stringify(u));
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    const { token: tk, user: us } = await res.json();
    if (!tk || !us?.id) throw new Error("Respuesta inválida");
    await setSession(tk, us);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove(["@auth_token", "@auth_user"]);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
