import { useDatasources } from "@/hooks/useDatasources";

import DatasourceItem from "./DatasourceItem";

export default function DatasourceList() {

  const datasources = useDatasources();

  return (
    <div className=" bg-white rounded-2xl divide-y divide-gray-100 text-slate-700">
      <div className="p-4">
        <div className="text-xs font-semibold bg-gray-100 px-4 py-2 rounded-full w-fit">Data sources</div>
      </div>
      <ul role="list" className="divide-y divide-gray-100 overflow-y-auto max-h-[385px]">
        {datasources.map((datasource, index) => <DatasourceItem key={index} datasource={datasource} />)}
      </ul>
      {/* <div className="p-4" /> */}
    </div>
  );
}