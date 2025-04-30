'use client'

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/axiosInstance";
import { IPlatformProps } from "@/utils/interfaces";
import { useParams } from "next/navigation";
import Breadcrumbs from "@/components/layouts/Breadcrumbs";

export default function MediaWikiPage() {
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["platform", id],
    queryFn: () => axiosInstance.get(`/platforms/${id}`),
  })

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs />
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">MediaWiki</h1>
      </div>
      <div className="bg-base-100 p-8 rounded-lg">

      </div>
    </div>
  )
}