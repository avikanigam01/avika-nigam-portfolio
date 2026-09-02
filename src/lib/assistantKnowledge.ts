/**
 * Stage 1 knowledge layer for Avika's AI Assistant.
 *
 * Every answer below is derived from the centralized portfolio data — nothing is
 * invented. As of Stage 2, the assistant primarily answers via the `ask-assistant`
 * Supabase Edge Function (Gemini, grounded in the same facts) — see
 * src/lib/askAssistant.ts. This local rule-based matcher now serves as the
 * offline/error fallback so the assistant always has something grounded to say.
 */
import {
  aboutCards,
  aboutStatement,
  contact,
  milestones,
  profile,
  projects,
  skillGroups,
  whatIBring,
} from "@/data/portfolioData";

export const ASSISTANT_GREETING =
  "Hi! I'm Avika's AI assistant. 👋 What would you like to know about her?";

export const ASSISTANT_SUGGESTIONS = [
  "What does Avika build?",
  "Tell me about her projects",
  "What are her skills?",
  "What is her journey so far?",
] as const;

const sentence = (s: string) => (s.endsWith(".") ? s : `${s}.`);

function aboutAnswer() {
  const education = aboutCards.find((c) => c.icon === "school") ?? aboutCards[0];
  return `${aboutStatement} ${profile.greeting.replace("Hi, I'm ", "")} is ${profile.headline.replace(".", "")} — ${sentence(profile.supporting)} ${education ? sentence(education.body) : ""}`.trim();
}

function skillsAnswer() {
  const summary = skillGroups
    .map((g) => `${g.title}: ${g.skills.map((s) => s.name).join(", ")}`)
    .join(". ");
  return `Avika's technical foundation is grouped as — ${summary}. She frames these as a growing foundation rather than expertise in everything.`;
}

function projectsAnswer() {
  return `Avika is building ${projects.length} projects right now: ${projects
    .map((p) => `${p.name} (${p.category}, ${p.status.toLowerCase()})`)
    .join("; ")}. Ask me about any one of them for the problem, solution and tech.`;
}

function projectAnswer(p: (typeof projects)[number]) {
  const links = p.githubUrl ?? p.liveUrl ? "Links are on the project card." : "Links are coming soon.";
  return `${p.name} — ${sentence(p.solution)} Tech: ${p.tech.join(", ")}. Status: ${p.status}. ${links}`;
}

function journeyAnswer() {
  return `Her journey so far: ${milestones.map((m) => m.title).join(" → ")}. Ask about any milestone for detail.`;
}

function leadershipAnswer() {
  const led = milestones.filter((m) =>
    /leader|head|hackathon|ideathon|expo|top 10/i.test(`${m.title} ${m.detail}`),
  );
  return led.length
    ? led.map((m) => `${m.title} — ${sentence(m.detail)}`).join(" ")
    : "I don't have that information in Avika's portfolio yet.";
}

function contactAnswer() {
  const entries = Object.values(contact.links) as { label: string; url?: string }[];
  const parts = entries.map((l) => (l.url ? `${l.label}: ${l.url}` : `${l.label}: to be added`));
  return `${contact.supporting} ${parts.join(". ")}. You can also use the contact form in the Contact section.`;
}


function bringAnswer() {
  return whatIBring.map((w) => `${w.title} — ${sentence(w.body)}`).join(" ");
}

type Rule = { test: RegExp; answer: () => string };

const RULES: Rule[] = [
  { test: /\b(hi|hello|hey|namaste)\b/i, answer: () => `${ASSISTANT_GREETING}` },
  { test: /\b(who|about|introduce|yourself|herself|study|studying|college|education|bca)\b/i, answer: aboutAnswer },
  { test: /\b(skill|tech stack|technolog|language|python|tool|know)\b/i, answer: skillsAnswer },
  { test: /\b(journey|timeline|experience|path|growth)\b/i, answer: journeyAnswer },
  {
    test: /\b(leader|leadership|hackathon|ideathon|achievement|award|expo|iks)\b/i,
    answer: leadershipAnswer,
  },
  { test: /\b(contact|reach|email|linkedin|github|hire|connect)\b/i, answer: contactAnswer },
  { test: /\b(bring|strength|why her|value|offer)\b/i, answer: bringAnswer },
  { test: /\b(project|build|built|work|portfolio|app)\b/i, answer: projectsAnswer },
  { test: /\b(goal|future|ambition|career|plan|next)\b/i, answer: () => journeyAnswer() },
];

/** Local, grounded answer for Stage 1 (no network, no invented facts). */
export function answerQuestion(question: string): string {
  const q = question.trim();
  if (!q) return "Ask me anything about Avika's work, skills, projects or journey.";

  const matchedProject = projects.find((p) => {
    const words = p.name.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3);
    return words.some((w) => q.toLowerCase().includes(w));
  });
  if (matchedProject) return projectAnswer(matchedProject);

  const rule = RULES.find((r) => r.test.test(q));
  if (rule) return rule.answer();

  return "I'm Avika's portfolio assistant, so I can mainly help you explore Avika's work, skills, projects, journey, and achievements.";
}
