# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`youreadyletsgrow.com` — a single-page speaker/booking site for WD Brown, split off from
the Vision Buildaz business site. Phase 1 of a two-phase engagement.

**Phase 2 (visionbuildaz.com / vision-buildaz.vercel.app) is explicitly out of scope.**
Do not touch those properties. See `developerhandoffvisualbuilsaz.md`.

This is a standalone git repo (`github.com/iboybrian/youready-letsgrow`) that happens to sit
inside the `visionbuildaz/` working directory. The parent directory is a *different* project
with a near-identical `CLAUDE.md`; edits there do not apply here. Deployed on Vercel.

## Commands

```bash
npm install                 # only dependency is `resend`, used by the API routes
npx vercel dev              # serves the static page + /api routes locally
node api/book.test.js       # self-check for the booking handler (assert-based, no framework)
python -m http.server 8000  # static-only preview; /api will 404
```

There is **no build step, no bundler, no framework**. `index.html`, `style.css` and
`main.js` are served as-authored. Do not introduce a build pipeline without being asked.

`api/book.test.js` is the only test, and it is a plain script — there is no runner and no
"single test" granularity. Run it with `node`.

### Visual verification

There is no browser tool in this environment, but headless Chrome is installed and works.
Use it rather than guessing at rendering:

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu \
  --no-sandbox --user-data-dir="$TEMP/chr-shot" --screenshot="$PWD/out.png" \
  --window-size=1100,860 --hide-scrollbars --virtual-time-budget=6000 \
  "file:///C:/Users/brian/devshit/visionbuildaz/youready-letsgrow/index.html"
```

`--virtual-time-budget` matters: the hero has a ~2s intro animation, and a screenshot
taken immediately catches it mid-flight. To capture a `<dialog>` (mobile nav, signup modal),
write a temp copy of the page with a script that calls `showModal()` — a bare `open`
attribute renders the dialog inline at the bottom of the page instead of centered.

## Architecture

All behaviour lives in one file, `main.js`, as independent `if (el) { … }` blocks — no
modules, no bundler, no shared state between blocks. Each block is dead if its markup hook
is absent, so deleting a section from `index.html` never throws.

### Progressive enhancement is load-bearing, not decoration

The sibling site's audit scored 4/10 on accessibility, specifically for content that was
invisible until animations ran. This build inverts that, and the pattern is easy to break:

- `<head>` sets `document.documentElement.className = 'js'` inline. Every hidden state is
  CSS scoped to `.js` — **never applied by script**. No JS → everything is visible; there
  is also no flash, because the class lands before first paint.
- Carousels: slide 1 carries `is-active` **in the markup**. The photo and lede still work
  with JS disabled.
- Count-up stats carry their final value as text (`300,000+`); JS only overwrites it once
  scrolled into view.
- `prefers-reduced-motion` disables all of it and shows the final state. Every auto-rotating
  carousel checks it in its own `start()` — dots and arrows still work, nothing self-advances.
  Headless screenshots are much easier to read with `--force-prefers-reduced-motion`: it skips
  the reveal stagger entirely, so a short `--virtual-time-budget` still catches the final
  state. Keep the budget under 15s or the signup modal opens and greys out the whole page.

### Two carousels, two different implementations

Don't assume one shared engine. They are deliberately separate:

1. **Hero lede (`[data-carousel]`)** — the generic one. Every `[data-track]` on the page is
   collected and its `[data-slide]` children toggled `is-active` at the same index, so any
   number of tracks advance off one counter; dots and count derive themselves. Slides in a
   track share **one CSS grid cell** (`grid-area: 1 / 1`), so the container is as tall as
   the tallest slide and nothing reflows mid-crossfade. Only the rotating lede uses it now —
   the photo track went away with the cutout carousel.
2. **Books (`[data-books-carousel]`)** — the odd one out: pixel `translateX` on a track,
   with a clone-based "infinite" wrap that snaps back with `transition: none` after 600ms.
   `TOTAL_ORIGINAL = 4` and the `24`px gap are **hardcoded** and must match the markup and
   CSS. Adding a book means updating both constants and the clone set.

### The testimonial wall

`[data-testimonials]` was a coverflow carousel until the 19 Aug batch-2 rebuild; it is now
a plain CSS grid (`.t-wall`) with every clip on screen at once, and the only JS left is the
facade → player swap. It was briefly restored to a coverflow on 20 Aug and reverted the same
day — **the client has now explicitly chosen the grid twice. Do not turn it back into a
carousel.** The movement they wanted was the scroll fade-in, which is the `.reveal-group` on
the wall, not a rotation.

**Only one player may exist at a time**: opening a second testimonial swaps the running
iframe back for its own facade node, which is what actually stops the audio. That mattered
on the carousel and matters more on a grid — remove it and every tile someone clicks keeps
talking. Thumbnails are `maxresdefault.jpg`, not `hqdefault.jpg`, which is a 4:3 crop with
black bars baked in; maxres only exists for HD uploads, so check a new id returns 200 before
wiring it.

### YouTube facades

Testimonial videos are `<button class="t-facade">`, not iframes. Nothing is requested from
YouTube until a click, so the page sets no third-party cookies on load; the real embed uses
`youtube-nocookie.com`. Facades carrying `data-video-placeholder` instead of `data-video-id`
pop an `alert()` — those are awaiting client footage, not broken.

The speaker reel has no section any more (the client cut it), but two things still wait on
it and both hang off **one** attribute: `#reel-float[data-video-id]`. While it is empty the
floating launcher removes itself from the page and the hero's `#hero-reel-btn` stays
`hidden`; put a YouTube id there and both appear, with the hero button calling the same
`playReel()` so the video always plays inside the bubble. That is the entire switch — don't
add a second id anywhere.

