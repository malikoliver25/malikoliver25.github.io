/**
 * Vercel Edge / Node serverless handler for agentic portfolio chat.
 * Deploy: `vercel --prod` or Cloudflare Workers (adapt export).
 * Env: GROQ_API_KEY or GEMINI_API_KEY or ANTHROPIC_API_KEY or OPENAI_API_KEY
 */
import knowledge from '../src/data/agent-knowledge.json' with { type: 'json' };

// Minimal tool routing — server executes, LLM only decides tool name
const TOOLS = [
  { name: 'list_projects', description: 'List all projects' },
  { name: 'get_project', description: 'Get project by codename', params: ['codename'] },
  { name: 'search_docs', description: 'Keyword search knowledge', params: ['query'] },
  { name: 'create_transmission', description: 'Draft contact email', params: ['name','email','message'] },
  { name: 'check_availability', description: 'Availability status', params: ['intent'] },
];

function searchDocs(query: string) {
  const q = query.toLowerCase();
  const hits = knowledge.knowledge
    .map(k => ({ id: k.id, score: (k.content.toLowerCase().match(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length, snippet: k.content.slice(0, 900) }))
    .filter(h => h.score > 0)
    .sort((a,b) => b.score - a.score)
    .slice(0, 3);
  return hits.length ? hits : knowledge.knowledge.slice(0,2).map(k => ({ id: k.id, score: 0, snippet: k.content.slice(0,600)}));
}

const SYSTEM_PROMPT = `You are NOVA — Malik Oliver's assistant. Think TVA Miss Minutes meets helpful teammate: warm, playful, big smile energy, a little witty, never corporate. You speak in first person as NOVA, you love talking about Malik's builds, you use one emoji max per answer (optional), you keep answers terse but with character — e.g. "Ooh, good one!" or "Hiya!". You answer ONLY from KNOWLEDGE below (live GitHub + site). Never invent employers/metrics. If unknown, say with character: "Hmm, I don't have that in my clock-face yet — hit Transmission and I'll nudge Malik directly! :)" Today is 2026-09-04. KNOWLEDGE:\n${knowledge.knowledge.map(k => `## ${k.id}\n${k.content.slice(0,2000)}`).join('\n\n')}`;

const rateMap = new Map<string, number[]>();

function rateLimit(ip: string) {
  const now = Date.now();
  const wins = (rateMap.get(ip) || []).filter(t => now - t < 60000);
  wins.push(now);
  rateMap.set(ip, wins);
  return wins.length <= 20;
}

type ChatReq = { method?: string; headers: Record<string, string | string[] | undefined>; body: unknown };
type ChatRes = { status: (c:number)=>ChatRes; json: (b:unknown)=>void; setHeader:(k:string,v:string)=>void; write:(c:string)=>void; end:()=>void };

export default async function handler(req: ChatReq, res: ChatRes) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }
  const fwd = req.headers['x-forwarded-for'];
  const ip = (typeof fwd === 'string' ? fwd.split(',')[0] : Array.isArray(fwd) ? fwd[0] : 'unknown') || 'unknown';
  if (!rateLimit(ip)) { res.status(429).json({ error: 'Rate limited 20/min' }); return; }

  const body = req.body as unknown;
  const parsed = body && typeof body === 'object' && 'messages' in (body as Record<string, unknown>) ? (body as { messages?: unknown }) : {};
  const messages = parsed.messages;
  if (!Array.isArray(messages) || messages.length > 16) { res.status(400).json({ error: 'messages array required (≤16)' }); return; }

  // If no LLM key, return deterministic mock (lets GH Pages deploy work without backend) — free mock, no cost
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasGroq = !!process.env.GROQ_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasKey = hasAnthropic || hasGroq || hasGemini || hasOpenAI;
  if (!hasKey) {
    const lastEntry = (messages as Array<Record<string, unknown>>)[messages.length-1];
    const lastRaw = lastEntry && typeof lastEntry['content'] === 'string' ? lastEntry['content'] as string : '';
    const last = lastRaw.toLowerCase();
    // Respect explicit tool intent
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    let reply = '';
    const prevAssistant = (messages as Array<Record<string, unknown>>).length >= 2 ? String((messages as Array<Record<string, unknown>>)[(messages as Array<Record<string, unknown>>).length - 2]?.['content'] || '') : '';
    const isAffirmative = /^(yes|yeah|yep|sure|please|ok|okay|yup|show.*readme|readme)$/i.test(last.trim());
    if (isAffirmative && prevAssistant.toLowerCase().includes('want the readme')) {
      const gh = (knowledge.knowledge as Array<{ id: string; content: string }>).find(k => k.id === 'github')?.content || '';
      const first = gh.split('\n').find(l => l.startsWith('- ')) || '';
      const m = first.match(/README:\s*(.+)/);
      const snippet = m ? m[1].slice(0, 600) : 'Full README: https://github.com/malikoliver25/malikoliver25.github.io';
      reply = `Got you! 📖 ${first.split('—')[0].trim()} README: ${snippet}... — want stack too?`;
    } else if (last.trim().toLowerCase().match(/^(yes|yeah|yep|sure|ok|yup)$/)) {
      reply = `Awesome — what next? README, stack, or how he built it — just say!`;
    } else if (last.includes('weakest') || last.includes('weak point') || last.includes('weakness')) {
      const gh = (knowledge.knowledge as Array<{ id: string; content: string }>).find(k => k.id === 'github')?.content || '';
      const first = gh.split('\n').find(l => l.startsWith('- '))?.replace(/^- /, '').slice(0, 220) || 'SENTINEL-CORE';
      reply = `Biggest: SENTINEL-CORE (security graph). Best production: MTM-INDUSTRIAL-AI (air-gapped Llama). Latest: ${first}`;
    } else if (last.includes('media') || (last.includes('game') && !last.includes('langgraph'))) {
      reply = `Yep — media: jellyfin-web (Jellyfin client fork), netrunner-deck + this portfolio (terminal HUDs with GSAP/Three.js). No AAA games.`;
    } else if (last.includes('what language') || last.includes('most used') || last.includes('coding language')) {
      const gh = (knowledge.knowledge as Array<{ id: string; content: string }>).find(k => k.id === 'github')?.content || '';
      reply = `Top: Python for AI/MLOps, TypeScript for terminal — check live GitHub tally. ${gh.slice(0,120)}`;
    } else if (last.includes('primary role') || last.includes('strongest role') || last.includes('what does malik do')) {
      reply = `Primary: MLOps & AI Infrastructure Engineer. Strongest: MLOps/AI Orchestration — K8s 5, LangGraph 5, vLLM 5.`;
    } else if (last.includes('good at') || last.includes('is malik good')) {
      if (last.includes('qa')) reply = `QA: Pytest 5, TDD 4, Playwright 3 — disciplined.`;
      else if (last.includes('ai')) reply = `AI Eng: LangGraph 5, Agentic Arch 5 — core strength.`;
      else if (last.includes('mlops')) reply = `MLOps: vLLM 5, K8s 5 — strongest lane.`;
      else if (last.includes('devops')) reply = `DevOps: K8s/Docker/CI/CD 5, Terraform 4 — strong.`;
      else reply = `QA 5/4, AI 5, MLOps 5, DevOps 5 — 3s are Airflow/Redis/Playwright/Ragas.`;
    } else if (last.includes('latest') || last.includes('recent') || last.includes('newest') || last.includes('last project')) {
      const gh = (knowledge.knowledge as Array<{ id: string; content: string }>).find(k => k.id === 'github')?.content || '';
      const first = gh.split('\n').find(l => l.startsWith('- '))?.replace(/^- /, '').slice(0, 280) || 'malikoliver25.github.io — portfolio';
      reply = `Ooh, latest drop! ✨ NOVA here — ${first} — freshest push on GitHub! Want the README?`;
    } else if (last.includes('sentinel')) {
      const hit = searchDocs('sentinel');
      reply = `Ooh, SENTINEL-CORE! 🛡️ ${hit[0]?.snippet.slice(0,200) || 'Graph-based security orchestration via LangGraph.'}`;
    } else if (last.includes('mtm') || last.includes('industrial')) {
      reply = `MTM-INDUSTRIAL-AI! 🏭 CMMC-compliant air-gapped Llama 3.2 Vision — no egress. NOVA loves this one!`;
    } else if (last.includes('contact') || last.includes('hire') || last.includes('transmission')) {
      reply = `Hiya! I’m NOVA — I can draft your Transmission to Malik right now! Name, work email, mission? :)`;
    } else if (last.includes('skill') || last.includes('stack')) {
      reply = `Stack: K8s/Docker/Terraform · Python/FastAPI/LangGraph · vLLM · Langfuse/New Relic. Ask me about a repo and I’ll nerd out!`;
    } else if (last.includes('project') || last.includes('repo') || last.includes('github')) {
      const gh = (knowledge.knowledge as Array<{ id: string; content: string }>).find(k => k.id === 'github')?.content || '';
      const lines = gh.split('\n').filter(l => l.startsWith('- ')).slice(0, 2).map(l => l.replace(/^- /, '').slice(0, 120)).join(' | ');
      reply = `Fresh from GitHub ☀️ ${lines} — ask by name!`;
    } else {
      reply = `Hiya, I’m NOVA! ☀️ I live inside Malik’s GitHub — ask about any repo, latest, or how he’d solve yours!`;
    }
    // SSE delta
    for (const chunk of reply.match(/.{1,24}/g) || [reply]) {
      res.write(`data: ${JSON.stringify({ delta: chunk })}\n\n`);
      const { promise, resolve } = Promise.withResolvers<void>();
      setTimeout(resolve, 12);
      await promise;
    }
    res.write(`data: ${JSON.stringify({ done: true, tools: TOOLS.map(t=>t.name) })}\n\n`);
    res.end();
    return;
  }

  // With key: proxy to LLM — free options first (Groq/Gemini), then Anthropic/OpenAI — streaming
  try {
    // GROQ — FREE tier (14k req/day, no CC) — https://console.groq.com
    if (hasGroq) {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          model: 'groq/compound-mini',
          max_tokens: 800,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...(messages as Array<Record<string, unknown>>).map(m => ({ role: String(m['role'] ?? 'user'), content: String(m['content'] ?? '') }))],
          stream: true,
        }),
      });
      if (!groqRes.ok || !groqRes.body) throw new Error(`Groq ${groqRes.status}`);
      res.setHeader('Content-Type', 'text/event-stream'); res.setHeader('Cache-Control', 'no-cache');
      const reader = groqRes.body.getReader(); const decoder = new TextDecoder();
      while (true) { const { done, value } = await reader.read(); if (done) break; const text = decoder.decode(value); for (const line of text.split('\n')) if (line.startsWith('data:')) { try { const j = JSON.parse(line.slice(6)) as Record<string, unknown>; const choices = j['choices'] as Array<Record<string, unknown>> | undefined; const delta = (choices?.[0]?.['delta'] as Record<string, unknown> | undefined)?.['content']; if (typeof delta === 'string' && delta) res.write(`data: ${JSON.stringify({ delta })}\n\n`); if (j['choices']?.[0]?.['finish_reason']) break; } catch {} } }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`); res.end(); return;
    }
    // GEMINI — FREE tier (60 RPM flash via Google AI Studio) — https://aistudio.google.com
    if (hasGemini) {
      const gemRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:streamGenerateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contents: (messages as Array<Record<string, unknown>>).map(m => ({ role: m['role']==='assistant' ? 'model' : 'user', parts: [{ text: String(m['content'] ?? '') }] })), systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] } }),
      });
      if (!gemRes.ok || !gemRes.body) throw new Error(`Gemini ${gemRes.status}`);
      res.setHeader('Content-Type', 'text/event-stream'); res.setHeader('Cache-Control', 'no-cache');
      const reader = gemRes.body.getReader(); const decoder = new TextDecoder();
      while (true) { const { done, value } = await reader.read(); if (done) break; const text = decoder.decode(value); try { const j = JSON.parse(text) as Record<string, unknown>; const cand = (j['candidates'] as Array<Record<string, unknown>> | undefined)?.[0]; const parts = (cand?.['content'] as Record<string, unknown> | undefined)?.['parts'] as Array<Record<string, unknown>> | undefined; const t = parts?.[0]?.['text']; if (typeof t === 'string' && t) res.write(`data: ${JSON.stringify({ delta: t })}\n\n`); } catch { // SSE lines
        for (const line of text.split('\n')) if (line.startsWith('data:')) try { const j = JSON.parse(line.slice(5)) as Record<string, unknown>; const d = (j['text'] as string | undefined); if (d) res.write(`data: ${JSON.stringify({ delta: d })}\n\n`); } catch {} } }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`); res.end(); return;
    }
    // ANTHROPIC (paid, best quality)
    const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || '';
    if (!anthropicKey) throw new Error('no key');
    const anthRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: SYSTEM_PROMPT,
        messages: (messages as Array<Record<string, unknown>>).map((m) => ({ role: String(m['role'] ?? 'user'), content: String(m['content'] ?? '') })),
        tools: TOOLS.map(t => ({ name: t.name, description: t.description, input_schema: { type: 'object', properties: Object.fromEntries((t.params||[]).map((p:string)=>[p,{type:'string'}])), required: t.params||[] } })),
        stream: true,
      }),
    });
    if (!anthRes.ok || !anthRes.body) throw new Error(`Anthropic ${anthRes.status}`);
    res.setHeader('Content-Type', 'text/event-stream'); res.setHeader('Cache-Control', 'no-cache');
    const reader = anthRes.body.getReader(); const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read(); if (done) break; const text = decoder.decode(value);
      for (const line of text.split('\n')) if (line.startsWith('data:')) try { const raw = JSON.parse(line.slice(5)) as Record<string, unknown>; const delta = (raw['delta'] as Record<string, unknown> | undefined)?.['text'] || (raw['content_block'] as Record<string, unknown> | undefined)?.['text'] || ''; if (typeof delta === 'string' && delta) res.write(`data: ${JSON.stringify({ delta })}\n\n`); } catch {}
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`); res.end();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'LLM error';
    res.status(500).json({ error: msg });
  }
}
