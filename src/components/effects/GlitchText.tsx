interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p" | "div";
}

export default function GlitchText({
  text,
  className = "",
  as: Tag = "span",
}: GlitchTextProps) {
  return (
    <Tag className={`glitch-text ${className}`} data-text={text}>
      {text}
    </Tag>
  );
}
