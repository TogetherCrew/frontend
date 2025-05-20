'use client'

import Link from "next/link"
import { FaTriangleExclamation } from "react-icons/fa6"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <div className="bg-base-100 p-8 rounded-lg">
        <div className="flex flex-col gap-4">
          <div role="alert" className="alert alert-warning text-xs">
            <FaTriangleExclamation />
            <span>This section is under development. Visit <Link href="/community-settings" className="link">Community Settings</Link> for other settings.</span>
          </div>
          <Link href="mediawiki" className="link link-hover text-sm mt-10">MediaWiki Platforms</Link>
        </div>
      </div>
    </div>
  )
}