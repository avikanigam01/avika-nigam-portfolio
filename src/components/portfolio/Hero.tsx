import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, Mic } from "lucide-react";
import { AvatarExperience } from "./AvatarExperience";
import { profile } from "@/data/portfolioData";

const PARTICLES = [
  { left: "12%", top: "22%", size: 3, delay: 0, color: "var(--pink)" },
  { left: "82%", top: "18%", size: 2, delay: 1.2, color: "var(--yellow)" },
  { left: "68%", top: "72%", size: 3, delay: 0.6, color: "var(--orange)" },
  { left: "22%", top: "68%", size: 2, delay: 1.8, color: "var(--violet)" },
  { left: "48%", top: "12%", size: 2, delay: 2.4, color: "var(--magenta)" },
  { left: "90%", top: "52%", size: 2, delay: 0.9, color: "var(--pink)" },
  { left: "7%", top: "48%", size: 2, delay: 1.5, color: "var(--violet)" },
];

export function Hero({ onTalk }: { onTalk: () => void }) {
  const reduced = useReducedMotion();

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-16 sm:px-8 sm:pt-28"
    >
      {/* Ambient background field — colourful light behind the interface */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(58% 42% at 50% 34%, oklch(0.42 0.19 332 / 42%) 0%, transparent 72%), radial-gradient(44% 38% at 84% 76%, oklch(0.46 0.17 55 / 26%) 0%, transparent 72%), radial-gradient(40% 38% at 12% 72%, oklch(0.4 0.2 300 / 26%) 0%, transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 12%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 12%) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(68% 54% at 50% 45%, #000 0%, transparent 100%)",
        }}
      />
      {/* Bottom fade so the hero flows into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
      />

      {!reduced &&
        PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute -z-10 rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 12px ${p.color}`,
            }}
            animate={{ y: [0, -26, 0], opacity: [0.15, 0.9, 0.15] }}
            transition={{ duration: 9 + i, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}

      <motion.div
        className="flex w-full max-w-5xl flex-col items-center text-center"
        initial={{ opacity: 0, y: reduced ? 0 : 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1
          id="hero-heading"
          className="font-display text-[clamp(2.1rem,9vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.02em]"
        >
          <span className="text-spectrum">AVIKA NIGAM</span>
        </h1>
        <p className="mt-4 font-display text-[0.66rem] tracking-[0.42em] text-muted-foreground uppercase sm:text-xs">
          {profile.label}
        </p>

        <div className="mt-10 sm:mt-12">
          <AvatarExperience state="idle" size="lg" />
        </div>

        <div className="mt-12 flex max-w-2xl flex-col items-center">
          <p className="font-display text-sm tracking-[0.2em] text-pink uppercase">
            {profile.greeting}
          </p>
          <h2 className="mt-4 font-display text-[clamp(1.6rem,5.2vw,3rem)] leading-[1.05] font-semibold tracking-tight text-balance">
            {profile.headline}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            {profile.supporting}
          </p>

          <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={onTalk}
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 font-display text-sm font-semibold tracking-[0.16em] text-primary-foreground uppercase transition-transform duration-300 hover:-translate-y-0.5 sm:w-auto"
              style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-lift)" }}
            >
              <Mic className="h-4 w-4" aria-hidden="true" />
              Talk to me
            </button>
            <a
              href="#projects"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 font-display text-sm font-semibold tracking-[0.16em] uppercase transition-colors hover:border-white/35 hover:bg-white/5 sm:w-auto"
            >
              Explore my work
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">{profile.avatarHelper}</p>
        </div>
      </motion.div>
    </section>
  );
}
