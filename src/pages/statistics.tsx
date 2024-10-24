/* eslint-disable react/jsx-key */
import { Box } from '@mui/material';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineLeft } from 'react-icons/ai';

import emptyState from '../assets/svg/empty-state.svg';
import { PREMIUM_GUILDS } from '../components/communitySettings/communityPlatforms/TcDiscordIntegrationSettingsDialog';
import CustomTab from '../components/global/CustomTab';
import EmptyState from '../components/global/EmptyState';
import Link from '../components/global/Link';
import SimpleBackdrop from '../components/global/LoadingBackdrop';
import SEO from '../components/global/SEO';
import ActiveMembersComposition from '../components/pages/statistics/ActiveMembersComposition';
import DisengagedMembersComposition from '../components/pages/statistics/DisengagedMembersComposition';
import InactiveMembers from '../components/pages/statistics/InactiveMembers';
import InteractionsSection from '../components/pages/statistics/InteractionsSection';
import Onboarding from '../components/pages/statistics/Onboarding';
import { useToken } from '../context/TokenContext';
import { transformToMidnightUTC } from '../helpers/momentHelper';
import { defaultLayout } from '../layouts/defaultLayout';
import useAppStore from '../store/useStore';
import { withRoles } from '../utils/withRoles';

const Statistics = () => {
  const { community } = useToken();
  const router = useRouter();

  const platform = community?.platforms.find(
    (platform) =>
      platform.disconnectedAt === null && platform.name === 'discord'
  );

  const isPremiumGuild: boolean = Boolean(
    platform?.metadata?.id && PREMIUM_GUILDS.includes(platform.metadata.id)
  );

  const tabMap: { [key: string]: string } = {
    activeMembers: '1',
    disengagedMembers: '2',
  };

  const reverseTabMap: { [key: string]: string } = {
    '1': 'activeMembers',
    '2': 'disengagedMembers',
  };

  const [loading, setLoading] = useState<boolean>(true);
  const [activeMemberDate, setActiveMemberDate] = useState(1);
  const [onBoardingMemberDate, setOnBoardingMemberDate] = useState(1);
  const [activeInteractionDate, setActiveInteractionDate] = useState(1);
  const [disengagedMemberDate, setDisengagedMemberDate] = useState(1);
  const [inactiveMembersDate, setInactiveMembersDate] = useState(1);
  const {
    fetchInteractions,
    fetchActiveMembers,
    fetchDisengagedMembers,
    fetchInactiveMembers,
    fetchOnboardingMembers,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<string>(
    tabMap[router.query.tab as string] || '1'
  );

  useEffect(() => {
    if (!router.isReady) return;

    const handleRouteChange = () => {
      setActiveTab(tabMap[router.query.tab as string] || '1');
    };

    handleRouteChange();

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.isReady, router.query.tab]);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: string
  ): void => {
    if (newValue in reverseTabMap) {
      const urlTabIdentifier = reverseTabMap[newValue];
      router.push(`/statistics?tab=${urlTabIdentifier}`, undefined, {
        shallow: true,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!platform?.id) {
          return;
        }

        setLoading(true);

        if (activeTab === '1') {
          const activeDateRange = getDateRange(activeMemberDate);
          const onBoardingMemberDateRange = getDateRange(onBoardingMemberDate);
          const activeIntegrationDateRange = getDateRange(
            activeInteractionDate
          );

          await fetchActiveMembers(
            platform?.id,
            activeDateRange[0],
            activeDateRange[1]
          );
          await fetchInteractions(
            platform?.id,
            activeIntegrationDateRange[0],
            activeIntegrationDateRange[1]
          );
          await fetchOnboardingMembers(
            platform?.id,
            onBoardingMemberDateRange[0],
            onBoardingMemberDateRange[1]
          );
        } else {
          const disengagedDateRange = getDateRange(disengagedMemberDate);
          const inactiveMemberDateRange = getDateRange(inactiveMembersDate);

          await fetchDisengagedMembers(
            platform?.id,
            disengagedDateRange[0],
            disengagedDateRange[1]
          );
          await fetchInactiveMembers(
            platform?.id,
            inactiveMemberDateRange[0],
            inactiveMemberDateRange[1]
          );
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (!platform?.id) {
      return;
    }

    const activeDateRange = getDateRange(activeMemberDate);
    fetchActiveMembers(platform?.id, activeDateRange[0], activeDateRange[1]);
  }, [activeMemberDate]);

  useEffect(() => {
    if (!platform?.id) {
      return;
    }

    const onBoardingMemberDateRange = getDateRange(onBoardingMemberDate);

    fetchOnboardingMembers(
      platform?.id,
      onBoardingMemberDateRange[0],
      onBoardingMemberDateRange[1]
    );
  }, [onBoardingMemberDate]);

  useEffect(() => {
    if (!platform?.id) {
      return;
    }

    const activeIntegrationDateRange = getDateRange(activeInteractionDate);

    fetchInteractions(
      platform?.id,
      activeIntegrationDateRange[0],
      activeIntegrationDateRange[1]
    );
  }, [activeInteractionDate]);

  useEffect(() => {
    if (!platform?.id) {
      return;
    }

    const disengagedDateRange = getDateRange(disengagedMemberDate);

    fetchDisengagedMembers(
      platform?.id,
      disengagedDateRange[0],
      disengagedDateRange[1]
    );
  }, [disengagedMemberDate]);

  useEffect(() => {
    if (!platform?.id) {
      return;
    }

    const inactiveMemberDateRange = getDateRange(inactiveMembersDate);

    fetchInactiveMembers(
      platform?.id,
      inactiveMemberDateRange[0],
      inactiveMemberDateRange[1]
    );
  }, [inactiveMembersDate]);

  const getDateRange = (dateRangeType: number): string[] => {
    let endDate: moment.Moment = moment().subtract(1, 'day');
    let startDate: moment.Moment = moment(endDate).subtract(7, 'days');

    switch (dateRangeType) {
      case 1:
        startDate = moment(endDate).subtract(7, 'days');
        endDate = moment().subtract(1, 'day');
        break;
      case 2:
        startDate = moment(endDate).subtract(1, 'months');
        endDate = moment().subtract(1, 'day');
        break;
      case 3:
        startDate = moment(endDate).subtract(3, 'months');
        endDate = moment().subtract(1, 'day');
        break;
      case 4:
        startDate = moment(endDate).subtract(6, 'months');
        endDate = moment().subtract(1, 'day');
        break;
      case 5:
        startDate = moment(endDate).subtract(1, 'year');
        endDate = moment().subtract(1, 'day');
        break;
      default:
        break;
    }

    return [
      transformToMidnightUTC(startDate).toString(),
      transformToMidnightUTC(endDate).toString(),
    ];
  };

  const handleActiveMembersDateRange = (dateRangeType: number) => {
    setActiveMemberDate(dateRangeType);
  };

  const handleOnboardingMembersDate = (dateRangeType: number) => {
    setOnBoardingMemberDate(dateRangeType);
  };

  const handleActiveInteractionDate = (dateRangeType: number) => {
    setActiveInteractionDate(dateRangeType);
  };

  const handleDisengagedMemberDateRange = (dateRangeType: number) => {
    setDisengagedMemberDate(dateRangeType);
  };

  const handleInactiveMemberDateRange = (dateRangeType: number) => {
    setInactiveMembersDate(dateRangeType);
  };

  if (!community || community?.platforms?.length === 0) {
    return (
      <>
        <SEO />
        <EmptyState image={<Image alt='Image Alt' src={emptyState} />} />
      </>
    );
  }

  if (loading) {
    return <SimpleBackdrop />;
  }

  return (
    <>
      <SEO
        titleTemplate={
          activeTab === '1' ? 'Active Members' : 'Disengaged Members'
        }
      />
      <div className='container flex flex-col justify-between px-4 py-3 md:px-12'>
        <Link to='/' className='mb-3'>
          <div className='flex items-center text-base text-gray-subtitle hover:text-black'>
            <AiOutlineLeft />
            <span className='pl-1'>Community Insights</span>
          </div>
        </Link>{' '}
        <CustomTab
          activeTab={activeTab}
          onTabChange={handleTabChange}
          labels={['Active members', 'Disengaged members']}
          content={[
            <div className='flex flex-col space-y-4'>
              <Box
                sx={{
                  typography: 'body5',
                  borderRadius: '0px 14px 14px 14px;',
                }}
                className='rounded-md p-6 shadow-lg'
              >
                <ActiveMembersComposition
                  activePeriod={activeMemberDate}
                  isPremiumGuild={isPremiumGuild}
                  handleDateRange={handleActiveMembersDateRange}
                />
              </Box>
              <Box
                sx={{
                  typography: 'body5',
                  borderRadius: '0px 14px 14px 14px;',
                }}
                className='rounded-md p-6 shadow-lg'
              >
                <Onboarding
                  activePeriod={onBoardingMemberDate}
                  isPremiumGuild={isPremiumGuild}
                  handleDateRange={handleOnboardingMembersDate}
                />
              </Box>
              <Box
                sx={{
                  typography: 'body5',
                  borderRadius: '0px 14px 14px 14px;',
                }}
                className='rounded-md p-6 shadow-lg'
              >
                <InteractionsSection
                  activePeriod={activeInteractionDate}
                  isPremiumGuild={isPremiumGuild}
                  handleDateRange={handleActiveInteractionDate}
                />
              </Box>
            </div>,
            <div className='flex flex-col space-y-4'>
              <Box
                sx={{
                  typography: 'body5',
                  borderRadius: '0px 14px 14px 14px;',
                }}
                className='rounded-md p-6 shadow-lg'
              >
                <DisengagedMembersComposition
                  activePeriod={disengagedMemberDate}
                  isPremiumGuild={isPremiumGuild}
                  handleDateRange={handleDisengagedMemberDateRange}
                />
              </Box>
              <Box
                sx={{
                  typography: 'body5',
                  borderRadius: '0px 14px 14px 14px;',
                }}
                className='mb-4 p-6 shadow-lg'
              >
                <InactiveMembers
                  activePeriod={inactiveMembersDate}
                  isPremiumGuild={isPremiumGuild}
                  handleDateRange={handleInactiveMemberDateRange}
                />
              </Box>
            </div>,
          ]}
        />
      </div>
    </>
  );
};

Statistics.pageLayout = defaultLayout;

export default withRoles(Statistics, ['view', 'admin']);
