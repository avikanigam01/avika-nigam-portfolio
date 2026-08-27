import { SectionShell, AmbientGlow } from "./SectionShell";
import { Reveal } from "./Reveal";
import { SkillGroup } from "./SkillGroup";
import { skillGroups } from "@/data/portfolioData";

const LEGEND = [
  { label: "Foundation", meaning: "Basics in place" },
  { label: "Building", meaning: "Actively building with it" },
  { label: "Learning", meaning: "In progress right now" },
];

export function Skills() {
  return (
    <div className="relative">
      <AmbientGlow className="top-32 -right-28 h-80 w-80 opacity-25" color="var(--pink)" />
      <SectionShell
        id="skills"
        eyebrow="Skills"
        title={
          <>
            What I work with — <span className="text-spectrum">at honest levels.</span>
          </>
        }
        lead="No expert badges. These labels describe how deep I actually am in each thing today, and they'll change as I keep building."
      >
        <Reveal>
          <ul className="mb-10 flex flex-wrap gap-x-6 gap-y-2">
            {LEGEND.map((item) => (
              <li key={item.label} className="text-xs text-muted-foreground">
                <span className="font-display tracking-[0.12em] text-foreground/85 uppercase">
                  {item.label}
                </span>
                <span aria-hidden="true"> — </span>
                {item.meaning}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-2">
          {skillGroups.map((group, i) => (
            <Reveal key={group.id} delay={i * 0.05}>
              <SkillGroup group={group} index={i} />
            </Reveal>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}
