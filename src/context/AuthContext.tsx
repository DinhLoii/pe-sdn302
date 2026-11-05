"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
type User = { id: string; email: string };
const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  clearVersion: number;
  clear: () => void;
} | null>(null);
export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState(initialUser);
  const [clearVersion, setClearVersion] = useState(0);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        clearVersion,
        clear: () => {
          setUser(null);
          setClearVersion((v) => v + 1);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider missing");
  return context;
}
