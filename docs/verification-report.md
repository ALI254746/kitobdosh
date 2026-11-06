> Bu oldingi e9f0662 tekshiruvining hisoboti. Joriy o‘zgarishlar va yangi test natijalari: [mustaqil audit](audit-71d7fec-vs-current.md).

# Tekshiruv hisoboti

## Izolyatsiya

Production ma’lumotlari o‘zgartirilmadi. MongoDB 8.2.6 alohida vaqtinchalik lokal papkada, `kitobdosh_demo` bazasida ishlatildi. Demo hisoblar va kitob seed orqali yaratildi. Tashqi email, to‘lov va Pusher kalitlari ishlatilmadi. Production saytining login sahifasi brauzerda ochildi; autentifikatsiyalangan production jarayonlari sinovdan o‘tkazilmadi.

## Tuzatishlar

- Build paytida MongoDB/Resend/Pusher sozlamalarini majburan talab qiladigan importlar so‘rov vaqtiga o‘tkazildi. MongoDB ulanishi parallel so‘rovlar uchun umumiy promise va cheklangan timeout bilan ishlaydi. Avvalgi baza nomi default sifatida saqlandi; test uchun nomni almashtirish mumkin.
- Redis yo‘q paytda cheksiz navbat/kutish tugatildi. Katalog keshi ixtiyoriy; kesh yozish xatosida baza qayta-qayta so‘ralmaydi. Savatcha sinxronlash ishlamasa 503 va tushunarli xabar, har bir hisob uchun alohida lokal backup bor.
- Admin/kuryer panellari va API yo‘llari middleware bilan himoyalandi. Admin yozish/o‘qish handlerlari server sessiyasini ham qayta tekshiradi. Boshqa foydalanuvchi kabineti va ijara amallariga egalik tekshiruvi qo‘shildi. Ma’lumot o‘zgartiradigan ochiq test endpointlari yopildi, cron uchun `CRON_SECRET` talab qilinadi.
- OTP/parol tekshiruvlari mustahkamlandi; OTP terminalga chiqarilmaydi. Registratsiyadan keyingi keraksiz parallel JWT cookie olib tashlandi; UI NextAuth orqali kiradi. OTP xatosidan keyin submit tugmasi qayta ishlaydi. Admin chiqish tugmasi ulandi.
- Kitob ID va qidiruv regex belgilari tekshiriladi, pagination chegaralangan. Nolinchi narx ruxsat etiladi; UI’dagi kategoriyalar model bilan moslashtirildi. Kitob o‘zgarganda katalog va home keshlari bekor qilinadi.
- Checkout summalari miqdor va ijara kunlarini hisoblaydi. Buyurtma narxi serverda katalogdan olinadi; mijozning `paid`/status/summa qiymatlari ishonchli deb olinmaydi. Barcha ijara hujjatlari saqlashdan oldin validatsiya qilinadi. Naqd ijara modelda qabul qilinadi.
- Payme callback ruxsatsiz o‘zgartirishni rad etadi; checkout havolasi faqat hisobga tegishli saqlangan buyurtma summasidan tuziladi. Kalit bo‘lmasa ochiq xato qaytaradi. Bu haqiqiy Payme sertifikatsiyasi yoki to‘lov testi emas.
- Rasm upload uchun kirish, fayl turi/hajmi va folder tekshiruvi bor. Login’dagi qattiq yozilgan statistika va ayrim standart 5 yulduz qiymatlari olib tashlandi; to‘plamlar bazadagi kategoriya sonidan olinadi.
- Profil bildirishnomalaridagi shartli React hook tuzatildi. JSX matnlari escape qilindi. Lintni buildda yashiruvchi sozlama olib tashlandi; tekshiruvlar o‘chirilmagan.

## Buyruqlar

