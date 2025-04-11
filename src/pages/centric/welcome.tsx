import React from "react";
import { Grid } from "@mui/material";


import SEO from "@/components/global/SEO";
import ApplicationList from "@/components/home/applications/ApplicationList";
import DatasourceList from "@/components/home/datasources/DatasourceList";

import { useToken } from "@/context/TokenContext";
import { defaultLayout } from "@/layouts/defaultLayout";
import { withRoles } from "@/utils/withRoles";
import { useAdmin } from "@/hooks/useAdmin";

function Welcome() {

	const { community } = useToken();
	const { isAdmin } = useAdmin();

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
						<div
							className="text-sm font-medium p-4 flex w-full justify-start rounded-full bg-yellow-50 text-yellow-500"
						>
							Only administrators can manage datasources and applications.
						</div>
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
						<DatasourceList />
					</Grid>

					<Grid item xs={12} md={6}>
						<ApplicationList />
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
}

Welcome.pageLayout = defaultLayout;

export default withRoles(Welcome, ["admin", "view"]);
