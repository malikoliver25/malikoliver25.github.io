import { useState, useCallback, useRef } from "react";
import { executeCommand } from "@/components/Terminal/terminalService";
import type { TerminalLine } from "@/types";

let lineId = 0;
function nextId() {
  return ++lineId;
}

const WELCOME_LINES: TerminalLine[] = [
  {
    id: nextId(),
    type: "system",
    content: "╔══════════════════════════════════════════════╗",
  },
  {
    id: nextId(),
    type: "system",
    content: "║  NETRUNNER DECK v2.77 // TERMINAL INTERFACE  ║",
  },
  {
    id: nextId(),
    type: "system",
    content: "║  Operator: MALIK OLIVER                      ║",
  },
  {
    id: nextId(),
    type: "system",
    content: "║  Type 'help' for available commands          ║",
  },
  {
    id: nextId(),
    type: "system",
    content: "╚══════════════════════════════════════════════╝",
  },
  { id: nextId(), type: "output", content: "" },
];

export function useTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME_LINES);
  const [inputValue, setInputValue] = useState("");
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (!trimmed) return;

      const cmdName = trimmed.split(/\s+/)[0].toLowerCase();

      const inputLine: TerminalLine = {
        id: nextId(),
        type: "input",
        content: trimmed,
      };

      const outputLines = executeCommand(trimmed).map((content) => ({
        id: nextId(),
        type: "output" as const,
        content,
      }));

      if (cmdName === "clear") {
        setLines([]);
      } else {
        setLines((prev) => [...prev, inputLine, ...outputLines]);
      }
      setInputValue("");
      historyRef.current.unshift(trimmed);
      historyIndexRef.current = -1;
    },
    [inputValue]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const idx = historyIndexRef.current;
        if (idx < historyRef.current.length - 1) {
          historyIndexRef.current = idx + 1;
          setInputValue(historyRef.current[idx + 1]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const idx = historyIndexRef.current;
        if (idx > 0) {
          historyIndexRef.current = idx - 1;
          setInputValue(historyRef.current[idx - 1]);
        } else {
          historyIndexRef.current = -1;
          setInputValue("");
        }
      }
    },
    []
  );

  const clear = useCallback(() => {
    setLines([]);
  }, []);

  return {
    lines,
    inputValue,
    setInputValue,
    handleSubmit,
    handleKeyDown,
    clear,
  };
}
