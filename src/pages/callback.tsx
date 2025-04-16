import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useSnackbar } from '../context/SnackbarContext';
import { extractUrlParams } from '../helpers/helper';
import { StorageService } from '../services/StorageService';
import { IRetrieveCommunitiesProps } from '../store/types/ICentric';
import useAppStore from '../store/useStore';
import { StatusCode } from '../utils/enums';
import { ICommunity, metaData } from '../utils/interfaces';
import LoadingScreen from '../components/LoadingScreen';

export type CommunityWithoutAvatar = Omit<ICommunity, 'avatarURL'>;
interface Params {
  name: string;
  platform: string;
  id: string;
  username?: string;
  profileImageUrl?: string;
  userId?: string;
  icon?: string;
  picture?: string;
  installationId?: string;
  account_login?: string;
  account_id?: string;
  account_avatar_url?: string;
  bot_id?: string;
  workspace_id?: string;
  workspace_name?: string;
  workspace_icon?: string;
  request_id?: string;
  owner_type?: string;
  owner_user_type?: string;
  owner_user_object?: string;
  owner_user_id?: string;
  owner_user_name?: string;
  owner_user_avatar_url?: string;
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
  const { showMessage } = useSnackbar();

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
    } else if (params.platform === 'google') {
      metadata.userId = params.userId;
      metadata.name = params.name;
      metadata.picture = params.picture;
      metadata.id = params.id;
    } else if (params.platform === 'github') {
      metadata.installationId = params.installationId;
      metadata.account = {
        login: params.account_login,
        id: params.account_id,
        avatarUrl: params.account_avatar_url,
      };
    } else if (params.platform === 'notion') {
      metadata.userId = params.userId;
      metadata.workspace_id = params.workspace_id;
      metadata.workspace_name = params.workspace_name;
      metadata.workspace_icon = params.workspace_icon;
      metadata.bot_id = params.bot_id;
      metadata.request_id = params.request_id;
      metadata.owner = {
        type: params.owner_type,
        user: {
          type: params.owner_user_type,
          object: params.owner_user_object,
          id: params.owner_user_id,
          name: params.owner_user_name,
          avatar_url: params.owner_user_avatar_url,
        },
      };
    }

    const payload = {
      name: params.platform,
      community: community.id,
      metadata: metadata,
    };

    try {
      const data = await createNewPlatform(payload);
      if (!data) {
        router.push('/community-settings');
      }
      if (params.platform === 'google') {
        showMessage('Google Drive authorized successfully.', 'success');
        router.push('/community-settings');
      } else if (params.platform === 'github') {
        showMessage('Github authorized successfully.', 'success');
        router.push('/community-settings');
      } else if (params.platform === 'notion') {
        showMessage('Notion authorized successfully.', 'success');
        router.push('/community-settings');
      } else {
        router.push(`/community-settings/?platformId=${data.id}`);
      }
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
        console.log('Settings user to local storage - 1');
        StorageService.writeLocalStorage('user', params);
        fetchCommunities();

        break;

      case StatusCode.REPEATED_DISCORD_AUTHORIZATION_ATTEMPT:
        setMessage(
          'You have authorized before and are trying to authorize again.'
        );
        console.log('Settings user to local storage - 2');
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

      case StatusCode.GDRIVE_AUTHORIZATION_SUCCESSFUL:
        setMessage('Google Drive authorization successful.');
        handleCreateNewPlatform(params);
        break;

      case StatusCode.GDRIVE_AUTHORIZATION_FAILURE:
        setMessage('Google Drive authorization failed.');
        router.push('/community-settings');
        break;

      case StatusCode.TWITTER_AUTHORIZATION_SUCCESSFUL:
        setMessage('Authorizion complete from settings page.');
        handleCreateNewPlatform(params);
        break;

      case StatusCode.TWITTER_AUTHORIZATION_FAILURE:
        setMessage('Twitter Authorization failed.');
        router.push('/community-settings');
        break;

      case StatusCode.DISCORD_AUTHORIZATION_FAILURE_FROM_SETTINGS:
        setMessage('Discord Authorization during setup on setting faield.');
        router.push('/community-settings');
        break;

      case StatusCode.ANNOUNCEMENTS_PERMISSION_FAILURE:
        setMessage('Announcements grant write permissions faield.');
        router.push('/announcements');
        break;

      case StatusCode.ANNOUNCEMENTS_PERMISSION_SUCCESS:
        setMessage('Announcements grant write permissions success.');
        router.push('/announcements');
        break;

      case StatusCode.GITHUB_AUTHORIZATION_SUCCESSFUL:
        setMessage('Github authorization successful.');
        handleCreateNewPlatform(params);
        break;

      case StatusCode.GITHUB_AUTHORIZATION_FAILURE:
        setMessage('Github authorization failed.');
        router.push('/community-settings');
        break;

      case StatusCode.NOTION_AUTHORIZATION_SUCCESSFUL:
        setMessage('Notion authorization successful.');
        handleCreateNewPlatform(params);
        break;

      case StatusCode.NOTION_AUTHORIZATION_FAILURE:
        setMessage('Notion authorization failed.');
        router.push('/community-settings');
        break;

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

  return <LoadingScreen />
}

export default Callback;