Note `[hidden] { display: none !important; }` in the utilities block: `.btn` sets
`display: inline-flex`, and an author class beats the UA's `[hidden]` rule, so without it
the held button would render anyway. Any `.btn` you hide by attribute depends on it.

### Reveals: the safety net is "no observer", not "page loaded"

`.reveal` / `.reveal-group` elements are revealed by an IntersectionObserver. `main.js`
used to *also* force `is-visible` onto all of them on `window.load`, which on any normal
connection fired before the user scrolled anywhere and killed the fade-in sitewide. The
client asked for that effect back on 20 Aug, so the net now only fires when
`IntersectionObserver` is absent — the "never leave content hidden" guarantee still holds
(no JS at all → no `.js` class → nothing is hidden in the first place).

Consequence for screenshots: below-fold content is now genuinely invisible in a full-page
capture. Use `--force-prefers-reduced-motion`, which shows the final state.

### The hero is a photograph, not a cutout carousel

`assets/wd-speaking.webp` (the arena shot) is the hero ground, as a real `<img class="hero-bg">`
rather than a CSS background so it can be the LCP element. WD stands in the left third of
the frame, which is why the copy column is `grid-column: 2` and the left column is
deliberately empty.

Three things there are load-bearing:

- `.hero-bg` and `.hero::before` (the darkening overlay) are both absolutely positioned
  children, and the pseudo-element comes **first** in tree order — without explicit
  `z-index` (0 / 1 / 2 for `.hero-inner`) the photo paints over the overlay and the copy
  becomes unreadable. This bit once already.
- The rotating lede now carries `data-carousel`; it is the only track left in the hero, and
  the dots derive from it.
- The `wd-hero*.webp` cutouts are unused but kept — they were `936x1200` with matched
  framing precisely so they could crossfade in one grid cell. If the carousel ever comes
  back, keep that constraint and check partial alpha is under ~2% (a wide band of partial
  alpha renders as a lit rectangle on navy). The 1024px files in `assets/originals/` are
  **different photos**, not the sources for those three.

### Two native `<dialog>`s

`showModal()` gives the focus trap, Escape handling and background inerting for free, so
there is no modal library and no scroll-lock hack.

- **Mobile nav** (`#nav-dialog`, below 720px): its links are **cloned at runtime** from
  `#primary-nav .nav-links`, so the header nav is the single source of truth — edit nav
  items there only. A `matchMedia('(min-width: 721px)')` listener closes it on resize so a
  full-screen menu never survives into desktop layout.
- **Signup modal** (`#signup-modal`): auto-opens after 15s, once per browser, gated on
  `localStorage['ylg-signup-seen']` — reads are `try`/`catch`ed because private-mode Safari
  throws. Clear that key to see it again while testing.

### SVG icon sprite

One `<svg class="icon-defs">` at the top of `<body>`, referenced via `<use href="#id">`.
Two constraints that will silently break things:

1. **The sprite must precede every `<use>`.** It was originally near the footer; it was
   moved to the top when icons were added to mid-page sections.
2. **`<use>` clones into a shadow tree that document CSS selectors cannot reach.** Stroke
   styling therefore lives on the *outer* `<svg>` (`.tick svg`) as inheritable SVG
   properties (`fill`, `stroke`, `stroke-width`, …), not on the symbol's child shapes. A
   shape that must differ (e.g. solid dots) overrides with its own presentation attributes.

### Hero headline animation

Words are split **in the markup**, not at runtime — the copy is fixed, so per-word delays
come from `:nth-of-type` in CSS. No splitter library (the reference site ships 1.1MB of
GSAP + SplitText for this).

The eyebrow's `·` separators are `<i class="sep">`, not `<span>`, because `nth-of-type`
counts per tag name — mixing them into the `<span>` sequence shifts every word's delay.

### Layout techniques that look odd but are deliberate

- `.bio-aside` is `position: sticky` and works **only because** `.bio-layout` sets
  `align-items: start`. With the default `stretch` the item fills the row and sticky has
  zero travel.
