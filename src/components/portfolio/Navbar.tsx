import { useEffect, useState } from "react";
import { Menu, X, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, profile } from "@/data/portfolioData";

export function Navbar({ onTalk }: { onTalk: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "border-b border-white/8 bg-background/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8"
      >
        <a
          href="#home"
          className="font-display text-lg font-semibold tracking-[0.22em] transition-opacity hover:opacity-80"
        >
          <span className="text-spectrum">{profile.shortName}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTalk}
            className="group relative hidden items-center gap-2 overflow-hidden rounded-full border border-pink/50 px-5 py-2.5 font-display text-xs font-semibold tracking-[0.16em] uppercase transition-all hover:border-pink md:inline-flex"
            style={{ boxShadow: "0 0 0 0 transparent" }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 opacity-25 transition-opacity duration-500 group-hover:opacity-60"
              style={{ background: "var(--gradient-warm)" }}
            />
            <Mic className="h-3.5 w-3.5" aria-hidden="true" />
            Talk to me
          </button>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-foreground md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-white/8 bg-background/95 px-5 pt-2 pb-6 backdrop-blur-xl md:hidden"
      >
        <ul className="flex flex-col">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className="block border-b border-white/6 py-3.5 font-display text-base tracking-wide text-foreground/90"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            onTalk();
          }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-display text-sm font-semibold tracking-[0.16em] text-primary-foreground uppercase"
          style={{ background: "var(--gradient-warm)" }}
        >
          <Mic className="h-4 w-4" aria-hidden="true" />
          Talk to me
        </button>
      </div>
    </header>
  );
}
