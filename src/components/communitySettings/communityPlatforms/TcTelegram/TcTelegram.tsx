import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

import useAppStore from "@/store/useStore";

import { StorageService } from "@/services/StorageService";
import { IntegrationPlatform } from "@/utils/enums";
import { IDiscordModifiedCommunity, IPlatformProps } from "@/utils/interfaces";

import TcConnectedTelegram from "./TcConnectedTelegram";
import TcTelegramIntegrationDialog from "./TcTelegramIntegrationDialog";
import TcConnectPlatformButton from "../TcConnectPlatformButton";

interface TcTelegramIntegrationProps {
	isLoading: boolean;
	connectedPlatforms: IPlatformProps[];
	handleUpdateCommunityPlatform: () => void;
}

function TcTelegram({
	isLoading,
	connectedPlatforms,
	handleUpdateCommunityPlatform,
}: TcTelegramIntegrationProps) {
	const router = useRouter();
	const { telegram, generateToken } = useAppStore();
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const communityId =
		StorageService.readLocalStorage<IDiscordModifiedCommunity>("community")?.id;

	const handleConnectPlatform = async () => {
		try {
			await generateToken({
				type: "telegram_verification",
				communityId: communityId as string,
			});

			setIsDialogOpen(true);
		} catch (error) {
			console.error("Failed to generate token:", error);
		}
	};

	const handleClose = () => {
		setIsDialogOpen(false);
		router.push('/community-settings/?managePlatform=telegram')
	};

	return (
		<div className="flex items-center space-x-3 rounded-sm bg-secondary bg-opacity-5 p-5">
			<TcConnectPlatformButton
				platform={IntegrationPlatform.Telegram}
				connectedPlatforms={connectedPlatforms}
				handleConnectPlatform={handleConnectPlatform}
			/>
			{isLoading ? (
				<CircularProgress size={30} />
			) : (
				<TcConnectedTelegram
					platforms={connectedPlatforms}
					handleUpdateCommunityPlatform={handleUpdateCommunityPlatform}
				/>
			)}

			<TcTelegramIntegrationDialog
				isOpen={isDialogOpen}
				handleClose={handleClose}
				telegram={telegram}
				generateToken={handleConnectPlatform}
				handleUpdateCommunityPlatform={handleUpdateCommunityPlatform}
			/>
		</div>
	);
}

export default TcTelegram;
