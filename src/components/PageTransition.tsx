"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Crossfade between pages, matching the Webflow site: the wrapper fades in over
 * 0.3s on arrival and out over 0.5s before leaving.
 *
 * `.main-wrapper` starts at `opacity: 0` (see globals.css), so the fade-in is
 * just adding `.is-visible` once the new page has mounted. The Webflow original
 * did a full document load on every link; here we keep Next's client-side
 * routing and only delay the push long enough to play the outgoing fade.
 */

const FADE_OUT_MS = 500;

export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();

  // Fade the new page in — runs again on every route change.
  useEffect(() => {
    const wrapper = document.querySelector(".main-wrapper");
    if (!wrapper) return;
    wrapper.classList.remove("is-leaving");
    // Next frame, so the browser sees opacity:0 first and actually transitions.
    const id = requestAnimationFrame(() => wrapper.classList.add("is-visible"));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

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
      // immediately, skipping the fade.
      event.preventDefault();
      event.stopPropagation();
      wrapper.classList.add("is-leaving");
      window.setTimeout(() => router.push(url.pathname + url.search + url.hash), FADE_OUT_MS);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
