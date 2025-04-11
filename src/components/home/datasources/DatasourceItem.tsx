import TcCommunityPlatformIcon from "@/components/communitySettings/communityPlatforms/TcCommunityPlatformIcon";

import { useToken } from "@/context/TokenContext";

import { UpvoteButton } from "./UpvoteButton";
import { useAdmin } from "@/hooks/useAdmin";
import { FaCog } from "react-icons/fa";

function ConnectButton({ datasource }: { datasource: any }) {
  return (
    <a href={`/community-settings?addPlatform=${datasource.title.toLocaleLowerCase()}`} className="text-sm text-slate-400 hover:text-slate-700 py-2 w-fit border p-2 rounded-lg">
      <FaCog />
    </a>
  )
}

function ManageButton({ datasource }: { datasource: any }) {
  return (
    <a href={`/community-settings?managePlatform=${datasource.title.toLocaleLowerCase()}`} className="text-sm text-slate-400 hover:text-slate-700 py-2 w-fit border p-2 rounded-lg">
      <FaCog />
    </a>
  )
}


export default function DatasourceItem({ datasource }: { datasource: any }) {

  const { community } = useToken();

  const { isAdmin } = useAdmin();

  return (
    <li className="flex justify-between gap-x-6 p-4 h-16">
      <div className="flex items-center gap-2 ">
        <TcCommunityPlatformIcon platform={datasource.name.toLocaleLowerCase()} size={20} />
        <h4 className="text-xs font-semibold">{datasource.title}</h4>
      </div>
      <div className="flex items-center gap-2">
        {!datasource.available ? (
          <UpvoteButton community={community} name={datasource.name} />
        ) : (
          <>
            <div className="flex items-center gap-4">
              {datasource.activated ? (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              )}
              {isAdmin && (
                datasource.activated ? (
                  <ManageButton datasource={datasource} />
                ) : (
                  <ConnectButton datasource={datasource} />
                )
              )}

            </div>
          </>
        )}
      </div>
    </li>
  );
}
