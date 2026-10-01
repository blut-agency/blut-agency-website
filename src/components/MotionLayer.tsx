"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Site-wide motion, layered on top of the pages without touching their markup:
 *
 * - Smooth (inertia) scrolling via Lenis.
 * - Scroll reveals: media fades in, copy fades up, as each block enters view.
 * - The nav slides away while scrolling down and comes back on scroll up.
 *
 * Every effect is opt-out by default: nothing is hidden until this runs, so
 * without JavaScript the page simply shows, and reduced motion skips it all.
 * Pages are full document loads (see PageTransition), so this runs once per page.
 */

// Blocks that fade in (media) and blocks that fade up (copy).
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
    // Each one is watched through its parent box, so a block that starts
    // hidden still reveals as soon as its section scrolls into view.
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

    return () => {
      cleanups.forEach((fn) => fn());
      root.classList.remove("fx-on");
    };
  }, []);

  return null;
}
