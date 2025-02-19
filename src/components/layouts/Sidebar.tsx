import React, { useEffect, useState } from "react";

type items = {
	name: string;
	path: string;
	icon: any;
	isVisible?: boolean;
};

import {
	faHeartPulse,
	faHome,
	faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { MdOutlineAnnouncement } from "react-icons/md";
import { RiNftFill } from "react-icons/ri";

import { ICommunityPlatfromProps } from "@/utils/interfaces";

import TcText from "../shared/TcText";
import { conf } from "../../configs/index";
import { useToken } from "../../context/TokenContext";
import useAppStore from "../../store/useStore";

const Sidebar = () => {
	const router = useRouter();
	const currentRoute = router.pathname;
	const { dynamicNFTModuleInfo } = useAppStore();
	const { community, selectedPlatform } = useToken();
	const [isDiscourse, setIsDiscourse] = useState<boolean>(false);

	const userPermissions = useAppStore(
		(state) => state.userRolePermissions || [],
	);

	const [connectedPlatform, setConnectedPlatform] =
		useState<ICommunityPlatfromProps | null>(null);

	useEffect(() => {
		const storedCommunity = community;

		if (storedCommunity?.platforms) {
			const foundPlatform = storedCommunity.platforms.find(
				(platform) =>
					platform.disconnectedAt === null && platform.name === "discord",
			);

			setConnectedPlatform(foundPlatform ?? null);
		}
	}, [community]);

	useEffect(() => {
		const discoursePlatformId = community?.platforms?.find((platform) => {
			return platform.name === "discourse" && platform.disconnectedAt === null;
		})?.id;

		if (discoursePlatformId && selectedPlatform) {
			setIsDiscourse(selectedPlatform === discoursePlatformId);
		} else {
			setIsDiscourse(false);
		}
	}, [community, selectedPlatform]);

	let menuItems: items[] = [
		{
			name: "Home",
			path: "/centric/welcome",
			icon: (
				<FontAwesomeIcon
					icon={faHome}
					style={{ fontSize: 20, color: "black" }}
				/>
			),
		},
		{
			name: "Community Insights",
			path: "/",
			icon: (
				<FontAwesomeIcon
					icon={faUserGroup}
					style={{ fontSize: 20, color: "black" }}
				/>
			),
		},
		{
			name: "Community Health",
			path: "/community-health",
			icon: (
				<FontAwesomeIcon
					icon={faHeartPulse}
					style={{ fontSize: 20, color: "black" }}
				/>
			),
		},
		{
			name: "Smart Announcements",
			path: "/announcements",
			icon: (
				<MdOutlineAnnouncement
					style={{ fontSize: 20, color: "black", margin: "0 auto" }}
				/>
			),
		},
		{
			name: "Community Settings",
			path: "/community-settings",
			icon: (
				<FiSettings
					style={{ fontSize: 20, color: "black", margin: "0 auto" }}
				/>
			),
		},
	];

	// if (dynamicNFTModuleInfo?.isNFTModuleEnabled) {
	menuItems.splice(menuItems.length - 1, 0, {
		name: "Reputation Score",
		path: "/reputation-score",
		icon: (
			<RiNftFill style={{ fontSize: 20, color: "black", margin: "0 auto" }} />
		),
	});
	// }

	if (!userPermissions.includes("admin")) {
		menuItems = menuItems.filter(
			(item) =>
				item.name !== "Community Settings" &&
				item.name !== "Smart Announcements",
		);
	}

	if (isDiscourse) {
		menuItems = menuItems.filter((item) => item.name !== "Smart Announcements");
	}

	const menuItem = menuItems.map((el) => (
		<li key={el.name} className="py-4">
			<Link href={el.path}>
				<div
					className={
						currentRoute === el.path
							? "cursor-pointer rounded-xl bg-white py-2 text-center delay-75 ease-in hover:bg-white"
							: "cursor-pointer rounded-xl py-2 text-center delay-75 ease-in hover:bg-white"
					}
				>
					{el.icon}
				</div>
				<p className="break-words text-center text-sm">{el.name}</p>
			</Link>
		</li>
	));

	return (
		<aside className="fixed hidden h-screen bg-gray-background shadow-inner md:block md:w-[100px] xl:w-[150px]">
			<nav>
				<div>
					<div className="mx-auto my-4 flex flex-col justify-center text-center">
						<div className="mx-auto w-full">
							<div
								className="mx-auto mb-2 h-10 w-10 cursor-pointer"
								onClick={() => router.push("/centric/select-community")}
							>
								{connectedPlatform?.metadata?.icon ? (
									<Avatar
										src={`${conf.DISCORD_CDN}icons/${connectedPlatform.metadata.id}/${connectedPlatform.metadata.icon}`}
										alt={
											connectedPlatform.metadata.name
												? connectedPlatform.metadata.name
												: ""
										}
									/>
								) : (
									<div className="align-center flex h-10 w-10 flex-col justify-center rounded-full bg-secondary text-center text-xs" />
								)}
							</div>
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
				<ul className="flex flex-col px-3">{menuItem}</ul>
			</nav>
		</aside>
	);
};

export default Sidebar;
