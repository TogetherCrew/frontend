import React, { useEffect, useState } from "react";
import { CircularProgress, Paper } from "@mui/material";
import moment from "moment";
import { useSearchParams } from "next/navigation";
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
import useAppStore from "../../../store/useStore";
import { IPlatformProps } from "../../../utils/interfaces";

interface TcGithubIntegrationProps {
	isLoading: boolean;
	connectedPlatforms: IPlatformProps[];
	handleUpdateCommunityPlatform: () => void;
}

function TcGithubIntegration({
	isLoading,
	connectedPlatforms,
	handleUpdateCommunityPlatform,
}: TcGithubIntegrationProps) {
	const searchParams = useSearchParams();
	const { connectNewPlatform, deletePlatform } = useAppStore();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

	const addPlatform = searchParams.get("addPlatform");

	useEffect(() => {
		if (addPlatform === "github") {
			connectNewPlatform("github");
		}
	}, [addPlatform]);

	const { showMessage } = useSnackbar();

	const handleDisconnectDiscordIntegration = async (
		deleteType: "hard" | "soft",
	) => {
		try {
			const data = await deletePlatform({
				id: connectedPlatforms[0].id,
				deleteType,
			});
			if (data === "") {
				setIsDeleteDialogOpen(false);
				setIsOpen(false);
				showMessage("Platform disconnected successfully.", "success");
				handleUpdateCommunityPlatform();
			}
		} catch (error) { }
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<div className="flex items-center space-x-3 rounded-sm bg-secondary bg-opacity-5 p-5">
			<Paper className="flex h-[6rem] w-[10rem] flex-col items-center justify-center rounded-sm py-2 shadow-none">
				<span className="mx-auto">
					<TcCommunityPlatformIcon platform="Github" size={32} />
				</span>
				<div className="mx-auto w-10/12 text-center">
					<TcButton
						text="Connect"
						variant="text"
						color="primary"
						startIcon={<BiPlus />}
						onClick={() => connectNewPlatform("github")}
					/>
				</div>
			</Paper>
			{isLoading ? (
				<CircularProgress size={30} />
			) : (
				connectedPlatforms &&
				connectedPlatforms[0]?.name === "github" &&
				connectedPlatforms.map((platform, index) => (
					<Paper
						className="flex h-[6rem] w-[10rem] flex-col items-center justify-center space-y-1.5 overflow-hidden rounded-sm py-2 shadow-none"
						key={index}
					>
						<TcAvatar
							src={platform?.metadata?.account?.avatarUrl}
							sx={{ width: 32, height: 32 }}
						/>
						<TcButton
							text={truncateCenter(platform?.metadata?.account?.login, 10)}
							className="w-10/12"
							variant="text"
							color="primary"
							startIcon={<IoSettingsSharp />}
							onClick={() => setIsOpen(true)}
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
				onClose={handleClose}
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
							<TcCommunityPlatformIcon platform="Github" />
							<div>
								<TcText
									text="Github Account Profile"
									variant="h6"
									fontWeight="bold"
								/>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<TcAvatar
								sizes="small"
								src={connectedPlatforms[0]?.metadata?.account?.avatarUrl}
							/>
							<div>
								<TcText
									text={connectedPlatforms[0]?.metadata?.account?.login}
									variant="h6"
									fontWeight="bold"
								/>
								<TcText
									text={`Connected At: ${moment(
										connectedPlatforms[0]?.connectedAt,
									).format("D MMM YYYY")}`}
									variant="body2"
								/>
							</div>
						</div>
					</div>
					<TcButton
						startIcon={<MdDelete />}
						text="Disconnect"
						variant="outlined"
						onClick={() => setIsDeleteDialogOpen(true)}
					/>
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
						<TcText
							text="Are you sure you want to disconnect Github Account?"
							variant="h6"
						/>
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
								onClick={() => handleDisconnectDiscordIntegration("hard")}
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
								onClick={() => handleDisconnectDiscordIntegration("soft")}
							/>
						</div>
					</div>
				</div>
			</TcDialog>
		</div>
	);
}

export default TcGithubIntegration;
