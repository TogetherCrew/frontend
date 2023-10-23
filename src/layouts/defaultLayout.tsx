import React, { useEffect } from 'react';
import Sidebar from '../components/layouts/Sidebar';
import SidebarXs from '../components/layouts/xs/SidebarXs';
import useAppStore from '../store/useStore';
import { StorageService } from '../services/StorageService';
import { IUser } from '../utils/types';
import TcPrompt from '../components/layouts/shared/TcPrompt';

type IDefaultLayoutProps = {
  children: React.ReactNode;
};

export const defaultLayout = ({ children }: IDefaultLayoutProps) => {
  return (
    <>
      <TcPrompt />
      <div className="flex flex-col md:flex-row justify-between w-full">
        <Sidebar />
        <SidebarXs />
        <main className="md:ml-[100px] xl:ml-[150px] flex-1">{children}</main>
      </div>
    </>
  );
};
