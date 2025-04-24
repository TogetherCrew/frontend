import { useModules } from "@/hooks/modules/useModules";

import { MODULE_CONTEXT } from "@/constants/ModuleContext";
import { useToken } from "@/context/TokenContext";
import { IModuleContext, IModuleProps } from "@/utils/interfaces";

import ModuleItem from "./ModuleItem";

export default function ModuleList() {
  const { community } = useToken();

  const { data, isLoading } = useModules(community?.id);

  const getModule = (name: string) => {
    return data?.results?.find((module: IModuleProps) => module.name === name);
  }

  if (isLoading) {
    return <div className="skeleton h-[449px] w-full"></div>;
  }

  return (
    <div className=" bg-white rounded-2xl divide-y divide-gray-100 text-slate-700">
      <div className="p-4 h-16">
        <div className="text-xs font-semibold bg-gray-100 px-4 py-2 rounded-full w-fit">Applications</div>
      </div>
      <ul role="list" className="divide-y divide-gray-100 overflow-y-auto max-h-[385px]">
        {MODULE_CONTEXT.map((context: IModuleContext, index: number) => <ModuleItem key={index} context={context} module={getModule(context.name)} />)}
      </ul>
    </div>
  );
}