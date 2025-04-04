import { useEffect, useRef, useState } from "react";

import { axiosInstance } from "@/axiosInstance";
import { useToken } from "@/context/TokenContext";

import ChatForm from "./ChatForm";
import FadeIn from "./FadeIn";
import Loader from "./Loader";
interface Message {
  text: string;
  role: "user" | "assistant";
}

const endpoint = "/hivemind/ask";

const preDefinedQuestions = [
  {
    label: "Latest news",
    value: "Give me the latest news on this community? What are the discussions happening?",
  },
  {
    label: "Get involved",
    value: "How can I get involved in this community?",
  },
  {
    label: "Typescript experience",
    value: "Who in this community has experience working with Typescript?",
  },
  {
    label: "Start a new project",
    value: "I want to start a new project in this community, what should I do? who should I reach out to?",
  },
  {
    label: "Overview of projects",
    value: "Give me an overview of all the ongoing projects in this community",
  },
  {
    label: "Tell me a joke",
    value: "Tell me a joke about this community",
  },
]

function replaceLinksWithAnchor(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.replace(urlRegex, (match) => {
    return `<a className='text-blue-500 hover:underline' href="${match}" target="_blank" rel="noopener noreferrer">Link</a>
    `;
  });
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatId = crypto.randomUUID();
  const { community } = useToken();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (input: string) => {
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
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(endpoint, payload);
      const { answer } = response.data;
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

  const handlePreDefinedQuestion = async (question: string) => {
    await handleSubmit(question);
  }

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-8">
      <div className="flex flex-wrap gap-2">
        {preDefinedQuestions.map((question, index) => (
          <button
            onClick={() => handlePreDefinedQuestion(question.value)}
            key={index}
            className="bg-white text-gray-500 px-4 py-2 rounded-full text-sm border border-gray-200 hover:bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {question.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col bg-white h-[800px] rounded-lg shadow-lg">
        <div className="flex-1 overflow-y-auto p-8 space-y-4 text-sm">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} leading-8`}
            >
              {message.role === 'user' ? (
                <div className="max-w-[80%] rounded-lg px-4 py-2  bg-gray-100">
                  <FadeIn text={message.text} duration={100} />
                </div>
              ) : (
                <FadeIn text={replaceLinksWithAnchor(message.text)} />
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Loader />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <ChatForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div >
  );
}
