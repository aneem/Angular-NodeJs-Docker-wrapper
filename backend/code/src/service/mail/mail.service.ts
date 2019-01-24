import * as nodemailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Injectable } from '@nestjs/common';

// create reusable transporter object using the default SMTP transport

// setup email data with unicode symbols
// let mailOptions = {
//     from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
//     to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
//     subject: 'Hello ✔', // Subject line
//     text: 'Hello world text?', // plain text body
//     html: '<b>Hello world html?</b>' // html body
// };

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    } as SMTPTransport.Options);
  }

  sendEmail(mailOptions: nodemailer.SendMailOptions) {
    // default sender is the registered SMTP email address
    mailOptions.from = mailOptions.from || process.env.SMTP_USER;

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        }
        resolve(info);
      });
    });
  }

  replacePlaceholder(
    text: string,
    placeholderValues: Map<string, string>,
  ): string {
    placeholderValues.forEach((value, placeholder) => {
      text = text.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
    });
    return text;
  }
}
