'use client';

import React, { useEffect, useState } from 'react';
import { FiShare2 } from 'react-icons/fi';

import GaugeChart from '@/components/global/GaugeChart';
import SimpleBackdrop from '@/components/global/LoadingBackdrop';
import SEO from '@/components/global/SEO';
import TcBoxContainer from '@/components/shared/TcBox/TcBoxContainer';

import useAppStore from '@/store/useStore';

import { useSnackbar } from '@/context/SnackbarContext';

const ScorePage = () => {
  const { showMessage } = useSnackbar();
  const { retrieveReputationScore } = useAppStore();

  const [communityName, setCommunityName] = useState<string | null>(null);
  const [reputationScore, setReputationScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReputationScore = async (tokenId: string, address: string) => {
      setLoading(true);
      setError(null);

      try {
        const score = await retrieveReputationScore({ tokenId, address });

        setReputationScore(score.reputationScore ?? 0);
        setCommunityName(score.communityName);
      } catch (err) {
        console.error('Error fetching reputation score:', err);
        setError('Failed to fetch reputation score.');
      } finally {
        setLoading(false);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const tokenId = params.get('tokenId');
    const address = params.get('address');

    if (!tokenId || !address) {
      setError('Invalid URL format. Missing tokenId or address.');
      setLoading(false);
      return;
    }

    fetchReputationScore(tokenId, address);
  }, [retrieveReputationScore]);

  const gaugeOptions = {
    chart: {
      type: 'solidgauge',
      backgroundColor: 'transparent',
    },
    title: {
      text: null,
    },
    pane: {
      startAngle: -90,
      endAngle: 90,
      background: {
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc',
      },
    },
    tooltip: {
      enabled: false,
    },
    yAxis: {
      min: 0,
      max: 100,
      stops: [
        [0.1, '#DF5353'],
        [0.5, '#DDDF0D'],
        [0.9, '#55BF3B'],
      ],
      lineWidth: 0,
      tickWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      labels: {
        y: 16,
        style: {
          fontSize: '14px',
        },
      },
    },
    series: [
      {
        name: 'Score',
        data: [reputationScore ? parseFloat(reputationScore.toFixed(1)) : 0],
        tooltip: {
          valueSuffix: ' /100',
        },
      },
    ],
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        showMessage('URL copied to clipboard.', 'success');
      })
      .catch(() => {
        showMessage('Failed to copy URL to clipboard.', 'error');
      });
  };

  if (loading) {
    return <SimpleBackdrop />;
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-100'>
        <div className='max-w-xl rounded-lg bg-white p-6 shadow-lg'>
          <h1 className='text-2xl font-bold text-red-600'>Error</h1>
          <p className='mt-4 text-gray-600'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO titleTemplate='Daily Report Reputation Score' />

      <div className='flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4'>
        <TcBoxContainer
          className='w-full max-w-xl rounded-lg border border-gray-200 bg-white shadow-lg'
          contentContainerChildren={
            <div className='space-y-4 p-5'>
              <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>Reputation Score</h1>
                <button
                  onClick={handleShare}
                  className='text-primary-600 rounded-full bg-primary-100 p-2 hover:bg-primary-200'
                  aria-label='Share Score'
                >
                  <FiShare2 size={24} />
                </button>
              </div>
              <p className='text-gray-600'>
                Your reputation score is calculated based on your activity in
                the community. A higher score indicates greater trustworthiness
                and active participation.
              </p>
            </div>
          }
        />

        <div className='mt-4 w-full max-w-xl overflow-hidden'>
          <TcBoxContainer
            className='rounded-lg border border-gray-200 bg-white shadow-lg'
            contentContainerChildren={
              <div className='flex flex-col items-center space-y-6 py-10'>
                <GaugeChart options={gaugeOptions} />
                <p className='text-center text-sm text-gray-500'>
                  Your score is dynamically calculated from platform activity on{' '}
                  <b>{communityName}</b>
                </p>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default ScorePage;
