import { buildLegacyTheme } from "sanity";

/*
  The studio in blut's look: the site's font (PP Agrandir), black and white,
  blut red for main buttons, blut blue for focus and links. Light retheme only:
  Sanity's layout stays as it is.
*/

const BLUT = {
  black: "#000000",
  white: "#ffffff",
  red: "#fe0000",
  blue: "#6183ff",
  yellow: "#e7f639",
  grey: "#a3a3a3",
};

export const blutTheme = buildLegacyTheme({
  "--black": BLUT.black,
  "--white": BLUT.white,
  "--gray": BLUT.grey,
  "--gray-base": BLUT.grey,
  "--component-bg": BLUT.white,
  "--component-text-color": BLUT.black,
  "--brand-primary": BLUT.red,
  "--default-button-color": BLUT.grey,
  "--default-button-primary-color": BLUT.red,
  "--default-button-success-color": BLUT.blue,
  "--default-button-warning-color": BLUT.yellow,
  "--default-button-danger-color": BLUT.red,
  "--state-info-color": BLUT.blue,
  "--state-success-color": BLUT.blue,
  "--state-warning-color": BLUT.yellow,
  "--state-danger-color": BLUT.red,
  "--main-navigation-color": BLUT.black,
  "--main-navigation-color--inverted": BLUT.white,
  "--focus-color": BLUT.blue,
  "--font-family-base": "'PP Agrandir', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
});

/** Loads the site's font from the studio's own files (static/fonts), nothing from outside. */
export function BlutFonts() {
  return (
    <style>{`
      @font-face {
        font-family: 'PP Agrandir';
        src: url('/static/fonts/PPAgrandir-Regular.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
    `}</style>
  );
}

/** The full blut wordmark (never just the "b"), for the studio's top left. */
export function BlutLogo() {
  return (
    <svg viewBox="0 0 58 20" width="100%" height="100%" fill="currentColor" aria-label="blut" role="img">
      <path d="M25.3035 14.6042L26.7093 5.63867H31.1303L29.8468 13.8131C29.5208 15.7401 30.5191 16.876 32.4342 16.876C34.8382 16.876 36.6514 15.375 37.0181 13.022L38.1998 5.63867H42.6411L40.4205 19.5738H36.6107L36.5088 16.7949H36.4884C35.0827 18.803 32.8212 19.9794 30.132 19.9794C26.6074 19.9997 24.7535 17.951 25.3035 14.6042Z" />
      <path d="M19.3342 0.709939V19.574H23.796V0L19.3342 0.709939Z" />
      <path d="M10.6348 5.61866C7.82331 5.61866 5.52114 6.91684 4.4821 9.04665H4.46173V0L0 0.709939V19.5943H3.78941L4.40061 16.5923H4.42098C5.46002 18.7424 7.78256 20 10.5941 20C14.9743 20 17.908 17.1602 17.908 12.8195C17.908 8.4787 14.9743 5.61866 10.6348 5.61866ZM8.88271 16.6329C6.15271 16.6329 4.29874 15.0507 4.29874 12.8398C4.29874 10.6288 6.15271 9.04665 8.88271 9.04665C11.6127 9.04665 13.4667 10.6288 13.4667 12.8398C13.4667 15.0507 11.6127 16.6329 8.88271 16.6329Z" />
      <path d="M56.0874 14.6651C55.1502 15.9633 53.9686 16.6732 52.4202 16.6732C50.8719 16.6732 49.8532 15.7402 49.8532 14.0972V8.70164H56.0874V5.63876H49.8532V1.39941L45.3915 2.10935V5.63876H44.0876L43.5986 8.70164H45.3915L45.4118 14.8883C45.4118 18.0526 47.6325 19.9998 51.3404 19.9998C53.8871 19.9998 56.0263 19.0262 57.3913 17.2209L56.0874 14.6651Z" />
    </svg>
  );
}
