import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Paper, Tab, Tabs } from "@mui/material";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";

import TcCommunityPlatformIcon from "./TcCommunityPlatformIcon";
import TcDiscordIntgration from "./TcDiscordIntgration";
import TcDiscourse from "./TcDiscourse";
import TcGdriveIntegration from "./TcGdriveIntegration";
import TcGithubIntegration from "./TcGithubIntegration";
import TcMediaWiki from "./TcMediaWiki";
import TcNotionIntegration from "./TcNotionIntegration";
import TcTelegram from "./TcTelegram/TcTelegram";
import TcWebsite from "./TcWebsite";
import TcButton from "../../shared/TcButton";
import TcCard from "../../shared/TcCard";
import TcText from "../../shared/TcText";
import { StorageService } from "../../../services/StorageService";
import useAppStore from "../../../store/useStore";
import { IntegrationPlatform } from "../../../utils/enums";
import {
	IDiscordModifiedCommunity,
	IPlatformProps,
} from "../../../utils/interfaces";

interface TcTabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

interface ModuleConfig {
	name: string;
	displayName: string;
	route: string;
	moduleName: string;
}

interface PlatformConfig {
	name: string;
	component: React.ComponentType<any>;
	tabIndex: number;
}

const PLATFORM_CONFIGS: PlatformConfig[] = [
	{ name: "discord", component: TcDiscordIntgration, tabIndex: 0 },
	{ name: "telegram", component: TcTelegram, tabIndex: 1 },
	{ name: "website", component: TcWebsite, tabIndex: 2 },
	{ name: "discourse", component: TcDiscourse, tabIndex: 3 },
	{ name: "github", component: TcGithubIntegration, tabIndex: 4 },
	{ name: "notion", component: TcNotionIntegration, tabIndex: 5 },
	{ name: "mediaWiki", component: TcMediaWiki, tabIndex: 6 },
	// { name: "gdrive", component: TcGdriveIntegration, tabIndex: 7 },
];

const MODULE_CONFIGS: ModuleConfig[] = [
	{
		name: "hivemind",
		displayName: "Q&A AI assistant",
		route: "/community-settings/ai-assistant",
		moduleName: "hivemind",
	},
	{
		name: "violationDetection",
		displayName: "Violation Detection",
		route: "/community-settings/violation-detection",
		moduleName: "violationDetection",
	},
	// {
	// 	name: "reputationScore",
	// 	displayName: "Reputation Score",
	// 	route: "/community-settings/reputation-score",
	// 	moduleName: "dynamicNft",
	// },
];

function TabPanel({ children, value, index, ...other }: TcTabPanelProps) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `vertical-tab-${index}`,
		"aria-controls": `vertical-tabpanel-${index}`,
	};
}

function TcCommunityPlatforms() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { retrievePlatforms, retrieveModules, createModule } = useAppStore();

	const [platforms, setPlatforms] = useState<IPlatformProps[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [activeTab, setActiveTab] = useState<number>(0);
	const [moduleLoadingStates, setModuleLoadingStates] = useState<Record<string, boolean>>({});

	const communityId = StorageService.readLocalStorage<IDiscordModifiedCommunity>("community")?.id;

	useEffect(() => {
		const platform =
			searchParams?.get("managePlatform") || searchParams?.get("addPlatform");
		const config = PLATFORM_CONFIGS.find((p) => p.name === platform);
		setActiveTab(config?.tabIndex ?? 0);
	}, [searchParams]);

	const fetchPlatformsByType = async () => {
		const platformName = PLATFORM_CONFIGS[activeTab]?.name;
		if (!platformName) return;

		setIsLoading(true);
		try {
			const { results } = await retrievePlatforms({
				name: platformName,
				community: communityId,
			});
			setPlatforms(results || []);
		} catch (error) {
			console.error("Error fetching platforms:", error);
			setPlatforms([]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchPlatformsByType();
	}, [activeTab]);

	const handleModuleManagement = async (moduleConfig: ModuleConfig) => {
		setModuleLoadingStates(prev => ({ ...prev, [moduleConfig.name]: true }));
		try {
			const modules = await retrieveModules({
				community: communityId,
				name: moduleConfig.moduleName,
			});

			if (!modules.results.length) {
				await createModule({
					name: moduleConfig.moduleName,
					community: communityId
				});
			}
			router.push(moduleConfig.route);
		} catch (error) {
			console.error(`Error managing ${moduleConfig.name}:`, error);
		} finally {
			setModuleLoadingStates(prev => ({ ...prev, [moduleConfig.name]: false }));
		}
	};

	return (
		<div>
			<Paper className="rounded-none bg-gray-100 p-4 shadow-none">
				<div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-3 md:space-y-0">
					<TcText text="Platforms" variant="h6" fontWeight="bold" />
					<TcText text="Add/remove platform integrations" variant="body1" />
				</div>
				<Box>
					<Tabs
						orientation="horizontal"
						variant="scrollable"
						value={activeTab}
						onChange={(event, newValue) => setActiveTab(newValue)}
					>
						{Object.keys(IntegrationPlatform).map((platform, index) => {
							const isSupported = PLATFORM_CONFIGS.some(config =>
								config.name.toLowerCase() === platform.toLowerCase()
							);

							return (
								<Tab
									className={clsx(
										"mr-3 min-h-[6rem] min-w-[10rem] rounded-sm shadow-lg",
										activeTab === index
											? "bg-secondary/80 text-white"
											: !isSupported
												? "bg-white"
												: "bg-white text-black",
									)}
									key={index}
									label={
										<div className="flex flex-col items-center space-y-2">
											<TcCommunityPlatformIcon platform={platform} size={32} />
											<TcText text={platform} variant="caption" />
										</div>
									}
									disabled={!isSupported}
									{...a11yProps(index)}
								/>
							);
						})}
					</Tabs>

					{PLATFORM_CONFIGS.map((config, index) => (
						activeTab === index && (
							<TabPanel key={config.name} value={activeTab} index={index}>
								<config.component
									isLoading={isLoading}
									platformType={config.name}
									connectedPlatforms={platforms}
									handleUpdateCommunityPlatform={fetchPlatformsByType}
								/>
							</TabPanel>
						)
					))}
				</Box>
			</Paper>

			<div className="py-4">
				<div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-3 md:space-y-0">
					<TcText text="Modules" variant="h6" fontWeight="bold" />
					<TcText
						text="Turn on/off modules and change their settings"
						variant="body1"
					/>
				</div>

				<div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
					{MODULE_CONFIGS.map(moduleConfig => (
						<TcCard
							key={moduleConfig.name}
							className="max-h-[6rem] min-h-[6rem] min-w-[10rem] max-w-[10rem] flex-grow"
							children={
								<div className="flex flex-col items-center justify-center space-y-2 py-4">
									<TcText
										text={moduleConfig.displayName}
										variant="caption"
									/>
									<TcButton
										text={
											moduleLoadingStates[moduleConfig.name] ? (
												<CircularProgress size={20} />
											) : (
												"Manage"
											)
										}
										variant="text"
										onClick={() => handleModuleManagement(moduleConfig)}
									/>
								</div>
							}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default TcCommunityPlatforms;
