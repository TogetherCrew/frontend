import React, { useEffect } from "react";
import { CircularProgress, Paper } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { BiPlus } from "react-icons/bi";

import TcCommunityPlatformIcon from "./TcCommunityPlatformIcon";
import TcDiscordIntegrationSettingsDialog from "./TcDiscordIntegrationSettingsDialog";
import TcAvatar from "../../shared/TcAvatar";
import TcButton from "../../shared/TcButton";
import { conf } from "../../../configs";
import useAppStore from "../../../store/useStore";
import { IPlatformProps } from "../../../utils/interfaces";

interface TcDiscordIntgrationProps {
	platformType: string;
	isLoading: boolean;
	connectedPlatforms: IPlatformProps[];
	handleUpdateCommunityPlatform: () => void;
}

function TcDiscordIntgration({
	platformType,
	isLoading,
	connectedPlatforms,
	handleUpdateCommunityPlatform,
}: TcDiscordIntgrationProps) {

	const searchParams = useSearchParams();

	const { userProfile, connectNewPlatform } = useAppStore();

	const hasDiscordIdentity = userProfile?.identities?.some(
		(identity: any) => identity.provider === "discord",
	);

	const handleConnect = () => {
		connectNewPlatform(platformType);
	};

	useEffect(() => {
		const addPlatform = searchParams?.get("addPlatform");
		if (addPlatform === "discord") {
			handleConnect();
		}
	}, [searchParams]);

	return (
		<div className="flex items-center space-x-3 rounded-sm bg-secondary bg-opacity-5 p-5">
			<Paper className="flex h-[6rem] w-[10rem] flex-col items-center justify-center rounded-sm py-2 shadow-none">
				<span className="mx-auto">
					<TcCommunityPlatformIcon platform="Discord" size={32} />
				</span>
				<div className="mx-auto w-10/12 text-center">
					<TcButton
						text="Connect"
						variant="text"
						color="primary"
						startIcon={<BiPlus />}
						onClick={() => handleConnect()}
						disabled={!hasDiscordIdentity}
					/>
				</div>
			</Paper>
			{isLoading ? (
				<CircularProgress size={30} />
			) : (
				connectedPlatforms &&
				connectedPlatforms[0]?.name === "discord" &&
				connectedPlatforms.map((platform, index) => (
					<Paper
						className="flex h-[6rem] w-[10rem] flex-col items-center justify-center space-y-1.5 overflow-hidden rounded-sm py-2 shadow-none"
						key={index}
					>
						<TcAvatar
							src={`${conf.DISCORD_CDN}icons/${platform.metadata.id}/${platform.metadata.icon}`}
							sx={{ width: 32, height: 32 }}
						/>
						<TcDiscordIntegrationSettingsDialog
							platform={platform}
							handleUpdateCommunityPlatform={handleUpdateCommunityPlatform}
						/>
					</Paper>
				))
			)}
		</div>
	);
}

export default TcDiscordIntgration;
