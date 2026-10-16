"use client";

import { useState, type CSSProperties } from "react";

/** Grid position of a photo: [row, column], 1-based. */
type Cell = [number, number];

export type Member = {
  name: string;
  role: string;
  email: string;
  /** File name in /public/images (the existing square team photos). */
  photo: string;
  /** Desktop and tablet: 8 columns x 4 rows, the name panel fills rows 2-3, columns 3-6. */
  desk: Cell;
  /** Phones: 5 columns x 4 rows, the name panel fills rows 2-3 across the full width. */
  phone: Cell;
};

/* Empty white squares that fill the rest of the grid (CSS auto-places them
   around the photos and the name panel). Desktop: 32 - 8 - 5 = 19. Phones
   only show the first 5 (20 - 10 - 5); the rest are hidden in about.css. */
const EMPTY_CELLS = 19;

function photoSet(file: string) {
  return {
    src: `/images/${file}-p-500.jpg`,
    srcSet: `/images/${file}-p-500.jpg 500w, /images/${file}-p-800.jpg 800w`,
  };
}

/**
 * Team section (Nic's Figma "Team", 142:1113): a grid of white squares with
 * hairlines between them, the photos scattered around a centre panel that
 * shows one person's name and role. Pointing at, focusing or tapping a photo
 * shows that person in the panel. The first person shown is the one drawn in
 * the Figma. Without JavaScript the panel simply keeps that person; every
 * photo still carries its name and role for screen readers.
 */
export default function TeamGrid({ members, initial = 0 }: { members: Member[]; initial?: number }) {
  const [active, setActive] = useState(initial);
  const current = members[active] ?? members[0];

  return (
    <div className="ab-team-grid">
      {members.map((m, i) => {
        const { src, srcSet } = photoSet(m.photo);
        const pos = {
          "--ab-r": m.desk[0],
          "--ab-c": m.desk[1],
          "--ab-mr": m.phone[0],
          "--ab-mc": m.phone[1],
        } as CSSProperties;
        return (
          <button
            key={m.name}
            type="button"
            className="ab-face"
            style={pos}
            aria-label={`${m.name}, ${m.role}`}
            aria-pressed={i === active}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <img src={src} srcSet={srcSet} sizes="(max-width: 767px) 20vw, 12vw" alt="" loading="lazy" />
          </button>
        );
      })}

      <div className="ab-team-center" aria-live="polite">
        <p className="ab-team-name">
          <a href={`mailto:${current.email}`}>{current.name}</a>
        </p>
        <p className="ab-team-role">{current.role}</p>
      </div>

      {Array.from({ length: EMPTY_CELLS }, (_, i) => (
        <span key={i} className="ab-cell" aria-hidden="true" />
      ))}
    </div>
  );
}
