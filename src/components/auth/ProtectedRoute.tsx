import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthProvider";

import LoadingScreen from "../LoadingScreen";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/centric'); // TODO: change to /login
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return children;
}