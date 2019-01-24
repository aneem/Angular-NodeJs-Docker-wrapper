import { SendMailOptions } from 'nodemailer';
const resetPasswordTemplate = {
  subject: 'Password Reset',
  html: `
  <h2> Hi {{userName}}, </h2>
  You have requested for password reset.
  <br>Please use <i>{{newPassword}}</i> as your password.`,
} as SendMailOptions;

export = resetPasswordTemplate;
