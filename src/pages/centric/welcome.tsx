import React from "react";
import {
	Alert,
	Box,
	Button,
	Chip,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FaCaretUp } from "react-icons/fa";
import { FaDatabase, FaStore } from "react-icons/fa";
import { FaHashtag } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";

import TcCommunityPlatformIcon from "@/components/communitySettings/communityPlatforms/TcCommunityPlatformIcon";
import SEO from "@/components/global/SEO";
import DatasourceList from "@/components/home/datasources/DatasourceList";

import useAppStore from "@/store/useStore";

import { useSnackbar } from "@/context/SnackbarContext";
import { useToken } from "@/context/TokenContext";
import {
	setAmplitudeUserIdFromToken,
	trackAmplitudeEvent,
} from "@/helpers/amplitudeHelper";
import { defaultLayout } from "@/layouts/defaultLayout";
import { withRoles } from "@/utils/withRoles";

const DATA_SOURCES = [
	{ title: "Discord", isComingSoon: false },
	{ title: "Telegram", isComingSoon: false },
	{ title: "Website", isComingSoon: false },
	{ title: "Discourse", isComingSoon: false },
	{ title: "Github", isComingSoon: false },
	{ title: "Notion", isComingSoon: false },
	{ title: "MediaWiki", isComingSoon: false },
	{ title: "X", isComingSoon: true },
	{ title: "Snapshot", isComingSoon: true },
	{ title: "Google", isComingSoon: true },
	{ title: "Gitbook", isComingSoon: true },
];

const APPLICATION_MARKETPLACES = [
	{
		icon: <IoStatsChart />,
		title: "Analytics",
		description:
			"Master your community's engagement with detailed insights. Monitor active vs. inactive members, identify new joiners and those disengaging, track participation across user groups, and identify your most valuable contributors.",
		isManageable: true,
		isOpenable: true,
	},
	{
		icon: <IoStatsChart />,
		title: "Announcements",
		description:
			"Take control of your announcements and communication with members. Send targeted messages to specific types of member based on their roles or engagement levels. Schedule announcements in advance and even reach disengaged members with (safe) DMs.",
		isManageable: false,
		isOpenable: true,
	},
	{
		icon: <IoStatsChart />,
		title: "Ai Assistance",
		description:
			"24/7 Q&A support for your community. Our AI assistant uses your connected data sources to answer member questions instantly, freeing you to focus on strategic tasks while ensuring consistent, reliable member support.",
		isManageable: true,
		isOpenable: false,
	},
	{
		icon: <FaHashtag />,
		title: "Reputation",
		description:
			"Create a culture of genuine participation with our intelligent Reputation Score system. Automatically measure authentic community involvement, while ensuring the system remains fair and resistant to manipulation.",
		isManageable: true,
		isOpenable: true,
	},
	{
		icon: <IoStatsChart />,
		title: "Community Guardian",
		description:
			"Keep your community safe with automatic detection of violent language and community guidelines violations. Our AI ensures credible neutrality, keeping your moderators safe and your standards objective.",
		isManageable: true,
		isOpenable: false,
	},
	{
		icon: <IoStatsChart />,
		title: "Coming Soon",
		description:
			"Vote on upcoming features and shape our roadmap. Your input directly influences our development priorities, ensuring we build what matters most to you.",
		isManageable: false,
		isOpenable: false,
	},
];

interface IDataSources {
	title: string;
	isComingSoon: boolean;
}

