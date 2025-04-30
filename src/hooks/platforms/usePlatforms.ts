import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/axiosInstance";
import { IPlatformProps } from "@/utils/interfaces";
export const usePlatforms = (communityId: string | undefined, name?: string, page?: number, limit?: number) => {

  return useQuery({
    queryKey: ["platforms", name, page, limit],
    enabled: !!communityId,
    queryFn: async () => {
      const res = await axiosInstance.get(`/platforms?community=${communityId}&name=${name}&page=${page}&limit=${limit}`);
      return res.data;
    }
  });
};