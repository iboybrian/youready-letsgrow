// youreadyletsgrow.com — anchor nav state + booking form submit.

// Optional chaining, not a bare call: if the footer year span ever goes missing,
// a TypeError here would kill every feature below it.
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---- mobile menu ----------------------------------------------------- */
// Full-screen <dialog> below 720px. showModal() puts it in the top layer, so the
// header's backdrop-filter cannot trap it, and focus trap + Escape come free.
// Links are cloned from the header nav so the markup has one source of truth.

const burger = document.getElementById('nav-burger');
const navDialog = document.getElementById('nav-dialog');
if (burger && navDialog && typeof navDialog.showModal === 'function') {
  const sourceLinks = document.querySelector('#primary-nav .nav-links');
  if (sourceLinks) navDialog.appendChild(sourceLinks.cloneNode(true));

  const closeBtn = document.getElementById('nav-close');

  const openNav = () => {
    navDialog.showModal();
    document.body.classList.add('nav-open');
    burger.setAttribute('aria-expanded', 'true');
  };
  const closeNav = () => navDialog.close();

  burger.addEventListener('click', openNav);
  closeBtn?.addEventListener('click', closeNav);

  // Escape and the close button both fire 'close'; clean up in one place.
  navDialog.addEventListener('close', () => {
    document.body.classList.remove('nav-open');
    burger.setAttribute('aria-expanded', 'false');
  });

  // Tapping a link should navigate to the anchor, not just close.
  navDialog.addEventListener('click', event => {
    if (event.target.closest('a')) closeNav();
  });

  // Resizing to desktop must not leave a full-screen menu covering the page.
  window.matchMedia('(min-width: 721px)').addEventListener('change', event => {
    if (event.matches && navDialog.open) closeNav();
  });
}

/* ---- nav active state ------------------------------------------------ */
// IntersectionObserver over the sections the nav points at. No scroll library.

const navLinks = [...document.querySelectorAll('.nav-links a')];
const sections = navLinks
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

if (sections.length) {
  const visible = new Set();

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.isIntersecting ? visible.add(entry.target.id) : visible.delete(entry.target.id);
    }
    // Highlight the topmost section currently on screen.
    const current = sections.find(s => visible.has(s.id));
    navLinks.forEach(a => {
      a.classList.toggle('is-active', !!current && a.getAttribute('href') === '#' + current.id);
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ---- hero carousel --------------------------------------------------- */
// Crossfade between the hero cutouts. Slide 1 is already active in the markup,
// so this only adds the dots and the rotation on top of a working default.

const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  // Two tracks (photos and text) advance together off one index.
  const tracks = [...document.querySelectorAll('[data-track]')]
    .map(track => [...track.querySelectorAll('[data-slide]')]);
  const count = Math.min(...tracks.map(t => t.length));
  const dotsBox = document.querySelector('[data-dots]');
  const INTERVAL = 5000;
  let index = 0;
  let timer = null;

  const dots = Array.from({ length: count }, (_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1} of ${count}`);
    dot.addEventListener('click', () => {
      show(i);
      restart(); // manual pick gets a full interval before auto-advance resumes
    });
    dotsBox.appendChild(dot);
    return dot;
  });

  function show(next) {
    index = (next + count) % count;
    tracks.forEach(slides => {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    });
    dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
  }

  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    // Respect reduced motion: dots still work, nothing rotates on its own.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(() => show(index + 1), INTERVAL);
  };
  const restart = () => { stop(); start(); };

  // Don't animate behind the user's back or fight them while they interact.
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  dotsBox.addEventListener('focusin', stop);
  dotsBox.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  show(0);
  start();
}

/* ---- scroll reveals -------------------------------------------------- */
// CSS holds the hidden state; this only flips .is-visible once, on the way in.

const groups = document.querySelectorAll('.reveal-group');
groups.forEach(group => {
  [...group.children].forEach((child, i) => child.style.setProperty('--i', i));
});

const revealTargets = document.querySelectorAll('.reveal, .reveal-group');
if (revealTargets.length) {
  const revealer = new IntersectionObserver((entries, self) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      self.unobserve(entry.target); // reveal once, never re-hide on scroll up
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

  revealTargets.forEach(el => revealer.observe(el));
}

/* ---- counting stats -------------------------------------------------- */
// Count 0 -> target when the stat scrolls into view, once.

const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = 1400;

  const format = (value, suffix) => value.toLocaleString('en-US') + suffix;

  function countUp(el) {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';

    if (reduceMotion || !Number.isFinite(target)) {
      el.textContent = format(target, suffix);
      return;
    }

    const started = performance.now();
    requestAnimationFrame(function frame(now) {
      const progress = Math.min((now - started) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic — fast, then settles
      el.textContent = format(Math.round(target * eased), suffix);
      if (progress < 1) requestAnimationFrame(frame);
    });
  }

  const counterObserver = new IntersectionObserver((entries, self) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      self.unobserve(entry.target);
      countUp(entry.target);
    }
  }, { threshold: 0.4 });

  counters.forEach(el => counterObserver.observe(el));
}

/* ---- testimonials carousel ------------------------------------------- */
// Coverflow: centre card, one either side, the rest off-stage. Positions are
// classes; CSS owns the transforms.

const testimonials = document.querySelector('[data-testimonials]');
if (testimonials) {
  const cards = [...testimonials.querySelectorAll('[data-t-slide]')];
  const dotsBox = testimonials.querySelector('[data-t-dots]');
  const INTERVAL = 2000;
  let index = 0;
  let timer = null;
  let locked = false; // a video is loaded — never rotate it out from under someone

  const dots = cards.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 't-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Testimonial ${i + 1} of ${cards.length}`);
    dot.addEventListener('click', () => { show(i); restart(); });
    dotsBox.appendChild(dot);
    return dot;
  });

  function show(next) {
    const count = cards.length;
    index = (next + count) % count;
    const prev = (index - 1 + count) % count;
    const after = (index + 1) % count;

    cards.forEach((card, i) => {
      card.classList.toggle('is-center', i === index);
      card.classList.toggle('is-prev', i === prev);
      card.classList.toggle('is-next', i === after);
      // Off-stage cards must not be tab stops.
      const offstage = i !== index && i !== prev && i !== after;
      card.querySelectorAll('button, iframe, a').forEach(el => {
        el.tabIndex = offstage ? -1 : 0;
      });
    });
    dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
  }

  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    if (locked) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(() => show(index + 1), INTERVAL);
  };
  const restart = () => { stop(); start(); };

  testimonials.addEventListener('mouseenter', stop);
  testimonials.addEventListener('mouseleave', start);
  testimonials.addEventListener('focusin', stop);
  testimonials.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  // Facade -> real player. Nothing is requested from YouTube until this runs, so
  // the page sets no third-party cookies on load. nocookie domain either way.
  testimonials.addEventListener('click', event => {
    const facade = event.target.closest('.t-facade');
    if (!facade || facade.disabled) return;

    const id = facade.dataset.videoId;
    if (!id) return;

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
    iframe.title = facade.closest('.t-card').querySelector('.t-name')?.textContent || 'Testimonial';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    facade.replaceWith(iframe);

    locked = true;   // stop auto-rotation for good once someone is watching
    stop();
  });

  show(0);
  start();
}

