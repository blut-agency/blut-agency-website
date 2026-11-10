"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const CARDS = ".hl-row, .lp-hover, .lp-case, .bk-spot, .lp-feature-row";

/**
 * Touch screens have no hover, so the card in the middle of the viewport gets
 * it instead: `.is-centered` while it crosses the centre band (the touch rules
 * at the end of highlight.css, landing.css and blocks.css mirror every card
 * :hover rule), plus `centerenter` / `centerleave` events for HoverClip.
 * Does nothing with a mouse. Mounted once in the layout; re-scans per page.
 */
export default function CenterHover() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    const set = (el: Element, on: boolean) => {
      if (el.classList.contains("is-centered") === on) return;
      el.classList.toggle("is-centered", on);
      el.dispatchEvent(new Event(on ? "centerenter" : "centerleave"));
    };
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => set(entry.target, entry.isIntersecting)),
      // A band through the middle of the screen, 20% of its height.
      { rootMargin: "-40% 0px -40% 0px" },
    );
    const cards = [...document.querySelectorAll(CARDS)];
    cards.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      cards.forEach((el) => set(el, false));
    };
  }, [pathname]);

  return null;
}
