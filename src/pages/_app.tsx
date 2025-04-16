import React, { useEffect } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import type { AppProps } from 'next/app';
import { hotjar } from 'react-hotjar';

import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

type ComponentWithPageLayout = AppProps & {
  Component: AppProps['Component'] & {
    pageLayout?: React.ComponentType | any;
  };
};

import { ThemeProvider } from '@mui/material';
import {
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Script from 'next/script';
import { ToastContainer } from 'react-toastify';
import { WagmiProvider } from 'wagmi';

import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';

import { wagmiConfig } from '@/rainbowKitConfig';

import AmplitudeAnalytics from '../components/global/AmplitudeAnalytics';
import { conf } from '../configs';
import { ChannelProvider } from '../context/ChannelContext';
import { TokenProvider } from '../context/TokenContext';
import { usePageViewTracking } from '../helpers/amplitudeHelper';
import PrivateRoute from '../utils/privateRoute';
import { theme } from '../utils/theme';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: ComponentWithPageLayout) {

  usePageViewTracking();

  useEffect(() => {
    // Get Hotjar ID from configuration
    const HOTJAR_ID: string | undefined = conf.HOTJAR_ID;

    // Initialize Hotjar tracking in production environment
    if (process.env.NODE_ENV === 'production' && HOTJAR_ID) {
      const hotjarIdAsNumber = parseInt(HOTJAR_ID, 10);
      hotjar.initialize(hotjarIdAsNumber, 6);
    }
  }, []);

  return (
    <>
      <AmplitudeAnalytics />
      <Script id='tawk' strategy='lazyOnload'>
        {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/${conf.PROPERTY_ID}/${conf.WEIGHT_ID}';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })();
        `}
      </Script>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={lightTheme({
              accentColor: '#804EE1',
              accentColorForeground: 'white',
              borderRadius: 'medium',
            })}
          >
            <ThemeProvider theme={theme}>
              <TokenProvider>
                <ChannelProvider>
                  {Component.pageLayout ? (
                    <PrivateRoute>
                      <Component.pageLayout>
                        <Component {...pageProps} />
                      </Component.pageLayout>
                    </PrivateRoute>
                  ) : (
                    <Component {...pageProps} />
                  )}
                </ChannelProvider>
              </TokenProvider>
            </ThemeProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
      <ToastContainer />
    </>
  );
}
