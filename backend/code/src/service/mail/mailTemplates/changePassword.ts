import { SendMailOptions } from 'nodemailer';
const changePasswordTemplate = {
  subject: 'Password Change Successful',
  html: `
  <h2> Hi {{userName}}, </h2>
  Your password has been changed successfully. Please login with your new credentials.`,
} as SendMailOptions;

export = changePasswordTemplate;
