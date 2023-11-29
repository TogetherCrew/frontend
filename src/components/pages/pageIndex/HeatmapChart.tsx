import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsHeatmap from 'highcharts/modules/heatmap';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import 'moment-timezone';
import NumberOfMessages from './NumberOfMessages';
import RangeSelect from '../../global/RangeSelect';
import ZonePicker from '../../global/ZonePicker';
import FilterByChannels from '../../global/FilterByChannels';
import useAppStore from '../../../store/useStore';
import { FiCalendar } from 'react-icons/fi';
import { communityActiveDates } from '../../../lib/data/dateRangeValues';
import { transformToMidnightUTC } from '../../../helpers/momentHelper';
import { useToken } from '../../../context/TokenContext';
import { defaultHeatmapChartOptions } from '../../../lib/data/heatmap';
import { ChannelContext } from '../../../context/ChannelContext';
import { extractTrueSubChannelIds } from '../../../helpers/helper';
import { StorageService } from '../../../services/StorageService';
import { ICommunity } from '../../../utils/interfaces';
import Loading from '../../global/Loading';

if (typeof Highcharts === 'object') {
  HighchartsHeatmap(Highcharts);
}

const HeatmapChart = () => {
  const channelContext = useContext(ChannelContext);

  const { selectedSubChannels, refreshData } = channelContext;

  const { fetchHeatmapData, retrievePlatformById } = useAppStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeDateRange, setActiveDateRange] = useState(1);
  const [selectedZone, setSelectedZone] = useState(moment.tz.guess());
  const [heatmapChartOptions, setHeatmapChartOptions] = useState(
    defaultHeatmapChartOptions
  );

  const defaultEndDate = moment().subtract(1, 'day');
  const defaultStartDate = moment(defaultEndDate).subtract(7, 'days');

  const [dateRange, setDateRange] = useState<
    [string | moment.Moment, string | moment.Moment]
  >([
    transformToMidnightUTC(defaultStartDate).toString(),
    transformToMidnightUTC(defaultEndDate).toString(),
  ]);

  const { community } = useToken();

  const platformId = community?.platforms[0];

  const fetchData = async () => {
    setLoading(true);
    try {
      if (platformId) {
        await fetchHeatmapData(
          platformId,
          dateRange[0],
          dateRange[1],
          selectedZone,
          extractTrueSubChannelIds(selectedSubChannels)
        );
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformChannels();
    fetchData();
  }, []);

  const handleSelectedZone = (zone: string) => {
    setSelectedZone(zone);
  };

  const handleDateRange = (dateRangeType: number): void => {
    let endDate: moment.Moment = moment().subtract(1, 'day');
    let startDate: moment.Moment = moment(endDate).subtract(7, 'days');

    switch (dateRangeType) {
      case 1:
        setActiveDateRange(dateRangeType);
        startDate = moment(endDate).subtract(7, 'days');
        endDate = moment().subtract(1, 'day');
        break;
      case 2:
        setActiveDateRange(dateRangeType);
        startDate = moment(endDate).subtract(1, 'months');
        endDate = moment().subtract(1, 'day');
        break;
      case 3:
        setActiveDateRange(dateRangeType);
        startDate = moment(endDate).subtract(3, 'months');
        endDate = moment().subtract(1, 'day');
        break;
      case 4:
        setActiveDateRange(dateRangeType);
        startDate = moment(endDate).subtract(6, 'months');
        endDate = moment().subtract(1, 'day');
        break;
      case 5:
        setActiveDateRange(dateRangeType);
        startDate = moment(endDate).subtract(1, 'year');
        endDate = moment().subtract(1, 'day');
        break;
      default:
        break;
    }

    if (startDate && endDate) {
      setDateRange([
        transformToMidnightUTC(startDate).toString(),
        transformToMidnightUTC(endDate).toString(),
      ]);
    }
  };

  const handleFetchHeatmapByChannels = () => {
    console.log('dsss');

    fetchData();
  };

  const fetchPlatformChannels = async () => {
    try {
      const community =
        StorageService.readLocalStorage<ICommunity>('community');

      const id = community?.platforms[0];

      if (id) {
        const data = await retrievePlatformById(id);
        const { metadata } = data;
        if (metadata) {
          const { selectedChannels } = metadata;
          await refreshData(id, 'channel', selectedChannels);
        } else {
          await refreshData(id);
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
    fetchData();
  }, [dateRange, selectedZone]);

  return (
    <div className="bg-white shadow-box rounded-lg p-5 min-h-[400px]">
      <div className="flex flex-col md:flex-row justify-between items-baseline">
        <div className="px-3">
          <h3 className="font-bold text-xl md:text-2xl">
            When is the community most active?
          </h3>
          <p className="text-md md:text-base pt-4 text-gray-700 font-light">
            Hourly messages summed over the selected time period.
          </p>
        </div>
        <div className="flex flex-col-reverse px-2.5 w-full md:w-auto md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <RangeSelect
            options={communityActiveDates}
            icon={<FiCalendar size={18} />}
            active={activeDateRange}
            onClick={handleDateRange}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-start md:justify-between items-center md:py-2 px-3">
        <div className="flex flex-col md:flex-row md:space-x-3 md:mt-3 w-full">
          <div className="flex flex-wrap">
            <ZonePicker
              selectedZone={selectedZone}
              handleSelectedZone={handleSelectedZone}
            />
          </div>
          <div className="flex flex-wrap">
            <FilterByChannels
              handleFetchHeatmapByChannels={handleFetchHeatmapByChannels}
            />
          </div>
        </div>
        <div className="hidden md:block">
          <NumberOfMessages />
        </div>
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-30 z-10">
            <Loading size={40} height="440px" />
          </div>
        )}

        <div className={loading ? 'opacity-50' : ''}>
          <HighchartsReact
            highcharts={Highcharts}
            options={heatmapChartOptions}
            allowChartUpdate
          />
        </div>
      </div>

      <div className="block ml-3 md:hidden">
        <NumberOfMessages />
      </div>
    </div>
  );
};

export default HeatmapChart;
