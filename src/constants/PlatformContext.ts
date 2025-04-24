import { IPlatformContext } from "@/utils/interfaces";

export const PLATFORM_CONTEXT: IPlatformContext[] = [
  {
    name: "discord", title: "Discord", available: true,
    configPath: "/community-settings?managePlatform=discord"
  },
  {
    name: "telegram", title: "Telegram", available: true,
    configPath: "/community-settings?managePlatform=telegram"
  },
  {
    name: "website", title: "Website", available: true,
    configPath: "/community-settings?managePlatform=website"
  },
  {
    name: "discourse", title: "Discourse", available: true,
    configPath: "/community-settings?managePlatform=discourse"
  },
  {
    name: "github", title: "Github", available: true,
    configPath: "/community-settings?managePlatform=github"
  },
  {
    name: "notion", title: "Notion", available: true,
    configPath: "/community-settings?managePlatform=notion"
  },
  {
    name: "mediawiki", title: "Mediawiki", available: true,
    configPath: "/community-settings?managePlatform=mediawiki"
  },
  {
    name: "x", title: "X (Twitter)", available: false,
    configPath: "/community-settings?managePlatform=x"
  },
  {
    name: "snapshot", title: "Snapshot", available: false,
    configPath: "/community-settings?managePlatform=snapshot"
  },
  {
    name: "google", title: "Google", available: false,
    configPath: "/community-settings?managePlatform=google"
  },
  {
    name: "gitbook", title: "Gitbook", available: false,
    configPath: "/community-settings?managePlatform=gitbook"
  },
];