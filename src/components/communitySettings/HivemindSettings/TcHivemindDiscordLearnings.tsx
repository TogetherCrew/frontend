import React, { useEffect, useState } from 'react'
import TcText from '../../shared/TcText'
import TcIconWithTooltip from '../../shared/TcIconWithTooltip'
import TcButton from '../../shared/TcButton'
import { TbRefresh } from 'react-icons/tb'
import { Channel } from '../../../context/ChannelContext'
import { TreeItem, TreeView } from '@mui/lab'
import { MdCalendarMonth, MdExpandMore } from "react-icons/md";
import { MdChevronRight } from "react-icons/md";
import { FormControlLabel } from '@mui/material'
import TcSwitch from '../../shared/TcSwitch'
import { IPlatformProps } from '../../../utils/interfaces'
import useAppStore from '../../../store/useStore'
import Loading from '../../global/Loading'
import TcDatePickerPopover from '../../shared/TcDatePickerPopover'
import moment from 'moment'

interface TcHivemindDiscordLearningsProps {
    platform: IPlatformProps;
    defaultLearningModuleConfig?: {
        selectedChannels: string[];
        fromDate: string;
    } | null;
    handleModuleConfigChange: (config: {
        selectedChannels: string[];
        fromDate: string;
    }) => void;
}

function TcHivemindDiscordLearnings({ platform, defaultLearningModuleConfig, handleModuleConfigChange }: TcHivemindDiscordLearningsProps) {
    const { retrievePlatformProperties } = useAppStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
    const [discordPlatformChannels, setDiscordPlatformChannels] = useState<Channel[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [dateTimeDisplay, setDateTimeDisplay] = useState<string>('Filter Date');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const fetchDiscordPlatformProperties = async () => {
        try {
            if (!platform) return;
            setIsLoading(true);
            const { selectedChannels } = platform.metadata;

            setSelectedChannels(selectedChannels);

            if (defaultLearningModuleConfig) {
                setSelectedDate(new Date(defaultLearningModuleConfig.fromDate));
                setDateTimeDisplay(moment(defaultLearningModuleConfig.fromDate).format('D MMMM YYYY'));
                setSelectedChannels(defaultLearningModuleConfig.selectedChannels);
            }

            const data = await retrievePlatformProperties({
                platformId: platform.id
            })

            setDiscordPlatformChannels(data)
            setIsLoading(false);
        } catch (error) {
            console.log('Error fetching discord platform properties', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchDiscordPlatformProperties();
    }, [platform])

    const open = Boolean(anchorEl);
    const id = open ? 'date-time-popover' : undefined;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setSelectedDate(date);
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

    const handleToggleAllSubChannels = (channelId: string, checked: boolean) => {
        const channelIndex = discordPlatformChannels.findIndex(channel => channel.channelId === channelId);
        const subChannels = discordPlatformChannels[channelIndex].subChannels;
        const subChannelIds = subChannels.map(subChannel => subChannel.channelId);

        if (checked) {
            setSelectedChannels([...selectedChannels, ...subChannelIds]);
        } else {
            setSelectedChannels(selectedChannels.filter(channelId => !subChannelIds.includes(channelId)));
        }
    }

    const handleToggleChannelSubChannel = (channelId: string, subChannelId: string, checked: boolean) => {
        if (checked) {
            setSelectedChannels([...selectedChannels, subChannelId]);
        } else {
            setSelectedChannels(selectedChannels.filter(channelId => channelId !== subChannelId));
        }
    }


    useEffect(() => {
        console.log('selectedChannels', selectedChannels);
        console.log('selectedDate', selectedDate);

        handleModuleConfigChange({
            selectedChannels,
            fromDate: selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : ''
        });

    }, [selectedChannels, selectedDate])


    return (
        <div className='w-1/2'>
            <div className='flex items-center'>
                <TcText text="Learnings" variant='h6' />
                <TcIconWithTooltip
                    tooltipText='select the channels and sources from which the Hivemind AI will gather information to answer questions.'
                />
            </div>
            <div className='bg-gray-50 rounded-md p-4 border border-gray-400 h-[23rem] overflow-y-scroll'>
                <div className='flex items-center justify-between mb-2'>
                    <TcText text="Select the data extraction period" variant='h6' />
                    <div className='flex items-center space-x-1.5'>
                        <TcIconWithTooltip
                            tooltipText='select the date from which data will be analysed and fed to Hivemind. We recommend 3 months to start.'
                        />
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
                    </div>
                </div>
                <div className='flex items-center justify-between'>
                    <TcText text="Sync the following data sources" variant='h6' />
                    <TcButton text="Refresh List" variant='outlined' className='bg-white' startIcon={<TbRefresh />} onClick={() => fetchDiscordPlatformProperties()} />
                </div>
                {
                    isLoading ? (
                        <div className='flex justify-center items-center h-60'>
                            <Loading />
                        </div>
                    ) : (
                        <TreeView
                            defaultCollapseIcon={<MdExpandMore />}
                            defaultExpandIcon={<MdChevronRight />}
                        >
                            {
                                discordPlatformChannels.map((channel, index) => (
                                    <TreeItem key={index} nodeId={channel.channelId} label={
                                        <div className='flex justify-between items-center'>
                                            <TcText text={channel.title} variant='h6' fontWeight='bold' />
                                            <FormControlLabel
                                                control={<TcSwitch checked={
                                                    channel.subChannels.every(subChannel => selectedChannels.includes(subChannel.channelId))
                                                }
                                                    disabled={
                                                        channel.subChannels.some(subChannel => !subChannel.canReadMessageHistoryAndViewChannel)
                                                    }
                                                    onChange={(e) => handleToggleAllSubChannels(channel.channelId, e.target.checked)}
                                                />
                                                }
                                                label="Enable All"
                                            />
                                        </div>
                                    } >
                                        {
                                            channel.subChannels.map((subChannel, index) => (
                                                <TreeItem key={index} nodeId={subChannel.channelId} label={
                                                    <div className='flex justify-between items-center'>
                                                        <TcText text={subChannel.name} variant='subtitle1' />
                                                        <FormControlLabel
                                                            control={<TcSwitch
                                                                checked={selectedChannels.includes(subChannel.channelId)}
                                                                disabled={!subChannel.canReadMessageHistoryAndViewChannel}
                                                                onChange={(e) => handleToggleChannelSubChannel(channel.channelId, subChannel.channelId, e.target.checked)}
                                                            />}
                                                            label="Enable"
                                                        />
                                                    </div>
                                                } />
                                            ))
                                        }
                                    </TreeItem>
                                ))
                            }
                        </TreeView>
                    )
                }
            </div>
        </div>
    )
}

export default TcHivemindDiscordLearnings