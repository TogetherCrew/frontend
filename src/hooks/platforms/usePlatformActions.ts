import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/axiosInstance";

export const usePlatformActions = () => {
  const queryClient = useQueryClient();
  const updatePlatform = useMutation({
    mutationFn: ({ platformId, update }: { platformId: string, update: any }) => axiosInstance.patch(`/platforms/${platformId}`, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
    },
  })

  const createPlatform = useMutation({
    mutationFn: ({ platform }: { platform: any }) => axiosInstance.post(`/platforms`, platform),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
    },
  })

  const deletePlatform = useMutation({
    mutationFn: ({ platformId }: { platformId: string }) => axiosInstance.delete(`/platforms/${platformId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] })
    }
  })



  return { updatePlatform, createPlatform, deletePlatform };
}