import { IoCalendar, IoShieldCheckmark, IoTrophy } from "react-icons/io5";
import { RiRobot2Fill, RiMentalHealthFill, RiTeamFill } from "react-icons/ri";

import { useToken } from "@/context/TokenContext";

import { useApi } from "./useApi";

interface IApplication {
  icon: React.ElementType;
  id?: string;
  name: string;
  title: string;
  description: string;
  available: boolean;
  activated?: boolean;
  path: string;
}

const APPLICATIONS: IApplication[] = [
  {
    icon: RiTeamFill,
    name: "community-insights",
    title: "Community Insights",
    description:
      "Master your community's engagement with detailed insights. Monitor active vs. inactive members, identify new joiners and those disengaging, track participation across user groups, and identify your most valuable contributors.",
    available: true,
    path: "/community-settings/",
  },
  {
    icon: RiMentalHealthFill,
    name: "community-health",
    title: "Community Health",
    description:
      "Monitor your community's health",
    available: true,
    path: "/community-settings/",
  },
  {
    icon: IoCalendar,
    name: "announcements",
    title: "Announcements",
    description:
      "Take control of your announcements and communication with members. Send targeted messages to specific types of member based on their roles or engagement levels. Schedule announcements in advance and even reach disengaged members with (safe) DMs.",
    available: true,
    path: "/announcements",
  },
  {
    icon: RiRobot2Fill,
    name: "hivemind",
    title: "AI Assistant",
    description:
      "24/7 Q&A support for your community. Our AI assistant uses your connected data sources to answer member questions instantly, freeing you to focus on strategic tasks while ensuring consistent, reliable member support.",
    available: true,
    path: "/community-settings/ai-assistant/",
  },
  {
    icon: IoTrophy,
    name: "dynamicNft",
    title: "Reputation",
    description:
      "Create a culture of genuine participation with our intelligent Reputation Score system. Automatically measure authentic community involvement, while ensuring the system remains fair and resistant to manipulation.",
    available: true,
    path: "/community-settings/reputation-score/",
  },
  {
    icon: IoShieldCheckmark,
    name: "violationDetection",
    title: "Community Guardian",
    description:
      "Keep your community safe with automatic detection of violent language and community guidelines violations. Our AI ensures credible neutrality, keeping your moderators safe and your standards objective.",
    available: true,
    path: "/community-settings/violation-detection/",
  },
];

export const useApplications = () => {
  const { community } = useToken();

  const { data, loading, error } = useApi(
    community?.id ? `/modules?community=${community.id}` : null
  );

  const applications = APPLICATIONS.map((application) => ({
    ...application,
    activated: data?.results?.some((module: any) => module.name === application.name && module.activated),
    id: data?.results?.find((module: any) => module.name === application.name)?.id,
  }));

  return { applications, data, loading, error };
};