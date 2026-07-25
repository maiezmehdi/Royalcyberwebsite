# Royal Cyber — Landing Page

A high-end, futuristic B2B landing page for **Royal Cyber**, a Digital
Transformation & AI agency. Dark-mode elegance with liquid violet gradients,
glassmorphism, kinetic typography, and smooth 60fps motion.

## ✨ Highlights

- **Dark-mode aesthetic** — deep black canvas (`#0B0B0E`) with softly blooming
  violet/purple gradient auras (`#5B21B6`, `#2E1065`).
- **Typography** — geometric display (Syne), italic serif accents (Fraunces),
  clean body (Inter). Giant kinetic hero headings.
- **Glassmorphism UI** — rounded dark glass cards with backdrop blur, glossy
  reflections, purple borders, and soft drop shadows.
- **Intro sequence** — sacred-geometry / AI-network node logo drawing in and
  morphing into a liquid mesh glow.
- **Interactive Bento grid** — real-time data badges (+94% Efficiency,
  +82% Automation), the **Dimitri AI** avatar, live SVG line chart, and
  pill toggles.
- **Motion** — smooth inertia scrolling, kinetic per-word hero reveal, a
  scroll-progress bar, multi-speed parallax (grid + floating particles),
  scroll-velocity-reactive aura, magnetic buttons, idle-floating badges/avatar,
  animated counters, card 3D tilt, cursor glow trail, and a keyword marquee.
  The intro logo draws in as sacred geometry and morphs into a liquid mesh glow.
- **Real Royal Cyber content** — hero ("Transform Your Business with NextGen
  Digital Solutions"), technology partners (Salesforce, Azure, AWS, ServiceNow,
  …), service pillars, products/accelerators, industries, and company stats
  (est. 2002, 800+ experts, 600+ clients, 1500+ projects).
- **Dual audience sections** — *For Enterprise Leaders* and *For Commerce &
  Tech Teams*.
- **Kinetic footer** — glowing `hello@royalcyber.com`, social links, and giant
  gradient **ROYAL CYBER** brand typography.
- Fully **responsive** with a mobile glass nav, and respects
  `prefers-reduced-motion`.

## 🗂 Structure

```
index.html          # markup for all sections
assets/styles.css   # design system, glassmorphism, animations, responsive
assets/script.js    # reveal, counters, live chart, tilt, nav, cursor trail
```

## 🚀 Run

No build step — it's a static site. Open `index.html`, or serve locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Fonts load from Google Fonts (with system-font fallbacks); everything else is
self-contained.
