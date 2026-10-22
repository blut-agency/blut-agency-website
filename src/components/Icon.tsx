/*
  Line icons with square ends, from IBM's Carbon icon set (carbon-design-
  system/carbon, Apache License 2.0, https://www.apache.org/licenses/LICENSE-2.0),
  32×32 grid, paths copied as published. Play and pause are drawn on the same
  grid in the same square style (Carbon's own have rounded corners).
  They take the text colour.
*/

const PATHS = {
  "arrow-right": "M18 6L16.57 7.393 24.15 15 4 15 4 17 24.15 17 16.57 24.573 18 26 28 16 18 6z",
  "arrow-up-right": "M10 6L10 8 22.59 8 6 24.59 7.41 26 24 9.41 24 22 26 22 26 6 10 6z",
  "chevron-down": "M16 22L6 12 7.4 10.6 16 19.2 24.6 10.6 26 12z",
  close:
    "M17.4141 16L24 9.4141 22.5859 8 16 14.5859 9.4143 8 8 9.4141 14.5859 16 8 22.5859 9.4143 24 16 17.4141 22.5859 24 24 22.5859 17.4141 16z",
  add: "M17 15L17 8 15 8 15 15 8 15 8 17 15 17 15 24 17 24 17 17 24 17 24 15z",
  subtract: "M8 15H24V17H8z",
  menu: "M4 6H28V8H4zM4 24H28V26H4zM4 12H28V14H4zM4 18H28V20H4z",
  download: "M26 24v4H6V24H4v6H28V24zM26 14L24.59 12.59 17 20.17 17 2 15 2 15 20.17 7.41 12.59 6 14 16 24 26 14z",
  play: "M8 5V27L27 16z",
  pause: "M9 6H14V26H9zM18 6H23V26H18z",
} as const;

export type IconName = keyof typeof PATHS;
export const ICON_NAMES = Object.keys(PATHS) as IconName[];

export default function Icon({ name, size = 24, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className ? `bk-icon ${className}` : "bk-icon"}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
