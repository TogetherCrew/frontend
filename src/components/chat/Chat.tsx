import { useState } from "react";
import { BsSend } from "react-icons/bs";

import { axiosInstance } from "@/axiosInstance";
import { useToken } from "@/context/TokenContext";

interface Message {
  text: string;
  role: "user" | "assistant";
}

const endpoint = "/hivemind/ask";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatId = crypto.randomUUID();
  const { community } = useToken();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      role: "user",
    };

    const payload = {
      communityId: community?.id,
      question: input,
      chatId
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(endpoint, payload);
      const { answer } = response.data;
      console.log(answer);
      const assistantMessage: Message = {
        text: answer,
        role: "assistant",
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage: Message = {
        text: "An error occurred while sending the message",
        role: "assistant",
      };
      setMessages(prev => [...prev, assistantMessage]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
                }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BsSend />
          </button>
        </div>
      </form>
    </div>
  );
}
