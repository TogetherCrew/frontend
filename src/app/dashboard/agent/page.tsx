'use client';

import { FaRobot } from "react-icons/fa6";

import { Chat } from "@/components/chat/Chat";
import SEO from "@/components/global/SEO";

export default function AgentPage() {
  return (
    <>
      <SEO titleTemplate="Agent" />
      <div className="flex flex-col gap-4 bg-gray-100 w-full p-8 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            <FaRobot className="inline-block mr-2" />
            <span>What can I help you with?</span>
          </h1>
          <p className="text-center text-gray-500">Ask me anything about the community</p>
        </div>
        <Chat />
      </div >
    </>
  );
}