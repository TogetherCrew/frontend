"use client";

import { useAtom } from "jotai/react";

import { uiAtom } from "@/atoms/ui.atom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [ui, setUi] = useAtom(uiAtom);

  const setIsSidebarOpen = () => {
    setUi({ ...ui, isSidebarOpen: !ui.isSidebarOpen });
  }

  return (
    <>
      <Sidebar isSidebarOpen={ui.isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 overflow-y-hidden ${ui.isSidebarOpen ? 'lg:ml-16' : ''}`}>
        <Navbar isSidebarOpen={ui.isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}