"use client";

import { Fragment, useEffect, useRef, type ElementType } from "react";

/**
 * Headline that reveals letter by letter (fade in + rise) the first time it
 * scrolls into view. Letters are grouped per word so lines still only break
 * between words, and the heading keeps its full text as its accessible name.
 *
 * Pass an array for headlines with deliberate line breaks; an empty string
 * adds a blank line (two <br>s in a row).
 *
 * The hidden starting state is only applied once this effect runs, so without
 * JavaScript, or with reduced motion requested, the text simply shows.
 */
export default function RevealText({
  text,
  as: Tag = "h2",
  className,
  stagger = 0.02,
}: {
  text: string | string[];
  as?: ElementType;
  className?: string;
  /** Seconds between one letter starting and the next. */
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.classList.add("is-armed");
    // Commit the hidden state before any reveal, so every letter starts from it.
    void el.offsetWidth;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const lines = (Array.isArray(text) ? text : [text]).map((line) => line.trim());
  const label = lines.filter(Boolean).join(" ");
  let letterIndex = 0;

  return (
    <Tag ref={ref} className={className ? `${className} reveal-text` : "reveal-text"} aria-label={label}>
      {lines.map((line, lineIndex) => {
        const words = line ? line.split(/\s+/) : [];
        return (
          <Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {words.map((word, w) => (
              <span key={w}>
                <span className="reveal-word" aria-hidden="true">
                  {Array.from(word).map((letter, l) => (
                    <span
                      key={l}
                      className="reveal-letter"
                      style={{ transitionDelay: `${(letterIndex++ * stagger).toFixed(3)}s` }}
                    >
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
