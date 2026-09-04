import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(enabled: boolean, heroRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!enabled) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-kicker", { y: 16, opacity: 0, duration: 0.6 }, 0.1)
        .from(".hero-title .split-word", { yPercent: 110, duration: 0.85, stagger: 0.06 }, 0.2)
        .from(".hero-copy", { y: 14, opacity: 0, duration: 0.6 }, 0.55)
        .from(".hero-ctas > *", { y: 12, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.62)
        .from(".hero-meta", { opacity: 0, duration: 0.6 }, 0.75)
        .from(".hero-viewport", { clipPath: "inset(8% 8% 8% 8% round 22px)", opacity: 0, duration: 1.0, ease: "expo.out" }, 0.35)
        .from(".hero-viewport-glow", { opacity: 0, duration: 0.8 }, 0.9)
        .from(".nav-bar", { y: -24, opacity: 0, duration: 0.7 }, 0);
    }, heroRef);
    return () => ctx.revert();
  }, [enabled, heroRef]);

  useEffect(() => {
    if (!enabled) {
      gsap.set(".reveal-word, .reveal-line, .reveal-card, .reveal-item", { clearProps: "all" });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((sec) => {
        const words = sec.querySelectorAll<HTMLElement>(".reveal-word");
        const lines = sec.querySelectorAll<HTMLElement>(".reveal-line");
        const cards = sec.querySelectorAll<HTMLElement>(".reveal-card, .reveal-item");
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
  }, [enabled]);
}
