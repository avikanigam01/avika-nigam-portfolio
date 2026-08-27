import { Github, ExternalLink, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { COMING_SOON, type Project } from "@/data/portfolioData";

const ACCENT_VAR: Record<Project["accent"], string> = {
  pink: "var(--pink)",
  magenta: "var(--magenta)",
  violet: "var(--violet)",
  orange: "var(--orange)",
  yellow: "var(--yellow)",
};

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-display text-[0.65rem] tracking-[0.28em] text-muted-foreground uppercase">
        {label}
      </h4>
      <div className="mt-2 text-sm leading-relaxed text-foreground/85">{children}</div>
    </div>
  );
}

export function ProjectDetail({
  project,
  onOpenChange,
}: {
  project: Project | null;
  onOpenChange: (open: boolean) => void;
}) {
  const accent = project ? ACCENT_VAR[project.accent] : "var(--pink)";

  return (
    <Dialog open={!!project} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88svh] max-w-2xl overflow-y-auto border-white/10 bg-background/95 backdrop-blur-xl">
        {project ? (
          <>
            <DialogHeader className="text-left">
              <p
                className="font-display text-[0.65rem] tracking-[0.28em] uppercase"
                style={{ color: accent }}
              >
                {project.category}
              </p>
              <DialogTitle className="mt-2 font-display text-2xl leading-tight tracking-tight text-balance">
                {project.name}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Details for the project {project.name}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6">
              <Block label="Problem">{project.problem}</Block>
              <Block label="Solution">{project.solution}</Block>
              <Block label="Technology">
                <ul className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Block>
              <Block label="What I learned">{project.learned}</Block>
              <Block label="Status">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
                  style={{
                    borderColor: `color-mix(in oklab, ${accent} 45%, transparent)`,
                    color: accent,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: accent }}
                    aria-hidden="true"
                  />
                  {project.status}
                </span>
              </Block>

              <div className="flex flex-wrap gap-3 border-t border-white/8 pt-5">
                <LinkOrPlaceholder
                  url={project.githubUrl}
                  label="View GitHub"
                  icon={<Github className="h-4 w-4" aria-hidden="true" />}
                />
                <LinkOrPlaceholder
                  url={project.liveUrl}
                  label="Live demo"
                  icon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}
                />
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function LinkOrPlaceholder({
  url,
  label,
  icon,
}: {
  url: string | null;
  label: string;
  icon: React.ReactNode;
}) {
  if (!url) {
    return (
      <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 font-display text-xs tracking-[0.14em] text-muted-foreground uppercase">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        {label} — {COMING_SOON}
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 font-display text-xs tracking-[0.14em] uppercase transition-colors hover:border-white/40 hover:bg-white/5"
    >
      {icon}
      {label}
    </a>
  );
}