- `npm ci --no-audit --no-fund`: muvaffaqiyatli, lockfile ishlatildi. Keyin test uchun `@playwright/test@1.56.1` dev dependency va lockfile yangilandi.
- `npm test`: 5 regression testi o‘tdi.
- `npm run lint`: o‘tdi, 0 xato; 23 mavjud image optimizatsiyasi/hook dependency warningi qoldi.
- `npm run build`: o‘tdi (Next.js 14.2.35 production build). Lint o‘chirilmagan. Buildda baza yoki tashqi xizmatga kirish talab qilinmadi.
- Alohida `typecheck` buyrug‘i mavjud emas; loyiha JavaScript. TypeScript typecheck o‘tdi degan da’vo yo‘q.
- `npm run test:defense`: production build + `next start` bilan o‘tdi. Playwright Chromium, 1440×1000 desktop va 390×844 mobil. 0 brauzer runtime exception. To‘liq PASS chiqishi: [defense-test-results.txt](defense-test-results.txt).

## Tekshirilgan va tekshirilmagan qismlar

Brauzer testlari lokal bazada kirish, sessiya reload, oddiy userning admin API’dan rad etilishi, qidiruv, katalog, kitob ID validatsiyasi, xarid formasi → API → MongoDB, serverda hisoblangan buyurtma → kabinet, mobil home/tafsilot, chiqish va admin tahrir formasi → API → MongoDB → ro‘yxatni tekshirdi. Runtime exception qayd etilmadi. Yakuniy production-mode run ham shu jarayonlardan o‘tdi; qo‘shimcha ravishda admin kitob yaratishi (0 narx va UI kategoriya), noto‘g‘ri kitob ma’lumotiga 400 javob, admin chiqish tugmasi va OTP xatosidan keyin submit qayta faollashishi tekshirildi. OTP uchun faqat brauzer response mock ishlatildi; registratsiya backend/email yetkazilishi bu bilan tasdiqlanmaydi.

Haqiqiy Resend OTP yetkazilishi, Redis OTP saqlash va qurilmalararo savatcha, Google OAuth, Cloudinary upload, Pusher realtime, xarita tile/geocoding/geolocation, kuryer olish/yetkazish/qaytarish, real ijara hujjati yuklash va to‘lov lifecycle’i to‘liq tekshirilmagan. Ular uchun mos test xizmatlari/config kerak. Production’dagi kalitlar va baza holati bu hisobotdan kelib chiqib tasdiqlanmaydi.

## Qolgan xavflar

- Buyurtma va bog‘liq ijara yozuvlari bir nechta saqlashdan iborat; barcha validatsiya oldindan bajariladi, lekin tarmoq uzilgandagi atomiklik/idempotency va zaxira nusxalarini parallel band qilish to‘liq hal qilinmagan. Himoyada buyurtmani bir marta bosing va kabinetda tekshiring.
- Parolni tiklash tugmasi uchun yakunlangan backend oqimi yo‘q; demo hisob parolini oldindan tayyorlang.
- Bevosita eski `/api/rent` oqimi va to‘lov holat mashinasiga alohida kengroq audit/test kerak. Namoyishni sinovdan o‘tgan naqd xarid oqimida qiling.
- Redis qaytgandan keyin lokal backup va server savatchasining murakkab konflikt birlashtirishi mavjud emas. Qurilmalararo sinxronlashni alohida tasdiqlang.
- Email oqimida rate limiting va OTP urinishlari uchun qo‘shimcha cheklovlar kerak. Xavfsizlik tekshiruvlarini o‘chirib demo qilmang.
- Deploy hujjatlarida ilgari bo‘lgan kalitga o‘xshash qiymatlar placeholders bilan almashtirildi. Agar ulardan haqiqiy kalit sifatida foydalanilgan bo‘lsa, tegishli provider’da almashtiring; git tarixi qayta yozilmadi.

## Kerakli sozlamalar nomlari

Asosiy demo: `MONGO_URI`, `MONGO_DB_NAME`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`. Seed/test: `DEMO_PASSWORD`, `DEMO_SEED_CONFIRM`, `DEFENSE_BASE_URL`.

Integratsiyalar: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `RESEND_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`, `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER`, `PAYME_MERCHANT_ID`, `PAYME_SECRET_KEY`, `PAYME_MODE`, `CRON_SECRET`. Eski custom login endpointi uchun `JWT_SECRET` ham mavjud. Kalit qiymatlarini commit yoki hisobotga qo‘shmang.
