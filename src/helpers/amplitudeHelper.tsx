import { useEffect } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';

import { StorageService } from '../services/StorageService';
import {
  IDiscordModifiedCommunity,
  ITrackEventParams,
} from '../utils/interfaces';
import { IToken } from '../utils/types';

export const setAmplitudeUserIdFromToken = () => {
  const token: IToken | undefined =
    StorageService.readLocalStorage<IToken>('user');

  const decodedToken = token?.accessToken
    ? jwt_decode<any>(token.accessToken)
    : null;

  if (decodedToken?.sub) {
    amplitude.setUserId(decodedToken.sub?.id);
  }
};

export const trackAmplitudeEvent = async ({
  eventType,
  eventProperties,
  callback,
}: ITrackEventParams) => {
  try {
    amplitude
      .track({
        event_type: eventType,
        event_properties: eventProperties,
      })
      .promise.then(function (result) {
        if (callback) {
          callback({
            event: result.event,
            code: result.code,
            message: result.message,
          });
        }
      })
  } catch (e) {
    console.error(e);
  }
};

export function usePageViewTracking() {
  const router = useRouter();

  useEffect(() => {
    const community =
      StorageService.readLocalStorage<IDiscordModifiedCommunity>('community');

    function trackPageView(url: string) {
      const queryParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(queryParams.entries());

      amplitude.track('PAGE_VIEW', {
        path: url,
        communityId: community?.id,
        communityName: community?.name,
        ...params,
      });
    }

    trackPageView(window.location.pathname + window.location.search);

    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);
}
