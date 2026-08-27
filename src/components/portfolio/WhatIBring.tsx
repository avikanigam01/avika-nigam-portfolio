import { Reveal } from "./Reveal";
import { whatIBring, profile } from "@/data/portfolioData";

const ACCENT_VAR: Record<(typeof whatIBring)[number]["accent"], string> = {
  pink: "var(--pink)",
  magenta: "var(--magenta)",
  violet: "var(--violet)",
  orange: "var(--orange)",
};

export function WhatIBring() {
  return (
    <section
      aria-labelledby="bring-heading"
      className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-28"
    >
      <Reveal>
        <p className="font-display text-[0.7rem] tracking-[0.35em] text-muted-foreground uppercase">
          What I bring
        </p>
        <h2
          id="bring-heading"
          className="mt-4 font-display text-3xl leading-[1.05] font-semibold tracking-tight sm:text-4xl md:text-5xl"
        >
          <span className="text-spectrum">{profile.motto.join(" ")}</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Four things you can count on from me today — stated plainly, at the stage I'm actually at.
        </p>
      </Reveal>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {whatIBring.map((item, i) => {
          const accent = ACCENT_VAR[item.accent];
          return (
            <Reveal as="li" key={item.number} delay={i * 0.07}>
              <article className="group hairline-card relative h-full overflow-hidden rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-1.5">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full opacity-10 blur-[60px] transition-opacity duration-500 group-hover:opacity-45"
                  style={{ background: accent }}
                />
                <span
                  className="font-display text-4xl font-semibold tracking-tight opacity-25 transition-opacity duration-500 group-hover:opacity-70"
                  style={{ color: accent }}
                  aria-hidden="true"
                >
                  {item.number}
                </span>
                <h3
                  className="mt-4 font-display text-lg font-semibold tracking-[0.14em]"
                  style={{ color: accent }}
                >
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-foreground/80">{item.body}</p>
              </article>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
