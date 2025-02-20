import React, { useEffect, useState } from "react";
import { CircularProgress, FormControl, Paper, TextField } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";
import { IoClose, IoSettingsSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

import TcCommunityPlatformIcon from "./TcCommunityPlatformIcon";
import TcAvatar from "../../shared/TcAvatar";
import TcButton from "../../shared/TcButton";
import TcDialog from "../../shared/TcDialog";
import TcText from "../../shared/TcText";
import { useSnackbar } from "../../../context/SnackbarContext";
import { truncateCenter } from "../../../helpers/helper";
import { StorageService } from "../../../services/StorageService";
import useAppStore from "../../../store/useStore";
import {
	IDiscordModifiedCommunity,
	IPlatformProps,
} from "../../../utils/interfaces";

interface TcWebsiteProps {
	isLoading: boolean;
	connectedPlatforms: IPlatformProps[];
	handleUpdateCommunityPlatform: () => void;
}

function TcWebsite({
	isLoading,
	connectedPlatforms,
	handleUpdateCommunityPlatform,
}: TcWebsiteProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const addPlatform = searchParams.get("addPlatform");
	const { createNewPlatform, deletePlatform } = useAppStore();
	const [activePlatform, setActivePlatform] = useState<IPlatformProps | null>(
		null,
	);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [url, setUrl] = useState<string>("");
	const [urlError, setUrlError] = useState<string>("");
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

	const { showMessage } = useSnackbar();

	useEffect(() => {
		if (addPlatform === "website") {
			handleOpenDialog();
		}
	}, [addPlatform]);

	const communityId =
		StorageService.readLocalStorage<IDiscordModifiedCommunity>("community")?.id;

	const handleOpenDialog = (platform: IPlatformProps | null = null) => {
		setActivePlatform(platform);
		setUrl(platform?.metadata?.baseURL || "");
		setIsOpen(true);
	};

	const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setUrl(value);
		validateUrl(value);
	};

	const validateUrl = (value: string) => {
		const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*\.[^\s]{2,}([^\s]*)?$/i;
		if (!regex.test(value)) {
			setUrlError("Invalid URL. Please enter a valid site URL.");
		} else {
			setUrlError("");
		}
	};

	const handleCreateNewPlatform = async () => {
		const data = await createNewPlatform({
			community: communityId,
			name: "website",
			metadata: {
				resources: [url],
				// path: "",
			},
		});
		if (data) {
			handleUpdateCommunityPlatform();
			setIsOpen(false);
			setUrl("");
			showMessage("Platform connected successfully.", "success");
		}
	};

	const handleDisconnectPlatform = async (deleteType: "hard" | "soft") => {
		try {
			const data = await deletePlatform({ id: activePlatform?.id, deleteType });
			if (data === "") {
				setIsDeleteDialogOpen(false);
				setActivePlatform(null);
				setUrl("");
				showMessage("Platform disconnected successfully.", "success");
				handleUpdateCommunityPlatform();
			}
		} catch (error) {
			showMessage("Error disconnecting platform.", "error");
		}
	};

	const handleClose = () => {
		setIsOpen(false);
		router.push('/community-settings/?managePlatform=website')
	}

	return (
		<div className="flex items-center space-x-3 rounded-sm bg-secondary bg-opacity-5 p-5">
			<Paper className="flex h-[6rem] w-[10rem] flex-col items-center justify-center rounded-sm py-2 shadow-none">
				<span className="mx-auto">
					<TcCommunityPlatformIcon platform="Website" />
				</span>
				<div className="mx-auto w-10/12 text-center">
					<TcButton
						text="Connect"
						variant="text"
						color="primary"
						startIcon={<BiPlus />}
						onClick={() => handleOpenDialog()}
					/>
				</div>
			</Paper>
			{isLoading ? (
				<CircularProgress size={30} />
			) : (
				connectedPlatforms &&
				connectedPlatforms[0]?.name === "website" &&
				connectedPlatforms.map((platform, index) => (
					<Paper
						className="flex h-[6rem] w-[10rem] flex-col items-center justify-center space-y-1.5 overflow-hidden rounded-sm py-2 shadow-none"
						key={index}
					>
						<TcAvatar sizes="small">W</TcAvatar>
						<TcButton
							text={truncateCenter(platform?.metadata?.resources[0], 14)}
							className="w-10/12"
							variant="text"
							color="primary"
							startIcon={<IoSettingsSharp />}
							onClick={() => handleOpenDialog(platform)}
						/>
					</Paper>
				))
			)}
			<TcDialog
				open={isOpen}
				fullScreen={false}
				sx={{
					"& .MuiDialog-container": {
						"& .MuiPaper-root": {
							width: "100%",
							maxWidth: "640px",
							borderRadius: "10px",
						},
					},
				}}
			// onClick={handleClose}
			>
				<div className="flex flex-col p-5">
					<div className="absolute right-2 top-2">
						<IoClose
							size={30}
							className="cursor-pointer"
							onClick={handleClose}
						/>
					</div>
					<div className="space-y-3 p-4">
						<div className="flex flex-col md:flex-row md:items-center md:space-x-3">
							<TcCommunityPlatformIcon platform="Website" />
							<div>
								<TcText
									text="Website"
									variant="h6"
									fontWeight="bold"
								/>
							</div>
						</div>
						{activePlatform ? (
							<>
								<div className="flex items-center space-x-3">
									<TcText
										text="Website URL:"
										variant="body1"
										fontWeight="bold"
									/>
									<TcText
										text={`${activePlatform.metadata.resources[0]}`}
										variant="body1"
									/>
								</div>
								<div className="flex items-center justify-between">
									<TcButton
										fullWidth
										text="Disconnect"
										startIcon={<MdDelete />}
										variant="outlined"
										onClick={() => {
											setIsDeleteDialogOpen(true);
											setIsOpen(false);
										}}
									/>
								</div>
							</>
						) : (
							<FormControl variant="filled" fullWidth size="medium">
								<TextField
									label="Website URL"
									variant="filled"
									placeholder="https://example.org"
									value={url}
									onChange={handleUrlChange}
									error={!!urlError}
									helperText={
										urlError ||
										"The base URL of your website, for example https://example.org"
									}
								/>
							</FormControl>
						)}
					</div>
					{!activePlatform && (
						<div className="flex items-center justify-between px-5">
							<TcButton
								className="w-1/3"
								text="Cancel"
								variant="outlined"
								onClick={() => setIsOpen(false)}
							/>
							<TcButton
								className="w-1/3"
								text="Confirm"
								disabled={!!urlError || url === ""}
								variant="contained"
								onClick={handleCreateNewPlatform}
							/>
						</div>
					)}
				</div>
			</TcDialog>
			<TcDialog
				open={isDeleteDialogOpen}
				fullScreen={false}
				sx={{
					"& .MuiDialog-container": {
						"& .MuiPaper-root": {
							width: "100%",
							maxWidth: "640px",
							borderRadius: "10px",
						},
					},
				}}
			>
				<div className="flex justify-end p-4">
					<AiOutlineClose
						className="cursor-pointer"
						size={24}
						onClick={() => setIsDeleteDialogOpen(false)}
					/>
				</div>
				<div className="px-4 text-center md:px-8">
					<div className="mx-auto text-center md:w-4/5">
						<TcText text="Are you sure you want to disconnect?" variant="h6" />
					</div>
					<div className="flex flex-col justify-between space-y-4 pb-8 md:flex-row md:space-y-0 md:space-x-5 md:py-12">
						<div className="space-y-4 rounded-md px-4 py-6 shadow-xl">
							<TcText
								text="Disconnect and delete data"
								variant="body1"
								fontWeight="bold"
							/>
							<TcText
								className="text-left"
								text={
									<span>
										Importing new data will be stopped. Already imported and
										analyzed data <b>will be deleted.</b>
									</span>
								}
								variant="body2"
							/>
							<TcButton
								text="Disconnect and delete"
								variant="contained"
								className="w-full"
								onClick={() => handleDisconnectPlatform("hard")}
							/>
						</div>
						<div className="space-y-4 rounded-md px-4 py-6 shadow-xl">
							<TcText
								text="Disconnect only"
								variant="body1"
								fontWeight="bold"
							/>
							<TcText
								className="text-left"
								text={
									<span>
										Importing new data will be stopped. Already imported and
										analyzed data <b>will be kept.</b>
									</span>
								}
								variant="body2"
							/>
							<TcButton
								text="Disconnect"
								variant="contained"
								className="w-full"
								onClick={() => handleDisconnectPlatform("soft")}
							/>
						</div>
					</div>
				</div>
			</TcDialog>
		</div>
	);
}

export default TcWebsite;
