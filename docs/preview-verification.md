# Himoya oldi preview/test tekshiruvi

## PR tekshiruvlari

PR #3, boshlang‘ich commit `815677b22c49d9704036b9d4315a0fab1c6908fe`:

- GitHub commit status: `Vercel — success`.
- Status manzili: https://vercel.com/ali254746s-projects/kitobdosh/2vsatzTAkozjeDoJRYqV6H7DfmNf
- GitHub Actions PR workflow runlari: 0. Repoda `.github/workflows` mavjud emas. Vercel success — mustaqil test/lint CI bajarganini bildirmaydi.
- Productionga kirish, merge va deploy buyruqlari bajarilmadi. Brauzer zanjiri xavfsiz lokal test serverda bajarildi; Vercel preview’dagi DB/integratsiyalar ishlashi shu bilan tasdiqlanmaydi.

## Replica set talabi

Order + Rent + stock bir MongoDB tranzaksiyasida yoziladi. MongoDB **replica set** (yoki tranzaksiyani qo‘llovchi mos managed cluster) kerak; standalone server yetarli emas. `MONGO_URI` shu deploymentga tegishli bo‘lsin, `MONGO_DB_NAME` esa preview/test uchun alohida baza bo‘lsin. Driver primary’ga ulana olishi va app hisobida zarur collection/index/transaction ruxsatlari bo‘lishi kerak.

Lokal runner yangi vaqtinchalik bir tugunli replica set yaratadi, `hello` orqali replica set va primary holatini tekshiradi; production URI’dan foydalanmaydi. Standalone yoki tranzaksiya xatosida muvaffaqiyat soxtalashtirilmaydi. Stock/Order/Rent rollback oldingi 15-bandli auditda ham sinovdan o‘tgan.

## Yetishmayotgan sozlamalar — faqat nomlar

Quyidagilar agent host environment’ida yo‘q. Bu Vercel secret sozlamalari o‘qilganini bildirmaydi. Test runner zarur lokal qiymatlarni o‘zi vaqtincha yaratadi; ular hisobotga chiqarilmaydi.

| Vazifa | Nomlar |
|---|---|
| Baza va sessiya | `MONGO_URI`, `MONGO_DB_NAME`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |
| Redis | `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` |
| Cloudinary | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| Email | `RESEND_API_KEY` |
| Google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Realtime | `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`, `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER` |
| Payme | `PAYME_MERCHANT_ID`, `PAYME_SECRET_KEY`, `PAYME_LOGIN`, `PAYME_MODE` |
| Cron | `CRON_SECRET` |

Redis paroli provayderga bog‘liq. Google, realtime, Payme va cron asosiy qo‘lda cash demo uchun shart emas; ular sozlanmagan bo‘lsa ishlashi da’vo qilinmaydi.

## Brauzer dalili qanday olindi

`tests/defense-journey.e2e.cjs` haqiqiy UI bilan ishlaydi. Forma/knopkadan keyin haqiqiy lokal API javobi, Redis savatchasi va MongoDB yozuvi tekshiriladi. Buyurtma/admin/kuryer API’lariga soxta muvaffaqiyat response berilmaydi. Loginlar alohida browser contextlarda; desktop va 390px mobil ko‘rinish ishlatiladi.

Tashqi tarmoq serverda fetch/HTTP/socket darajasida, brauzerda route darajasida yopiq. Bloklangan ulanish uchun boshqa transport, proxy yoki boshqa manzil ishlatilmagan. Internetga bog‘liq xarita/tasvir xizmatlari tasdiqlanmagan.

Ssenariy: login → katalog → mobil kitob → savatcha → manzil → courier + cash → buyurtma/ijara → kabinet tarixi → admin tasdiqlashi → kuryer qabul qilishi → admin kitobni berishi → kuryer yo‘lga chiqishi/yetkazishi. Yakunda xarid `completed`, ijara `active`, cash `paymentStatus` esa `pending` bo‘lishi kerak. Cash topshirig‘i yetkazilgani pul qabul qilinganini avtomatik bildirmaydi.

## Haqiqiy lokal tekshiruv va mock chegarasi

| Qism | Tekshiruv turi |
|---|---|
| Login/sessiya, katalog, cart API, savatcha Redis’i | Haqiqiy lokal servislar |
| Buyurtma, ijara, rezerv va statuslar | Haqiqiy MongoDB replica set |
| Admin va kuryer amallari | Brauzer UI → lokal API → haqiqiy test DB |
| Cloudinary upload | Server SDK mock; haqiqiy upload/access/expiry tekshirilmagan |
| Ijara hujjati | Faqat generik 1px `Demo-not-a-passport.png`; haqiqiy pasport ishlatilmagan va skrinshotga olinmagan |
| Email | Ushbu login journey’da yuborilmaydi; alohida audit OTP testi Resend mock + haqiqiy lokal Redis bilan |
| Payme | Ushbu cash journey’da ishlatilmaydi; live yopiq, avvalgi audit faqat lokal sandbox RPC mock |

## Topilgan va tuzatilgan UI to‘siqlar

