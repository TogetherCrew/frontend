import { useEffect } from "react";

import { useApplications } from "@/hooks/useApplications";

import ApplicationItem from "./ApplicationItem";

export default function ApplicationList() {

  const { applications } = useApplications();

  useEffect(() => {
    console.log(applications);
  }, [applications]);

  return (
    <div className=" bg-white rounded-2xl divide-y divide-gray-100 text-slate-700">
      <div className="p-4">
        <div className="text-xs font-semibold bg-gray-100 px-4 py-2 rounded-full w-fit">Applications</div>
      </div>
      <ul role="list" className="divide-y divide-gray-100 overflow-y-auto max-h-[385px]">
        {applications.map((application, index) => <ApplicationItem key={index} application={application} />)}
      </ul>
      {/* <div className="p-4" /> */}
    </div>
  );
}