import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { certifications as certs } from "@/data/certs";
import BootSequence from "@/components/BootSequence/BootSequence";

gsap.registerPlugin(ScrollTrigger);

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);
  return reduced;
}

function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span aria-hidden="true">
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline pb-[0.08em] mr-[0.28em] last:mr-0" style={{ verticalAlign: "bottom" }}>
          <span className="split-word inline-block will-change-transform" style={{ display: "inline-block" }}>{w}</span>
        </span>
      ))}
    </span>
  );
}

function InfraCanvas({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let disposed = false;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x06080b, 14, 28);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 3.8, 9.5);
    camera.lookAt(0, 0, 0);
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x06080b, 1);
    const grid = new THREE.GridHelper(20, 20, 0x1c232e, 0x141a23);
    (grid.material as THREE.Material & { opacity: number; transparent: boolean }).opacity = 0.55;
    (grid.material as THREE.Material & { transparent: boolean }).transparent = true;
    scene.add(grid);
    const nodeCount = 14;
    const nodeGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.9, roughness: 0.4 });
    const amberMat = new THREE.MeshStandardMaterial({ color: 0xffe81a, emissive: 0xffe81a, emissiveIntensity: 0.8, roughness: 0.4 });
    const nodes: THREE.Mesh[] = [];
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const mat = i % 4 === 0 ? amberMat : nodeMat;
      const m = new THREE.Mesh(nodeGeo, mat);
      const x = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      const y = Math.random() * 0.6 + 0.25;
      m.position.set(x, y, z);
      const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, y, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0x253041, transparent: true, opacity: 0.9 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(x, y / 2, z);
      scene.add(stem);
      scene.add(m);
      nodes.push(m);
      positions.push(new THREE.Vector3(x, y, z));
    }
    const lineMat = new THREE.LineBasicMaterial({ color: 0x1c232e, transparent: true, opacity: 0.9 });
    const lineGroup = new THREE.Group();
    for (let i = 0; i < positions.length; i++) for (let j = i + 1; j < positions.length; j++) if (positions[i].distanceTo(positions[j]) < 4.2) { const g = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]); lineGroup.add(new THREE.Line(g, lineMat)); }
    scene.add(lineGroup);
    scene.add(new THREE.AmbientLight(0x8899b1, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 1.0); dir.position.set(6, 8, 4); scene.add(dir);
    const point = new THREE.PointLight(0x00e5ff, 4, 12); point.position.set(0, 3, 0); scene.add(point);
    const planeGeo = new THREE.PlaneGeometry(22, 22);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0x0e131a, roughness: 0.95, metalness: 0.05 });
    const plane = new THREE.Mesh(planeGeo, planeMat); plane.rotation.x = -Math.PI / 2; scene.add(plane);
    const ro = new ResizeObserver(() => {
      if (!wrap || !renderer || disposed) return;
      const w = wrap.clientWidth; const h = wrap.clientHeight; if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    });
    ro.observe(wrap);
    { const w = wrap.clientWidth; const h = wrap.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
    let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
    const onPointer = (e: PointerEvent) => { const rect = wrap.getBoundingClientRect(); targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.6; targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.8; };
    const onLeave = () => { targetX = 0; targetY = 0; };
    wrap.addEventListener("pointermove", onPointer, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    let hidden = document.hidden; let visible = !hidden; const visHandler = () => { hidden = document.hidden; updateActive(); }; document.addEventListener("visibilitychange", visHandler);
    let t = 0; let lastTs = 0;
    const setActive = (isActive: boolean) => {
      visible = isActive && !hidden;
      wrap.dataset.animationActive = visible ? "true" : "false";
      canvas.dataset.animationActive = visible ? "true" : "false";
      wrap.classList.toggle("is-offscreen", !visible);
    };
    const updateActive = () => setActive(document.visibilityState === "visible" && wrap.getBoundingClientRect().bottom > 0 && wrap.getBoundingClientRect().top < window.innerHeight);
    const tick = (now: number = performance.now()) => {
      if (disposed) return;
      if (!visible || hidden) { raf = 0; return; }
      raf = requestAnimationFrame(tick);
      const dt = lastTs ? Math.min((now - lastTs) / 1000, 0.05) : 0.016; lastTs = now;
      t += dt * 0.9; pointerX += (targetX - pointerX) * 0.06; pointerY += (targetY - pointerY) * 0.06;
      camera.position.x = pointerX * 1.2; camera.position.y = 3.8 + pointerY * 0.6; camera.lookAt(pointerX * 0.4, 0.2, 0);
      nodes.forEach((n, i) => { n.position.y = positions[i].y + Math.sin(t * 0.9 + i) * 0.07; });
      grid.position.z = Math.sin(t * 0.3) * 0.2;
      if (renderer) renderer.render(scene, camera);
    };
    const io = new IntersectionObserver((entries) => { const e = entries[0]; const isIn = e.isIntersecting; setActive(isIn); if (isIn && !hidden && raf === 0 && !disposed) { lastTs = 0; tick(); } else if (!isIn && raf) { cancelAnimationFrame(raf); raf = 0; } }, { threshold: 0.01 });
    io.observe(wrap); setActive(wrap.getBoundingClientRect().bottom > 0 && wrap.getBoundingClientRect().top < window.innerHeight && !hidden); if (visible) tick();
    const onContextLost = (e: Event) => { e.preventDefault(); if (raf) cancelAnimationFrame(raf); raf = 0; };
    canvas.addEventListener("webglcontextlost", onContextLost as EventListener);
    return () => {
      disposed = true; if (raf) cancelAnimationFrame(raf); raf = 0; ro.disconnect(); io.disconnect();
      wrap.removeEventListener("pointermove", onPointer); wrap.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", visHandler);
      canvas.removeEventListener("webglcontextlost", onContextLost as EventListener);
      lineGroup.children.forEach((c) => { (c as THREE.Line).geometry.dispose(); });
      nodes.forEach((m) => m.geometry.dispose()); planeGeo.dispose(); planeMat.dispose(); nodeGeo.dispose(); renderer?.dispose();
    };
  }, [reduced]);
  if (reduced) {
    return (
      <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-ink">
        <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" alt="Close-up of a printed circuit board with precise traces and components" className="h-full w-full object-cover opacity-60" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(#1C232E 1px, transparent 1px), linear-gradient(90deg, #1C232E 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>
    );
  }
  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-[#06080B]">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-90" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(#1C232E 1px, transparent 1px), linear-gradient(90deg, #1C232E 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
    </div>
  );
}

