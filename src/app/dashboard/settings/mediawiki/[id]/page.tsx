'use client'

export const runtime = 'edge'

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { axiosInstance } from "@/axiosInstance";

export default function MediaWikiPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data } = useQuery({
    queryKey: ["platform", id],
    queryFn: () => axiosInstance.get(`/platforms/${id}`),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">MediaWiki</h1>
      </div>
      <div className="bg-base-100 p-8 rounded-lg">

      </div>
    </div>
  )
}