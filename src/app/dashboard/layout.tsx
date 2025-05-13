"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Breadcrumbs from "@/components/layouts/Breadcrumbs";
import DashboardLayout from "@/components/layouts/DashboardLayout";

import { TokenProvider } from "@/context/TokenContext";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <ProtectedRoute>
      <QueryClientProvider client={queryClient}>
        <TokenProvider>
          <DashboardLayout>
            <Breadcrumbs />
            {children}
          </DashboardLayout>
        </TokenProvider>
      </QueryClientProvider>
    </ProtectedRoute>
  )
}