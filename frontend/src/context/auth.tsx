"use client";
import { createContext, useState, ReactNode, useContext } from "react";
import { type AuthUser } from "aws-amplify/auth";

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: AuthUser | null) => void;
  logout: () => void;
  loggedIn: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const login = (userData: AuthUser | null) => {
    setUser(userData);
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loggedIn, setLoading, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
