"use client";

import { useState } from "react";
import RevealText from "@/components/RevealText";
import Button from "@/components/Button";

/** RevealText with a button that plays the letter reveal again (remounts it). */
export default function ReplayReveal({ text }: { text: string }) {
  const [run, setRun] = useState(0);
  return (
    <div className="cs-replay">
      <RevealText key={run} className="lp-heading" text={text} />
      <Button variant="outline" shape="pill" size="sm" onClick={() => setRun((n) => n + 1)}>
        Replay
      </Button>
    </div>
  );
}
