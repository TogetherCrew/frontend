/* eslint-disable no-case-declarations */
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Paper, Tab, Tabs } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/router';

import { MediaWikiModuleForm } from '@/components/settings/modules/mediawiki/Form';

import TcHivemindDiscordAnswering from './TcHivemindDiscordAnswering';
import TcHivemindDiscordLearnings from './TcHivemindDiscordLearnings';
import TcHivemindGithub from './TcHivemindGithub';
import TcHivemindGoogle from './TcHivemindGoogle';
import TcHivemindNotion from './TcHivemindNotion';
import TcHivemindWebsite from './TcHivemindWebsite';
import TcCommunityPlatformIcon from '../communityPlatforms/TcCommunityPlatformIcon';
import TcAvatar from '../../shared/TcAvatar';
import TcButton from '../../shared/TcButton';
import TcText from '../../shared/TcText';
import { conf } from '../../../configs';
import { useSnackbar } from '../../../context/SnackbarContext';
import { truncateCenter } from '../../../helpers/helper';
import { StorageService } from '../../../services/StorageService';
import useAppStore from '../../../store/useStore';
import { IntegrationPlatform } from '../../../utils/enums';
import {
  IDiscordModifiedCommunity,
  IMediaWikiModuleFormPayload,
  IModuleProps,
  IPlatformProps,
} from '../../../utils/interfaces';

