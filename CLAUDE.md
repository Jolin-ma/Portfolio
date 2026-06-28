# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Jolin Ma's personal portfolio. There are **two parallel implementations** — the active one is the standalone HTML file.

| File / Folder | Status | Served by |
|---|---|---|
| `portfolio.html` | **Active** — primary version | VS Code Live Server (port 5500) |
| `portfolio-app/` | Secondary — Next.js scaffold | `npm run dev` (port 3000) |

**Always edit `portfolio.html` unless the user explicitly asks about the Next.js app.**

## portfolio.html — Architecture

Single self-contained file: all CSS is in `<style>`, all JS is in a `<script>` block at the bottom. No build step.

### Section order (top → bottom)
1. **Nav** — fixed, white text, transparent background
2. **Hero** — full-viewport, `portfolio.png` as hero image (`object-fit: contain`), scrolling marquee name, location badge, tagline
3. **About** — white bg, bio text, interactive hover links (Skills / Experience / Projects / UI/UX / Motion)
4. **Work** — white bg, contains the Skills feature cards (`id="skills"`) inside Project One slot, plus Project Two and Three gradient cards
5. **Contact** — dark bg, email + LinkedIn + GitHub links
6. **Footer** — darker bg

### Design tokens (CSS custom properties in `:root`)
```
--color-dark: #1C1D20      --color-blue: #455CE9
--color-gray: #999D9E      --color-lightgray: #E9EAEB
--container-padding: 6vw   --section-padding: 12vh
--animation-fast: all .3s cubic-bezier(.7, 0, .3, 1)
```
Hero background is `#6A6C6B` (sampled from `portfolio.png`).

### Key JS behaviours (bottom `<script>` block)
- **Letter-wrap**: on load, splits `.hover-link-heading` text into `<span class="hl-letter">` per character with staggered `transition-delay` for the spring animation.
- **Spring image tracker**: `mousemove` + `requestAnimationFrame` lerp (factor 0.12) moves the floating preview image inside each `.hover-link`.
- **Scroll reveal**: `IntersectionObserver` adds `.visible` to `.feature-card` elements when they enter the viewport.

### Anchor targets
`#about`, `#work`, `#contact`, `#skills` (inside the work section on the Project One card)

## portfolio-app/ — Next.js App

Only needed if adding React components that can't be done in vanilla JS.

### Commands
```bash
cd portfolio-app
npm run dev      # dev server → http://localhost:3000
npm run build    # production build
npm run lint     # eslint
npx tsc --noEmit # type-check only
```

### Stack
- Next.js 16 (App Router), React 19, TypeScript 5
- Tailwind CSS v4 (config via `src/app/globals.css`, no `tailwind.config.js`)
- shadcn (`components.json` style: `base-nova`, aliases: `@/components/ui`, `@/lib`)
- `motion` (not `framer-motion`) — import from `"motion/react"`
- `lucide-react` for icons

### Adding shadcn components
```bash
npx shadcn@latest add <component>
```
Components land in `src/components/ui/`. Custom components go there too.

### Portfolio-specific tokens (globals.css)
```
--p-dark: #1c1d20    --p-blue: #455ce9
--p-gray: #999d9e    --p-container: 6vw
```
Marquee animation is defined as `.animate-marquee` in `globals.css`.

### Key files
- `src/app/page.tsx` — full portfolio page (client component, `"use client"`)
- `src/app/layout.tsx` — DM Sans font, metadata
- `src/components/ui/interactive-hover-links.tsx` — hover link rows with motion spring tracking
- `public/portfolio.png` — hero photo (same file as root `portfolio.png`)
