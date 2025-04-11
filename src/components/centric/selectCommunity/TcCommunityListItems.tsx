import React, { useEffect } from 'react';
import TcText from '../../shared/TcText';
import { StorageService } from '../../../services/StorageService';
import { IDiscordModifiedCommunity } from '../../../utils/interfaces';
import TcCommunityItem from './TcCommunityItem';
import { useToken } from '@/context/TokenContext';

/**
 * Props for the TcCommunityListItems component.
 */
interface ITcCommunityListItemsProps {
  /**
   * Array of community objects with avatar URLs and labels.
   */
  communities: IDiscordModifiedCommunity[];
  handleSelectedCommunity: (selectedCommunity: IDiscordModifiedCommunity) => void;
}

/**
 * TcCommunityListItems Component
 *
 * Renders a list of community items, each displaying an avatar and a label.
 * Features include:
 * - Reading the currently selected community from local storage on initial render.
 * - Updating the selected community both internally and via `onSelectCommunity` callback when a community is clicked.
 * - Responsive layout for different screen sizes.
 * - Displaying a message when there are no communities.
 *
 * Props:
 * - communities (IDiscordModifiedCommunity[]): Array of community objects with `avatarURL` and `name`.
 * - onSelectCommunity (Function): Callback when a community is selected.
 *
 * Usage:
 * <TcCommunityListItems
 *   communities={[{ id: 1, name: 'Community 1', avatarURL: 'url1' }]}
 *   onSelectCommunity={handleSelect}
 * />
 */

function TcCommunityListItems({
  communities,
  handleSelectedCommunity,
}: ITcCommunityListItemsProps) {
  const { deleteCommunity } = useToken();

  useEffect(() => {
    deleteCommunity();
  }, []);

  if (communities.length === 0) {
    return (
      <div className='py-8'>
        <TcText text='No community exist' variant='body1' color='gray' />
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
      {communities.map((community, index) => (
        <TcCommunityItem
          key={index}
          community={community}
          handleSelectedCommunity={handleSelectedCommunity}
        />
      ))}
    </div>
  );
}

export default TcCommunityListItems;
