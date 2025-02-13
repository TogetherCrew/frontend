import clsx from "clsx";
import { IDiscordModifiedCommunity } from "../../../utils/interfaces";
import TcAvatar from "@/components/shared/TcAvatar";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { conf } from "@/configs";
import { MdGroups } from "react-icons/md";
import { useState } from "react";

interface ITcCommunityItemProps {
  community: IDiscordModifiedCommunity;
  handleSelectedCommunity: (community: IDiscordModifiedCommunity) => void;
}

const klass = (community: IDiscordModifiedCommunity) => {
  return clsx(
    'bg-white rounded-2xl min-h-[120px] cursor-pointer rounded p-8 transition-all delay-75 ease-in hover:-translate-y-1',
    community.userHasAccess ? '' : 'opacity-50'
  )
}

function CardBody({ community }: { community: IDiscordModifiedCommunity }) {

  const renderPlatformAvatar = (community: IDiscordModifiedCommunity) => {
    let activeCommunityPlatformIcon;

    if (community?.platforms) {
      activeCommunityPlatformIcon = community.platforms.find(
        (platform) =>
          platform.disconnectedAt === null && platform.name === 'discord'
      );
    }

    if (activeCommunityPlatformIcon?.metadata?.icon) {
      return (
        <Avatar
          src={`${conf.DISCORD_CDN}icons/${activeCommunityPlatformIcon.metadata.id}/${activeCommunityPlatformIcon.metadata.icon}`}
          alt={
            activeCommunityPlatformIcon.metadata.name
              ? activeCommunityPlatformIcon.metadata.name
              : ''
          }
        />
      );
    }

    return <MdGroups size={28} />;
  };

  return (
    <div className='flex flex-col gap-6'>
      {community?.avatarURL ? (
        <TcAvatar className='' src={community.avatarURL} />
      ) : (
        <TcAvatar className=''>
          {renderPlatformAvatar(community)}
        </TcAvatar>
      )}
      <h3 className='text-md font-semibold text-left capitalize'>{community.name}</h3>
    </div>
  )
}

function AccessDeniedCard({ community }: { community: IDiscordModifiedCommunity }) {
  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={klass(community)} onClick={handleClickOpen}>
        <CardBody community={community} />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle className="font-semibold">No Access</DialogTitle>
        <DialogContent>
          <DialogContentText className="text-gray-500 text-sm">You don't have permission to see this community. Please ask the community manager for access</DialogContentText>
        </DialogContent>
        <DialogActions className="flex justify-start pl-6 pb-6">
          <Button aria-label="close" className="bg-black hover:opacity-80 text-white text-sm px-4 py-2 rounded-md" onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function AccessAllowedCard({ community, handleSelectedCommunity }: ITcCommunityItemProps) {
  return (
    <div className={klass(community)} onClick={() => handleSelectedCommunity(community)}>
      <CardBody community={community} />
    </div>
  )
}

export default function TcCommunityItem({ community, handleSelectedCommunity }: ITcCommunityItemProps) {
  if (community.userHasAccess) {
    return <AccessAllowedCard community={community} handleSelectedCommunity={handleSelectedCommunity} />
  }
  return <AccessDeniedCard community={community} />
}