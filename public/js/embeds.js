function __onReady(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}


  __onReady(() => {
    const header = document.querySelector('[data-sticky-on-scroll="navigation"]');
    const triggerIn = document.querySelector('[data-sticky-on-scroll="trigger-in"]');
    const triggerOut = document.querySelector('[data-sticky-on-scroll="trigger-out"]');
    if (!header || !triggerIn || !triggerOut) return;
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const trigInRect = triggerIn.getBoundingClientRect();
          const trigOutRect = triggerOut.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          if (trigOutRect.top <= 0) {
            header.classList.remove('is-absolute');
            header.classList.add('is-sticky');
          } else if (trigInRect.top < windowHeight && trigInRect.bottom > 0) {
            header.classList.remove('is-sticky');
            header.classList.add('is-absolute');
          } else {
            header.classList.remove('is-sticky');
            header.classList.remove('is-absolute');
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });



(function(){
  // --- 1) Vimeo-Player UI ---
  window._VimeoPlayers = {};
  document.querySelectorAll('[data-player-file]').forEach(container => {
    const slug = container.getAttribute('data-player-file');
    const iframe = document.getElementById(slug);
    if (!iframe || !window.Vimeo) return;
    const player = new Vimeo.Player(iframe);
    window._VimeoPlayers[slug] = player;
    // Finde den play-button-big direkt über data-player-target
    const bigPlay = document.querySelector(`[data-player-target="${slug}"][data-player="play-button-big"]`);
    const playText = bigPlay ? bigPlay.querySelector('[data-player="play-text"]') : null;
    const playBtn = container.querySelector('[data-player="play-button"]');
    const pauseBtn = container.querySelector('[data-player="pause-button"]');
    const progBar = container.querySelector('[data-player="progress-bar"]');
    const progFill = container.querySelector('[data-player="progress-fill"]');
    const currTime = container.querySelector('[data-player="current-time"]');
    const durEl = container.querySelector('[data-player="duration"]');
    const spinner = container.querySelector('.player-loading-spinner');
    if (bigPlay && playBtn) playBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (spinner) spinner.style.display = 'none';
    player.ready().then(() => {
      player.on('play', () => {
        Object.entries(window._VimeoPlayers).forEach(([other,p])=>{
          if (other!==slug && p.pause) p.pause();
        });
        if (spinner) spinner.style.display = 'none';
      });
      if (bigPlay) {
        bigPlay.addEventListener('click', () => {
          if (spinner) spinner.style.display = 'block';
          player.getPaused().then(paused => {
            if (paused) {
              player.play().catch(e => {
                console.warn('Vimeo play error', e);
                if (spinner) spinner.style.display = 'none';
              });
              if (playText) playText.style.display = 'none';
              if (pauseBtn) pauseBtn.style.display = 'block';
            } else {
              player.pause();
              if (playText) playText.style.display = '';
              if (spinner) spinner.style.display = 'none';
            }
          }).catch(e => {
            console.warn('Vimeo getPaused error', e);
            if (spinner) spinner.style.display = 'none';
          });
        });
      }
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          if (spinner) spinner.style.display = 'block';
          player.play().catch(e => {
            console.warn('Vimeo play error', e);
            if (spinner) spinner.style.display = 'none';
          });
        });
      }
      if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
          player.pause();
          if (spinner) spinner.style.display = 'none';
        });
      }
      if (progBar) {
        progBar.addEventListener('click', e => {
          const r = progBar.getBoundingClientRect();
          const pct = (e.clientX - r.left)/r.width;
          player.getDuration().then(dur =>
            player.setCurrentTime(pct*dur).then(() => {
              player.play().catch(e => {
                console.warn('Vimeo play error after seek', e);
              });
            }).catch(e => {
              console.warn('Vimeo setCurrentTime error', e);
            })
          ).catch(e => {
            console.warn('Vimeo getDuration error', e);
          });
        });
      }
      player.getDuration().then(dur => {
        if (durEl) {
          const m = Math.floor(dur/60),
                s = String(Math.floor(dur%60)).padStart(2,'0');
          durEl.textContent = `${m}:${s}`;
        }
      });
      player.on('timeupdate', ({seconds,duration}) => {
        if (progFill) progFill.style.left = `${(seconds/duration)*100}%`;
        if (currTime) {
          const m = Math.floor(seconds/60),
                s = String(Math.floor(seconds%60)).padStart(2,'0');
          currTime.textContent = `${m}:${s}`;
        }
      });
      player.on('play', () => {
        if (playBtn) playBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'block';
        if (playText) playText.style.display = 'none';
        if (spinner) spinner.style.display = 'none';
      });
      player.on('pause', () => {
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (playBtn) playBtn.style.display = '';
        if (playText) playText.style.display = '';
        if (spinner) spinner.style.display = 'none';
      });
      player.on('error', e => {
        console.warn('Vimeo player error', e);
        if (spinner) spinner.style.display = 'none';
      });
    }).catch(e => console.warn('Vimeo ready error', e));
  });
  // --- 2) JSON-basierte Visualisierung (SOFORT START + Player-Sync) ---
  document.querySelectorAll('[data-visual-form]').forEach(form => {
    const slug = form.getAttribute('data-visual-form');
    const jsonEl = document.querySelector(`[data-visual-json="${slug}"]`);
    const isAuto = form.getAttribute('data-visual-auto') === 'true';
    const startOnPlay = form.getAttribute('data-visual-start-on-play') === 'true';
    if (!slug || !jsonEl) return;
    let data;
    try {
      data = JSON.parse(jsonEl.textContent);
    } catch (e) {
      console.warn(`Invalid JSON for "${slug}"`, e);
      return;
    }
    if (!Array.isArray(data) || data.length < 2) return;
    const hopDur = data[1].t - data[0].t;
    const svgBase = form.querySelectorAll('[data-visual-sound="base"]');
    const svgMid = form.querySelectorAll('[data-visual-sound="mid"]');
    const svgHigh = form.querySelectorAll('[data-visual-sound="high"]');
    const player = (() => {
      const ps = form.getAttribute('data-visual-player') || '';
      return ps.split(',').map(s => s.trim()).map(s => window._VimeoPlayers[s]).find(p => p) || null;
    })();
    let rafId;
    let isPlayerSync = false;
    function drawLoop(t) {
      const idx = Math.floor(t / hopDur);
      if (idx >= 0 && idx < data.length) {
        const amp = data[idx].a;
        const scale = 1 + amp * 0.5;
        svgBase.forEach(el => el.style.transform = `scale(${scale})`);
        svgMid.forEach(el => el.style.transform = `scale(${scale})`);
        svgHigh.forEach(el => el.style.transform = `scale(${scale})`);
      }
      rafId = requestAnimationFrame(() => {
        if (player && isPlayerSync) {
          player.getCurrentTime().then(drawLoop);
        } else if (!startOnPlay) {
          drawLoop((performance.now() / 1000) % (data.length * hopDur));
        }
      });
    }
    if (isAuto && !startOnPlay) {
      drawLoop(0);
    }
    if (player) {
      player.ready().then(() => {
        if (!isAuto && !startOnPlay) {
          player.getCurrentTime().then(drawLoop);
        }
        player.on('play', () => {
          cancelAnimationFrame(rafId);
          isPlayerSync = true;
          player.getCurrentTime().then(drawLoop);
        });
        player.on('pause', () => {
          cancelAnimationFrame(rafId);
          isPlayerSync = false;
          if (isAuto && !startOnPlay) {
            drawLoop((performance.now() / 1000) % (data.length * hopDur));
          }
        });
        player.on('seeked', () => {
          cancelAnimationFrame(rafId);
          isPlayerSync = true;
          player.getCurrentTime().then(drawLoop);
        });
      }).catch(e => console.warn('Vimeo player ready error', e));
    }
  });
  // --- 3) GSAP-Morphing & Form-Animation ---
  function initGSAP(){
    if (typeof gsap==='undefined' || typeof MorphSVGPlugin==='undefined'){
      return setTimeout(initGSAP,100);
    }
    gsap.registerPlugin(MorphSVGPlugin);
    document.querySelectorAll('[data-visual-form]').forEach(div=>{
      const speed = parseFloat(div.getAttribute('data-visual-speed'))||8;
      const startOnPlay = div.getAttribute('data-visual-start-on-play')==='true';
      const masterTl = startOnPlay
        ? gsap.timeline({ paused:true, repeat:-1, yoyo:true, defaults:{ duration:speed, ease:'power1.inOut' } })
        : null;
      const svgs = div.querySelectorAll('svg[data-visual-path]');
      const startPaths = Array.from(svgs)
        .filter(s=>s.getAttribute('data-visual-path')==='start')
        .map(s=>s.querySelector('path')).filter(p=>p);
      const endSvg = Array.from(svgs).find(s=>s.getAttribute('data-visual-path')==='end');
      const endPath = endSvg ? endSvg.querySelector('path') : null;
      if (endPath){
        startPaths.forEach(path=>{
          const cfg = { morphSVG:{ shape:endPath, shapeIndex:'auto' } };
          if (startOnPlay && masterTl) masterTl.to(path, cfg, 0);
          else gsap.to(path, { duration:speed, ...cfg, ease:'power1.inOut', repeat:-1, yoyo:true });
        });
      }
      const attrs = ['scale','rotate','move-x','move-y','width'];
      const els = [];
      if (attrs.some(a=>div.hasAttribute(`data-visual-form-${a}`))) els.push(div);
      els.push(...div.querySelectorAll(attrs.map(a=>`[data-visual-form-${a}]`).join(',')));
      els.forEach(el=>{
        const props = {
          scale: parseFloat(el.getAttribute('data-visual-form-scale'))||1,
          rotation: parseFloat(el.getAttribute('data-visual-form-rotate'))||0,
          x: el.getAttribute('data-visual-form-move-x')||'0%',
          y: el.getAttribute('data-visual-form-move-y')||'0%',
          width: el.getAttribute('data-visual-form-width')||'auto',
          transformOrigin:'center'
        };
        if (startOnPlay && masterTl) masterTl.to(el, props, 0);
        else gsap.to(el, { duration:speed, ...props, ease:'power1.inOut', repeat:-1, yoyo:true });
      });
      if (startOnPlay && masterTl){
        const pSlug = div.getAttribute('data-visual-player');
        const p = pSlug ? window._VimeoPlayers[pSlug] : null;
        if (p){
          p.on('play', ()=>masterTl.play());
          p.on('pause', ()=>masterTl.pause());
          p.on('seeked', ()=>masterTl.pause());
        }
      }
    });
  }
  initGSAP();
})();


