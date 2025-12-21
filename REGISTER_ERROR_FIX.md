# Register API 500 Error - Yechim

## Muammo
`POST /api/auth/register 500` xatoligi

## Sabab
`.env.local` faylga `RESEND_API_KEY` qo'shilgan, lekin Next.js serveri restart qilinmagan.

## ✅ Yechim

### 1. Server'ni Restart Qiling:

**Terminal'da:**
```bash
# Ctrl+C bosib server'ni to'xtating
# Keyin qayta ishga tushiring:
npm run dev
```

### 2. Browser Cache'ni Tozalang (Optional):
- `Ctrl+Shift+R` (hard reload)

### 3. Qayta Test Qiling:
- Register formani oching
- Email va parol kiriting
- OTP kod emailingizga kelishi kerak

---

## Agar Hali Ham Ishlamasa:

### `.env.local` faylni tekshiring:
```bash
RESEND_API_KEY=re_cRtWwyLk_GHPsSzUh33GbKanUKxzLhcyA
```

### Console logs'ni ko'ring:
Terminal'da quyidagi xabarlarni izlang:
- `✅ Email yuborildi:` - muvaffaqiyat
- `❌ Email yuborishda xatolik:` - xato

---

## Agar Resend Xatolik Bersa:

### 1. API Key'ni tekshiring:
- [resend.com/api-keys](https://resend.com/api-keys)
- Yangi key yaratish mumkin

### 2. Test Domain:
Resend test domain: `onboarding@resend.dev`
- Faqat siz ro'yxatdan o'tgan emailga yuboradi
- Production'da custom domain kerak

---

## Debug:

### Terminal'da qidirilsin:
```
Email yuborishda xato (Lekin davom etyapmiz): [ERROR MESSAGE]
```

Bu xabar API key muammosini ko'rsatadi.

---

**Eslatma:** `.env.local` o'zgartirilgandan keyin DOIM server'ni restart qilish kerak!
