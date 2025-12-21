import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Kitobdosh - Tasdiqlash kodi',
    text: `Sizning tasdiqlash kodingiz: ${otp}. Bu kod 5 daqiqa davomida amal qiladi.`,
    html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
             <h1 style="color: #96C7B9;">Kitobdosh</h1>
             <p>Xush kelibsiz! Sizning tasdiqlash kodingiz:</p>
             <h2 style="font-size: 32px; letter-spacing: 5px; color: #1F2937;">${otp}</h2>
             <p style="color: #888;">Bu kod 5 daqiqa davomida amal qiladi.</p>
           </div>`
  };

  await transporter.sendMail(mailOptions);
};
