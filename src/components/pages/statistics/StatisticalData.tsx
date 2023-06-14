import { Tooltip } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { RxArrowTopRight, RxArrowBottomRight } from 'react-icons/rx';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { StatisticsProps } from '../../../utils/interfaces';

type StatisticalDataProps = {
  statistics: StatisticsProps[];
  hideInformationText?: boolean;
};

const StatisticalData: React.FC<StatisticalDataProps> = ({
  statistics,
  hideInformationText,
}) => {
  return (
    <>
      <div
        className={clsx(
          'flex flex-row my-1 space-x-1',
          statistics.length > 3 ? 'justify-between' : 'justify-start'
        )}
      >
        {statistics.map((stat) => (
          <div
            className={clsx(
              'flex flex-col flex-1 text-center justify-center relative rounded-2xl',
              stat.description
                ? 'min-w-full h-[200px] md:min-w-[100px] xl:min-w-[220px] md:max-w-[280px] md:h-[200px]'
                : 'min-w-full h-[170px] md:min-w-[100px] xl:min-w-[280px] md:max-w-[280px] md:h-[180px]',
              stat.customBackground ? 'bg-gray-hover' : ''
            )}
            key={stat.label}
          >
            <span
              className={clsx(
                'absolute top-0 right-0 px-2 py-1 m-2 flex items-center justify-center rounded-md text-white text-xs z-10',
                stat.percentageChange >= 0 ? ' bg-purple-light' : 'bg-black'
              )}
            >
              {stat.percentageChange > 0 ? (
                <RxArrowTopRight size={'15px'} />
              ) : stat.percentageChange < 0 ? (
                <RxArrowBottomRight size={'15px'} />
              ) : (
                ''
              )}{' '}
              <span className="pt-0.5">
                {typeof stat?.percentageChange === 'number'
                  ? stat?.percentageChange.toFixed(0) + '%'
                  : stat?.percentageChange}
              </span>
            </span>
            <span className="text-4xl font-bold pb-1">{stat.value ?? 0}</span>
            <div className="flex items-center justify-center">
              <div
                className={clsx(
                  'rounded-full w-3.5 h-3.5 mr-2',
                  stat.colorBadge
                )}
              />
              <span className="text-base flex items-center">
                {stat.label}
                {stat.hasTooltip && (
                  <Tooltip title={stat.tooltipText} arrow placement="bottom">
                    <span>
                      <AiOutlineExclamationCircle
                        size={'18px'}
                        className="mx-auto ml-1"
                      />
                    </span>
                  </Tooltip>
                )}
              </span>
            </div>
            {stat.description && (
              <span className="text-sm text-center text-gray-custom px-5 pt-2">
                {stat.description}
              </span>
            )}
          </div>
        ))}
      </div>
      {hideInformationText ? (
        ''
      ) : (
        <div className="flex flex-row space-x-3 items-center mt-3 mb-12">
          <div className=" flex flex-row justify-center  items-center bg-purple-light text-white rounded w-12">
            <RxArrowTopRight size={'18px'} /> %
          </div>
          <div className=" flex flex-row justify-center  items-center bg-gray-custom text-white rounded w-12">
            <RxArrowBottomRight size={'18px'} /> %
          </div>
          <p className="text-sm">% compared to the last week</p>
        </div>
      )}
    </>
  );
};

StatisticalData.defaultProps = {
  statistics: [
    {
      label: '',
      value: 0,
      description: '',
      percentageChange: 0,
      colorBadge: '',
      hasTooltip: false,
      tooltipText: '',
    },
  ],
  hideInformationText: false,
};

export default StatisticalData;
