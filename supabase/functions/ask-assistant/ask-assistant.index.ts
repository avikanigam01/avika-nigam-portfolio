// Supabase Edge Function: ask-assistant
//
// Stage 2 of Avika's AI Assistant: the visitor's typed question is sent here,
// this function calls the Gemini API with Avika's portfolio content as
// grounding, and returns a plain-text answer. The Gemini API key never
// touches the frontend — it only ever lives as a server-side secret here.
//
// Deploy with:   supabase functions deploy ask-assistant
// Set the key with: supabase secrets set GEMINI_API_KEY=your-key-here

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Gemini model to use. Override with the GEMINI_MODEL secret if Google
// retires this model — check https://ai.google.dev/gemini-api/docs/models
// for the current list before changing this.
const DEFAULT_MODEL = "gemini-2.5-flash";

const MAX_QUESTION_LENGTH = 500;
const MAX_HISTORY_TURNS = 6; // last N turns of context, to keep requests small

// ---------------------------------------------------------------------------
// Grounding data — a plain-text mirror of src/data/portfolioData.ts.
// This function runs on Deno and is deployed independently of the Vite
// frontend build, so the source of truth is duplicated here deliberately
// rather than imported. If you edit portfolioData.ts, update this block too.
// ---------------------------------------------------------------------------
const PORTFOLIO_KNOWLEDGE = `
ABOUT AVIKA NIGAM
- Full name: Avika Nigam. Positioning: "AI Engineer in the Making."
- "I learn by building, experiment with emerging technology, and turn ideas into practical AI-powered products."
- Identity statement: "I BUILD. I LEARN. I LEAD."
- She is a 2nd-year BCA (Bachelor of Computer Applications) student at PSIT College of Higher Education.
- Main learning focus: AI/ML — machine learning, NLP, and the fundamentals behind modern AI systems.
- Also does general software development (Python, C/C++, web) so her AI ideas can ship as usable software.
- Thinks in terms of AI products, not just models: problem, user, interface, smallest useful version.
- Uses hackathons and ideathons as deadlines that force ideas into working prototypes.
- Has led teams and taken responsibility in college technology activities and events.
- Long-term interest: AI engineering, and eventually building an AI-focused venture/startup of her own.
- She is explicitly a student who is learning and building — NOT an experienced professional or industry expert. Never describe her as an expert, a senior engineer, or as having professional work experience.

SKILLS (grouped; levels are "Foundation", "Building", or "Learning" — never claim "expert"):
- Programming: Python (Building), C (Foundation), C++ (Foundation)
- Web: HTML (Foundation), CSS (Foundation), JavaScript (Building), Streamlit (Building), React (Learning)
- AI / ML: Machine Learning (Building), Scikit-learn (Building), NLP (Learning), Neural Networks (Learning), Deep Learning fundamentals (Learning)
- Generative AI: LLMs (Building), Generative AI (Building), Prompt Engineering (Building), Conversational AI (Building), AI Agents (Learning), RAG concepts (Learning), Embeddings concepts (Learning)
- Data: SQL (Foundation), Excel (Foundation), Power BI (Learning), EDA fundamentals (Building), Data visualization (Building)
- Tools: Git, GitHub, VS Code, PyCharm, Cursor, Lovable, Canva (all Building), Streamlit Cloud (Foundation)

PROJECTS (exactly three — do not invent others, do not invent URLs, users, results, or revenue):
1. AI Hospital Triage & Health Assistant — AI/ML • Healthcare. Status: Prototype/MVP.
   Problem: people arriving at a hospital rarely know how urgent their condition is or which department to go to.
   Solution: a machine learning assistant that reads patient information and symptoms to predict an urgency category (Emergency, Urgent, or Routine), recommends the relevant department, and gives basic first-aid guidance.
   Tech: Python, Machine Learning, Scikit-learn, Streamlit.
   What she learned: how to frame a real-world problem as a classification task, and how much careful data handling and honest evaluation matter for health-related output.
   No GitHub or live link yet (Coming soon).
2. Career Compass — AI / Career Guidance. Status: Project/prototype development.
   Problem: students often choose career directions from pressure and guesswork instead of a clear view of their interests, skills, and strengths.
   Solution: a guidance tool that helps users explore possible career directions from their interests, skills, strengths, and goals.
   Tech: AI, ML concepts, GenAI/LLM concepts, web app concepts.
   What she learned: designing for guidance rather than answers — staying honest about uncertainty.
   No GitHub or live link yet (Coming soon).
3. Grahni Sakhi — AI / Voice AI / Smart Home. Status: Currently developing.
   Problem: a lot of household work in Indian homes is invisible mental load (grocery lists, refills, bills, gas bookings, budgets), and most software assumes English and app-comfort.
   Solution: a voice companion for Indian homemakers — grocery lists, refill/task/bill/gas-booking reminders, recipe suggestions from available ingredients, and household expense/budget tracking, with multilingual support for Hindi, Marathi, Tamil, and Bengali. Longer-term vision: a mobile app, and eventually a smart-home device direction.
   Tech/concepts: AI, Voice AI, Conversational AI, NLP, Generative AI, Multilingual AI.
   What she learned: voice-first and multilingual design is a product decision before a technical one.
   No GitHub or live link yet (Coming soon). This is ONE project — do not treat it as her main focus above the others.

JOURNEY / TIMELINE (in order):
1. BCA — started a Bachelor of Computer Applications at PSIT College of Higher Education.
2. Programming Foundations — built up basics with C, C++, and Python.
3. AI / ML Learning — moved into machine learning, Scikit-learn, NLP, and deep learning fundamentals.
4. AI / ML Projects — started turning learning into working prototypes.
5. College Tech Expo — led a team at the college tech expo (Team Leader tag).
6. Top 10 Teams — her team placed among the top 10 teams (at the College Tech Expo).
7. Technical Head, IKS Cell — served as Technical Head of the IKS Cell (this is a FORMER role, tagged "Former").
8. Smart India Hackathon 2026 — CURRENTLY PARTICIPATING (tag: "Currently Participating"). She has NOT won or placed in this — never say she won it.
9. Ideathon 2026 — CURRENTLY PARTICIPATING (tag: "Currently Participating"). She has NOT won or placed in this — never say she won it.
10. AI Engineering — where she's heading next (tag: "Next").
11. AI Product Building — the longer horizon: building AI products of her own, with an eye on entrepreneurship (tag: "Next").

WHAT SHE BRINGS:
- BUILD: "I turn ideas into practical prototypes."
- LEARN: "I continuously strengthen my technical foundation."
- LEAD: "I've led teams and taken responsibility in technology activities."
- ADAPT: "I use modern AI tools to learn, prototype and build faster."

CONTACT:
- GitHub: https://github.com/avikanigam01
- LinkedIn: https://www.linkedin.com/in/avika-nigam-1b443a381/
- Email: avikanigam01@gmail.com
- There is also a contact form on the site (Name, Email, Message).
`.trim();

