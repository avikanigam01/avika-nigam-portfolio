import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Proficiency, SkillGroupData } from "@/data/portfolioData";

const ACCENT_VAR: Record<SkillGroupData["accent"], string> = {
  pink: "var(--pink)",
  magenta: "var(--magenta)",
  violet: "var(--violet)",
  orange: "var(--orange)",
  yellow: "var(--yellow)",
};

const LEVEL_DOTS: Record<Proficiency, number> = {
  Foundation: 1,
  Building: 2,
  Learning: 1,
};

const LEVEL_HINT: Record<Proficiency, string> = {
  Foundation: "Comfortable with the basics",
  Building: "Actively building with it",
  Learning: "Currently learning",
};

export function SkillGroup({ group, index }: { group: SkillGroupData; index: number }) {
  const [open, setOpen] = useState(index < 2);
  const accent = ACCENT_VAR[group.accent];

  return (
    <div
      className="hairline-card group relative overflow-hidden rounded-2xl transition-colors"
      style={{ ["--accent" as string]: accent }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`skills-${group.id}`}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        >
          <span>
            <span className="font-display text-lg font-semibold tracking-tight">{group.title}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{group.caption}</span>
          </span>
          <span className="flex items-center gap-3">
            <span
              className="rounded-full border px-2.5 py-0.5 font-display text-[0.65rem] tracking-widest"
              style={{ borderColor: `color-mix(in oklab, ${accent} 45%, transparent)`, color: accent }}
            >
              {group.skills.length}
            </span>
            <ChevronDown
              className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", open && "rotate-180")}
              aria-hidden="true"
            />
          </span>
        </button>
      </h3>

      <div
        id={`skills-${group.id}`}
        hidden={!open}
        className="border-t border-white/6 px-6 py-5"
      >
        <ul className="flex flex-wrap gap-2">
          {group.skills.map((skill) => (
            <li key={skill.name}>
              <span
                title={`${skill.name} — ${LEVEL_HINT[skill.level]}`}
                className="group/skill flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.07]"
                style={{ ["--skill-accent" as string]: accent }}
              >
                <span className="text-foreground/90">{skill.name}</span>
                <span className="flex items-center gap-1" aria-hidden="true">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1 w-1 rounded-full"
                      style={{
                        background: d < LEVEL_DOTS[skill.level] ? accent : "oklch(1 0 0 / 18%)",
                      }}
                    />
                  ))}
                </span>
                <span className="font-display text-[0.6rem] tracking-[0.15em] text-muted-foreground uppercase">
                  {skill.level}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
