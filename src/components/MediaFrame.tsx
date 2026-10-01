const SPINNER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" class="spinner spinner">
  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.2"></circle>
  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none"></path>
</svg>`;

export function vimeoSrc(id: string, extra = "api=1&controls=0&loop=1&background=0&dnt=1") {
  return `https://player.vimeo.com/video/${id}?${extra}`;
}

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

/**
 * A 16:9 video slot for spots that have no case study page of their own.
 *
 * Without a `vimeoId` it shows the still from the Figma board with a quiet
 * "Video coming soon" label. With one, it renders the same player markup as
 * the case study videos, so embeds.js wires up play, progress and pause.
 */
export default function MediaFrame({
  id,
  poster,
  alt,
  vimeoId,
}: {
  /** Unique per page; embeds.js pairs the controls with the iframe through it. */
  id: string;
  poster: string;
  alt: string;
  vimeoId?: string;
}) {
  return (
    <div className="media-frame">
      <div className="video-16-9">
        <img src={poster} alt={alt} loading="lazy" className="fit-cover-absolute" />
        {vimeoId && (
          <iframe
            id={id}
            title={alt}
            src={vimeoSrc(vimeoId)}
            frameBorder="0"
            allow="autoplay"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          />
        )}
      </div>
      {vimeoId ? (
        <>
          <button
            data-player="play-button-big"
            data-player-target={id}
            aria-label="play and pause button"
            className="play-toggle-big"
          >
            <div data-player="play-text" className="text-block">
              Play
            </div>
          </button>
          <div className="project-video-controls">
            <div data-player-file={id} className="audioplayer-controls">
              <div data-player="progress-bar" className="progress-bar">
                <div className="progress-bar-line" />
                <div data-player="progress-fill" className="progress-bar-fill" />
              </div>
              <div className="progress-time">
                <div data-player="current-time" className="current-time">
                  0:00
                </div>
                <div data-player="duration" className="duration">
                  0:00
                </div>
              </div>
              <PlayerSpinnerButtons size="copy-medium" />
            </div>
          </div>
        </>
      ) : (
        <div className="project-video-controls media-frame-status">
          <div className="copy-small">Video coming soon</div>
        </div>
      )}
    </div>
  );
}
