"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Crossfade between pages, matching the Webflow site: the wrapper fades in over
 * 0.3s on arrival and out over 0.5s before leaving.
 *
 * `.main-wrapper` starts at `opacity: 0` (see globals.css), so the fade-in is
 * just adding `.is-visible` once the new page has mounted.
 *
 * Like the Webflow original, every internal link is a full document load:
 * public/js/embeds.js wires up the sound players and the moving gradient
 * shapes once per load, so after a client-side route change they stayed
 * frozen (and the homepage showed "Click for sound" and "Pause" together).
 */

const FADE_OUT_MS = 500;

export default function PageTransition() {
  const pathname = usePathname();

  // Fade the new page in — runs again on every route change.
  useEffect(() => {
    const wrapper = document.querySelector(".main-wrapper");
    if (!wrapper) return;
    wrapper.classList.remove("is-leaving");
    // Next frame, so the browser sees opacity:0 first and actually transitions.
    const id = requestAnimationFrame(() => wrapper.classList.add("is-visible"));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Back/forward can restore a page from the browser cache mid fade-out; show it again.
  useEffect(() => {
    function onPageShow(event: PageTransitionEvent) {
      if (!event.persisted) return;
      const wrapper = document.querySelector(".main-wrapper");
      wrapper?.classList.remove("is-leaving");
      wrapper?.classList.add("is-visible");
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  // Fade the current page out before following an internal link.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      // Let the browser handle modified clicks (new tab, download, …).
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.hasAttribute("download") || anchor.hasAttribute("data-no-transition")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      // Same page (or only a hash away) — nothing to transition to.
      if (url.pathname === window.location.pathname) return;

      const wrapper = document.querySelector(".main-wrapper");
      if (!wrapper) return;

      // Capture phase, so we get in before next/link's own click handler —
      // it is registered during hydration and would otherwise navigate
      // client-side immediately, skipping the fade and the script re-run.
      event.preventDefault();
      event.stopPropagation();
      wrapper.classList.add("is-leaving");
      window.setTimeout(() => window.location.assign(url.pathname + url.search + url.hash), FADE_OUT_MS);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
