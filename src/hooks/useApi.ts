import { useEffect, useMemo, useState } from "react";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { axiosInstance } from "@/axiosInstance";
export const useApi = <T>(url: string | null, options: AxiosRequestConfig = {}) => {
  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!url) return;
      setLoading(true);
      try {
        const response: AxiosResponse<T> = await axiosInstance.get<T>(url, options);
        setData(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, memoizedOptions]);

  return { data, loading, error };
};


