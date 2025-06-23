"use client";
import { createContext, useState, ReactNode, useContext } from "react";
import { type AuthUser, type AuthTokens } from "aws-amplify/auth";

interface AuthContextType {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  login: (userData: AuthUser | null, tokensData: AuthTokens | null) => void;
  logout: () => void;
  loggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const login = (userData: AuthUser | null, tokensData: AuthTokens | null) => {
    setUser(userData);
    setTokens(tokensData);
    setLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    setLoggedIn(false);
  };

  return <AuthContext.Provider value={{ user, tokens, login, logout, loggedIn }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
