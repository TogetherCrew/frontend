import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import useAppStore from "@/store/useStore";

import { useToken } from "@/context/TokenContext";

import TcCommunityPlatforms from "../../components/communitySettings/communityPlatforms";
import TcRolesAndPermissions from "../../components/communitySettings/rolesAndPermissions";
import TcCommunitySettings from "../../components/communitySettings/TcCommunitySettings";
import SimpleBackdrop from "../../components/global/LoadingBackdrop";
import SEO from "../../components/global/SEO";
import TcIntegrationDialog from "../../components/pages/communitySettings/TcIntegrationDialog";
import TcBoxContainer from "../../components/shared/TcBox/TcBoxContainer";
import { defaultLayout } from "../../layouts/defaultLayout";
import { withRoles } from "../../utils/withRoles";

function Index() {
	const router = useRouter();

	const { community } = useToken();

	const { userProfile } = useAppStore();

	const [loading, setLoading] = useState<boolean>(false);
	const [showDialog, setShowDialog] = useState<boolean>(false);
	const [dialogContent, setDialogContent] = useState({
		title: "",
		bodyContent: <></>,
		dialogButtonText: "",
	});

	useEffect(() => {
		setLoading(true);
		if (router.query.platform) {
			setShowDialog(true);
			if (router.query.platform === "Discord") {
				setDialogContent({
					title: "Welcome to TogetherCrew!",
					bodyContent: <>To see the data, please connect your community</>,
					dialogButtonText: "I Understand!",
				});
			}
		} else {
			setShowDialog(false);
		}
		setLoading(false);
	}, [router.query]);

	const hasDiscordIdentity = userProfile?.identities?.some(
		(identity: any) => identity.provider === "discord",
	);

	const handleClose = () => {
		setShowDialog(false);
		router.push(router.pathname);
	};

	if (loading) {
		return <SimpleBackdrop />;
	}

	return (
		<>
			<SEO titleTemplate="Community Settings" />
			<div className="container flex flex-col px-4 py-4 md:px-12">
				<TcBoxContainer
					className="bg-base-100 rounded-lg"
					contentContainerChildren={
						<div className="space-y-4 px-4 pt-4 pb-[4rem] md:px-10">
							<TcCommunitySettings />
							<div className="space-y-2">
								<TcCommunityPlatforms />
								{hasDiscordIdentity && <TcRolesAndPermissions />}
							</div>
							<div className="text-xs text-gray-500">
								<span>Community ID: </span>
								<code>{community?._id || community?.id}</code></div>
						</div>
					}
				/>
			</div>
			<TcIntegrationDialog
				title={dialogContent.title}
				bodyContent={dialogContent.bodyContent}
				buttonText={dialogContent.dialogButtonText}
				onClose={handleClose}
				showDialog={showDialog}
			/>
		</>
	);
}

Index.pageLayout = defaultLayout;

export default withRoles(Index, ["admin"]);
