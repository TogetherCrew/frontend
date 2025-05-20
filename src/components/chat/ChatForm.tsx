import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";

import ChatTextArea from "./ChatTextArea";

export default function ChatForm({ onSubmit, isLoading }: { onSubmit: (input: string) => void, isLoading: boolean }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(input);
    setInput("")
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-lg mb-4 bg-base-100 w-full max-w-3xl">
      <div className="flex flex-col gap-2">
        <ChatTextArea input={input} setInput={setInput} onSubmit={onSubmit} isLoading={isLoading} />
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">It can take our agent a couple minutes to answer.</p>
          <button
            type="submit"
            className="p-2 bg-primary-400 text-white rounded-full hover:bg-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            disabled={isLoading}
          >
            <FaArrowUp size={20} />
          </button>
        </div>
      </div>
    </form>
  )
}