import { useRef, useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COOLDOWN_MS = 30_000;

type Errors = { name?: string | undefined; email?: string | undefined; message?: string | undefined; form?: string | undefined };

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const lastSubmit = useRef(0);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.email.trim()) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(values.email.trim())) next.email = "Please enter a valid email address.";
    if (!values.message.trim()) next.message = "Please write a short message.";
    return next;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot: bots fill hidden fields, humans never see them.
    if (honeypot.current?.value) {
      setSent(true);
      return;
    }

    const now = Date.now();
    if (now - lastSubmit.current < COOLDOWN_MS) {
      setErrors({ form: "You just sent a message — please wait a moment before sending another." });
      return;
    }

    const found = validate();
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    setSending(true);
    setErrors({});
    const { error } = await supabase.from("contact_messages").insert({
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });
    setSending(false);

    if (error) {
      setErrors({ form: "That didn't send. Please try again in a moment." });
      return;
    }

    lastSubmit.current = now;
    setSent(true);
    setValues({ name: "", email: "", message: "" });
  };

  if (sent) {
    return (
      <div
        className="hairline-card flex flex-col items-start gap-3 rounded-2xl p-7"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="h-6 w-6 text-pink" aria-hidden="true" />
        <h3 className="font-display text-lg font-semibold tracking-tight">Message sent.</h3>
        <p className="text-sm text-muted-foreground">
          Thanks for reaching out — I'll get back to you as soon as I can.
        </p>
        <Button variant="ghost" className="mt-1 rounded-full px-0" onClick={() => setSent(false)}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="hairline-card rounded-2xl p-6 sm:p-7">
      <h3 className="font-display text-lg font-semibold tracking-tight">Send a message</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">
        No account needed — just your name, email and what's on your mind.
      </p>

      <div className="mt-6 flex flex-col gap-5">
        <Field
          id="contact-name"
          label="Name"
          value={values.name}
          onChange={set("name")}
          error={errors.name}
          autoComplete="name"
        />
        <Field
          id="contact-email"
          label="Email"
          type="email"
          value={values.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
        />

        <div>
          <label
            htmlFor="contact-message"
            className="font-display text-[0.65rem] tracking-[0.22em] text-muted-foreground uppercase"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            required
            value={values.message}
            onChange={set("message")}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className="mt-2 w-full resize-y rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-pink/60"
            placeholder="What would you like to build or talk about?"
          />
          {errors.message ? (
            <p id="contact-message-error" className="mt-2 text-xs text-destructive">
              {errors.message}
            </p>
          ) : null}
        </div>

        {/* Honeypot — never rendered visibly, never shown to assistive tech, never submitted */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        >
          <input
            id="contact-nickname"
            name="nickname"
            aria-hidden="true"
            ref={honeypot}
            type="text"
            tabIndex={-1}
            autoComplete="off"
􀀀          />
        </div>


        {errors.form ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.form}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-xs font-semibold tracking-[0.16em] text-primary-foreground uppercase transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-70"
          style={{ background: "var(--gradient-warm)" }}
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {sending ? "Sending" : "Send message"}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string | undefined;
  type?: string;
  autoComplete?: string | undefined;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-display text-[0.65rem] tracking-[0.22em] text-muted-foreground uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-pink/60"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
