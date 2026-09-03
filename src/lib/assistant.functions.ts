/**
 * Server-side brain for Avika's AI Assistant.
 *
 * Runs on the server via TanStack `createServerFn` and calls the Lovable AI
 * Gateway (Gemini) with Avika's portfolio content as grounding. No API key
 * ever reaches the browser.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const turnSchema = z.object({
  role: z.enum(["you", "assistant"]),
  text: z.string().max(2000),
});

const inputSchema = z.object({
  question: z.string().trim().min(1).max(500),
  history: z.array(turnSchema).max(6).optional(),
});

export const askAssistantFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return { answer: "", error: "not-configured" as const };
    }

    const { SYSTEM_INSTRUCTION } = await import("./assistantGrounding.server");

    const messages = [
      { role: "system", content: SYSTEM_INSTRUCTION },
      ...(data.history ?? []).map((t) => ({
        role: t.role === "you" ? "user" : "assistant",
        content: t.text,
      })),
      { role: "user", content: data.question },
    ];

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages,
          temperature: 0.6,
          max_tokens: 400,
        }),
      });

      if (!res.ok) {
        console.error("[askAssistantFn] Gateway error", res.status, await res.text());
        return { answer: "", error: "upstream" as const };
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const answer = json.choices?.[0]?.message?.content?.trim() ?? "";
      if (!answer) return { answer: "", error: "empty" as const };

      return { answer, error: null };
    } catch (err) {
      console.error("[askAssistantFn] Unexpected error", err);
      return { answer: "", error: "unexpected" as const };
    }
  });
