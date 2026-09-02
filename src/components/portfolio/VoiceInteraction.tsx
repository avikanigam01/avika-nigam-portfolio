import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, Send, Mic, MicOff, Square, Volume2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssistantCharacter, type AssistantState } from "./AssistantCharacter";
import { profile } from "@/data/portfolioData";
import { ASSISTANT_GREETING, ASSISTANT_SUGGESTIONS } from "@/lib/assistantKnowledge";
import { askAssistant, type AssistantTurn } from "@/lib/askAssistant";
import {
  RECOGNITION_MESSAGES,
  cancelSpeech,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speak,
  startRecognition,
  warmUpVoices,
} from "@/lib/speech";

type Turn = { id: number; role: "you" | "assistant"; text: string };

const STATE_LABEL: Record<AssistantState, string> = {
  idle: "Ready",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
  error: "Something went wrong",
};

/**
 * Avika's AI Assistant — Stage 3: character + all states + real AI answers
 * + live browser voice.
 *
 * Typed or spoken questions are sent to the existing `ask-assistant` Supabase
 * Edge Function, which calls Gemini with Avika's portfolio content as grounding
 * (see src/lib/askAssistant.ts). Voice input uses the browser's native
 * SpeechRecognition API and replies are spoken with window.speechSynthesis
 * (see src/lib/speech.ts) — no external voice service and no API key on the
 * client. Text chat stays fully functional when voice is unsupported.
 */
