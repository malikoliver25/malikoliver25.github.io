import { useEffect, useRef, useState } from "react";

interface NeonBorderProps {
  color?: "cyan" | "yellow" | "red";
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export default function NeonBorder({
  color = "cyan",
  children,
  className = "",
  animate = false,
}: NeonBorderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate]);

  const colorClasses = {
    cyan: "border-electric-cyan/50 shadow-neon",
    yellow: "border-neon-yellow/50 shadow-neon-yellow",
    red: "border-glitch-red/50",
  };

  return (
    <div
      ref={ref}
      className={`border transition-all duration-700 ${
        visible ? colorClasses[color] : "border-transparent"
      } ${className}`}
    >
      {children}
    </div>
  );
}
