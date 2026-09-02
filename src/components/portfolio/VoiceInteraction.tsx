import { useCallback, useEffect, useRef, useState } from "react";
import { Info, RotateCcw, Send, Mic } from "lucide-react";
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

type Turn = { id: number; role: "you" | "assistant"; text: string };

const STATE_LABEL: Record<AssistantState, string> = {
  idle: "Ready",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
  error: "Something went wrong",
};

/**
 * Avika's AI Assistant — Stage 2: character + all states + real AI answers.
 * Typed questions are sent to the `ask-assistant` Supabase Edge Function,
 * which calls Gemini with Avika's portfolio content as grounding (see
 * src/lib/askAssistant.ts). If that call fails, answers fall back to the
 * local Stage 1 matcher so the assistant never goes silent.
 * Voice input (SpeechRecognition) and spoken replies (SpeechSynthesis)
 * arrive in Stage 3 and Stage 4; this component is the stable UI contract
 * for both — the mic button below is still a preview-mode placeholder.
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
  const lastQuestion = useRef<string>("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scroller = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(1);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (!open) {
      clearTimers();
      setState("idle");
      setNotice(null);
    }
  }, [open, clearTimers]);

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
      const history: AssistantTurn[] = turns.map((t) => ({ role: t.role, text: t.text }));
      setTurns((prev) => [...prev, { id: nextId.current++, role: "you", text: q }]);
      setState("thinking");

      askAssistant(q, history)
        .then(({ answer, isFallback }) => {
          setTurns((prev) => [...prev, { id: nextId.current++, role: "assistant", text: answer }]);
          setState("speaking");
          if (isFallback) {
            setNotice(
              "The live AI is briefly unavailable, so that answer came from the portfolio's built-in knowledge instead.",
            );
          }
          timers.current.push(setTimeout(() => setState("idle"), 1600));
        })
        .catch(() => {
          setState("error");
          setNotice("Something went wrong reaching the assistant. Please try again.");
          timers.current.push(setTimeout(() => setState("idle"), 2000));
        });
    },
    [clearTimers, turns],
  );

  const startVoice = useCallback(() => {
    setState("listening");
    setNotice(
      "Live voice input is coming in the next stage of this assistant. You can type your question below — it works fully.",
    );
    clearTimers();
    timers.current.push(setTimeout(() => setState("idle"), 2400));
  }, [clearTimers]);

  const busy = state === "thinking" || state === "speaking";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden border-white/10 bg-background/95 backdrop-blur-xl sm:max-w-2xl">
        <DialogHeader className="text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow/40 px-2.5 py-1 font-display text-[0.62rem] tracking-[0.2em] text-yellow uppercase">
              <Info className="h-3 w-3" aria-hidden="true" />
              Preview mode
            </span>
            <span className="font-display text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase">
              {STATE_LABEL[state]}
            </span>
          </div>
          <DialogTitle className="mt-3 font-display text-2xl tracking-tight">
            {profile.shortName}&apos;s AI Assistant
          </DialogTitle>
          <DialogDescription className="text-sm">
            Ask about Avika&apos;s projects, skills, journey or goals. Answers come only from this
            portfolio&apos;s own content — spoken voice is not live yet.
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
                aria-label="Start voice conversation"
              >
                <Mic className="h-4 w-4" aria-hidden="true" />
                Talk
              </Button>
              {lastQuestion.current ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full text-muted-foreground"
                  onClick={() => ask(lastQuestion.current)}
                  disabled={busy}
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
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Preview experience — voice is not live yet. {profile.avatarHelper}
        </p>
      </DialogContent>
    </Dialog>
  );
}
