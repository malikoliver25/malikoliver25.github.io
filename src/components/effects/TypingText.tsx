import { useState, useEffect } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

export default function TypingText({
  text,
  speed = 30,
  delay = 0,
  className = "",
  onComplete,
  showCursor = true,
}: TypingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      setDone(true);
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, started, text, speed, onComplete]);

  return (
    <span className={`font-mono ${className}`}>
      {displayed}
      {showCursor && !done && <span className="boot-cursor" />}
    </span>
  );
}
