import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/axiosInstance";
export const usePlatforms = (communityId: string | undefined, name?: string, page?: number, limit?: number) => {

  return useQuery({
    queryKey: ["platforms", name, page, limit],
    enabled: !!communityId,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (communityId) params.append('community', communityId);
      if (name) params.append('name', name);
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      const res = await axiosInstance.get(`/platforms?${params.toString()}`);
      return res.data;
    }
  });
};