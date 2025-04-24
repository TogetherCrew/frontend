import { useEffect, useRef } from "react";

export default function ChatTextArea({ input, setInput, onSubmit, isLoading }: { input: string, setInput: (value: string) => void, onSubmit: (value: string) => void, isLoading: boolean }) {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(input);
      setInput("");
    }
  }

  return (
    <>
      <textarea
        ref={textareaRef}
        onChange={(e) => setInput(e.target.value)}
        disabled={isLoading}
        rows={1}
        value={input}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything"
        className="flex-1  py-2 rounded-lg focus:outline-none resize-none min-h-[44px] max-h-[200px] overflow-y-auto"
        autoFocus
      />
    </>
  )
}