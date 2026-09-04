import { useCallback, useRef, useState } from 'react';
import knowledge from '@/data/agent-knowledge.json';

export type ChatRole = 'user' | 'assistant';
export interface ChatMessage { id: string; role: ChatRole; content: string; }

// Vite replaces this literal at build — do not wrap import.meta
// @ts-ignore
const API_URL: string | undefined = import.meta.env.VITE_AGENT_API as string | undefined;
function getLatestProject(): string {
  const gh = (knowledge.knowledge as Array<{ id: string; content: string }>).find(k => k.id === 'github')?.content || '';
  const firstLine = gh.split('\n').find(l => l.startsWith('- ')) || '';
  if (firstLine) return firstLine.replace(/^- /, '').slice(0, 280);
  return 'malikoliver25.github.io — portfolio terminal, updated 2026-07-31';
}
function localMockReply(last: string): string {
  const q = last.toLowerCase();
  if (/^(yes|yeah|yep|sure|please|ok|okay|yup)$/i.test(q.trim())) return `Awesome — what next? I can show the README, stack, or how Malik built it — just name it!`;
  if (q.includes('latest') || q.includes('recent') || q.includes('newest') || q.includes('last project') || q.includes('most recent')) {
    const latest = getLatestProject();
    return `Ooh, latest drop! ✨ ${latest} — that's the freshest push on Malik's GitHub. Want the README or how he built it?`;
  }
  if (q.includes('weakest') || q.includes('weak point') || q.includes('weakness') || q.includes('weak point')) return `Real talk? My clock-face says Malik’s 3s are Airflow 3, Redis 3, Playwright 3, Ragas 3 — everything else is 4-5. He’s honest about it and ramps fast with TDD. No red flags for MLOps/AI. :)`;
  if (q.includes('largest') || q.includes('best project') || q.includes('biggest project') || q.includes('most impressive')) return `Biggest by impact: SENTINEL-CORE — graph security orchestration (Python/LangGraph). Best production: MTM-INDUSTRIAL-AI — CMMC air-gapped Llama 3.2 Vision. Latest by activity is ${getLatestProject()} — pick your flavor!`;
  if (q.includes('media') || (q.includes('game') && !q.includes('langgraph')) ) return `Yep! Media: jellyfin-web (Jellyfin media client fork), plus netrunner-deck & this portfolio — both terminal/game-like HUDs with GSAP/Three.js streaming. No AAA games, but playful UIs!`;
  if (q.includes('what language') || q.includes('most used') || q.includes('coding language') || q.includes('what coding')) {
    return `Top language? Python for the AI/MLOps core, TypeScript for the terminal — GitHub tally puts Python on top by repo count. Full split’s in my live GitHub chunk!`;
  }
  if (q.includes('best role') || q.includes('primary role') || q.includes('strongest role') || q.includes('what is his role') || q.includes('what does malik do') || (q.includes('role') && (q.includes('best') || q.includes('top') || q.includes('main')))) return `Primary: MLOps & AI Infrastructure Engineer. Strongest: MLOps/AI Orchestration — Level 5 in K8s, Docker, CI/CD, Python, FastAPI, LangGraph, Agentic Arch, vLLM. That’s his superpower.`;
  if (q.includes('ai engineer') || q.includes('ai engineering')) return `Yep — Malik is an AI Engineer (and MLOps) at core: LangGraph 5, Agentic Arch 5, RAG 4, vLLM 5. He builds agentic systems + air-gapped LLM infra, not toy demos. Title: MLOps & AI Infrastructure Engineer.`;
  if (q.includes('roles') || q.includes('what roles') || q.includes('could malik fill') || q.includes('positions') || q.includes('job')) {
    if (q.includes('fill') || q.includes('roles') || q.includes('positions') || q.includes('could')) return `Malik fits: MLOps Engineer, AI Infrastructure Engineer, Platform/DevOps (K8s), AI Application Engineer (LangGraph/RAG), and QA/Automation (Pytest/Playwright). Strongest: MLOps/AI Infra — Level 5 in K8s, Python, FastAPI, LangGraph, vLLM.`;
  }
  if (q.includes('good at') || q.includes('is malik good')) {
    if (q.includes('qa')) return `QA? Yep — Pytest 5, TDD 4, Playwright 3 — disciplined, not just “it works on my machine.”`;
    if (q.includes('ai engineering') || q.includes('ai engineer')) return `AI Eng? Core strength — LangGraph 5, Agentic Arch 5, RAG 4. He ships agentic systems, not demos.`;
    if (q.includes('mlops')) return `MLOps? Strongest — vLLM 5, K8s 5, containerized inference 5. Air-gapped LLM infra is his lane.`;
    if (q.includes('devops')) return `DevOps? Strong — K8s/Docker/CI/CD 5, Terraform 4, Azure 4. Ships with observability (Langfuse/New Relic).`;
    return `QA: Pytest 5/TDD 4, AI Eng: LangGraph 5, MLOps: vLLM 5, DevOps: K8s 5 — all solid. Weakest spots are the 3s (Airflow/Redis/Playwright/Ragas) but he’s upfront about them.`;
  }
  if (q.includes('sentinel')) return 'Ooh, SENTINEL-CORE! 🛡️ My fave — graph-based security orchestration, turns raw scan data into attack-path reports with LangGraph. Python, ACTIVE. Check Deployments 0 for the repo!';
  if (q.includes('mtm') || q.includes('industrial')) return 'MTM-INDUSTRIAL-AI! 🏭 CMMC-compliant, air-gapped — Llama 3.2 Vision running locally with no egress. Streamlit + LangGraph + MinIO/Qdrant. Factory-floor ready!';
  if (q.includes('contact') || q.includes('hire') || q.includes('transmission')) return 'Hiya! I’m NOVA — I can draft your Transmission to Malik right now! Just toss me name, work email, and your mission (stack/constraints/timeline) and I’ll queue it for you. :)';
  if (q.includes('skill') || q.includes('stack') || q.includes('k8s')) return 'Ooh, stack talk! K8s/Docker/Terraform · Python/FastAPI/LangGraph · vLLM · Langfuse/New Relic. Tell me a repo and I’ll nerd out on how Malik wired it!';
  if (q.includes('project') || q.includes('repo') || q.includes('github')) {
    const gh = (knowledge.knowledge as Array<{ id: string; content: string }>).find(k => k.id === 'github')?.content || '';
    const lines = gh.split('\n').filter(l => l.startsWith('- ')).slice(0, 3).map(l => `• ${l.replace(/^- /, '').slice(0, 120)}`).join('\n');
    return `Here are the freshest 3 from GitHub, fresh from the oven! ☀️\n${lines}\nAsk me about any by name!`;
  }
  if (q.includes('available') || q.includes('hire')) return 'Yep! Malik’s ACTIVE — Indianapolis, open to Chicago. Best move is Transmission — I’ll make sure he sees it fast!';
  return 'Hiya, I’m NOVA! ☀️ I live inside Malik’s GitHub (21 repos and counting!), so ask me about any build, how he solved it, or what he’d do for yours. Try “what’s latest?” or a repo name!';
}
export function useAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: 'Hiya! I’m NOVA ☀️ — your smiley GitHub gremlin for Malik’s world. Ask me about any repo, his stack, or how he’d tackle your project!' }
  ]);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    const isAffirmative = /^(yes|yeah|yep|sure|please|ok|okay|yup|show.*readme|readme|yess)$/i.test(trimmed);
    const prevAssistant = [...messages].reverse().find(m => m.role === 'assistant')?.content || '';
    const wantsReadme = prevAssistant.toLowerCase().includes('want the readme');
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
    const assistantId = `a-${Date.now() + 1}`;
    setMessages(prev => [...prev, userMsg, { id: assistantId, role: 'assistant', content: '' }]);
    setStreaming(true);

    // Affirmative follow-up without needing a model — give README snippet directly
    if (isAffirmative && wantsReadme) {
      const gh = (knowledge.knowledge as Array<{ id: string; content: string }>).find(k => k.id === 'github')?.content || '';
      const first = gh.split('\n').find(l => l.startsWith('- ')) || '';
      const readmeMatch = first.match(/README:\s*(.+)/);
      const snippet = readmeMatch ? readmeMatch[1].slice(0, 700) : 'Check the repo directly for the full README — https://github.com/malikoliver25/malikoliver25.github.io';
      const reply = `Got you! 📖 ${first.split('—')[0].trim()} README slice:\n${snippet.slice(0, 600)}...\nFull: ${first.match(/https:\/\/[^\s]+/)?.[0] || 'https://github.com/malikoliver25/malikoliver25.github.io'} — want stack or how he built it?`;
      let acc = '';
      for (const ch of reply.match(/.{1,18}/g) || [reply]) {
        acc += ch;
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: acc } : m));
        const { promise, resolve } = Promise.withResolvers<void>();
        setTimeout(resolve, 22);
        await promise;
      }
      setStreaming(false);
      return;
    }

    const history = [...messages, userMsg].slice(-8).map(m => ({ role: m.role, content: m.content }));
    if (API_URL) {
      try {
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: history }),
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('text/event-stream') && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let acc = '';
          let buf = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            let idx: number;
            while ((idx = buf.indexOf('\n\n')) !== -1) {
              const chunk = buf.slice(0, idx);
              buf = buf.slice(idx + 2);
              for (const line of chunk.split('\n')) {
                if (line.startsWith('data:')) {
                  try {
                    const j = JSON.parse(line.slice(5)) as Record<string, unknown>;
                    const d = j['delta'];
                    if (typeof d === 'string' && d) {
                      acc += d;
                      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: acc } : m));
                    }
                  } catch {}
                }
              }
            }
          }
          if (!acc) setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: localMockReply(trimmed) } : m));
        } else {
          const j = await res.json() as Record<string, unknown>;
          const reply = typeof j['reply'] === 'string' ? j['reply'] : localMockReply(trimmed);
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: reply } : m));
        }
      } catch {
        const reply = localMockReply(trimmed);
        let acc = '';
        for (const ch of reply) {
          acc += ch;
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: acc } : m));
          const { promise, resolve } = Promise.withResolvers<void>();
          setTimeout(resolve, 8);
          await promise;
        }
      } finally {
        setStreaming(false);
      }
      return;
    }
    // No API — local mock streaming
    const reply = localMockReply(trimmed);
    let acc = '';
    for (const ch of reply.match(/.{1,18}/g) || [reply]) {
      acc += ch;
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: acc } : m));
      const { promise, resolve } = Promise.withResolvers<void>();
      setTimeout(resolve, 22);
      await promise;
    }
    setStreaming(false);
  }, [messages, streaming]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([{ id: 'welcome', role: 'assistant', content: 'Hiya! I’m NOVA ☀️ — your smiley GitHub gremlin for Malik’s world. Ask me about any repo, his stack, or how he’d tackle your project!' }]);
    setStreaming(false);
  }, []);

  return { messages, streaming, send, reset } as const;
}
