import React, { useEffect, useState } from 'react';
import { Link, Stack, Typography } from '@mui/material';
import moment from 'moment';
import Image from 'next/image';
import router from 'next/router';
import { BsPlus } from 'react-icons/bs';
import { MdCalendarMonth } from 'react-icons/md';

import EmptyState from '@/components/global/EmptyState';

import emptyState from '@/assets/svg/empty-state.svg';

import { availablePlatforms } from '..';
import TcAnnouncementsAlert from '../../components/announcements/TcAnnouncementsAlert';
import TcAnnouncementsTable from '../../components/announcements/TcAnnouncementsTable';
import TcTimeZone from '../../components/announcements/TcTimeZone';
import SimpleBackdrop from '../../components/global/LoadingBackdrop';
import SEO from '../../components/global/SEO';
import TcBoxContainer from '../../components/shared/TcBox/TcBoxContainer';
import TcButton from '../../components/shared/TcButton';
import TcDatePickerPopover from '../../components/shared/TcDatePickerPopover';
import TcPagination from '../../components/shared/TcPagination';
import { useToken } from '../../context/TokenContext';
import { defaultLayout } from '../../layouts/defaultLayout';
import { StorageService } from '../../services/StorageService';
import useAppStore from '../../store/useStore';
import {
  FetchedData,
  IDiscordModifiedCommunity,
  IPlatformProps,
} from '../../utils/interfaces';
import { withRoles } from '../../utils/withRoles';

function Index() {
  const { retrieveAnnouncements, retrievePlatformById } = useAppStore();

  const { community } = useToken();

  const [loading, setLoading] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const communityId =
    StorageService.readLocalStorage<IDiscordModifiedCommunity>('community')?.id;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedZone, setSelectedZone] = useState(moment.tz.guess());
  const [dateTimeDisplay, setDateTimeDisplay] = useState<string>('Filter Date');

  const [page, setPage] = useState(1);

  const platformId = community?.platforms.find(
    (platform) =>
      platform.disconnectedAt === null && platform.name === 'discord'
  )?.id;

  const [announcementsPermissions, setAnnouncementsPermissions] =
    useState<boolean>(true);

  const fetchPlatform = async () => {
    if (platformId) {
      try {
        setLoading(true);
        const data: IPlatformProps = await retrievePlatformById(platformId);
        const { metadata } = data;

        if (metadata) {
          const announcements = metadata.permissions.Announcement;
          const allPermissionsTrue = Object.values(announcements).every(
            (value) => value === true
          );

          setAnnouncementsPermissions(allPermissionsTrue);
        }
        setLoading(false);
      } catch (error) {
      } finally {
        setLoading(false);
        if (isFirstLoad) setIsFirstLoad(false);
      }
    }
  };

  useEffect(() => {
    fetchPlatform();
  }, [platformId]);

  const [fetchedAnnouncements, setFetchedAnnouncements] = useState<FetchedData>(
    {
      limit: 8,
      page: page,
      results: [],
      totalPages: 0,
      totalResults: 0,
    }
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-time-popover' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setPage(1);
      const fullDateTime = moment(date);
      setDateTimeDisplay(fullDateTime.format('D MMMM YYYY'));

      setAnchorEl(null);
    }
  };

  const resetDateFilter = () => {
    setSelectedDate(null);
    setDateTimeDisplay('Filter Date');

    setAnchorEl(null);
  };

  const fetchData = async (date?: Date | null, zone?: string) => {
    if (!platformId) return;
    try {
      setLoading(true);

      let startDate: string = '';
      let endDate: string = '';
      if (date) {
        startDate = moment(date)
          .tz(zone || selectedZone)
          .startOf('day')
          .utcOffset(0, true)
          .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        endDate = moment(date)
          .tz(zone || selectedZone)
          .endOf('day')
          .utcOffset(0, true)
          .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      }
      const data = await retrieveAnnouncements(platformId, {
        page: page,
        limit: 8,
        timeZone: zone || selectedZone,
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
        community: communityId,
      });

      setFetchedAnnouncements(data);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedDate, selectedZone);
  }, [selectedZone, selectedDate, page]);

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

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

  if (isFirstLoad && loading) {
    return <SimpleBackdrop />;
  }

  return (
    <>
      <SEO titleTemplate='Announcements' />
      {!announcementsPermissions && <TcAnnouncementsAlert />}
      <div className='container flex flex-col px-4 py-4 md:px-12'>
        <TcBoxContainer
          contentContainerChildren={
            <div className='flex max-h-[97dvh] min-h-[97dvh] flex-col justify-between space-y-4 p-4 md:p-10 bg-base-100'>
              <div className='min-h-[calc(100vh-100px)] flex-grow overflow-auto'>
                <div className='flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0'>
                  <Stack spacing={1}>
                    <Typography variant='h5'>
                      Announcement Scheduling
                    </Typography>
                    <Typography variant='body2' className='text-left'>
                      smart announcements allow you to send targeted messages to
                      specific user segments.{' '}
                      <Link
                        className='font-bold'
                        color='primary'
                        href='https://togethercrew.gitbook.io/onboarding/~/changes/NV24DFt4YIMi4FKjX30S/features/smart-announcements'
                        target='_blank'
                      >
                        Learn more
                      </Link>
                    </Typography>
                  </Stack>
                  <TcButton
                    text='Create Announcement'
                    startIcon={<BsPlus />}
                    variant='contained'
                    onClick={() =>
                      router.push('/announcements/create-new-announcements')
                    }
                  />
                </div>
                <div className='mt-8 mb-4 flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0'>
                  <TcButton
                    variant='outlined'
                    startIcon={<MdCalendarMonth />}
                    onClick={handleClick}
                    text={dateTimeDisplay}
                    aria-describedby={id}
                  />
                  <TcDatePickerPopover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                    onResetDate={resetDateFilter}
                  />
                  <TcTimeZone handleZone={setSelectedZone} />
                </div>
                {fetchedAnnouncements &&
                  fetchedAnnouncements.results.length > 0 ? (
                  <div className='overflow-x-scroll md:overflow-x-auto'>
                    <TcAnnouncementsTable
                      announcements={
                        fetchedAnnouncements.results
                          ? fetchedAnnouncements.results
                          : []
                      }
                      handleRefreshList={fetchData}
                      isLoading={loading}
                      selectedZone={selectedZone}
                    />
                  </div>
                ) : (
                  <div className='mx-auto flex h-[65dvh] w-9/12 flex-col justify-center text-center md:w-4/12'>
                    <Typography variant='h6' fontWeight='bold'>
                      No announcements yet
                    </Typography>
                    <Typography
                      variant='body2'
                      className='text-gray-400'
                    >
                      Your announcements will show up for the month and timezone
                      selected once you create them{' '}
                    </Typography>
                  </div>
                )}
              </div>
              <div className='sticky bottom-0 min-h-[70px] bg-white px-4 py-2'>
                {fetchedAnnouncements &&
                  fetchedAnnouncements.totalResults > 8 && (
                    <div className='flex justify-end'>
                      <TcPagination
                        totalItems={fetchedAnnouncements.totalResults}
                        itemsPerPage={Math.ceil(
                          fetchedAnnouncements.totalResults /
                          fetchedAnnouncements.totalPages
                        )}
                        currentPage={page}
                        onChangePage={handlePageChange}
                      />
                    </div>
                  )}
              </div>
            </div>
          }
        />
      </div>
    </>
  );
}

Index.pageLayout = defaultLayout;

export default withRoles(Index, ['admin']);
