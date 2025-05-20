'use client'

import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

import MediaWikiList from "@/components/mediawiki/List";

export default function MediaWikiSettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">MediaWiki Settings</h1>
        <Link href="new" className="btn btn-sm btn-primary"><FaPlus /> MediaWiki</Link>
      </div>
      <div className="bg-base-100 p-8 rounded-lg">
        <MediaWikiList />
      </div>
    </div>
  );
}
