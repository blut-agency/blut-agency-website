"use client";

import { useId, useState } from "react";

export type AccordionItem = { title: string; body: string };

/**
 * Strategy FAQ list (Figma "FAQ Item v02"): title with a +/– after it, body
 * below. Each title is a real <button> with aria-expanded/aria-controls, so it
 * works with Tab + Enter/Space. Items open independently; the first one is
 * open on load (and without JavaScript).
 */
export default function Accordion({ items }: { items: AccordionItem[] }) {
  const base = useId();
  const [open, setOpen] = useState<boolean[]>(() => items.map((_, i) => i === 0));

  return (
    <div className="st-acc">
      {items.map((item, i) => {
        const btn = `${base}-btn-${i}`;
        const panel = `${base}-panel-${i}`;
        return (
          <div className="st-acc-item" key={item.title}>
            <h3 className="st-acc-heading">
              <button
                type="button"
                id={btn}
                className="st-acc-toggle"
                aria-expanded={open[i]}
                aria-controls={panel}
                onClick={() => setOpen((o) => o.map((v, j) => (j === i ? !v : v)))}
              >
                <span>{item.title}</span>
                <span className="st-acc-icon" aria-hidden="true">
                  {open[i] ? "–" : "+"}
                </span>
              </button>
            </h3>
            <div id={panel} role="region" aria-labelledby={btn} className="st-acc-panel" hidden={!open[i]}>
              <p>{item.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
