import type { ReactNode } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getHomeSound } from "@/lib/content";

// The three left/right teaser cards below the intro. `_2-column-grid` auto-
// reverses on every 2nd item (see blut-dev.webflow.css), so this list
// renders media-left/text-right, text-left/media-right, media-left/text-right.
// Photos come from the Figma board's home page mockup.
const TEASERS: { heading: ReactNode; href: string; label: string; image: string; alt: string }[] = [
  {
    label: "Story",
    heading: "What do Nina Chuba, The Backstreet Boys and a secret lab in the Alps have in common?",
    href: "/story",
    image: "/images/home/teaser-story.jpg",
    alt: "Nina Chuba in the Samsung spot",
  },
  {
    label: "Sonic Performance Tracker",
    heading: "Where is your brand in the sonic branding landscape, and where do you want to be?",
    href: "/spt",
    image: "/images/home/teaser-spt.jpg",
    alt: "The Sonic Performance Tracker dashboard on a laptop",
  },
  {
    label: "Cases",
    image: "/images/home/teaser-cases.jpg",
    alt: "DJ Seinfeld and sogumm with the Hyundai Inster",
    heading: (
      <>
        Music production, sound design, and 360° sonic strategy.
        <br />
        <br />
        See us in action.
      </>
    ),
    href: "/case-studies",
  },
];

