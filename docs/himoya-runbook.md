# Kitobdosh himoya runbook — 2026-11-06

Bu hujjat shu branchdagi lokal tekshiruvga tayanadi. Production tayyor deb hisoblanmaydi. Merge va deploy qilinmagan.

## Hozirgi holat

| Qatlam | Holat |
|---|---|
| `master` | Himoya tuzatishlari va kitob almashuvi yo‘q. Oxirgi commit `71d7fec`. |
| PR #4 | `fix/defense-stability-2026-11-06` ga qo‘shilgan. `master`da emas. |
| PR #3 | Draft, `master`ga ochiq, PR #4 ni o‘z ichiga oladi. |
| PR #5 | Ochiq, almashuv. Bazasi stability branch, `master` emas. |
| Shu branch | PR #5 ustida: bekor qilingan buyurtma zaxirani bir marta qaytaradi, takroriy buyurtma bosilishi to‘siladi, seedga ikkinchi kitobxon va kuryer qo‘shiladi, rad etish testi bor. |
| `https://kitobdosh-zcet.vercel.app` | 2026-11-05 23:52 UTC: HTTP 404, `DEPLOYMENT_NOT_FOUND`. Jonli demo sifatida ishlatmang. |
| Vercel preview | Yaratilgan, lekin SSO ortida. Hosted ilova bu tekshiruvda ochilmadi. |

Namoyishni lokal ilova va alohida `kitobdosh_demo` bazasida qiling. “Bu lokal demo” deb ayting.

## Shu yerda bajarilgan tekshiruv

Muhit: vaqtinchalik lokal MongoDB 8.0.4 replica set, Redis 7.0.15, production build. Cloudinary va Resend mock. Payme faqat lokal mock RPC. Tashqi email, pul va production yozuv yo‘q.

| Buyruq | Natija |
|---|---|
| `npm test` | exit 0, 9/9 |
| `npm run lint` | exit 0, 0 xato, 24 ta eski ogohlantirish |
| `npm run build` | exit 0. Lint o‘chirilmagan |
| `MONGOD_BIN=... npm run test:audit:local` | exit 0, 18/18. Ichida zaxira qaytarish, almashuv rad/qabul/ikki tasdiq/sharq, mobil va desktop UI |
| `AUDIT_TEST_SCRIPT=tests/defense-journey.e2e.cjs npm run test:audit:local` | exit 0. Naqd xarid va ijara, admin, kuryer yetkazishi, parent order `completed`, ijara `active`, `paymentStatus` `pending` |
| `npm run seed:demo` ikki marta | 4 hisob, 1 kitob. `NODE_ENV=production` va noto‘g‘ri baza nomi rad etildi |

`npm run test:defense` alohida ishga tushirilgan server talab qiladi va bu safar qayta ishga tushirilmadi. Uning eski “o‘tdi” yozuvini yangi dalil deb olmang.

## 7 daqiqalik ssenariy

Ikki brauzer profili. Parolni o‘zingiz `DEMO_PASSWORD` qilib belgilagan bo‘ling. Parolni slaydga yozmang.

