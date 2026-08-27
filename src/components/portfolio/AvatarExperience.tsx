import { motion, useReducedMotion } from "motion/react";
import { Mic, MicOff, Sparkles, AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Visual states for the avatar surface.
 *
 * ARCHITECTURE NOTE (future integration — not implemented):
 * This component is intentionally presentation-only. A real-time avatar provider
 * (e.g. LiveAvatar / HeyGen) would later be mounted inside `<AvatarStage />` by
 * replacing the placeholder core with the provider's video/canvas element, while
 * `state` stays the single contract driving the surrounding visuals:
 *
 *   visitor speech -> speech-to-text -> LLM -> portfolio knowledge
 *                  -> response -> text-to-speech -> real-time avatar -> visitor
 *
 * No avatar API, no video, and no invented likeness are used today.
 */
export type AvatarState = "idle" | "listening" | "thinking" | "speaking" | "error";

const STATE_COPY: Record<AvatarState, { label: string; hint: string }> = {
  idle: { label: "Talk to me", hint: "Preview experience — voice is not live yet." },
  listening: { label: "Listening...", hint: "Capturing your question." },
  thinking: { label: "Thinking...", hint: "Working out a response." },
  speaking: { label: "Avika is speaking", hint: "Responding out loud." },
  error: { label: "Microphone blocked", hint: "Allow microphone access to try the preview." },
};

const STATE_ACCENT: Record<AvatarState, string> = {
  idle: "var(--pink)",
  listening: "var(--violet)",
  thinking: "var(--yellow)",
  speaking: "var(--orange)",
  error: "var(--destructive)",
};

export function AvatarExperience({
  state = "idle",
  size = "lg",
  className,
}: {
  state?: AvatarState;
  size?: "lg" | "sm";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const accent = STATE_ACCENT[state];
  const copy = STATE_COPY[state];
  const active = state === "listening" || state === "speaking";

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Ambient spectrum glow */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute rounded-full blur-[70px] sm:blur-[90px]",
          size === "lg" ? "inset-[-18%]" : "inset-[-14%]",
        )}
        style={{
          background:
            "conic-gradient(from 200deg, var(--pink), var(--magenta), var(--violet), var(--orange), var(--yellow), var(--pink))",
          opacity: 0.42,
          animation: reduced ? undefined : "drift-glow 16s ease-in-out infinite",
        }}
      />

      <div
        className={cn(
          "relative grid place-items-center rounded-full",
          size === "lg"
            ? "h-[clamp(15rem,60vw,23rem)] w-[clamp(15rem,60vw,23rem)]"
            : "h-52 w-52",
        )}
      >
        {/* Pulse rings while active */}
        {active && !reduced ? (
          <>
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: accent, animation: "pulse-ring 2.6s ease-out infinite" }}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: accent,
                animation: "pulse-ring 2.6s ease-out 1.3s infinite",
              }}
            />
          </>
        ) : null}

        {/* Rotating futuristic interface ring */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-dashed border-white/12"
          style={{ animation: reduced ? undefined : "ring-spin 44s linear infinite" }}
        >
          <span
            className="absolute top-1/2 left-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ transform: "translate(-50%, -50%) translateY(-50%)", background: accent }}
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-[7%] rounded-full border border-white/8"
          style={{
            animation: reduced ? undefined : "ring-spin 70s linear infinite reverse",
            maskImage: "linear-gradient(200deg, #000 30%, transparent 70%)",
          }}
        />

        {/* Avatar placeholder core — deliberately no generated face */}
        <div
          className="relative grid h-[82%] w-[82%] place-items-center overflow-hidden rounded-full border border-white/10"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 20%, oklch(0.26 0.05 320) 0%, oklch(0.15 0.02 300) 55%, oklch(0.12 0.01 300) 100%)",
            boxShadow: `inset 0 0 90px -20px ${accent}`,
          }}
          role="img"
          aria-label={`Placeholder for Avika's interactive AI avatar. Current state: ${copy.label}`}
        >
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <span
              className="grid h-12 w-12 place-items-center rounded-full border border-white/12 bg-white/5"
              aria-hidden="true"
            >
              {state === "error" ? (
                <MicOff className="h-5 w-5" style={{ color: accent }} />
              ) : state === "thinking" ? (
                <Sparkles className="h-5 w-5" style={{ color: accent }} />
              ) : state === "speaking" ? (
                <AudioLines className="h-5 w-5" style={{ color: accent }} />
              ) : (
                <Mic className="h-5 w-5" style={{ color: accent }} />
              )}
            </span>
            <span
              className="font-display text-4xl tracking-tight sm:text-5xl"
              style={{
                background: "var(--gradient-spectrum)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
              aria-hidden="true"
            >
              AN
            </span>
            <p className="font-display text-[0.62rem] tracking-[0.3em] text-muted-foreground uppercase">
              Avatar placeholder
            </p>
          </div>

          {/* State visual: waveform or processing dots */}
          <div className="absolute bottom-[14%] flex h-8 items-end justify-center gap-[3px]">
            {state === "thinking" ? (
              <ThinkingDots accent={accent} reduced={!!reduced} />
            ) : active ? (
              <Waveform accent={accent} reduced={!!reduced} bars={18} />
            ) : null}
          </div>
        </div>
      </div>

      {/* Live status readout */}
      <div className="mt-7 flex flex-col items-center gap-2 text-center" aria-live="polite">
        <span
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-display text-xs tracking-[0.18em] uppercase"
          style={{ borderColor: `color-mix(in oklab, ${accent} 45%, transparent)`, color: accent }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: accent }}
            aria-hidden="true"
          />
          {copy.label}
        </span>
        <p className="max-w-xs text-xs text-muted-foreground">{copy.hint}</p>
      </div>
    </div>
  );
}

export function Waveform({
  accent,
  reduced,
  bars = 14,
}: {
  accent: string;
  reduced: boolean;
  bars?: number;
}) {
  return (
    <>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full"
          style={{ background: accent }}
          initial={{ height: 6 }}
          animate={reduced ? { height: 10 } : { height: [6, 10 + ((i * 7) % 22), 6] }}
          transition={{
            duration: 0.9 + (i % 5) * 0.12,
            repeat: reduced ? 0 : Infinity,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
        />
      ))}
    </>
  );
}

function ThinkingDots({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="mb-1 h-2 w-2 rounded-full"
          style={{ background: accent }}
          animate={reduced ? { opacity: 0.7 } : { opacity: [0.25, 1, 0.25], y: [0, -5, 0] }}
          transition={{ duration: 1.1, repeat: reduced ? 0 : Infinity, delay: i * 0.16 }}
        />
      ))}
    </>
  );
}
