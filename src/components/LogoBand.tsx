/**
 * A full-width strip of repeating blut wordmarks scrolling sideways over a
 * moving texture. Pure CSS (see landing.css): the track holds two identical
 * runs of logos and slides by exactly one run, so the loop is seamless.
 * Without JavaScript it still scrolls; with reduced motion it stands still.
 * Decorative only, so it's hidden from screen readers.
 */
const LOGO_PATHS = [
  "M25.3035 14.6042L26.7093 5.63867H31.1303L29.8468 13.8131C29.5208 15.7401 30.5191 16.876 32.4342 16.876C34.8382 16.876 36.6514 15.375 37.0181 13.022L38.1998 5.63867H42.6411L40.4205 19.5738H36.6107L36.5088 16.7949H36.4884C35.0827 18.803 32.8212 19.9794 30.132 19.9794C26.6074 19.9997 24.7535 17.951 25.3035 14.6042Z",
  "M19.3342 0.709939V19.574H23.796V0L19.3342 0.709939Z",
  "M10.6348 5.61866C7.82331 5.61866 5.52114 6.91684 4.4821 9.04665H4.46173V0L0 0.709939V19.5943H3.78941L4.40061 16.5923H4.42098C5.46002 18.7424 7.78256 20 10.5941 20C14.9743 20 17.908 17.1602 17.908 12.8195C17.908 8.4787 14.9743 5.61866 10.6348 5.61866ZM8.88271 16.6329C6.15271 16.6329 4.29874 15.0507 4.29874 12.8398C4.29874 10.6288 6.15271 9.04665 8.88271 9.04665C11.6127 9.04665 13.4667 10.6288 13.4667 12.8398C13.4667 15.0507 11.6127 16.6329 8.88271 16.6329Z",
  "M56.0874 14.6651C55.1502 15.9633 53.9686 16.6732 52.4202 16.6732C50.8719 16.6732 49.8532 15.7402 49.8532 14.0972V8.70164H56.0874V5.63876H49.8532V1.39941L45.3915 2.10935V5.63876H44.0876L43.5986 8.70164H45.3915L45.4118 14.8883C45.4118 18.0526 47.6325 19.9998 51.3404 19.9998C53.8871 19.9998 56.0263 19.0262 57.3913 17.2209L56.0874 14.6651Z",
];

const PER_RUN = 12;

function Logo() {
  return (
    <svg className="lp-band-logo" viewBox="0 0 58 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {LOGO_PATHS.map((d) => (
        <path key={d.slice(0, 12)} d={d} />
      ))}
    </svg>
  );
}

export type BandColors = {
  /** Band background (the page header's background). */
  background: string;
  /** The soft moving strokes (the header's line colour). */
  line: string;
  /** Dark logos on a light background; white otherwise. */
  light?: boolean;
};

export default function LogoBand({
  theme = "brown-yellow",
  colors,
  reverse = false,
}: {
  /** One of the case-study colour themes: background is its secondary colour, the soft strokes its main colour. */
  theme?: "brown-yellow" | "blue-violet" | "red-pink";
  /** Custom colours instead of a theme, e.g. to match the page header. */
  colors?: BandColors;
  reverse?: boolean;
}) {
  const run = Array.from({ length: PER_RUN }, (_, i) => <Logo key={i} />);
  return (
    <div
      className={`lp-band is-${theme}${reverse ? " is-reverse" : ""}`}
      aria-hidden="true"
      style={
        colors && {
          ["--lp-band-bg" as string]: colors.background,
          ["--lp-band-line" as string]: colors.line,
          color: colors.light ? "var(--_color---copy-dark)" : "var(--_color---copy-bright)",
        }
      }
    >
      <div className="lp-band-texture" />
      <div className="lp-band-track">
        <div className="lp-band-run">{run}</div>
        <div className="lp-band-run">{run}</div>
      </div>
    </div>
  );
}
