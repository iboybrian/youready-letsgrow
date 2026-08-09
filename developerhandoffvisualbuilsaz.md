# SOP — DEVELOPER HANDOFF
## youreadyletsgrow.com Build (Phase 1) + Vision Buildaz Site Updates (Phase 2)

**Client:** WD Brown / Vision Buildaz, LLC  
**Prepared by:** Joy Fluent, LLC | August 2026

> **Note:** This is v2 of this SOP. It supersedes the earlier draft — the design-reference question that was previously an open question is now resolved (see below), and Phase 2 now has its finalized content source, not just the technical audit.

---

## PROJECT OVERVIEW

WD Brown has two related but separate web properties, and this project is splitting his personal "founder/speaker" content off of the Vision Buildaz business site and onto its own dedicated domain.

**Phase 1 (this engagement, now):** Build youreadyletsgrow.com as a standalone speaker/founder landing page for WD Brown, using the finalized content doc linked below, styled with the visual/design direction WD has pointed to (not its literal layout — see below).

**Phase 2 (later, not part of this scope):** Go back and update the Vision Buildaz business site itself (visionbuildaz.com / the in-progress vision-buildaz.vercel.app rebuild). Both a technical audit and finalized restructured page content already exist for that phase; both are included below for context but are not to be started now.

**Please read this whole document before starting.**

---

## WHERE THINGS STAND TODAY

### visionbuildaz.com — the current live site
Built on Wix. This is Vision Buildaz's original, currently-live business site, with Home, Let's Grow, About, Our Founder, and Contact pages. The "Our Founder" page on this site is the content that is now being pulled out and rebuilt as its own standalone site at youreadyletsgrow.com (see Phase 1 below). A full functional/content audit of this site already exists — see "What's Already Been Assessed" under Phase 2. **This site is not being touched in Phase 1.**

### vision-buildaz.vercel.app — in-progress rebuild
This appears to be an in-progress rebuild of the Vision Buildaz site, hosted on Vercel rather than Wix. As of this writing we only have surface-level access (page loads, meta tags visible) and do not yet have confirmed access to the underlying codebase. We believe GitHub repo access can be obtained, but it has not been secured yet — this is a dependency, not a blocker for Phase 1, since Phase 1 is a separate, new build on a separate domain. **Getting GitHub/Vercel access confirmed is a Phase 2 prerequisite.**

### visionbuildaz.tiiny.site — design reference WD likes (visual direction only)
WD pointed to this site as an example of the look and feel he wants. It's a polished demo (built by a third party labeled "SURV7X," marked "Concept demo") with a hero, a three-story "WD Method" section (Jordan/Phil Jackson, Tiger Woods/his coach, The Beatles/George Martin, each illustrating a coaching parallel), a tiered membership structure (The Library — free, The Vault — $19/mo, The Circle — $79/mo, 1:1 with WD — $349/mo), a "Meet WD Brown" bio section, a books section, and a footer with social links.

**CONFIRMED:** Use this site for visual/design direction only — hero treatment, photography style, dark background with gold accent color, typography feel, section pacing and spacing. **Do not replicate its literal layout, page structure, or functionality.** In particular, do not build the paid tiered-membership "coaching app" section (Library/Vault/Circle/1:1 with pricing) — that does not exist in the approved content plan for youreadyletsgrow.com. Build to the actual structure and copy in the content doc below; treat tiiny.site purely as mood-board/style inspiration layered on top of that structure.

**Default brand colors/logo:** Match Vision Buildaz's existing navy/gold/white palette for consistency across WD's properties, using tiiny.site's darker, more editorial treatment as a stylistic accent (e.g., a dark hero section) rather than a full palette swap. Flag to Lindsay if this creates any visible tension once in design.

---

## PHASE 1 SCOPE: BUILD youreadyletsgrow.com

### Goal
A standalone, single-page (or lightly multi-section, anchor-navigated) speaker/founder site for WD Brown at youreadyletsgrow.com, replacing the current setup where his founder content lives as a subpage of visionbuildaz.com.

