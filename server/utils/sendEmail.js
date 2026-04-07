const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
require("dotenv").config();

const sendEmail = async (options) => {
  try {
    // ✅ 1. Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // ✅ 2. Mailgen setup
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'AutoHub',
        link: process.env.FRONTEND_URL || 'http://localhost:5173',
      },
    });

    // ✅ 3. Email content (dynamic 🔥)
    const emailContent = {
      body: {
        name: options.name || 'User',
        intro: options.intro || 'Welcome to AutoHub!',

        action: options.action && {
          instructions: options.action.instructions,
          button: {
            color: '#22BC66',
            text: options.action.text,
            link: options.action.link,
          },
        },

        outro:
          options.outro ||
          'If you did not request this, you can safely ignore this email.',
      },
    };

    // ✅ 4. Generate HTML & TEXT
    const emailHtml = mailGenerator.generate(emailContent);
    const emailText = mailGenerator.generatePlaintext(emailContent);

    // ✅ 5. Email options
    const message = {
      from: `${process.env.FROM_NAME || 'AutoHub'} <${process.env.SMTP_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: emailHtml,
      text: emailText,
    };

    // ✅ 6. Send mail
    const info = await transporter.sendMail(message);

    console.log('Message sent:', info.messageId);
  } catch (error) {
    console.error('Email Error:', error);
    throw error;
  }
};

module.exports = sendEmail;