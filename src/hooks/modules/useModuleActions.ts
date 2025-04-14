import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/axiosInstance";

export const useModuleActions = () => {
  const queryClient = useQueryClient();
  const updateModule = useMutation({
    mutationFn: ({ moduleId, update }: { moduleId: string, update: any }) => axiosInstance.patch(`/modules/${moduleId}`, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
  })

  const createModule = useMutation({
    mutationFn: ({ module }: { module: any }) => axiosInstance.post(`/modules`, module),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
  })

  return { updateModule, createModule };
}