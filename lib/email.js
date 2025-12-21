import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send OTP email using Resend
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP code
 */
export const sendOTP = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Kitobdosh <onboarding@resend.dev>', // Resend test domain
      to: email,
      subject: 'Kitobdosh - Tasdiqlash kodi',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: 0 auto;">
          <h1 style="color: #96C7B9; margin-bottom: 20px;">Kitobdosh</h1>
          <p style="font-size: 16px; color: #333;">Xush kelibsiz! Sizning tasdiqlash kodingiz:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h2 style="font-size: 36px; letter-spacing: 8px; color: #1F2937; margin: 0;">${otp}</h2>
          </div>
          <p style="color: #888; font-size: 14px;">Bu kod 5 daqiqa davomida amal qiladi.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">Agar siz bu kodni so'ramagan bo'lsangiz, bu xabarni e'tiborsiz qoldiring.</p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Resend Email Error:', error);
      throw error;
    }

    console.log('✅ Email yuborildi:', email, '- Message ID:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ Email yuborishda xatolik:', error);
    throw error;
  }
};
