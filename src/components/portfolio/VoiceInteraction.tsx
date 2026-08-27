import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square, RotateCcw, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AvatarExperience, type AvatarState } from "./AvatarExperience";
import { profile } from "@/data/portfolioData";

/**
 * Front-end only simulation of the voice experience.
 *
 * FUTURE INTEGRATION (architecture only — nothing below calls an AI service):
 *   visitor speech -> speech-to-text -> LLM -> portfolio knowledge
 *                  -> response -> text-to-speech -> real-time avatar -> visitor
 * Any future API keys stay server-side (Supabase Edge Function / env vars),
 * never in this component.
 */
export function VoiceInteraction({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, setState] = useState<AvatarState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    stopStream();
    setState("idle");
    setErrorMessage(null);
  }, [clearTimers, stopStream]);

  useEffect(() => {
    if (!open) reset();
    return () => {
      clearTimers();
      stopStream();
    };
  }, [open, reset, clearTimers, stopStream]);

  const runPreview = useCallback(async () => {
    clearTimers();
    setErrorMessage(null);

    // Mic permission is requested only so the preview states feel truthful.
    // Nothing is recorded, stored, or sent anywhere.
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("unsupported");
      }
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      setState("error");
      setErrorMessage(
        error instanceof Error && error.message === "unsupported"
          ? "This browser doesn't support microphone access. You can still explore the portfolio below."
          : "Microphone access was blocked. Enable it in your browser settings, or just keep scrolling — everything else works without it.",
      );
      return;
    }

    setState("listening");
    timers.current.push(
      setTimeout(() => setState("thinking"), 2600),
      setTimeout(() => setState("speaking"), 4200),
      setTimeout(() => {
        stopStream();
        setState("idle");
      }, 8200),
    );
  }, [clearTimers, stopStream]);

  const stop = useCallback(() => {
    clearTimers();
    stopStream();
    setState("idle");
  }, [clearTimers, stopStream]);

  const busy = state === "listening" || state === "thinking" || state === "speaking";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden border-white/10 bg-background/95 backdrop-blur-xl sm:max-w-xl">

        <DialogHeader className="text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow/40 px-2.5 py-1 font-display text-[0.62rem] tracking-[0.2em] text-yellow uppercase">
              <Info className="h-3 w-3" aria-hidden="true" />
              Preview mode
            </span>
          </div>
          <DialogTitle className="mt-3 font-display text-2xl tracking-tight">
            Talk to {profile.shortName}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Real-time voice conversation with an AI representation of Avika is planned, not live
            yet. This is a visual preview of how it will feel.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-2">
          <AvatarExperience state={state} size="sm" />
        </div>

        {state === "error" && errorMessage ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3 pt-1">
          {busy ? (
            <Button onClick={stop} variant="secondary" className="rounded-full">
              <Square className="h-4 w-4" aria-hidden="true" />
              Stop preview
            </Button>
          ) : (
            <Button onClick={runPreview} className="rounded-full">
              {state === "error" ? (
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Mic className="h-4 w-4" aria-hidden="true" />
              )}
              {state === "error" ? "Try again" : "Run voice preview"}
            </Button>
          )}
          <Button
            variant="ghost"
            className="rounded-full text-muted-foreground"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Nothing is recorded or sent anywhere. {profile.avatarHelper}
        </p>
      </DialogContent>
    </Dialog>
  );
}
