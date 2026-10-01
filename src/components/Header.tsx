"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/strategy", label: "Strategy" },
  { href: "/case-studies", label: "Cases" },
  { href: "/about", label: "About" },
];

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 58 20" fill="none" class="logo-svg">
  <path d="M25.3035 14.6042L26.7093 5.63867H31.1303L29.8468 13.8131C29.5208 15.7401 30.5191 16.876 32.4342 16.876C34.8382 16.876 36.6514 15.375 37.0181 13.022L38.1998 5.63867H42.6411L40.4205 19.5738H36.6107L36.5088 16.7949H36.4884C35.0827 18.803 32.8212 19.9794 30.132 19.9794C26.6074 19.9997 24.7535 17.951 25.3035 14.6042Z" fill="currentColor"></path>
  <path d="M19.3342 0.709939V19.574H23.796V0L19.3342 0.709939Z" fill="currentColor"></path>
  <path d="M10.6348 5.61866C7.82331 5.61866 5.52114 6.91684 4.4821 9.04665H4.46173V0L0 0.709939V19.5943H3.78941L4.40061 16.5923H4.42098C5.46002 18.7424 7.78256 20 10.5941 20C14.9743 20 17.908 17.1602 17.908 12.8195C17.908 8.4787 14.9743 5.61866 10.6348 5.61866ZM8.88271 16.6329C6.15271 16.6329 4.29874 15.0507 4.29874 12.8398C4.29874 10.6288 6.15271 9.04665 8.88271 9.04665C11.6127 9.04665 13.4667 10.6288 13.4667 12.8398C13.4667 15.0507 11.6127 16.6329 8.88271 16.6329Z" fill="currentColor"></path>
  <path d="M56.0874 14.6651C55.1502 15.9633 53.9686 16.6732 52.4202 16.6732C50.8719 16.6732 49.8532 15.7402 49.8532 14.0972V8.70164H56.0874V5.63876H49.8532V1.39941L45.3915 2.10935V5.63876H44.0876L43.5986 8.70164H45.3915L45.4118 14.8883C45.4118 18.0526 47.6325 19.9998 51.3404 19.9998C53.8871 19.9998 56.0263 19.0262 57.3913 17.2209L56.0874 14.6651Z" fill="currentColor"></path>
</svg>`;

export default function Header({ variant = "start-top" }: { variant?: "start-top" | "start-bottom" }) {
  const pathname = usePathname();

  return (
    <div
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
              const isCurrent = pathname === link.href || pathname.startsWith(link.href + "/");
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
          <div
            className="navbar-mobile-toggle w-nav-button"
            style={{ userSelect: "text" }}
            aria-label="menu"
            role="button"
            tabIndex={0}
            aria-controls="w-nav-overlay-0"
            aria-haspopup="menu"
            aria-expanded="false"
          >
            <div className="w-icon-nav-menu" />
          </div>
        </div>
        <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0" />
      </div>
    </div>
  );
}
