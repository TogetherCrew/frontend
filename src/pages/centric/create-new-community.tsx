import React, { useState } from 'react';
import { FormControlLabel } from '@mui/material';
import Image from 'next/image';
import router from 'next/router';

import LoadingScreen from '@/components/LoadingScreen';

import tcLogo from '../../assets/svg/tc-logo.svg';
import TcBoxContainer from '../../components/shared/TcBox/TcBoxContainer';
import TcButton from '../../components/shared/TcButton';
import TcCheckbox from '../../components/shared/TcCheckbox';
import TcInput from '../../components/shared/TcInput';
import TcLink from '../../components/shared/TcLink';
import TcText from '../../components/shared/TcText';
import { useToken } from '../../context/TokenContext';
import centricLayout from '../../layouts/centricLayout';
import useAppStore from '../../store/useStore';

function CreateNewCommunity() {
  const { createNewCommunitie } = useAppStore();
  const { updateCommunity } = useToken();

  const [loading, setLoading] = useState<boolean>(false);
  const [communityName, setCommunityName] = useState<string>('');
  const [readTermsAndCondition, setReadTermsAndCondition] =
    useState<boolean>(false);

  const handleCreateNewCommunitie = async () => {
    setLoading(true);
    const community = await createNewCommunitie({
      name: communityName,
      tcaAt: new Date().toISOString(),
    });

    updateCommunity(community);

    router.push('/dashboard');
  };
  if (loading) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  }
  return (
    <div className='flex flex-col gap-8 p-8'>
      <Image src={tcLogo} alt='' className='mx-auto' />
      <TcBoxContainer
        bgcolor='white'
        className='min-h-[37.5rem] rounded p-4 md:p-16'
        contentContainerChildren={
          <div className='space-y-8 pt-10'>
            <TcText text='Create a new community account' variant='h4' />
            <div className='space-y-2'>
              <TcText
                className='text-left md:text-center'
                text='What is the name of the community or organization?'
                fontWeight='bold'
                sx={{ typography: { xs: 'body2', md: 'body1' } }}
              />
              <TcInput
                label='Community name'
                variant='filled'
                placeholder='Write community name Placeholder'
                onChange={(e) => setCommunityName(e.target.value)}
              />
            </div>

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
                        Privacy Policy
                      </TcLink>
                      {' and '}
                      <TcLink
                        to='https://www.togethercrew.com/privacy-and-terms'
                        color='primary'
                        fontWeight='bold'
                      >
                        Terms of Service.
                      </TcLink>
                    </>
                  }
                  variant='subtitle2'
                />
              }
              control={
                <TcCheckbox
                  color='secondary'
                  onChange={(e) => setReadTermsAndCondition(e.target.checked)}
                />
              }
            />
            <div>
              <TcButton
                text='Create community'
                variant='contained'
                sx={{ width: '15rem', padding: '0.5rem' }}
                color='secondary'
                disabled={!readTermsAndCondition}
                onClick={() => handleCreateNewCommunitie()}
              />
            </div>
          </div>
        }
      />
      <div className='flex justify-start'>
        <button className='btn btn-ghost' onClick={() => router.back()}>Back</button>
      </div>
    </div>
  );
}

CreateNewCommunity.pageLayout = centricLayout;

export default CreateNewCommunity;
