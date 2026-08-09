// Booking inquiry handler. Vercel Node function, POST /api/book.
//
// Env vars (set in the Vercel dashboard, never in code):
//   RESEND_API_KEY   — Resend API key
//   BOOKING_TO_EMAIL — where inquiries land (placeholder until Lindsay/WD confirm)
//   BOOKING_FROM     — verified sender, e.g. "WD Brown Site <booking@youreadyletsgrow.com>"
//                      Falls back to Resend's shared testing sender until the domain
//                      is verified.

import { Resend } from 'resend';

const MAX = { name: 120, email: 200, organization: 200, eventDate: 40, message: 4000 };

// Deliberately loose: the only thing worth rejecting here is input that clearly
// isn't an address. Real verification happens when the reply bounces.
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

  // Honeypot: real people never fill a hidden field. Accept silently so bots
  // don't learn they were caught.
  if (clean(body.website, 200)) return res.status(200).json({ ok: true });

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const organization = clean(body.organization, MAX.organization);
  const eventDate = clean(body.eventDate, MAX.eventDate);
  const message = clean(body.message, MAX.message);

  // Re-validate server-side. The client checks too, but a POST can skip the page.
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'That email address does not look valid.' });
  }

  const to = process.env.BOOKING_TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !apiKey) {
    console.error('Missing BOOKING_TO_EMAIL or RESEND_API_KEY');
    return res.status(500).json({ error: 'Booking is temporarily unavailable.' });
  }

  // Plain text only — nothing submitted is ever interpolated into HTML, so there
  // is no injection surface to escape.
  const text = [
    `New speaking inquiry from youreadyletsgrow.com`,
    ``,
    `Name:         ${name}`,
    `Email:        ${email}`,
    `Organization: ${organization || '—'}`,
    `Event date:   ${eventDate || '—'}`,
    ``,
    `Message:`,
    message,
  ].join('\n');

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.BOOKING_FROM || 'WD Brown Site <onboarding@resend.dev>',
      to: [to],
      replyTo: email, // so WD can just hit reply
      subject: `Speaking inquiry — ${name}${organization ? ` (${organization})` : ''}`,
      text,
    });

    if (error) throw new Error(error.message);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend send failed:', err);
    return res.status(502).json({ error: 'We could not send your message.' });
  }
}
