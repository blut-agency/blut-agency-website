import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import Icon, { type IconName } from "@/components/Icon";

/*
  Buttons (styles: blocks.css, .bk-btn). Two shapes (rectangle, pill), two
  variants (solid, outline), three sizes on the spacing scale (32, 48, 64px
  tall). With `href` it renders a link, otherwise a <button>. Icon-only
  buttons are square (or round, as a pill) and need an aria-label. On black
  sections the colours invert by themselves; `onDark` does the same elsewhere.
*/

type Common = {
  variant?: "solid" | "outline";
  shape?: "rect" | "pill";
  size?: "sm" | "md" | "lg";
  icon?: IconName;
  /** Icon before the label instead of after it. */
  iconFirst?: boolean;
  /** Light-on-dark colours outside a black section (over photos, overlays). */
  onDark?: boolean;
  /**
   * Hover colours taken from the surrounding content (a spot's highlight, a
   * case's colour): background and the text colour that reads on it. Inside a
   * hover teaser (.hl-row) the button also takes them while the teaser is hovered.
   */
  accent?: { background: string; text: string };
  children?: ReactNode;
  className?: string;
};

const ICON_SIZE = { sm: 16, md: 16, lg: 24 } as const;

export default function Button({
  variant = "solid",
  shape = "rect",
  size = "md",
  icon,
  iconFirst = false,
  onDark = false,
  accent,
  children,
  className,
  href,
  ...rest
}: Common & { href?: string } & Omit<ComponentProps<"button">, "children" | "className">) {
  const iconOnly = Boolean(icon) && !children;
  const cls = [
    "bk-btn",
    `is-${variant}`,
    `is-${shape}`,
    `is-${size}`,
    iconOnly ? "is-icon-only" : "",
    onDark ? "is-on-dark" : "",
    accent ? "is-accent" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  const style = accent
    ? ({ "--bk-btn-accent": accent.background, "--bk-btn-accent-fg": accent.text } as CSSProperties)
    : undefined;
  const glyph = icon && <Icon name={icon} size={ICON_SIZE[size]} />;
  const inner = (
    <>
      {iconFirst && glyph}
      {children && <span className="bk-btn-label">{children}</span>}
      {!iconFirst && glyph}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} style={style} aria-label={rest["aria-label"]}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} style={style} {...rest}>
      {inner}
    </button>
  );
}
