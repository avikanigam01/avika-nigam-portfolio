import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/portfolioData";

const ACCENT_VAR: Record<Project["accent"], string> = {
  pink: "var(--pink)",
  magenta: "var(--magenta)",
  violet: "var(--violet)",
  orange: "var(--orange)",
  yellow: "var(--yellow)",
};

export function ProjectCard({
  project,
  onOpen,
  featured = false,
}: {
  project: Project;
  onOpen: () => void;
  featured?: boolean;
}) {
  const accent = ACCENT_VAR[project.accent];

  return (
    <article
      className={cn(
        "group hairline-card relative h-full overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1.5",
        featured && "lg:grid lg:grid-cols-[1.05fr_0.95fr]",
      )}
      style={{ ["--proj-accent" as string]: accent }}
    >
      {/* project-specific lighting */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute rounded-full opacity-20 blur-[80px] transition-opacity duration-500 group-hover:opacity-55",
          featured ? "-top-32 -left-24 h-80 w-80" : "-top-24 -right-20 h-56 w-56",
        )}
        style={{ background: accent }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px opacity-80"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className={cn("flex h-full flex-col p-6 sm:p-7", featured && "lg:p-10")}>
        <div className="flex items-start justify-between gap-4">
          <p
            className="font-display text-[0.62rem] tracking-[0.26em] uppercase"
            style={{ color: accent }}
          >
            {project.category}
          </p>
          <span className="rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[0.65rem] text-muted-foreground">
            {project.status}
          </span>
        </div>

        <h3
          className={cn(
            "mt-5 font-display leading-tight font-semibold tracking-tight text-balance",
            featured
              ? "text-2xl sm:text-3xl lg:text-[2.4rem]"
              : "text-xl sm:text-2xl",
          )}
        >
          {project.name}
        </h3>

        {featured ? (
          <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/75">
            {project.problem}
          </p>
        ) : null}

        <dl className={cn("mt-5 flex flex-col gap-4", featured && "lg:hidden")}>
          {!featured ? (
            <div>
              <dt className="font-display text-[0.6rem] tracking-[0.26em] text-muted-foreground uppercase">
                Problem
              </dt>
              <dd className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-foreground/80">
                {project.problem}
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="font-display text-[0.6rem] tracking-[0.26em] text-muted-foreground uppercase">
              Solution
            </dt>
            <dd className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-foreground/80">
              {project.solution}
            </dd>
          </div>
        </dl>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[0.7rem] text-muted-foreground"
            >
              {t}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onOpen}
          className="mt-7 inline-flex items-center gap-2 self-start rounded-full border px-5 py-2.5 font-display text-xs tracking-[0.16em] uppercase transition-all hover:bg-white/5 lg:mt-auto"
          style={{ borderColor: `color-mix(in oklab, ${accent} 45%, transparent)`, color: accent }}
          aria-label={`Open details for ${project.name}`}
        >
          View details
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Featured side panel: solution set in editorial type */}
      {featured ? (
        <div
          className="relative hidden flex-col justify-center gap-5 border-l border-white/8 p-10 lg:flex"
          style={{
            background: `linear-gradient(150deg, color-mix(in oklab, ${accent} 8%, transparent), transparent 70%)`,
          }}
        >
          <p className="font-display text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
            Solution
          </p>
          <p className="text-base leading-relaxed text-foreground/85">{project.solution}</p>
          <p className="font-display text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
            What I learned
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">{project.learned}</p>
        </div>
      ) : null}
    </article>
  );
}
