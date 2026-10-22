"use client";

import { useEffect, useRef, useState } from "react";

/*
  About: the team (Figma 249:2029, hover state 249:1733). Four portraits
  slowly circle "We are blut." in the middle. Hovering a face (tapping it on
  touch screens) stops the circle, greys out the others and puts that
  person's name and role in the middle. Moving off (or tapping anywhere else)
  sets it moving again from where it stopped. One lap takes 90 seconds, slow
  enough to hit a face comfortably. Reduced motion: the portraits stand still.
*/

const PEOPLE = [
  { name: "Karl Jawara", role: "Creative Product & Campaign Lead", file: "Karl" },
  { name: "Timo Blunck", role: "CEO & Founder", file: "Timo" },
  { name: "Elliot Blunck", role: "Head of Video & Social Content", file: "Elliot" },
  { name: "Michael Robb", role: "Head of Audio Production", file: "Michael" },
];

const LAP_MS = 90_000;
// Ellipse the portrait centres travel on, in % of the stage (Figma: 800×620).
// Phones: a tighter circle so the (relatively larger) faces stay on screen.
const ORBIT = { wide: { rx: 40, ry: 37 }, phone: { rx: 34, ry: 38 } };
// Start where the Figma frame has them: Karl top, then clockwise.
const START = -Math.PI / 2 + 0.1;

export default function TeamOrbit({ intro }: { intro: string }) {
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  const faces = useRef<(HTMLButtonElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  // Safari's click events carry no pointer type, so remember it from pointerdown.
  const lastPointer = useRef<string>("mouse");
  const keyboardFocus = useRef(false);

  activeRef.current = active;

  // The circle: one angle for the whole group, advanced only while nobody is picked.
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = window.matchMedia("(max-width: 767px)");
    let angle = START;
    let last = performance.now();
    let frame = 0;
    const place = () => {
      const { rx, ry } = phone.matches ? ORBIT.phone : ORBIT.wide;
      faces.current.forEach((el, i) => {
        if (!el) return;
        const a = angle + (i * Math.PI * 2) / PEOPLE.length;
        el.style.left = `${50 + rx * Math.cos(a)}%`;
        el.style.top = `${50 + ry * Math.sin(a)}%`;
      });
    };
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      if (activeRef.current === null) angle += (dt / LAP_MS) * Math.PI * 2;
      place();
      frame = requestAnimationFrame(tick);
    };
    place();
    if (!still) frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Touch: a tap anywhere outside the faces lets them move again.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      if (!(e.target as Element).closest?.(".bk-team-face")) setActive(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const person = active === null ? null : PEOPLE[active];

  return (
    <div ref={stageRef} className={`bk-team${active === null ? "" : " has-active"}`}>
      <div className="bk-team-center" aria-live="polite">
        <div className={`bk-team-text${person ? "" : " is-shown"}`} aria-hidden={!!person}>
          <h1 className="lp-heading">We are blut.</h1>
          <p className="bk-team-intro">{intro}</p>
        </div>
        <div className={`bk-team-text${person ? " is-shown" : ""}`} aria-hidden={!person}>
          <p className="lp-heading">{person?.name ?? " "}</p>
          <p className="bk-team-role">{person?.role ?? " "}</p>
        </div>
      </div>
      {PEOPLE.map((p, i) => (
        <button
          key={p.file}
          ref={(el) => {
            faces.current[i] = el;
          }}
          type="button"
          className={`bk-team-face${active === i ? " is-active" : ""}`}
          aria-label={`${p.name}, ${p.role}`}
          aria-pressed={active === i}
          onPointerDown={(e) => {
            lastPointer.current = e.pointerType;
          }}
          onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
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
            sizes="(max-width: 767px) 30vw, 160px"
            alt=""
            loading="lazy"
          />
        </button>
      ))}
    </div>
  );
}
