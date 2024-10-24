import { StateCreator } from 'zustand';

import IPlatfrom, {
  IGrantWritePermissionsProps,
  IPatchPlatformInput,
  IRetrievePlatformsProps,
  IRetrivePlatformRolesOrChannels,
} from '../types/IPlatform';
import { axiosInstance } from '../../axiosInstance';
import { conf } from '../../configs';
import { IPlatformProps } from '../../utils/interfaces';

const BASE_URL = conf.API_BASE_URL;

const createPlatfromSlice: StateCreator<IPlatfrom> = (set, get) => ({
  connectedPlatforms: [],
  connectNewPlatform: (platformType, userId, scopes) => {
    try {
      let url = `${BASE_URL}/platforms/connect/?platform=${platformType}`;

      if (platformType === 'google') {
        if (userId && scopes && scopes.length > 0) {
          const encodedScopes = encodeURIComponent(scopes.join(','));
          url += `&userId=${encodeURIComponent(userId)}&scopes[]=${encodedScopes}`;

          location.replace(url);
        }
      } else if (platformType === 'notion') {
        if (userId) {
          url += `&userId=${encodeURIComponent(userId)}`;
        }
        location.replace(url);
      } else {
        location.replace(url);
      }
    } catch (error) {
      console.error('Failed to connect platform due to:', error);
    }
  },
  retrievePlatforms: async ({
    page,
    limit,
    sortBy,
    name,
    community,
  }: IRetrievePlatformsProps) => {
    try {
      const params = {
        page,
        limit,
        sortBy,
        ...(name ? { name } : {}),
        ...(community ? { community } : {}),
      };

      const { data } = await axiosInstance.get(`/platforms/`, { params });
      set({ connectedPlatforms: [...data.results] });
      return data;
    } catch (error) {
      console.error('Failed to retrieve communities:', error);
    }
  },
  createNewPlatform: async ({ name, community, metadata }: IPlatformProps) => {
    try {
      const { data } = await axiosInstance.post('/platforms', {
        name,
        community,
        metadata,
      });
      return data;
    } catch (error) {}
  },
  retrievePlatformById: async (id: string) => {
    try {
      const { data } = await axiosInstance.get(`/platforms/${id}`);
      return data;
    } catch (error) {}
  },
  deletePlatform: async ({ id, deleteType }) => {
    try {
      const { data } = await axiosInstance.delete(`/platforms/${id}`, {
        data: {
          deleteType,
        },
      });
      return data;
    } catch (error) {}
  },
  retrievePlatformProperties: async ({
    platformId,
    property = 'channel',
    name,
    ngu,
    sortBy,
    page,
    limit,
  }: IRetrivePlatformRolesOrChannels) => {
    try {
      const params = new URLSearchParams();

      params.append('property', property);

      if (sortBy !== undefined) {
        params.append('sortBy', sortBy);
      } else if (property === 'role') {
        params.append('sortBy', 'name:asc');
      }

      if (name) params.append('name', name);

      if (ngu) params.append('ngu', ngu);

      if (page !== undefined) {
        params.append('page', page.toString());
      }
      if (limit !== undefined) {
        params.append('limit', limit.toString());
      }

      const url = `/platforms/${platformId}/properties?${params.toString()}`;
      const { data } = await axiosInstance.post(url);
      return data;
    } catch (error) {}
  },
  patchPlatformById: async ({ id, metadata }: IPatchPlatformInput) => {
    try {
      const { data } = await axiosInstance.patch(`/platforms/${id}`, {
        metadata,
      });
      return data;
    } catch (error) {}
  },
  grantWritePermissions: ({
    platformType,
    moduleType,
    id,
  }: IGrantWritePermissionsProps) => {
    location.replace(
      `${BASE_URL}/platforms/request-access/${platformType}/${moduleType}/${id}`
    );
  },
});

export default createPlatfromSlice;
