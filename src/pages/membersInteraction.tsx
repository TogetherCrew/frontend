import React, { useEffect, useState } from 'react';
import { defaultLayout } from '../layouts/defaultLayout';
import SEO from '../components/global/SEO';
import { AiOutlineExclamationCircle, AiOutlineLeft } from 'react-icons/ai';
import Link from '../components/global/Link';
import { Paper, Popover } from '@mui/material';
import useAppStore from '../store/useStore';
import HintBox from '../components/pages/memberInteraction/HintBox';
import { IUser } from '../utils/types';
import SimpleBackdrop from '../components/global/LoadingBackdrop';
import dynamic from 'next/dynamic';
import { useToken } from '../context/TokenContext';

const ForceGraphComponent = dynamic(
  () =>
    import('../components/pages/memberInteraction/ForceGraphComponent').then(
      (cmp) => cmp
    ),
  { ssr: false }
);

const getNodeSize = (radius: number) => {
  if (radius >= 0 && radius <= 10) {
    return 1;
  } else if (radius >= 11 && radius <= 50) {
    return 5;
  } else {
    return 8;
  }
};

const transformApiResponseToMockData = (apiResponse: any[]) => {
  const nodes: any[] = [];
  const links: any[] = [];

  apiResponse.forEach(({ from, to, width }) => {
    const sourceNode = {
      id: from.id,
      username: from.username,
      color:
        from.stats === 'SENDER'
          ? '#3AAE2B'
          : from.stats === 'RECEIVER'
          ? '#FFCB33'
          : '#804EE1',
      size: getNodeSize(from.radius),
      stats: from.stats,
      ngu: from.ngu,
      roles: from.roles,
      radius: from.radius,
      discordId: from.discordId,
      avatar: from.avatar,
    };
    const targetNode = {
      id: to.id,
      username: to.username,
      color:
        to.stats === 'SENDER'
          ? '#3AAE2B'
          : to.stats === 'RECEIVER'
          ? '#FFCB33'
          : '#804EE1',
      size: getNodeSize(to.radius),
      stats: to.stats,
      ngu: to.ngu,
      roles: to.roles,
      radius: to.radius,
      discordId: to.discordId,
      avatar: to.avatar,
    };
    const link = { source: from.id, target: to.id, width };

    // Add nodes to the nodes array only if they don't exist already
    if (!nodes.find((node) => node.id === sourceNode.id)) {
      nodes.push(sourceNode);
    }

    if (!nodes.find((node) => node.id === targetNode.id)) {
      nodes.push(targetNode);
    }

    // Add the link to the links array
    links.push(link);
  });

  return { nodes, links };
};

export default function membersInteraction() {
  const { community } = useToken();

  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);

  const [nodeSizes, setNodeSizes] = useState<number[]>([]);

  const [user, setUser] = useState<IUser | undefined>();
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const { getMemberInteraction, isLoading } = useAppStore();

  useEffect(() => {
    const platformId = community?.platforms[0]?.id;

    if (platformId) {
      getMemberInteraction(platformId).then((apiResponse: any[]) => {
        const { nodes, links } = transformApiResponseToMockData(apiResponse);
        const nodeSizes = nodes.map((node) => node.size);
        setNodes(nodes);
        setLinks(links);
        setNodeSizes(nodeSizes);
      });
    }
  }, []);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const open = Boolean(popoverAnchorEl);
  const popoverId = open ? 'hint-popover' : undefined;

  if (isLoading) {
    return <SimpleBackdrop />;
  }

  return (
    <>
      <SEO titleTemplate="Member interactions" />
      <div className="flex flex-col container justify-between px-4 md:px-12 py-3">
        <Link to="/" className="mb-3">
          <div className="flex items-center text-gray-subtitle text-base hover:text-black">
            <AiOutlineLeft />
            <span className="pl-1">Community Insights</span>
          </div>
        </Link>
        <Paper className="px-4 md:px-8 py-6 rounded-xl shadow-box space-y-4 overflow-hidden">
          <h3 className="text-xl font-medium text-lite-black">
            Member interactions graph
          </h3>
          <p>Data from the last 7 days</p>
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="lg:w-11/12 overflow-hidden justify-center items-center">
              <ForceGraphComponent
                nodes={nodes}
                links={links}
                nodeRelSize={nodeSizes}
                numberOfnodes={nodes.length}
              />
            </div>
            <div className="hidden md:flex md:w-1/2 lg:flex-1  justify-end">
              <HintBox />
            </div>
          </div>
          <div className="md:hidden float-left">
            <button onClick={handlePopoverOpen}>
              <AiOutlineExclamationCircle size={30} />
            </button>
            <Popover
              id={popoverId}
              open={open}
              anchorEl={popoverAnchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              PaperProps={{
                style: { background: 'none', boxShadow: 'none' },
              }}
            >
              <div className="p-4">
                <HintBox />
              </div>
            </Popover>
          </div>
        </Paper>
      </div>
    </>
  );
}

membersInteraction.pageLayout = defaultLayout;
