# Vercel Deployment Checklist

## Pre-Deployment

### 1. Environment Variables Tayyorlash
Vercel Dashboard → Settings → Environment Variables ga quyidagilarni qo'shing:

```bash
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kitobdosh

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-generate-with-openssl
NEXTAUTH_URL=https://yourdomain.vercel.app  # Vercel URL

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# JWT
JWT_SECRET=your-jwt-secret

# Pusher (Real-time)
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=...
NEXT_PUBLIC_PUSHER_KEY=...
NEXT_PUBLIC_PUSHER_CLUSTER=...

# Cloudinary (Images)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email (Choose one)
RESEND_API_KEY=re_...  # Recommended

# Redis (Upstash recommended for Vercel)
REDIS_HOST=... 
REDIS_PORT=6379
REDIS_PASSWORD=...
```

### 2. Build Test
```bash
npm run build
```
Xatolar bo'lsa tuzating.

### 3. Google OAuth Callback
Google Cloud Console'da:
- Authorized redirect URIs: `https://yourdomain.vercel.app/api/auth/callback/google`

---

## Deployment

### Option 1: Vercel CLI (Terminal)
```bash
# 1. Vercel CLI o'rnatish
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Production deploy
vercel --prod
```

### Option 2: GitHub Integration (Oson)
1. GitHub'ga push qiling
2. Vercel'da "Import Project" → GitHub repo tanlang
3. Environment Variables qo'shing
4. Deploy bosing

---

## Post-Deployment

### 1. Domain Setup (Optional)
- Vercel → Settings → Domains
- Custom domain qo'shing: `kitobdosh.uz`

### 2. Test Qilish
- [ ] Login/Register
- [ ] Email OTP kelishi
- [ ] Google OAuth
- [ ] Pusher real-time
- [ ] Cloudinary rasm yuklash
- [ ] Redis caching

### 3. Monitoring
- Vercel Dashboard → Functions logs
- Error tracking sozlang (Sentry)

---

## Troubleshooting

### "Module not found" xatolari:
```bash
npm install
npm run build
```

### Redis/MongoDB connection timeout:
- Vercel Functions: 10s timeout (Hobby plan)
- Upstash Redis ishlatish tavsiya etiladi

### Email yuborilmayapti:
- Environment variables to'g'ri qo'shilganini tekshiring
- Resend.com/SendGrid logs ko'ring

---

## Production Optimizations

### 1. Caching
Redis allaqachon sozlangan ✅

### 2. Image Optimization
Cloudinary allaqachon sozlangan ✅

### 3. Database Indexes
MongoDB'da index qo'shing:
- `users.email`
- `books.category`
- `orders.user`
- `notifications.user`

### 4. Rate Limiting (Kerak bo'lsa)
```bash
npm install @upstash/ratelimit
```

---

## Cost Estimate (Monthly)

- **Vercel**: $0 (Hobby) yoki $20 (Pro)
- **MongoDB Atlas**: $0 (Shared) yoki $9 (Dedicated)
- **Upstash Redis**: $0 (10K commands/day)
- **Resend Email**: $0 (100 emails/day)
- **Pusher**: $0 (200K messages/day)
- **Cloudinary**: $0 (25 credits)

**Total**: BEPUL yoki ~$20/oy (Pro features bilan)

---

## Final Check

✅ All environment variables set  
✅ Build successful locally  
✅ Google OAuth callback updated  
✅ Email provider configured  
✅ Redis/MongoDB accessible from Vercel  

**Ready to deploy!** 🚀
