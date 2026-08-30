import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type AssistantState = "idle" | "listening" | "thinking" | "speaking" | "error";

/**
 * Avika's AI Assistant — an original, lightweight animated vector character.
 * Pure SVG + CSS animation (no 3D engine, no video, no avatar service).
 * `state` is the single contract driving eyes, mouth, flame hair and glow.
 */
export function AssistantCharacter({
  state = "idle",
  className,
  accent,
}: {
  state?: AssistantState;
  className?: string;
  accent?: string;
}) {
  const reduced = useReducedMotion();
  const anim = (value: string) => (reduced ? undefined : value);

  const eyeScale = state === "listening" ? 1.18 : state === "error" ? 0.7 : 1;
  const glowAccent = accent ?? "var(--pink)";

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      role="img"
      aria-label={`Avika's AI assistant character, currently ${state}`}
    >
      {/* soft ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[6%] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 45%, color-mix(in oklab, ${glowAccent} 65%, transparent), transparent 70%)`,
          opacity: state === "speaking" ? 0.7 : 0.45,
          animation: anim("bot-glow 4.5s ease-in-out infinite"),
        }}
      />

      <svg
        viewBox="0 0 200 220"
        className="relative w-full max-w-[15rem]"
        style={{ animation: anim(`${state === "speaking" ? "bot-bounce 1.1s" : "bot-float 5.5s"} ease-in-out infinite`) }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ac-flame" x1="0" y1="1" x2="0.3" y2="0">
            <stop offset="0%" stopColor="var(--pink)" />
            <stop offset="45%" stopColor="var(--magenta)" />
            <stop offset="75%" stopColor="var(--orange)" />
            <stop offset="100%" stopColor="var(--yellow)" />
          </linearGradient>
          <linearGradient id="ac-body" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="oklch(0.32 0.09 320)" />
            <stop offset="55%" stopColor="oklch(0.2 0.05 305)" />
            <stop offset="100%" stopColor="oklch(0.14 0.03 300)" />
          </linearGradient>
          <linearGradient id="ac-visor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.16 0.04 310)" />
            <stop offset="100%" stopColor="oklch(0.1 0.02 300)" />
          </linearGradient>
          <radialGradient id="ac-cheek" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="var(--pink)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--pink)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* flame-like hair */}
        <g style={{ transformOrigin: "100px 66px" }}>
          {[
            { d: "M100 8 C112 32 120 44 112 62 C104 76 92 76 86 62 C78 44 90 30 100 8Z", delay: "0s", o: 0.98 },
            { d: "M76 26 C86 44 90 54 82 66 C74 76 64 72 62 60 C60 46 68 38 76 26Z", delay: "0.5s", o: 0.85 },
            { d: "M124 26 C132 40 140 46 138 60 C136 72 126 76 118 66 C110 54 114 44 124 26Z", delay: "1s", o: 0.85 },
          ].map((f, i) => (
            <path
              key={i}
              d={f.d}
              fill="url(#ac-flame)"
              opacity={f.o}
              style={{
                animation: anim(`flame-flicker ${2.4 + i * 0.4}s ease-in-out ${f.delay} infinite`),
                transformOrigin: "100px 70px",
                filter: "drop-shadow(0 0 10px color-mix(in oklab, var(--magenta) 55%, transparent))",
              }}
            />
          ))}
        </g>

        {/* head */}
        <rect x="42" y="58" width="116" height="98" rx="42" fill="url(#ac-body)" stroke="oklch(1 0 0 / 14%)" />
        {/* visor / face plate */}
        <rect x="55" y="72" width="90" height="68" rx="32" fill="url(#ac-visor)" stroke="oklch(1 0 0 / 10%)" />

        {/* ears */}
        <circle cx="40" cy="107" r="8" fill="var(--violet)" opacity="0.85" />
        <circle cx="160" cy="107" r="8" fill="var(--orange)" opacity="0.85" />

        {/* eyes */}
        <g style={{ animation: anim("bot-blink 6s ease-in-out infinite") }}>
          {[80, 120].map((cx) => (
            <g key={cx} transform={`translate(${cx} 104)`}>
              <ellipse
                rx={12 * eyeScale}
                ry={13 * eyeScale}
                fill={state === "error" ? "var(--yellow)" : "var(--pink)"}
                style={{ filter: "drop-shadow(0 0 8px color-mix(in oklab, var(--pink) 70%, transparent))" }}
              />
              <ellipse
                cx={-3}
                cy={-4}
                rx={4}
                ry={4.6}
                fill="oklch(1 0 0 / 88%)"
                style={{ animation: anim(state === "thinking" ? "eye-search 2.4s ease-in-out infinite" : undefined ?? "") }}
              />
            </g>
          ))}
        </g>

        {/* cheeks */}
        <circle cx="66" cy="124" r="9" fill="url(#ac-cheek)" />
        <circle cx="134" cy="124" r="9" fill="url(#ac-cheek)" />

        {/* mouth */}
        {state === "speaking" ? (
          <ellipse
            cx="100"
            cy="128"
            rx="7"
            ry="6"
            fill="var(--orange)"
            style={{ animation: anim("mouth-talk 0.42s ease-in-out infinite"), transformOrigin: "100px 128px" }}
          />
        ) : state === "error" ? (
          <path d="M92 132 Q100 126 108 132" stroke="var(--yellow)" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M92 127 Q100 134 108 127" stroke="var(--pink)" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}

        {/* body */}
        <rect x="66" y="152" width="68" height="46" rx="22" fill="url(#ac-body)" stroke="oklch(1 0 0 / 12%)" />
        <circle
          cx="100"
          cy="175"
          r="9"
          fill="var(--magenta)"
          opacity="0.9"
          style={{ animation: anim("bot-glow 3s ease-in-out infinite") }}
        />
        {/* arms */}
        <rect x="50" y="158" width="14" height="30" rx="7" fill="oklch(0.24 0.06 315)" style={{ animation: anim("arm-wave 4.5s ease-in-out infinite"), transformOrigin: "57px 162px" }} />
        <rect x="136" y="158" width="14" height="30" rx="7" fill="oklch(0.24 0.06 315)" style={{ animation: anim("arm-wave 4.5s ease-in-out 1.2s infinite"), transformOrigin: "143px 162px" }} />

        {/* thinking particles */}
        {state === "thinking"
          ? [0, 1, 2].map((i) => (
              <circle
                key={i}
                cx={152 + i * 12}
                cy={70 - i * 8}
                r={3 - i * 0.5}
                fill="var(--yellow)"
                style={{ animation: anim(`think-pop 1.4s ease-in-out ${i * 0.22}s infinite`) }}
              />
            ))
          : null}

        {/* listening ripple */}
        {state === "listening" ? (
          <circle
            cx="100"
            cy="110"
            r="70"
            fill="none"
            stroke="var(--violet)"
            strokeWidth="1.5"
            style={{ animation: anim("listen-ripple 2.2s ease-out infinite") }}
          />
        ) : null}

        {/* sparkles */}
        <g opacity="0.8">
          <circle cx="34" cy="60" r="2" fill="var(--yellow)" style={{ animation: anim("think-pop 3.6s ease-in-out infinite") }} />
          <circle cx="170" cy="140" r="2" fill="var(--pink)" style={{ animation: anim("think-pop 4.4s ease-in-out 1s infinite") }} />
        </g>
      </svg>
    </div>
  );
}
