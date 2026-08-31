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

  // Per-state eye expression
  const eyeScale = state === "listening" ? 1.16 : state === "error" ? 0.9 : 1;
  const eyeSquash = state === "error" ? 0.72 : state === "thinking" ? 0.94 : 1;
  const glowAccent = accent ?? "var(--pink)";
  const irisColor = state === "error" ? "var(--yellow)" : "var(--pink)";

  const pupilAnim =
    state === "thinking"
      ? anim("eye-search 2.4s ease-in-out infinite")
      : state === "idle" || state === "speaking"
        ? anim("eye-dart 7.5s ease-in-out infinite")
        : undefined;

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      role="img"
      aria-label={`Avika's AI assistant character, currently ${state}`}
    >
      {/* layered ambient glow: pink core, purple mid, warm halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[2%] rounded-full blur-2xl sm:blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 38%, color-mix(in oklab, ${glowAccent} 92%, transparent), transparent 68%)`,
          opacity: state === "speaking" ? 0.95 : 0.75,
          animation: anim("bot-glow 4.2s ease-in-out infinite"),
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-6%] rounded-full blur-2xl sm:blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, color-mix(in oklab, var(--violet) 70%, transparent), transparent 72%)",
          opacity: 0.6,
          animation: anim("halo-breathe 9s ease-in-out infinite"),
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[8%] bottom-[52%] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, color-mix(in oklab, var(--orange) 75%, transparent), color-mix(in oklab, var(--yellow) 30%, transparent) 45%, transparent 72%)",
          opacity: 0.7,
          animation: anim("halo-breathe 6.5s ease-in-out 1s infinite"),
        }}
      />

      <svg
        viewBox="0 0 200 220"
        className="relative w-full max-w-[19rem]"
        style={{ animation: anim(`${state === "speaking" ? "bot-bounce 1.1s" : "bot-float 5.5s"} ease-in-out infinite`) }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ac-flame" x1="0" y1="1" x2="0.3" y2="0">
            <stop offset="0%" stopColor="var(--pink)" />
            <stop offset="38%" stopColor="var(--magenta)" />
            <stop offset="70%" stopColor="var(--orange)" />
            <stop offset="100%" stopColor="var(--yellow)" />
          </linearGradient>
          <linearGradient id="ac-body" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="oklch(0.42 0.14 325)" />
            <stop offset="55%" stopColor="oklch(0.24 0.07 308)" />
            <stop offset="100%" stopColor="oklch(0.15 0.035 300)" />
          </linearGradient>
          <linearGradient id="ac-visor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.2 0.06 315)" />
            <stop offset="100%" stopColor="oklch(0.11 0.025 300)" />
          </linearGradient>
          <linearGradient id="ac-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--pink)" stopOpacity="0.95" />
            <stop offset="50%" stopColor="var(--magenta)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--violet)" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="ac-cheek" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="var(--pink)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--pink)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ac-iris" cx="0.42" cy="0.34" r="0.75">
            <stop offset="0%" stopColor="oklch(0.98 0.06 340)" />
            <stop offset="42%" stopColor={irisColor} />
            <stop offset="100%" stopColor="var(--magenta)" />
          </radialGradient>
          <radialGradient id="ac-core" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="oklch(0.99 0.05 330)" />
            <stop offset="45%" stopColor="var(--pink)" />
            <stop offset="100%" stopColor="var(--magenta)" stopOpacity="0.15" />
          </radialGradient>
        </defs>

        {/* flame-like hair — signature feature */}
        <g style={{ transformOrigin: "100px 66px" }}>
          {[
            { d: "M100 4 C116 26 124 42 114 60 C107 74 91 78 84 62 C75 42 88 28 100 4Z", delay: "0s", o: 1 },
            { d: "M72 20 C86 38 92 52 84 66 C75 78 61 74 59 60 C57 43 64 34 72 20Z", delay: "0.45s", o: 0.92 },
            { d: "M128 20 C138 36 145 46 142 61 C139 74 126 79 118 67 C109 54 116 40 128 20Z", delay: "0.95s", o: 0.92 },
          ].map((f, i) => (
            <path
              key={i}
              d={f.d}
              fill="url(#ac-flame)"
              opacity={f.o}
              style={{
                animation: anim(`flame-flicker ${2.2 + i * 0.35}s ease-in-out ${f.delay} infinite`),
                transformOrigin: "100px 72px",
                filter:
                  "drop-shadow(0 0 8px color-mix(in oklab, var(--yellow) 70%, transparent)) drop-shadow(0 0 20px color-mix(in oklab, var(--magenta) 85%, transparent))",
              }}
            />
          ))}
        </g>

        {/* head — rounder & friendlier */}
        <rect
          x="38"
          y="56"
          width="124"
          height="102"
          rx="50"
          fill="url(#ac-body)"
          stroke="url(#ac-edge)"
          strokeWidth="1.6"
          style={{ filter: "drop-shadow(0 0 18px color-mix(in oklab, var(--magenta) 55%, transparent))" }}
        />
        {/* visor / face plate */}
        <rect x="52" y="70" width="96" height="72" rx="36" fill="url(#ac-visor)" stroke="oklch(1 0 0 / 14%)" />

        {/* ears */}
        <circle cx="36" cy="107" r="9" fill="var(--violet)" style={{ filter: "drop-shadow(0 0 8px var(--violet))" }} />
        <circle cx="164" cy="107" r="9" fill="var(--orange)" style={{ filter: "drop-shadow(0 0 8px var(--orange))" }} />

        {/* eyes */}
        <g style={{ animation: anim("bot-blink 5s ease-in-out infinite"), transformOrigin: "100px 105px" }}>
          {[78, 122].map((cx) => (
            <g key={cx} transform={`translate(${cx} 105)`}>
              {/* outer glow ring */}
              <ellipse
                rx={16 * eyeScale}
                ry={17 * eyeScale * eyeSquash}
                fill="none"
                stroke="var(--magenta)"
                strokeOpacity="0.45"
                strokeWidth="2"
                style={{ filter: "drop-shadow(0 0 10px var(--magenta))" }}
              />
              <ellipse
                rx={13.5 * eyeScale}
                ry={14.5 * eyeScale * eyeSquash}
                fill="url(#ac-iris)"
                style={{ filter: "drop-shadow(0 0 12px color-mix(in oklab, var(--pink) 90%, transparent))" }}
              />
              {/* pupil + highlights */}
              <g style={{ animation: pupilAnim }}>
                <ellipse cx={-2} cy={-3} rx={5} ry={5.6} fill="oklch(1 0 0 / 95%)" />
                <circle cx={4} cy={4} r={2.1} fill="oklch(1 0 0 / 70%)" />
              </g>
              {/* upper lid for concerned / thoughtful expressions */}
              {state === "error" || state === "thinking" ? (
                <path
                  d={`M${-16 * eyeScale} ${-11 * eyeScale} Q0 ${state === "error" ? -19 : -17} ${16 * eyeScale} ${-11 * eyeScale}`}
                  stroke="var(--pink)"
                  strokeOpacity="0.8"
                  strokeWidth="2.4"
                  fill="none"
                  strokeLinecap="round"
                />
              ) : null}
            </g>
          ))}
        </g>

        {/* cheeks */}
        <circle cx="62" cy="128" r="11" fill="url(#ac-cheek)" />
        <circle cx="138" cy="128" r="11" fill="url(#ac-cheek)" />

        {/* mouth */}
        {state === "speaking" ? (
          <ellipse
            cx="100"
            cy="130"
            rx="8"
            ry="6.5"
            fill="var(--orange)"
            style={{
              animation: anim("mouth-talk 0.42s ease-in-out infinite"),
              transformOrigin: "100px 130px",
              filter: "drop-shadow(0 0 8px var(--orange))",
            }}
          />
        ) : state === "error" ? (
          <path d="M92 133 Q100 127 108 133" stroke="var(--yellow)" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : state === "listening" ? (
          <ellipse cx="100" cy="130" rx="6" ry="7" fill="none" stroke="var(--pink)" strokeWidth="2.6" />
        ) : state === "thinking" ? (
          <path d="M93 130 L107 130" stroke="var(--pink)" strokeWidth="3" strokeLinecap="round" />
        ) : (
          <path
            d="M90 127 Q100 137 110 127"
            stroke="var(--pink)"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px var(--pink))" }}
          />
        )}

        {/* body */}
        <rect
          x="64"
          y="154"
          width="72"
          height="48"
          rx="24"
          fill="url(#ac-body)"
          stroke="url(#ac-edge)"
          strokeWidth="1.4"
        />
        {/* chest core — tiny AI energy source */}
        <g style={{ transformOrigin: "100px 177px", animation: anim("core-pulse 2.6s ease-in-out infinite") }}>
          <circle cx="100" cy="177" r="14" fill="url(#ac-core)" opacity="0.55" />
          <circle
            cx="100"
            cy="177"
            r="8"
            fill="url(#ac-core)"
            style={{ filter: "drop-shadow(0 0 14px color-mix(in oklab, var(--pink) 95%, transparent))" }}
          />
        </g>
        {/* arms */}
        <rect x="48" y="160" width="14" height="30" rx="7" fill="oklch(0.3 0.09 318)" stroke="url(#ac-edge)" strokeWidth="0.8" style={{ animation: anim("arm-wave 4.5s ease-in-out infinite"), transformOrigin: "55px 164px" }} />
        <rect x="138" y="160" width="14" height="30" rx="7" fill="oklch(0.3 0.09 318)" stroke="url(#ac-edge)" strokeWidth="0.8" style={{ animation: anim("arm-wave 4.5s ease-in-out 1.2s infinite"), transformOrigin: "145px 164px" }} />

        {/* thinking particles */}
        {state === "thinking"
          ? [0, 1, 2].map((i) => (
              <circle
                key={i}
                cx={154 + i * 12}
                cy={68 - i * 8}
                r={3.4 - i * 0.6}
                fill="var(--yellow)"
                style={{
                  animation: anim(`think-pop 1.4s ease-in-out ${i * 0.22}s infinite`),
                  filter: "drop-shadow(0 0 8px var(--yellow))",
                }}
              />
            ))
          : null}

        {/* listening ripple */}
        {state === "listening" ? (
          <>
            <circle
              cx="100"
              cy="110"
              r="72"
              fill="none"
              stroke="var(--violet)"
              strokeWidth="1.4"
              style={{ animation: anim("listen-ripple 2.2s ease-out infinite") }}
            />
            <circle
              cx="100"
              cy="110"
              r="72"
              fill="none"
              stroke="var(--pink)"
              strokeWidth="1.2"
              style={{ animation: anim("listen-ripple 2.2s ease-out 1.1s infinite") }}
            />
          </>
        ) : null}

        {/* sparkles — sparse, slow drift */}
        <g>
          <circle cx="30" cy="58" r="2.4" fill="var(--yellow)" style={{ animation: anim("sparkle-drift 5.2s ease-in-out infinite"), filter: "drop-shadow(0 0 7px var(--yellow))" }} />
          <circle cx="172" cy="142" r="2.2" fill="var(--pink)" style={{ animation: anim("sparkle-drift 6.4s ease-in-out 1.3s infinite"), filter: "drop-shadow(0 0 7px var(--pink))" }} />
          <circle cx="150" cy="34" r="1.8" fill="var(--orange)" style={{ animation: anim("sparkle-drift 7.1s ease-in-out 2.4s infinite"), filter: "drop-shadow(0 0 6px var(--orange))" }} />
        </g>
      </svg>
    </div>
  );
}
