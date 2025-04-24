import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/axiosInstance";
export const usePlatforms = (communityId: string | undefined) => {

  return useQuery({
    queryKey: ["platforms"],
    enabled: !!communityId,
    queryFn: async () => {
      const res = await axiosInstance.get(`/platforms?community=${communityId}`);
      return res.data;
    },
  });
};