"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { animate, motion, useMotionValue, useSpring } from "motion/react";
import "lenis/dist/lenis.css";

/**
 * Site-wide motion, layered on top of the pages without touching their markup:
 *
 * - Smooth (inertia) scrolling via Lenis.
 * - Scroll reveals: media wipes up, copy fades up, as each block enters view.
 * - The nav slides away while scrolling down and comes back on scroll up.
 * - Buttons and CTA links lean towards the pointer ("magnetic").
 * - A cursor label ("Play" / "View") follows the pointer over media.
 *
 * Every effect is opt-out by default: nothing is hidden until this runs, so
 * without JavaScript the page simply shows, and reduced motion skips it all.
 * Pages are full document loads (see PageTransition), so this runs once per page.
 */

// Blocks that wipe in (clip from the bottom) and blocks that fade up.
const MEDIA_SELECTOR = [
  ".grid-item.is-media",
  ".video-spot-media",
  ".case-card-media",
  ".network-image",
  ".media-frame",
  ".content-placeholder",
  ".office-visual",
].join(",");
const COPY_SELECTOR = [
  ".rich-text-custom",
  ".copy-medium",
  ".cta-link-component",
  ".button-component",
  ".accordion-component",
  ".fx-index",
].join(",");
const MAGNETIC_SELECTOR = ".button, .cta-link, .navbar-link";

export default function MotionLayer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("fx-on");
    const cleanups: (() => void)[] = [];

    // Smooth scrolling. Accordions and lazy images change the page height;
    // Lenis watches for that itself.
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
    cleanups.push(() => lenis.destroy());

    // Scroll reveals. Elements nested inside another target reveal with it.
    // A fully clipped element never counts as intersecting, so each one is
    // watched through its parent box instead.
    const revealOf = new Map<Element, HTMLElement[]>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          revealOf.get(entry.target)?.forEach((el) => el.classList.add("is-in"));
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    const tag = (selector: string, cls: string) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        if (el.parentElement?.closest(".fx-media, .fx-copy, .footer")) return;
        el.classList.add(cls);
        const watched = el.parentElement ?? el;
        revealOf.set(watched, [...(revealOf.get(watched) ?? []), el]);
        observer.observe(watched);
      });
    };
    tag(MEDIA_SELECTOR, "fx-media");
    tag(COPY_SELECTOR, "fx-copy");
    cleanups.push(() => observer.disconnect());

    // Nav hides on the way down, returns on the way up (and near the top).
    const header = document.querySelector<HTMLElement>(".header");
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (header) {
        const goingDown = y > lastY + 4;
        const goingUp = y < lastY - 4;
        if (goingDown && y > 240) header.classList.add("is-tucked");
        else if (goingUp || y < 240) header.classList.remove("is-tucked");
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    // Magnetic buttons, pointer devices only.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>(MAGNETIC_SELECTOR).forEach((el) => {
        const strength = el.classList.contains("button") ? 0.3 : 0.15;
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          animate(
            el,
            { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength },
            { type: "spring", stiffness: 300, damping: 20, mass: 0.5 },
          );
        };
        const leave = () => animate(el, { x: 0, y: 0 }, { type: "spring", stiffness: 200, damping: 15 });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    return () => {
      cleanups.forEach((fn) => fn());
      root.classList.remove("fx-on");
    };
  }, []);

  return <CursorLabel />;
}

/** "Play" over video stills, "View" over linked media; follows the pointer with a spring. */
function CursorLabel() {
  const [label, setLabel] = useState<string | null>(null);
  // Keeps the last text while the label scales out.
  const [text, setText] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    document.documentElement.classList.add("fx-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target instanceof Element ? e.target : null;
      const show = (next: string) => {
        setLabel(next);
        setText(next);
      };
      if (target?.closest(".video-hover")) show("Play");
      else if (target?.closest(".cta-panel .is-media, .case-card-media, .case-card .cta-link-full-cover, .cta-panel > .grid-item.is-media"))
        show("View");
      else setLabel(null);
    };
    const onLeave = () => setLabel(null);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("fx-cursor");
    };
  }, [x, y]);

  return (
    <motion.div
      className="fx-cursor-label"
      aria-hidden="true"
      style={{ x: springX, y: springY }}
      animate={{ scale: label ? 1 : 0, opacity: label ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <span>{text}</span>
    </motion.div>
  );
}
