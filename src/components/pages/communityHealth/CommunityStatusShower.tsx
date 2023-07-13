import React from 'react';
import { AiOutlineBulb } from 'react-icons/ai';

interface ICommunityStatusShowerProps {
  scoreStatus: number;
  isFragmentation: boolean;
  toggleTipDialog: () => void;
}

function CommunityStatusShower({
  scoreStatus,
  toggleTipDialog,
  isFragmentation,
}: ICommunityStatusShowerProps) {
  return (
    <div>
      {scoreStatus === 1 || scoreStatus === 2 ? (
        <div
          className="bg-gray-background hover:bg-[#e6e6e6] p-2 flex items-center justify-center space-x-2 cursor-pointer"
          onClick={toggleTipDialog}
        >
          <div className="rounded-full bg-secondary w-fit p-1">
            <AiOutlineBulb size={30} color="white" data-testid="bulb-icon" />
          </div>
          <span className="text-sm">
            {isFragmentation
              ? 'Tips for making your community less fragmented'
              : 'Tips for decentralizing'}
          </span>
        </div>
      ) : scoreStatus === 0 ? (
        <div className="bg-green-100 p-2 flex items-center justify-center space-x-2">
          <div className="rounded-full bg-green-600 w-fit p-1">
            <AiOutlineBulb size={30} color="white" data-testid="bulb-icon" />
          </div>
          <span className="text-sm">Your community is doing great!</span>
        </div>
      ) : scoreStatus === -1 || scoreStatus === -2 ? (
        <div
          className="bg-gray-background hover:bg-[#e6e6e6] p-2 flex items-center justify-center space-x-2 cursor-pointer"
          onClick={toggleTipDialog}
        >
          <div className="rounded-full bg-secondary w-fit p-1">
            <AiOutlineBulb size={30} color="white" data-testid="bulb-icon" />
          </div>
          <span className="text-sm">
            {isFragmentation
              ? 'Tips for making your community less enmeshed'
              : 'Tips for centralizing'}
          </span>
        </div>
      ) : null}
    </div>
  );
}

CommunityStatusShower.defaultProps = {
  scoreStatus: -1,
};

export default CommunityStatusShower;
