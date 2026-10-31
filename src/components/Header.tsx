"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

const NAV_LINKS = [
  { href: "/production", label: "Production" },
  { href: "/strategy", label: "Strategy" },
  { href: "/post", label: "Post" },
  { href: "/case-studies", label: "Cases" },
  { href: "/about", label: "About" },
];

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 58 20" fill="none" class="logo-svg">
  <path d="M25.3035 14.6042L26.7093 5.63867H31.1303L29.8468 13.8131C29.5208 15.7401 30.5191 16.876 32.4342 16.876C34.8382 16.876 36.6514 15.375 37.0181 13.022L38.1998 5.63867H42.6411L40.4205 19.5738H36.6107L36.5088 16.7949H36.4884C35.0827 18.803 32.8212 19.9794 30.132 19.9794C26.6074 19.9997 24.7535 17.951 25.3035 14.6042Z" fill="currentColor"></path>
  <path d="M19.3342 0.709939V19.574H23.796V0L19.3342 0.709939Z" fill="currentColor"></path>
  <path d="M10.6348 5.61866C7.82331 5.61866 5.52114 6.91684 4.4821 9.04665H4.46173V0L0 0.709939V19.5943H3.78941L4.40061 16.5923H4.42098C5.46002 18.7424 7.78256 20 10.5941 20C14.9743 20 17.908 17.1602 17.908 12.8195C17.908 8.4787 14.9743 5.61866 10.6348 5.61866ZM8.88271 16.6329C6.15271 16.6329 4.29874 15.0507 4.29874 12.8398C4.29874 10.6288 6.15271 9.04665 8.88271 9.04665C11.6127 9.04665 13.4667 10.6288 13.4667 12.8398C13.4667 15.0507 11.6127 16.6329 8.88271 16.6329Z" fill="currentColor"></path>
  <path d="M56.0874 14.6651C55.1502 15.9633 53.9686 16.6732 52.4202 16.6732C50.8719 16.6732 49.8532 15.7402 49.8532 14.0972V8.70164H56.0874V5.63876H49.8532V1.39941L45.3915 2.10935V5.63876H44.0876L43.5986 8.70164H45.3915L45.4118 14.8883C45.4118 18.0526 47.6325 19.9998 51.3404 19.9998C53.8871 19.9998 56.0263 19.0262 57.3913 17.2209L56.0874 14.6651Z" fill="currentColor"></path>
</svg>`;

const isCurrentPage = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

/** Two lines that turn into an X while the menu is open. */
function BurgerButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`bk-burger${open ? " is-open" : ""}`}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="bk-menu"
      onClick={onClick}
    >
      <span />
      <span />
    </button>
  );
}

/**
 * Phones: the links move into a full-screen menu, the logo across the top and
 * the pages as large links. Rendered into <body> because the sticky header
 * moves itself (is-tucked), which would carry a fixed overlay with it.
 * Focus stays inside while open; Escape, the X or a link close it.
 */
function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  // false while rendering on the server, true in the browser: the portal needs <body>.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    burgerRef.current?.querySelector("button")?.focus();
  }

  // Keep Tab inside the menu: from the last control back to the first and the other way round.
  function trapTab(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const items = menuRef.current?.querySelectorAll<HTMLElement>("a, button");
    if (!items?.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div ref={burgerRef} className="bk-burger-slot">
      <BurgerButton open={open} onClick={() => setOpen(true)} />
      {mounted &&
        createPortal(
          <div
            ref={menuRef}
            id="bk-menu"
            className={`bk-menu${open ? " is-open" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            inert={!open}
            data-lenis-prevent=""
            onKeyDown={trapTab}
          >
            <div className="bk-menu-top">
              <BurgerButton open onClick={close} />
            </div>
            <div className="bk-menu-body">
              <Link href="/" className="bk-menu-logo" aria-label="Go to homepage" onClick={() => setOpen(false)}>
                <span dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
              </Link>
              <ul role="list" className="bk-menu-list">
                {NAV_LINKS.map((link) => {
                  const isCurrent = isCurrentPage(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link href={link.href} aria-current={isCurrent ? "page" : undefined} onClick={() => setOpen(false)}>
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

const isClear = (color: string) => color === "transparent" || /^rgba\(.*,\s*0\)$/.test(color);

/**
 * The fixed bar takes the colours of what lies under it: over a banner it is
 * clear and takes the banner's text colour, elsewhere the first background
 * found under its middle (left edge, where the section's own ground shows)
 * and that area's text colour. Repainted on scroll and resize.
 */
function useMatchArea(pathname: string) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const y = header.getBoundingClientRect().height / 2;
      const hit = document.elementsFromPoint(2, y).find((el) => !header.contains(el));
      const banner = hit?.closest<HTMLElement>(".bk-hero, .lp-stage");
      let bg = "";
      let ink = "";
      if (banner) {
        bg = "transparent";
        // Home's stage sets its text colour one level down.
        ink = getComputedStyle(banner.querySelector(".home-stage-wrapper") ?? banner).color;
      } else {
        for (let el = hit ?? null; el; el = el.parentElement) {
          const style = getComputedStyle(el);
          if (isClear(style.backgroundColor)) continue;
          bg = style.backgroundColor;
          ink = style.color;
          break;
        }
      }
      header.style.setProperty("--nav-bg", bg || null);
      header.style.setProperty("--nav-ink", ink || null);
      header.classList.toggle("is-over-stage", !!banner?.classList.contains("lp-stage"));
    };
    const queue = () => {
      frame ||= requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [pathname]);

  return ref;
}

export default function Header({ variant = "start-top" }: { variant?: "start-top" | "start-bottom" }) {
  const pathname = usePathname();
  const ref = useMatchArea(pathname);

  return (
    <div
      ref={ref}
      data-sticky-on-scroll="navigation"
      data-wf--header--variant={variant}
      className={variant === "start-bottom" ? "header w-variant-c250e457-0eed-d5a6-c281-222d78605d03" : "header"}
    >
      <div
        data-animation="default"
        data-collapse="none"
        data-duration="400"
        data-easing="ease"
        data-easing2="ease"
        role="banner"
        className="navbar w-nav"
      >
        <div className="navbar-inner">
          <Link
            aria-label="Go to homepage"
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`nav-logo-link w-nav-brand${pathname === "/" ? " w--current" : ""}`}
          >
            <div
              className="logo-component"
              dangerouslySetInnerHTML={{ __html: LOGO_SVG }}
            />
          </Link>
          <nav role="navigation" className="navbar-menu-wrapper w-nav-menu">
            {NAV_LINKS.map((link) => {
              const isCurrent = isCurrentPage(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`navbar-link w-inline-block${isCurrent ? " w--current" : ""}`}
                >
                  <div>{link.label}</div>
                </Link>
              );
            })}
          </nav>
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </div>
  );
}