interface TcTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TcTabPanelProps) {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const PLATFORM_ORDER = [
  IntegrationPlatform.Discord,
  IntegrationPlatform.Github,
  IntegrationPlatform.Notion,
  IntegrationPlatform.MediaWiki,
  IntegrationPlatform.Website,
  IntegrationPlatform.Discourse,
  IntegrationPlatform.Telegram,
  IntegrationPlatform.X,
  IntegrationPlatform.Snapshot,
  IntegrationPlatform.GDrive,
];

function HivemindSettings() {
  const { retrievePlatforms, retrieveModules, patchModule } = useAppStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [activePlatform, setActivePlatform] = useState<number>(0);
  const [_isActivePlatformLoading, setIsActivePlatformLoading] =
    useState<boolean>(false);
  const [platform, setPlatform] = useState<number>(0);
  const [platforms, setPlatforms] = useState<IPlatformProps[]>([]);
  const [hivemindModule, setHivemindModule] = useState<IModuleProps>();

  const { showMessage } = useSnackbar();

  const [hivemindPayload, setHivemindPayload] = useState<{
    learning: {
      selectedChannels: string[];
      fromDate: string;
    };
    answering: {
      selectedChannels: string[];
    };
  }>({
    learning: {
      selectedChannels: [],
      fromDate: '',
    },
    answering: {
      selectedChannels: [],
    },
  });

  const router = useRouter();

  const fetchPlatformsByType = async () => {
    const communityId =
      StorageService.readLocalStorage<IDiscordModifiedCommunity>(
        'community'
      )?.id;

    const hivemindModules = await retrieveModules({
      community: communityId,
      name: 'hivemind',
    });
    switch (activePlatform) {
      case 0:
        setIsActivePlatformLoading(true);
        const { results } = await retrievePlatforms({
          name: 'discord',
          community: communityId,
        });
        const discordHivemindModule = hivemindModules.results.find(
          (hivemindModule: IModuleProps) =>
            hivemindModule.community === communityId
        );

        setHivemindModule(discordHivemindModule);
        setPlatforms(results);
        setIsActivePlatformLoading(false);
        break;
      case 1:
        setIsActivePlatformLoading(true);
        const { results: googleResults } = await retrievePlatforms({
          name: 'github',
          community: communityId,
        });
        const githubHivemindModule = hivemindModules.results.find(
          (hivemindModule: IModuleProps) =>
            hivemindModule.community === communityId
        );

        setHivemindModule(githubHivemindModule);
        setPlatforms(googleResults);
        setIsActivePlatformLoading(false);
        break;

      case 2:
        setIsActivePlatformLoading(true);
        const { results: githubResults } = await retrievePlatforms({
          name: 'notion',
          community: communityId,
        });
        const notionHivemindModule = hivemindModules.results.find(
          (hivemindModule: IModuleProps) =>
            hivemindModule.community === communityId
        );

        setHivemindModule(notionHivemindModule);
        setPlatforms(githubResults);
        setIsActivePlatformLoading(false);
        break;

      case 3:
        setIsActivePlatformLoading(true);
        const { results: mediaWikiResults } = await retrievePlatforms({
          name: 'mediaWiki',
          community: communityId,
        });

        const mediaWikiHivemindModule = hivemindModules.results.find(
          (hivemindModule: IModuleProps) =>
            hivemindModule.community === communityId
        );

        setHivemindModule(mediaWikiHivemindModule);
        setPlatforms(mediaWikiResults);
        setIsActivePlatformLoading(false);
        break;

      case 4:
        setIsActivePlatformLoading(true);
        const { results: websiteResults } = await retrievePlatforms({
          name: 'website',
          community: communityId,
        });

        const websiteHivemindModule = hivemindModules.results.find(
          (hivemindModule: IModuleProps) =>
            hivemindModule.community === communityId
        );

        setHivemindModule(websiteHivemindModule);
        setPlatforms(websiteResults);
        setIsActivePlatformLoading(false);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    fetchPlatformsByType();
  }, [platform, activePlatform]);

  const handleLearningConfigUpdate = (config: {
    selectedChannels: string[];
    fromDate: string;
  }) => {
    setHivemindPayload((prevState) => {
      return {
        ...prevState,
        learning: {
          ...config,
        },
      };
    });
  };

  const handleAnsweringConfigUpdate = (config: {
    selectedChannels: string[];
  }) => {
    setHivemindPayload((prevState) => {
      return {
        ...prevState,
        answering: {
          ...config,
        },
      };
    });
  };

  const handlePatchModule = async (
    moduleType: 'discord' | 'google' | 'github' | 'notion' | 'mediaWiki' | 'website',
    payload?: any
  ) => {
    try {
      if (!hivemindModule) return;

      let patchPayload = {};

      setLoading(true);
      if (moduleType === 'discord') {
        patchPayload = {
          platforms: [
            {
              platform: platforms[platform].id,
              name: 'discord',
              metadata: {
                ...hivemindPayload,
              },
            },
          ],
        };
      } else if (moduleType === 'google') {
        patchPayload = {
          platforms: [
            {
              platform: platforms[platform].id,
              name: 'google',
              metadata: {
                ...payload,
              },
            },
          ],
        };
      } else if (moduleType === 'github') {
        patchPayload = {
          platforms: [
            {
              platform: platforms[platform].id,
              name: 'github',
              metadata: {
                activated: payload,
              },
            },
          ],
        };
      } else if (moduleType === 'notion') {
        patchPayload = {
          platforms: [
            {
              platform: platforms[platform].id,
              name: 'notion',
              metadata: {
                ...payload,
              },
            },
          ],
        };
      } else if (moduleType === 'mediaWiki') {
        patchPayload = {
          platforms: [
            {
              platform: platforms[platform].id,
              name: 'mediaWiki',
              metadata: {
                ...payload,
              },
            },
          ],
        };
      } else if (moduleType === 'website') {
        patchPayload = {
          platforms: [
            {
              platform: platforms[platform].id,
              name: 'website',
              metadata: {
                activated: payload,
              },
            },
          ],
        };
      }
      const data = await patchModule({
        moduleId: hivemindModule.id,
        payload: patchPayload,
      });

      console.log(data);

      if (data) {
        showMessage('AI assistant module updated successfully', 'success');
        await fetchPlatformsByType();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformContent = (platform: IPlatformProps) => {
    let src = '';
    let text = '';

    switch (platform.name) {
      case 'discord':
        src = `${conf.DISCORD_CDN}icons/${platform.metadata.id}/${platform.metadata.icon}`;
        text = platform.metadata.name;
        break;
      case 'github':
        src = `${platform?.metadata?.account?.avatarUrl}`;
        text = platform?.metadata?.account?.login;
        break;
      case 'google':
        src = `${platform.metadata.picture}`;
        text = platform?.metadata?.name;
        break;
      case 'notion':
        src = `${platform?.metadata?.owner?.user?.avatar_url}`;
        text = platform?.metadata?.owner?.user?.name;
        break;
      case 'mediaWiki':
        src = '';
        text = truncateCenter(
          platform?.metadata?.baseURL.replace('https://', ''),
          15
        );
        break;
      case 'website':
        src = '';
        text = `${platform?.metadata?.resources?.length || 0} websites`;
        break;
      default:
        src = '';
        text = '';
        break;
    }
    return { src, text };
  };

  return (
    <>
      <div className='bg-gray-100 px-5 py-4'>
        <Tabs
          orientation='horizontal'
          variant='scrollable'
          value={activePlatform}
          onChange={(event, newValue) => setActivePlatform(newValue)}
        >
          {PLATFORM_ORDER.map((platform, index) => (
            <Tab
              className={clsx(
                'mr-3 min-h-[6rem] min-w-[10rem] rounded-sm shadow-lg',
                activePlatform === index
                  ? 'bg-secondary/80 text-white'
                  : !['Discord', 'Github', 'Notion', 'MediaWiki', 'Website'].includes(
                    platform
                  )
                    ? 'bg-white'
                    : 'bg-white text-black'
              )}
              key={index}
              label={
                <div className='flex flex-col items-center space-x-2'>
                  <TcCommunityPlatformIcon platform={platform} />
                  <TcText text={platform} variant='body2' />
                  {platform === IntegrationPlatform.GDrive && (
                    <TcText
                      variant='caption'
                      className='text-gray-300'
                      text='Coming soon'
                    />
                  )}
                </div>
              }
              disabled={
                !['Discord', 'Github', 'Notion', 'MediaWiki', 'Website'].includes(platform)
              }
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </div>
      <div className='bg-gray-100 px-5 py-4'>
        {platforms && platforms.length > 0 ? (
          <Tabs
            orientation='horizontal'
            variant='scrollable'
            value={platform}
            onChange={(event, newValue) => setPlatform(newValue)}
          >
            {platforms.map((platform, index) => {
              const { src, text } = getPlatformContent(platform);
              return (
                <Tab
                  className='mr-3 max-h-[6rem] min-h-[6rem] min-w-[10rem] max-w-[10rem] rounded-sm bg-white shadow-lg'
                  key={index}
                  label={
                    <div className='flex flex-col items-center space-x-2 space-y-2'>
                      <TcAvatar src={src} sizes='small' />
                      <TcText text={text} variant='body2' />
                    </div>
                  }
                  {...a11yProps(index)}
                />
              );
            })}
          </Tabs>
        ) : (
          <div className='flex justify-center py-8'>
            <TcText text='No platforms connected' variant='body2' />
          </div>
        )}
      </div>

      <Paper className='shadow-none'>
        {activePlatform === 0 && (
          <TabPanel value={activePlatform} index={0}>
            {platforms && platforms.length > 0 && (
              <>
                <div className='flex flex-col items-center justify-between md:flex-row md:space-x-5'>
                  <TcHivemindDiscordLearnings
                    platform={
                      platforms &&
                      platforms.filter(
                        (platform) =>
                          platform.disconnectedAt === null &&
                          platform.name === 'discord'
                      )[0]
                    }
                    defaultLearningModuleConfig={
                      hivemindModule?.options?.platforms[0]?.metadata?.learning
                    }
                    handleModuleConfigChange={handleLearningConfigUpdate}
                  />
                  <TcHivemindDiscordAnswering
                    platform={
                      platforms &&
                      platforms.filter(
                        (platform) =>
                          platform.disconnectedAt === null &&
                          platform.name === 'discord'
                      )[0]
                    }
                    defaultAnsweringModuleConfig={
                      hivemindModule?.options?.platforms[0]?.metadata?.answering
                    }
                    handleModuleConfigChange={handleAnsweringConfigUpdate}
                  />
                </div>
                <div className='mt-6 flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0'>
                  <TcButton
                    text='Cancel'
                    variant='outlined'
                    className='md:w-1/4'
                    onClick={() => router.push('/community-settings')}
                  />
                  <TcButton
                    text={
                      loading ? (
                        <CircularProgress size={20} color='inherit' />
                      ) : (
                        'Save Changes'
                      )
                    }
                    variant='contained'
                    className='md:w-1/4'
                    disabled={hivemindPayload?.learning?.fromDate === ''}
                    onClick={() => handlePatchModule('discord')}
                  />
                </div>
              </>
            )}
          </TabPanel>
        )}
        {activePlatform === 1 && (
          <TabPanel value={activePlatform} index={1}>
            {platforms && platforms.length > 0 && (
              <TcHivemindGithub
                defaultGithubHivemindConfig={
                  hivemindModule?.options?.platforms.find(
                    (platform) => platform.name === 'github'
                  )?.metadata || { activated: false }
                }
                handlePatchHivemindGithub={(payload) =>
                  handlePatchModule('github', payload)
                }
                isLoading={loading}
              />
            )}
          </TabPanel>
        )}
        {activePlatform === 2 && (
          <TabPanel value={activePlatform} index={2}>
            {platforms && platforms.length > 0 && (
              <TcHivemindNotion
                isLoading={loading}
                defaultNotionHivemindConfig={
                  hivemindModule?.options?.platforms.find(
                    (platform) => platform.name === 'notion'
                  )?.metadata || { databaseIds: [], pageIds: [] }
                }
                handlePatchHivemindNotion={(payload) =>
                  handlePatchModule('notion', payload)
                }
              />
            )}
          </TabPanel>
        )}
        {activePlatform === 3 && (
          <TabPanel value={activePlatform} index={3}>
            {platforms && platforms.length > 0 && (
              <MediaWikiModuleForm
                isLoading={loading}
                payload={hivemindModule?.options?.platforms.find(
                  (platform) => platform.name === 'mediaWiki'
                )?.metadata as IMediaWikiModuleFormPayload || { activated: false }}
                patch={(payload) => handlePatchModule('mediaWiki', payload)}
              />
            )}
          </TabPanel>
        )}
        {activePlatform === 4 && (
          <TabPanel value={activePlatform} index={4}>
            {platforms && platforms.length > 0 && (
              <TcHivemindWebsite
                isLoading={loading}
                defaultWebsiteHivemindConfig={
                  hivemindModule?.options?.platforms.find(
                    (platform) => platform.name === 'website'
                  )?.metadata || { activated: false }
                }
                handlePatchHivemindWebsite={(payload: any) => {
                  console.log(payload);
                  handlePatchModule('website', payload);
                }}
              />
            )}
          </TabPanel>
        )}
        {activePlatform === 5 && (
          <TabPanel value={activePlatform} index={5}>
            {platforms && platforms.length > 0 && (
              <TcHivemindGoogle
                defaultGoogleHivemindConfig={
                  hivemindModule?.options?.platforms.find(
                    (platform) => platform.name === 'google'
                  )?.metadata || { driveIds: [], folderIds: [], fileIds: [] }
                }
                handlePatchHivemindGoogle={(payload) =>
                  handlePatchModule('google', payload)
                }
                isLoading={loading}
              />
            )}
          </TabPanel>
        )}
      </Paper>
    </>
  );
}

export default HivemindSettings;
