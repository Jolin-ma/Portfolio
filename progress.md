# Portfolio Build — Progress Notes

Single-file site at `index.html`. Built with Tailwind (CDN/JIT), all sizing in `vw` units
(fluid, no breakpoints), design tokens in a `:root` CSS block matching the original Figma
export. Reference screenshots live in `C:\Users\jolin\Pictures\Screenshots\`.

## How to preview
```
node serve.js
```
Then open **http://localhost:8123/** — the Chrome extension can't load `file://` URLs
directly, so this local server is the way to view it live. `shot.js` / `measure.js` /
`check-mobile.js` are throwaway diagnostic scripts from earlier verification passes (safe
to ignore or delete).

## Done today

- **Header** (bar + ruler + clock): bar rescaled to match `menu.png` 1:1. Ruler ticks/numbers
  drift horizontally on mouse move (`#ruler-track`, mousemove listener near bottom of
  `<script>`). Clock is real-time, black. Menu panel (`#menu-panel`) opens/closes via
  `#menu-toggle`, matches `menu open.png`.
- **Hero**: rebuilt to match `name.png`. "JOLIN" set in `font-pixel` (Pixelify Sans, matches
  Featured Works heading — was Chewy/bubble before, changed on request). Two sticky-note
  tags ("Computer Programming Student" / "Front-End Developer & Software Developer" — user's
  own copy edits) float with a slow drift animation (`.float-a` / `.float-b` keyframes).
  "PRODUCT DESIGNER" and "LOCATED OSHAWA,CANADA,ON" tags float around the name with arrow
  accents pointing back at them (fixed direction + `right-full`/`left-full` positioning so
  they clear the name text regardless of tag content length). Two avatar bubbles are real
  map-pin shapes (`border-radius: 50% 50% 50% 0` + `rotate(-45deg)` trick) using the real
  photo (`image/me.png`), each with a hover tooltip styled as a chat bubble ("hello my
  friend" / "nice to meet you", via `.group` + `group-hover`). A live "YOU" cursor follows
  the real mouse pointer site-wide, styled as an octagon + label — **see the dedicated
  entry further down for the detach/contrast rework**, this original single-div version is
  superseded.
- **About section**: rebuilt to match `about me.png`. Copy restored ("about me!", "what's
  up" — these had been overwritten by an earlier edit collision). Inline photo + two custom
  icons (gold diamond-pinwheel, pink spool) in the intro paragraph. Polaroid captions "2026"
  / "my workspace", first polaroid uses the real photo. Skills row rebuilt to the reference's
  actual 4-tag + 4-icon-box layout and colors (dashed diamond pinwheel, sunburst, eye, dot
  scatter) with distinct animations added afterward (spin / pulse / blink / twinkle —
  see `icon-spin` etc. keyframes near the top of `<style>`).
- **Featured Works section**: rebuilt to match `featured.png`. "explore my work!" (Architects
  Daughter + double-underline, same pattern as hero's "my name is"), "FEATURED WORKS" in
  `font-pixel`, note box copy updated. Sized up/down a couple of times per feedback — current
  state is the full/original size.
- **Projects 01–04, corrected**: earlier in this session I had wrongly built 02–04 as a
  single-column stacked layout (title/paragraph full width, image below), on the theory that
  only Project 01 used the two-column form. That was wrong — **all four projects use the
  identical two-column template** (copy column left ~50%, image column right ~50%, via
  `flex flex-wrap` + two `flex-1` children, same as Project 01's original markup), just
  recolored per project. Confirmed by directly cropping/zooming matching regions of
  `project 01.png` vs `project 02.png` at the same scale and comparing pixel-for-pixel — same
  title font (plain bold sans, NOT the blocky `display`/Archivo class I'd used for 02-04),
  same title/paragraph/tag sizes, same column split, same corner-bracket + "JPG · IMAGE.JPG"
  badge treatment on the image. Also caught that Project 01's own title/paragraph had drifted
  to placeholder filler text ("Message in a bottle...") instead of the real screenshot copy
  ("Meridian Health" / "When therapists spend less time clicking, they have more time for
  patients.") — fixed. All four projects now share one template: date+dot, title
  (`text-[4.6vw] font-bold`, no `display` class), paragraph (`text-[1.7vw]`), "VIEW PROJECT
  ↗" link, tags pinned to the bottom via `mt-auto`, image column with `aspect-[16/13]`, hollow
  corner brackets, and the JPG badge (colors inverted per card to keep contrast). Real content:
  Project 01 "Meridian Health"/cyan, 02 "StyleBook"/black, 03 "Homestead"/gold, 04 "North
  Light"/rose.
- **Cumulative tab strip** (current, static): matched exactly to the reference screenshots —
  each project's tab row shows its own tab *plus every earlier project's tab* (project 02 shows
  01+02, project 04 shows 01+02+03+04), each an `<a href="#project-0N">` using the `.tab-slant`
  clip-path trick, all now the **same height** (`h-[4.2vw]`, same font size ~1.35vw) — earlier
  in this session projects 02–04's tabs were wrongly built taller/bolder than project 01's; a
  pixel-measurement pass against the screenshots (cropping tab rows and measuring cyan/black
  pixel spans) confirmed all tabs are actually uniform size, only the surrounding copy/image
  layout differs. No animation yet — this is the plain static per-section markup, one row per
  project, no JS. Also fixed the category tag shape site-wide (including Project 01, which had
  the wrong shape despite being marked done): it's one dog-eared/folded-corner chip
  (`.tag-folder` clip-path class, defined next to `.tab-slant`), not the old two-piece
  flap+box construction. Removed a fabricated "View case" pill near each image that didn't
  exist in any reference — the only image badge is the single top-right "JPG · IMAGE.JPG"
  chip, recolored per project (inverts light/dark to contrast its card). Projects 02–04 still
  use `placehold.co` color-swatch placeholders for their photos — no local asset exists for
  salon/homestead/desert scenes the way `image/me.png` does for the hero/about photos.
- **Scroll-stacking animation — attempted and reverted, needs a different approach next time.**
  The reference screenshots are almost certainly mid-scroll snapshots of a "folder stack"
  effect (each project's full card slides up and covers the previous one, leaving only its tab
  peeking above). Tried implementing with `position: sticky` (each project's own tab only,
  `top` offset = cumulative tab height, `z-10..z-40`) plus a JS-computed negative `margin-top`
  per slide to force the sticky trigger points to overlap correctly (the math: a card's own
  height is way bigger than the tab-height offset between slides, so naive sticky siblings
  hand off with a big dead gap — worked out a formula and it was internally consistent) — but
  hit a wall that ate the whole session: **the original server-rendered `<article>` elements
  flatly refused to behave as `position: sticky` in this environment** (computed style reported
  `position: sticky; top: 0px` correctly, but `getBoundingClientRect()` during a scroll sweep
  showed pure linear movement, no stuck plateau, ever) — while a *freshly `document.createElement`'d*
  sticky div/article inserted into the exact same wrapper stuck perfectly fine. Ruled out: the
  wrapper's padding/height, z-index, Tailwind vs. inline styles, tag name, content complexity
  (even emptied to plain text it still failed), duplicate IDs, ancestor overflow/transform,
  the JS stacking script itself (disabled entirely, still broken), stale state (reproduced on
  a brand-new tab on first load). `cloneNode(true)`-ing the broken element also produced a
  broken clone. Never found the actual cause — smelled like something specific to elements
  present in the initial HTML parse vs. ones inserted by script, but a plain freshly-created
  element with identical classes inserted right next to the broken one worked immediately, which
  doesn't fit that theory either. **Reverted to the static cumulative-tab-row version** (see
  above) per user request ("don't apply the animation yet") — all the sticky/JS code and the
  `.project-slide` wrapper divs were removed. If animation work resumes: try a version built
  fresh in a minimal isolated test page first (outside this specific DOM) to see if the bug is
  reproducible outside the full site, and check the browser console for any errors/CSS warnings
  before going deep on DOM experiments again.

- **Let's Talk intro (blob + heading + paragraph)**: rebuilt to match `let's talk.png`.
  Changed from the old stacked layout (heading full-width, paragraph below, blob centered
  underneath) to a side-by-side row (`flex items-center gap-[6vw]`): blob left (`w-[35vw]`,
  same path/eyes as before, just resized/repositioned, no longer `preserveAspectRatio="none"`),
  heading + paragraph right. Heading font changed from `.display` (Archivo) to `font-pixel`
  (Pixelify Sans) — zoomed the reference and confirmed the blocky rounded letterforms match
  Pixelify Sans exactly (same font already used for JOLIN/FEATURED WORKS), not Archivo. Sizes
  derived by measuring the reference screenshot in PowerShell (`System.Drawing`, crop/bbox scans
  for the blob and text regions) and reproducing proportionally: heading `text-[8.9vw]` with
  `tracking-[0.02em]`, paragraph `text-[1.55vw] max-w-[46vw]` — confirmed via a throwaway
  Puppeteer render that this wraps to the same 3 lines as the reference. Verified the final
  result against the reference with a real screenshot of `#contact` — close match.
  Since then, per follow-up requests: sized down ~30% (blob `35vw→24vw`, heading
  `8.9vw→6.2vw`, paragraph `1.55vw→1.15vw`), row changed to `justify-center` (was left-aligned),
  a small gold 4-point sparkle SVG added top-right of the blob with `.icon-spin` (reused from
  the About skills icons), and the blob itself now spins too — but **only the blob `<path>`**,
  wrapped in its own `<g class="icon-spin">`; the eyes (`#blob-eyes`) are a sibling group so
  they don't rotate. Had to add `overflow-visible` to `#talk-blob` since the viewBox is tight
  to the unrotated shape and a rotated diagonal was getting clipped — verified clean across 8
  sampled angles (0–315°) with a throwaway Puppeteer script. Eyes also now track the mouse
  (`#blob-eyes` gets an eased SVG `transform="translate(...)"` in the mousemove/rAF handler
  near the bottom of `<script>`, same pattern as the ruler-drift and "YOU" cursor effects) —
  clamped to ±7 viewBox units so it reads as a subtle look-toward-cursor rather than a jump.
  Eye rects were also repositioned/resized against a precise pixel measurement of the reference
  (they'd been dead-centered in the blob's bbox; reference has them offset up+right into the
  upper lobe) — then pulled back in slightly toward center once spin was added, since the
  original reference-accurate position put the right eye's corner outside the blob's silhouette
  at diagonal rotation angles (confirmed via the same 8-angle render). Blob also got a
  `stroke="#111212" stroke-width="4"` (the reference blob has a thin black outline; the
  rebuilt one was fill-only) — sampled the reference's outline pixel width to size it.
  **Still pending**: the reference is a partial/cropped capture (blob + heading + paragraph
  only, no form visible) — the message-composer white card is unchanged from the earlier
  generic build since no reference exists for it yet.
- **Contact card**: sized down ~45% on request — the huge `pb-[66vw] pt-[63.5vw]` card padding
  (the main driver of its footprint) is now `pb-[36vw] pt-[35vw]`, and every internal size
  (CONTACT sign, message composer, borders, spacing) scaled down to match.
- **CONTACT sign**: rebuilt to match `contact.png`. Was a plain `.display`-font (Archivo) cyan
  pill; reference shows `font-pixel` (Pixelify Sans, confirmed by zooming — same family as
  LET'S TALK/JOLIN/FEATURED WORKS) inside a black-bordered cyan bar flanked by two identical
  icon boxes (rose square, black border, containing a black diamond via
  `clip-path: polygon(50% 0,100% 50%,50% 100%,0 50%)` on an inset-0 div, with a gold
  double-chevron + small offset third mark drawn as three SVG `<polygon>`s inside). Icon glyph
  is a hand-built approximation of the reference's glitchy `>>|`-style mark, not a pixel-exact
  trace — close enough at this size that the difference isn't visible. Verified against the
  reference with a real screenshot — close match.
- **"YOU" cursor — detached + auto-contrast (this session).** Was one `#you-cursor` div (dot
  + label welded together, both `bg-ink`/`text-white`) which went invisible whenever it
  crossed a black (`bg-ink`) section — several exist (Contact button, project tab strip,
  etc.). Split into two independent fixed elements: `#you-cursor-dot` snaps exactly to the
  pointer every `mousemove`; `#you-cursor-label` eases toward a viewport-scaled offset
  (`innerWidth * 0.013/0.011`, same proportions as the old static `1.3vw/1.1vw` offset) via
  the same lerp-in-`raf` pattern as the ruler drift / blob eyes, so the "You" pill visibly
  trails the dot instead of being rigidly attached. Both now use `bg-white` +
  `mix-blend-mode: difference` instead of `bg-ink`/`text-white` — this makes them invert
  against whatever's underneath (black bg → white shape, white bg → black shape, colored bg →
  contrasting inverse) instead of just going flat black-on-black. The label additionally
  needs `isolation: isolate` so its own white pill + black text composite as one unit *before*
  diffing against the page, rather than diffing text and pill separately against the page
  (verified both the plain-white-bg and over-the-black-Contact-button cases render with
  correct contrast; confirmed via screenshot zoom, not just code review).
- **Footer ruler (this session)**: added a second ruler bar (ticks + drifting numbers,
  identical markup/styling to the header one) at the top of `<footer>`, above the link row.
  The two number-drawing and drift-easing IIFEs near the bottom of `<script>` were
  generalized from `getElementById('ruler-track'/'ruler-nums')` to
  `querySelectorAll('.ruler-track'/'ruler-nums')` so one shared mouse-position target now
  drives every ruler instance on the page in lockstep — confirmed programmatically
  (`#ruler-track` and `#footer-ruler-track` report the identical `translateX(...)` value
  after a synthetic mousemove) rather than by eyeballing a screenshot, since screenshot
  capture was flaky/timing out in this session partway through footer verification (page JS
  itself stayed responsive throughout — seems to have been a transient CDP/extension issue,
  not a real rendering bug; worth a quick sanity screenshot next session to be sure).
- **Global grid background** — noticed while reviewing references: `about me.png`,
  `featured.png`, and `let's talk.png` all show a faint light-grey grid-line pattern behind
  the whole page (~100px squares, `#f5f5f5` lines). It isn't implemented anywhere in
  `index.html` yet (checked — no grid/background-image rule exists). This is a global/body-level
  effect, not specific to any one section, so it was left out of the Let's Talk rebuild;
  flagging for a dedicated pass since it'd affect every section at once.

- **Projects stack on scroll** — the four project cards are now `position: sticky`
  (`.stack-card`, `top: 4vw`) so each new card slides up over the last and all four end up
  piled on top of each other. It works with the existing folder art rather than against it:
  every card already carries invisible placeholder tabs for the projects before it, so once
  stacked, the tabs step across in one row (01 02 03 04) with the top card's body covering
  the others. A small scroll handler scales a covered card down (max 5%) and paints a scrim
  over its body via `--dim` on `.stack-body::after`, for depth. Two gotchas worth
  remembering: (1) sticky range is bounded by the containing block's **content** box, so a
  `pb-*` on the section bought no extra hold — an explicit `h-[26vw]` spacer div at the end
  of the section is what keeps the finished pile on screen for a beat; (2)
  `transform-origin` must be `50% 4.2vw` (the tab-row height), not `50% 0`, or scaling lifts
  each lower card's body top a few px above the card covering it and leaves a colored sliver
  across the top edge. Below 900px the cards wrap to two columns and get taller than the
  viewport, so stacking is switched off (`position: static`) there.

## Notes / gotchas for next session

- The user sometimes edits `index.html` directly in their IDE while I'm also editing it —
  watch for the "file changed on disk" notices and re-read before editing to avoid clobbering
  each other's changes (happened once with an arrow-icon fix).
- When matching a new reference screenshot: crop/zoom it with the PowerShell
  `System.Drawing` snippets used throughout this session (see conversation) rather than
  guessing from the thumbnail — several details (arrow directions, icon shapes, exact
  colors) were only visible at higher zoom.
- `image/me.png` is the real photo now used in the hero avatars and the About polaroid —
  reuse it rather than placeholder swatches wherever the reference shows a real photo.
- Design tokens (`--token-...` CSS vars + the Tailwind `colors` block) already cover the
  full palette: cyan `#36c5f0`, gold `#ecb22e`, grass `#2eb67d`, rose `#e01e5a`, ink
  `#111212`, cocoa `#522e29`, plus `-soft` tints. New elements should pull from these rather
  than inventing new hex values.
- Fonts in play: `font-display` (Archivo condensed, section headers like FEATURED/JOLIN — no
  wait, JOLIN is now `font-pixel`), `font-pixel` (Pixelify Sans — JOLIN, FEATURED WORKS),
  `font-bubble` (Chewy — currently unused after the JOLIN switch, could be removed),
  `font-marker` (Architects Daughter — handwritten accents), `font-hand` (Caveat), `font-mono`
  (IBM Plex Mono — labels, dates, tags).
