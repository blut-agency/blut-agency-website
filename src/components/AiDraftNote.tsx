/**
 * Note for placeholder copy written by AI (Oct 2026): sits above it on the
 * page (hidden for now), and the copy itself carries the `ai-draft` class
 * (an asterisk after it, globals.css).
 * Remove both once the real copy is in.
 */
export default function AiDraftNote({ children }: { children?: React.ReactNode }) {
  return (
    <p className="ai-draft-note" role="note">
      {children ?? "AI-generated placeholder copy. Everything in red on this page was written by AI and must be replaced before launch."}
    </p>
  );
}
