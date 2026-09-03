/**
 * The assistant's brain (client side).
 *
 * Sends the visitor's question (plus a little turn history) to the
 * `askAssistantFn` server function, which calls Gemini through the Lovable AI
 * Gateway with Avika's portfolio content as grounding. The API key never
 * reaches the browser.
 *
 * If the call fails for any reason (offline, quota, etc.) this falls back to
 * the local rule-based matcher so the assistant never goes silent.
 */
import { askAssistantFn } from "@/lib/assistant.functions";
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
    const result = await askAssistantFn({
      data: { question: question.trim().slice(0, 500), history: history.slice(-6) },
    });

    if (result.error || !result.answer) throw new Error(result.error ?? "empty");

    return { answer: result.answer, isFallback: false };
  } catch (err) {
    console.error("[askAssistant] Falling back to local answers:", err);
    return { answer: answerQuestion(question), isFallback: true };
  }
}
