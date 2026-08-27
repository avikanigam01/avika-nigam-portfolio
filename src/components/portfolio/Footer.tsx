import { Github, Linkedin, Mail } from "lucide-react";
import { contact, profile } from "@/data/portfolioData";

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 px-5 py-14 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: "var(--gradient-spectrum)" }}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold tracking-[0.16em]">
            <span className="text-spectrum">{profile.name.toUpperCase()}</span>
          </p>
          <p className="mt-2 font-display text-[0.62rem] tracking-[0.32em] text-muted-foreground uppercase">
            {profile.label}
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-3">
          <li>
            <a
              href={contact.links.github.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub profile"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/12 transition-colors hover:border-pink/60 hover:bg-white/5"
            >
              <Github className="h-4.5 w-4.5" aria-hidden="true" />
            </a>
          </li>
          <li>
            <span
              className="grid h-11 w-11 place-items-center rounded-full border border-white/8 text-muted-foreground/60"
              title={`LinkedIn — ${contact.links.linkedin.placeholder}`}
            >
              <Linkedin className="h-4.5 w-4.5" aria-hidden="true" />
              <span className="sr-only">LinkedIn — {contact.links.linkedin.placeholder}</span>
            </span>
          </li>
          <li>
            <span
              className="grid h-11 w-11 place-items-center rounded-full border border-white/8 text-muted-foreground/60"
              title={`Email — ${contact.links.email.placeholder}`}
            >
              <Mail className="h-4.5 w-4.5" aria-hidden="true" />
              <span className="sr-only">Email — {contact.links.email.placeholder}</span>
            </span>
          </li>
        </ul>
      </div>

      <p className="mx-auto mt-10 w-full max-w-6xl text-xs text-muted-foreground/70">
        © {new Date().getFullYear()} {profile.name}. Built and maintained by me.
      </p>
    </footer>
  );
}