/* ---- signup modal ---------------------------------------------------- */
// Native <dialog>. showModal() gives the focus trap, Escape handling and
// background inerting, so there is no modal library and no scroll-lock hack.

const signup = document.getElementById('signup-modal');
if (signup && typeof signup.showModal === 'function') {
  const SEEN_KEY = 'ylg-signup-seen';
  const DELAY = 15000;

  // localStorage throws in private-mode Safari; a dead flag must not kill the page.
  const seen = () => { try { return localStorage.getItem(SEEN_KEY) === '1'; } catch { return true; } };
  const markSeen = () => { try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ } };

  if (!seen()) {
    setTimeout(() => {
      if (!signup.open) signup.showModal();
    }, DELAY);
  }
  // Dismissing counts as seen, so it opens once per browser rather than nagging.
  signup.addEventListener('close', markSeen);

  // Click on the backdrop (outside the panel) closes it.
  signup.addEventListener('click', event => {
    if (event.target === signup) signup.close();
  });

  const signupForm = document.getElementById('signup-form');
  const signupStatus = document.getElementById('signup-status');

  signupForm.addEventListener('submit', async event => {
    event.preventDefault();

    const email = document.getElementById('signup-email');
    if (!email.checkValidity()) {
      signupStatus.textContent = 'Please enter a valid email address.';
      signupStatus.className = 'signup-status is-error';
      email.focus();
      return;
    }

    const button = signupForm.querySelector('.signup-submit');
    button.disabled = true;
    signupStatus.textContent = 'Subscribing…';
    signupStatus.className = 'signup-status';

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(signupForm))),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Request failed (' + response.status + ')');
      }
      signupForm.reset();
      signupStatus.textContent = "You're in — watch for a text and email. See you Tuesday at 7PM EST.";
      signupStatus.className = 'signup-status is-ok';
      markSeen();
    } catch (error) {
      signupStatus.textContent = error.message + ' — please try again.';
      signupStatus.className = 'signup-status is-error';
    } finally {
      button.disabled = false;
    }
  });
}

/* ---- booking form ---------------------------------------------------- */

const form = document.getElementById('booking-form');
const status = document.getElementById('form-status');

function clearErrors() {
  form.querySelectorAll('.has-error').forEach(f => f.classList.remove('has-error'));
  form.querySelectorAll('.field-error').forEach(e => e.remove());
}

function showError(input, msg) {
  const field = input.closest('.field');
  if (!field) return; // honeypot and other non-field inputs
  field.classList.add('has-error');
  const p = document.createElement('p');
  p.className = 'field-error';
  p.textContent = msg;
  field.appendChild(p);
}

function setStatus(msg, kind) {
  status.textContent = msg;
  status.className = 'form-status' + (kind ? ' is-' + kind : '');
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  clearErrors();
  setStatus('');

  // Native constraint validation: required + email format, no library.
  const invalid = [...form.elements].filter(el => el.willValidate && !el.checkValidity());
  if (invalid.length) {
    invalid.forEach(el => showError(el, el.validationMessage));
    invalid[0].focus();
    setStatus('Please fix the highlighted fields.', 'error');
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  setStatus('Sending…');

  try {
    const response = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || 'Request failed (' + response.status + ')');
    }

    form.reset();
    setStatus('Thank you — your inquiry is on its way. We typically respond within 1–2 business days.', 'ok');
  } catch (error) {
    setStatus(
      error.message + ' — please try again, or email us directly at vision@visionbuildaz.com.',
      'error'
    );
  } finally {
    button.disabled = false;
  }
});
