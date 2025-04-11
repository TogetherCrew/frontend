import { useToken } from "@/context/TokenContext";

import DatasourceItem from "./DatasourceItem";

export default function DatasourceList({ datasources }: { datasources: any[] }) {

  const { community } = useToken();

  const platformNames =
    community?.platforms?.map((platform: any) => platform.name) || [];

  const isConnected = (name: string) => platformNames.includes(name.toLowerCase());

  return (
    <div className=" bg-white rounded-2xl divide-y divide-gray-100 text-slate-700">
      <div className="p-4">
        <div className="text-xs font-semibold bg-gray-100 px-4 py-2 rounded-full w-fit">Data sources</div>
      </div>
      <ul role="list" className="divide-y divide-gray-100 overflow-y-auto max-h-[500px]">
        {datasources.map((datasource, index) => <DatasourceItem key={index} datasource={datasource} connected={isConnected(datasource.title)} community={community} />)}
      </ul>
      {/* <div className="p-4" /> */}
    </div>
  );
}