export function VoiceInteraction({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, setState] = useState<AssistantState>("idle");
  const [turns, setTurns] = useState<Turn[]>([
    { id: 0, role: "assistant", text: ASSISTANT_GREETING },
  ]);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [ttsSupported, setTtsSupported] = useState(true);
  const lastQuestion = useRef<string>("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scroller = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(1);
  const recognizer = useRef<{ stop: () => void } | null>(null);
  const speaker = useRef<{ cancel: () => void } | null>(null);
  const turnsRef = useRef(turns);
  turnsRef.current = turns;

  useEffect(() => {
    setVoiceSupported(isSpeechRecognitionSupported());
    setTtsSupported(isSpeechSynthesisSupported());
    warmUpVoices();
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const stopEverything = useCallback(() => {
    clearTimers();
    recognizer.current?.stop();
    recognizer.current = null;
    speaker.current?.cancel();
    speaker.current = null;
    cancelSpeech();
  }, [clearTimers]);

  useEffect(() => () => stopEverything(), [stopEverything]);

  useEffect(() => {
    if (!open) {
      stopEverything();
      setState("idle");
      setNotice(null);
    }
  }, [open, stopEverything]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [turns, state]);

  const ask = useCallback(
    (question: string) => {
      const q = question.trim().slice(0, 400);
      if (!q) return;
      clearTimers();
      setNotice(null);
      lastQuestion.current = q;
      setDraft("");

      // Snapshot turn history (for context) before adding the new question.
      const history: AssistantTurn[] = turnsRef.current.map((t) => ({
        role: t.role,
        text: t.text,
      }));
      setTurns((prev) => [...prev, { id: nextId.current++, role: "you", text: q }]);
      setState("thinking");

      askAssistant(q, history)
        .then(({ answer, isFallback }) => {
          setTurns((prev) => [...prev, { id: nextId.current++, role: "assistant", text: answer }]);
          if (isFallback) {
            setNotice(
              "The live AI is briefly unavailable, so that answer came from the portfolio's built-in knowledge instead.",
            );
          }

          // Speak the answer aloud; the answer stays visible either way.
          setState("speaking");
          speaker.current = speak(answer, {
            onEnd: () => {
              speaker.current = null;
              setState("idle");
            },
            onError: () => {
              // Synthesis unavailable/failed — the text answer is already shown.
              setTtsSupported(isSpeechSynthesisSupported());
            },
          });
        })
        .catch(() => {
          setState("error");
          setNotice("Something went wrong reaching the assistant. Please try again.");
          timers.current.push(setTimeout(() => setState("idle"), 2000));
        });
    },
    [clearTimers],
  );

  const startVoice = useCallback(() => {
    // Clicking the mic while the assistant is speaking stops the speech and
    // resets to idle — a fresh session then needs another click.
    if (state === "speaking") {
      stopEverything();
      setState("idle");
      return;
    }
    if (state === "thinking") return;

    if (state === "listening") {
      stopEverything();
      setState("idle");
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setVoiceSupported(false);
      setNotice(RECOGNITION_MESSAGES.unsupported);
      return;
    }

    stopEverything();
    setNotice(null);

    recognizer.current = startRecognition({
      onStart: () => setState("listening"),
      onResult: (transcript) => {
        recognizer.current = null;
        ask(transcript);
      },
      onError: (kind) => {
        recognizer.current = null;
        if (kind === "unsupported") setVoiceSupported(false);
        setState("error");
        setNotice(RECOGNITION_MESSAGES[kind]);
        clearTimers();
        timers.current.push(setTimeout(() => setState("idle"), 1800));
      },
    });

    if (!recognizer.current) {
      setState("error");
      setNotice(RECOGNITION_MESSAGES.unknown);
      timers.current.push(setTimeout(() => setState("idle"), 1800));
      return;
    }
    setState("listening");
  }, [ask, clearTimers, state, stopEverything]);

  const stopSpeaking = useCallback(() => {
    stopEverything();
    setState("idle");
  }, [stopEverything]);

  const busy = state === "thinking" || state === "speaking";
  const micLabel =
    state === "listening"
      ? "Stop listening"
      : state === "speaking"
        ? "Stop speaking"
        : "Speak to Avika's assistant";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden border-white/10 bg-background/95 backdrop-blur-xl sm:max-w-2xl">
        <DialogHeader className="text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-pink/40 px-2.5 py-1 font-display text-[0.62rem] tracking-[0.2em] text-pink uppercase">
              <Volume2 className="h-3 w-3" aria-hidden="true" />
              Voice live
            </span>
            <span className="font-display text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase">
              {STATE_LABEL[state]}
            </span>
          </div>
          <DialogTitle className="mt-3 font-display text-2xl tracking-tight">
            {profile.shortName}&apos;s AI Assistant
          </DialogTitle>
          <DialogDescription className="text-sm">
            Tap the mic and ask me anything about Avika — or type instead. Answers come only from
            this portfolio&apos;s own content, and are spoken back to you.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-[9.5rem_1fr] sm:items-start">
          <AssistantCharacter state={state} className="mx-auto w-32 sm:w-full" />

          <div className="flex min-w-0 flex-col gap-3">
            <div
              ref={scroller}
              className="max-h-56 min-h-32 space-y-3 overflow-y-auto pr-1 text-sm"
              aria-live="polite"
            >
              {turns.map((t) => (
                <p key={t.id} className="leading-relaxed">
                  <span
                    className={
                      t.role === "you"
                        ? "font-display text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase"
                        : "font-display text-[0.62rem] tracking-[0.2em] text-pink uppercase"
                    }
                  >
                    {t.role === "you" ? "You" : "Avika's Assistant"}
                  </span>
                  <br />
                  <span className={t.role === "you" ? "text-muted-foreground" : "text-foreground"}>
                    {t.text}
                  </span>
                </p>
              ))}
              {state === "listening" ? (
                <p className="font-display text-[0.62rem] tracking-[0.2em] text-violet uppercase">
                  Listening...
                </p>
              ) : null}
              {state === "thinking" ? (
                <p className="font-display text-[0.62rem] tracking-[0.2em] text-yellow uppercase">
                  Thinking...
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {ASSISTANT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  disabled={busy}
                  className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-pink/50 hover:text-foreground disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(draft);
              }}
              className="flex items-center gap-2"
            >
              <label htmlFor="assistant-question" className="sr-only">
                Type your question for Avika&apos;s assistant
              </label>
              <Input
                id="assistant-question"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your question..."
                maxLength={400}
                className="rounded-full border-white/12 bg-white/[0.03]"
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0 rounded-full"
                disabled={busy || !draft.trim()}
                aria-label="Ask Avika's assistant"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
                onClick={startVoice}
                disabled={state === "thinking"}
                aria-label={micLabel}
                aria-pressed={state === "listening"}
              >
                {voiceSupported ? (
                  <Mic className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <MicOff className="h-4 w-4" aria-hidden="true" />
                )}
                {state === "listening" ? "Listening" : "Talk"}
              </Button>

              {state === "speaking" ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full text-muted-foreground"
                  onClick={stopSpeaking}
                  aria-label="Stop speaking"
                >
                  <Square className="h-4 w-4" aria-hidden="true" />
                  Stop
                </Button>
              ) : null}

              {lastQuestion.current ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full text-muted-foreground"
                  onClick={() => ask(lastQuestion.current)}
                  disabled={busy || state === "listening"}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Retry
                </Button>
              ) : null}
            </div>

            {notice ? (
              <p role="status" className="text-xs text-muted-foreground">
                {notice}
              </p>
            ) : null}
            {!voiceSupported ? (
              <p className="text-xs text-muted-foreground">
                Voice input isn&apos;t supported in this browser. You can still type your question.
              </p>
            ) : null}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {ttsSupported
            ? "Live browser voice — speak or type."
            : "Spoken replies aren't supported in this browser; answers appear as text."}{" "}
          {profile.avatarHelper}
        </p>
      </DialogContent>
    </Dialog>
  );
}
