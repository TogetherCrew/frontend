import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from 'axios';

export const useNamespaces = (url: string | undefined) => {
  return useQuery({
    queryKey: ['mediawiki', 'namespaces', url],
    enabled: !!url,
    queryFn: async () => {
      const params = new URLSearchParams({
        action: "query",
        meta: "siteinfo",
        siprop: "namespaces",
        format: "json",
        origin: "*",
      });
      const res = await fetch(url!.concat("?", params.toString()));
      return res.json();
    }
  });
}