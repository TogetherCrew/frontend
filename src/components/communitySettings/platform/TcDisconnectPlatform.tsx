import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import TcButton from '../../shared/TcButton';
import TcDialog from '../../shared/TcDialog';
import TcText from '../../shared/TcText';
import { useSnackbar } from '../../../context/SnackbarContext';
import useAppStore from '../../../store/useStore';
import { IPlatformProps } from '../../../utils/interfaces';

interface TcDisconnectPlatformProps {
  platform: IPlatformProps | null;
}

function TcDisconnectPlatform({ platform }: TcDisconnectPlatformProps) {
  const { deletePlatform } = useAppStore();
  const { showMessage } = useSnackbar();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const router = useRouter();

  const id = router.query.platformId as string;

  const handleDeletePlatform = async (deleteType: 'hard' | 'soft') => {
    try {
      await deletePlatform({ id, deleteType });
      setOpenDialog(false);
      router.push('/community-settings');
      showMessage('Platform disconnected successfully.', 'success');
    } catch (error) {}
  };

  return (
    <>
      <TcButton
        text='Disconnect'
        variant='outlined'
        sx={{ width: '7.5rem', padding: '0.5rem' }}
        onClick={() => setOpenDialog(true)}
      />
      <TcDialog
        open={openDialog}
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
            onClick={() => setOpenDialog(false)}
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
                onClick={() => handleDeletePlatform('hard')}
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
                onClick={() => handleDeletePlatform('soft')}
              />
            </div>
          </div>
        </div>
      </TcDialog>
    </>
  );
}

export default TcDisconnectPlatform;
