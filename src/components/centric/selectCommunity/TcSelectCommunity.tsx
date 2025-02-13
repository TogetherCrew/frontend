import React, { useEffect, useState } from "react";
import router from "next/router";
import { BsPlus } from "react-icons/bs";

import TcCommunityList from "./TcCommunityList";
import Loading from "../../global/Loading";
import SimpleBackdrop from "../../global/LoadingBackdrop";
import TcButton from "../../shared/TcButton";
import TcText from "../../shared/TcText";
import { useToken } from "../../../context/TokenContext";
import { debounce } from "../../../helpers/helper";
import { StorageService } from "../../../services/StorageService";
import useAppStore from "../../../store/useStore";
import { IDiscordModifiedCommunity } from "../../../utils/interfaces";
import SearchWrapper from "@/components/search/SearchWrapper";

export interface CommunityData {
	limit: number;
	page: number;
	results: any[];
	totalPages: number;
	totalResults: number;
	includeAllCommunities: boolean;
}

function TcSelectCommunity() {
	const { retrieveCommunities } = useAppStore();
	const { updateCommunity } = useToken();

	const [loading, setLoading] = useState<boolean>(false);
	const [communityLoading, setCommunityLoading] = useState<boolean>(false);
	const [activeCommunity, setActiveCommunity] =
		useState<IDiscordModifiedCommunity>();
	const [fetchedCommunities, setFetchedCommunities] = useState<CommunityData>({
		limit: 999,
		page: 1,
		results: [],
		totalPages: 0,
		totalResults: 0,
		includeAllCommunities: true,
	});

	const fetchCommunities = async (params: any) => {
		setLoading(true);
		const communities = await retrieveCommunities(params);
		// Sort communities to show those with userHasAccess=true first
		communities.results = communities.results.sort((a: any, b: any) => {
			if (a.userHasAccess === b.userHasAccess) {
				return a.name.localeCompare(b.name);
			}
			return a.userHasAccess ? -1 : 1;
		});
		communities.results = communities.results.map((community: IDiscordModifiedCommunity) => {
			community.id = community._id
			return community
		});
		setFetchedCommunities(communities);
		setLoading(false);
	};

	const debouncedFetchCommunities = debounce((value: string) => {
		fetchCommunities({ page: 1, limit: 999, includeAllCommunities: true, name: value });
	}, 300);

	useEffect(() => {
		fetchCommunities({ page: 1, limit: 999, includeAllCommunities: true });
	}, []);

	const handleSelectedCommunity = (community: IDiscordModifiedCommunity) => {
		setCommunityLoading(true);
		console.log('community', community)
		if (community) {
			updateCommunity(community);
			StorageService.writeLocalStorage<IDiscordModifiedCommunity>(
				"community",
				community,
			);

			router.push("/centric/welcome");
		}
	};

	if (communityLoading) {
		return <SimpleBackdrop />;
	}

	return (
		<>
			<div className="flex flex-col gap-4 border-b border-gray-200 pb-8" data-testid="tcselect-community">
				<h1 className="text-4xl text-left font-semibold">Select your community</h1>
				<h2 className="text-sm text-left text-gray-500">You will be able to switch between the communities later</h2>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex justify-between gap-4">
					<SearchWrapper debouncedFetchCommunities={debouncedFetchCommunities} />
					<button
						className="bg-black text-white px-4 py-2 rounded-full flex gap-1 items-center hover:opacity-80"
						onClick={() => router.push("/centric/create-new-community")}>
						<BsPlus className="text-lg" />
						<span>Create</span>
					</button>
				</div>
				{loading ? <Loading /> : <TcCommunityList
					fetchedCommunities={fetchedCommunities}
					handleSelectedCommunity={handleSelectedCommunity} />
				}
			</div>
		</>
	);
}

export default TcSelectCommunity;
