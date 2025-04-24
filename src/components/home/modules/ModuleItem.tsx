import { useEffect } from "react";
import { FaCog } from "react-icons/fa";
import { toast } from 'react-toastify';

import { useModuleActions } from "@/hooks/modules/useModuleActions";
import { useModules } from "@/hooks/modules/useModules";
import { useAdmin } from "@/hooks/useAdmin";

import { useToken } from "@/context/TokenContext";
import { IModuleContext, IModuleProps } from "@/utils/interfaces";

import { UpvoteButton } from "../platforms/UpvoteButton";

export default function ModuleItem({ context, module }: { context: IModuleContext, module?: IModuleProps }) {
  const { community } = useToken();
  const { isAdmin } = useAdmin();
  const { updateModule, createModule } = useModuleActions();
  const { isPending } = useModules(community?.id);

  const handleToggle = async (checked: boolean) => {

    if (!module?.id) {
      await createModule.mutateAsync({
        module: {
          name: context.name,
          activated: checked
        }
      })
    } else {
      await updateModule.mutateAsync({
        moduleId: module.id,
        update: {
          activated: checked
        }
      })
    }

  }

  useEffect(() => {
    if (updateModule.isSuccess || createModule.isSuccess) {
      toast.success(`${updateModule.isSuccess ? "Module updated" : createModule.isSuccess ? "Module created" : ""}`, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  }, [updateModule.isSuccess, createModule.isSuccess]);

  return (
    <li className="flex justify-between gap-x-6 p-4 h-16">
      <div className="flex items-center gap-2">
        <context.icon />
        <h4 className="text-xs font-semibold">{context.title}</h4>
      </div>
      <div className="flex items-center gap-2">
        {!context.available ? (
          <UpvoteButton community={community} name={context.name} />
        ) : (
          <>
            {isAdmin ? (
              <>
                <input
                  type="checkbox"
                  checked={module?.activated ?? false}
                  onChange={(e) => handleToggle(e.target.checked)}
                  disabled={!isAdmin || updateModule.isPending || createModule.isPending || isPending}
                  className="toggle toggle-success toggle-sm"
                />

                <a href={context.configPath} className="btn btn-square btn-sm">
                  <FaCog />
                </a>
              </>
            ) : (<>
              {module?.activated ? (
                <div className="w-2 h-2 bg-success rounded-full"></div>
              ) : (
                <div className="w-2 h-2 bg-base-300 rounded-full"></div>
              )}
            </>
            )}
          </>
        )}
      </div>
    </li>
  );
}
