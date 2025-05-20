import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/axiosInstance";
export const useModules = (communityId: string | undefined) => {

  return useQuery({
    queryKey: ["modules"],
    enabled: !!communityId,
    queryFn: async () => {
      const res = await axiosInstance.get(`/modules?community=${communityId}`);
      return res.data;
    },
  });
};