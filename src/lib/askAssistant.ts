/**
 * Stage 2 — the assistant's brain.
 *
 * Sends the visitor's question (plus a little turn history) to the
 * `ask-assistant` Supabase Edge Function, which calls Gemini with Avika's
 * portfolio content as grounding. The Gemini API key never reaches the
 * browser — it lives only as a server-side secret on the Edge Function.
 *
 * If the network call fails for any reason (offline, function not deployed
 * yet, quota, etc.) this falls back to the local rule-based matcher from
 * Stage 1 so the assistant never goes silent.
 */
import { supabase } from "@/integrations/supabase/client";
import { answerQuestion } from "@/lib/assistantKnowledge";

export type AssistantTurn = { role: "you" | "assistant"; text: string };

export type AskAssistantResult = {
  answer: string;
  /** true if this came from the offline/local fallback rather than Gemini */
  isFallback: boolean;
};

export async function askAssistant(
  question: string,
  history: AssistantTurn[] = [],
): Promise<AskAssistantResult> {
  try {
    const { data, error } = await supabase.functions.invoke("ask-assistant", {
      body: { question, history: history.slice(-6) },
    });

    if (error) throw error;

    const answer = typeof data?.answer === "string" ? data.answer.trim() : "";
    if (!answer) throw new Error("Empty answer from assistant");

    return { answer, isFallback: false };
  } catch (err) {
    console.error("[askAssistant] Falling back to local answers:", err);
    return { answer: answerQuestion(question), isFallback: true };
  }
}
