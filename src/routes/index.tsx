import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Journey } from "@/components/portfolio/Journey";
import { WhatIBring } from "@/components/portfolio/WhatIBring";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { VoiceInteraction } from "@/components/portfolio/VoiceInteraction";
import { profile } from "@/data/portfolioData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: profile.seoTitle },
      { name: "description", content: profile.seoDescription },
      { property: "og:title", content: profile.seoTitle },
      { property: "og:description", content: profile.seoDescription },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [voiceOpen, setVoiceOpen] = useState(false);
  const openVoice = () => setVoiceOpen(true);

  return (
    <div className="relative min-h-svh bg-background">
      {/* Global atmosphere: very subtle grain over the whole surface */}
      <div
        aria-hidden="true"
        className="grain pointer-events-none fixed inset-0 z-0 opacity-70"
      />

      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to content
      </a>

      <Navbar onTalk={openVoice} />

      <main>
        <Hero onTalk={openVoice} />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <WhatIBring />
        <Contact onTalk={openVoice} />
      </main>

      <Footer />
      <VoiceInteraction open={voiceOpen} onOpenChange={setVoiceOpen} />
    </div>
  );
}
