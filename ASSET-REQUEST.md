# youreadyletsgrow.com — What We Need From Lindsay / WD

Everything below is either missing from the handoff SOP or flagged in it as "confirm
before launch." The site is built and running; these items unblock launch, not the build.

---

## 1. Blocks launch

| # | Item | Why it blocks |
|---|---|---|
| 1 | **Content doc export** — [youreadyletsgrow.com Homepage Content Audit + Rewrite](https://docs.google.com/document/d/1mpBCCV831sjK_Id5Z302AuKwsUaqoZCmgR4ERKuFSdE/edit) | The SOP names it the content source of truth but it was never shared. We built from the approved bio/speaker-sheet doc instead. Still missing: the supporting hero subhead, the three-part "WD Method" strip copy, and all three book blurbs. |
| ~~2~~ | ~~Designed speaker sheet PDF~~ | Resolved — `WD_Brown_Speaker_Sheet.pdf` received, wired at `assets/speaker-sheet.pdf`, download button live. |
| 3 | **Booking destination email** | `vision@visionbuildaz.com` is a placeholder in the SOP. Every inquiry from the site routes here — we need the real inbox before launch. |
| 4 | **DNS access for youreadyletsgrow.com** | Nothing goes live without it. Who holds the registrar login? |
| 5 | **Hosting account owner** | New Vercel project — under Joy Fluent's account or WD's? Whoever owns it owns the bill and the deploy access. |
| 6 | **Transactional email account** | The booking form sends through Resend. Someone needs to create the account and verify `youreadyletsgrow.com` as a sending domain (a DNS record). Until then the form can only send from a shared test address. |
| 24 | **Domain/account admin email** | Separate from item 3 (where booking inquiries land): whoever registers the domain and creates the Vercel/Resend accounts needs a real inbox on file for renewal notices, SSL/domain alerts, and account recovery. Confirm whose email that is. |

---

## 2. Missing assets

| # | Item | Current state |
|---|---|---|
| 7 | **Millionaire Playbook cover art** | No cover found anywhere on the live sites. Placeholder tile in place. Is this book actually published yet? |
| ~~8~~ | ~~Amazon link — Millionaire Playbook~~ | Resolved — `amazon.com/dp/B0GQZ6DYCH` wired in. |
| ~~9~~ | ~~Amazon link — Mindset Before Millions Workbook~~ | Resolved — `amazon.com/dp/B0GRWR1QQ5` wired in. |
| 10 | **Confirm the Mindset Before Millions edition** | We found `B0GQZ2R814`, which is the e-book listing. If there's a paperback, WD may prefer that as the default link. |
| ~~11~~ | ~~Official logo files~~ | Resolved — received the tree + "You Ready? Let's Grow!™" lockup PNG (the site's own mark, separate from the Vision Buildaz "VB" logo). Cropped the tree canopy in as the favicon since the full lockup isn't legible at 16px. Not yet used as the nav wordmark (currently text) or on the hero — confirm placement. |
| 12 | **Brand hex codes** | The received logo's navy/orange reads more saturated-orange than the muted gold we sampled from the tiiny.site demo (`#C0922F`). If there's an official brand guide with exact hex values, send it — one CSS block swaps the whole palette. |
| ~~25~~ | ~~Logo file format~~ | Partly resolved — the **Vision Buildaz** mark arrived with real transparency (`assets/logo-vb.webp`, used in the bio and the footer). The **You Ready? Let's Grow!** lockup is still only a flat PNG on white: we keyed the background out ourselves (`assets/logo-yrlg.webp`), which works, but an SVG or a transparent-background export at higher resolution would be cleaner at large sizes. |
| 13 | **More photos of WD** | Two stage shots now in (hero + the credentials block, `assets/originals/wd_speaking*.jpg`), plus one studio cutout and one portrait. This is a site selling speaking engagements — event/stage photos, WD with an audience, candid shots from past talks all strengthen "Meet WD" and the speaking section. Even phone photos help. |
| 14 | **Higher-res photography** | The SOP asks us to confirm nothing better exists. What we pulled: a 2400×3000 cutout (good) and a 1024×1024 portrait (adequate, not great). |
| ~~23~~ | ~~Video~~ | Partly resolved — four testimonial clips are live in the Video Testimonials carousel. Still outstanding: items 26 and 27 below. |
| 26 | **Speaker reel** | The dedicated reel section was removed in the 19 Aug batch. Two things are now waiting on the video and both come back off **one** switch: put the YouTube id on `data-video-id` in `#reel-float` and the floating launcher reappears *and* the hero's "Watch Speaker Reel" button unhides — the button plays the reel inside the bubble. Until then both stay off the page. Still the single highest-impact addition for a booking page. **Send the real runtime too** — the old badge showed "02:45", which was invented, so it was removed rather than left as a claim we can't stand behind. |
| 27 | **Four more testimonial videos** | Four pending tiles are held in the wall: **Nellie Brown** (her card is live with her quote and title, only the video is missing), **James Dumoulin** (name only — we have no quote, role or footage), and **two unnamed tiles** added at the client's request on 20 Aug. For each of the last three we need the clip, the person's name and role, and the pull-quote. Phone footage is fine. Nothing is invented in the meantime: the tiles say "pending" rather than carrying placeholder copy. |
| ~~31~~ | ~~Stage photo (WD speaking to a full room)~~ | Resolved — received and now the hero background (`assets/wd-speaking.webp`, 2200px WebP; full-res original in `assets/originals/wd_speaking.jpg`). The hero cutout carousel was retired in its favour. |

---

## 3. Confirmations needed

| # | Question |
|---|---|
| 15 | **Hero headline change.** Per WD's direction, `You Ready? Let's Grow!®` is now the main H1, with "Helping people reach their destination whole" moved to the supporting line. Worth flagging: the brand line carries less search weight than a descriptive headline. The page title and meta description still lead with "WD Brown — Speaker, Author, Mentor," so search results read correctly. Confirm WD is happy with that trade. |
| 16 | **Style tension check** (SOP open question #2). The build uses Vision Buildaz navy/gold with the demo's darker editorial treatment on the hero. Does that read the way WD wants, or does he want the whole page darker? |
| 17 | **LinkedIn company URL.** The live Wix site links a regional Israel URL (`il.linkedin.com/company/visionbuildaz`) by mistake. We substituted `linkedin.com/company/visionbuildaz`, which resolves — please confirm it's the right page. |
| 18 | **The demo site's ownership.** visionbuildaz.tiiny.site is a third-party "concept demo" by SURV7X. We are using it as visual reference only, per the SOP. Confirm no one expects us to reuse their code or assets, and that there's no outstanding arrangement with them. |
| 19 | **® on "You Ready? Let's Grow!"** — is the mark actually registered? It appears with ® throughout the approved copy, so we've matched that, but it should be verified rather than inherited. |
| 20 | **Testimonials / social proof.** The Vision Buildaz audit scored conversion 4/10 and called out missing social proof. There is currently none on this page either. Any event organizer quotes, client testimonials, or past venues we can name? |
| 21 | **"300,000+ views" claim.** Which platform/post? Worth being able to point to if a booking committee asks. |
| 22 | **GitHub/Vercel access for Phase 2** (SOP open question #1). Not needed for this build, but who is coordinating it and by when? |
| 28 | **Live-session times.** The signup popup states "every Tuesday & Thursday at 7:00 PM EST". Nothing on our side verifies that — confirm the days and time, or send the correct ones. |
| 29 | **Tagline punctuation.** The 8.15 review writes it as "You Ready, Let's Grow!" with a comma. Every approved document and the whole site use "You Ready? Let's Grow!®". We have added the missing `!` where it was absent; the comma-vs-question-mark version needs WD's call before we change 20+ instances. |
| 32 | **CRM booking page URL.** The embedded booking form was replaced with a single button ("I'm Ready, Let's Grow!") that should hand off to the CRM's booking page, so the destination can be changed there instead of on the site. **We don't have that URL.** Until it arrives the button opens an email to the booking inbox, so no lead is lost — but the CRM never sees those. One `href` in `index.html` is the whole change. |
| 30 | **Speaking fees.** The page now routes to "Request Pricing & Availability" with no figures shown, per Brian's instruction. If WD wants a starting-at range or named packages on the page, send the numbers — we will not estimate them. |

---

## 4. For reference — what we sourced ourselves

Per the SOP's allowance that the current site's images are usable as a starting point,
we pulled the following from Vision Buildaz's own properties. All are provisional and
will be replaced by anything better the client sends.

- WD standing cutout (2400×3000, transparent) — hero
- WD portrait (1024×1024) — Meet WD section
- Mindset Before Millions cover (1600×2560)
- Mindset Before Millions Workbook cover (1600×2560)
- Navy/gold palette and the Fraunces + Inter type pairing, sampled from the demo's CSS

Originals are kept in `assets/originals/`; the site serves compressed WebP versions.