export default function App() {
  const reduced = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [transmissionSent, setTransmissionSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [bootComplete, setBootComplete] = useState(false);
  useEffect(() => {
    if (!bootComplete) { const prev = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = prev; }; }
  }, [bootComplete]);
  useEffect(() => { if (bootComplete) { const id = window.setTimeout(() => ScrollTrigger.refresh(), 800); return () => window.clearTimeout(id); } }, [bootComplete]);
  // pause offscreen CSS animations + prevent below-fold cards from ticking
  useEffect(() => {
    if (!bootComplete) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section"));
    if (sections.length === 0) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sec = entry.target as HTMLElement;
        const isVisible = entry.isIntersecting;
        sec.classList.toggle("is-offscreen", !isVisible);
        sec.querySelectorAll<HTMLElement>(".animate-pulse, .reveal-card, .hero-viewport, .deploy-track").forEach((el) => el.classList.toggle("is-offscreen", !isVisible));
      });
    }, { threshold: 0.01, rootMargin: "120px" });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [bootComplete]);
  // Lenis removed per user request — using native scroll
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh); const t = setTimeout(refresh, 800);
    return () => { window.removeEventListener("load", refresh); clearTimeout(t); };
  }, []);
  useEffect(() => {
    if (reduced) return; if (!bootComplete) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-kicker", { y: 16, opacity: 0, duration: 0.6 }, 0.1)
        .from(".hero-title .split-word", { yPercent: 110, duration: 0.85, stagger: 0.06 }, 0.2)
        .from(".hero-copy", { y: 14, opacity: 0, duration: 0.6 }, 0.55)
        .from(".hero-ctas > *", { y: 12, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.62)
        .from(".hero-meta", { opacity: 0, duration: 0.6 }, 0.75)
        .from(".hero-viewport", { clipPath: "inset(8% 8% 8% 8% round 16px)", opacity: 0, duration: 1.0, ease: "expo.out" }, 0.35)
        .from(".hero-viewport-glow", { opacity: 0, duration: 0.8 }, 0.9)
        .from(".nav-bar", { y: -24, opacity: 0, duration: 0.7 }, 0);
    }, heroRef);
    return () => ctx.revert();
  }, [reduced, bootComplete]);
  useEffect(() => {
    if (!bootComplete) return;
    if (reduced) { gsap.set(".reveal-word, .reveal-line, .reveal-card", { clearProps: "all" }); return; }
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((sec) => {
        const words = sec.querySelectorAll<HTMLElement>(".reveal-word");
        const lines = sec.querySelectorAll<HTMLElement>(".reveal-line");
        const cards = sec.querySelectorAll<HTMLElement>(".reveal-card");
        const hairline = sec.querySelector<HTMLElement>(".reveal-hairline");
        const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: "top 82%", once: true } });
        if (hairline) tl.from(hairline, { scaleX: 0, transformOrigin: "left", duration: 0.8, ease: "expo.out" }, 0);
        if (words.length) tl.from(words, { yPercent: 110, duration: 0.7, stagger: 0.045, ease: "power3.out" }, 0.08);
        if (lines.length) tl.from(lines, { y: 14, opacity: 0, duration: 0.55, stagger: 0.06, ease: "power3.out" }, 0.22);
        if (cards.length) tl.from(cards, { y: 22, opacity: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" }, 0.28);
      });
      const progress = document.querySelector<HTMLElement>(".deploy-progress-fill");
      const track = document.querySelector<HTMLElement>(".deploy-track");
      if (progress && track) gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: track, start: "top bottom", end: "bottom 60%", scrub: 0.5 } });
    });
    return () => ctx.revert();
  }, [reduced, bootComplete]);
  const scrollTo = (id: string) => {
    setMobileMenu(false);
    const el = document.querySelector(id);
    if (!el) return;
    (el as HTMLElement).scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };
  const handleTransmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim(); const email = String(fd.get("email") || "").trim(); const message = String(fd.get("message") || "").trim();
    if (!name || !email || !message) { setFormError("All fields are required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFormError("Enter a valid email."); return; }
    setFormError(null); setTransmissionSent(true); setTimeout(() => setTransmissionSent(false), 4200); (e.currentTarget as HTMLFormElement).reset();
  };
  return (
    <div className="min-h-dvh bg-void text-paper antialiased">
      {!bootComplete && <BootSequence onComplete={() => setBootComplete(true)} />}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-cyan focus:px-4 focus:py-3 focus:text-void focus:font-mono focus:text-xs focus:tracking-widest">Skip to content</a>
      <div className="nav-bar sticky top-0 z-40 border-b border-hairline bg-void/80 backdrop-blur-[12px] supports-[backdrop-filter]:bg-void/70">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan/50 to-transparent opacity-60" aria-hidden="true" />
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-[56px] sm:h-[60px]">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); }} className="group flex items-center gap-3 min-w-0 focus:outline-none">
            <span className="grid h-8 w-8 place-items-center rounded-[8px] border border-hairline bg-panel text-[10px] font-mono font-semibold tracking-[0.14em] text-mist group-hover:border-cyan/40 group-hover:text-cyan transition-colors">M/O</span>
            <span className="hidden sm:flex flex-col leading-none text-left"><span className="font-display text-[13px] font-semibold tracking-[0.02em] text-paper">Malik Oliver</span><span className="font-mono text-[10px] tracking-[0.16em] text-mist">NETRUNNER_M4LIK — LVL 5</span></span>
            <span className="sm:hidden font-mono text-[11px] tracking-[0.16em] text-mist truncate">NETRUNNER_M4LIK</span>
          </a>
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
            {[["Systems", "#systems"], ["Deployments", "#deployments"], ["Signal Log", "#log"], ["Transmission", "#transmission"]].map(([label, href]) => (
              <button key={label} onClick={() => scrollTo(href)} className="font-mono text-[11px] tracking-[0.16em] text-mist hover:text-paper px-3 py-2 rounded transition-colors">{label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-hairline bg-panel px-3 py-[6px]"><span className="h-1.5 w-1.5 rounded-full bg-mist/40" aria-hidden="true" /><span className="font-mono text-[10px] tracking-[0.16em] text-mist">STACK • VERIFIED</span><span className="hidden xl:inline font-mono text-[10px] tracking-[0.12em] text-mist-soft">K8s • vLLM • LangGraph</span></div>
            <button onClick={() => scrollTo("#transmission")} className="hidden sm:inline-flex items-center gap-2 rounded-full bg-signal px-4 py-[9px] font-mono text-[11px] font-semibold tracking-[0.14em] text-void hover:bg-[#FFF04A] active:scale-[0.98] transition-all"><span>INITIATE</span><span aria-hidden="true" className="text-[13px] leading-none">↗</span></button>
            <button aria-label={mobileMenu ? "Close menu" : "Open menu"} aria-expanded={mobileMenu} aria-controls="mobile-nav" onClick={() => setMobileMenu((v) => !v)} className="lg:hidden grid h-9 w-9 place-items-center rounded-full border border-hairline bg-panel text-mist hover:text-paper hover:border-hairline-strong transition-colors"><span aria-hidden="true" className="font-mono text-[14px] leading-none">{mobileMenu ? "✕" : "≡"}</span></button>
          </div>
        </div>
        {mobileMenu && (<div id="mobile-nav" className="lg:hidden border-t border-hairline bg-ink/95 backdrop-blur"><div className="px-4 py-3 flex flex-col">{[["Systems", "#systems"], ["Deployments", "#deployments"], ["Signal Log", "#log"], ["Transmission", "#transmission"]].map(([label, href]) => (<button key={label} onClick={() => scrollTo(href)} className="text-left font-mono text-[12px] tracking-[0.16em] text-mist hover:text-paper py-3 border-b border-hairline last:border-0">{label}</button>))}<button onClick={() => scrollTo("#transmission")} className="mt-3 inline-flex justify-center rounded-full bg-signal px-4 py-3 font-mono text-[11px] font-semibold tracking-[0.16em] text-void">INITIATE TRANSMISSION</button></div></div>)}
      </div>
      <main id="main">
        <section ref={heroRef} className="relative overflow-hidden border-b border-hairline bg-void">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block"><div className="mx-auto h-full max-w-[1440px] px-6 lg:px-8 relative"><div className="absolute left-6 lg:left-8 top-0 bottom-0 w-px bg-hairline/60" /><div className="absolute right-6 lg:right-8 top-0 bottom-0 w-px bg-hairline/60" /></div></div>
          <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-8 pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-10">
              <div className="relative flex flex-col justify-center py-2 lg:py-6 min-w-0">
                <div className="hero-kicker inline-flex items-center gap-2 self-start rounded-full border border-hairline bg-panel px-3 py-1.5"><span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" /><span className="font-mono text-[10px] tracking-[0.18em] text-mist">MLOPS / AI INFRASTRUCTURE — INDIANAPOLIS → CHICAGO</span></div>
                <h1 className="hero-title mt-5 sm:mt-6 font-display font-semibold leading-[0.88] tracking-[-0.032em] text-paper text-balance">
                  <span className="sr-only">Infrastructure for intelligence that can&apos;t fail.</span>
                  <span className="block text-[34px] sm:text-[46px] lg:text-[56px] xl:text-[62px]" aria-hidden="true"><SplitWords text="Infrastructure" /></span>
                  <span className="block text-[34px] sm:text-[46px] lg:text-[56px] xl:text-[62px] text-mist-soft" aria-hidden="true"><SplitWords text="for intelligence" /></span>
                  <span className="block text-[34px] sm:text-[46px] lg:text-[56px] xl:text-[62px]" aria-hidden="true"><SplitWords text="that can't fail." /></span>
                </h1>
                <p className="hero-copy mt-4 sm:mt-5 max-w-[52ch] font-body text-[14px] sm:text-[15px] leading-[1.7] text-mist">{profile.summary}</p>
                <div className="hero-ctas mt-6 sm:mt-7 flex flex-wrap items-center gap-4">
                  <button onClick={() => scrollTo("#deployments")} className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-[11px] font-mono text-[11px] font-semibold tracking-[0.14em] text-void hover:bg-white active:scale-[0.98] transition-all">VIEW DEPLOYMENTS <span aria-hidden="true">→</span></button>
                  <button onClick={() => scrollTo("#systems")} className="inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.14em] text-mist hover:text-paper underline decoration-hairline-strong underline-offset-4">SYSTEMS DOSSIER →</button>
                </div>
                <div className="hero-meta mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-4 border-t border-hairline pt-4 sm:pt-5 max-w-[560px]">
                  {[["TARGET UPTIME", "99.98%", "Edge inference — design target"], ["TARGET P95", "< 80ms", "Streamed — design target"], ["STACK", "K8s → vLLM", "Air-gapped"]].map(([k, v, d]) => (<div key={k} className="min-w-0"><div className="font-mono text-[10px] tracking-[0.16em] text-mist">{k}</div><div className="mt-1 font-display text-[16px] sm:text-[17px] font-semibold tracking-[-0.02em] text-paper">{v}</div><div className="font-mono text-[10px] tracking-[0.12em] text-mist/70 truncate">{d}</div></div>))}
                </div>
              </div>
              <div className="relative min-h-[360px] sm:min-h-[440px] lg:min-h-[520px] flex flex-col gap-3">
                <div className="hero-viewport relative flex-1 overflow-hidden rounded-[18px] sm:rounded-[22px] border border-hairline-strong bg-ink shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                  <InfraCanvas reduced={reduced} />
                  <div className="pointer-events-none absolute left-3 right-3 top-3 flex items-start justify-between gap-3">
                    <div className="rounded-full border border-white/10 bg-black/55 backdrop-blur px-3 py-1.5 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden="true" /><span className="font-mono text-[10px] tracking-[0.16em] text-white">ORCHESTRATION FIELD • FIELD VIEW</span></div>
                    <div className="hidden sm:flex rounded-full border border-white/10 bg-black/55 backdrop-blur px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-white/80">{profile.clearance} // {profile.status}</div>
                  </div>
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <div className="rounded-[14px] border border-white/10 bg-black/60 backdrop-blur p-3 sm:p-3.5 flex items-center gap-3">
                      <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop" alt="Industrial edge deployment — factory floor with automation hardware" width={96} height={72} className="h-[56px] w-[76px] sm:h-[64px] sm:w-[84px] object-cover rounded-[8px] border border-white/10 flex-none" loading="eager" decoding="async" />
                      <div className="min-w-0"><div className="font-mono text-[10px] tracking-[0.16em] text-white/60">FIELD NODE 03 — MTM INDUSTRIAL</div><div className="mt-1 font-display text-[13px] font-semibold leading-tight text-white">Llama 3.2 Vision — air-gapped, no egress.</div><div className="mt-1 flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-white/60"><span className="h-1 w-1 rounded-full bg-[#18E07A]" aria-hidden="true" /> CMMC COMPLIANT</div></div>
                    </div>
                  </div>
                </div>
                <div className="hero-viewport-glow hidden lg:flex items-center justify-between rounded-full border border-hairline bg-panel px-4 py-2.5"><span className="font-mono text-[10px] tracking-[0.16em] text-mist">FIELD VIEW • THREE.JS • POINTER PARALLAX</span><span className="font-mono text-[10px] tracking-[0.12em] text-mist/60">{profile.location}</span></div>
              </div>
            </div>
          </div>
        </section>
        <section className="reveal-section relative border-b border-hairline bg-ink">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
              <div>
                <div className="flex items-center gap-3"><span className="font-mono text-[10px] tracking-[0.18em] text-mist">01 — MANIFESTO</span><span className="reveal-hairline h-px flex-1 origin-left bg-hairline" aria-hidden="true" /></div>
                <h2 className="mt-4 font-display text-[28px] sm:text-[34px] lg:text-[40px] font-semibold leading-[0.95] tracking-[-0.03em] text-paper text-balance">
                  <span className="sr-only">Systems that stay up when networks go down. Built for the factory floor, not the demo.</span>
                  <span aria-hidden="true" className="block overflow-hidden pb-1"><span className="reveal-word inline-block">Systems</span> <span className="reveal-word inline-block">that</span> <span className="reveal-word inline-block">stay</span> <span className="reveal-word inline-block">up</span></span>
                  <span aria-hidden="true" className="block overflow-hidden pb-1 text-mist-soft"><span className="reveal-word inline-block">when</span> <span className="reveal-word inline-block">networks</span> <span className="reveal-word inline-block">go</span> <span className="reveal-word inline-block">down.</span></span>
                </h2>
                <div className="reveal-line mt-4 max-w-[60ch] space-y-3 font-body text-[14px] leading-[1.75] text-mist"><p>I design AI infrastructure the way aerospace designs avionics — with checklists, observability, and a bias for systems that degrade gracefully. Most AI fails at the handoff to production. Mine is built for air-gapped floors, intermittent links, and operators who need answers, not dashboards.</p><p className="text-mist-soft">From graph-based security orchestration (Sentinel-Core) to CMMC-compliant vision at the edge (MTM Industrial), I ship containerized, observable services that run where the cloud can&apos;t reach.</p></div>
                <div className="reveal-line mt-6 flex flex-wrap gap-2"><span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-panel px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-mist">K8S • DOCKER • TERRAFORM</span><span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-panel px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-mist">LANGGRAPH • FASTAPI • vLLM</span><span className="inline-flex items-center gap-2 rounded-full border border-signal/20 bg-signal-soft px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-paper">CLEARANCE {profile.clearance}</span></div>
              </div>
              <div className="reveal-card relative overflow-hidden rounded-[18px] border border-hairline-strong bg-panel p-4 sm:p-5">
                <div className="flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.18em] text-mist">OPERATOR DOSSIER</span><span className="font-mono text-[10px] tracking-[0.14em] text-[#18E07A]">● VERIFIED</span></div>
                <div className="mt-4">
                  <div className="min-w-0"><div className="font-display text-[16px] font-semibold tracking-[-0.02em] text-paper">{profile.realName}</div><div className="font-mono text-[11px] tracking-[0.12em] text-mist">{profile.title}</div><dl className="mt-3 space-y-2 font-mono text-[11px] leading-relaxed"><div className="flex justify-between gap-2 border-b border-hairline py-1.5"><dt className="tracking-[0.14em] text-mist">HANDLE</dt><dd className="text-paper text-right truncate">{profile.handle}</dd></div><div className="flex justify-between gap-2 border-b border-hairline py-1.5"><dt className="tracking-[0.14em] text-mist">BASE</dt><dd className="text-paper">{profile.location}</dd></div><div className="flex justify-between gap-2 border-b border-hairline py-1.5"><dt className="tracking-[0.14em] text-mist">MOBILITY</dt><dd className="text-paper">{profile.openToRelocation} ✓</dd></div><div className="flex justify-between gap-2 py-1.5"><dt className="tracking-[0.14em] text-mist">STATUS</dt><dd className="inline-flex items-center gap-1.5 text-paper"><span className="h-1.5 w-1.5 rounded-full bg-[#18E07A]" aria-hidden="true" />{profile.status}</dd></div></dl><div className="mt-3 flex gap-2"><a href={`mailto:${profile.email}`} className="flex-1 inline-flex justify-center rounded-full bg-paper px-3 py-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-void hover:bg-white transition-colors">EMAIL</a><a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex-1 inline-flex justify-center rounded-full border border-hairline px-3 py-2 font-mono text-[10px] tracking-[0.14em] text-mist hover:text-paper hover:border-hairline-strong transition-colors">LINKEDIN</a></div></div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-hairline pt-4">{[["DEPLOYMENTS", "4", "production"], ["NODES", "Air-gapped", "zero egress"], ["OBSERVABILITY", "Langfuse", "New Relic"]].map(([k, v, s]) => (<div key={k} className="rounded-[10px] border border-hairline bg-void px-3 py-2.5"><div className="font-mono text-[9px] tracking-[0.16em] text-mist">{k}</div><div className="mt-1 font-display text-[13px] font-semibold text-paper leading-none">{v}</div><div className="font-mono text-[9px] tracking-[0.12em] text-mist/70">{s}</div></div>))}</div>
              </div>
            </div>
          </div>
        </section>
        <section id="systems" className="reveal-section relative border-b border-hairline bg-void">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><div className="flex items-center gap-3"><span className="font-mono text-[10px] tracking-[0.18em] text-mist">02 — SYSTEMS</span><span className="reveal-hairline hidden sm:block h-px w-24 origin-left bg-hairline" aria-hidden="true" /></div><h2 className="mt-3 font-display text-[28px] sm:text-[34px] font-semibold tracking-[-0.03em] text-paper"><span className="sr-only">Measured capabilities. No vanity metrics.</span><span aria-hidden="true" className="overflow-hidden inline-block"><span className="reveal-word inline-block">Measured</span></span> <span aria-hidden="true" className="overflow-hidden inline-block text-mist-soft"><span className="reveal-word inline-block">capabilities.</span></span></h2><p className="reveal-line mt-2 max-w-[56ch] font-body text-[14px] leading-[1.6] text-mist">Four instrument panels. Each skill is bench-tested in production — not a self-assessment.</p></div><div className="reveal-line hidden lg:flex items-center gap-2 rounded-full border border-hairline bg-panel px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-mist"><span className="h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden="true" /> CALIBRATED • PRODUCTION-PROVEN</div>
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {skillCategories.map((cat, idx) => (<div key={cat.category} className="reveal-card group relative border-b border-hairline bg-transparent py-5 first:border-t first:border-hairline"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-[9px] border border-hairline bg-void font-mono text-[13px] text-mist group-hover:border-cyan/30 group-hover:text-cyan transition-colors">{cat.icon}</span><div><div className="font-mono text-[10px] tracking-[0.16em] text-mist">PANEL {String(idx + 1).padStart(2, "0")}</div><div className="font-display text-[13px] font-semibold tracking-[-0.01em] text-paper">{cat.category}</div></div></div><span className="font-mono text-[10px] tracking-[0.14em] text-mist/60">{cat.skills.length} INSTRUMENTS</span></div><div className="mt-4 space-y-2.5">{cat.skills.map((s) => (<div key={s.name} className="group/row flex items-center gap-3"><div className="min-w-0 flex-1"><div className="flex items-baseline justify-between gap-2"><span className="font-body text-[13px] font-medium text-paper truncate">{s.name}</span><span className="font-mono text-[10px] tracking-[0.12em] text-mist shrink-0">LVL {s.level}/5</span></div><div className="mt-1.5 h-[3px] w-full rounded-full bg-void border border-hairline overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-cyan to-cyan/60 transition-all" style={{ width: `${(s.level / 5) * 100}%` }} aria-hidden="true" /></div></div></div>))}</div></div>))}
            </div>
          </div>
        </section>
        <section id="deployments" className="reveal-section deploy-track relative border-b border-hairline bg-ink">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-3"><span className="font-mono text-[10px] tracking-[0.18em] text-mist">03 — SELECTED DEPLOYMENTS</span><span className="reveal-hairline hidden sm:block h-px w-24 origin-left bg-hairline" aria-hidden="true" /></div><h2 className="mt-3 font-display text-[28px] sm:text-[34px] font-semibold tracking-[-0.03em] text-paper"><span className="sr-only">Shipped systems, not slides.</span><span aria-hidden="true" className="overflow-hidden inline-block"><span className="reveal-word inline-block">Shipped</span></span> <span aria-hidden="true" className="overflow-hidden inline-block text-mist-soft"><span className="reveal-word inline-block">systems,</span></span> <span aria-hidden="true" className="overflow-hidden inline-block"><span className="reveal-word inline-block">not</span></span> <span aria-hidden="true" className="overflow-hidden inline-block"><span className="reveal-word inline-block">slides.</span></span></h2></div><div className="reveal-line font-mono text-[11px] tracking-[0.14em] text-mist">04 CASES • 2024—2026</div></div>
            <div className="mt-6 h-px w-full bg-hairline overflow-hidden rounded-full" aria-hidden="true"><div className="deploy-progress-fill h-full w-full origin-left bg-gradient-to-r from-cyan via-signal to-cyan" style={{ transform: "scaleX(0)" }} /></div>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
              {projects.map((p, i) => (<article key={p.codename} className={`reveal-card group relative overflow-hidden rounded-[18px] border border-hairline bg-panel hover:border-hairline-strong transition-colors flex flex-col ${i === 0 ? "lg:col-span-7" : i === 1 ? "lg:col-span-5" : "lg:col-span-6"}`}><div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-cyan/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" /><div className="p-4 sm:p-5 flex-1 flex flex-col"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><span className="font-mono text-[10px] tracking-[0.16em] text-mist">0{i + 1}</span><span className="h-1 w-1 rounded-full bg-hairline-strong" aria-hidden="true" /><span className="font-mono text-[10px] tracking-[0.16em] text-mist">{p.codename}</span></div><span className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] ${p.status === "ACTIVE" ? "border-[#18E07A]/20 bg-[#18E07A]/10 text-[#18E07A]" : p.status === "DEPLOYED" ? "border-cyan/20 bg-cyan-soft text-cyan" : "border-hairline bg-void text-mist"}`}>{p.status}</span></div><h3 className="mt-3 font-display text-[18px] sm:text-[19px] font-semibold leading-tight tracking-[-0.02em] text-paper">{p.name}</h3><p className="mt-2 font-body text-[13px] leading-[1.6] text-mist line-clamp-3">{p.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{p.techStack.map((t) => (<span key={t} className="inline-flex rounded-full border border-hairline bg-void px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-mist">{t}</span>))}</div><div className="mt-5 flex items-center gap-3 pt-4 border-t border-hairline"><a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-paper px-4 py-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-void hover:bg-white transition-colors">OPEN REPO <span aria-hidden="true">↗</span></a><span className="font-mono text-[10px] tracking-[0.12em] text-mist/60 hidden sm:inline">github.com/malikoliver25</span></div></div><div className="h-[96px] sm:h-[110px] relative overflow-hidden border-t border-hairline bg-void"><img src={i === 0 ? "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop" : i === 1 ? "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" : i === 2 ? "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop" : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-500" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" aria-hidden="true" /><div className="absolute bottom-2 left-3 right-3 flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.14em] text-white/70">PREVIEW • {p.codename}</span><span className="h-px flex-1 mx-3 bg-white/15 hidden sm:block" aria-hidden="true" /><span className="font-mono text-[10px] tracking-[0.12em] text-white/60">PRODUCTION-GRADE</span></div></div></article>))}
            </div>
            <div className="reveal-line mt-4 flex flex-wrap items-center gap-3 rounded-[12px] border border-hairline bg-void px-4 py-3"><span className="font-mono text-[10px] tracking-[0.16em] text-mist">SYSTEM NOTE</span><span className="h-3 w-px bg-hairline hidden sm:block" aria-hidden="true" /><span className="font-body text-[13px] leading-relaxed text-mist">All repos are live. No mock dashboards, no placeholder case studies — clone, read the README, run the stack.</span></div>
          </div>
        </section>
        <section id="log" className="reveal-section relative border-b border-hairline bg-void">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-10">
              <div><div className="flex items-center gap-3"><span className="font-mono text-[10px] tracking-[0.18em] text-mist">04 — SIGNAL LOG</span><span className="reveal-hairline h-px flex-1 origin-left bg-hairline" aria-hidden="true" /></div><h2 className="mt-3 font-display text-[28px] sm:text-[34px] font-semibold tracking-[-0.03em] text-paper"><span className="sr-only">Traceable history. Verifiable claims.</span><span aria-hidden="true" className="block overflow-hidden"><span className="reveal-word inline-block">Traceable</span> <span className="reveal-word inline-block">history.</span></span><span aria-hidden="true" className="block overflow-hidden text-mist-soft"><span className="reveal-word inline-block">Verifiable</span> <span className="reveal-word inline-block">claims.</span></span></h2><p className="reveal-line mt-3 max-w-[48ch] font-body text-[14px] leading-[1.65] text-mist">Certifications, deployments, and system events — timestamped like an observability feed, not a resume.</p><div className="reveal-card mt-6 rounded-[14px] border border-hairline bg-panel p-4"><div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-mist"><span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" aria-hidden="true" /> LIVE FEED • {new Date().getFullYear()} OPERATIONS</div><div className="mt-3 grid grid-cols-3 gap-2">{[["CERTS", String(certs.length), "verified"], ["REGION", "IND → CHI", "mobile"], ["AVAILABILITY", "Q2 2026", "open to relocation"]].map(([k, v, s]) => (<div key={k} className="rounded-[10px] border border-hairline bg-void px-3 py-2.5"><div className="font-mono text-[9px] tracking-[0.16em] text-mist">{k}</div><div className="mt-1 font-display text-[13px] font-semibold text-paper">{v}</div><div className="font-mono text-[9px] tracking-[0.12em] text-mist/70">{s}</div></div>))}</div></div></div>
              <div className="reveal-card relative border-y border-hairline bg-transparent overflow-hidden"><div className="flex items-center justify-between border-b border-hairline px-0 sm:px-1 py-3 bg-transparent"><span className="font-mono text-[10px] tracking-[0.16em] text-mist">EVENT STREAM • CHRONOLOGICAL</span><span className="font-mono text-[10px] tracking-[0.12em] text-mist/60">{certs.length} EVENTS</span></div><div className="max-h-[360px] overflow-auto no-scrollbar divide-y divide-hairline">{certs.map((c) => (<div key={`${c.name}-${c.issued}`} className="group flex gap-3 px-4 py-3.5 hover:bg-void/60 transition-colors"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-hairline-strong group-hover:bg-cyan shrink-0 transition-colors" aria-hidden="true" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline gap-2"><span className="font-display text-[13px] font-semibold text-paper">{c.name}</span>{c.verified && <span className="inline-flex rounded-full border border-[#18E07A]/20 bg-[#18E07A]/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] text-[#18E07A]">VERIFIED</span>}</div><div className="font-mono text-[11px] tracking-[0.10em] text-mist">{c.issuer} • {c.issued}</div></div><span className="font-mono text-[10px] tracking-[0.12em] text-mist/50 hidden sm:block shrink-0">{c.id ? `#${c.id.slice(0, 8)}` : "—"}</span></div>))}{[["DEPLOYMENT", "MTM Industrial AI — air-gapped portal live", "2025-11"], ["DEPLOYMENT", "Sentinel-Core — graph orchestration engine", "2025-09"], ["DEPLOYMENT", "Portfolio Assistant — async FastAPI orchestration", "2025-07"]].map(([type, title, date]) => (<div key={title} className="group flex gap-3 px-4 py-3.5 hover:bg-void/60 transition-colors"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-signal shrink-0" aria-hidden="true" /><div className="min-w-0 flex-1"><div className="font-display text-[13px] font-semibold text-paper">{title}</div><div className="font-mono text-[11px] tracking-[0.10em] text-mist">{type}</div></div><span className="font-mono text-[10px] tracking-[0.12em] text-mist/50 shrink-0">{date}</span></div>))}</div></div>
            </div>
          </div>
        </section>
        <section id="transmission" className="reveal-section relative overflow-hidden border-b border-hairline bg-ink">
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]" aria-hidden="true" style={{ backgroundImage: "linear-gradient(#1C232E 1px, transparent 1px), linear-gradient(90deg, #1C232E 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-8 items-start">
              <div><div className="flex items-center gap-3"><span className="font-mono text-[10px] tracking-[0.18em] text-mist">05 — TRANSMISSION</span><span className="reveal-hairline h-px flex-1 origin-left bg-hairline" aria-hidden="true" /></div><h2 className="mt-3 font-display text-[30px] sm:text-[38px] lg:text-[42px] font-semibold leading-[0.92] tracking-[-0.03em] text-paper text-balance"><span className="sr-only">Send a signal, not a form letter.</span><span aria-hidden="true" className="block overflow-hidden"><span className="reveal-word inline-block">Send</span> <span className="reveal-word inline-block">a</span> <span className="reveal-word inline-block">signal,</span></span><span aria-hidden="true" className="block overflow-hidden text-mist-soft"><span className="reveal-word inline-block">not</span> <span className="reveal-word inline-block">a</span> <span className="reveal-word inline-block">form</span> <span className="reveal-word inline-block">letter.</span></span></h2><p className="reveal-line mt-3 max-w-[52ch] font-body text-[14px] leading-[1.65] text-mist">Hiring for an air-gapped deployment, model-serving bottleneck, or agentic workflow that needs to stay deterministic? Initiate a transmission — I reply within 24 hours.</p><div className="reveal-line mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[560px]"><a href={`mailto:${profile.email}`} className="group flex items-center justify-between rounded-[14px] border border-hairline bg-panel px-4 py-3 hover:border-hairline-strong transition-colors"><span className="font-mono text-[11px] tracking-[0.12em] text-mist">EMAIL</span><span className="font-body text-[13px] font-medium text-paper truncate ml-3 group-hover:text-cyan transition-colors">{profile.email}</span></a><a href={profile.linkedin} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-[14px] border border-hairline bg-panel px-4 py-3 hover:border-hairline-strong transition-colors"><span className="font-mono text-[11px] tracking-[0.12em] text-mist">LINKEDIN</span><span className="font-body text-[13px] font-medium text-paper group-hover:text-cyan transition-colors">Open profile ↗</span></a><div className="sm:col-span-2 flex items-center gap-3 rounded-[12px] border border-signal/15 bg-signal-soft px-4 py-3"><span className="h-2 w-2 rounded-full bg-signal animate-pulse" aria-hidden="true" /><span className="font-mono text-[11px] tracking-[0.14em] text-paper">RELOCATION OPEN • {profile.openToRelocation} — REMOTE / HYBRID / ON-SITE</span></div></div></div>
              <form onSubmit={handleTransmission} noValidate className="reveal-card relative rounded-[18px] border border-hairline-strong bg-panel p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.16em] text-mist">TRANSMISSION FORM • ENCRYPTED</span><span className="font-mono text-[10px] tracking-[0.12em] text-mist/60">RFC 2119 • MUST REPLY</span></div>
                {transmissionSent && (<div role="status" aria-live="polite" className="mt-4 rounded-[12px] border border-[#18E07A]/20 bg-[#18E07A]/10 px-4 py-3 font-mono text-[12px] tracking-[0.02em] text-[#18E07A]">✓ Transmission queued — I&apos;ll respond within 24 hours. Check your inbox for confirmation.</div>)}
                {formError && (<div role="alert" className="mt-4 rounded-[12px] border border-[#FF3B30]/20 bg-[#FF3B30]/10 px-4 py-3 font-mono text-[12px] text-[#FF8A80]">{formError}</div>)}
                <div className="mt-4 grid gap-4">
                  <label className="block"><span className="font-mono text-[10px] tracking-[0.16em] text-mist">YOUR NAME</span><input name="name" required autoComplete="name" placeholder="Ada Lovelace" className="mt-1.5 w-full rounded-[10px] border border-hairline bg-void px-3.5 py-3 font-body text-[14px] text-paper placeholder:text-mist/50 focus:border-cyan/40 focus:outline-none" /></label>
                  <label className="block"><span className="font-mono text-[10px] tracking-[0.16em] text-mist">WORK EMAIL</span><input name="email" type="email" required autoComplete="email" placeholder="ada@systems.co" className="mt-1.5 w-full rounded-[10px] border border-hairline bg-void px-3.5 py-3 font-body text-[14px] text-paper placeholder:text-mist/50 focus:border-cyan/40 focus:outline-none" /></label>
                  <label className="block"><span className="font-mono text-[10px] tracking-[0.16em] text-mist">MISSION BRIEF</span><textarea name="message" required rows={4} placeholder="What system needs to stay up when the network goes down? Stack, constraints, timeline…" className="mt-1.5 w-full resize-none rounded-[10px] border border-hairline bg-void px-3.5 py-3 font-body text-[14px] leading-[1.6] text-paper placeholder:text-mist/50 focus:border-cyan/40 focus:outline-none" /></label>
                  <div className="flex flex-wrap items-center gap-3 pt-1"><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-[11px] font-semibold tracking-[0.14em] text-void hover:bg-[#FFF04A] active:scale-[0.98] transition-all">SEND TRANSMISSION <span aria-hidden="true">↗</span></button><span className="font-mono text-[10px] tracking-[0.12em] text-mist/60">No spam. No templates. Direct reply.</span></div>
                </div>
                <div className="pointer-events-none absolute -right-px -top-px h-6 w-6 overflow-hidden rounded-tr-[18px]" aria-hidden="true"><div className="absolute right-0 top-0 h-px w-6 bg-cyan/60" /><div className="absolute right-0 top-0 h-6 w-px bg-cyan/60" /></div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-hairline bg-void">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
            <div><div className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-[8px] border border-hairline bg-panel font-mono text-[10px] font-semibold tracking-[0.14em] text-mist">M/O</span><span className="font-display text-[14px] font-semibold tracking-[-0.01em] text-paper">Malik Oliver</span><span className="hidden sm:inline h-3 w-px bg-hairline" aria-hidden="true" /><span className="hidden sm:inline font-mono text-[10px] tracking-[0.16em] text-mist">MLOPS & AI INFRASTRUCTURE</span></div><p className="mt-3 max-w-[48ch] font-body text-[13px] leading-[1.6] text-mist">Systems engineering for intelligence that can&apos;t fail — containerized, observable, and proven in air-gapped environments.</p><div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.12em] text-mist/60"><span>© {new Date().getFullYear()} Malik Oliver</span><span aria-hidden="true">•</span><span>Built with GSAP + Lenis + Three.js</span><span aria-hidden="true">•</span><span className="hidden sm:inline">No trackers. No fluff.</span></div></div>
            <div><div className="font-mono text-[10px] tracking-[0.18em] text-mist">NAVIGATE</div><div className="mt-3 grid gap-1.5">{[["Systems", "#systems"], ["Deployments", "#deployments"], ["Signal Log", "#log"], ["Transmission", "#transmission"]].map(([l, h]) => (<button key={l} onClick={() => scrollTo(h)} className="text-left font-body text-[13px] text-mist hover:text-paper transition-colors">{l}</button>))}</div></div>
            <div><div className="font-mono text-[10px] tracking-[0.18em] text-mist">CONNECT</div><div className="mt-3 grid gap-1.5 font-body text-[13px]"><a href={profile.github} target="_blank" rel="noreferrer" className="text-mist hover:text-paper transition-colors">GitHub ↗</a><a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-mist hover:text-paper transition-colors">LinkedIn ↗</a><a href={`mailto:${profile.email}`} className="text-mist hover:text-paper transition-colors">{profile.email}</a><span className="font-mono text-[11px] tracking-[0.12em] text-mist/60">{profile.phone}</span></div></div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-6"><div className="font-mono text-[10px] tracking-[0.14em] text-mist/60">SPEC: 1440px frame • Hairline #1C232E • Display Space Grotesk • Mono JetBrains Mono • Motion GSAP + native scroll</div><div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-mist/50"><span className="h-1.5 w-1.5 rounded-full bg-[#18E07A]" aria-hidden="true" /> ALL SYSTEMS NOMINAL</div></div>
        </div>
      </footer>
      <style>{`@media (prefers-reduced-motion: reduce) { .split-word { transform: none !important; } }`}</style>
    </div>
  );
}