function Welcome() {
	const userPermissions = useAppStore(
		(state) => state.userRolePermissions || [],
	);
	const router = useRouter();
	const { community } = useToken();
	const { showMessage } = useSnackbar();

	const platformNames =
		community?.platforms?.map((platform) => platform.name) || [];

	const isAdmin = userPermissions.includes("admin");

	const handleUpvote = (dataSource: string) => () => {
		try {
			setAmplitudeUserIdFromToken();

			trackAmplitudeEvent({
				eventType: "Upvote Data Source",
				eventProperties: {
					communityId: community?.id,
					communityName: community?.name,
					platform: dataSource,
				},
			});
			showMessage(
				`Thank you for upvoting ${dataSource}! We will consider adding it soon.`,
				"success",
			);
		} catch (e) {
			console.error(e);
		}
	};

	const handleOpenApplication = (application: string) => () => {
		setAmplitudeUserIdFromToken();

		trackAmplitudeEvent({
			eventType: "Open Application Marketplace",
			eventProperties: {
				communityId: community?.id,
				communityName: community?.name,
				platform: application,
			},
		});

		switch (application) {
			case "Analytics":
				router.push("/");
				break;
			case "Announcements":
				router.push("/announcements");
				break;
			case "Ai Assistance":
				router.push("/community-settings/ai-assistant/");
				break;
			case "Reputation":
				router.push("/reputation-score/");
				break;
			case "Community Guardian":
				router.push("/community-settings/violation-detection/");
				break;
			case "Coming Soon":
				showMessage("This application is coming soon!", "info");
				break;
			default:
				break;
		}
	};

	const handleManageApplication = (application: string) => () => {
		setAmplitudeUserIdFromToken();

		trackAmplitudeEvent({
			eventType: "Manage Application Marketplace",
			eventProperties: {
				communityId: community?.id,
				communityName: community?.name,
				platform: application,
			},
		});

		switch (application) {
			case "Analytics":
				router.push("/community-settings/");
				break;
			case "Announcements":
				router.push("/announcements");
				break;
			case "Ai Assistance":
				router.push("/community-settings/ai-assistant/");
				break;
			case "Reputation":
				router.push("/community-settings/reputation-score/");
				break;
			case "Community Guardian":
				router.push("/community-settings/violation-detection/");
				break;
			case "Coming Soon":
				showMessage("This application is coming soon!", "info");
				break;
			default:
				break;
		}
	};

	const handleOpenForum = () => {
		setAmplitudeUserIdFromToken();

		trackAmplitudeEvent({
			eventType: "Coming Soon Forum",
			eventProperties: {
				communityId: community?.id,
				communityName: community?.name,
			},
		});
		window.open("https://tally.so/r/m6WNE5", "_blank");
	};

	return (
		<div className="h-screen bg-gray-100">
			<SEO title="Home" />
			<Grid
				container
				direction="row"
				sx={{
					mx: "auto",
					px: {
						xs: 2,
						md: 12,
					},
					pb: 2,
					gap: 1,
				}}
			>
				<Grid item xs={12} pb={2}>
					<h2 className="text-2xl font-semibold py-4">
						Welcome to <b className="text-secondary">{community?.name}</b>
					</h2>
					{!isAdmin && (
						<Alert
							className="flex w-full justify-start rounded-md"
							severity="warning"
						>
							<b>Add/Manage</b> community <b>Data-sources/Applications</b> needs
							admin permissions. please contact your admin to get access.
						</Alert>
					)}
				</Grid>
				<Grid container direction="row" spacing={2}>
					<Grid
						item
						xs={12}
						md={6}
						pr={{
							md: 2,
						}}
					>
						<DatasourceList datasources={DATA_SOURCES} />
					</Grid>

					<Grid item xs={12} md={6}>
						<Stack direction="row" alignItems="center" gap={1}>
							<FaStore size={24} />
							<Typography variant="h6" fontWeight="500">
								Application Marketplace
							</Typography>
						</Stack>

						<Grid container direction="row" spacing={2} mt={1}>
							{APPLICATION_MARKETPLACES.map((application) => (
								<Grid item xs={12} md={6} key={application.title}>
									<Paper
										elevation={0}
										sx={{
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
											minWidth: "100%",
											maxWidth: 120,
											px: 1,
											py: 1,
											boxShadow: 1,
											borderRadius: 2,
											minHeight: "250px",
										}}
										className="space-y-3"
									>
										<div>
											<Stack direction="row" alignItems="center" gap={1}>
												<Box>{application.icon}</Box>
												<Typography variant="body1" fontWeight="600">
													{application.title}
												</Typography>
											</Stack>
											<Typography variant="body2" color="GrayText">
												{application.description}
											</Typography>
										</div>
										<div>
											<Stack direction="row" gap={1}>
												{application.isOpenable && (
													<Button
														variant="contained"
														fullWidth
														disableElevation
														onClick={handleOpenApplication(application.title)}
														disabled={
															!isAdmin && application.title === "Announcements"
														}
													>
														Open
													</Button>
												)}
												{application.isManageable && (
													<Button
														variant="outlined"
														fullWidth
														disableElevation
														onClick={handleManageApplication(application.title)}
														disabled={!isAdmin}
													>
														Manage
													</Button>
												)}
											</Stack>
											{!application.isOpenable && !application.isManageable && (
												<Button
													variant="contained"
													fullWidth
													disableElevation
													onClick={handleOpenForum}
												>
													Vote
												</Button>
											)}
										</div>
									</Paper>
								</Grid>
							))}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
}

Welcome.pageLayout = defaultLayout;

export default withRoles(Welcome, ["admin", "view"]);
