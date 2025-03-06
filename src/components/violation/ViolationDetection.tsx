import { useEffect, useState } from "react";

import { IDiscordModifiedCommunity, IPlatformProps } from "@/utils/interfaces";

import { ViolationDetectionFormWrapper } from "./ViolationDetectionFormWrapper";
import Loading from "../global/Loading";

export function ViolationDetection({ community }: { community: IDiscordModifiedCommunity }) {

  const [platform, setPlatform] = useState<IPlatformProps | null>(null);

  useEffect(() => {
    console.log("community", community);
    if (community) {
      const platform = community.platforms.find(
        (platform) =>
          platform.name === "discourse" && platform.disconnectedAt === null,
      ) as unknown as IPlatformProps;

      console.log("platform", platform);

      setPlatform(platform);
    }
  }, []);

  return (
    <>
      {platform ?
        <ViolationDetectionFormWrapper
          community={community}
          platform={platform} />
        :
        <Loading />
      }
    </>
  )
}
