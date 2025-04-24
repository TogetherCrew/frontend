import { useEffect, useState } from "react";

export default function FadeIn({ text, duration = 1000 }: { text: string, duration?: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in after the component mounts
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transition-opacity duration-${duration} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <p dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}
