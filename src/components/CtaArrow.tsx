/** Thin up-right arrow at the end of a CTA row; shown on hover (highlight.css). */
export default function CtaArrow() {
  return (
    <svg
      className="cta-arrow"
      aria-hidden="true"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 23 23 9M11 9h12v12" />
    </svg>
  );
}
