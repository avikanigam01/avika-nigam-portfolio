import { AssistantCharacter } from "./AssistantCharacter";
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
      {/* Vivid gradient aura — concentrated colourful light behind the presence */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute rounded-full blur-[52px] sm:blur-[80px]",
          size === "lg" ? "inset-[-8%]" : "inset-[-10%]",
        )}
        style={{
          background:
            "conic-gradient(from 200deg, var(--pink), var(--magenta), var(--violet), var(--orange), var(--yellow), var(--pink))",
          opacity: active ? 0.9 : 0.72,
          animation: reduced ? undefined : "aura-breathe 14s ease-in-out infinite",
        }}
      />
      {/* Inner concentrated light layer */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute rounded-full blur-[30px]",
          size === "lg" ? "inset-[4%]" : "inset-[6%]",
        )}
        style={{
          background: `radial-gradient(circle at 42% 32%, color-mix(in oklab, ${accent} 88%, transparent) 0%, transparent 66%)`,
          opacity: 0.72,
        }}
      />

      <div
        className={cn(
          "relative grid place-items-center rounded-full",
          size === "lg"
            ? "h-[clamp(15rem,62vw,24rem)] w-[clamp(15rem,62vw,24rem)]"
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

        {/* Thin orbital rings with travelling light points */}
        <div
          aria-hidden="true"
          className="absolute inset-[-6%] rounded-full border border-white/5"
          style={{ animation: reduced ? undefined : "ring-spin 60s linear infinite" }}
        >
          <span
            className="absolute top-0 left-1/2 block h-1 w-1 -translate-x-1/2 rounded-full"
            style={{ background: "var(--yellow)", boxShadow: "0 0 10px var(--yellow)" }}
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-dashed border-white/8"
          style={{ animation: reduced ? undefined : "ring-spin 44s linear infinite" }}
        >
          <span
            className="absolute top-0 left-1/2 block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-[7%] rounded-full border border-white/5"
          style={{
            animation: reduced ? undefined : "ring-spin 70s linear infinite reverse",
            maskImage: "linear-gradient(200deg, #000 30%, transparent 70%)",
          }}
        />


        {/* Avatar placeholder core — deliberately no generated face */}
        <div
          className="grain relative grid h-[80%] w-[80%] place-items-center overflow-hidden rounded-full border border-white/12"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 18%, oklch(0.22 0.06 322) 0%, oklch(0.11 0.015 300) 58%, oklch(0.075 0.006 300) 100%)",
            boxShadow: `inset 0 0 110px -18px ${accent}, 0 30px 80px -40px ${accent}`,
          }}
          role="img"
          aria-label={`Placeholder for Avika's interactive AI avatar. Current state: ${copy.label}`}
        >
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <AssistantCharacter
              state={state === "error" ? "error" : state}
              accent={accent}
              className="w-[74%]"
            />
            <p className="font-display text-[0.58rem] tracking-[0.34em] text-muted-foreground/80 uppercase">
              Digital presence
            </p>
          </div>


          {/* State visual: waveform or processing dots */}
          <div className="absolute bottom-[13%] flex h-8 items-end justify-center gap-[3px]">
            {state === "thinking" ? (
              <ThinkingDots accent={accent} reduced={!!reduced} />
            ) : active ? (
              <Waveform accent={accent} reduced={!!reduced} bars={18} />
            ) : null}
          </div>
        </div>

        {/* Editorial orbit labels */}
        {size === "lg" ? (
          <>
            <span
              aria-hidden="true"
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-display text-[0.55rem] tracking-[0.42em] text-white/40 uppercase"
            >
              AI • Voice • Interactive
            </span>
          </>
        ) : null}
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
