import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/axiosInstance";
import { useSnackbar } from "@/context/SnackbarContext";

export const usePlatformActions = () => {
  const queryClient = useQueryClient();
  const { showMessage } = useSnackbar();

  const updatePlatform = useMutation({
    mutationFn: ({ platformId, update }: { platformId: string, update: any }) => axiosInstance.patch(`/platforms/${platformId}`, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
      showMessage("Platform updated successfully", "success");
    },
    onError: (error: any) => {
      showMessage(`Failed to update platform: ${error.message}`, "error");
    }
  })

  const createPlatform = useMutation({
    mutationFn: ({ platform }: { platform: any }) => axiosInstance.post(`/platforms`, platform),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
      showMessage("Platform created successfully", "success");
    },
    onError: (error: any) => {
      showMessage(`Failed to update platform: ${error.message}`, "error");
    }
  })

  const deletePlatform = useMutation({
    mutationFn: ({ platformId }: { platformId: string }) => axiosInstance.delete(`/platforms/${platformId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
      showMessage("Platform deleted successfully", "success");
    },
    onError: (error: any) => {
      showMessage(`Failed to update platform: ${error.message}`, "error");
    }
  })

  return { updatePlatform, createPlatform, deletePlatform };
}