/**
 * Stage 3 — browser-native voice for Avika's AI Assistant.
 *
 * Microphone input uses the Web Speech API (SpeechRecognition /
 * webkitSpeechRecognition) and spoken replies use window.speechSynthesis.
 * No external voice service, no API key, nothing added to the bundle.
 */

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

type RecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export type RecognitionErrorKind =
  | "unsupported"
  | "not-allowed"
  | "no-speech"
  | "audio-capture"
  | "network"
  | "aborted"
  | "unknown";

export const RECOGNITION_MESSAGES: Record<RecognitionErrorKind, string> = {
  unsupported: "Voice input isn't supported in this browser. You can still type your question.",
  "not-allowed":
    "Microphone access is blocked. Allow it in your browser settings, or type your question below.",
  "no-speech": "I couldn't hear that. You can try again or type your question below.",
  "audio-capture":
    "I couldn't reach a microphone. Check your device, or type your question below.",
  network: "The speech service couldn't be reached. You can type your question below.",
  aborted: "Listening stopped. Tap the mic to try again.",
  unknown: "I couldn't hear that. You can try again or type your question below.",
};

/**
 * Starts a single-shot recognition session. Returns a controller so the caller
 * can stop it, or null when the browser has no SpeechRecognition support.
 */
export function startRecognition(handlers: {
  onStart?: () => void;
  onResult: (transcript: string) => void;
  onError: (kind: RecognitionErrorKind) => void;
  onEnd?: () => void;
}): { stop: () => void } | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;

  let settled = false;
  const recognition = new Ctor();
  // Let the browser use the visitor's own English locale (e.g. en-IN) when it
  // has one, instead of forcing an unusual locale.
  recognition.lang =
    typeof navigator !== "undefined" && /^en\b/i.test(navigator.language || "")
      ? navigator.language
      : "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => handlers.onStart?.();

  recognition.onresult = (event: any) => {
    const transcript = String(event?.results?.[0]?.[0]?.transcript ?? "").trim();
    if (transcript) {
      settled = true;
      handlers.onResult(transcript);
    }
    try {
      recognition.stop();
    } catch {
      /* already stopped */
    }
  };

  recognition.onerror = (event: any) => {
    settled = true;
    const code = String(event?.error ?? "unknown");
    const kind: RecognitionErrorKind =
      code === "not-allowed" || code === "service-not-allowed"
        ? "not-allowed"
        : code === "no-speech"
          ? "no-speech"
          : code === "audio-capture"
            ? "audio-capture"
            : code === "network"
              ? "network"
              : code === "aborted"
                ? "aborted"
                : "unknown";
    handlers.onError(kind);
  };

  recognition.onend = () => {
    if (!settled) handlers.onError("no-speech");
    handlers.onEnd?.();
  };

  try {
    recognition.start();
  } catch {
    handlers.onError("unknown");
    return null;
  }

  return {
    stop: () => {
      try {
        recognition.abort();
      } catch {
        /* noop */
      }
    },
  };
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices?.() ?? [];
  if (!voices.length) return null;
  const english = voices.filter((v) => /^en/i.test(v.lang));
  const pool = english.length ? english : voices;
  const preferred = [
    /google.*(india|uk|us)/i,
    /samantha/i,
    /(microsoft).*(aria|jenny|neerja|natural)/i,
    /female/i,
  ];
  for (const pattern of preferred) {
    const match = pool.find((v) => pattern.test(v.name));
    if (match) return match;
  }
  return pool.find((v) => /en-IN/i.test(v.lang)) ?? pool[0] ?? null;
}

/**
 * Speaks `text` aloud. Cancels any current speech first. Calls onEnd when done
 * (or immediately, if synthesis is unavailable or fails) so the caller can
 * always return to idle.
 */
export function speak(
  text: string,
  handlers: { onStart?: () => void; onEnd?: () => void; onError?: () => void } = {},
): { cancel: () => void } {
  if (!isSpeechSynthesisSupported() || !text.trim()) {
    handlers.onError?.();
    handlers.onEnd?.();
    return { cancel: () => {} };
  }

  const synth = window.speechSynthesis;
  try {
    synth.cancel();
  } catch {
    /* noop */
  }

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    handlers.onEnd?.();
  };

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1.05;
  utterance.volume = 1;
  const voice = pickVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "en-IN";
  }

  utterance.onstart = () => handlers.onStart?.();
  utterance.onend = finish;
  utterance.onerror = () => {
    handlers.onError?.();
    finish();
  };

  try {
    synth.speak(utterance);
  } catch {
    handlers.onError?.();
    finish();
  }

  return {
    cancel: () => {
      try {
        synth.cancel();
      } catch {
        /* noop */
      }
      finish();
    },
  };
}

export function cancelSpeech() {
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* noop */
  }
}

/** Voices load asynchronously in some browsers; warm the list up front. */
export function warmUpVoices() {
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.getVoices();
  } catch {
    /* noop */
  }
}
