import { useState } from "react";
import { SectionShell, AmbientGlow } from "./SectionShell";
import { Reveal } from "./Reveal";
import { Milestone } from "./Milestone";
import { milestones } from "@/data/portfolioData";

export function Journey() {
  const [activeId, setActiveId] = useState<string>(milestones[0]!.id);

  return (
    <div className="relative">
      <AmbientGlow className="top-24 right-0 h-80 w-80 opacity-25" color="var(--violet)" />
      <SectionShell
        id="journey"
        eyebrow="Journey"
        title={
          <>
            A path still being <span className="text-spectrum">written.</span>
          </>
        }
        lead="Hover, tap or keyboard-focus any point to see what happened there. Nothing here is finished — that's the point."
      >
        <Reveal>
          <div className="relative">
            {/* Flowing spine */}
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-6 left-[1.3rem] w-px sm:left-[1.8rem]"
              style={{
                background:
                  "linear-gradient(180deg, transparent, var(--violet), var(--magenta), var(--orange), var(--yellow), transparent)",
                opacity: 0.55,
              }}
            />
            <ol className="relative">
              {milestones.map((milestone, i) => (
                <Milestone
                  key={milestone.id}
                  milestone={milestone}
                  index={i}
                  active={activeId === milestone.id}
                  onActivate={() => setActiveId(milestone.id)}
                />
              ))}
            </ol>
          </div>
        </Reveal>
      </SectionShell>
    </div>
  );
}
