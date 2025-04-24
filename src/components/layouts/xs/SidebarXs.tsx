import React, { useEffect, useState } from 'react';

type items = {
  name: string;
  path: string;
  icon: any;
};

import { faHeartPulse, faHome, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Drawer } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaBars } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { MdKeyboardBackspace, MdOutlineAnnouncement } from 'react-icons/md';
import { RiNftFill } from 'react-icons/ri';

import TcText from '../../shared/TcText';
import { conf } from '../../../configs';
import { useToken } from '../../../context/TokenContext';
import useAppStore from '../../../store/useStore';
import { ICommunityPlatfromProps } from '../../../utils/interfaces';

const Sidebar = () => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const { dynamicNFTModuleInfo } = useAppStore();

  const { community } = useToken();

  const userPermissions = useAppStore(
    (state) => state.userRolePermissions || []
  );

  const [connectedPlatform, setConnectedPlatform] =
    useState<ICommunityPlatfromProps | null>(null);

  useEffect(() => {
    const storedCommunity = community;

    if (storedCommunity?.platforms) {
      const foundPlatform = storedCommunity.platforms.find(
        (platform) =>
          platform.disconnectedAt === null && platform.name === 'discord'
      );

      setConnectedPlatform(foundPlatform ?? null);
    }
  }, [community]);

  let menuItems: items[] = [
    {
      name: "Home",
      path: "/dashboard",
      icon: (
        <FontAwesomeIcon
          icon={faHome}
          style={{ fontSize: 30, color: "black" }}
        />
      ),
    },
    {
      name: 'Community Insights',
      path: '/',
      icon: (
        <FontAwesomeIcon
          icon={faUserGroup}
          style={{ fontSize: 30, color: 'black' }}
        />
      ),
    },
    {
      name: 'Community Health',
      path: '/community-health',
      icon: (
        <FontAwesomeIcon
          icon={faHeartPulse}
          style={{ fontSize: 30, color: 'black' }}
        />
      ),
    },
    {
      name: 'Smart Announcements',
      path: '/announcements',
      icon: (
        <MdOutlineAnnouncement
          style={{ fontSize: 30, color: 'black', margin: '0 auto' }}
        />
      ),
    },
    {
      name: 'Community Settings',
      path: '/community-settings',
      icon: (
        <FiSettings
          style={{ fontSize: 30, color: 'black', margin: '0 auto' }}
        />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (dynamicNFTModuleInfo?.isNFTModuleEnabled) {
    menuItems.splice(menuItems.length - 1, 0, {
      name: 'Reputation Score',
      path: '/reputation-score',
      icon: (
        <RiNftFill style={{ fontSize: 30, color: 'black', margin: '0 auto' }} />
      ),
    });
  }

  if (!userPermissions.includes('admin')) {
    menuItems = menuItems.filter(
      (item) =>
        item.name !== 'Community Settings' &&
        item.name !== 'Smart Announcements'
    );
  }

  const menuItem = menuItems.map((el) => (
    <li key={el.name} className='py-4'>
      <Link href={el.path} onClick={() => setOpen(false)}>
        <div
          className={
            currentRoute === el.path
              ? 'mx-auto w-1/2 cursor-pointer rounded-xl bg-white py-2 text-center delay-75 ease-in hover:bg-white'
              : 'mx-auto w-1/2 cursor-pointer rounded-xl py-2 text-center delay-75 ease-in hover:bg-white'
          }
        >
          {el.icon}
        </div>
        <p className='text-center text-lg'>{el.name}</p>
      </Link>
    </li>
  ));

  return (
    <>
      <div className='sticky top-0 z-50 flex flex-row items-center justify-between bg-gray-background py-4 px-5 md:hidden'>
        <div className='flex flex-row'>
          <div className='flex flex-row items-center space-x-3 text-center'>
            <div className='mb-2 mr-3 h-8 w-8'>
              <div
                className='mx-auto h-10 w-10'
                onClick={() => router.push('/centric/select-community')}
              >
                {connectedPlatform?.metadata?.icon ? (
                  <Avatar
                    src={`${conf.DISCORD_CDN}icons/${connectedPlatform.metadata.id}/${connectedPlatform.metadata.icon}`}
                    alt={
                      connectedPlatform.metadata.name
                        ? connectedPlatform.metadata.name
                        : ''
                    }
                  />
                ) : (
                  <div className='align-center flex h-10 w-10 flex-col justify-center rounded-full bg-secondary text-center text-xs' />
                )}
              </div>
            </div>
            <TcText text={community?.name} variant='h6' />
          </div>
        </div>
        <FaBars size={30} onClick={handleDrawerOpen} />
      </div>
      <Drawer
        variant='persistent'
        anchor='right'
        sx={{
          '& .MuiPaper-root': {
            width: '100%',
          },
        }}
        open={open}
      >
        <div className='h-screen bg-gray-background p-3'>
          <MdKeyboardBackspace size={30} onClick={handleDrawerClose} />
          <nav>
            <ul className='flex flex-col px-3'>{menuItem}</ul>
          </nav>
        </div>
      </Drawer>
    </>
  );
};

export default Sidebar;
