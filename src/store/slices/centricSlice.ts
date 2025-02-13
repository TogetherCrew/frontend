import { StateCreator } from 'zustand';

import ICentric, {
  ICreateCommunitieProps,
  IGenerateTokenProps,
  IPatchCommunityProps,
  IRetrieveCommunitiesProps,
} from '../types/ICentric';
import { axiosInstance } from '../../axiosInstance';
import { conf } from '../../configs';

const BASE_URL = conf.API_BASE_URL;

const createCentricSlice: StateCreator<ICentric> = (set, get) => ({
  telegram: {
    value: '',
    expiresAt: '',
  },
  setTelegram: (value: string | null, expiresAt: string | null) => {
    set({ telegram: { value, expiresAt } });
  },
  discordAuthorization: () => {
    location.replace(`${BASE_URL}/auth/discord/authorize`);
  },
  retrieveCommunities: async ({
    page,
    limit,
    sortBy,
    name,
    includeAllCommunities,
  }: IRetrieveCommunitiesProps) => {
    try {
      const params = {
        page,
        limit,
        sortBy,
        ...(name ? { name } : {}),
        ...(includeAllCommunities ? { includeAllCommunities } : {}),
      };

      const { data } = await axiosInstance.get('/communities/', { params });
      return data;
    } catch (error) {
      console.error('Failed to retrieve communities:', error);
    }
  },
  createNewCommunitie: async ({
    name,
    avatarURL,
    tcaAt,
  }: ICreateCommunitieProps) => {
    try {
      const { data } = await axiosInstance.post('communities', {
        name,
        avatarURL,
        tcaAt,
      });

      return data;
    } catch (error) { }
  },
  retrieveCommunityById: async (communityId: string) => {
    try {
      const { data } = await axiosInstance.get(`/communities/${communityId}`);
      return data;
    } catch (error) { }
  },
  deleteCommunityById: async (communityId: string) => {
    try {
      const { data } = await axiosInstance.delete(
        `/communities/${communityId}`
      );
      return data;
    } catch (error) { }
  },
  patchCommunityById: async ({
    communityId,
    ...updateData
  }: IPatchCommunityProps) => {
    try {
      const { data } = await axiosInstance.patch(
        `/communities/${communityId}`,
        updateData
      );
      return data;
    } catch (error) { }
  },
  generateToken: async ({ type, communityId }: IGenerateTokenProps) => {
    const currentTime = new Date().toISOString();
    const { telegram } = get();

    if (
      telegram.value &&
      telegram.expiresAt &&
      telegram.expiresAt > currentTime
    ) {
      return {
        value: telegram.value,
        expiresAt: telegram.expiresAt,
      };
    }

    try {
      const { data } = await axiosInstance.post('/auth/generate-token', {
        type,
        communityId,
      });

      set(() => ({
        telegram: {
          value: data?.value || null,
          expiresAt: data?.expiresAt || null,
        },
      }));

      return data;
    } catch (error) {
      console.error('Failed to generate token:', error);
    }
  },
});

export default createCentricSlice;
