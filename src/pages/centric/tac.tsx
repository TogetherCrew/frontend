import React, { useState } from 'react';
import { FormControlLabel } from '@mui/material';
import router from 'next/router';

import SimpleBackdrop from '../../components/global/LoadingBackdrop';
import TcBoxContainer from '../../components/shared/TcBox/TcBoxContainer';
import TcButton from '../../components/shared/TcButton';
import TcCheckbox from '../../components/shared/TcCheckbox';
import TcLink from '../../components/shared/TcLink';
import TcText from '../../components/shared/TcText';
import centricLayout from '../../layouts/centricLayout';
import { StorageService } from '../../services/StorageService';
import useAppStore from '../../store/useStore';

import Image from 'next/image';

import tcLogo from '../../assets/svg/tc-logo.svg';
import LoadingScreen from '@/components/LoadingScreen';

function Tac() {
  const { patchUser } = useAppStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [acceptPrivacyAndPolicy, setAcceptPrivacyAndPolicy] =
    useState<boolean>(false);

  const handleAcceptTerms = async () => {
    setLoading(true);
    const payload = {
      tcaAt: new Date().toISOString(),
    };

    try {
      await patchUser(payload);

      StorageService.updateLocalStorageWithObject(
        'user',
        'tcaAt',
        payload.tcaAt
      );

      router.push('/centric/select-community');
    } catch (error) {
      console.error('Failed to accept terms:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className='flex flex-col gap-8 p-8'>
      <Image src={tcLogo} alt='' className='mx-auto' />
      <TcBoxContainer
        bgcolor='white'
        className='rounded py-12 px-4 md:min-h-[37.5rem] md:p-12'
        contentContainerChildren={
          <div className='space-y-6 py-12'>
            <TcText
              sx={{ typography: { xs: 'h5', md: 'h4' }, fontWeight: 'bold' }}
              color='initial'
              text='One more thing...'
            />
            <TcText
              variant='body1'
              className='text-left md:text-center'
              color='initial'
              text={
                <>
                  Please take a moment to familiarize yourself with <br /> our
                  terms and conditions.
                </>
              }
            />
            <FormControlLabel
              label={
                <TcText
                  className='text-left md:text-center'
                  text={
                    <>
                      {'I understand and agree to the '}
                      <TcLink
                        to='https://www.togethercrew.com/privacy-and-terms'
                        color='primary'
                        fontWeight='bold'
                      >
                        Privacy Policy and Terms of Service.
                      </TcLink>
                    </>
                  }
                  variant='subtitle2'
                />
              }
              control={
                <TcCheckbox
                  color='secondary'
                  onChange={(e) => setAcceptPrivacyAndPolicy(e.target.checked)}
                />
              }
            />
            <div className='block py-5'>
              <TcButton
                text='Continue'
                variant='contained'
                sx={{ width: '15rem', padding: '0.5rem' }}
                disabled={!acceptPrivacyAndPolicy}
                onClick={() => handleAcceptTerms()}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

Tac.pageLayout = centricLayout;

export default Tac;