- Faol kuryer sahifasi API `id` o‘rniga `_id` olayotgan edi; status so‘rovining ID’si va kitob rasmi moslashtirildi.
- Mobil detail xarid turi `sale` bo‘lib, savatchadagi `buy` bilan mos emas edi; `buy` ishlatiladi.
- Mobil pastki navigatsiya xarid/ijara tugmalarini bosishni to‘sayotgan edi; action panel yuqoriga ko‘chirildi, kontent paddingi va metadata eni moslandi.
- Admin/kuryer status o‘zgarganda profil keshi bekor qilinadi; mobil kabinet `active/approved/processing` holatlarini pending deb noto‘g‘ri ko‘rsatmaydi.
- Mobil kabinet buyurtma/ijara massivlarini tarix komponentiga uzatmayotgan edi; saqlangan yozuvlar ko‘rinadi. “Jami buyurtmalar” pending yozuvlarni ham hisoblaydi, bog‘langan rental parent ikki marta tarixga kiritilmaydi.
- Admin ijara panelidagi server/browser sana formatlari hydration xatosiga sabab bo‘lardi; sana initial render’da bir xil, mount’dan so‘ng Toshkent vaqtida formatlanadi. Hydration warning o‘chirilmagan, test runtime exceptionlarni rad etadi.
- Redis cold start’da birinchi buyruq connection ready bo‘lishidan oldin `503` olardi; endi cheklangan connection promise kutiladi, cheksiz offline queue yoqilmaydi.
- Eski `/uploads/renters` katalogiga to‘g‘ridan-to‘g‘ri kirish 404 bilan yopildi. Image optimizer `localPatterns` ruxsat ro‘yxati orqali shu yo‘lni o‘qishdan oldin 400 bilan rad etadi. Fayllar mazmuni ko‘rilmadi, o‘chirish/migratsiya va Git tarixi tozalash bajarilmadi.

## Qolgan bloklovchilar va deploy oldi qadamlar

1. Alohida preview DB’da replica set/primary, URI, baza nomi, huquqlar va indexlarni tekshirish; production ma’lumotlarini testga qo‘shmaslik.
2. Real Cloudinary test hisobida authenticated access va expiry’ni tekshirish. Eski public fayllar va Git tarixida shaxsiy hujjat bo‘lishi ehtimolini ruxsatli audit qilish; hozirgi kod ularni tarqatmaydi, ammo tarix masalasi ochiq.
3. Emailni haqiqiy tekshirish alohida ruxsatli test adresi va provider test muhiti bilan bajarilishi kerak; hozir faqat mock natijasi bor.
4. Payme live’ni yoqmaslik. CI’da alohida lint/unit/build qadamlarini yo‘lga qo‘yish; hozir GitHub Actions run yo‘q.
5. Ijara yetkazilganda `Rent` active bo‘ladi, lekin unga bog‘liq parent `Order` pending qolishi kuzatildi. Lifecycle sync, bekor qilish rezervlari va takroriy submit idempotency deploy oldi ochiq masala.
6. Preview’da secret sozlamalari kiritilgach shu cash zanjirini qayta tekshirish. Bekor qilingan buyurtma rezervini qaytarish va takroriy submit idempotency avvalgi auditdagi ochiq cheklov bo‘lib qoladi.
7. Faqat ushbu dalillar va qolgan cheklovlar ko‘rib chiqilgandan keyin deploy qarori chiqariladi. Bu ishda merge/deploy qilinmadi.

## Yakuniy natijalar

- Unit regression: **8/8**, exit 0.
- API/audit: **15/15**, exit 0; anonim/user/kuryer/admin, egalik va rad etilgan so‘rovdan keyingi DB tekshiruvlari bor.
- Brauzer cash zanjiri: xarid va ijara ikkisi ham o‘tdi, **0 runtime exception**, 19 skrinshot.
- Lint: exit 0, **0 xato, 24 ogohlantirish**. Qoidalar o‘chirilmagan.
- Production build: exit 0; lint builddan chiqarilmagan.
- Alohida typecheck skripti yo‘q (JavaScript loyiha); typecheck o‘tdi deb da’vo qilinmaydi.

Buyruqlar: `npm test`, `npm run lint`, `npm run build`, `npm run test:audit:local`. Journey uchun oxirgi buyruqqa `AUDIT_TEST_SCRIPT=tests/defense-journey.e2e.cjs` beriladi. Lokal Mongo/Redis binary yo‘llari runner environment’i orqali ko‘rsatiladi. To‘liq qisqa log: [preview-test-results.txt](preview-test-results.txt).

## Skrinshotlar

| Dalil | Fayl |
|---|---|
| Login | [01-login](screenshots/journey/01-login.png) |
| Desktop katalog | [02-desktop-catalog](screenshots/journey/02-desktop-catalog.png) |
| Mobil kitob | [02-mobile-book](screenshots/journey/02-mobile-book.png) |
| Cash xarid, manzil va summa | [04-purchase-cash-review](screenshots/journey/04-purchase-cash-review.png) |
| Cash ijara, manzil va summa | [08-rental-cash-review](screenshots/journey/08-rental-cash-review.png) |
| Admin xarid | [10-admin-cash-order](screenshots/journey/10-admin-cash-order.png) |
| Admin ijara | [11-admin-rental](screenshots/journey/11-admin-rental.png) |
| Kuryer xarid yetkazdi | [14-purchase-courier-delivered](screenshots/journey/14-purchase-courier-delivered.png) |
| Kuryer ijara yetkazdi | [14-rental-courier-delivered](screenshots/journey/14-rental-courier-delivered.png) |
| Yakuniy shaxsiy kabinet | [15-user-final-delivery-status](screenshots/journey/15-user-final-delivery-status.png) |

Barcha 19 asl PNG: [journey](screenshots/journey/).

