import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendRecoveryCode, validRecoveryCodes } from './recoveryemailsender.js';


// Recreate __dirname in ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Store current valid codes keyed by email
const validCodes = {};

// Store expired codes keyed by email — each is an array of codes
const expiredCodes = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'factoryisland2025@gmail.com',
    pass: 'gmdvzpwkwarpalzk',
  },
});

app.post('/send-code', async (req, res) => {
    let { email, code } = req.body;
    console.log('Send-code request body:', req.body);
  
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }
  
    email = email.trim().toLowerCase();
    code = String(code).trim();
  
    if (validCodes[email]) {
      if (!expiredCodes[email]) expiredCodes[email] = [];
      expiredCodes[email].push(validCodes[email]);
    }
  
    validCodes[email] = code;
  
    console.log(`Stored valid code for ${email}: "${validCodes[email]}"`);
  
    const mailOptions = {
      from: '"Factory Island" <noreply@google.com>',
      to: email,
      subject: 'Confirm Your Account Registration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Confirm Your Account Registration</title>
        </head>
        <body style="font-family:Arial,sans-serif; background-color:#f6f6f6; margin:0; padding:0; height:100%;">

          <!-- Full height wrapper table -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%" style="height:100%;">
            <tr>
              <td align="center" valign="middle">

                <!-- Main white box -->
                <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; background:#fff; border-radius:8px; border:1px solid #dadce0;">
                  <tr>
                    <td align="center" style="padding-top:40px;">
                      <img src="cid:factoryislandlogo" alt="Factory Island" style="width:74px; height:auto; margin-bottom:16px;">
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:24px; color:#202124; font-weight:400; padding-bottom:8px;">
                      Confirm Your Account
                    </td>
                  </tr>
                  <tr>
                    <td style="border-bottom:1px solid #dadce0; padding-bottom:20px;"></td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:16px; color:#5f6368; padding:24px 40px 0;">
                      We received a request to register an account using <b>${email}</b> for Factory Island.
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:16px; color:#202124; padding:20px 40px 8px;">
                      Use this code to complete your registration:
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
                      If you didn’t request this registration, you can safely ignore this email.
                    </td>
                  </tr>
                </table>

                <!-- Footer -->
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
        `
        ,
      attachments: [
        {
          filename: 'factoryislandtransparent.png',
          path: path.resolve(__dirname, '../src/assets/factoryislandtransparent.png'),
          cid: 'factoryislandlogo'
        }
      ]
    };
    
    
    
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });
  
// recovery email forgot password 

app.post('/recovery-send-code', async (req, res) => {
  const { email } = req.body;
  try {
    await sendRecoveryCode(email);
    res.status(200).json({ success: true, message: 'Recovery code sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to send recovery code.' });
  }
});


// recovery code route 
app.post('/recovery-verify-code', (req, res) => {
  const { email, code } = req.body;

  if (!email || !code)
    return res.status(400).json({ error: 'Email and code are required' });

  if (validRecoveryCodes[email] === code) {
    delete validRecoveryCodes[email];
    return res.status(200).json({ message: 'Recovery code verified' });
  } else {
    return res.status(400).json({ error: 'Invalid or expired code' });
  }
});


app.post('/verify-code', (req, res) => {
    let { email, code } = req.body;
  
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }
  
    email = email.trim().toLowerCase();
    code = String(code).trim();
  
    console.log("Verify request:", { email, code });
    console.log("Current validCodes:", validCodes);
    console.log(`Valid code for ${email}: "${validCodes[email]}"`);
    console.log(`Expired codes for ${email}:`, expiredCodes[email] || []);
  
    if (validCodes[email] === code) {
      delete validCodes[email];
      return res.status(200).json({ message: 'Code verified' });
    } else if ((expiredCodes[email] || []).includes(code)) {
      return res.status(400).json({ error: 'This code is expired.' });
    } else {
      return res.status(400).json({ error: 'Invalid confirmation code.' });
    }
  });
  
  

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