- The speaker-sheet photo is `position: absolute` inside its grid column, so it contributes
  **no height** — the copy column alone sets the section height. This was an explicit
  requirement.
- Mobile hero reorder uses `display: contents` on `.hero-copy` to dissolve the wrapper so
  its children become grid items that `order` can interleave with the photo.

### API routes

> **`api/book.js` is dormant.** The booking form it served was replaced with a single
> outbound button in the 19 Aug batch — booking runs through the client's CRM so the
> destination can change without a site edit. The route, its test and the honeypot CSS
> are kept because the CRM URL had not arrived yet and reverting is a git revert; nothing
> on the page posts to it. `#contact`'s button carries a `data-todo` and a mailto
> fallback until the real URL lands (ASSET-REQUEST #32).

`api/book.js` (booking form) and `api/subscribe.js` (signup modal) are Vercel Node
functions. Both: validate server-side regardless of client checks, use a honeypot field
that returns `200` so bots learn nothing, and **fail closed** with a 500 if
`RESEND_API_KEY` / `BOOKING_TO_EMAIL` are missing rather than silently dropping a lead.

Env vars live in the Vercel dashboard: `RESEND_API_KEY`, `BOOKING_TO_EMAIL`, `BOOKING_FROM`.

`api/book.test.js` stubs `globalThis.fetch` rather than the Resend SDK — the handler
constructs its own client internally, so there is nothing to inject. Note the SDK maps
`replyTo` → `reply_to` on the wire.

> `api/subscribe.js` is **interim**. It relays signups to the booking inbox so no lead is
> lost, but it does not send SMS. The client is on Keap (their mobile-terms page is a
> `myklpages.com` URL); SMS marketing consent must be recorded by the system that actually
> sends the texts. Repoint the form at Keap before any marketing SMS goes out. The handler
> logs the exact consent text, timestamp and IP with each signup — keep that if it ever has
> to serve as evidence of consent.

## Content is client-approved — do not rewrite it

Copy comes from approved documents, not from judgement:

- `WD_Brown_Speaker_Bio_Sheet_and_Landing_Page.docx.md` — bio + speaker sheet
- `developerhandoffvisualbuilsaz.md` and the SOP PDF — scope and section structure
- A Google Doc content audit (pasted into conversation; not in the repo)

`ASSET-REQUEST.md` is the client-facing list of everything still blocking launch — update it
whenever a placeholder is added or an asset lands.

Do not invent copy, testimonials, credentials, or statistics to fill a gap. Add a marked
placeholder (`TODO:` comment, or `data-video-placeholder` for a pending video) and record it
in `ASSET-REQUEST.md`.

Where the build **deliberately** departs from the approved docs at the client's direction,
leave an HTML comment saying why — without it the next person "fixes" the site back to the
doc.

## Design tokens

The palette and type pairing in `:root` (top of `style.css`) were sampled from
`visionbuildaz.tiiny.site`, the demo the client pointed to — they are **provisional** until
the real brand guide arrives. Change colours there, never inline. Section backgrounds are
class-driven (`.section-dark`, `.section-dark-accent`, `.section-tint`), not per-section CSS.

Per the SOP, that demo is a visual reference only — do not replicate its layout, and do not
build its paid membership tiers (Library / Vault / Circle), which are not in the approved
content plan and not part of a speaking-only site.

At the 8.15 review the client narrowed that further: the demo (they call it "Sileon's site")
is now the **styling** standard — clean, concise, bright, one purpose per section — while
this site keeps its own structure and section order. An attempt to rebuild the page in the
demo's shape was explicitly rejected. Style from it; do not copy its skeleton.

### Section theming runs on tokens, not per-component colours

`:root` defines `--surface`, `--surface-border`, `--surface-title`, `--surface-text`,
`--rule`, `--accent` and `--ghost-*` for the light theme; a single selector list
(`.hero, .section-dark, .section-dark-accent, .statement, .signup, .cta-banner`) re-points
them for dark. Components read the tokens, so a section changes theme by adding or removing
one class — never by editing `.promise-card`, `.topic`, `.tick` and friends one at a time.
`.cta-banner` is in that list because it is a dark card sitting inside a light section.

Gold is `--accent` only on dark. On paper `#D4AF37` is about 2.2:1 and fails as body text,
which is why the light theme resolves `--accent` to `--gold-deep` and body copy uses
`--ink`. Do not "fix" that back to the brighter gold.

## Images

Cutouts are produced with `rembg` (installed). Verify transparency at the alpha channel
and composite against the actual background colour before committing — a cutout that looks
fine on white can show a halo on navy. Trim transparent padding (`getbbox`) so images
scale predictably, serve WebP, and keep the full-resolution original in `assets/originals/`.
Raw client headshots live in `assets/2026_WD_Headshots/` and are sources, not shipped assets.
