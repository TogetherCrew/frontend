"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai/react";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/navigation";

import LoadingScreen from "@/components/LoadingScreen";

import { authState } from "@/atoms/authState.atom";
import { conf } from "@/configs";
import { JwtPayloadType } from "@/utils/JwtPayloadType";

interface AuthContextType {
  isAuthenticated: boolean;
  decodedJwt: JwtPayloadType | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshAccessToken: () => void;
  accessToken: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useAtom(authState)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setLoading(false)
  }, [auth])

  const { accessToken, refreshToken } = auth

  const decodedJwt: JwtPayloadType | null =
    useMemo(() => {
      if (!accessToken) return null;
      try {
        return jwtDecode<JwtPayloadType>(accessToken)
      } catch (error) {
        console.error("Invalid JWT:", error);
        return null;
      }
    }, [accessToken])

  const isAuthenticated = useMemo(
    () => Boolean(decodedJwt && decodedJwt.exp * 1000 > Date.now()),
    [decodedJwt]
  );

  const login = (accessToken: string, refreshToken: string) => {
    setAuth({
      accessToken,
      refreshToken,
    })
  }

  const logout = () => {
    setAuth({
      accessToken: null,
      refreshToken: null,
    })
    router.push("/centric")
  }

  const refreshAccessToken = async () => {
    console.log("refreshAccessToken")
    if (!auth.refreshToken) {
      logout();
      return;
    }

    try {
      const response = await axios.post(`${conf.API_BASE_URL}/auth/refresh-tokens`, { refreshToken })
      const { access, refresh } = response.data
      setAuth({ accessToken: access.token, refreshToken: refresh.token });
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  }
  useEffect(() => {
    if (!decodedJwt || !decodedJwt.exp) return;

    const expiresInMs = decodedJwt.exp * 1000 - Date.now();
    if (expiresInMs > 0) {
      const timeoutId = setTimeout(refreshAccessToken, expiresInMs - 60000); // Refresh 1 min before expiry
      return () => clearTimeout(timeoutId);
    }
  }, [decodedJwt]);

  if (loading) return <LoadingScreen />

  return (
    <AuthContext.Provider value={{ isAuthenticated, decodedJwt, login, logout, refreshAccessToken, accessToken }}>
      {children}
    </AuthContext.Provider>
  );

}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}