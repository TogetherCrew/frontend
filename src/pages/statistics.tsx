/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { AiOutlineLeft } from "react-icons/ai";

import SwitchPlatform from "@/components/layouts/SwitchPlatform";

import { PREMIUM_GUILDS } from "@/configs";

import { availablePlatforms } from ".";
import emptyState from "../assets/svg/empty-state.svg";
import CustomTab from "../components/global/CustomTab";
import EmptyState from "../components/global/EmptyState";
import Link from "../components/global/Link";
import SimpleBackdrop from "../components/global/LoadingBackdrop";
import SEO from "../components/global/SEO";
import ActiveMembersComposition from "../components/pages/statistics/ActiveMembersComposition";
import DisengagedMembersComposition from "../components/pages/statistics/DisengagedMembersComposition";
import InactiveMembers from "../components/pages/statistics/InactiveMembers";
import InteractionsSection from "../components/pages/statistics/InteractionsSection";
import Onboarding from "../components/pages/statistics/Onboarding";
import { useToken } from "../context/TokenContext";
import { transformToMidnightUTC } from "../helpers/momentHelper";
import { defaultLayout } from "../layouts/defaultLayout";
import useAppStore from "../store/useStore";
import { withRoles } from "../utils/withRoles";

const Statistics = () => {
	const { community, selectedPlatform } = useToken();
	const router = useRouter();

	const platform = community?.platforms.find(
		(platform) => platform.id === selectedPlatform,
	);

	const isPremiumGuild: boolean = Boolean(
		platform?.metadata?.id && PREMIUM_GUILDS.includes(platform.metadata.id),
	);

	const tabMap: { [key: string]: string } = {
		activeMembers: "1",
		disengagedMembers: "2",
	};

	const reverseTabMap: { [key: string]: string } = {
		"1": "activeMembers",
		"2": "disengagedMembers",
	};

	const [activePlatform, setActivePlatform] = useState<
		"discord" | "discourse" | "telegram"
	>(
		community?.platforms.find((platform) => platform.id === selectedPlatform)
			?.name as "discord" | "discourse" | "telegram",
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [activeMemberDate, setActiveMemberDate] = useState(1);
	const [onBoardingMemberDate, setOnBoardingMemberDate] = useState(1);
	const [activeInteractionDate, setActiveInteractionDate] = useState(1);
	const [disengagedMemberDate, setDisengagedMemberDate] = useState(1);
	const [inactiveMembersDate, setInactiveMembersDate] = useState(1);
	const {
		fetchInteractions,
		fetchActiveMembers,
		fetchDisengagedMembers,
		fetchInactiveMembers,
		fetchOnboardingMembers,
	} = useAppStore();

	const [activeTab, setActiveTab] = useState<string>(
		tabMap[router.query.tab as string] || "1",
	);

	useEffect(() => {
		const platform = community?.platforms.find(
			(platform) => platform.id === selectedPlatform,
		);
		if (platform?.name === "discord") {
			setActivePlatform("discord");
		} else if (platform?.name === "discourse") {
			setActivePlatform("discourse");
		} else if (platform?.name === "telegram") {
			setActivePlatform("telegram");
		}
	}, [selectedPlatform]);

	useEffect(() => {
		if (!router.isReady) return;

		const handleRouteChange = () => {
			setActiveTab(tabMap[router.query.tab as string] || "1");
		};

		handleRouteChange();

		router.events.on("routeChangeComplete", handleRouteChange);

		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.isReady, router.query.tab]);

	const handleTabChange = (
		event: React.SyntheticEvent,
		newValue: string,
	): void => {
		if (newValue in reverseTabMap) {
			const urlTabIdentifier = reverseTabMap[newValue];
			router.push(`/statistics?tab=${urlTabIdentifier}`, undefined, {
				shallow: true,
			});
		}
	};

	useEffect(() => {
		const platform = community?.platforms.find(
			(platform) => platform.id === selectedPlatform,
		);

		const fetchData = async () => {
			try {
				if (!platform?.id) {
					return;
				}

				setLoading(true);

				if (activeTab === "1") {
					const activeDateRange = getDateRange(activeMemberDate);
					const onBoardingMemberDateRange = getDateRange(onBoardingMemberDate);
					const activeIntegrationDateRange = getDateRange(
						activeInteractionDate,
					);

					await fetchActiveMembers(
						platform?.id,
						activeDateRange[0],
						activeDateRange[1],
					);

					await fetchInteractions(
						platform?.id,
						activeIntegrationDateRange[0],
						activeIntegrationDateRange[1],
						platform.name.includes("discourse") ? "discourse" : "discord",
					);
					await fetchOnboardingMembers(
						platform?.id,
						onBoardingMemberDateRange[0],
						onBoardingMemberDateRange[1],
					);
				} else {
					const disengagedDateRange = getDateRange(disengagedMemberDate);
					const inactiveMemberDateRange = getDateRange(inactiveMembersDate);

					await fetchDisengagedMembers(
						platform?.id,
						disengagedDateRange[0],
						disengagedDateRange[1],
					);
					await fetchInactiveMembers(
						platform?.id,
						inactiveMemberDateRange[0],
						inactiveMemberDateRange[1],
					);
				}

				setLoading(false);
			} catch (error) {
				setLoading(false);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [selectedPlatform, activeTab]);

	useEffect(() => {
		if (!platform?.id) {
			return;
		}

		const activeDateRange = getDateRange(activeMemberDate);
		fetchActiveMembers(platform?.id, activeDateRange[0], activeDateRange[1]);
	}, [activeMemberDate]);

	useEffect(() => {
		if (!platform?.id) {
			return;
		}

		const onBoardingMemberDateRange = getDateRange(onBoardingMemberDate);

		fetchOnboardingMembers(
			platform?.id,
			onBoardingMemberDateRange[0],
			onBoardingMemberDateRange[1],
		);
	}, [selectedPlatform, onBoardingMemberDate]);

	useEffect(() => {
		if (!platform?.id) {
			return;
		}

		const activeIntegrationDateRange = getDateRange(activeInteractionDate);

		fetchInteractions(
			platform?.id,
			activeIntegrationDateRange[0],
			activeIntegrationDateRange[1],
			platform.name.includes("discourse") ? "discourse" : "discord",
		);
	}, [selectedPlatform, activeInteractionDate]);

	useEffect(() => {
		if (!platform?.id) {
			return;
		}

		const disengagedDateRange = getDateRange(disengagedMemberDate);

		fetchDisengagedMembers(
			platform?.id,
			disengagedDateRange[0],
			disengagedDateRange[1],
		);
	}, [selectedPlatform, disengagedMemberDate]);

	useEffect(() => {
		if (!platform?.id) {
			return;
		}

		const inactiveMemberDateRange = getDateRange(inactiveMembersDate);

		fetchInactiveMembers(
			platform?.id,
			inactiveMemberDateRange[0],
			inactiveMemberDateRange[1],
		);
	}, [selectedPlatform, inactiveMembersDate]);

	const getDateRange = (dateRangeType: number): string[] => {
		let endDate: moment.Moment = moment().subtract(1, "day");
		let startDate: moment.Moment = moment(endDate).subtract(7, "days");

		switch (dateRangeType) {
			case 1:
				startDate = moment(endDate).subtract(7, "days");
				endDate = moment().subtract(1, "day");
				break;
			case 2:
				startDate = moment(endDate).subtract(1, "months");
				endDate = moment().subtract(1, "day");
				break;
			case 3:
				startDate = moment(endDate).subtract(3, "months");
				endDate = moment().subtract(1, "day");
				break;
			case 4:
				startDate = moment(endDate).subtract(6, "months");
				endDate = moment().subtract(1, "day");
				break;
			case 5:
				startDate = moment(endDate).subtract(1, "year");
				endDate = moment().subtract(1, "day");
				break;
			default:
				break;
		}

		return [
			transformToMidnightUTC(startDate).toString(),
			transformToMidnightUTC(endDate).toString(),
		];
	};

	const handleActiveMembersDateRange = (dateRangeType: number) => {
		setActiveMemberDate(dateRangeType);
	};

	const handleOnboardingMembersDate = (dateRangeType: number) => {
		setOnBoardingMemberDate(dateRangeType);
	};

	const handleActiveInteractionDate = (dateRangeType: number) => {
		setActiveInteractionDate(dateRangeType);
	};

	const handleDisengagedMemberDateRange = (dateRangeType: number) => {
		setDisengagedMemberDate(dateRangeType);
	};

	const handleInactiveMemberDateRange = (dateRangeType: number) => {
		setInactiveMembersDate(dateRangeType);
	};

	const hasActivePlatform = community?.platforms?.some(
		({ name, disconnectedAt }) =>
			availablePlatforms.includes(name) && disconnectedAt === null,
	);

	useEffect(() => {
		const scrollToHash = () => {
			const hash = window.location.hash.replace("#", "");
			if (!hash) return;

			const interval = setInterval(() => {
				const targetElement = document.getElementById(hash);
				if (targetElement) {
					clearInterval(interval);
					targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
				}
			}, 100);

			setTimeout(() => clearInterval(interval), 3000);
		};

		scrollToHash();

		window.addEventListener("hashchange", scrollToHash);

		return () => {
			window.removeEventListener("hashchange", scrollToHash);
		};
	}, [router.asPath]);

	if (!hasActivePlatform) {
		return (
			<>
				<SEO />
				<EmptyState image={<Image alt="Image Alt" src={emptyState} />} />
			</>
		);
	}

	if (loading) {
		return <SimpleBackdrop />;
	}

	return (
		<>
			<SEO
				titleTemplate={
					activeTab === "1" ? "Active Members" : "Disengaged Members"
				}
			/>
			<div className="container flex flex-col justify-between px-4 py-3 md:px-12">
				<Stack
					direction={{ xs: "column", md: "row" }}
					justifyContent="space-between"
					alignItems={{ xs: "flex-start", md: "center" }}
					gap={2}
					pb={2}
				>
					<Stack direction="row" alignItems="center" gap={2}>
						<Link to="/">
							<div className="flex items-center whitespace-nowrap text-base text-gray-subtitle hover:text-black">
								<AiOutlineLeft />
								<span className="pl-1">Community Insights</span>
							</div>
						</Link>
						<SwitchPlatform />
					</Stack>
				</Stack>
				<CustomTab
					activeTab={activeTab}
					onTabChange={handleTabChange}
					labels={["Active members", "Disengaged members"]}
					content={[
						<div className="flex flex-col space-y-4">
							<Box
								id="activeMembers"
								sx={{
									typography: "body5",
									borderRadius: "0px 14px 14px 14px;",
								}}
								className="rounded-md p-6 shadow-lg bg-base-100"
							>
								<ActiveMembersComposition
									platformType={activePlatform}
									activePeriod={activeMemberDate}
									isPremiumGuild={isPremiumGuild}
									handleDateRange={handleActiveMembersDateRange}
								/>
							</Box>
							<Box
								id="onboardingMembers"
								sx={{
									typography: "body5",
									borderRadius: "0px 14px 14px 14px;",
								}}
								className="rounded-md p-6 shadow-lg bg-base-100"
							>
								<Onboarding
									platformType={activePlatform}
									activePeriod={onBoardingMemberDate}
									isPremiumGuild={isPremiumGuild}
									handleDateRange={handleOnboardingMembersDate}
								/>
							</Box>
							<Box
								id="interactions"
								sx={{
									typography: "body5",
									borderRadius: "0px 14px 14px 14px;",
								}}
								className="rounded-md p-6 shadow-lg bg-base-100"
							>
								<InteractionsSection
									activePeriod={activeInteractionDate}
									isPremiumGuild={isPremiumGuild}
									handleDateRange={handleActiveInteractionDate}
								/>
							</Box>
						</div>,
						<div className="flex flex-col space-y-4">
							<Box
								id="disengagedMembers"
								sx={{
									typography: "body5",
									borderRadius: "0px 14px 14px 14px;",
								}}
								className="rounded-md p-6 shadow-lg bg-base-100"
							>
								<DisengagedMembersComposition
									platformType={activePlatform}
									activePeriod={disengagedMemberDate}
									isPremiumGuild={isPremiumGuild}
									handleDateRange={handleDisengagedMemberDateRange}
								/>
							</Box>
							<Box
								id="inactiveMembers"
								sx={{
									typography: "body5",
									borderRadius: "0px 14px 14px 14px;",
								}}
								className="mb-4 p-6 shadow-lg bg-base-100"
							>
								<InactiveMembers
									activePeriod={inactiveMembersDate}
									isPremiumGuild={isPremiumGuild}
									handleDateRange={handleInactiveMemberDateRange}
								/>
							</Box>
						</div>,
					]}
				/>
			</div>
		</>
	);
};

Statistics.pageLayout = defaultLayout;

export default withRoles(Statistics, ["view", "admin"]);
