'use client'

import MediaWikiForm from "@/components/mediawiki/Form";

export default function MediaWikiSettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">MediaWiki Settings</h1>
      <div className="bg-base-100 p-8 rounded-lg">
        <MediaWikiForm />
      </div>
    </div>
  );
}
