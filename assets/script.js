/* ══════════════════════════════════════════════════════════
   ROYAL CYBER — Interactions & Motion
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ── Intro loader ── */
  window.addEventListener('load', () => {
    const intro = $('#intro');
    if (!intro) return;
    setTimeout(() => {
      intro.classList.add('is-done');
      document.body.classList.add('is-ready');
    }, reduce ? 200 : 2600);
  });

  /* ── Current year ── */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ── Scroll reveal ── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // stagger siblings for kinetic feel
        setTimeout(() => e.target.classList.add('is-in'), (i % 4) * 90);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal]').forEach((el) => io.observe(el));

  /* ── Nav: hide-on-scroll-down, condense on scroll ── */
  const nav = $('#nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const cy = window.scrollY;
    if (nav) {
      nav.classList.toggle('is-scrolled', cy > 40);
      if (!nav.classList.contains('is-open')) {
        nav.classList.toggle('is-hidden', cy > lastY && cy > 400);
      }
    }
    lastY = cy;
  }, { passive: true });

  /* ── Mobile menu ── */
  const burger = $('#burger');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('.nav__links a, .nav__cta').forEach((a) =>
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ── Toggles ── */
  $$('[data-toggle]').forEach((t) =>
    t.addEventListener('click', () => t.classList.toggle('is-on'))
  );

  /* ── Animated counters ── */
  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = target + suffix; return; }
    const dur = 1600, start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
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

  /* ── Live line chart (self-contained SVG) ── */
  const buildChart = (wrap) => {
    const svg = $('.chart__svg', wrap);
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
      // smooth cubic through points
      let d = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
        const cx = (x0 + x1) / 2;
        d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
      }
      return d;
    };

    const render = () => {
      const pts = genPoints();
      const d = toPath(pts);
      line.setAttribute('d', d);
      area.setAttribute('d', `${d} L ${W - pad} ${H} L ${pad} ${H} Z`);
      const last = pts[pts.length - 1];
      dot.setAttribute('cx', last[0]);
      dot.setAttribute('cy', last[1]);
    };

    render();
    const chartIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          wrap.classList.add('is-live');
          chartIO.unobserve(e.target);
          if (!reduce) setInterval(render, 3200); // subtle live updates
        }
      });
    }, { threshold: 0.4 });
    chartIO.observe(wrap);
  };
  $$('[data-chart]').forEach(buildChart);

  if (reduce) return; // skip pointer-driven effects

  /* ── Cursor glow trail ── */
  const trail = $('#cursorTrail');
  if (trail && window.matchMedia('(pointer:fine)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY; trail.style.opacity = '1';
    });
    const loop = () => {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      trail.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ── Card tilt on pointer ── */
  $$('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── Parallax grid overlay on scroll (blobs keep their float keyframes) ── */
  const grid = $('.aura__grid');
  const hero = $('#hero');
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (grid) grid.style.transform = `translateY(${s * 0.15}px)`;
    if (hero && s < window.innerHeight) hero.style.setProperty('--hy', `${s * 0.2}px`);
  }, { passive: true });

})();
