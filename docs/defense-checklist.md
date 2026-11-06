> Joriy namoyish tartibi va tekshiruv natijalari: [himoya-runbook.md](himoya-runbook.md). Quyidagi eski bandlar to‘liq joriy holat emas. Order/Rent/stock va kitob almashuvi uchun MongoDB replica set talab qilinadi. Onlayn to‘lov UI’da yopiq. Production manzil `https://kitobdosh-zcet.vercel.app` 2026-11-05 23:52 UTC da `DEPLOYMENT_NOT_FOUND` qaytardi.

# Kitobdosh himoya nazorat ro‘yxati — 2026-11-06

## Holat va chegaralar

Loyiha: Next.js 14 App Router, React 18, JavaScript, Tailwind, Redux Toolkit/RTK Query, NextAuth JWT sessiyasi, Mongoose/MongoDB. Redis: katalog keshi, OTP va savatcha sinxronlash. Cloudinary: rasmlar/hujjatlar. Resend: OTP xati. Pusher: realtime. Leaflet/OpenStreetMap/Nominatim: xarita. Vercel konfiguratsiyasida kunlik cron mavjud.

Repo toza `master`dan `fix/defense-stability-2026-11-06` branchiga olindi. AGENTS.md topilmadi. Mavjud README, deploy, registratsiya/email va Payme hujjatlari o‘qildi. Ularning eski “tayyor” yozuvlari tekshiruv isboti emas. Asosiy branchga merge va production deploy bajarilmadi.

## Kodda mavjud funksiyalar

- Foydalanuvchi: email/parol va Google orqali kirish, email OTP orqali ro‘yxatdan o‘tish, desktop/mobil katalog, qidirish/kategoriya, kitob tafsiloti, sevimlilar, savatcha, sotib olish va ijara so‘rovi, profil, buyurtma/ijara tarixi, taqriz, bildirishnoma, murojaat.
- Admin: statistika, kitob yaratish/tahrirlash/o‘chirish, buyurtma va ijara holatlari, foydalanuvchilar, kuryerlar, do‘konlar, promo bannerlar, murojaatlarga javob, sozlamalar.
- Kuryer: topshiriqlar, olish/yetkazish/qaytarish holatlari, profil.
- Tashqi integratsiyalar: Google OAuth, Resend, Redis, Cloudinary, Pusher, Payme, xarita.
- Kitob almashish shu branchda bor: ikki hisob, taklif, qabul/rad, ikki tomonlama tasdiq, hisoblagich va sharh. Click integratsiyasi yo‘q. Uni himoyada ishlaydi deb ko‘rsatmang.

Bu ro‘yxat mavjud kodni sanaydi; hammasi end-to-end tekshirilgan degani emas.

## Himoyadan oldin

