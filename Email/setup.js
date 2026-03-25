// mailer.js
const nodemailer = require('nodemailer');

/**
 * Create an SMTP transporter using basic username/password.
 * Reads config from environment variables by default.
 */
function createTransporter({
  host = process.env.SMTP_HOST,
  port = Number(process.env.SMTP_PORT || 587),
  secure = process.env.SMTP_SECURE === 'true' || port === 465, // true for 465, false for 587/25
  user = process.env.SMTP_USER,
  pass = process.env.SMTP_PASS,
  from = process.env.MAIL_FROM,
} = {}) {
  if (!host || !user || !pass) {
    throw new Error('SMTP config missing. Ensure SMTP_HOST, SMTP_USER, SMTP_PASS are set.');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure, // use TLS for port 465
    auth: { user, pass },
    logger: true,
    debug: true,
    // Recommended TLS options; tweak if your server uses self-signed certs
    tls: {
      // rejectUnauthorized: false, // uncomment ONLY if you know you need to trust self-signed
      minVersion: 'TLSv1.2',
    },
  });

  // Optional: verify connection at startup
  transporter.verify().catch(err => {
    console.warn('[mailer] SMTP verify failed:', err.message);
  });

  // Attach default from address to the transporter
  transporter.__defaultFrom = from || user;
  return transporter;
}

/**
 * Send an email with text/HTML and optional attachments.
 * @param {object} transporter - nodemailer transporter
 * @param {object} options - { to, subject, text, html, cc, bcc, replyTo, attachments }
 * @returns {Promise<string>} Message ID
 */

// Optionally specify envelope explicitly (helps with policy issues)
async function sendMail(transporter, opts) {
  const info = await transporter.sendMail({
    from: opts.from || transporter.__defaultFrom,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    cc: opts.cc,
    bcc: opts.bcc,
    replyTo: opts.replyTo,
    attachments: opts.attachments,
    envelope: {
      from: (opts.from || transporter.__defaultFrom), // SMTP MAIL FROM
      to: Array.isArray(opts.to) ? opts.to : [opts.to] // RCPT TO list
    },
    headers: {
      'X-Source': 'NodeMailer-SMTP-Auth',
    },
  });

  console.log('Server response:', info.response);
  console.log('Accepted:', info.accepted);
  console.log('Rejected:', info.rejected);
  console.log('Pending:', info.pending);
  console.log('MessageId:', info.messageId);
  return info.messageId;
}

module.exports = {
  createTransporter,
  sendMail,
};