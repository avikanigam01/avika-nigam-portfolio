import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type SectionShellProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  lead,
  children,
  className,
}: SectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-28", className)}
    >
      <Reveal>
        <p className="font-display text-[0.7rem] tracking-[0.35em] text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h2
          id={`${id}-heading`}
          className="mt-4 text-3xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl"
        >
          {title}
        </h2>
        {lead ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{lead}</p>
        ) : null}
      </Reveal>
      <div className="mt-12 sm:mt-14">{children}</div>
    </section>
  );
}

/** Soft ambient light blob used behind sections. Decorative only. */
export function AmbientGlow({
  className,
  color = "var(--magenta)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute -z-10 rounded-full blur-[110px]", className)}
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        animation: "drift-glow 18s ease-in-out infinite",
      }}
    />
  );
}
