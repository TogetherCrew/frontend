import React, { useEffect, useState } from "react";
import {
	Alert,
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCopy } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

import useAppStore from "@/store/useStore";

import { useSnackbar } from "@/context/SnackbarContext";
import { isProduction } from "@/rainbowKitConfig";
import { StorageService } from "@/services/StorageService";
import { IntegrationPlatform } from "@/utils/enums";

import TcCommunityPlatformIcon from "../TcCommunityPlatformIcon";

interface TcTelegramIntegrationDialogProps {
	isOpen: boolean;
	handleClose: () => void;
	telegram: {
		value: string | null;
		expiresAt: string | null;
	};
	generateToken: () => void;
	handleUpdateCommunityPlatform: () => void;
}

const TcTelegramIntegrationDialog: React.FC<
	TcTelegramIntegrationDialogProps
> = ({
	isOpen,
	handleClose,
	telegram,
	generateToken,
	handleUpdateCommunityPlatform,
}) => {
		const router = useRouter();
		const { retrieveCommunityById } = useAppStore();
		const searchParams = useSearchParams();

		const { showMessage } = useSnackbar();
		const [timeLeft, setTimeLeft] = useState(0);
		const [isExpired, setIsExpired] = useState(false);
		const [hasActiveTelegram, setHasActiveTelegram] = useState<boolean>(false);

		useEffect(() => {
			const addPlatform = searchParams?.get("addPlatform");
			if (addPlatform === "telegram") {
				generateToken();
			}
		}, [searchParams]);

		useEffect(() => {
			let interval: NodeJS.Timeout | null = null;

			if (isOpen) {
				const fetchCommunityData = async () => {
					const storedCommunity: any =
						StorageService.readLocalStorage("community");
					if (storedCommunity?.id) {
						try {
							const community = await retrieveCommunityById(storedCommunity.id);
							const hasTelegramPlatform = community.platforms.some(
								(platform: { name: string }) => platform.name === "telegram",
							);

							setHasActiveTelegram(hasTelegramPlatform);
						} catch (error) {
							console.error("Error fetching community data:", error);
						}
					}
				};

				fetchCommunityData();
				interval = setInterval(fetchCommunityData, 5000);
			} else {
				if (interval) clearInterval(interval);
			}

			return () => {
				if (interval) clearInterval(interval);
			};
		}, [isOpen, retrieveCommunityById]);

		useEffect(() => {
			if (hasActiveTelegram) {
				showMessage("Telegram platform connected successfully!", "success");
				handleUpdateCommunityPlatform();
				handleClose();
				router.push("/community-settings/?managePlatform=telegram");
			}
		}, [hasActiveTelegram]);

		useEffect(() => {
			if (!isOpen || !telegram.expiresAt) {
				setTimeLeft(0);
				setIsExpired(true);
				return;
			}

			const expiresAtTime = new Date(telegram.expiresAt).getTime();
			const interval = setInterval(() => {
				const currentTime = Date.now();
				const remainingTime = Math.max(
					0,
					Math.floor((expiresAtTime - currentTime) / 1000),
				);
				setTimeLeft(remainingTime);

				if (remainingTime <= 0) {
					setIsExpired(true);
					clearInterval(interval);
				} else {
					setIsExpired(false);
				}
			}, 1000);

			return () => clearInterval(interval);
		}, [isOpen, telegram.expiresAt]);

		const formatTime = (seconds: number) => {
			const minutes = Math.floor(seconds / 60);
			const secs = seconds % 60;
			return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
		};

		const handleCopyToken = () => {
			if (telegram.value) {
				navigator.clipboard.writeText(`/verify ${telegram.value}`);
				showMessage("Token copied to clipboard!", "success");
			} else {
				showMessage("No token available to copy.", "error");
			}
		};

		return (
			<Dialog
				open={isOpen}
				onClose={handleClose}
				fullWidth
				sx={{
					"& .MuiDialog-container": {
						"& .MuiPaper-root": {
							borderRadius: "10px",
						},
					},
				}}
			>
				<DialogTitle
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						p: 2,
					}}
				>
					<Stack direction="row" alignItems="center" gap={1}>
						<TcCommunityPlatformIcon platform={IntegrationPlatform.Telegram} />
						<Typography variant="h6" fontWeight="bold">
							Add a Telegram Group
						</Typography>
					</Stack>
					<IconButton onClick={handleClose} aria-label="Close dialog">
						<IoClose size={30} />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					<Stack spacing={2}>
						<Stack spacing={1}>
							<Alert severity="warning" sx={{ borderRadius: 1 }}>
								<b>Note:</b> Activity in your telegram group will be analysed from
								the moment you complete this setup. Previous activity can not be
								analysed.
							</Alert>
							<Typography variant="body1" className="font-bold">
								Step 1: Add the bot
							</Typography>
							<Alert
								severity="info"
								sx={{
									borderRadius: 1,
								}}
							>
								To add the bot, you must have the <b>"Add New Admins"</b>{" "}
								privilege.
							</Alert>
							<Stack pl={2}>
								<ol className="list-decimal">
									<li>
										Add{" "}
										<b className="text-secondary">
											{isProduction
												? "@TogetherCrewBot"
												: "@TogetherCrewStagingBot"}
										</b>{" "}
										to your telegram group or channel.
									</li>
									<li>
										Find the bot in your list of members and right click then
										select <b>promote to admin</b>, then remove all permissions.
										If the promote to admin option doesn't show: go to group
										settings (click on group, then pencil icon on top right
										corner). Then click on administrators, add the bot, and
										disable all admin permissions for the bot. (no need to save).
									</li>
									<li>
										In the chat of your telegram group, copy the command below to
										verify the bot.
									</li>
								</ol>
							</Stack>
						</Stack>
						<Stack spacing={1}>
							<Typography variant="body1" className="font-bold">
								Step 2: Verify your group
							</Typography>
							<Typography>In your Telegram group, enter the command:</Typography>
							<TextField
								variant="outlined"
								value={`/verify ${telegram.value || ""}`}
								size="small"
								sx={{
									"& .MuiOutlinedInput-root": {
										borderRadius: 2,
										backgroundColor: "#EDEDED",
										maxWidth: 300,
									},
								}}
								InputProps={{
									readOnly: true,
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="copy verification token"
												size="small"
												onClick={handleCopyToken}
												disabled={!telegram.value}
											>
												<FiCopy />
											</IconButton>
										</InputAdornment>
									),
								}}
							/>

							{isExpired ? (
								<Alert
									severity="error"
									sx={{
										borderRadius: 1,
									}}
								>
									<b>Error:</b> Your token has expired. Please generate a new
									token.
								</Alert>
							) : (
								<Alert
									severity="warning"
									sx={{
										borderRadius: 1,
									}}
								>
									<b>Note:</b> Your token is valid for{" "}
									<b>{formatTime(timeLeft)}</b>.
								</Alert>
							)}
						</Stack>
						<Stack spacing={1}>
							{isExpired ? (
								<Button
									variant="outlined"
									color="primary"
									fullWidth
									disableElevation
									onClick={generateToken}
								>
									Generate New Token
								</Button>
							) : (
								<Button
									variant="contained"
									color="primary"
									fullWidth
									disableElevation
									sx={{
										mb: 1,
									}}
									disabled
									startIcon={<CircularProgress size={16} color="inherit" />}
								>
									Pending Verification...
								</Button>
							)}
							<Typography variant="body1" color="textSecondary">
								Need help? View our{" "}
								<a
									href="https://togethercrew.gitbook.io/onboarding/fundamentals/adding-platforms/telegram"
									target="_blank"
									rel="noreferrer"
									className="text-secondary underline"
								>
									documentation
								</a>{" "}
								or contact our{" "}
								<a
									href="https://www.togethercrew.com/contact-us"
									target="_blank"
									rel="noreferrer"
									className="text-secondary underline"
								>
									support team
								</a>
								.
							</Typography>
						</Stack>
					</Stack>
				</DialogContent>
			</Dialog>
		);
	};

export default TcTelegramIntegrationDialog;
