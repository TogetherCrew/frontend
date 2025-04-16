'use client'

import { MODULE_CONTEXT } from "@/constants/ModuleContext"
import { useRouter } from "next/navigation"
import { FaXTwitter } from "react-icons/fa6"
import { FaDiscord, FaTelegram } from "react-icons/fa"

export default function CommunityGuardianPage() {
  const router = useRouter()

  // TODO: rename to community-guardian
  const data = MODULE_CONTEXT.find(module => module.name === 'violationDetection')

  if (!data || data === undefined) {
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {data && <data.icon size={24} className="text-secondary" />}
        <h1 className="text-2xl font-semibold">{data?.title}</h1>
      </div>
      <p className="text-md text-gray-400">
        Neutral, AI-powered Code of Conduct enforcement for safer, healthier communities.
      </p>

      <div className="flex flex-col gap-4 w-full md:w-1/2">

        <p className="text-sm leading-relaxed">Community Guardian helps maintain respectful and inclusive conversations by detecting potential Code of Conduct violations and flagging them early.</p>

        <p className="text-sm leading-relaxed">This module is currently in beta and access is limited.</p>

        <p className="text-sm leading-relaxed">We're working with selected communities to fine-tune detection, alerts, and recommendations. If you're interested in early access or want to learn more, reach out to us on:</p>

        <ul className="flex flex-col gap-2 text-sm">
          <li className="w-fit">
            <a href="https://discord.gg/QNJGeZeT" target="_blank" className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-2">
              <FaDiscord />
              <span>Discord</span>
            </a>
          </li>
          <li className="w-fit">
            <a href="https://x.com/together_crew" target="_blank" className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-2">
              <FaXTwitter />
              <span>Twitter</span>
            </a>
          </li>
          <li className="w-fit">
            <a href="https://t.me/k_bc0" target="_blank" className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-2">
              <FaTelegram />
              <span>Telegram</span>
            </a>
          </li>
        </ul>

      </div>
    </div >

  )
}