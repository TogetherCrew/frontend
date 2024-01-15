import React, { useContext, useEffect, useState } from 'react';
import { defaultLayout } from '../../layouts/defaultLayout';
import SEO from '../../components/global/SEO';
import TcBoxContainer from '../../components/shared/TcBox/TcBoxContainer';
import TcPublicMessageContainer from '../../components/announcements/create/publicMessageContainer/TcPublicMessageContainer';
import TcPrivateMessaageContainer from '../../components/announcements/create/privateMessaageContainer';
import TcButton from '../../components/shared/TcButton';
import TcScheduleAnnouncement from '../../components/announcements/create/scheduleAnnouncement/';
import TcSelectPlatform from '../../components/announcements/create/selectPlatform';
import TcBreadcrumbs from '../../components/shared/TcBreadcrumbs';
import router from 'next/router';
import TcConfirmSchaduledAnnouncementsDialog from '../../components/announcements/TcConfirmSchaduledAnnouncementsDialog';
import useAppStore from '../../store/useStore';
import { useToken } from '../../context/TokenContext';
import { ChannelContext } from '../../context/ChannelContext';

export type CreateAnnouncementsPayloadDataOptions =
  | { channelIds: string[]; userIds?: string[]; roleIds?: string[] }
  | { channelIds?: string[]; userIds: string[]; roleIds?: string[] }
  | { channelIds?: string[]; userIds?: string[]; roleIds: string[] };

export interface CreateAnnouncementsPayloadData {
  platformId: string;
  template: string;
  options: CreateAnnouncementsPayloadDataOptions;
}
export interface CreateAnnouncementsPayload {
  title: string;
  communityId: string;
  scheduledAt: string;
  draft: boolean;
  data: CreateAnnouncementsPayloadData[];
}

function CreateNewAnnouncements() {
  const { createNewAnnouncements, retrievePlatformById } = useAppStore();

  const { community } = useToken();

  const channelContext = useContext(ChannelContext);

  const { refreshData } = channelContext;

  const platformId = community?.platforms.find(
    (platform) => platform.disconnectedAt === null
  )?.id;

  const [publicAnnouncements, setPublicAnnouncements] =
    useState<CreateAnnouncementsPayloadData>();
  const [scheduledAt, setScheduledAt] = useState<string>();

  const fetchPlatformChannels = async () => {
    try {
      if (platformId) {
        const data = await retrievePlatformById(platformId);
        const { metadata } = data;
        if (metadata) {
          const { selectedChannels } = metadata;
          await refreshData(platformId, 'channel', selectedChannels, true);
        } else {
          await refreshData(platformId);
        }
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    if (!platformId) {
      return;
    }

    fetchPlatformChannels();
  }, [platformId]);

  const handleCreateAnnouncements = (isDrafted: boolean) => {
    if (!community) return;
    const announcementsPayload = {
      communityId: community.id,
      draft: isDrafted,
      scheduledAt: scheduledAt,
      data: [publicAnnouncements],
    };

    createNewAnnouncements(announcementsPayload);
  };
  return (
    <>
      <SEO titleTemplate="Create Announcement" />
      <div className="flex flex-col container px-4 md:px-12 py-4 space-y-3">
        <TcBreadcrumbs
          items={[
            { label: 'Announcement Scheduling', path: '/announcements' },
            { label: 'Create Announcement' },
          ]}
        />
        <TcBoxContainer
          contentContainerChildren={
            <div className="flex flex-col justify-between p-4 md:px-10 min-h-[92dvh]">
              <div className="space-y-4">
                <TcSelectPlatform isEdit={false} />
                <TcPublicMessageContainer
                  handlePublicAnnouncements={({
                    message,
                    selectedChannels,
                  }) => {
                    if (!platformId) return;
                    setPublicAnnouncements({
                      platformId: platformId,
                      template: message,
                      options: {
                        channelIds: selectedChannels.map(
                          (channel) => channel.id
                        ),
                      },
                    });
                  }}
                />
                <TcPrivateMessaageContainer />
                <TcScheduleAnnouncement
                  handleSchaduledDate={({ selectedTime }) => {
                    setScheduledAt(selectedTime);
                  }}
                />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center space-y-3 pt-6 md:pt-12">
                <TcButton
                  text="Cancel"
                  onClick={() => router.push('/announcements')}
                  variant="outlined"
                  sx={{
                    maxWidth: {
                      xs: '100%',
                      sm: '8rem',
                    },
                  }}
                />
                <div className="flex flex-col md:flex-row items-center md:space-x-3 w-full space-y-3 md:space-y-0 md:w-auto">
                  <TcButton
                    text="Save as Draft"
                    variant="outlined"
                    sx={{
                      maxWidth: {
                        xs: '100%',
                        sm: 'auto',
                      },
                    }}
                    onClick={() => handleCreateAnnouncements(true)}
                  />
                  <TcConfirmSchaduledAnnouncementsDialog
                    buttonLabel={'Create Announcement'}
                    selectedChannels={[]}
                    schaduledDate={''}
                  />
                </div>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
}

CreateNewAnnouncements.pageLayout = defaultLayout;

export default CreateNewAnnouncements;
