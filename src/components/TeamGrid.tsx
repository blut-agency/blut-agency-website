"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import RevealText from "@/components/RevealText";
import CaseStudyVisual, { patternAt } from "@/components/CaseStudyVisual";
import MailPopup from "@/components/MailPopup";
import { DEFAULT_TEAM_COLOR, TEAM_COLORS, getTeam } from "@/lib/team";

/*
  About: the team (Elliot, 31 Oct). "We are blut." and the description sit
  left, the four portraits in a row below. Hovering a face (tapping it on
  touch screens, or focusing it by keyboard) greys out the others and swaps
  the text at the top for that person's name and role. Moving off (or
  tapping anywhere else) brings the description back. The order is shuffled
  on every visit, so nobody comes first (Nic, 31 Oct). A click opens the
  person's mail panel; on touch the first tap picks the face, the second opens it.

  The picked face (Elliot's idea, 3 Nov): the photo fades out and the person,
  cut out, stands in front of one of the site's moving patterns, each in
  their own colours. One cross-fade, nothing moves.
*/

// Pattern colours from the service banners: background, then the moving line.
const PEOPLE = getTeam()
  .filter((m) => m.showOnAbout)
  .map((m) => ({ name: m.name, role: m.role, file: m.file, mail: m.email, ...(TEAM_COLORS[m.key] ?? DEFAULT_TEAM_COLOR) }));

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
  const [mailOpen, setMailOpen] = useState<number | null>(null);
  const closeMail = useCallback(() => setMailOpen(null), []);
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
      <ul role="list" className={`bk-team-grid${people === PEOPLE ? "" : " is-shuffled"}`}>
        {people.map((p, i) => (
          <li key={p.file}>
            <button
              type="button"
              className={`bk-team-face${active === i ? " is-active" : ""}`}
              aria-label={`${p.name}, ${p.role}: email`}
              aria-expanded={mailOpen === i}
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
                const mouse = lastPointer.current === "mouse";
                if (mouse || active === i) {
                  setMailOpen((cur) => (cur === i ? null : i));
                  return;
                }
                // Mouse users already picked by hovering; taps toggle.
                if (!mouse) setActive((cur) => (cur === i ? null : i));
              }}
            >
              <span className="bk-team-visual" aria-hidden="true" style={{ backgroundColor: p.background, color: p.line }}>
                <CaseStudyVisual slug={`team-${p.file.toLowerCase()}`} {...patternAt(PEOPLE.indexOf(p))} />
              </span>
              <img className="bk-team-photo" src={`/images/team/${p.file}.webp`} alt="" loading="lazy" />
              <img className="bk-team-cutout" src={`/images/team/${p.file}-cutout.webp`} alt="" loading="lazy" />
            </button>
            {mailOpen === i && <MailPopup mail={p.mail} onClose={closeMail} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
