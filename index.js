require('dotenv').config();
const { createTransporter, sendMail } = require('./Email/setup');

(async () => {
  try {
    const transporter = createTransporter();

    const messageId = await sendMail(transporter, {
      to: process.env.MAIL_TO,
      subject: 'Test email from Sendgrid',
      text: 'Hello! Testing the new Sendgrid configuration.',
      html: `<p>Hello! This is an <b>HTML</b> email.</p>`,
      // Optional extras:
      // cc: 'cc@example.com',
      // bcc: 'audit@example.com',
      // replyTo: 'helpdesk@example.com',
      // attachments: [
      //   { filename: 'readme.txt', content: 'Attachment content' },
      //   { filename: 'report.pdf', path: './report.pdf' },
      // ],
    });

    console.log('Mail sent. Message ID:', messageId);
  } catch (err) {
    console.error('Failed to send mail:', err);
    process.exitCode = 1;
  }
})();