| Vaqt | Nima qilish | Nima deyish |
|---|---|---|
| 0:00 | `demo-user@example.invalid` bilan kiring. Sahifani yangilang. | Sessiya saqlanadi. |
| 0:40 | `/mainPage/sotibolish`. Demo kitobni oching. Mavjud bo‘lmagan so‘rov yuboring. | Bo‘sh natija soxta kitob qo‘shmaydi. |
| 1:20 | Tezkor xarid: ism, telefon, olib ketish, naqd, bir marta tasdiqlang. | Bu to‘lov emas. Holat `pending`. |
| 2:00 | Kabinetda buyurtmani ko‘rsating. | Yozuv shu hisobga tegishli. |
| 2:20 | Ikkinchi oynada `demo-reader@example.invalid`. Ikkala hisob `/mainPage/almashish` yoki telefonda `/mobile/almashish`. | Har biri o‘z kitobini e’lon qiladi. Aloqa hozir ochiq emas. |
| 3:10 | Birinchi taklifni ikkinchi hisob yangilagach rad etadi. | Holat “Rad etildi”. Hisoblagich 0. |
| 3:40 | Yangi taklif. Ikkinchi hisob qabul qiladi. | Endi ikkala tomon bir-birining aloqasini ko‘radi. Boshqa hisob ko‘rmaydi. |
| 4:20 | Ikkalasi “Almashuv tugaganini tasdiqlash” ni bosadi. Birinchi hisob sharh yozadi. | Ikkinchi tasdiqdan keyin “1 marta almashilgan”. Sharh kartada ko‘rinadi. |
| 5:10 | 390 px. Mobil kitobdan ijara, naqd, kuryer. | Yana `pending`. Pul yechilmagan. |
| 5:50 | `demo-admin@example.invalid`. Xaridni “Tasdiqlash (Kuryerga)”, ijarani tasdiqlang. | Admin oddiy foydalanuvchi API’siga kira olmaydi. |
| 6:20 | `demo-courier@example.invalid`. Qabul, admin kitobni beradi, yo‘lga chiqish, yetkazish. | Xarid `completed`, ijara `active`. Naqd pul hali `pending`. |
| 6:50 | Foydalanuvchi kabinetida “Yetkazildi” va “Ijara faol”. | Yetkazish pul qabul qilinganini bildirmaydi. |

Ikkinchi oyna yangi taklifni o‘zi yangilamaguncha ko‘rmaydi. Sahifada shu haqda qisqa eslatma bor.

Agar xaridni bekor qilsangiz, `pending` yoki `processing` buyurtma zaxirani bir marta qaytaradi va ochiq ijarani `rejected` qiladi. Qayta bekor qilish zaxirani ikkinchi marta oshirmaydi. Yetkazilgan buyurtma bekor qilinmaydi.

## Zaxira

- Sayt yoki internet ishlamasa: lokal app va demo bazada shu tartib. Jonli saqlash bo‘ldi demang.
- Baza ishlamasa: `docs/screenshots/exchange/` va journey skrinshotlari. Yangi buyurtma yaratildi demang.
- Replica set bo‘lmasa: buyurtma va almashuv 503 beradi. Standalone MongoDB bilan muvaffaqiyatni ko‘rsatmang.
- Email yoki Google so‘ralsa: tayyor demo hisob. OTP haqiqiy xatga yetib borgani tasdiqlanmagan.
- To‘lov so‘ralsa: faqat naqd. Payme live yoqilmagan. Click yo‘q.
- Rasm yuklanmasa: seeddagi `/demo-book.svg`. Buni Cloudinary muvaffaqiyati demang.

## Mock va tasdiqlanmagan

Ishlaydi deb aytilgan, lekin faqat lokal mock: Cloudinary upload, Resend OTP, Payme sandbox RPC.

Umuman tasdiqlanmagan: hosted preview, production deploy, haqiqiy email, haqiqiy Payme, Google OAuth, Pusher, xarita tili, cron, haqiqiy pasport hujjati, qurilmadagi mobil brauzer.

## Lokal ishga tushirish

`MONGO_URI` localhost replica set bo‘lsin. `MONGO_DB_NAME=kitobdosh_demo`. `NEXTAUTH_SECRET` va `NEXTAUTH_URL` bering. Redis bo‘lsa savatcha sinxronlashadi; bo‘lmasa katalog bazadan ochiladi.

Seed: `DEMO_SEED_CONFIRM=local-demo-only` va kamida 12 belgili `DEMO_PASSWORD`. `npm run seed:demo`. Productionda ishlatmang.

`npm run build`, keyin `npm start`. Bir papkada `dev` va `start` ni birga yuritmang.

## Merge va deploy rejasi

Hozir qo‘shmang va deploy qilmang.

Tasdiqdan keyin eng sodda yo‘l: shu branchni `master`ga qo‘shish. U PR #3, #4 va #5 commitlarini ham o‘z ichiga oladi. Keyin #3 va #5 ni yopish mumkin. Shu PR hozir `fix/defense-book-exchange` ga qaragan, diff faqat yangi tuzatishlar.