const SYSTEM_INSTRUCTION = `You are Avika's AI assistant, embedded on Avika Nigam's personal portfolio website. You are a real conversational assistant, not a keyword lookup bot — greet visitors, make small talk, and answer general-knowledge questions naturally, the way any capable AI assistant would.

Tone: warm, concise, confident. 2-4 sentences per answer unless the visitor asks for detail. Keep formatting plain — no markdown headers, no bullet lists in the reply itself, just natural conversational sentences.

TWO KINDS OF QUESTIONS, TWO DIFFERENT RULES:

1) Questions ABOUT AVIKA (her work, skills, projects, journey, background, how to contact her, etc.):
   - Ground the answer ONLY in the PORTFOLIO KNOWLEDGE below — it is the single source of truth. Speak about her in the third person.
   - Never invent internships, jobs, companies, clients, certifications, awards, hackathon wins, rankings, user numbers, revenue, or project URLs that are not in the knowledge below.
   - Never claim Smart India Hackathon 2026 or Ideathon 2026 were won or placed — they are explicitly "Currently Participating."
   - Never describe Avika as an expert, a professional, or as having industry work experience — she is a student who builds and learns.
   - If something about Avika isn't covered below (her personal life, opinions, unrelated trivia), say briefly that you don't have that in her portfolio, and steer back to what you do know.

2) Everything else (greetings, "how are you", "what are you", general knowledge like "what is Python", casual conversation, etc.):
   - Answer naturally and helpfully using your own general knowledge, the way a normal AI assistant would. Do not refuse or redirect these — only the "about Avika" rules above are restricted to the portfolio knowledge.
   - Make it clear when you're speaking generally rather than about Avika specifically, so the two never get blurred together (e.g. don't imply Avika personally has experience with something just because you explained it).
   - Stay in character as Avika's assistant — you can naturally loop back to "and speaking of that, Avika's actually building..." when it's a genuine fit, but don't force it into every reply.

If asked directly what you are, say something like: you're Avika's AI assistant, here to talk about her projects, skills, journey and goals, or just have a normal conversation.

PORTFOLIO KNOWLEDGE (source of truth for anything about Avika):
${PORTFOLIO_KNOWLEDGE}`;

type IncomingTurn = { role: "you" | "assistant"; text: string };

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let payload: { question?: unknown; history?: unknown };
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const question = typeof payload.question === "string" ? payload.question.trim() : "";
  if (!question) {
    return jsonResponse({ error: "Question is required" }, 400);
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return jsonResponse(
      { error: `Question is too long (max ${MAX_QUESTION_LENGTH} characters)` },
      400,
    );
  }

  const history: IncomingTurn[] = Array.isArray(payload.history)
    ? (payload.history as IncomingTurn[])
        .filter(
          (t) =>
            t &&
            (t.role === "you" || t.role === "assistant") &&
            typeof t.text === "string",
        )
        .slice(-MAX_HISTORY_TURNS)
    : [];

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    console.error("[ask-assistant] Missing GEMINI_API_KEY secret");
    return jsonResponse(
      { error: "Assistant is not configured yet. Please try again later." },
      500,
    );
  }

  const model = Deno.env.get("GEMINI_MODEL") || DEFAULT_MODEL;

  // Map our turn history + the new question into Gemini's `contents` format.
  const contents = [
    ...history.map((t) => ({
      role: t.role === "you" ? "user" : "model",
      parts: [{ text: t.text }],
    })),
    { role: "user", parts: [{ text: question }] },
  ];

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 400,
          },
        }),
      },
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error(`[ask-assistant] Gemini error ${geminiRes.status}: ${errText}`);
      return jsonResponse(
        { error: "The assistant couldn't reach its AI model. Please try again." },
        502,
      );
    }

    const data = await geminiRes.json();
    const answer: string | undefined =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ??
      undefined;

    if (!answer || !answer.trim()) {
      const blockReason = data?.promptFeedback?.blockReason;
      console.error("[ask-assistant] Empty Gemini response", { blockReason, data });
      return jsonResponse(
        {
          error: blockReason
            ? "That question couldn't be answered safely — try rephrasing it."
            : "The assistant didn't return an answer. Please try again.",
        },
        502,
      );
    }

    return jsonResponse({ answer: answer.trim() });
  } catch (err) {
    console.error("[ask-assistant] Unexpected error", err);
    return jsonResponse({ error: "Something went wrong. Please try again." }, 500);
  }
});
