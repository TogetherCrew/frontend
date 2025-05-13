"use client";
import { useEffect } from "react";
import Link from "next/link";

import { useSidebar } from "@/hooks/sidebar/useSidebar";

import { ISidebarItem } from "@/utils/interfaces";

function SidebarLabel({ item }: { item: ISidebarItem }) {
	return (
		<>
			<item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
			<span className="text-xs font-semibold lg:hidden">{item.label}</span>
		</>
	)
}

function SidebarItem({ item }: { item: ISidebarItem }) {

	if (item.children && item.children.length > 0) {
		return (
			<li>
				<details open>
					<summary className="py-3"><SidebarLabel item={item} /></summary>
					<ul>
						{item.children.map((child) => (
							<SidebarItem key={child.label} item={child} />
						))}
					</ul>
				</details>
			</li>
		)
	}
	return (
		<li>
			<Link href={item.href || ''} className={`py-3 lg:hidden ${item.href === window.location.pathname ? 'text-secondary' : ''}`}><SidebarLabel item={item} /></Link>
			<Link href={item.href || ''} className={`hidden lg:flex tooltip tooltip-right btn btn-square btn-ghost ${item.href === window.location.pathname ? 'text-secondary bg-base-200' : ''}`} data-tip={item.label}><SidebarLabel item={item} /></Link>
		</li>
	)
}


const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean, setIsSidebarOpen: (isSidebarOpen: boolean) => void }) => {

	const { sidebarItems } = useSidebar();

	return (
		<>
			{/* Backdrop */}
			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 lg:hidden z-30"
					onClick={() => setIsSidebarOpen(false)}
				></div>
			)}

			{/* Sidebar */}
			<div
				className={`fixed left-0 top-0 h-full w-64 lg:w-16 bg-base-100 border-r border-base-300 transition-transform duration-300 z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
					}`}
			>

				<ul className="menu w-full mt-[72px]">
					{sidebarItems.map((item, index) => (
						<SidebarItem key={index} item={item} />
					))}
				</ul>

			</div>
		</>
	)
};

export default Sidebar;
