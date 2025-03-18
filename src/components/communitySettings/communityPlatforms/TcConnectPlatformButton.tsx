import React from 'react';
import { Button, Paper, Stack } from '@mui/material';
import { BiPlus } from 'react-icons/bi';

import { IntegrationPlatform } from '@/utils/enums';
import { IPlatformProps } from '@/utils/interfaces';

import TcCommunityPlatformIcon from './TcCommunityPlatformIcon';

interface TcConnectPlatformButtonProps {
  platform: IntegrationPlatform;
  connectedPlatforms: IPlatformProps[];
  handleConnectPlatform: () => void;
}

function TcConnectPlatformButton({
  platform,
  connectedPlatforms,
  handleConnectPlatform,
}: TcConnectPlatformButtonProps) {

  return (
    <Paper className='flex h-[6rem] w-[10rem] flex-col items-center justify-center rounded-sm py-2 shadow-none'>
      <Stack
        className='pb-1'
        sx={{
          backgroundColor: 'transparent',
          color: 'inherit',
        }}
      >
        <TcCommunityPlatformIcon platform={platform} size={32} />
      </Stack>
      <Button
        className='text-sm'
        startIcon={<BiPlus />}
        onClick={handleConnectPlatform}
        disabled={connectedPlatforms?.length > 0}
      >
        Connect
      </Button>
    </Paper>
  );
}

export default TcConnectPlatformButton;
