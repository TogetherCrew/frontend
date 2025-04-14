import axios from 'axios';
import { toast } from 'react-toastify';

import { conf } from './configs/index';
import { tokenRefreshEventEmitter } from './services/EventEmitter';
import { StorageService } from './services/StorageService';
import { IToken } from './utils/types';

let isRefreshing = false;

export const axiosInstance = axios.create({
  baseURL: conf.API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config: any) => {
    const user: IToken | undefined =
      StorageService.readLocalStorage<IToken>('user');

    if (user) {
      const { accessToken } = user;

      if (accessToken) {
        config.headers!['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    switch (error.response.status) {
      case 400:
        toast.error(`${error.response.data.message}`, {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
        });
        break;
      case 401:
        const user: IToken | undefined =
          StorageService.readLocalStorage<IToken>('user');

        if (
          error.response?.status === 401 &&
          error.config.url?.endsWith('/auth/refresh-tokens')
        ) {
          StorageService.removeLocalStorage('user');
          StorageService.removeLocalStorage('community');
          toast.error('Session expired. Please log in again.', {
            position: 'bottom-left',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
          });
          if (typeof window !== 'undefined') {
            // Use window object here
            window.location.href = '/';
          }
        } else if (
          !error.config.url?.endsWith('/auth/refresh-tokens') &&
          user
        ) {
          const { refreshToken } = user;

          if (refreshToken && !isRefreshing) {
            isRefreshing = true;

            try {
              const response = await axiosInstance.post(
                '/auth/refresh-tokens',
                {
                  refreshToken: refreshToken,
                }
              );

              StorageService.writeLocalStorage('user', {
                accessToken: response.data.access.token,
                refreshToken: response.data.refresh.token,
              });

              axiosInstance.defaults.headers['Authorization'] =
                'Bearer ' + response.data.access.token;

              // When the refresh is successful, notify listeners
              tokenRefreshEventEmitter.emit(
                'tokenRefresh',
                response.data.access.token
              );

              return axiosInstance(error.config);
            } catch (error) {
              // Handle refresh failure
              StorageService.removeLocalStorage('user');
              StorageService.removeLocalStorage('analysis_state');

              window.location.href = '/';
            } finally {
              isRefreshing = false;
            }
          } else if (refreshToken && isRefreshing) {
            // If a refresh is already in progress, listen for the completion event
            return new Promise((resolve, reject) => {
              tokenRefreshEventEmitter.subscribe('tokenRefresh', (newToken) => {
                error.config.headers['Authorization'] = `Bearer ${newToken}`;
                resolve(axiosInstance(error.config));
              });
            });
          }
        } else {
          // Handle no user case
          StorageService.removeLocalStorage('user');
          StorageService.removeLocalStorage('analysis_state');
          toast.error('Token expired...', {
            position: 'bottom-left',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
          });
          window.location.href = '/';
        }
        break;
      case 404:
        toast.error(`${error.response.data.message}`, {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
        });
        break;
      case 440:
        StorageService.removeLocalStorage('user');
        StorageService.removeLocalStorage('analysis_state');
        toast.error(`${error.response.data.message}`, {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
        });
        window.location.href = '/';
        break;
      case 500:
        toast.error(`${error.response.data.message}`, {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
        });
        break;
      case 590:
        toast.error(`${error.response.data.message}`, {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
        });
        break;

      default:
        break;
    }
    return Promise.reject(error);
  }
);
