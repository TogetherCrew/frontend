import { IoCalendar, IoTrophy } from "react-icons/io5";
import { RiMentalHealthFill, RiRobot2Fill, RiTeamFill } from "react-icons/ri";

import { IModuleContext } from "@/utils/interfaces";
import { FaShieldAlt } from "react-icons/fa";

export const MODULE_CONTEXT: IModuleContext[] = [
  {
    icon: RiTeamFill,
    name: "communityInsights",
    title: "Community Insights",
    description:
      "Master your community's engagement with detailed insights. Monitor active vs. inactive members, identify new joiners and those disengaging, track participation across user groups, and identify your most valuable contributors.",
    available: true,
    configPath: '/community-settings/community-insights',
    modulePath: "/",
  },
  {
    icon: RiMentalHealthFill,
    name: "communityHealth",
    title: "Community Health",
    description:
      "Monitor your community's health",
    available: true,
    configPath: '/community-settings/community-health',
    modulePath: '/community-health/'
  },
  {
    icon: IoCalendar,
    name: "announcements",
    title: "Announcements",
    description:
      "Take control of your announcements and communication with members. Send targeted messages to specific types of member based on their roles or engagement levels. Schedule announcements in advance and even reach disengaged members with (safe) DMs.",
    available: true,
    configPath: '/community-settings/announcements',
    modulePath: '/announcements/',
    adminOnly: true
  },
  {
    icon: RiRobot2Fill,
    name: "hivemind",
    title: "AI Assistant",
    description:
      "24/7 Q&A support for your community. Our AI assistant uses your connected data sources to answer member questions instantly, freeing you to focus on strategic tasks while ensuring consistent, reliable member support.",
    available: true,
    configPath: '/community-settings/ai-assistant',
    modulePath: '/dashboard/agent'
  },
  {
    icon: IoTrophy,
    name: "dynamicNft",
    title: "Reputation",
    description:
      "Create a culture of genuine participation with our intelligent Reputation Score system. Automatically measure authentic community involvement, while ensuring the system remains fair and resistant to manipulation.",
    available: true,
    configPath: '/community-settings/reputation-score',
    modulePath: '/reputation-score/',
  },
  {
    icon: FaShieldAlt,
    name: "violationDetection",
    title: "Community Guardian",
    description:
      "Keep your community safe with automatic detection of violent language and community guidelines violations. Our AI ensures credible neutrality, keeping your moderators safe and your standards objective.",
    available: true,
    configPath: '/community-settings/violation-detection',
    modulePath: '/dashboard/community-guardian/',
  },
];