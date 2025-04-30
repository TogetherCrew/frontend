'use client'

import MediaWikiForm from "@/components/mediawiki/Form";
import Breadcrumbs from "@/components/layouts/Breadcrumbs";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/axiosInstance";
import { IPlatformProps } from "@/utils/interfaces";
export default function MediaWikiEditPage() {

  const params = useParams();
  const id = params?.id as string;

  const { data } = useQuery({
    queryKey: ["platform", id],
    queryFn: () => axiosInstance.get(`/platforms/${id}`),
  })

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs />
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Edit MediaWiki</h1>
      </div>
      <div className="bg-base-100 p-8 rounded-lg">
        {data && <MediaWikiForm edit={data.data as unknown as IPlatformProps} />}
      </div>
    </div>
  );
}