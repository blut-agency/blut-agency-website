"use client";

import { Fragment, useEffect, useRef, type ElementType } from "react";

/** Each letter fades in, rises 0.25em into place and comes into focus. The
 * last frame is the letter's normal state, so nothing (no filter) stays on it. */
const LETTER_FRAMES: Keyframe[] = [
  { opacity: 0, transform: "translateY(0.25em)", filter: "blur(8px)" },
  { opacity: 1, transform: "none", filter: "blur(0)" },
];
const LETTER_MS = 600;
const LETTER_EASING = "cubic-bezier(0.2, 0.7, 0.2, 1)";

/**
 * Headline that reveals letter by letter (fade in, rise, de-blur) the first time it
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
  after,
  parallax,
}: {
  text: string | string[];
  as?: ElementType;
  className?: string;
  /** Seconds between one letter starting and the next. */
  stagger?: number;
  /** The headline this line continues: its letters reveal first, then this line's. */
  after?: string;
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

    const delay = after ? after.replace(/\s/g, "").length * stagger : 0;
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
            delay: (delay + i * stagger) * 1000,
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
    // A continuing line starts with its headline (the element before it).
    observer.observe((after && el.previousElementSibling) || el);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.finish());
    };
  }, [stagger, after]);

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
