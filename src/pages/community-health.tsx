import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import Image from 'next/image';

import EmptyState from '@/components/global/EmptyState';
import SimpleBackdrop from '@/components/global/LoadingBackdrop';
import SEO from '@/components/global/SEO';
import SwitchPlatform from '@/components/layouts/SwitchPlatform';
import Decentralization from '@/components/pages/communityHealth/Decentralization';
import Fragmentation from '@/components/pages/communityHealth/Fragmentation';
import HeaderSection from '@/components/pages/communityHealth/HeaderSection';

import useAppStore from '@/store/useStore';

import { useToken } from '@/context/TokenContext';
import { defaultLayout } from '@/layouts/defaultLayout';
import {
  IDecentralisationScoreResponse,
  IFragmentationScoreResponse,
} from '@/utils/interfaces';
import { withRoles } from '@/utils/withRoles';

import { availablePlatforms } from '.';
import emptyState from '../assets/svg/empty-state.svg';

function CommunityHealth() {
  const { community, selectedPlatform } = useToken();
  const { getDecentralisation, getFragmentation, isLoading } = useAppStore();
  const [decentralisationScoreData, setDecentralisationScoreData] =
    useState<IDecentralisationScoreResponse | null>(null);
  const [fragmentationScoreData, setFragmentationScoreData] =
    useState<IFragmentationScoreResponse | null>(null);

  useEffect(() => {
    const platformId = community?.platforms.find(
      (platform) => platform.id === selectedPlatform
    )?.id;

    if (platformId) {
      setDecentralisationScoreData(null);
      setFragmentationScoreData(null);
      Promise.all([
        getDecentralisation(platformId),
        getFragmentation(platformId),
      ]).then(([decentralisationRes, fragmentationRes]) => {
        setDecentralisationScoreData(decentralisationRes);
        setFragmentationScoreData(fragmentationRes);
      });
    }
  }, [getDecentralisation, getFragmentation, selectedPlatform]);

  const hasActivePlatform = community?.platforms?.some(
    ({ name, disconnectedAt }) =>
      availablePlatforms.includes(name) && disconnectedAt === null
  );

  if (!hasActivePlatform) {
    return (
      <>
        <SEO />
        <EmptyState image={<Image alt='Image Alt' src={emptyState} />} />
      </>
    );
  }

  if (isLoading) {
    return <SimpleBackdrop />;
  }

  return (
    <>
      <SEO titleTemplate='Community Health' />
      <div className='container flex flex-col justify-between space-y-4 px-4 py-3 md:px-12'>
        <HeaderSection />
        <Stack
          direction={{
            xs: 'column',
            md: 'row',
          }}
          justifyContent='space-between'
          alignItems={{ xs: 'flex-start', md: 'center' }}
          gap={2}
        >
          <Stack direction='row' alignItems='center' gap={2}>
            <h3 className='whitespace-nowrap text-lg font-medium text-lite-black'>
              Community Health
            </h3>{' '}
            <SwitchPlatform />
          </Stack>
        </Stack>
        <Fragmentation scoreData={fragmentationScoreData} />
        <Decentralization scoreData={decentralisationScoreData} />
      </div>
    </>
  );
}

CommunityHealth.pageLayout = defaultLayout;

export default withRoles(CommunityHealth, ['view', 'admin']);
