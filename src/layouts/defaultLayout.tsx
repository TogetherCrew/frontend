import React from 'react';

import TcPrompt from '../components/layouts/shared/TcPrompt';
import Sidebar from '../components/layouts/Sidebar';
import SidebarXs from '../components/layouts/xs/SidebarXs';

type IDefaultLayoutProps = {
  children: React.ReactNode;
};

export const defaultLayout = ({ children }: IDefaultLayoutProps) => {
  return (
    <>
      <TcPrompt />
      <div className='flex w-full flex-col justify-between md:flex-row'>
        <Sidebar />
        <SidebarXs />
        <main className='flex-1'>
          {children}
        </main>
      </div>
    </>
  );
};
