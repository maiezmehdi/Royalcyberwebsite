/* ══════════════════════════════════════════════════════════
   ROYAL CYBER — Interactions & Motion
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine   = window.matchMedia('(pointer:fine)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const lerp = (a, b, n) => a + (b - a) * n;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ══════════════  INTRO LOADER  ══════════════ */
  window.addEventListener('load', () => {
    const intro = $('#intro');
    if (!intro) { document.body.classList.add('is-ready'); return; }
    setTimeout(() => {
      intro.classList.add('is-done');
      document.body.classList.add('is-ready');
    }, reduce ? 150 : 1900);
  });

  /* ── year ── */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ══════════════  KINETIC TYPOGRAPHY (split words)  ══════════════ */
  // Wraps each word in a masked span so it can slide up on reveal.
  const splitWords = (line) => {
    const nodes = Array.from(line.childNodes);
    line.textContent = '';
    let idx = 0;
    nodes.forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((tok) => {
          if (!tok.trim()) { line.appendChild(document.createTextNode(tok)); return; }
          const w = document.createElement('span'); w.className = 'kw';
          const i = document.createElement('span'); i.className = 'kw__i';
          i.textContent = tok; i.style.transitionDelay = (idx++ * 0.06) + 's';
          w.appendChild(i); line.appendChild(w); line.appendChild(document.createTextNode(' '));
        });
      } else {
        // keep inline element (e.g. <em>) as a single masked token
        const w = document.createElement('span'); w.className = 'kw';
        node.classList.add('kw__i'); node.style.transitionDelay = (idx++ * 0.06) + 's';
        w.appendChild(node); line.appendChild(w);
      }
    });
  };
  if (!reduce) $$('.hero__title .line:not(.line--rotate)').forEach((l) => { splitWords(l); l.classList.add('kinetic'); });

  /* ── rotating headline phrase ── */
  const rotator = $('#rotator');
  if (rotator && !reduce) {
    const phrases = ['NextGen Digital Solutions', 'Cloud. Modernization. Scale.', 'AI That Drives Impact'];
    let ri = 0;
    setInterval(() => {
      rotator.classList.add('is-out');
      setTimeout(() => {
        ri = (ri + 1) % phrases.length;
        rotator.textContent = phrases[ri];
        rotator.classList.remove('is-out');
      }, 500);
    }, 3200);
  }

  /* ══════════════  SCROLL REVEAL  ══════════════ */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const sibs = Array.from(e.target.parentElement.querySelectorAll(':scope > [data-reveal]'));
        const i = Math.max(0, sibs.indexOf(e.target));
        e.target.style.transitionDelay = ((i % 6) * 0.08) + 's';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal]').forEach((el) => io.observe(el));

  /* ══════════════  SCROLL PROGRESS BAR  ══════════════ */
  const bar = $('#progress');

  /* ══════════════  NAV: hide / condense  ══════════════ */
  const nav = $('#nav');
  let lastY = 0;

  /* ══════════════  MOBILE MENU  ══════════════ */
  const burger = $('#burger');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('.nav__links a, .nav__cta').forEach((a) =>
      a.addEventListener('click', () => {
        nav.classList.remove('is-open'); burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ══════════════  THEME TOGGLE (light / dark)  ══════════════ */
  const themeBtn = $('#themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const root = document.documentElement;
      const toLight = root.getAttribute('data-theme') !== 'light';
      root.setAttribute('data-theme', toLight ? 'light' : 'dark');
      try { localStorage.setItem('rc-theme', toLight ? 'light' : 'dark'); } catch (e) {}
    });
  }

  /* ══════════════  WHO WE ARE MEGA-MENU (click / touch)  ══════════════ */
  const whoTrigger = $('#whoTrigger');
  if (whoTrigger) {
    const item = whoTrigger.closest('.nav__item--drop');
    whoTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = item.classList.toggle('is-open');
      whoTrigger.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) { item.classList.remove('is-open'); whoTrigger.setAttribute('aria-expanded', 'false'); }
    });
    $$('.megamenu a', item).forEach((a) => a.addEventListener('click', () => {
      item.classList.remove('is-open');
      if (nav) { nav.classList.remove('is-open'); if (burger) burger.classList.remove('is-open'); }
    }));
  }

  /* ══════════════  FEATURED CASE STUDY CAROUSEL  ══════════════ */
  const csTrack = $('#csTrack');
  const csDots = $('#csDots');
  if (csTrack && csDots) {
    const slides = $$('.cs__slide', csTrack);
    let idx = 0, timer = null;
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'cs__dot' + (i === 0 ? ' is-active' : '');
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', 'Case study ' + (i + 1));
      d.addEventListener('click', () => { go(i); restart(); });
      csDots.appendChild(d);
    });
    const dots = $$('.cs__dot', csDots);
    const go = (i) => {
      idx = (i + slides.length) % slides.length;
      csTrack.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle('is-active', j === idx));
    };
    const restart = () => { if (reduce) return; clearInterval(timer); timer = setInterval(() => go(idx + 1), 6000); };
    restart();
  }

  /* ══════════════  COOKIE CONSENT  ══════════════ */
  const cookie = $('#cookie');
  if (cookie) {
    let choice = null;
    try { choice = localStorage.getItem('rc-cookie'); } catch (e) {}
    if (!choice) {
      setTimeout(() => cookie.classList.add('is-in'), 1400);
    }
    $$('[data-cookie]', cookie).forEach((btn) =>
      btn.addEventListener('click', () => {
        try { localStorage.setItem('rc-cookie', btn.dataset.cookie); } catch (e) {}
        cookie.classList.remove('is-in');
      })
    );
  }

  /* ══════════════  TOGGLES  ══════════════ */
  $$('[data-toggle]').forEach((t) =>
    t.addEventListener('click', () => t.classList.toggle('is-on'))
  );

  /* ══════════════  ANIMATED COUNTERS  ══════════════ */
  const runCount = (el) => {
    const raw = el.dataset.count;
    const target = parseFloat(raw);
    const suffix = el.dataset.suffix || '';
    const decimals = (raw.split('.')[1] || '').length;
    const fmt = (v) => v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    if (reduce) { el.textContent = fmt(target) + suffix; return; }
    const dur = 1700, start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { runCount(e.target); countIO.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countIO.observe(el));

  /* ══════════════  LIVE LINE CHART  ══════════════ */
  const buildChart = (wrap) => {
    const line = $('.chart__line', wrap);
    const area = $('.chart__area', wrap);
    const dot  = $('.chart__dot', wrap);
    const W = 520, H = 160, pad = 10, n = 12;
    const genPoints = () => {
      let v = 60;
      return Array.from({ length: n }, (_, i) => {
        v += (Math.random() - 0.42) * 26;
        v = Math.max(24, Math.min(H - pad, v));
        return [pad + (i * (W - pad * 2)) / (n - 1), H - v];
      });
    };
    const toPath = (pts) => {
      let d = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
        const cx = (x0 + x1) / 2;
        d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
      }
      return d;
    };
    const render = () => {
      const pts = genPoints(); const d = toPath(pts);
      line.setAttribute('d', d);
      area.setAttribute('d', `${d} L ${W - pad} ${H} L ${pad} ${H} Z`);
      const last = pts[pts.length - 1];
      dot.setAttribute('cx', last[0]); dot.setAttribute('cy', last[1]);
    };
    render();
    const chartIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          wrap.classList.add('is-live'); chartIO.unobserve(e.target);
          if (!reduce) setInterval(render, 3200);
        }
      });
    }, { threshold: 0.4 });
    chartIO.observe(wrap);
  };
  $$('[data-chart]').forEach(buildChart);

  /* ══════════════  SMOOTH INERTIA SCROLL (Lenis-style, native scrollTop)  ══════════════ */
  // Keeps native scroll semantics (IO / anchors / fixed) — just eases wheel input.
  let targetY = window.scrollY, currentY = targetY, scrolling = false, rafScroll = 0;
  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
  const scrollLoop = () => {
    currentY = lerp(currentY, targetY, 0.11);
    if (Math.abs(targetY - currentY) < 0.4) { currentY = targetY; scrolling = false; }
    window.scrollTo(0, currentY);
    if (scrolling) rafScroll = requestAnimationFrame(scrollLoop);
  };
  const smoothOn = fine && !reduce;
  if (smoothOn) {
    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey) return;                    // let pinch-zoom pass
      e.preventDefault();
      targetY = clamp(targetY + e.deltaY, 0, maxScroll());
      if (!scrolling) { scrolling = true; rafScroll = requestAnimationFrame(scrollLoop); }
    }, { passive: false });
    // keep target synced when scrolled by other means (keyboard, scrollbar, anchor)
    window.addEventListener('scroll', () => {
      if (!scrolling) { targetY = currentY = window.scrollY; }
    }, { passive: true });
    // smooth anchor jumps
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        targetY = clamp(t.getBoundingClientRect().top + window.scrollY - 90, 0, maxScroll());
        scrolling = true; cancelAnimationFrame(rafScroll); rafScroll = requestAnimationFrame(scrollLoop);
      });
    });
  }

  /* ══════════════  SCROLL-DRIVEN: progress · nav · parallax · aura  ══════════════ */
  const parallax = $$('[data-speed]');
  const blobs = $$('.aura__blob');
  const auraWrap = $('.aura');
  let vTarget = 0, vCurrent = 0;

  const onScrollFrame = () => {
    const s = window.scrollY;
    const max = maxScroll() || 1;

    if (bar) bar.style.transform = `scaleX(${clamp(s / max, 0, 1)})`;

    if (nav) {
      nav.classList.toggle('is-scrolled', s > 40);
      if (!nav.classList.contains('is-open')) {
        nav.classList.toggle('is-hidden', s > lastY && s > 480);
      }
    }

    // multi-speed parallax
    parallax.forEach((el) => {
      const sp = parseFloat(el.dataset.speed) || 0;
      el.style.transform = `translate3d(0, ${s * sp}px, 0)`;
    });

    // scroll-velocity → aura reacts (glowing trail feel)
    vTarget = clamp((s - lastY), -60, 60);
    lastY = s;
  };

  // continuous rAF: aura drifts with scroll velocity (glowing trail feel)
  const ambientLoop = () => {
    vCurrent = lerp(vCurrent, vTarget, 0.08);
    vTarget *= 0.9;
    if (auraWrap) auraWrap.style.transform = `translateY(${vCurrent * 1.6}px)`;
    requestAnimationFrame(ambientLoop);
  };

  window.addEventListener('scroll', onScrollFrame, { passive: true });
  onScrollFrame();
  if (!reduce) ambientLoop();

  if (reduce) return; // ── pointer-driven flourishes below ──

  /* ══════════════  CURSOR GLOW TRAIL  ══════════════ */
  const trail = $('#cursorTrail');
  if (trail && fine) {
    let tx = innerWidth / 2, ty = innerHeight / 2, cx = tx, cy = ty;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; trail.style.opacity = '1'; });
    const loop = () => {
      cx = lerp(cx, tx, 0.14); cy = lerp(cy, ty, 0.14);
      trail.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ══════════════  CARD TILT  ══════════════ */
  if (fine) $$('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ══════════════  MAGNETIC BUTTONS  ══════════════ */
  if (fine) $$('[data-magnetic], .btn--primary').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

})();
