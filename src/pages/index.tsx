import React from 'react';
import { Stack } from '@mui/material';
import Image from 'next/image';

import SwitchPlatform from '@/components/layouts/SwitchPlatform';

import emptyState from '../assets/svg/empty-state.svg';
import EmptyState from '../components/global/EmptyState';
import SEO from '../components/global/SEO';
import ActiveMemberComposition from '../components/pages/pageIndex/ActiveMemberComposition';
import HeatmapChart from '../components/pages/pageIndex/HeatmapChart';
import MemberInteractionGraph from '../components/pages/pageIndex/MemberInteractionGraph';
import { useToken } from '../context/TokenContext';
import { defaultLayout } from '../layouts/defaultLayout';
import { withRoles } from '../utils/withRoles';

export const availablePlatforms = ['discord', 'discourse', 'telegram'];

function Index(): JSX.Element {

  const { community } = useToken();

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

  return (
    <>
      <SEO />
      <div className='container flex flex-col justify-between space-y-8 px-4 py-4 md:px-12'>
        <div className='block'>
          <Stack
            direction={{
              xs: 'column',
              md: 'row',
            }}
            justifyContent='space-between'
            alignItems={{ xs: 'flex-start', md: 'center' }}
            gap={2}
            pb={2}
          >
            <Stack direction='row' alignItems='center' gap={2}>
              <h3 className='whitespace-nowrap text-lg font-medium text-lite-black'>
                Community Insights
              </h3>{' '}
              <SwitchPlatform />
            </Stack>
          </Stack>

          <div className='space-y-4'>
            <ActiveMemberComposition />
            <HeatmapChart />
            <MemberInteractionGraph />
          </div>
        </div>
      </div>
    </>
  );
}

Index.pageLayout = defaultLayout;

export default withRoles(Index, ['view', 'admin']);
