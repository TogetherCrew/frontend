import React from 'react';

import DashboardLayout from '@/components/layouts/DashboardLayout';

import TcPrompt from '../components/layouts/shared/TcPrompt';

type IDefaultLayoutProps = {
  children: React.ReactNode;
};

export const defaultLayout = ({ children }: IDefaultLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <TcPrompt />
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </div>
  );
};
