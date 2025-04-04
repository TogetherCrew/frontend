import React, { useEffect, useState } from "react";
import { faHeartPulse, faHome, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaRobot } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { MdOutlineAnnouncement } from "react-icons/md";
import { RiNftFill } from "react-icons/ri";

import { ICommunityPlatfromProps } from "@/utils/interfaces";

import TcText from "../shared/TcText";
import { conf } from "../../configs/index";
import { useToken } from "../../context/TokenContext";
import useAppStore from "../../store/useStore";

interface MenuItem {
	name: string;
	path: string;
	icon: React.ReactNode;
	isVisible?: boolean;
}

const Sidebar = () => {
	const router = useRouter();
	const currentRoute = router.pathname;
	const { community, selectedPlatform } = useToken();
	const [isDiscourse, setIsDiscourse] = useState(false);
	const userPermissions = useAppStore((state) => state.userRolePermissions || []);
	const [connectedPlatform, setConnectedPlatform] = useState<ICommunityPlatfromProps | null>(null);

	const findConnectedPlatform = () => {
		if (!community?.platforms) return;

		const foundPlatform = community.platforms.find(
			(platform) => platform.disconnectedAt === null && platform.name === "discord"
		);
		setConnectedPlatform(foundPlatform ?? null);
	};

	const checkIsDiscourse = () => {
		const discoursePlatformId = community?.platforms?.find(
			(platform) => platform.name === "discourse" && platform.disconnectedAt === null
		)?.id;

		setIsDiscourse(Boolean(discoursePlatformId && selectedPlatform && selectedPlatform === discoursePlatformId));
	};

	useEffect(() => {
		findConnectedPlatform();
	}, [community]);

	useEffect(() => {
		checkIsDiscourse();
	}, [community, selectedPlatform]);

	const defaultMenuItems: MenuItem[] = [
		{
			name: "Home",
			path: "/centric/welcome",
			icon: <FontAwesomeIcon icon={faHome} style={{ fontSize: 20, color: "black" }} />
		},
		{
			name: "Community Insights",
			path: "/",
			icon: <FontAwesomeIcon icon={faUserGroup} style={{ fontSize: 20, color: "black" }} />
		},
		{
			name: "Community Health",
			path: "/community-health",
			icon: <FontAwesomeIcon icon={faHeartPulse} style={{ fontSize: 20, color: "black" }} />
		},
		{
			name: "Smart Announcements",
			path: "/announcements",
			icon: <MdOutlineAnnouncement style={{ fontSize: 20, color: "black", margin: "0 auto" }} />
		},
		{
			name: "Agent",
			path: "/agent",
			icon: <FaRobot style={{ fontSize: 20, color: "black", margin: "0 auto" }} />
		},
		{
			name: "Reputation Score",
			path: "/reputation-score",
			icon: <RiNftFill style={{ fontSize: 20, color: "black", margin: "0 auto" }} />
		},
		{
			name: "Community Settings",
			path: "/community-settings",
			icon: <FiSettings style={{ fontSize: 20, color: "black", margin: "0 auto" }} />
		}
	];

	const getFilteredMenuItems = () => {
		let items = [...defaultMenuItems];

		if (!userPermissions.includes("admin")) {
			items = items.filter(
				(item) => item.name !== "Community Settings" && item.name !== "Smart Announcements"
			);
		}

		if (isDiscourse) {
			items = items.filter((item) => item.name !== "Smart Announcements");
		}

		return items;
	};

	const renderMenuItem = (item: MenuItem) => (
		<li key={item.name} className="py-4">
			<Link href={item.path}>
				<div
					className={`cursor-pointer rounded-xl py-2 text-center delay-75 ease-in hover:bg-white
						${currentRoute === item.path ? "bg-white" : ""}`}
				>
					{item.icon}
				</div>
				<p className="break-words text-center text-sm">{item.name}</p>
			</Link>
		</li>
	);

	const renderCommunityAvatar = () => (
		<div
			className="mx-auto mb-2 h-10 w-10 cursor-pointer"
			onClick={() => router.push("/centric/select-community")}
		>
			{connectedPlatform?.metadata?.icon ? (
				<Avatar
					src={`${conf.DISCORD_CDN}icons/${connectedPlatform.metadata.id}/${connectedPlatform.metadata.icon}`}
					alt={connectedPlatform.metadata.name || ""}
				/>
			) : (
				<div className="align-center flex h-10 w-10 flex-col justify-center rounded-full bg-secondary text-center text-xs" />
			)}
		</div>
	);

	return (
		<aside className="fixed hidden h-screen bg-gray-background shadow-inner md:block md:w-[100px] xl:w-[150px]">
			<nav>
				<div>
					<div className="mx-auto my-4 flex flex-col justify-center text-center">
						<div className="mx-auto w-full">
							{renderCommunityAvatar()}
							<div className="break-words">
								<TcText
									text={community?.name}
									variant="body1"
									fontWeight="bold"
								/>
							</div>
						</div>
					</div>
				</div>
				<hr className="mx-2" />
				<ul className="flex flex-col px-3">
					{getFilteredMenuItems().map(renderMenuItem)}
				</ul>
			</nav>
		</aside>
	);
};

export default Sidebar;
