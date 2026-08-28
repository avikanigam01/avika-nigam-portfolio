import { cn } from "@/lib/utils";
import type { Milestone as MilestoneData } from "@/data/portfolioData";

/** Path colours progress pink -> magenta -> violet -> orange -> yellow along the journey. */
const PATH_SPECTRUM = [
  "var(--pink)",
  "var(--magenta)",
  "var(--violet)",
  "var(--orange)",
  "var(--yellow)",
];

export function Milestone({
  milestone,
  index,
  total,
  active,
  onActivate,
}: {
  milestone: MilestoneData;
  index: number;
  total?: number;
  active: boolean;
  onActivate: () => void;
}) {
  const steps = Math.max((total ?? PATH_SPECTRUM.length) - 1, 1);
  const position = Math.round((index / steps) * (PATH_SPECTRUM.length - 1));
  const accent = PATH_SPECTRUM[Math.min(position, PATH_SPECTRUM.length - 1)]!;
  const highlighted = milestone.state === "current" || !!milestone.tag;


  return (
    <li className="relative pl-12 sm:pl-16">
      {/* Node on the spine */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1.5 left-[0.6rem] grid h-5 w-5 place-items-center rounded-full border transition-all duration-400 sm:left-[1.1rem]",
          active ? "scale-110" : "scale-100",
        )}
        style={{
          borderColor: accent,
          background: active ? accent : "var(--background)",
          boxShadow: active ? `0 0 22px ${accent}` : "none",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: active ? "var(--background)" : accent }}
        />
      </span>

      <button
        type="button"
        onClick={onActivate}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        aria-expanded={active}
        aria-controls={`milestone-detail-${milestone.id}`}
        className="w-full pt-0.5 pb-6 text-left"
      >
        <span className="flex flex-wrap items-center gap-2.5">
          <span
            className={cn(
              "font-display text-base font-semibold tracking-tight transition-colors sm:text-lg",
              active ? "text-foreground" : "text-foreground/70",
            )}
          >
            {milestone.title}
          </span>
          {milestone.tag ? (
            <span
              className="rounded-full border px-2.5 py-0.5 font-display text-[0.6rem] tracking-[0.16em] uppercase"
              style={{
                borderColor: `color-mix(in oklab, ${accent} 45%, transparent)`,
                color: accent,
              }}
            >
              {milestone.tag}
            </span>
          ) : null}
          <span className="ml-auto font-display text-[0.6rem] tracking-[0.2em] text-muted-foreground/60">
            {String(index + 1).padStart(2, "0")}
          </span>
        </span>

        <span
          id={`milestone-detail-${milestone.id}`}
          className={cn(
            "grid overflow-hidden transition-all duration-500 ease-out",
            active ? "mt-2.5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <span className="block max-w-xl overflow-hidden text-sm leading-relaxed text-muted-foreground">
            {milestone.detail}
          </span>
        </span>
      </button>
    </li>
  );
}
