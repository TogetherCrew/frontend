import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import SimpleBackdrop from '../components/global/LoadingBackdrop';
import { extractUrlParams } from '../helpers/helper';
import { StorageService } from '../services/StorageService';
import { IRetrieveCommunitiesProps } from '../store/types/ICentric';
import useAppStore from '../store/useStore';
import { StatusCode } from '../utils/enums';
import { ICommunity, metaData } from '../utils/interfaces';

export type CommunityWithoutAvatar = Omit<ICommunity, 'avatarURL'>;
interface Params {
  name: string;
  platform: string;
  id: string;
  username?: string;
  profileImageUrl?: string;
  icon?: string;
}
/**
 * Callback Component.
 *
 * This component is designed to handle the callback after a user tries to authorize
 * with Discord. Based on the status code received in the URL parameters, it will display
 * appropriate messages to the user.
 */
function Callback() {
  // State to store the displayed message
  const [message, setMessage] = useState<string | null>(null);

  // Next.js router instance
  const router = useRouter();

  // Method to retrieve communities from the store.
  const { retrieveCommunities, createNewPlatform } = useAppStore();

  /**
   * Asynchronously fetches communities.
   * Depending on the presence of communities, it will redirect to either the terms and conditions
   * page or the community selection page.
   */
  const fetchCommunities = async () => {
    const params: IRetrieveCommunitiesProps = { page: 1, limit: 10 };
    try {
      const communities = await retrieveCommunities(params);
      if (communities.results.length === 0) {
        router.push('/centric/tac');
      } else {
        router.push('/centric/select-community');
      }
    } catch (error) {
      console.error('Failed to retrieve communities:', error);
    }
  };

  const handleCreateNewPlatform = async (params: Params) => {
    const community =
      StorageService.readLocalStorage<CommunityWithoutAvatar>('community');

    if (!community) {
      console.error('Community not found in local storage.');
      return;
    }

    const metadata: metaData = {
      id: params.id,
    };

    if (params.platform === 'twitter') {
      metadata.username = params.username;
      metadata.profileImageUrl = params.profileImageUrl;
    } else if (params.platform === 'discord') {
      metadata.icon = params.icon;
      metadata.name = params.name;
    }

    const payload = {
      name: params.platform,
      community: community.id,
      metadata: metadata,
    };

    try {
      const data = await createNewPlatform(payload);
      if (!data) {
        router.push('community-settings');
      }
      router.push(`/community-settings/platform/?platformId=${data.id}`);
    } catch (error) {
      console.error('Failed to create new platform:', error);
    }
  };

  /**
   * Handles the display message based on the received status code.
   *
   * @param {StatusCode} code - The status code received from the URL parameters.
   */
  const handleStatusCode = (code: StatusCode, params: any) => {
    switch (code) {
      case StatusCode.DISCORD_AUTHORIZATION_SUCCESSFUL_FIRST_TIME:
        setMessage('Welcome! Authorization for sign-in was successful.');
        StorageService.writeLocalStorage('user', params);
        fetchCommunities();

        break;

      case StatusCode.REPEATED_DISCORD_AUTHORIZATION_ATTEMPT:
        setMessage(
          'You have authorized before and are trying to authorize again.'
        );
        StorageService.writeLocalStorage('user', params);
        fetchCommunities();

        break;

      case StatusCode.DISCORD_AUTHORIZATION_FAILURE:
        setMessage('Authorization failed. Please try again.');
        router.push('/centric');
        break;

      case StatusCode.DISCORD_AUTHORIZATION_FROM_SETTINGS:
        setMessage('Authorizion complete from settings page.');
        handleCreateNewPlatform(params);
        break;

      case StatusCode.TWITTER_AUTHORIZATION_SUCCESSFUL:
        setMessage('Authorizion complete from settings page.');
        handleCreateNewPlatform(params);
        break;

      case StatusCode.TWITTER_AUTHORIZATION_FAILURE:
        setMessage('Twitter Authorization failed.');
        router.push('/community-settings');

      case StatusCode.DISCORD_AUTHORIZATION_FAILURE_FROM_SETTINGS:
        setMessage('Discord Authorization during setup on setting faield.');
        router.push('/community-settings');

      case StatusCode.ANNOUNCEMENTS_PERMISSION_FAILURE:
        setMessage('Announcements grant write permissions faield.');
        router.push('/announcements');

      case StatusCode.ANNOUNCEMENTS_PERMISSION_SUCCESS:
        setMessage('Announcements grant write permissions success.');
        router.push('/announcements');

      default:
        console.error('Unexpected status code received:', code);
        setMessage('An unexpected error occurred. Please try again later.');
        break;
    }
  };

  /**
   * useEffect hook to handle status codes.
   *
   * It waits until the router instance is ready, extracts the parameters from the URL,
   * and then handles the status code accordingly.
   */
  useEffect(() => {
    if (router.isReady) {
      const params = extractUrlParams(router.asPath);

      if (
        params.statusCode &&
        Object.values(StatusCode).includes(params.statusCode as StatusCode)
      ) {
        handleStatusCode(params.statusCode as StatusCode, params);
      } else {
        console.error('Invalid or no status code found in the URL.');
        setMessage(
          'An error occurred while processing your request. Please try again.'
        );
      }
    }
  }, [router.isReady]);

  return <SimpleBackdrop data-testid='loading-backdrop' />;
}

export default Callback;
