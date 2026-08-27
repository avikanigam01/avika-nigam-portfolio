import {
  BookOpen,
  GraduationCap,
  Brain,
  Code2,
  Package,
  Trophy,
  Users,
  Rocket,
} from "lucide-react";
import { SectionShell, AmbientGlow } from "./SectionShell";
import { Reveal } from "./Reveal";
import { aboutCards, aboutStatement, type AboutCard } from "@/data/portfolioData";

const ICONS: Record<AboutCard["icon"], typeof BookOpen> = {
  book: BookOpen,
  school: GraduationCap,
  brain: Brain,
  code: Code2,
  box: Package,
  trophy: Trophy,
  users: Users,
  rocket: Rocket,
};

const ACCENTS = ["var(--pink)", "var(--magenta)", "var(--violet)", "var(--orange)", "var(--yellow)"];

export function About() {
  return (
    <div className="relative">
      <AmbientGlow className="top-10 -left-24 h-72 w-72 opacity-30" color="var(--violet)" />
      <SectionShell
        id="about"
        eyebrow="About"
        title={<span className="text-spectrum">{aboutStatement}</span>}
        lead="I'm a second-year BCA student using these years to build things rather than wait until I feel ready. Here's the honest shape of where I am right now."
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aboutCards.map((card, i) => {
            const Icon = ICONS[card.icon];
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <Reveal as="li" key={card.title} delay={i * 0.05}>
                <article
                  className="group hairline-card relative h-full overflow-hidden rounded-2xl p-6 transition-transform duration-400 hover:-translate-y-1"
                  style={{ ["--card-accent" as string]: accent }}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
                    style={{ background: accent }}
                  />
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]"
                    aria-hidden="true"
                  >
                    <Icon className="h-4.5 w-4.5" style={{ color: accent }} />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold tracking-tight">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </SectionShell>
    </div>
  );
}