gsap.registerPlugin(MorphSVGPlugin);


  // Funktion für die Fade-In-Animation
  function fadeInMainWrapper() {
    const mainWrapper = document.querySelector(".main-wrapper");
    if (!mainWrapper) return;
    if (typeof gsap !== "undefined") {
      // Setze opacity auf 0 (falls nicht bereits durch CSS gesetzt)
      gsap.set(mainWrapper, { opacity: 0 });
      // Führe GSAP Fade-In-Animation aus
      gsap.fromTo(
        mainWrapper,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            mainWrapper.classList.add("is-visible"); // Sicherstellen, dass die Klasse bleibt
          }
        }
      );
    } else {
      // Fallback: Setze is-visible direkt, wenn GSAP nicht verfügbar ist
      mainWrapper.classList.add("is-visible");
    }
  }
  // Beim Laden der Seite
  window.addEventListener("pageshow", (event) => {
    // Führe Fade-In aus, wenn nicht aus dem bfcache geladen
    if (!event.persisted) {
      fadeInMainWrapper();
    } else {
      // Für bfcache: Stelle sicher, dass die Seite sichtbar ist
      const mainWrapper = document.querySelector(".main-wrapper");
      if (mainWrapper && typeof gsap !== "undefined") {
        gsap.set(mainWrapper, { opacity: 1 });
        mainWrapper.classList.add("is-visible");
      } else if (mainWrapper) {
        mainWrapper.classList.add("is-visible");
      }
    }
  });
  // Click-Handler für Links
  __onReady(() => {
    const links = document.querySelectorAll("a");
    links.forEach(link => {
      const href = link.getAttribute("href");
      const isTransitionLink = link.hasAttribute("data-page-transition") && link.getAttribute("data-page-transition") === "link";
      const noTransition = link.hasAttribute("data-no-transition") && link.getAttribute("data-no-transition") === "true";
      if (
        href &&
        !noTransition &&
        !link.classList.contains("no-transition") &&
        !href.startsWith("#") &&
        href !== window.location.pathname &&
        (isTransitionLink || href.startsWith("/") || new URL(href, window.location.origin).hostname === window.location.hostname)
      ) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          if (typeof gsap !== "undefined") {
            gsap.to(".main-wrapper", {
              opacity: 0,
              duration: 0.5,
              onComplete: () => {
                window.location.href = href;
              }
            });
          } else {
            window.location.href = href; // Fallback ohne GSAP
          }
        });
      }
    });
  });
  // Popstate-Event für Zurück-Button
  window.addEventListener("popstate", () => {
    fadeInMainWrapper();
  });



  __onReady(() => {
    // Finde alle Accordion-Listen
    const accordionLists = document.querySelectorAll('[data-accordion="list"]');
    accordionLists.forEach((list) => {
      // Finde alle Checkboxes innerhalb dieser Liste
      const checkboxes = list.querySelectorAll('[data-accordion="checkbox"]');
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            // Deaktiviere alle anderen Checkboxes innerhalb derselben Liste
            checkboxes.forEach((otherCheckbox) => {
              if (otherCheckbox !== checkbox) {
                otherCheckbox.checked = false;
              }
            });
          }
        });
      });
    });
  });