Agar qatlam-qatlam ko‘rmoqchi bo‘lsangiz: PR #3 ni draftdan chiqarib `master`ga, keyin PR #5, keyin shu PR.

Deploydan oldin Vercelda alohida preview bazasi, replica set, `NEXTAUTH_URL` va secretlarni tekshiring. Payme live ni yoqmang. Production bazasida seed ishlatmang.

## Google bilan kirish — 2026-11-06 05:06 Toshkent

Foydalanuvchi `kitobdosh.com` da Google orqali kirdi va “Access Denied” / “You do not have permission to sign in.” matnini ko‘rdi. Manzil `kitobdosh.com/api/a...` bilan boshlanadi. Bu NextAuthning `/api/auth/error?error=AccessDenied` sahifasi. Google o‘zi bu matnni `accounts.google.com` da ko‘rsatadi; bu yerda matn bizning domenimizda.

Tekshiruv, haqiqiy hisob yaratmasdan:

- `https://kitobdosh.com` va `https://kitobdosh.vercel.app` bir xil ETag bilan ochiladi. `https://kitobdosh-zcet.vercel.app` esa `DEPLOYMENT_NOT_FOUND`.
- `www.kitobdosh.com` `https://kitobdosh.com/` ga 307 qiladi.
- `GET /api/auth/providers` Google va credentials ni ko‘rsatadi. Callback: `https://kitobdosh.com/api/auth/callback/google`. Demak, Google ilovasi shu manzilni qabul qilgan va foydalanuvchini saytga qaytargan. `redirect_uri_mismatch` bo‘lsa, odam `accounts.google.com` da qolardi.
- `GET /api/books` 12 soniyada 0 bayt qaytardi. Jonli katalog bazaga ulana olmayapti.
- Eski `signIn` har qanday xatoni ushlab `false` qaytaradi. NextAuth buni “Access Denied” qilib ko‘rsatadi. Bazaga ulanish xatosi ham shu matnga aylanadi.

Lokal Mongo’da `password: null` va katta-kichik harfli email o‘zi Access Denied bermadi. Asosiy jonli to‘siq — production Mongo. Kod endi emailni normallaydi, bir xil emailni qayta yaratmaydi, `javascript:` avatar ni tashlaydi va bazaga ulanmasa “Server error / configuration” ko‘rsatadi. Bu Google konsolidagi test-user ro‘yxatini o‘zgartirmaydi va login cheklovini o‘chirmaydi.

Google konsolida ruxsat etilgan redirect URI: `https://kitobdosh.com/api/auth/callback/google`. `NEXTAUTH_URL` `https://kitobdosh.com` bo‘lsin. `GOOGLE_CLIENT_ID` va `GOOGLE_CLIENT_SECRET` Vercelda bo‘lishi kerak; ularning qiymati bu tekshiruvda o‘qilmagan. Mongo `MONGO_URI` Vercel serveridan ochilishi kerak. Lokalhost URI yoki Atlas IP cheklovi shu xatoni qaytaradi.

Haqiqiy Google hisobi bilan productionda qayta urinilmadi. Shu sababli Google kirish jonli saytda tuzatildi deb aytilmaydi.

## Egasi qilishi shart bo‘lgan ishlar

1. Lokal `DEMO_PASSWORD` ni o‘zingiz belgilang. Repoda va bu hujjatda yo‘q.
2. Production deployment yo‘q. Qayta deploy faqat siz tasdiqlaganingizdan keyin.
3. Preview SSO ortida. Hosted muhitdagi Mongo, Redis va NextAuth sozlamalarini o‘zingiz tekshiring.
4. Haqiqiy Resend, Cloudinary, Google, Pusher va Payme kalitlari bu tekshiruvda ishlatilmadi. Ularni chatga yozmang.
5. MongoDB replica set bo‘lishi kerak. Standalone demo buyurtma va almashuvni sindirmaydi.
6. Git tarixidagi eski hujjat fayllari tozalanmagan. Himoyada tarixni ochmang.
7. `npm run test:defense` ni o‘z noutbukingizdagi demo bazada bir marta qayta ishga tushiring. Bu agent uni bu safar ishga tushirmadi.
