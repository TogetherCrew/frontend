export interface IRetrieveCommunitiesProps {
  page: number;
  limit: number;
  sortBy?: string;
  name?: string;
  includeAllCommunities?: boolean;
}
export interface ICreateCommunitieProps {
  name: string;
  avatarURL?: string;
  tcaAt: string;
}

export interface IPatchCommunityProps {
  communityId: string;
  name?: string;
  avatarURL?: string;
  tcaAt?: string;
}

export interface IGenerateTokenProps {
  type: 'telegram_verification';
  communityId: string;
}

export default interface ICentric {
  telegram: {
    value: string | null;
    expiresAt: string | null;
  };
  setTelegram: (value: string | null, expiresAt: string | null) => void;
  discordAuthorization: () => void;
  retrieveCommunities: ({
    page,
    limit,
    sortBy,
    name,
  }: IRetrieveCommunitiesProps) => void;
  createNewCommunitie: ({
    name,
    avatarURL,
    tcaAt,
  }: ICreateCommunitieProps) => void;
  retrieveCommunityById: (communityId: string) => void;
  deleteCommunityById: (communityId: string) => void;
  patchCommunityById: ({
    communityId,
    name,
    avatarURL,
    tcaAt,
  }: IPatchCommunityProps) => void;
  generateToken: ({ type, communityId }: IGenerateTokenProps) => void;
}
