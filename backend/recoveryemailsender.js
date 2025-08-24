// recoveryemailsender.js
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let validRecoveryCodes = {}; // store recovery codes in memory

function generateRecoveryCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendRecoveryCode(email) {
  const code = generateRecoveryCode();
  validRecoveryCodes[email] = code;
  console.log(`Stored recovery code for ${email}: "${validRecoveryCodes[email]}"`);

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP provider
    auth: {
      user: process.env.EMAIL_USER || 'factoryisland2025@gmail.com',
      pass: process.env.EMAIL_PASS || 'gmdvzpwkwarpalzk',
    },
  });

  const mailOptions = {
    from: '"Factory Island" <noreply@google.com>',
    to: email,
    subject: 'Factory Island Password Recovery',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Recovery</title>
</head>
<body style="font-family:Arial,sans-serif; background-color:#f6f6f6; margin:0; padding:0; height:100%;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
    <tr>
      <td align="center" valign="middle">
        <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; background:#fff; border-radius:8px; border:1px solid #dadce0;">
          <tr>
            <td align="center" style="padding-top:40px;">
              <img src="cid:factoryislandlogo" alt="Factory Island" style="width:74px; height:auto; margin-bottom:16px;">
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size:24px; color:#202124; font-weight:400; padding-bottom:8px;">
              Password Recovery
            </td>
          </tr>
          <tr>
            <td style="border-bottom:1px solid #dadce0; padding-bottom:20px;"></td>
          </tr>
          <tr>
            <td align="center" style="font-size:16px; color:#5f6368; padding:24px 40px 0;">
              We received a request to reset the password for <b>${email}</b>.
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size:16px; color:#202124; padding:20px 40px 8px;">
              Use this code to continue with your password reset:
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <div style="font-size:32px; font-weight:bold; letter-spacing:2px; color:#202124; padding:12px 24px; background-color:#f1f3f4; border:1px solid #dadce0; border-radius:4px; display:inline-block;">
                ${code}
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size:14px; color:red; font-weight:bold; padding:0 40px 20px;">
              Please do not share this code with anyone.
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size:14px; color:#5f6368; padding:0 40px 20px;">
              This code will expire in 60 seconds.
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size:14px; color:#5f6368; padding:0 40px 40px;">
              If you didn’t request this, you can safely ignore this email.
            </td>
          </tr>
        </table>
        <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; margin-top:8px; text-align:center; padding:12px 20px 20px;">
          <tr>
            <td style="font-size:12px; color:#9aa0a6; line-height:1.5;">
              You received this email to let you know about important changes to your Factory Island account and services.<br>
              © 2025 Factory Island
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    attachments: [
      {
        filename: 'factoryislandtrans2.png',
        path: path.resolve(__dirname, '../src/assets/factoryislandtrans2.png'),
        cid: 'factoryislandlogo',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}
