export interface StatisticsProps {
  label: string;
  percentageChange: number;
  description?: string;
  value: number;
  colorBadge: string;
  hasTooltip: boolean;
  tooltipText?: React.ReactNode;
  customBackground?: boolean;
}

export interface SeriesData {
  name: string;
  data: number[];
}

export interface Column {
  id: string;
  label: string;
}

export interface Row {
  [key: string]: any;
}

export interface IRoles {
  roleId: string;
  color: number | string;
  name: string;
  deletedAt?: string | null;
  id?: number | string;
}

export interface IUserProfile {
  avatar: string;
  id: string;
  joinedAt: string;
  discordId: string;
  ngu: string;
  radius: number;
  roles: IRoles[];
  stats: string;
  username: string;
}

export interface IActivityCompositionOptions {
  name: string;
  value: string;
  color: string;
}

export interface IRowDetail {
  discordId: string;
  avatar: string;
  username: string;
  roles: IRoles[];
  activityComposition: string[];
}

export interface IDecentralisationScoreResponse {
  decentralisationScore: number;
  decentralisationScoreRange: {
    minimumDecentralisationScore: number;
    maximumDecentralisationScore: number;
  };
  scoreStatus: number;
}

export interface IFragmentationScoreResponse {
  fragmentationScore: number;
  scoreStatus: number;
  fragmentationScoreRange: {
    minimumFragmentationScore: number;
    maximumFragmentationScore: number;
  };
}

export interface IDecodedToken {
  exp: number;
  iat: number;
  sub: string;
  type: string;
}

export interface ITrackEventParams {
  eventType: string;
  eventProperties?: Record<string, any>;
  callback?: (result: { event: any; code: any; message: any }) => void;
}

export interface IActivity {
  posts: number;
  replies: number;
  retweets: number;
  likes: number;
  mentions: number;
}

export interface IAudience {
  replies: number;
  retweets: number;
  likes: number;
  mentions: number;
}

export interface IEngagement {
  hqla: number;
  hqhe: number;
  lqla: number;
  lqhe: number;
}

export interface IAccount {
  follower: number;
  engagement: number;
}

export interface IDataTwitter {
  activity: IActivity;
  audience: IAudience;
  engagement: IEngagement;
  account: IAccount;
}

export interface ICommunity {
  _id: string;
  id: string;
  name: string;
  platforms: string[];
  users: string[];
  avatarURL: string;
}

export interface FetchedData {
  limit: number;
  page: number;
  results: any[];
  totalPages: number;
  totalResults: number;
}

export interface IPlatformProps {
  name: string;
  community: string;
  isInProgress: boolean;
  connectedAt: string;
  id: string;
  disconnectedAt: string | null;
  metadata: metaData;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPermissions {
  AttachFiles: boolean;
  CreatePrivateThreads: boolean;
  CreatePublicThreads: boolean;
  EmbedLinks: boolean;
  MentionEveryone: boolean;
  SendMessages: boolean;
  SendMessagesInThreads: boolean;
  ViewChannel: boolean;
}

export interface ReadData {
  ViewChannel: boolean;
  ReadMessageHistory: boolean;
}

export interface Permissions {
  permissions: UserPermissions;
  ReadData: ReadData;
}

export interface ICommunityPlatfromProps {
  _id: string;
  id: string;
  name: string;
  metadata: {
    id: string;
    icon: string;
    name: string;
    selectedChannels?: string[];
    period?: string;
    permissions: Permissions;
    analyzerStartedAt?: string;
    isInProgress?: boolean;
    isFetchingInitialData?: boolean;
    chat?: {
      title: string;
      id: string;
    };
  };
  disconnectedAt: string | null;
}

export interface metaData {
  [key: string]: any;
}

export interface IDiscordModifiedCommunity
  extends Omit<ICommunity, 'platforms'> {
  platforms: ICommunityPlatfromProps[];
  userHasAccess?: boolean;
}

export interface IUser {
  discordId: string;
  discriminator?: string;
  globalName?: string | null;
  ngu: string;
  nickname?: string | null;
  username?: string;
  avatar?: string;
}

export interface IModuleDiscordPlatformMetadata {
  [key: string]: any;
}

export interface IModuleGooglePlatformMetadata {
  driveIds: string[];
  folderIds: string[];
  fileIds: string[];
}

export interface IPlatformModuleProps {
  platform: string;
  name: 'discord' | 'google' | 'github' | 'notion' | 'mediaWiki' | 'website';
  _i?: string;
  metadata: IModuleDiscordPlatformMetadata;
}

export interface IModuleProps {
  id: string;
  name: string;
  community: string;
  options: {
    platforms: IPlatformModuleProps[];
  };
  activated: boolean;
}

export interface IModuleContext {
  icon: React.ElementType;
  name: string;
  title: string;
  description: string;
  available: boolean;
  configPath: string;
  modulePath: string;
  adminOnly?: boolean;
}

export interface IPlatformContext {
  name: string;
  title: string;
  available: boolean;
  configPath: string;
}

export interface ISidebarItem {
  label: string;
  icon: React.ElementType;
  href: string;
  children?: ISidebarItem[];
}

export interface IMediaWikiNamepace {
  id: number
  name: string
  count: number
}

export interface IMediaWikiModuleFormPayload {
  activated: boolean;
}