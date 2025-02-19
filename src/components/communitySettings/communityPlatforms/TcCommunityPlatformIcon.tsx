import React from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { FaDiscourse } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaGoogleDrive } from "react-icons/fa";
import { FaWikipediaW } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaTelegram, FaTwitter } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { RiNotionFill } from "react-icons/ri";
import { SiGitbook } from "react-icons/si";

interface TcCommunityPlatformIconProps {
	platform: string;
	size?: number;
}

function TcCommunityPlatformIcon({
	platform,
	size = 44,
}: TcCommunityPlatformIconProps) {

	platform = platform.toLowerCase();

	const renderIcon = () => {
		switch (platform) {
			case "discord":
				return <FaDiscord size={size} />;
			case "twitter":
				return <FaTwitter size={size} />;
			case "x":
				return <FaSquareXTwitter size={size} />;
			case "discourse":
				return <FaDiscourse size={size} />;
			case "telegram":
				return <FaTelegram size={size} />;
			case "snapshot":
				return <AiFillThunderbolt size={size} />;
			case "github":
				return <FaGithub size={size} />;
			case "gdrive":
				return <FaGoogleDrive size={size} />;
			case "notion":
				return <RiNotionFill size={size} />;
			case "mediawiki":
				return <FaWikipediaW size={size} />;
			case "google":
				return <FaGoogle size={size} />;
			case "gitbook":
				return <SiGitbook size={size} />;
			default:
				return null;
		}
	};

	return <div>{renderIcon()}</div>;
}

export default TcCommunityPlatformIcon;
