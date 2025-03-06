import { useEffect, useState } from "react";

import useAppStore from "@/store/useStore";

import { IDiscordModifiedCommunity, IPlatformProps } from "@/utils/interfaces";

import { ViolationDetectionForm } from "./ViolationDetectionForm";

export function ViolationDetectionFormWrapper({ community, platform }: { community: IDiscordModifiedCommunity, platform: IPlatformProps }) {
  const { retrieveModules } = useAppStore();

  const [modules, setModules] = useState<any[]>([]);

  async function fetchModule() {
    if (community) {
      const { results } = await retrieveModules({
        community: community.id,
        name: "violationDetection",
      });

      setModules(results);
    }
  }

  useEffect(() => {
    fetchModule();
  }, []);


  return (
    <div>
      {modules.map((module: any, index: number) => (
        <ViolationDetectionForm
          platform={platform}
          module={module}
          key={index}
        />
      ))}
    </div>
  );
}