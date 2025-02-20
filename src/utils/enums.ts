export enum IntegrationPlatform {
  Discord = 'Discord',
  Github = 'Github',
  Discourse = 'Discourse',
  Notion = 'Notion',
  MediaWiki = 'MediaWiki',
  Telegram = 'Telegram',
  Website = 'Website',
  X = 'X',
  Snapshot = 'Snapshot',
  GDrive = 'GDrive',
}

export enum StatusCode {
  DISCORD_AUTHORIZATION_SUCCESSFUL_FIRST_TIME = '1001',
  REPEATED_DISCORD_AUTHORIZATION_ATTEMPT = '1002',
  DISCORD_AUTHORIZATION_FAILURE = '1003',
  DISCORD_AUTHORIZATION_FROM_SETTINGS = '1004',
  DISCORD_AUTHORIZATION_FAILURE_FROM_SETTINGS = '1005',
  TWITTER_AUTHORIZATION_SUCCESSFUL = '1006',
  TWITTER_AUTHORIZATION_FAILURE = '1007',
  ANNOUNCEMENTS_PERMISSION_SUCCESS = '1008',
  ANNOUNCEMENTS_PERMISSION_FAILURE = '1009',
  GDRIVE_AUTHORIZATION_SUCCESSFUL = '1010',
  GDRIVE_AUTHORIZATION_FAILURE = '1011',
  GITHUB_AUTHORIZATION_SUCCESSFUL = '1012',
  GITHUB_AUTHORIZATION_FAILURE = '1013',
  NOTION_AUTHORIZATION_SUCCESSFUL = '1014',
  NOTION_AUTHORIZATION_FAILURE = '1015',
}

export enum Permission {
  AttachFiles = 'Attach Files',
  CreatePrivateThreads = 'Create Private Threads',
  CreatePublicThreads = 'Create Public Threads',
  EmbedLinks = 'Embed Links',
  MentionEveryone = 'Mention Everyone',
  SendMessages = 'Send Messages',
  SendMessagesInThreads = 'Send Messages In Threads',
  ViewChannel = 'View Channel',
}
