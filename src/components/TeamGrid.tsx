"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import RevealText from "@/components/RevealText";

/*
  About: the team (Elliot, 31 Oct). "We are blut." and the description sit
  left, the four portraits in a row below. Hovering a face (tapping it on
  touch screens, or focusing it by keyboard) greys out the others and swaps
  the text at the top for that person's name and role. Moving off (or
  tapping anywhere else) brings the description back. The order is shuffled
  on every visit, so nobody comes first (Nic, 31 Oct).
*/

const PEOPLE = [
  { name: "Karl Jawara", role: "Creative Product & Campaign Lead", file: "Karl" },
  { name: "Timo Blunck", role: "CEO & Founder", file: "Timo" },
  { name: "Elliot Blunck", role: "Head of Video & Social Content", file: "Elliot" },
  { name: "Michael Robb", role: "Head of Audio Production", file: "Michael" },
];

/** Fisher–Yates, once per page load (pages are full loads, see PageTransition). */
function shuffle<T>(list: readonly T[]): T[] {
  const order = [...list];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

let shuffled: typeof PEOPLE | null = null;
const shuffledPeople = () => (shuffled ??= shuffle(PEOPLE));
const subscribeNever = () => () => {};

export default function TeamGrid({ intro }: { intro: string }) {
  const [active, setActive] = useState<number | null>(null);
  // The server renders the fixed order; the browser switches to this visit's shuffle.
  const people = useSyncExternalStore(subscribeNever, shuffledPeople, () => PEOPLE);
  // Safari's click events carry no pointer type, so remember it from pointerdown.
  const lastPointer = useRef<string>("mouse");
  const keyboardFocus = useRef(false);

  // Touch: a tap anywhere outside the faces brings the description back.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      if (!(e.target as Element).closest?.(".bk-team-face")) setActive(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const person = active === null ? null : people[active];

  return (
    <div className={`bk-team${active === null ? "" : " has-active"}`}>
      <div className="bk-team-top" aria-live="polite">
        <div
          className={`bk-team-text${person ? "" : " is-shown"}`}
          aria-hidden={!!person}
        >
          <RevealText as="h1" className="lp-heading" text="We are blut." />
          <p className="bk-team-intro">{intro}</p>
        </div>
        <div
          className={`bk-team-text${person ? " is-shown" : ""}`}
          aria-hidden={!person}
        >
          <p className="lp-heading">{person?.name ?? " "}</p>
          <p className="bk-team-role">{person?.role ?? " "}</p>
        </div>
      </div>
      <ul role="list" className="bk-team-grid">
        {people.map((p, i) => (
          <li key={p.file}>
            <button
              type="button"
              className={`bk-team-face${active === i ? " is-active" : ""}`}
              aria-label={`${p.name}, ${p.role}`}
              aria-pressed={active === i}
              onPointerDown={(e) => {
                lastPointer.current = e.pointerType;
              }}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onPointerLeave={(e) =>
                e.pointerType === "mouse" && setActive(null)
              }
              // Keyboard focus picks a face too; focus from a click or tap doesn't.
              onFocus={(e) => {
                if (!e.currentTarget.matches(":focus-visible")) return;
                keyboardFocus.current = true;
                setActive(i);
              }}
              onBlur={() => {
                if (!keyboardFocus.current) return;
                keyboardFocus.current = false;
                setActive(null);
              }}
              onClick={() => {
                // Mouse users already picked by hovering; taps toggle.
                if (lastPointer.current === "mouse") return;
                setActive((cur) => (cur === i ? null : i));
              }}
            >
              <img
                src={`/images/${p.file}-p-500.jpg`}
                srcSet={`/images/${p.file}-p-500.jpg 500w, /images/${p.file}-p-800.jpg 800w`}
                sizes="(max-width: 767px) 50vw, 25vw"
                alt=""
                loading="lazy"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
