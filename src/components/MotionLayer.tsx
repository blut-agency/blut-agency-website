"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Site-wide motion, layered on top of the pages without touching their markup:
 *
 * - Smooth (inertia) scrolling via Lenis.
 * - Scroll reveals: media fades in, copy fades up, as each block enters view;
 *   in the new design, each card or row rises in as one piece (RISE_SELECTOR).
 * - The nav slides away while scrolling down and comes back on scroll up.
 * - Light parallax: big photos drift a little inside their frames, and blocks
 *   marked data-parallax (a rate, e.g. "0.4" or "1.2") move as wholes. Rates
 *   in one row share a sign, so cards drift the same way at different speeds
 *   and never against each other.
 *
 * Every effect is opt-out by default: nothing is hidden until this runs, so
 * without JavaScript the page simply shows, and reduced motion skips it all.
 * Pages are full document loads (see PageTransition), so this runs once per page.
 */

// Blocks that fade in (media) and blocks that fade up (copy).
const MEDIA_SELECTOR = [
  ".grid-item.is-media",
  ".network-image",
  ".media-frame",
  ".office-visual",
].join(",");

// "In" animation for the new-design blocks, after the headline letter reveal:
// each card or row rises into place as one piece, its photo and text moving
// together. Whatever enters view together goes in one after another. Styles:
// highlight.css (.fx-rise).
const RISE_SELECTOR = [
  ".lp-feature-row",
  ".lp-case",
  ".bk-spot",
  ".bk-service",
  ".lp-panel",
  ".bk-service-intro",
  ".bk-meta-grid",
  ".bk-contact-person",
  ".bk-lab-chapter",
  ".bk-lab-quote",
  ".bk-lab-loop",
  ".bk-lab-audio",
  ".bk-lab-awards",
].join(",");
const IN_SKIP = ".header, .lp-footer, .bk-hero, .lp-stage";
const IN_STAGGER_MS = 120;
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
    // Mouse and trackpad only: touch scrolling is native anyway, and on iOS
    // Safari Lenis fights the address bar resizing the page, which made the
    // page slide up and down on its own.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
      cleanups.push(() => lenis.destroy());
    }

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

    // New-design "in" animations. Each element is watched through its
    // parent: a fully masked element has no visible area, so the observer
    // would never see it arrive.
    const inTargets = new Map<Element, HTMLElement[]>();
    const inObserver = new IntersectionObserver(
      (entries) => {
        let k = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const el of inTargets.get(entry.target) ?? []) {
            el.style.animationDelay = `${k++ * IN_STAGGER_MS}ms`;
            el.classList.add("is-in");
          }
          inObserver.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    const tagIn = (selector: string, cls: string) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        // A card moves as one piece: nothing inside it animates on its own.
        if (el.closest(IN_SKIP) || el.parentElement?.closest(".fx-rise")) return;
        el.classList.add(cls);
        // A display: contents parent has no box of its own, so it never
        // intersects; watch the nearest ancestor that has one.
        let watched = el.parentElement ?? el;
        while (watched.parentElement && getComputedStyle(watched).display === "contents") watched = watched.parentElement;
        inTargets.set(watched, [...(inTargets.get(watched) ?? []), el]);
        inObserver.observe(watched);
      });
    };
    tagIn(RISE_SELECTOR, "fx-rise");
    cleanups.push(() => inObserver.disconnect());

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

    cleanups.push(startParallax());

    return () => {
      cleanups.forEach((fn) => fn());
      root.classList.remove("fx-on");
    };
  }, []);

  return null;
}

