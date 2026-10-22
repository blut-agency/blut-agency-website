"use client";

import { Fragment, useEffect, useRef, type ElementType } from "react";

/** Each letter fades in while rising 0.35em into place. */
const LETTER_FRAMES: Keyframe[] = [
  { opacity: 0, transform: "translateY(0.35em)" },
  { opacity: 1, transform: "none" },
];
const LETTER_MS = 600;
const LETTER_EASING = "cubic-bezier(0.2, 0.7, 0.2, 1)";

/**
 * Headline that reveals letter by letter (fade in + rise) the first time it
 * scrolls into view. Letters are grouped per word so lines still only break
 * between words, and the heading keeps its full text as its accessible name.
 *
 * Pass an array for headlines with deliberate line breaks; an empty string
 * adds a blank line (two <br>s in a row).
 *
 * Letters start hidden from the first paint, but only with JavaScript on
 * (globals.css); without it, or with reduced motion, the text simply shows.
 */
export default function RevealText({
  text,
  as: Tag = "h2",
  className,
  stagger = 0.02,
  parallax,
}: {
  text: string | string[];
  as?: ElementType;
  className?: string;
  /** Seconds between one letter starting and the next. */
  stagger?: number;
  /** Parallax rate (MotionLayer's data-parallax). */
  parallax?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.reveal === "shown") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.reveal = "shown";
      return;
    }

    let animations: Animation[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const letters = el.querySelectorAll<HTMLElement>(".reveal-letter");
        // "backwards" keeps each letter at the first frame (hidden, lowered)
        // until its delay is up; once finished, the letter simply is its
        // normal, visible self.
        animations = Array.from(letters, (letter, i) =>
          letter.animate(LETTER_FRAMES, {
            duration: LETTER_MS,
            delay: i * stagger * 1000,
            easing: LETTER_EASING,
            fill: "backwards",
          }),
        );
        el.dataset.reveal = "shown";
      },
      // Any part of it on screen, a little above the bottom edge: also fires
      // for headlines taller than the viewport.
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.finish());
    };
  }, [stagger]);

  const lines = (Array.isArray(text) ? text : [text]).map((line) => line.trim());
  const label = lines.filter(Boolean).join(" ");

  return (
    <Tag
      ref={ref}
      className={className ? `${className} reveal-text` : "reveal-text"}
      aria-label={label}
      data-parallax={parallax}
      data-reveal="hidden"
    >
      {lines.map((line, lineIndex) => {
        const words = line ? line.split(/\s+/) : [];
        return (
          <Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {words.map((word, w) => (
              <span key={w}>
                <span className="reveal-word" aria-hidden="true">
                  {Array.from(word).map((letter, l) => (
                    <span key={l} className="reveal-letter">
                      {letter}
                    </span>
                  ))}
                </span>
                {w < words.length - 1 ? " " : null}
              </span>
            ))}
          </Fragment>
        );
      })}
    </Tag>
  );
}
