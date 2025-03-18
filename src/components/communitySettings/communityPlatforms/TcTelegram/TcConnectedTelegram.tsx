import React, { useState } from 'react';
import { Paper } from '@mui/material';
import { IoSettingsSharp } from 'react-icons/io5';

import TcAvatar from '@/components/shared/TcAvatar';
import TcButton from '@/components/shared/TcButton';

import useAppStore from '@/store/useStore';

import { useSnackbar } from '@/context/SnackbarContext';
import { truncateCenter } from '@/helpers/helper';
import { IPlatformProps } from '@/utils/interfaces';

import TcConnectedTelegramDialog from './TcConnectedTelegramDialog';
import TcDisconnectPlatform from '../TcDisconnectPlatform';

interface TcConnectedTelegramProps {
  platforms: IPlatformProps[];
  handleUpdateCommunityPlatform: () => void;
}

const TcConnectedTelegram: React.FC<TcConnectedTelegramProps> = ({
  platforms,
  handleUpdateCommunityPlatform,
}) => {
  const { deletePlatform, setTelegram } = useAppStore();
  const { showMessage } = useSnackbar();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDisconnectDialog, setOpenDisconnectDialog] =
    useState<boolean>(false);

  const handleOpenDisconnectDialog = () => {
    setOpenDialog(false);
    setOpenDisconnectDialog(true);
  };

  const handleDisconnectPlatform = async (type: 'hard' | 'soft') => {
    try {
      const data = await deletePlatform({
        id: platforms[0]?.id,
        deleteType: type,
      });
      if (data === '') {
        showMessage('Platform disconnected successfully.', 'success');
        setOpenDisconnectDialog(false);
        handleUpdateCommunityPlatform();
        setTelegram({
          value: null,
          expiresAt: null,
        });
      }
    } catch (error) {
      showMessage('Error disconnecting platform.', 'error');
    }
  };

  return (
    <div className='flex flex-row space-x-3'>
      {platforms &&
        platforms[0]?.name === 'telegram' &&
        platforms.map((platform, index) => (
          <Paper
            className='flex h-[6rem] w-[10rem] flex-col items-center justify-center space-y-1.5 overflow-hidden rounded-sm py-2 shadow-none'
            key={index}
          >
            <TcAvatar sx={{ width: 32, height: 32 }} />
            <TcButton
              text={truncateCenter(platform?.metadata?.chat?.title, 14)}
              className='w-10/12'
              variant='text'
              color='primary'
              startIcon={<IoSettingsSharp />}
              onClick={() => setOpenDialog(true)}
            />
          </Paper>
        ))}
      <TcConnectedTelegramDialog
        platform={platforms[0]}
        open={openDialog}
        handleClose={() => {
          setOpenDialog(false);
          handleUpdateCommunityPlatform();
        }}
        handleDisconnect={handleOpenDisconnectDialog}
      />
      <TcDisconnectPlatform
        open={openDisconnectDialog}
        handleClose={() => setOpenDisconnectDialog(false)}
        handleDisconnect={handleDisconnectPlatform}
      />
    </div>
  );
};

export default TcConnectedTelegram;
