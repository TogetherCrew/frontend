import { useToken } from "@/context/TokenContext";

interface IDatasource {
  name: string;
  title: string;
  available: boolean;
  activated?: boolean;
}

const DATA_SOURCES: IDatasource[] = [
  { name: "discord", title: "Discord", available: true },
  { name: "telegram", title: "Telegram", available: true },
  { name: "website", title: "Website", available: true },
  { name: "discourse", title: "Discourse", available: true },
  { name: "github", title: "Github", available: true },
  { name: "notion", title: "Notion", available: true },
  { name: "mediawiki", title: "Mediawiki", available: true },
  { name: "x", title: "X (Twitter)", available: false },
  { name: "snapshot", title: "Snapshot", available: false },
  { name: "google", title: "Google", available: false },
  { name: "gitbook", title: "Gitbook", available: false },
];

export const useDatasources = () => {

  const { community } = useToken();

  const platformNames =
    community?.platforms?.map((platform: any) => platform.name) || [];

  const datasources = DATA_SOURCES.map((datasource) => ({
    ...datasource,
    activated: platformNames.includes(datasource.name),
  }));

  return datasources;
};
