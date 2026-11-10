"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Button from "@/components/Button";

/**
 * Small panel under a portrait: the person's address, "Send email" and "Copy"
 * (Elliot, Nov 2026). Focus moves into it on open; Escape or a click outside
 * the portrait and panel closes it; after Escape, focus goes back to the portrait.
 */
export default function MailPopup({ mail, onClose }: { mail: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // The portrait is the button beside the panel (a clicked button isn't focused in Safari).
    const opener = ref.current?.parentElement?.querySelector<HTMLElement>(":scope > button");
    ref.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      opener?.focus();
      onClose();
    };
    // The parent holds the portrait too, so clicking it toggles instead of closing twice.
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.parentElement?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [onClose]);

  const copy = () => {
    navigator.clipboard.writeText(mail).then(() => setCopied(true), () => {});
  };

  return (
    <div ref={ref} className="lp-panel bk-mail" role="dialog" aria-label={`Email ${mail}`}>
      <p className="bk-mail-address">{mail}</p>
      <div className="bk-mail-actions">
        <Button size="sm" href={`mailto:${mail}`}>
          Send email
        </Button>
        <Button size="sm" variant="outline" onClick={copy}>
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
    </div>
  );
}

/** A contact block portrait: a click opens the mail panel under it. */
export function ContactPortrait({ name, mail, children }: { name: string; mail: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <div className="bk-mail-anchor">
      <button
        type="button"
        className="bk-contact-photo bk-team-face"
        aria-label={`Email ${name}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {children}
      </button>
      {open && <MailPopup mail={mail} onClose={close} />}
    </div>
  );
}
