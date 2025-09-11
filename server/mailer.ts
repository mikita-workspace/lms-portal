import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'nova-academy@mail.ru',
    pass: process.env.EMAIL_OWNER_PASS,
  },
});
