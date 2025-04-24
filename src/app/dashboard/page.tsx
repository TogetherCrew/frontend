'use client';

import { FaHome } from "react-icons/fa";

import SEO from "@/components/global/SEO";
import ModuleList from "@/components/home/modules/ModuleList";
import PlatformList from "@/components/home/platforms/PlatformList";

export default function Page() {

  return (
    <>
      <SEO title="Home" />
      <div className="flex flex-col gap-6 sm:gap-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FaHome className="text-secondary" />
          <span>Home</span>
        </h1>
        {/* <OnlyAdminWarning /> */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex-1">
            <PlatformList />
          </div>
          <div className="flex-1">
            <ModuleList />
          </div>
        </div >
      </div>

    </ >
  );
}