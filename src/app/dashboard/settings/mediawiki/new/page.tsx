'use client'

import MediaWikiForm from "@/components/mediawiki/Form";

export default function MediaWikiNewPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">New MediaWiki</h1>
      </div>
      <div className="bg-base-100 p-8 rounded-lg">
        <MediaWikiForm />
      </div>
    </div>
  );
}