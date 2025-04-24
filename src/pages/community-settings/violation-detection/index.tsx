import {
	Alert,
	AlertTitle,
	Typography,
} from "@mui/material";

import Loading from "@/components/global/Loading";
import { ViolationDetection } from "@/components/violation/ViolationDetection";

import { useToken } from "@/context/TokenContext";

import SEO from "../../../components/global/SEO";
import TcBoxContainer from "../../../components/shared/TcBox/TcBoxContainer";
import TcBreadcrumbs from "../../../components/shared/TcBreadcrumbs";
import { defaultLayout } from "../../../layouts/defaultLayout";
import { withRoles } from "../../../utils/withRoles";

function Index() {
	const { community } = useToken();

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

								{community ? (
									<ViolationDetection community={community} />
								) : (
									<Loading />
								)}
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
