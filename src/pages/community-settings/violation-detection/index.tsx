/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import {
	Alert,
	AlertTitle,
	Autocomplete,
	Chip,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormLabel,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import router from "next/router";

import TcButton from "@/components/shared/TcButton";

import useAppStore from "@/store/useStore";

import { useSnackbar } from "@/context/SnackbarContext";
import { useToken } from "@/context/TokenContext";
import { StorageService } from "@/services/StorageService";
import { IDiscordModifiedCommunity, IPlatformProps } from "@/utils/interfaces";

import SEO from "../../../components/global/SEO";
import TcBoxContainer from "../../../components/shared/TcBox/TcBoxContainer";
import TcBreadcrumbs from "../../../components/shared/TcBreadcrumbs";
import { defaultLayout } from "../../../layouts/defaultLayout";
import { withRoles } from "../../../utils/withRoles";

function Index() {
	const { retrieveModules, patchModule } = useAppStore();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [emails, setEmails] = useState<string[]>([]);
	const [activePlatform, setActivePlatform] = useState<IPlatformProps | null>(
		null,
	);
	const [violationModules, setViolationModules] = useState<any[]>([]);
	const [isViolationDetectionOn, setIsViolationDetectionOn] =
		useState<boolean>(false);
	const [emailError, setEmailError] = useState<string | null>(null);

	const { community } = useToken();
	const { showMessage } = useSnackbar();

	const fetchDiscourseViolation = async () => {
		const communityId =
			StorageService.readLocalStorage<IDiscordModifiedCommunity>(
				"community",
			)?.id;

		const discoursePlatform = community?.platforms.find(
			(platform) =>
				platform.name === "discourse" && platform.disconnectedAt === null,
		) as unknown as IPlatformProps;

		setActivePlatform(discoursePlatform);

		if (communityId) {
			const { results } = await retrieveModules({
				community: communityId,
				name: "violationDetection",
			});

			setViolationModules(results);

			if (results.length > 0) {
				if (results[0]?.options?.platforms.length === 0) return;
				setEmails(
					results[0]?.options?.platforms[0]?.metadata?.selectedEmails || [],
				);

				const hasActiveModerators =
					results[0].options.platforms[0].metadata.selectedEmails.length > 0;
				setIsViolationDetectionOn(hasActiveModerators ? true : false);
			} else {
				setEmails([]);
				setIsViolationDetectionOn(false);
			}
		}
	};

	useEffect(() => {
		fetchDiscourseViolation();
	}, []);

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleEmailChange = (event: any, newValue: string[] | null) => {
		if (newValue) {
			const invalidEmail = newValue.find((email) => !validateEmail(email));
			if (invalidEmail) {
				setEmailError(`Invalid email: ${invalidEmail}`);
			} else {
				setEmailError(null);
				setEmails(newValue);
			}
		}
	};

	const handleDiscourseViolation = async () => {
		if (!activePlatform) return;

		const updatedEmails = isViolationDetectionOn ? emails : [];

		const payload = {
			platforms: [
				{
					platform: activePlatform.id,
					name: activePlatform.name,
					metadata: {
						selectedEmails: updatedEmails,
						fromDate: activePlatform.metadata.period,
						toDate: null,
						selectedResources: [],
					},
				},
			],
		};

		try {
			setIsLoading(true);
			const data = await patchModule({
				moduleId: violationModules[0].id,
				payload,
			});

			if (data) {
				router.push("/community-settings");
				showMessage(
					"Violation detection settings updated successfully",
					"success",
				);
			}
		} catch (error) {
			console.error("Error updating violation module:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<SEO titleTemplate="Violation detection Settings" />
			<div className="container flex flex-col space-y-3 px-4 py-4 md:px-12">
				<TcBreadcrumbs
					items={[
						{
							label: "Community Settings",
							path: "/community-settings",
						},
						{
							label: "Violation detection Settings",
							path: "/community-settings/violation-detection",
						},
					]}
				/>
				<TcBoxContainer
					className="bg-base-100 rounded-lg"
					contentContainerChildren={
						<div className="space-y-4">
							<div className="space-y-4 px-4 pt-4 pb-[1rem] md:px-10">
								<Typography variant="h6" fontWeight="bold">
									Violation Detection Settings
								</Typography>
								<Typography variant="body2">
									Configure the settings for the violation detection system.
									This system will automatically detect violations of regular
									community guidelines. Add emails for automatic notification of
									violations detected.
								</Typography>
								<Alert severity="info" className="my-2 rounded-sm">
									<AlertTitle>Module working for discourse only</AlertTitle>
									This module is currently only available for Discourse.
								</Alert>

								<FormControl fullWidth>
									<FormControlLabel
										control={
											<Switch
												checked={isViolationDetectionOn}
												onChange={(event) =>
													setIsViolationDetectionOn(event.target.checked)
												}
											/>
										}
										label="Violation Detection"
									/>
									<FormHelperText>
										Activate/Deactivate the violation detection module.
									</FormHelperText>
								</FormControl>

								{isViolationDetectionOn && (
									<FormControl fullWidth error={!!emailError}>
										<FormLabel>Moderator Emails</FormLabel>
										<Autocomplete
											multiple
											freeSolo
											value={emails}
											onChange={handleEmailChange}
											renderInput={(params) => (
												<TextField
													{...params}
													variant="filled"
													label="Moderator Emails"
													placeholder="Enter Moderator Emails"
													error={!!emailError}
													helperText={
														emailError || "Enter valid moderator emails."
													}
												/>
											)}
											options={[]}
											renderTags={(value, getTagProps) => {
												return value.map((option, index) => (
													<Chip
														label={option}
														{...getTagProps({ index })}
														variant="outlined"
														size="small"
														sx={{
															borderRadius: "4px",
															borderColor: "#D1D1D1",
															backgroundColor: "white",
															color: "black",
														}}
													/>
												));
											}}
										/>
										<FormHelperText>
											Enter the email addresses of the moderators who should be
											notified when a violation is detected.
										</FormHelperText>
									</FormControl>
								)}

								<div className="mt-6 flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0">
									<TcButton
										text="Cancel"
										variant="outlined"
										className="md:w-1/4"
										onClick={() => router.push("/community-settings")}
									/>
									<TcButton
										text={
											isLoading ? (
												<CircularProgress size={20} color="inherit" />
											) : (
												"Save Changes"
											)
										}
										disabled={isLoading || !!emailError}
										variant="contained"
										className="md:w-1/4"
										onClick={handleDiscourseViolation}
									/>
								</div>
							</div>
						</div>
					}
				/>
			</div>
		</>
	);
}

Index.pageLayout = defaultLayout;

export default withRoles(Index, ["admin"]);