1. Shu branchni alohida lokal nusxada oching. `npm ci`, `npm test`, `npm run lint`, `npm run build` bajaring. `npm start` uchun build tugagan bo‘lishi kerak. Bir papkada dev va build/start jarayonlarini bir paytning o‘zida ishlatmang.
2. Faqat alohida localhost MongoDB demo bazasi tayyorlang. Seed uchun `MONGO_URI`, `MONGO_DB_NAME`, `DEMO_PASSWORD`, `DEMO_SEED_CONFIRM` belgilang. Baza nomi `kitobdosh_demo` yoki `kitobdosh_test` bilan boshlansin; tasdiq qiymati `local-demo-only`. `NODE_ENV=production` bilan seed rad etiladi. `npm run seed:demo` mavjud Demo yozuvlarini ko‘paytirmaydi. Production’da ishlatmang.
3. Demo hisoblar: `demo-user@example.invalid`, `demo-reader@example.invalid`, `demo-admin@example.invalid`, `demo-courier@example.invalid` (rol `kurer`). Parolni `DEMO_PASSWORD` orqali o‘zingiz belgilang. U kodda va hisobotda yozilmaydi. Seed qayta ishlatilsa mavjud hisob parolini almashtirmaydi, yetishmayotgan hisoblarni qo‘shadi.
4. App uchun `MONGO_URI`, `MONGO_DB_NAME`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` sozlang. `MONGO_DB_NAME` berilmasa avvalgi `feruza_book` nomi saqlanadi. Demo uchun albatta alohida nom bering.
5. Redis bo‘lmasa katalog bazadan ishlaydi, savatchaning shu qurilma va hisob uchun lokal nusxasi saqlanadi; server sinxronlash xatosi ochiq ko‘rsatiladi. OTP va qurilmalararo savatcha uchun Redis kerak.
6. Brauzer testini qaytarish: `npx playwright install chromium`, keyin lokal app va demo baza ishlayotgan holatda `DEFENSE_BASE_URL`, `MONGO_URI`, `MONGO_DB_NAME`, `DEMO_PASSWORD` bilan `npm run test:defense`. Test faqat localhost/demo bazani qabul qiladi. Faqat shu bazaga Demo buyurtmalar va kitoblar yozadi.
7. Noutbukda 1440 px va telefonda 390 px ko‘rinishni oldindan oching. Admin va foydalanuvchi uchun alohida browser profili yoki private oyna ishlating. Internet uzilishi ehtimoli uchun lokal app, demo baza va skrinshotlarni tayyor tuting.

## 5–7 daqiqalik tekshirilgan namoyish

| Vaqt | Amallar va ko‘rsatiladigan dalil |
|---|---|
| 0:00–0:45 | Lokal login sahifasi, Demo foydalanuvchi bilan kirish. Sahifani yangilang: sessiya saqlanadi. |
| 0:45–1:45 | Desktop katalogini oching. Demo kitob rasmi, narxi, kategoriya va tafsilotlarini ko‘rsating. Qidiruvni tushuntiring; mavjud bo‘lmagan natijaga soxta ma’lumot qo‘shilmaydi. |
| 1:45–3:00 | Katalogdagi tezkor xarid tugmasini oching. Demo ism va Demo telefon kiriting, olib ketish va naqd usulini tanlang. Bu pul o‘tkazish emas, `pending` buyurtma yaratadi. |
| 3:00–3:45 | Shaxsiy kabinetda yangi buyurtma, summasi va holatini ko‘rsating. Saqlangan yozuv foydalanuvchi hisobiga tegishli ekanini tushuntiring. |
| 3:45–4:30 | Mobil bosh sahifa va `/mobile/book/<id>` tafsilotini oching. Demo rasm, kitob nomi va mavjud ma’lumotlarni ko‘rsating. |
| 4:30–5:45 | Demo admin bilan kiring. Kitoblar panelida Demo kitobni tahrirlang, saqlang va ro‘yxatda yangi nomni ko‘rsating. |
| 5:45–6:30 | Admin chiqish tugmasi bilan sessiyani tugating. Oddiy foydalanuvchiga admin API ruxsat bermasligini testlar bilan tushuntiring. |

Cloudinary orqali yangi fayl yuklash, haqiqiy OTP xati, Google OAuth, Payme/Click, kuryer topshirig‘i va xaritani bu kafolatlangan tartibga qo‘shmang: ular real tashqi xizmat bilan to‘liq tasdiqlanmagan.

## Halol zaxira yo‘li

- Internet yoki production ishlamasa: oldindan ishga tushirilgan lokal app va alohida Demo bazada yuqoridagi tekshirilgan tartibni ko‘rsating. “Bu lokal demo muhiti” deb ayting.
- Baza ishlamasa: skrinshotlar va test hisobotini ko‘rsating; “jonli saqlash ishladi” demang. Loading yoki xatoni yashirmang.
- Email/Google ishlamasa: oldindan tayyorlangan Demo hisob bilan email/parol orqali kiring. OTP tekshiruvi UI mock bilan sinalganini, haqiqiy xat yetkazilishi tasdiqlanmaganini ayting.
- To‘lov: faqat naqd/olib ketish buyurtma oqimini ko‘rsating. `pending` holatini “to‘langan” deb atamang. Real pul, email yoki realtime xabar yubormang.
- Rasm yuklash ishlamasa: oldindan seed qilingan lokal Demo muqovasidan foydalaning. Uni Cloudinary muvaffaqiyati deb taqdim etmang.

## Tekshiruv dalillari

Haqiqiy natijalar va qolgan xavflar: [verification-report.md](verification-report.md). Skrinshotlar: [screenshots](screenshots/). Brauzer skripti: [defense.e2e.cjs](../tests/defense.e2e.cjs). Regression testlar: [regression.test.mjs](../tests/regression.test.mjs).
