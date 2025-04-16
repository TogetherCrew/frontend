'use client'

import { useMemo } from "react";
import { FaCog, FaHome } from "react-icons/fa";

import { useAdmin } from "@/hooks/useAdmin";

import { MODULE_CONTEXT } from "@/constants/ModuleContext";
import { ISidebarItem } from "@/utils/interfaces";

const defaultItems: ISidebarItem[] = [
  {
    label: "Home",
    icon: FaHome,
    href: "/dashboard/",
  },
];

const adminItems: ISidebarItem[] = [
  {
    label: "Settings",
    icon: FaCog,
    href: "/community-settings/",
  },
];

export const useSidebar = () => {
  const { isAdmin } = useAdmin();

  const sidebarItems = useMemo(() => {

    if (!isAdmin) {
      const items = MODULE_CONTEXT.filter(module => !module.adminOnly).map(module => ({
        label: module.title,
        icon: module.icon,
        href: module.modulePath,
      }))

      return [...defaultItems, ...items]
    }

    const items: ISidebarItem[] = MODULE_CONTEXT.map(module => ({
      label: module.title,
      icon: module.icon,
      href: module.modulePath,
    }))

    return [...defaultItems, ...items, ...adminItems];
  }, [isAdmin]);


  return {
    sidebarItems,
  };
}