export default function HomePage() {
  const homeSound = getHomeSound();

  return (
    <>
<div className="main-wrapper">
    <section className="section-home-stage">
      <div data-sticky-on-scroll="trigger-in" className="navbar-bottom-sticky-trigger-in"></div>
      <div data-sticky-on-scroll="trigger-out" className="navbar-bottom-sticky-trigger-out"></div>
      <Header variant="start-bottom" />
      <div className="home-stage-wrapper">
              <div className="home-stage-top">
                <div className="full-width-logo">
                  <div className="logo-component"><span className="logo-svg" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 58 20" fill="none" class="logo-svg">
                      <path d="M25.3035 14.6042L26.7093 5.63867H31.1303L29.8468 13.8131C29.5208 15.7401 30.5191 16.876 32.4342 16.876C34.8382 16.876 36.6514 15.375 37.0181 13.022L38.1998 5.63867H42.6411L40.4205 19.5738H36.6107L36.5088 16.7949H36.4884C35.0827 18.803 32.8212 19.9794 30.132 19.9794C26.6074 19.9997 24.7535 17.951 25.3035 14.6042Z" fill="currentColor"></path>
                      <path d="M19.3342 0.709939V19.574H23.796V0L19.3342 0.709939Z" fill="currentColor"></path>
                      <path d="M10.6348 5.61866C7.82331 5.61866 5.52114 6.91684 4.4821 9.04665H4.46173V0L0 0.709939V19.5943H3.78941L4.40061 16.5923H4.42098C5.46002 18.7424 7.78256 20 10.5941 20C14.9743 20 17.908 17.1602 17.908 12.8195C17.908 8.4787 14.9743 5.61866 10.6348 5.61866ZM8.88271 16.6329C6.15271 16.6329 4.29874 15.0507 4.29874 12.8398C4.29874 10.6288 6.15271 9.04665 8.88271 9.04665C11.6127 9.04665 13.4667 10.6288 13.4667 12.8398C13.4667 15.0507 11.6127 16.6329 8.88271 16.6329Z" fill="currentColor"></path>
                      <path d="M56.0874 14.6651C55.1502 15.9633 53.9686 16.6732 52.4202 16.6732C50.8719 16.6732 49.8532 15.7402 49.8532 14.0972V8.70164H56.0874V5.63876H49.8532V1.39941L45.3915 2.10935V5.63876H44.0876L43.5986 8.70164H45.3915L45.4118 14.8883C45.4118 18.0526 47.6325 19.9998 51.3404 19.9998C53.8871 19.9998 56.0263 19.0262 57.3913 17.2209L56.0874 14.6651Z" fill="currentColor"></path>
                    </svg>` }} /></div>
                </div>
              </div>
              <div className="home-stage-bottom">
                <div data-player-file="home-stage-sound" className="audioplayer-controls">
                  <div className="player-toggle-button">
                    <div className="player-loading-spinner heading-style-h3">
                      <div className="player-loading-spinner-inner"><span className="spinner spinner" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 24 24" class="spinner spinner">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.2"></circle>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none"></path>
                        </svg>` }} /></div>
                    </div><button data-player="play-button" className="play-toggle">
                      <div className="play-toggle-text heading-style-h3">Click for sound</div>
                    </button><button data-player="pause-button" className="play-toggle is-pause-button">
                      <div className="play-toggle-text heading-style-h3">Pause</div>
                    </button>
                  </div>
                </div>
                <div className="audio-preview-embed hide w-embed w-iframe"><iframe className="" id="home-stage-sound" title="Play sound of blut" src={`https://player.vimeo.com/video/${homeSound?.vimeoId ?? ""}?api=1&controls=0&loop=1&background=0&dnt=1`} frameBorder="0" allow="autoplay" allowFullScreen style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', pointerEvents: 'none'}}></iframe></div><textarea data-visual-json="home-stage" data-visual-player="home-stage" className="visualization-json" defaultValue={homeSound?.visualizationJson ?? ""} />
              </div>
            </div>
            <div className="home-stage-visual-wrapper">
              <div className="home-stage-visual is-1">
                <div data-visual-start-on-play="false" data-visual-form="home-stage" data-visual-speed="8" data-visual-auto="true" data-visual-player="home-stage" className="visual-canvas">
                  <div data-visual-form-rotate="40%" data-visual-form-width="80%" className="visual-3-size">
                    <div data-visual-sound="base" className="form"><span className="visual-svg" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 1240 876" fill="none" data-visual-path="start" class="visual-svg">
                        <path d="M986.363 20.0661C853.155 16.9438 750.307 124.811 742.985 254.604C739.806 275.183 732.771 292.328 714.674 302.873C698.845 312.24 680.412 315.967 662.995 322.274C650.419 326.767 638.292 332.339 626.695 338.914C603.189 351.316 585.385 371.434 561.075 380.39C539.258 388.323 517.846 377.093 498.31 365.943C482.101 356.557 464.839 348.094 446.992 342.049C425.237 333.909 399.431 330.812 377.77 326.119C359.125 322.087 342.717 312.788 333.88 295.245C323.255 274.99 319.304 250.441 307.458 230.367C245.297 117.607 72.7474 126.856 30.0416 250.51C6.26774 317.35 25.156 388.597 81.9454 433.233C87.3732 438.374 92.396 443.541 96.5899 448.963C120.177 476.971 108.486 513.635 101.444 546.13C52.7001 802.948 389.23 965.354 559.978 768.833C570.161 759.902 582.188 752.08 593.648 749.058C613.702 743.193 634.933 750.909 654.326 758.288C789.13 814.235 954.918 719.124 973.482 573.514C975.265 562.427 976.835 552.188 980.175 541.836C986.924 519.774 1002.04 506.842 1023.73 498.709C1034.32 494.614 1044.97 491.753 1056.08 488.413C1307.98 411.227 1257.66 19.2061 986.5 20.0661H986.363Z" stroke="currentColor" class="visual-svg-path-large"></path>
                      </svg>` }} /></div>
                  </div>
                  <div data-visual-form-rotate="40%" data-visual-form-width="80%" className="visual-3-size">
                    <div data-visual-sound="high" className="form is-thin-line"><span className="visual-svg" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 1240 876" fill="none" data-visual-path="start" class="visual-svg">
                        <path d="M986.363 20.0661C853.155 16.9438 750.307 124.811 742.985 254.604C739.806 275.183 732.771 292.328 714.674 302.873C698.845 312.24 680.412 315.967 662.995 322.274C650.419 326.767 638.292 332.339 626.695 338.914C603.189 351.316 585.385 371.434 561.075 380.39C539.258 388.323 517.846 377.093 498.31 365.943C482.101 356.557 464.839 348.094 446.992 342.049C425.237 333.909 399.431 330.812 377.77 326.119C359.125 322.087 342.717 312.788 333.88 295.245C323.255 274.99 319.304 250.441 307.458 230.367C245.297 117.607 72.7474 126.856 30.0416 250.51C6.26774 317.35 25.156 388.597 81.9454 433.233C87.3732 438.374 92.396 443.541 96.5899 448.963C120.177 476.971 108.486 513.635 101.444 546.13C52.7001 802.948 389.23 965.354 559.978 768.833C570.161 759.902 582.188 752.08 593.648 749.058C613.702 743.193 634.933 750.909 654.326 758.288C789.13 814.235 954.918 719.124 973.482 573.514C975.265 562.427 976.835 552.188 980.175 541.836C986.924 519.774 1002.04 506.842 1023.73 498.709C1034.32 494.614 1044.97 491.753 1056.08 488.413C1307.98 411.227 1257.66 19.2061 986.5 20.0661H986.363Z" stroke="currentColor" class="visual-svg-path-thin"></path>
                      </svg>` }} /></div>
                  </div>
                  <div className="visual-3-size">
                    <div className="form is-end-scene"><span className="visual-svg" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 1240 858" fill="none" data-visual-path="end" class="visual-svg">
                        <path d="M978.671 207.503C964.531 207.49 950.397 208.689 936.469 211.112C914.932 214.376 896.72 223.044 876.212 218.311C851.526 211.269 843.809 178.792 834.129 156.879C743.451 -71.2421 372.886 4.03051 384.304 255.163C384.173 279.197 383.087 304.248 370.201 324.253C354.781 348.344 317.861 374.361 288.313 372.233C274.122 371.43 260.59 365.812 247.315 360.339C180.289 327.561 93.4005 349.404 49.0654 409.167C22.4531 444.468 14.1657 492.116 23.9964 534.912C37.0391 595.302 89.4544 643.396 149.988 653.715C176.33 658.266 205.32 654.807 227.729 670.349C238.463 677.366 248.269 689.405 255.829 701.043C365.528 914.828 707.749 867.412 751.319 628.588C754.117 615.106 755.302 604.397 759.361 592.465C764.223 578.348 772.316 583.633 780.026 591.103C791.206 602.106 801.124 615.306 813.935 627.12C914.487 722.34 1091.21 701.256 1173.63 592.785C1202.59 555.613 1218.35 507.011 1219.68 459.407C1226.76 324.096 1114.68 206.027 978.797 207.503H978.671Z" stroke="currentColor" stroke-width="40" class="visual-svg-path-large"></path>
                      </svg>` }} /></div>
                  </div>
                </div>
              </div>
              <div className="home-stage-visual is-2">
                <div data-visual-start-on-play="false" data-visual-form="home-stage" data-visual-speed="8" data-visual-auto="true" data-visual-player="home-stage" className="visual-canvas">
                  <div className="visual-2-size">
                    <div data-visual-sound="base" className="form"><span className="visual-svg" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 1240 827" fill="none" data-visual-path="start" class="visual-svg">
                        <path d="M1219.99 371.642C1220.24 343.603 1203.63 316.404 1178.23 304.434C1149.94 290.538 1117.13 296.436 1093.29 316.144C1072.14 332.36 1057.04 349.388 1028.4 340.691C1008.03 334.592 987.397 322.876 965.533 317.13C953.926 313.791 942.058 311.285 930.09 309.632C908.8 306.473 890.176 307.72 871.145 301.501C859.69 297.769 851.694 288.891 848.209 277.348C844.644 266.411 843.578 254.401 841.852 242.284C838.993 217.77 830.917 193.084 817.317 172.543C778.688 111.919 699.146 86.9655 632.204 112.419C618.497 117.351 605.59 125.175 592.996 132.027C580.995 138.392 568.188 144.657 555.327 142.87C535.143 140.118 519.231 119.257 504.971 105.347C342.787 -58.9888 60.9805 29.9341 23.998 258.673C-1.31006 402.274 96.2972 549.422 238.61 580.147C360.506 609.285 490.651 551.728 550.769 441.877C563.876 419.323 577.283 394.476 606.13 397.909C616.625 398.789 627.067 401.961 636.449 406.76C676.783 427.254 663.39 455.067 654.087 489.964C598.107 702.114 814.885 875.734 1010.45 778.1C1111.74 725.434 1159.97 618.803 1141.88 507.366C1140.87 495.016 1140.37 481.673 1146.05 470.429C1151.97 458.526 1163.56 450.921 1174.24 443.497C1184.79 436.272 1196.8 428.047 1204.95 417.024C1214.72 404.1 1220.02 387.945 1220 371.756V371.636L1219.99 371.642Z" stroke="currentColor" class="visual-svg-path-large"></path>
                      </svg>` }} /></div>
                  </div>
                  <div className="visual-2-size">
                    <div data-visual-sound="mid" className="form is-thin-line"><span className="visual-svg" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 1240 827" fill="none" data-visual-path="start" class="visual-svg">
                        <path d="M1219.99 371.642C1220.24 343.603 1203.63 316.404 1178.23 304.434C1149.94 290.538 1117.13 296.436 1093.29 316.144C1072.14 332.36 1057.04 349.388 1028.4 340.691C1008.03 334.592 987.397 322.876 965.533 317.13C953.926 313.791 942.058 311.285 930.09 309.632C908.8 306.473 890.176 307.72 871.145 301.501C859.69 297.769 851.694 288.891 848.209 277.348C844.644 266.411 843.578 254.401 841.852 242.284C838.993 217.77 830.917 193.084 817.317 172.543C778.688 111.919 699.146 86.9655 632.204 112.419C618.497 117.351 605.59 125.175 592.996 132.027C580.995 138.392 568.188 144.657 555.327 142.87C535.143 140.118 519.231 119.257 504.971 105.347C342.787 -58.9888 60.9805 29.9341 23.998 258.673C-1.31006 402.274 96.2972 549.422 238.61 580.147C360.506 609.285 490.651 551.728 550.769 441.877C563.876 419.323 577.283 394.476 606.13 397.909C616.625 398.789 627.067 401.961 636.449 406.76C676.783 427.254 663.39 455.067 654.087 489.964C598.107 702.114 814.885 875.734 1010.45 778.1C1111.74 725.434 1159.97 618.803 1141.88 507.366C1140.87 495.016 1140.37 481.673 1146.05 470.429C1151.97 458.526 1163.56 450.921 1174.24 443.497C1184.79 436.272 1196.8 428.047 1204.95 417.024C1214.72 404.1 1220.02 387.945 1220 371.756V371.636L1219.99 371.642Z" stroke="currentColor" class="visual-svg-path-thin"></path>
                      </svg>` }} /></div>
                  </div>
                  <div className="visual-2-size">
                    <div className="form is-end-scene"><span className="visual-svg" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 1240 875" fill="none" data-visual-path="end" class="visual-svg">
                        <path d="M1214.66 403.109C1214.82 359.556 1179.79 323.931 1136.13 323.861C1115 323.826 1094.57 331.462 1074.22 335.84C1055.29 340.205 1036.99 341.04 1017.42 338.987C1002.68 337.567 987.566 335.047 972.533 334.407C947.844 333.223 922.883 335.499 898.821 341.193C858.396 350.736 821.853 369.656 791.035 395.64C772.482 410.961 752.69 429.936 727.389 424.659C706.54 420.344 686.269 405.921 665.33 398.055C650.728 391.819 635.875 386.327 624.745 375.287C603.778 353.695 610.073 321.118 607.11 292.475C597.628 148.534 476.743 27.7723 332.248 20.5679C306.154 18.953 279.747 20.7837 254.174 26.0391C-3.93621 81.363 -65.6829 420.678 154.904 565.231C222.897 610.163 311.413 622.553 390.363 602.395C405.362 599.241 423.894 596.944 437.153 603.028C452.082 609.223 462.503 623.924 472.409 637.505C494.879 671.452 528.626 697.931 568.876 708.017C636.995 725.934 672.21 692.132 707.417 705.901C721.094 711.093 733.135 726.407 742.276 739.062C758.694 762.54 778.019 784.07 800.907 801.402C860.483 847.788 941.617 865.392 1015.45 848.993C1142.64 823.057 1232.9 697.276 1218.49 568.76C1216.1 540.771 1206.64 514.627 1205.93 486.93C1204.63 458.663 1214.44 431.453 1214.64 403.248V403.123L1214.66 403.109Z" stroke="currentColor" stroke-width="26" class="visual-svg-path-large"></path>
                      </svg>` }} /></div>
                  </div>
                </div>
              </div>
              <div className="visual-background-noise"></div>
            </div>
    </section>
    <section className="section-home-intro">
      <div className="intro-section-nav-white-backgorund"></div>
      <div className="page-padding">
        <div className="container-large">
          {/* 50/50 like the sections below: large question left, supporting copy right.
              Top spacing clears the nav bar that overlaps the start of this section. */}
          <div className="spacer-xl-start spacer-xxl-end">
            <div className="_2-column-grid">
              <div className="grid-item">
                <h2 className="heading-style-h1">Do you even know if your music strategy works?</h2>
              </div>
              <div className="grid-item">
                <div className="services-item-inner-content">
                  <div className="rich-text-custom w-richtext">
                    <p>blut creates unique music strategies - and makes their impact measurable. We not only develop striking music identities, we also provide data-driven analysis to prove their effectiveness and enhance their impact on your target audience.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="section-home-cases">
      <div role="list" className="home-project-teaser-item-list">
        {TEASERS.map((t) => (
          <div role="listitem" className="_2-column-grid cta-panel" key={t.href}>
            <div className="grid-item is-media">
              <img src={t.image} alt={t.alt} loading="lazy" className="fit-cover-absolute" />
              {/* The photo half links too; the visible CTA sits in the text half. */}
              <Link aria-hidden="true" tabIndex={-1} href={t.href} className="cta-link-full-cover w-inline-block" />
            </div>
            <div className="grid-item">
              <div className="grid-item-background-color" />
              <div className="text-color-grey">
                <div data-wf--box-inner-text--variant="big" className="item-inner">
                  <div className="item-top">
                    <h2 className="heading-style-h1">{t.heading}</h2>
                  </div>
                  <div className="item-bottom">
                    <div data-wf--cta-link--variant="bright-text" className="cta-link-component">
                      <Link
                        aria-hidden="true"
                        aria-label="Read more"
                        href={t.href}
                        className="cta-link-full-cover w-inline-block"
                      />
                      <Link aria-label="Read more" href={t.href} className="cta-link w-inline-block">
                        <div className="cta-link-line" />
                        <div className="cta-link-text">Read More</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    <section className="section-home-about">
      <div className="page-padding">
        <div className="container-large">
          {/* Same 50/50 treatment as the intro: label and question left, copy and button right. */}
          <div className="spacer-xl-start spacer-xxl-end">
            <div className="_2-column-grid">
              <div className="grid-item">
                <div className="eyebrow-wrapper">
                <div className="copy-small">About</div>
                <div data-wf--spacer--variant="sm" className="spacer-component w-variant-1ed5893b-149c-09fd-1a9e-43daba4600bc"></div>
              </div>
                <h2 className="heading-style-h1">Why do you need blut?</h2>
              </div>
              <div className="grid-item">
                <div className="services-item-inner-content">
                  <div className="rich-text-custom w-richtext">
                <p>We’re a full-service, music-led creative agency - from strategy to music production, artist collaborations to content creation - we do it all… and we measure the success of our work so you’ll <em>know</em> you’ve made the right call. </p>
              </div>
                  <div className="button-component">
                  <Link data-visual-speed="15" data-visual-form="button" href="/about" className="button w-inline-block"><span className="button-form" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 220 105" fill="none" data-visual-form-rotate="80%" data-visual-form-move-x="-20%" data-visual-form-move-y="-10%" class="button-form">
                      <path d="M46.1254 75.4987C20.0059 66.0511 2.35522 57.9396 4.83797 36.508C7.32072 15.0763 44.8821 21.0566 63.0105 12.297C92.3359 -1.8728 147.508 8.51107 168.616 13.1284C189.725 17.7456 212.528 20.1457 214.747 75.4854C216.3 114.217 172.282 98.801 155.891 88.2146C139.501 77.6281 127.73 75.1786 108.334 72.9316C79.03 69.5369 77.0438 86.6822 46.1254 75.4987Z" stroke="currentColor" class="button-form-path"></path>
                    </svg>` }} /><span className="button-form is-thin-line" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 220 105" fill="none" data-visual-form-rotate="80%" data-visual-form-move-x="-20%" data-visual-form-move-y="-10%" class="button-form is-thin-line">
                      <path d="M46.1254 75.4987C20.0059 66.0511 2.35522 57.9396 4.83797 36.508C7.32072 15.0763 44.8821 21.0566 63.0105 12.297C92.3359 -1.8728 147.508 8.51107 168.616 13.1284C189.725 17.7456 212.528 20.1457 214.747 75.4854C216.3 114.217 172.282 98.801 155.891 88.2146C139.501 77.6281 127.73 75.1786 108.334 72.9316C79.03 69.5369 77.0438 86.6822 46.1254 75.4987Z" stroke="currentColor" class="button-form-path is-highlight"></path>
                    </svg>` }} />
                    <div className="button-hover-background"></div>
                    <div className="button-text crop-line-height">Get to know us</div>
                  </Link>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
    </>
  );
}
