# Email System Configuration for Vercel Deployment

## Hozirgi Muammo
Gmail SMTP production'da (Vercel) ishlamaydi chunki:
1. Gmail "less secure apps" ni qo'llab-quvvatlamaydi
2. Vercel serverless function'lari uchun ishonchsiz
3. Rate limiting muammolari

## Yechim: Professional Email Provider Ishlatish

### Tavsiya Etiladigan Providerlar:

#### 1. **Resend.com** (ENG OSON) ✅ RECOMMENDED
- **Narx:** 100 dona/kun BEPUL, keyin $20/oy
- **Sozlash:** 5 daqiqa
- **Vercel bilan:** Native integration

**Setup:**
```bash
npm install resend
```

```javascript
// lib/email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTP = async (email, otp) => {
  await resend.emails.send({
    from: 'Kitobdosh <noreply@yourdomain.com>',
    to: email,
    subject: 'Kitobdosh - Tasdiqlash kodi',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #96C7B9;">Kitobdosh</h1>
        <p>Sizning tasdiqlash kodingiz:</p>
        <h2 style="font-size: 32px; color: #1F2937;">${otp}</h2>
        <p style="color: #888;">Bu kod 5 daqiqa davomida amal qiladi.</p>
      </div>
    `
  });
};
```

**Environment Variables (Vercel):**
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

---

#### 2. **SendGrid** (PROFESSIONAL)
- **Narx:** 100 dona/kun BEPUL
- **Sozlash:** 10 daqiqa

```bash
npm install @sendgrid/mail
```

```javascript
// lib/email.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOTP = async (email, otp) => {
  await sgMail.send({
    to: email,
    from: 'noreply@kitobdosh.uz',
    subject: 'Kitobdosh - Tasdiqlash kodi',
    html: `...` // HTML template
  });
};
```

---

#### 3. **Mailgun**
- **Narx:** 5,000 dona/oy BEPUL
- **Sozlash:** 10 daqiqa

---

## Vercel Deploy Uchun Checklist:

### .env.local sozlamalari (LOCAL):
```bash
# Email Provider (choose one)
RESEND_API_KEY=re_xxxxx
# OR
SENDGRID_API_KEY=SG.xxxxx
# OR
MAILGUN_API_KEY=xxxx
MAILGUN_DOMAIN=mg.yourdomain.com

# Other existing configs
MONGO_URI=mongodb+srv://...
REDIS_HOST=...
REDIS_PORT=6379
REDIS_PASSWORD=...
NEXTAUTH_SECRET=...
PUSHER_APP_ID=...
```

### Vercel Environment Variables:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Barcha `.env.local` dagi o'zgaruvchilarni qo'shing
3. **NEXTAUTH_URL** ni production URL'ga o'zgartiring:
   ```
   NEXTAUTH_URL=https://kitobdosh.vercel.app
   ```

### Domain Setup (Agar kerak bo'lsa):
1. Custom domain qo'shing (kitobdosh.uz)
2. Email provider'da domain verify qiling
3. From address: `noreply@kitobdosh.uz`

---

## Test Qilish:

### Local:
```bash
# .env.local ni to'ldiring
npm run dev
# Register formani test qiling
```

### Vercel (Production):
```bash
vercel env pull .env.local  # Environment variables yuklab olish
npm run build              # Build tekshirish
vercel --prod              # Deploy
```

---

## Tavsiyam:
1. **Resend.com** eng oson - 5 daqiqada ishga tushadi
2. Domain'ingiz bo'lsa: `noreply@kitobdosh.uz`
3. Domain yo'q bo'lsa: Resend bergan test domain ishlatish mumkin
4. BEPUL tier yetarli (kuniga 100 email ko'p narsa)

Qaysi provider'ni tanlaymiz?
