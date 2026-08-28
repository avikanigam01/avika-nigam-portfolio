import { useState } from "react";
import { SectionShell, AmbientGlow } from "./SectionShell";
import { Reveal } from "./Reveal";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetail } from "./ProjectDetail";
import { projects, type Project } from "@/data/portfolioData";

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <div className="relative">
      <AmbientGlow className="top-40 -left-32 h-96 w-96 opacity-25" color="var(--orange)" />
      <SectionShell
        id="projects"
        eyebrow="Projects"
        title={
          <>
            Things I've built to <span className="text-spectrum">learn out loud.</span>
          </>
        }
        lead="Prototypes and works in progress, described as they actually are — problem first, then what I built and what it taught me."
      >
        <div className="flex flex-col gap-5">
          {projects.slice(0, 1).map((project) => (
            <Reveal key={project.id}>
              <ProjectCard project={project} featured onOpen={() => setActive(project)} />
            </Reveal>
          ))}
          <div className="grid gap-5 md:grid-cols-2">
            {projects.slice(1).map((project, i) => (
              <Reveal key={project.id} delay={i * 0.07}>
                <ProjectCard project={project} onOpen={() => setActive(project)} />
              </Reveal>
            ))}
          </div>
        </div>

      </SectionShell>

      <ProjectDetail project={active} onOpenChange={(open) => !open && setActive(null)} />
    </div>
  );
}
