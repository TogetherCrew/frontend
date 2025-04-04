import { useEffect, useState } from "react";

export default function FadeIn({ text }: { text: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in after the component mounts
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <p dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}
