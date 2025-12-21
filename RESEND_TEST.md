# Resend Email Testing Guide

## ✅ Sozlandi!

### API Key
```
RESEND_API_KEY=re_cRtWwyLk_GHPsSzUh33GbKanUKxzLhcyA
```

## 🧪 Test Qilish (Local)

### 1. Server'ni qayta ishga tushiring:
```bash
# Ctrl+C bilan to'xtating
npm run dev
```

### 2. Register formani ochish:
- Brauzerda: `http://localhost:3000`
- Register tugmasini bosing

### 3. Email va parol kiriting:
- **Email:** O'zingizning real emailingiz (Gmail, Outlook, etc.)
- **Parol:** Kamida 6 belgidan iborat

### 4. Emailingizni tekshiring:
- From: `Kitobdosh <onboarding@resend.dev>`
- Subject: `Kitobdosh - Tasdiqlash kodi`
- 6 raqamli kod ko'rinadi

### 5. Kodni kiriting va davom eting!

---

## 📊 Resend Dashboard

Barcha yuborilgan emaillarni ko'rish uchun:
1. [resend.com/emails](https://resend.com/emails) - Login
2. Har bir email:
   - ✅ Delivered
   - 📧 Email address
   - 🕐 Timestamp
   - 👁️ Preview

---

## ⚠️ Limitlar

**Resend Test Domain:**
- 100 email/kun (BEPUL)
- Faqat `onboarding@resend.dev` dan yuboriladi

**Custom Domain (Keyinchalik):**
- Domain qo'shish: Settings → Domains
- From: `noreply@kitobdosh.uz`
- Ko'proq email (kuniga 3,000+)

---

## 🚀 Vercel'ga Deploy

### 1. Vercel Dashboard → Environment Variables:
```
RESEND_API_KEY=re_cRtWwyLk_GHPsSzUh33GbKanUKxzLhcyA
```

### 2. Deploy:
```bash
vercel --prod
```

### 3. Production'da test qiling!

---

## 🔧 Troubleshooting

### Email kelmayapti?
1. **Spam folder** tekshiring
2. **Console logs** ko'ring: `✅ Email yuborildi:`
3. **Resend Dashboard** da ko'ring: Delivered status

### Error: "Invalid API key"?
- `.env.local` fayl to'g'ri joylashganini tekshiring
- Server'ni qayta ishga tushiring (`npm run dev`)

### Vercel'da ishlamayapti?
- Environment variables to'g'ri qo'shilganini tekshiring
- Function logs ko'ring: Vercel → Deployments → Functions

---

## ✨ Next Steps

- [ ] Local'da test qiling
- [ ] Production'ga deploy qiling
- [ ] Custom domain qo'shing (optional)
- [ ] Email template'ni customize qiling (optional)

**Email tizimi tayyor!** 📧🎉
