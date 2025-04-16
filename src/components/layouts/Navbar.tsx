"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBars, FaExchangeAlt, FaSignOutAlt } from "react-icons/fa";

import { useToken } from "@/context/TokenContext";
import { StorageService } from "@/services/StorageService";
// import ThemeToggle from "../ui/toggle/ThemeToggle";
// import { ProfileDropdown } from "../ui/dropdown/ProfileDropdown";
interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
}

export default function Navbar({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) {

  const { community } = useToken();
  const router = useRouter();
  const handleLogout = () => {
    StorageService.removeLocalStorage('community');
    StorageService.removeLocalStorage('TC_SELECTED_PLATFORM');
    StorageService.removeLocalStorage('user');
    router.push('/centric');
  }

  return (
    <div className="sticky navbar bg-base-100 top-0 z-50 ">
      <div className="navbar-start">
        <button className="btn btn-square btn-ghost" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FaBars />
        </button>
        <div className="flex items-center gap-2">
          <div className="ml-4 text-lg font-bold">{community?.name}</div>
          <Link href="/centric/select-community" className="flex btn btn-square btn-ghost tooltip tooltip-right" data-tip="Switch Community">
            <FaExchangeAlt />
          </Link>
        </div>
      </div>
      <div className="navbar-end">
        <div className="flex gap-2">
          <button className="btn btn-square btn-ghost tooltip tooltip-left" data-tip="Logout" onClick={handleLogout}>
            <div className="flex items-center justify-center">
              <FaSignOutAlt />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}