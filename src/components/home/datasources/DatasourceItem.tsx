import TcCommunityPlatformIcon from "@/components/communitySettings/communityPlatforms/TcCommunityPlatformIcon";

import { UpvoteButton } from "./UpvoteButton";

function ConnectButton({ datasource }: { datasource: any }) {
  return (
    <a href={`/community-settings?addPlatform=${datasource.title.toLocaleLowerCase()}`} className="text-xs text-slate-400 font-semibold bg-gray-100 hover:text-slate-700 px-4 py-2 rounded-full w-20">Connect</a>
  )
}

function ManageButton({ datasource }: { datasource: any }) {
  return (
    <a href={`/community-settings?managePlatform=${datasource.title.toLocaleLowerCase()}`} className="text-xs text-slate-400 font-semibold bg-gray-100 hover:text-slate-700 px-4 py-2 rounded-full w-20">Manage</a>
  )
}


export default function DatasourceItem({ datasource, connected, community }: { datasource: any, connected: boolean, community: any }) {

  return (
    <li className="flex justify-between gap-x-6 p-4">
      <div className="flex items-center gap-2 ">
        <TcCommunityPlatformIcon platform={datasource.title} size={20} />
        <h4 className="text-xs font-semibold">{datasource.title}</h4>
      </div>
      <div className="flex items-center gap-2">
        {datasource.isComingSoon ? (
          <UpvoteButton community={community} datasource={datasource} />
        ) : (
          connected ? (
            <ManageButton datasource={datasource} />
          ) : (
            <ConnectButton datasource={datasource} />
          )
        )}
      </div>
    </li>
  );
}
