const SPINNER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" class="spinner spinner">
  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.2"></circle>
  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none"></path>
</svg>`;

/** Play/pause toggle with loading spinner; `public/js/embeds.js` drives it via the data-player attributes. */
export function PlayerSpinnerButtons({ size }: { size: "copy-medium" | "heading-style-h2" }) {
  return (
    <div className="player-toggle-button">
      <div className={`player-loading-spinner ${size}`}>
        <div className="player-loading-spinner-inner" dangerouslySetInnerHTML={{ __html: SPINNER_SVG }} />
      </div>
      <button data-player="play-button" className="play-toggle">
        <div className={`play-toggle-text ${size}`}>Play</div>
      </button>
      <button data-player="pause-button" className="play-toggle is-pause-button">
        <div className={`play-toggle-text ${size}`}>Pause</div>
      </button>
    </div>
  );
}
