import React, { useEffect, useState } from 'react';

import TcCommunityListItems from './TcCommunityListItems';
import { IDiscordModifiedCommunity } from '../../../utils/interfaces';

function TcCommunityList({ fetchedCommunities, handleSelectedCommunity }: any) {

  return (
    <TcCommunityListItems
      communities={fetchedCommunities.results}
      handleSelectedCommunity={handleSelectedCommunity}
    />
  );
}

export default TcCommunityList;
