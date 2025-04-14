import React from "react";

import { useAdmin } from "@/hooks/useAdmin";

import SEO from "@/components/global/SEO";
import ModuleList from "@/components/home/modules/ModuleList";
import DatasourceList from "@/components/home/platforms/PlatformList";

import { useToken } from "@/context/TokenContext";
import { defaultLayout } from "@/layouts/defaultLayout";
import { withRoles } from "@/utils/withRoles";

function OnlyAdminWarning() {
	const { isAdmin } = useAdmin();

	if (!isAdmin) {
		return (
			<div
				className="text-sm font-medium p-4 flex w-full justify-start rounded-2xl bg-yellow-50 text-yellow-500"
			>
				Only administrators can manage datasources and applications.
			</div>
		)
	}

	return null;
}

function Welcome() {

	const { community } = useToken();

	return (
		<div className="h-screen bg-gray-100 p-6 sm:p-8">
			<SEO title="Home" />
			<div className="flex flex-col gap-6 sm:gap-8">
				<h1 className="text-2xl font-semibold">
					Welcome to <b className="text-secondary">{community?.name}</b>
				</h1>
				{/* <OnlyAdminWarning /> */}
				<div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
					<div className="flex-1">
						<DatasourceList />
					</div>
					<div className="flex-1">
						<ModuleList />
					</div>
				</div >
			</div>

		</div >
	);
}

Welcome.pageLayout = defaultLayout;

export default withRoles(Welcome, ["admin", "view"]);
