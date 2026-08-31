import { Github, Linkedin, Mail, Mic } from "lucide-react";
import { SectionShell, AmbientGlow } from "./SectionShell";
import { Reveal } from "./Reveal";
import { ContactForm } from "./ContactForm";
import { contact, profile } from "@/data/portfolioData";

export function Contact({ onTalk }: { onTalk: () => void }) {
  return (
    <div className="relative">
      <AmbientGlow
        className="-top-10 left-1/4 h-96 w-96 opacity-30"
        color="var(--magenta)"
      />

      <SectionShell
        id="contact"
        eyebrow="Contact"
        title={<span className="text-spectrum">{contact.headline}</span>}
        lead={contact.supporting}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="flex h-full flex-col gap-4">
              <ContactLink
                href={contact.links.github.url}
                label={contact.links.github.label}
                detail="github.com/avikanigam01"
                icon={<Github className="h-4.5 w-4.5" aria-hidden="true" />}
                accent="var(--pink)"
              />

              <ContactLink
                href={contact.links.linkedin.url}
                label={contact.links.linkedin.label}
                detail="www.linkedin.com/in/avika-nigam-1b443a381"
                icon={<Linkedin className="h-4.5 w-4.5" aria-hidden="true" />}
                accent="var(--violet)"
              />

              <ContactLink
                href={contact.links.email.url}
                label={contact.links.email.label}
                detail="avikanigam01@gmail.com"
                icon={<Mail className="h-4.5 w-4.5" aria-hidden="true" />}
                accent="var(--orange)"
                isEmail
              />

              <button
                type="button"
                onClick={onTalk}
                className="hairline-card group mt-auto flex items-center justify-between gap-4 rounded-2xl p-5 text-left transition-transform duration-400 hover:-translate-y-1"
              >
                <span>
                  <span className="block font-display text-base font-semibold tracking-tight">
                    Prefer talking?
                  </span>

                  <span className="mt-1 block text-sm text-muted-foreground">
                    {profile.avatarHelper}
                  </span>
                </span>

                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                  style={{ background: "var(--gradient-warm)" }}
                  aria-hidden="true"
                >
                  <Mic className="h-4.5 w-4.5 text-primary-foreground" />
                </span>
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </SectionShell>
    </div>
  );
}

function ContactLink({
  href,
  label,
  detail,
  icon,
  accent,
  isEmail = false,
}: {
  href: string | null;
  label: string;
  detail: string;
  icon: React.ReactNode;
  accent: string;
  isEmail?: boolean;
}) {
  const inner = (
    <>
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04]"
        style={{ color: accent }}
        aria-hidden="true"
      >
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block font-display text-sm font-semibold tracking-[0.12em] uppercase">
          {label}
        </span>

        <span className="mt-0.5 block truncate text-sm text-muted-foreground">
          {detail}
        </span>
      </span>
    </>
  );

  if (!href) {
    return (
      <div className="hairline-card flex items-center gap-4 rounded-2xl p-5 opacity-70">
        {inner}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={isEmail ? undefined : "_blank"}
      rel={isEmail ? undefined : "noreferrer noopener"}
      className="hairline-card flex items-center gap-4 rounded-2xl p-5 transition-transform duration-400 hover:-translate-y-1"
    >
      {inner}
    </a>
  );
}
