
import { usePlatforms } from "@/hooks/platforms/usePlatforms";

import { PLATFORM_CONTEXT } from "@/constants/PlatformContext";
import { useToken } from "@/context/TokenContext";
import { IPlatformProps } from "@/utils/interfaces";

import PlatformItem from "./PlatformItem";

export default function PlatformList() {

  const { community } = useToken();

  const { data, isLoading } = usePlatforms(community?.id || undefined);

  const platformExists = (name: string) => {
    return data?.results?.some((platform: IPlatformProps) => platform.name === name);
  }

  if (isLoading) {
    return <div className="skeleton h-[449px] w-full"></div>;
  }

  return (
    <div className=" bg-white rounded-2xl divide-y divide-gray-100 text-slate-700">
      <div className="p-4">
        <div className="text-xs font-semibold bg-gray-100 px-4 py-2 rounded-full w-fit">Data sources</div>
      </div>
      <ul role="list" className="divide-y divide-gray-100 overflow-y-auto max-h-[385px]">
        {PLATFORM_CONTEXT.map((context, index) => <PlatformItem key={index} context={context} exists={platformExists(context.name)} />)}
      </ul>
    </div>
  );
}