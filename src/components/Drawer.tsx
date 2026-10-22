"use client";

import { useRef, type MouseEvent } from "react";

const DURATION = 500;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * One FAQ-style drawer (Strategy). A native <details>, so it opens without
 * JavaScript; with it, the height slides open and closed and the text fades
 * in, in every browser (Safari can't animate <details> to its natural height
 * in CSS). Reduced motion: no animation.
 *
 * Only one drawer in a group (the drawers sharing a parent) is open at a time:
 * opening one closes the others, with the same slide.
 */
export default function Drawer({ name, text }: { name: string; text: string }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);

  function onToggleClick(event: MouseEvent) {
    const details = detailsRef.current;
    const body = bodyRef.current;
    if (!details || !body) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (!details.open) closeSiblings(details);
      return;
    }
    event.preventDefault();

    const opening = !details.open || details.classList.contains("is-closing");
    const from = animation.current ? body.getBoundingClientRect().height : opening ? 0 : body.scrollHeight;
    animation.current?.cancel();

    if (opening) {
      closeSiblings(details);
      details.classList.remove("is-closing");
      details.open = true;
    } else {
      details.classList.add("is-closing");
    }
    const to = opening ? body.scrollHeight : 0;

    const anim = body.animate(
      [
        { height: `${from}px`, opacity: opening ? 0 : 1 },
        { height: `${to}px`, opacity: opening ? 1 : 0 },
      ],
      { duration: DURATION, easing: EASING },
    );
    animation.current = anim;
    anim.onfinish = () => {
      animation.current = null;
      if (!opening) {
        details.open = false;
        details.classList.remove("is-closing");
      }
    };
  }

  return (
    <details ref={detailsRef} className="bk-drawer">
      <summary className="bk-drawer-head" onClick={onToggleClick}>
        <span>{name}</span>
        <span className="bk-drawer-icon" aria-hidden="true" />
      </summary>
      <div ref={bodyRef} className="bk-drawer-body">
        <p>{text}</p>
      </div>
    </details>
  );
}

/** Closes the other open drawers in the same group by toggling them, so they slide shut. */
function closeSiblings(details: HTMLDetailsElement) {
  details.parentElement
    ?.querySelectorAll<HTMLDetailsElement>(":scope > details.bk-drawer[open]:not(.is-closing)")
    .forEach((other) => {
      if (other !== details) other.querySelector("summary")?.click();
    });
}
