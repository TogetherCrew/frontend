import { FaCog } from "react-icons/fa";

import { useAdmin } from "@/hooks/useAdmin";

import TcCommunityPlatformIcon from "@/components/communitySettings/communityPlatforms/TcCommunityPlatformIcon";

import { useToken } from "@/context/TokenContext";
import { IPlatformContext } from "@/utils/interfaces";

import { UpvoteButton } from "./UpvoteButton";

export default function PlatformItem({ context, exists }: { context: IPlatformContext, exists: boolean }) {

  const { community } = useToken();

  const { isAdmin } = useAdmin();

  return (
    <li className="flex justify-between gap-x-6 p-4 h-16">
      <div className="flex items-center gap-2 ">
        <TcCommunityPlatformIcon platform={context.name.toLocaleLowerCase()} size={20} />
        <h4 className="text-xs font-semibold">{context.title}</h4>
      </div>
      <div className="flex items-center gap-2">
        {!context.available ? (
          <UpvoteButton community={community} name={context.name} />
        ) : (
          <>
            <div className="flex items-center gap-4">
              {exists ? (
                <div className="w-2 h-2 bg-success rounded-full"></div>
              ) : (
                <div className="w-2 h-2 bg-base-300 rounded-full"></div>
              )}
              {isAdmin && (
                <a href={context.configPath} className="btn btn-sm btn-square">
                  <FaCog />
                </a>
              )}

            </div>
          </>
        )}
      </div>
    </li>
  );
}
