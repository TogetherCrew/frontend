import React, { useState } from 'react';
import Image from 'next/image';

import LoadingScreen from '@/components/LoadingScreen';

import tcLogo from '../../assets/svg/tc-logo.svg';
import TcSelectCommunity from '../../components/centric/selectCommunity/TcSelectCommunity';
import centricLayout from '../../layouts/centricLayout';

function SelectCommunity() {
  const [communityLoading, setCommunityLoading] = useState<boolean>(false);

  const handleCommunityLoading = (loading: boolean) => {
    setCommunityLoading(loading);
  };

  if (communityLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className='flex flex-col gap-8 p-8'>
      <Image src={tcLogo} alt='' className='mx-auto' />
      <TcSelectCommunity handleCommunityLoading={handleCommunityLoading} />
    </div>
  );
}

SelectCommunity.pageLayout = centricLayout;

export default SelectCommunity;
