
import { FaCog } from "react-icons/fa";

import { useAdmin } from "@/hooks/useAdmin";

import { axiosInstance } from "@/axiosInstance";
import { useToken } from "@/context/TokenContext";

import { Toggle } from "./Toggle";
import { UpvoteButton } from "../datasources/UpvoteButton";

export default function ApplicationItem({ application }: { application: any }) {

  const { community } = useToken();

  const { isAdmin } = useAdmin();

  const handleToggle = async (checked: boolean, id?: string) => {

    if (!id) {
      // create
      // post to /modules with body { name: application.name, activated: checked }
      await axiosInstance.post(`/modules`, {
        name: application.name,
        activated: checked
      })
    } else {
      // patch
      // patch to /modules/:id with body { activated: checked }
      await axiosInstance.patch(`/modules/${id}`, {
        activated: checked
      })
    }

  }

  return (
    <li className="flex justify-between gap-x-6 p-4 h-16">
      <div className="flex items-center gap-2">
        <application.icon />
        <h4 className="text-xs font-semibold">{application.title}</h4>
      </div>
      <div className="flex items-center gap-2">
        {!application.available ? (
          <UpvoteButton community={community} name={application.name} />
        ) : (
          <>
            <Toggle
              checked={application.activated}
              onChange={handleToggle}
              id={application.id}
              disabled={!isAdmin}
            />
            {isAdmin && (
              <a href={application.path} className="text-sm text-slate-400 hover:text-slate-700 py-2 w-fit border p-2 rounded-lg">
                <FaCog />
              </a>
            )}
          </>
          // application.active ? (
          //   <ManageButton application={application} />
          // ) : (
          //   <ConnectButton application={application} />
          // )
        )}
      </div>
    </li >
  );
}
