import React, { useEffect, useState } from 'react';
import { IoSettingsSharp } from 'react-icons/io5';
import { truncateCenter } from '../../../helpers/helper';
import TcButton from '../../shared/TcButton';
import { IPlatformProps } from '../../../utils/interfaces';
import TcDialog from '../../shared/TcDialog';
import TcText from '../../shared/TcText';
import TcCommunityPlatformIcon from './TcCommunityPlatformIcon';
import { MdCalendarMonth } from 'react-icons/md';
import TcDatePickerPopover from '../../shared/TcDatePickerPopover';
import moment from 'moment';
import { TreeItem, TreeView } from '@mui/lab';
import { MdExpandMore } from "react-icons/md";
import { MdChevronRight } from "react-icons/md";
import useAppStore from '../../../store/useStore';
import { Channel } from '../../../context/ChannelContext';
import TcSwitch from '../../shared/TcSwitch';
import { FormControlLabel } from '@mui/material';
import { useSnackbar } from '../../../context/SnackbarContext';
import { AiOutlineClose } from 'react-icons/ai';
import { RiTimeLine } from 'react-icons/ri';

interface TcDiscordIntegrationSettingsDialog {
    platform: IPlatformProps;
}
function TcDiscordIntegrationSettingsDialog({
    platform,
}: TcDiscordIntegrationSettingsDialog) {
    const { retrievePlatformProperties, patchPlatformById, deletePlatform } = useAppStore();
    const [open, setOpen] = useState<boolean>(false);
    const [isAnalyizingDialogOpen, setIsAnalyizingDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [dateTimeDisplay, setDateTimeDisplay] = useState<string>('Filter Date');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedChannels, setSelectedChannels] = useState<string[]>([])

    const [discordPlatformChannels, setDiscordPlatformChannels] = useState<Channel[]>([])
    const { showMessage } = useSnackbar();

    useEffect(() => {
        const fetchDiscordPlatformProperties = async () => {
            if (!platform) return;

            const { selectedChannels } = platform.metadata;

            setSelectedChannels(selectedChannels);

            const data = await retrievePlatformProperties({
                platformId: platform.id
            })
            setDiscordPlatformChannels(data)
        }
        fetchDiscordPlatformProperties();
    }, [platform])

    const handleToggleSubChannel = (event: React.ChangeEvent<HTMLInputElement>, channelId: string) => {
        event.stopPropagation();
        const currentIndex = selectedChannels.indexOf(channelId);

        const newSelectedChannel = [...selectedChannels];

        if (currentIndex === -1) {
            newSelectedChannel.push(channelId);
        } else {
            newSelectedChannel.splice(currentIndex, 1);
        }
        setSelectedChannels(newSelectedChannel);
    }

    const handleToggleAllChannelSubChannels = (event: React.ChangeEvent<HTMLInputElement>, channelId: string) => {
        event.stopPropagation();
        const newSelectedChannel = [...selectedChannels];

        const channel = discordPlatformChannels.find(channel => channel.channelId === channelId)

        if (channel) {
            if (channel.subChannels) {
                channel.subChannels.forEach(subChannel => {
                    const currentIndex = newSelectedChannel.indexOf(subChannel.channelId);

                    if (currentIndex === -1) {
                        newSelectedChannel.push(subChannel.channelId);
                    } else {
                        newSelectedChannel.splice(currentIndex, 1);
                    }
                })
            }
        }

        setSelectedChannels(newSelectedChannel);
    }

    const handlePatchDiscordIntegrationSettings = async () => {
        try {
            const data = await patchPlatformById({
                id: platform.id,
                metadata: {
                    selectedChannels: selectedChannels,
                    period: selectedDate?.toISOString(),
                    analyzerStartedAt: new Date().toISOString(),
                },
            });

            if (data) {
                setOpen(false);
                setIsAnalyizingDialogOpen(true);
            }
        } catch (error) { }
    }

    const handleDisconnectDiscordIntegration = async (deleteType: 'hard' | 'soft') => {
        try {
            const data = await deletePlatform({ id: platform.id, deleteType });
            if (data === '') {
                setIsDeleteDialogOpen(false);
                showMessage('Platform disconnected successfully.', 'success');
            }

        } catch (error) { }
    };

    const datePickerOpen = Boolean(anchorEl);
    const id = open ? 'date-time-popover' : undefined;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setSelectedDate(date);
            const fullDateTime = moment(date);
            setDateTimeDisplay(fullDateTime.format('D MMMM YYYY'));
            setAnchorEl(null);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const resetDateFilter = () => {
        setSelectedDate(null);
        setDateTimeDisplay('Filter Date');

        setAnchorEl(null);
    };

    return (
        <>
            <div className='mx-auto w-full text-center'>
                <TcButton
                    text={truncateCenter(platform.metadata.name, 10)}
                    className='w-10/12'
                    variant='text'
                    color='primary'
                    startIcon={<IoSettingsSharp />}
                    onClick={() => setOpen(true)}
                />
            </div>
            <TcDialog open={open}
                sx={{
                    '& .MuiDialog-container': {
                        '& .MuiPaper-root': {
                            width: '100%',
                            maxWidth: '600px',
                            borderRadius: '10px',
                        },
                    },
                }}
            >
                <div className='flex flex-col p-5'>
                    <div className='flex items-center space-x-3'>
                        <TcCommunityPlatformIcon platform='Discord' />
                        <div>
                            <TcText text={platform.metadata.name} variant='subtitle1' />
                            <TcText text='Discord Account Settings' variant='h6' fontWeight="bold" />
                        </div>
                    </div>
                    <div>
                        <TcText text='Change date period for data analysis' variant='subtitle1' fontWeight='bold' />
                        <TcText text='Choose the analysis start date (min. last 35 days for all the metrics to show properly).' variant='body2' />
                    </div>
                    <div className='w-1/3'>
                        <TcButton
                            className='w-full'
                            variant='outlined'
                            startIcon={<MdCalendarMonth />}
                            onClick={handleClick}
                            text={dateTimeDisplay}
                            aria-describedby={id}
                        />

                        <TcDatePickerPopover
                            open={datePickerOpen}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            selectedDate={selectedDate}
                            onDateChange={handleDateChange}
                            onResetDate={resetDateFilter}
                        />
                    </div>
                    <div className='flex justify-between items-center'>
                        <div>
                            <TcText text="Change your imported channels" variant='subtitle1' fontWeight='bold' />
                            <TcText text='Selected channels:0' variant='body1' />
                        </div>
                        <TcButton variant='outlined' text='Permissions?' />
                    </div>
                    <div className='h-72 max-h-72 overflow-y-scroll bg-gray-100 rounded-sm'>
                        <TreeView
                            defaultCollapseIcon={<MdExpandMore />}
                            defaultExpandIcon={<MdChevronRight />}
                        >
                            {
                                discordPlatformChannels && discordPlatformChannels.map((channel, index) => (
                                    <TreeItem nodeId={channel.channelId} label={
                                        <div className='flex justify-between items-center'>
                                            <TcText text={channel.title} variant='h6' fontWeight='bold' />
                                            <FormControlLabel
                                                control={<TcSwitch checked={
                                                    channel.subChannels.every(subChannel => selectedChannels.includes(subChannel.channelId))
                                                }
                                                    disabled={
                                                        channel.subChannels.some(subChannel => !subChannel.canReadMessageHistoryAndViewChannel)
                                                    }
                                                    onChange={(e) => handleToggleAllChannelSubChannels(e, channel.channelId)}
                                                />}
                                                label="Enable All"
                                            />
                                        </div>
                                    } key={index} >
                                        {
                                            channel.subChannels.map((subChannel, index) => (
                                                <TreeItem nodeId={subChannel.channelId} label={
                                                    <div className='flex justify-between items-center'>
                                                        <TcText text={subChannel.name} variant='subtitle1' />
                                                        <FormControlLabel
                                                            control={<TcSwitch
                                                                checked={selectedChannels.includes(subChannel.channelId)}
                                                                disabled={!subChannel.canReadMessageHistoryAndViewChannel}
                                                                onChange={(e) => handleToggleSubChannel(e, subChannel.channelId)}
                                                            />}
                                                            label="Enable"
                                                        />
                                                    </div>
                                                }
                                                    key={index} />
                                            ))
                                        }
                                    </TreeItem>
                                ))
                            }
                        </TreeView>
                    </div>
                    <div className='flex items-center justify-between mt-5'>
                        <TcButton
                            className='w-1/3'
                            text='Disconnect'
                            variant='outlined'
                            onClick={() => {
                                setOpen(false);
                                setIsDeleteDialogOpen(true)
                            }}
                        />
                        <TcButton
                            className='w-1/3'
                            text='Confirm'
                            variant='contained'
                            onClick={() => handlePatchDiscordIntegrationSettings()}
                        />
                    </div>
                </div>
            </TcDialog>
            <TcDialog
                open={isDeleteDialogOpen}
                fullScreen={false}
                sx={{
                    '& .MuiDialog-container': {
                        '& .MuiPaper-root': {
                            width: '100%',
                            maxWidth: '640px',
                            borderRadius: '10px',
                        },
                    },
                }}
            >
                <div className='flex justify-end p-4'>
                    <AiOutlineClose
                        className='cursor-pointer'
                        size={24}
                        onClick={() => setIsDeleteDialogOpen(false)}
                    />
                </div>
                <div className='px-4 text-center md:px-8'>
                    <div className='mx-auto text-center md:w-4/5'>
                        <TcText
                            text={`Are you sure you want to disconnect ${platform?.metadata.name}?`}
                            variant='h6'
                        />
                    </div>
                    <div className='flex flex-col justify-between space-y-4 pb-8 md:flex-row md:space-y-0 md:space-x-5 md:py-12'>
                        <div className='space-y-4 rounded-md px-4 py-6 shadow-xl'>
                            <TcText
                                text='Disconnect and delete data'
                                variant='body1'
                                fontWeight='bold'
                            />
                            <TcText
                                className='text-left'
                                text={
                                    <span>
                                        Importing activities and members will be stopped. Historical
                                        activities <b>will be deleted.</b>
                                    </span>
                                }
                                variant='body2'
                            />
                            <TcButton
                                text='Disconnect and delete'
                                variant='contained'
                                className='w-full'
                                onClick={() => handleDisconnectDiscordIntegration('hard')}
                            />
                        </div>
                        <div className='space-y-4 rounded-md px-4 py-6 shadow-xl'>
                            <TcText
                                text='Disconnect only'
                                variant='body1'
                                fontWeight='bold'
                            />
                            <TcText
                                className='text-left'
                                text={
                                    <span>
                                        Importing activities and members will be stopped. Historical
                                        activities <b>will not be affected.</b>
                                    </span>
                                }
                                variant='body2'
                            />
                            <TcButton
                                text='Disconnect'
                                variant='contained'
                                className='w-full'
                                onClick={() => handleDisconnectDiscordIntegration('soft')}
                            />
                        </div>
                    </div>
                </div>
            </TcDialog>
            <TcDialog open={isAnalyizingDialogOpen}
                sx={{
                    '& .MuiDialog-container': {
                        '& .MuiPaper-root': {
                            width: '100%',
                            maxWidth: '640px',
                            borderRadius: '10px',
                        },
                    },
                }}
            >
                <div className='flex justify-end p-4'>
                    <AiOutlineClose
                        className='cursor-pointer'
                        size={24}
                        onClick={() => setIsAnalyizingDialogOpen(false)}
                    />
                </div>
                <div className='mx-auto flex w-4/5 flex-col space-y-5 p-5 text-center'>
                    <div className='mx-auto w-16 rounded-full bg-[#F5F5F5] p-3'>
                        <RiTimeLine className='mx-auto' size={38} />
                    </div>
                    <TcText text="Perfect, you're all set!" variant='h5' />
                    <TcText
                        text='Data import just started. It might take up to 12 hours to finish. Once it is done we will send you a message on Discord.'
                        variant='body2'
                    />
                    <div className='py-6'>
                        <TcButton
                            text='I understand'
                            variant='contained'
                            onClick={() => setIsAnalyizingDialogOpen(false)}
                        />
                    </div>
                </div>
            </TcDialog>
        </>
    );
}

export default TcDiscordIntegrationSettingsDialog;
