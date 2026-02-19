// src/contexts/auth.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AuthUser = {
  id: string;
  name?: string | null;
  email: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser, token?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@outfitlab:user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.log("Error cargando usuario almacenado:", e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (newUser: AuthUser, token?: string) => {
    try {
      setUser(newUser);
      await AsyncStorage.setItem("@outfitlab:user", JSON.stringify(newUser));

      if (token) {
        await AsyncStorage.setItem("@outfitlab:token", token);
      }
    } catch (e) {
      console.log("Error guardando usuario:", e);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem("@outfitlab:user");
      await AsyncStorage.removeItem("@outfitlab:token");
    } catch (e) {
      console.log("Error limpiando sesión:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
