# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`youreadyletsgrow.com` — a single-page speaker/booking site for WD Brown, split off from
the Vision Buildaz business site. Phase 1 of a two-phase engagement.

**Phase 2 (visionbuildaz.com / vision-buildaz.vercel.app) is explicitly out of scope.**
Do not touch those properties. See `developerhandoffvisualbuilsaz.md`.

## Commands

```bash
npm install                 # only dependency is `resend`, used by the API routes
npx vercel dev              # serves the static page + /api routes locally
node api/book.test.js       # self-check for the booking handler (assert-based, no framework)
python -m http.server 8000  # static-only preview; /api will 404
```

There is **no build step, no bundler, no framework**. `index.html`, `style.css` and
`main.js` are served as-authored. Do not introduce a build pipeline without being asked.

### Visual verification

There is no browser tool in this environment, but headless Chrome is installed and works.
Use it rather than guessing at rendering:

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu \
  --no-sandbox --user-data-dir="$TEMP/chr-shot" --screenshot="$PWD/out.png" \
  --window-size=1100,860 --hide-scrollbars --virtual-time-budget=6000 \
  "file:///C:/Users/brian/devshit/visionbuildaz/index.html"
```

`--virtual-time-budget` matters: the hero has a ~2s intro animation, and a screenshot
taken immediately catches it mid-flight. To capture the `<dialog>`, write a temp copy of
the page with a script that calls `showModal()` — a bare `open` attribute renders the
dialog inline at the bottom of the page instead of centered.

## Architecture

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
- `prefers-reduced-motion` disables all of it and shows the final state.

### Carousels: two tracks, one index

The hero rotates a photo and a line of copy together. `main.js` queries every
`[data-track]`, treats its `[data-slide]` children as a track, and toggles `is-active` at
the same index across all of them. Adding a slide = one element in each track; the dot
controls and count derive themselves.

Slides in a track share **one CSS grid cell** (`grid-area: 1 / 1`), so the container is as
tall as the tallest slide and nothing reflows mid-crossfade.

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
> sends the texts. Repoint the form at Keap before any marketing SMS goes out.

## Content is client-approved — do not rewrite it

Copy comes from approved documents, not from judgement:

- `WD_Brown_Speaker_Bio_Sheet_and_Landing_Page.docx.md` — bio + speaker sheet
- `developerhandoffvisualbuilsaz.md` — the SOP, scope, and section structure
- A Google Doc content audit (pasted into conversation; not in the repo)

Where the build **deliberately** departs from those docs at the client's direction, an
HTML comment records why (see the hero's `DELIBERATE DIVERGENCE` note). Preserve those —
without them the next person "fixes" the site back to the doc.

Open items are tracked two ways and both are greppable:

- `TODO:` comments in `index.html` — each names what is being waited on
- `data-todo="..."` attributes on elements whose link/asset is still a placeholder
- `ASSET-REQUEST.md` — the client-facing list of everything blocking launch

Do not invent copy, testimonials, credentials, or statistics to fill a gap. Add a marked
placeholder and record it in `ASSET-REQUEST.md`.

## Design tokens

The palette and type pairing in `:root` were sampled from `visionbuildaz.tiiny.site`, the
demo the client pointed to — they are **provisional** until the real brand guide arrives.
Change colours there, never inline.

Per the SOP, that demo is a visual reference only. Do not replicate its layout, and do not
build its paid membership tiers (Library / Vault / Circle) — they are not in the approved
content plan.

## Images

Cutouts are produced with `rembg` (installed). Verify transparency at the alpha channel
and composite against the actual background colour before committing — a cutout that looks
fine on white can show a halo on navy. Trim transparent padding (`getbbox`) so images
scale predictably, serve WebP, and keep the full-resolution original in `assets/originals/`.