### Content Source (final, approved copy)
All hero copy, section copy, and structure are finalized in this doc: **[youreadyletsgrow.com — Homepage Content Audit + Rewrite](https://docs.google.com/document/d/1mpBCCV831sjK_Id5Z302AuKwsUaqoZCmgR4ERKuFSdE/edit)**

Use this doc as the content source of truth. It includes both the audit notes (why each change was made, useful context) and the full final copy for every section, so you do not need to cross-reference anything else for wording.

### Required Page Structure (from the content doc)
**Nav** (simple anchor nav, single-page site): Speaking · Meet WD · Books · Contact

1. **Hero** — eyebrow, headline, subhead, tagline badge, primary CTA (Book WD to Speak), secondary CTA (Download the Speaker Sheet)
2. **Core Promise** — four-point value list
3. **Speaking / The WD Method** — three-part method strip + five signature speaking topics + what WD brings to the stage + ideal audiences + speaking formats
4. **Meet WD** — full bio section with credentials strip and pull quotes
5. **Books** — *Mindset Before Millions*, the companion *Workbook*, *Millionaire Playbook*, each with Amazon order links
6. **Download the Speaker Sheet** — dedicated section with a PDF download button (see Speaker Sheet requirement below)
7. **Contact / Booking** — new booking inquiry form (Name, Email, Organization, Event date, Message), does not exist on the current site and needs to be built fresh
8. **Footer** — WD Brown branding line, social links, copyright

### Speaker Sheet PDF (specific requirement flagged by WD)
WD has specifically asked that the speaker sheet be downloadable as a PDF from this page. The written content for the speaker sheet already exists (core promise, signature talks, ideal audiences, speaking formats, and credentials — all in the content doc above). What does not yet exist is a designed, exported PDF file. Attached pdf will be share.

### Social Links to Include (footer, per content doc + verified from the current live site)
- **Instagram:** [https://www.instagram.com/visionbuildaz](https://www.instagram.com/visionbuildaz)
- **YouTube:** [https://www.youtube.com/@visionbuildaz](https://www.youtube.com/@visionbuildaz)
- **TikTok:** [https://www.tiktok.com/@visionbuildaz](https://www.tiktok.com/@visionbuildaz)
- **Facebook:** [http://www.facebook.com/visionbuildaz](http://www.facebook.com/visionbuildaz)
- **LinkedIn (company):** Confirm final URL before launch — the current live Wix site links to a regional (Israel) LinkedIn URL by mistake (il.linkedin.com/company/visionbuildaz); use the standard [http://www.linkedin.com](http://www.linkedin.com) equivalent instead
- **LinkedIn (WD Brown personal):** [https://www.linkedin.com/in/wmdbrown](https://www.linkedin.com/in/wmdbrown)
- **Linktree:** [https://linktr.ee/visionbuildaz](https://linktr.ee/visionbuildaz)

### Booking Form Destination
The content doc currently lists vision@visionbuildaz.com as a placeholder for where booking inquiries should route. **Confirm the real destination email with Lindsay/WD before launch and swap it in.**

---

## PHASE 2 SCOPE (LATER — DO NOT START YET)

Once Phase 1 (youreadyletsgrow.com) ships, the next project is updating the main Vision Buildaz site itself. Two source documents already exist for this phase — a technical/functional audit and a finalized content restructure. Both are ready to hand to a developer when Phase 2 begins.

### Content Source for Phase 2: [Vision Buildaz — Full Site Content (Restructured, Final)](https://docs.google.com/document/d/1j0rV72Z8eLw4H7VqteRtofacqieb4Chzc1xjgGfU2wQ/edit)
This is the single, consolidated content doc to build from for the Vision Buildaz pages themselves (separate from the youreadyletsgrow.com content above). It replaces any earlier, scattered content drafts. Page-by-page summary:

- **About Vision Buildaz** — PROTECTED, verbatim, do not change.
- **Our Founder / About WD Brown** — PROTECTED, verbatim, do not change. (Note: the full standalone founder experience has moved to youreadyletsgrow.com per Phase 1; this shorter, unchanged mention stays on the Vision Buildaz site itself since WD is the founder.)
- **Home** — RESTRUCTURED. Cuts paragraphs duplicated from the About/Founder pages, adds a primary CTA (Book a Consultation) and secondary CTA (Meet WD Brown) near the top, plus mid-page CTAs, instead of only one CTA at the very bottom.
- **Let's Grow** — RESTRUCTURED. Replaces content that used to just repeat Home almost word-for-word with mission-specific content (The Movement, The Growth Path) so the page has its own reason to exist, plus book-focused CTAs.
- **Contact** — RESTRUCTURED. New page-specific heading (previously reused the About page's heading, which didn't fit), added a "we typically respond within 1–2 business days" line, clearer submit button label, and a "Let's Stay in Touch" social footer block.

The doc's own conversion logic: each page should have exactly one job and one primary CTA — Home routes traffic fast, About and Our Founder build trust (unchanged, they already do this well), Let's Grow deepens belief in the mission and the book, Contact removes friction and gets the consultation booked.

### Technical/Functional Audit for Phase 2: Vision Buildaz Website Assessment ("VB - Vercel" doc)
**Summary scores:** Brand 7/10, Clarity 6/10, User Flow 5/10, Conversion 4/10, Accessibility 4/10, Technical 5/10.

**Priority action plan:**
- Correct broken/misrouted links (About WD Brown, workbook Order Now, popup subscription, legal links, LinkedIn regional URL)
- Repair the homepage and e-book forms; add clear success/error messaging
- Make content visible by default; use scroll animation only as enhancement, not a requirement to see content
- Simplify the homepage to one clear primary goal/conversion path (this aligns directly with the restructured Home content above)
- Add real service detail (audience, outcomes, format, duration, pricing guidance, booking expectations) to coaching/booking pages
- Standardize page titles, headings, landmarks, labels, and focus states site-wide
- Add social proof (testimonials, results, affiliations, media coverage) and build a working sitemap.xml
- Complete mobile, audio-file, Amazon-checkout, and post-form-submission testing on real devices

**This work should not begin until Phase 1 is complete and GitHub/Vercel access to the actual codebase has been confirmed.**

---

## ACCESS AND ASSETS NEEDED BEFORE/DURING DEVELOPMENT

- [ ] GitHub repository access for vision-buildaz.vercel.app — pending, needed before Phase 2 (not required to start Phase 1, since that's a new, separate build)
- [ ] Domain/DNS access or instructions for pointing youreadyletsgrow.com to the new build
- [ ] Vercel (or chosen hosting) project access for the new youreadyletsgrow.com site
- [ ] High-resolution WD Brown photography (the current site's images are usable as a starting point but confirm nothing higher-res exists)
- [ ] Final speaker sheet PDF design/export (see requirement above)
- [ ] Confirmed booking-inquiry destination email

---

## OPEN QUESTIONS — NEED AN ANSWER BEFORE / DURING BUILD

1. **GitHub/codebase access timing:** Confirm who is coordinating this and by when, since it affects Phase 2 planning even though it doesn't block Phase 1.
2. **Style tension check:** Once the youreadyletsgrow.com hero/design direction is mocked up, confirm with WD that a Vision Buildaz-brand-colors-plus-tiiny.site-style-accents approach reads the way he wants, since the two references (existing brand palette vs. the darker demo) aren't identical.

---

## PHASE 1 DELIVERABLES CHECKLIST

- [ ] youreadyletsgrow.com live and pointed at correct DNS
- [ ] All 8 sections built per content doc (Hero, Core Promise, Speaking, Meet WD, Books, Speaker Sheet download, Contact/Booking, Footer)
- [ ] Anchor nav working (Speaking · Meet WD · Books · Contact)
- [ ] Visual direction follows tiiny.site style cues (photography treatment, accent color, pacing) without copying its layout, structure, or membership-tier functionality
- [ ] Speaker Sheet PDF designed, hosted, and downloadable from both CTA locations
- [ ] All 7 social/contact links verified and working (Instagram, YouTube, TikTok, Facebook, LinkedIn company, LinkedIn personal, Linktree)
- [ ] Booking form functional, routing to confirmed destination email, with a working success/confirmation message
- [ ] Mobile responsive check completed
- [ ] Basic SEO in place (page title, meta description, one clear H1)
- [ ] Reviewed and approved by Lindsay/Joy Fluent before final handoff to WD