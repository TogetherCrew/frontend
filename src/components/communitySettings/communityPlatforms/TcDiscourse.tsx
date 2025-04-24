import React, { useEffect, useState } from "react";
import {
	Alert,
	AlertTitle,
	CircularProgress,
	FormControl,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";
import { IoClose, IoSettingsSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

import TcAvatar from "@/components/shared/TcAvatar";
import TcButton from "@/components/shared/TcButton";
import TcDialog from "@/components/shared/TcDialog";
import TcText from "@/components/shared/TcText";

import useAppStore from "@/store/useStore";

import { useSnackbar } from "@/context/SnackbarContext";
import { useToken } from "@/context/TokenContext";
import { truncateCenter } from "@/helpers/helper";
import { IPlatformProps } from "@/utils/interfaces";

import TcCommunityPlatformIcon from "./TcCommunityPlatformIcon";

interface TcDiscourseProps {
	isLoading: boolean;
	connectedPlatforms: IPlatformProps[];
	handleUpdateCommunityPlatform: () => void;
}

function TcDiscourse({
	isLoading,
	connectedPlatforms,
	handleUpdateCommunityPlatform,
}: TcDiscourseProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { createNewPlatform, deletePlatform } = useAppStore();
	const [activePlatform, setActivePlatform] = useState<IPlatformProps | null>(
		null,
	);
	const [url, setUrl] = useState<string>("");
	const [urlError, setUrlError] = useState<string>("");
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isCreatePlatformLoading, setIsCreatePlatformLoading] =
		useState<boolean>(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);


	useEffect(() => {
		const addPlatform = searchParams?.get("addPlatform");
		if (addPlatform === "discourse") {
			handleOpenDialog();
		}
	}, [searchParams]);

	const { showMessage } = useSnackbar();

	const { community } = useToken();

	const handleCreateNewPlatform = async () => {
		try {
			setIsCreatePlatformLoading(true);

			const transformedUrl = url
				.replace(/\/+$/, "")
				.replaceAll("https://", "")
				.replaceAll("http://", "");

			const data = await createNewPlatform({
				community: community?.id,
				name: "discourse",
				metadata: {
					id: transformedUrl,
					period: new Date(
						new Date().setDate(new Date().getDate() - 90),
					).toISOString(),
					analyzerStartedAt: new Date().toISOString(),
					resources: [],
				},
			});
			if (data) {
				handleUpdateCommunityPlatform();
				setIsOpen(false);
				setUrl("");
				showMessage("Platform connected successfully.", "success");
			}
		} catch (error) {
		} finally {
			setIsCreatePlatformLoading(false);
		}
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

	const handleOpenDialog = (platform: IPlatformProps | null = null) => {
		setActivePlatform(platform);
		setUrl(platform?.metadata?.id || "");
		setIsOpen(true);
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
		router.push("/community-settings/?managePlatform=discourse");
	};

	return (
		<div className="flex items-center space-x-3 rounded-sm bg-secondary bg-opacity-5 p-5">
			<Paper className="flex h-[6rem] w-[10rem] flex-col items-center justify-center rounded-sm py-2 shadow-none">
				<span className="mx-auto">
					<TcCommunityPlatformIcon platform="Discourse" size={32} />
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
				connectedPlatforms[0]?.name === "discourse" &&
				connectedPlatforms.map((platform, index) => (
					<Paper
						className="flex h-[6rem] w-[10rem] flex-col items-center justify-center space-y-1.5 overflow-hidden rounded-sm py-2 shadow-none"
						key={index}
					>
						<TcAvatar src={platform?.metadata?.icon} sx={{ width: 32, height: 32 }} />
						<TcButton
							text={truncateCenter(platform?.metadata?.id, 14)}
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
				onClose={handleClose}
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
							<TcCommunityPlatformIcon platform="Discourse" />
							<div>
								<TcText
									text="Discourse Account Profile"
									variant="h6"
									fontWeight="bold"
								/>
							</div>
						</div>
						{activePlatform ? (
							<>
								<div className="flex flex-col space-y-3 px-1">
									<div className="flex items-center space-x-3">
										<TcText
											text="Discourse URL:"
											variant="body1"
											fontWeight="bold"
										/>
										<TcText
											text={`${activePlatform.metadata.id}`}
											variant="body1"
										/>
									</div>
									<div className="flex items-center space-x-3">
										<TcText
											text="Analyzer started at:"
											variant="body1"
											fontWeight="bold"
										/>
										<TcText
											text={`${moment(activePlatform.metadata.analyzerStartedAt).format("DD MMM YYYY HH:mm")}`}
											variant="body1"
										/>
									</div>
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
							<>
								<Alert severity="info" className="my-2 rounded-sm">
									<AlertTitle>Analyzing Your Community Data</AlertTitle>
									<Typography variant="body2">
										We're currently analyzing 90 days of your community's data.
										This process may take up to 6 hours. Once the analysis is
										complete, you will receive a message on Discord.
									</Typography>
								</Alert>
								<FormControl variant="filled" fullWidth size="medium">
									<TextField
										label="Discourse URL"
										variant="filled"
										placeholder="example.org"
										autoComplete="off"
										value={url}
										onChange={handleUrlChange}
										error={!!urlError}
										helperText={
											urlError ||
											"The base URL of your discourse, for example https://example.org"
										}
									/>
								</FormControl>
							</>
						)}
					</div>
					{!activePlatform && (
						<div className="px-5">
							<div className="flex items-center justify-between">
								<TcButton
									className="w-1/3"
									text="Cancel"
									variant="outlined"
									onClick={() => setIsOpen(false)}
								/>
								<TcButton
									className="w-1/3"
									text={isCreatePlatformLoading ? "Confirming..." : "Confirm"}
									variant="contained"
									disabled={!!urlError || !url || isCreatePlatformLoading}
									onClick={handleCreateNewPlatform}
								/>
							</div>
							<Typography variant="body1" pt={2} color="textSecondary">
								Need help? View our{" "}
								<a
									href="https://togethercrew.gitbook.io/onboarding/fundamentals/adding-platforms/discourse"
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
					<div className="flex flex-col justify-between space-y-4 pb-8 md:flex-row md:space-x-5 md:space-y-0 md:py-12">
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

export default TcDiscourse;
