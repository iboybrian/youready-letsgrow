// Signup handler for the SMS/email modal. Vercel Node function, POST /api/subscribe.
//
// INTERIM ONLY. This relays the signup to the booking inbox so no lead is lost
// while the real integration is pending. It does NOT send marketing SMS and must
// not be used to. The client is on Keap (their mobile terms live on myklpages.com),
// so SMS consent has to be recorded by Keap — the system that actually sends the
// texts — before any marketing message goes out. Repoint the form at Keap's form
// action, or swap in Keap's embed, and delete this file.
//
// Env vars (Vercel dashboard, never in code):
//   RESEND_API_KEY, BOOKING_TO_EMAIL, BOOKING_FROM

import { Resend } from 'resend';

const MAX = { email: 200, phone: 25, country: 10 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body ?? {};

  // Honeypot: accept silently so bots learn nothing.
  if (clean(body.company, 200)) return res.status(200).json({ ok: true });

  const email = clean(body.email, MAX.email);
  const phone = clean(body.phone, MAX.phone);
  const country = clean(body.country, MAX.country);

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const to = process.env.BOOKING_TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !apiKey) {
    console.error('Missing BOOKING_TO_EMAIL or RESEND_API_KEY');
    return res.status(500).json({ error: 'Signup is temporarily unavailable.' });
  }

  // Record what consent was actually shown, when, and from where. If this ever
  // becomes the system of record for SMS consent, this is the minimum evidence.
  const text = [
    'New signup from the youreadyletsgrow.com popup',
    '',
    `Email:   ${email}`,
    `Phone:   ${phone ? `${country} ${phone}` : '— (not provided)'}`,
    `When:    ${new Date().toISOString()}`,
    `IP:      ${req.headers['x-forwarded-for'] || 'unknown'}`,
    '',
    'Consent shown at submit time:',
    'By submitting this form and signing up for texts, you consent to receive',
    'marketing text messages (e.g. promos, cart reminders) from Vision Buildaz, LLC',
    'at the number provided, including messages sent by autodialer. Consent is not a',
    'condition of purchase. Msg & data rates may apply. Msg frequency varies.',
    'Unsubscribe at any time by replying STOP or clicking the unsubscribe link.',
  ].join('\n');

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.BOOKING_FROM || 'WD Brown Site <onboarding@resend.dev>',
      to: [to],
      replyTo: email,
      subject: `New signup — ${email}`,
      text,
    });

    if (error) throw new Error(error.message);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend send failed:', err);
    return res.status(502).json({ error: 'We could not complete your signup.' });
  }
}
