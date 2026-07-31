import { useState } from "react";
import CRTOverlay from "@/components/effects/CRTOverlay";
import BootSequence from "@/components/BootSequence/BootSequence";
import Header from "@/components/Header/Header";
import AboutSection from "@/components/About/AboutSection";
import SkillGrid from "@/components/SkillGrid/SkillGrid";
import LogHistory from "@/components/LogHistory/LogHistory";
import ProjectCards from "@/components/Projects/ProjectCards";
import LinkHub from "@/components/LinkHub/LinkHub";
import Terminal from "@/components/Terminal/Terminal";
import ContactModal from "@/components/ContactModal/ContactModal";

export default function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  if (!bootComplete) {
    return <BootSequence onComplete={() => setBootComplete(true)} />;
  }

  return (
    <div className="min-h-[100dvh] bg-void-black text-white font-body overflow-x-hidden">
      <CRTOverlay />
      <Header />

      <main className="pt-14 pb-safe">
        <AboutSection />
        <SkillGrid />
        <LogHistory />
        <ProjectCards />
        <LinkHub />

        <div className="flex justify-center py-8 px-4">
          <button
            onClick={() => setContactOpen(true)}
            className="px-6 sm:px-8 py-3 border border-glitch-red/50 text-glitch-red font-mono text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase hover:bg-glitch-red/10 hover:shadow-[0_0_20px_rgba(255,0,60,0.3)] transition-all duration-300"
          >
            [INITIATE TRANSMISSION]
          </button>
        </div>

        <Terminal />
      </main>

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}