/*
  Parallax, kept small and the same everywhere. Each item's offset follows
  where it sits in the viewport: from +1 (just below the screen) to -1 (just
  above it).

  - Photos: any <img> whose own frame clips it and is at least 160px tall.
    The animated colour backgrounds (.visual-canvas) drift the same way.
    The photo is drawn 20% larger (see .fx-parallax-img) and shifts up to 9%
    of the frame height, so the frame edge never shows. Logos, nav, footer
    and the red stage are left alone.
  - Blocks: [data-parallax] elements shift up to 44px times their rate,
    measured on their parent so siblings at different rates stay in step.

  Uses the `translate` property, so hover transforms (zoom, scale) still
  apply on top. Photos are off below 768px wide, blocks below 992px (where
  grids stack and moving rows could overlap); MotionLayer already skips
  reduced motion.
*/
// The home offer tiles move as wholes instead (data-parallax), their photos
// fixed in the frame.
const PARALLAX_SKIP = ".lp-band, .header, .footer, .lp-footer, .section-home-stage, .lp-stage, .bk-offers";
const IMAGE_SHIFT = 0.09;
const BLOCK_SHIFT = 44;

type ParallaxItem = { el: HTMLElement; box: HTMLElement; rate: number; image: boolean };

function startParallax(): () => void {
  const root = document.documentElement;
  const wide = window.matchMedia("(min-width: 768px)");
  const blocksWide = window.matchMedia("(min-width: 992px)");
  const items: ParallaxItem[] = [];

  document.querySelectorAll<HTMLImageElement>(".main-wrapper img").forEach((img) => {
    const frame = img.parentElement;
    if (!frame || img.closest(PARALLAX_SKIP) || frame.clientHeight < 160) return;
    if (!/hidden|clip/.test(getComputedStyle(frame).overflowY)) return;
    img.classList.add("fx-parallax-img");
    items.push({ el: img, box: frame, rate: 1, image: true });
  });
  // The animated colour backgrounds (page headers, highlights, stages): the
  // moving shape drifts inside its coloured frame like a photo. It is a line
  // on a transparent ground, so no edge can show and it needs no scaling.
  document.querySelectorAll<HTMLElement>(".main-wrapper .visual-canvas").forEach((canvas) => {
    const frame = canvas.parentElement;
    if (!frame || canvas.closest(".lp-band, .footer, .lp-footer, .bk-offers")) return;
    items.push({ el: canvas, box: frame, rate: 1, image: true });
  });
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const rate = Number(el.dataset.parallax);
    if (el.parentElement && rate) items.push({ el, box: el.parentElement, rate, image: false });
  });
  if (items.length === 0) return () => {};

  // Only items near the screen are updated.
  const visible = new Set<ParallaxItem>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        for (const item of items) {
          if (item.box !== entry.target) continue;
          if (entry.isIntersecting) visible.add(item);
          else visible.delete(item);
        }
      }
      schedule();
    },
    { rootMargin: "25% 0px" },
  );
  new Set(items.map((item) => item.box)).forEach((box) => io.observe(box));

  let frame = 0;
  const update = () => {
    frame = 0;
    if (!wide.matches) return;
    const vh = window.innerHeight;
    for (const item of visible) {
      if (!item.image && !blocksWide.matches) continue;
      const r = item.box.getBoundingClientRect();
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / ((vh + r.height) / 2)));
      const y = item.image ? -p * IMAGE_SHIFT * r.height : p * item.rate * BLOCK_SHIFT;
      item.el.style.translate = `0 ${y.toFixed(1)}px`;
    }
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const onWidth = () => {
    root.classList.toggle("fx-parallax", wide.matches);
    items.forEach((item) => {
      if (!wide.matches || (!item.image && !blocksWide.matches)) item.el.style.translate = "";
    });
    schedule();
  };
  onWidth();
  wide.addEventListener("change", onWidth);
  blocksWide.addEventListener("change", onWidth);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);

  return () => {
    io.disconnect();
    cancelAnimationFrame(frame);
    wide.removeEventListener("change", onWidth);
    blocksWide.removeEventListener("change", onWidth);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    root.classList.remove("fx-parallax");
    items.forEach((item) => (item.el.style.translate = ""));
  };
}
