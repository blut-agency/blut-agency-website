"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/*
  Line balancing across the site (Nic, 11 Nov: "no jagged texts"). Every
  heading and paragraph that runs over more than one line gets the narrowest
  width that keeps its number of lines, so all its lines come out about the
  same length. CSS text-wrap (globals.css) does this only for short texts in
  Chrome, and Safari's "pretty" only fixes a paragraph's last line, so it's
  done here, the same in every browser. Re-runs when a text's container
  changes width, when web fonts arrive and on every page. Mounted once in the
  layout. A text can opt out with data-no-balance.
*/

const TEXTS = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "blockquote", "figcaption", "dd", ".reveal-line",
]
  .map((tag) => `${tag}:not(.reveal-text, .sr-only, [data-no-balance] *, [data-no-balance])`)
  .join(", ");

/** Long texts barely change and cost the most layout work: left as they are. */
const MAX_LINES = 16;

function isBalanceable(el: HTMLElement) {
  const style = getComputedStyle(el);
  if (!["block", "flow-root", "list-item"].some((d) => style.display.startsWith(d))) return false;
  if (style.whiteSpace === "nowrap" || style.whiteSpace === "pre") return false;
  // Only plain running text: nothing inside may be a block of its own.
  for (const child of el.children) {
    if (child.tagName === "BR" || child.tagName === "WBR") continue;
    const d = getComputedStyle(child).display;
    if (!d.startsWith("inline") && d !== "contents" && d !== "none") return false;
  }
  return Boolean(el.textContent?.trim());
}

/** The smallest width that keeps the text's line count. */
function balance(el: HTMLElement) {
  el.style.maxWidth = "";
  el.style.marginInline = "";
  if (!isBalanceable(el)) return;
  const height = el.offsetHeight;
  const full = el.clientWidth;
  const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
  if (!full || !lineHeight || height < lineHeight * 1.5 || height > lineHeight * MAX_LINES) return;
  let lo = 0;
  let hi = full;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    el.style.maxWidth = `${mid}px`;
    if (el.offsetHeight > height) lo = mid;
    else hi = mid;
  }
  if (hi >= full) {
    el.style.maxWidth = "";
    return;
  }
  el.style.maxWidth = `${hi}px`;
  // Centred or right-aligned text stays where it was.
  const align = getComputedStyle(el).textAlign;
  if (align === "center") el.style.marginInline = "auto";
  else if (align === "right" || align === "end") el.style.marginLeft = "auto";
}

export default function LineBalance() {
  const pathname = usePathname();

  useEffect(() => {
    // Each text's container width when it was last balanced: the text's own
    // narrowing never changes it, so balancing can't trigger itself.
    const widths = new WeakMap<HTMLElement, number>();
    const containers = new Map<Element, Set<HTMLElement>>();

    const resize = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.round(entry.contentRect.width);
        containers.get(entry.target)?.forEach((el) => {
          if (widths.get(el) === width) return;
          widths.set(el, width);
          balance(el);
        });
      }
    });

    const scan = () => {
      document.querySelectorAll<HTMLElement>(TEXTS).forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        let set = containers.get(parent);
        if (!set) {
          set = new Set();
          containers.set(parent, set);
          resize.observe(parent);
        }
        if (set.has(el)) return;
        set.add(el);
        widths.set(el, Math.round(parent.getBoundingClientRect().width));
        balance(el);
      });
    };

    const rebalanceAll = () => {
      containers.forEach((set) => set.forEach(balance));
    };

    scan();
    // Web fonts change word widths without changing any box.
    document.fonts?.ready.then(rebalanceAll);

    // Texts added later (drawers, lightboxes, the welcome card).
    let queued = 0;
    const mutations = new MutationObserver(() => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        scan();
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      resize.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(queued);
    };
  }, [pathname]);

  return null;
}
