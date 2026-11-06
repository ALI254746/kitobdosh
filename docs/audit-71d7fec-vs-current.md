# Mustaqil hisobot bilan solishtirish

Hisobot bazasi: `master` commit `71d7fec86c19c8edc275bee2664a618476eb314f`. Tekshiruv boshlangan branch: `fix/defense-stability-2026-11-06`, commit `e9f0662`. Quyidagi farqlar shu boshlang‘ich holat bilan solishtirildi. Eski hisobotning barcha nuqsonlari yangi branchda ham bor deb qabul qilinmadi.

## Bandlar va dalillar

| Band | Holat | e9f0662 holati va bu o‘zgarishdagi dalil | Regression |
|---|---|---|---|
| 1 | Tuzatildi | Admin server guard avval bor edi. Kuryer PUT/DELETE nishoni endi faqat `kurier/kurer/courier`; yangi kuryer javobida ham password yo‘q. `app/api/admin/couriers/[id]/route.js`, `couriers/route.js`. | Audit 1: anonim/user/kuryer rad, admin user/admin nishonlari rad; kuryer tahrir/o‘chirish ruxsat. |
| 2 | Tuzatildi | Order/Rent/admin users rol tekshiruvlari avval bor edi. List/PUT/profil javoblaridan hujjat URL/ID va ortiqcha user maydonlari chiqarildi; ommaviy qidiruv emailni bermaydi. `lib/server-auth.js`, user/search, user/profile, admin/users. | Audit 2 va 13: rol matritsasi, boshqa profil rad, shaxsiy maydonlar yo‘q. |
| 3 | Tuzatildi | Kitob server guard avval bor edi; kuryer va murojaat handlerlari endi mustaqil authorize qiladi. Kuryer ID mijozdan olinmaydi, yozuv egasi va oldingi holat atomik tekshiriladi. Bildirishnoma POST faqat admin, PUT faqat egasi. Ikkala panel server layout bilan himoyalangan. | Audit 3: to‘rtta rol, boshqa kuryer topshirig‘i va boshqa user bildirishnomasi rad. |
| 4 | Tuzatildi | Basic auth avval bor edi. Endi constant-time solishtirish, summa/target/metod validatsiyasi, doimiy unique tranzaksiya yozuvi, takroriy natijalar, parallel perform, bekor qilish va 12 soatlik timeout bor. Ijara to‘lovi admin tasdig‘ini bermaydi. **Faqat `PAYME_MODE=sandbox`; live callback yopiq.** | Audit 4: faqat lokal mock RPC, noto‘g‘ri auth/summa, replay/conflict, parallel perform va rental state. Haqiqiy Payme sandbox sertifikatsiyasi bajarilmagan. |
| 5 | Avval tuzatilgan | Middleware e9f0662’da production kirishini avval yopgan edi. Xavfli fixture handlerning o‘zi endi faqat 404; DB kodi olib tashlandi. | Audit 5 barcha rollarda production build bilan 404, baza o‘zgarmaydi; unit guard. |
| 6 | Tuzatildi | Verify custom cookie yaratishi avval olib tashlangan edi. Endi barcha API fallbacklar NextAuth’ga birlashtirildi, eski login endpoint 410 va cookie expiry; eski cookie boshqa hisobni tanlamaydi. | Audit 6: A-cookie/B-session, logout → 401. |
| 7 | Tuzatildi | Order narxi avval serverdan edi. Bevosita ijara ham umumiy server narxlashga o‘tdi; takroriy kitob qatorlari miqdori jamlanadi; stock tranzaksiyada rezerv qilinadi. Mijoz status/paymentStatus/passport identifikatorini bera olmaydi. | Audit 7, 10, 11 va unit: forged price/status, manfiy/ortiqcha miqdor, yo‘q kitob. |
| 8 | Tuzatildi | Cash enum va oldindan validatsiya avval bor edi. Endi Order + Rent + stock MongoDB tranzaksiyasida yaratiladi; saqlash xatosida hammasi rollback. | Audit 8: haqiqiy replica-set test DB’da Rent yozuvi majburiy rad etilganda Order/Rent soni va stock o‘zgarmaydi. Upload mock. |
| 9 | Tuzatildi | Mobil Payme/Click variantlari olib tashlandi; default cash, holat “to‘lov kutilmoqda”. Desktop ijara ham cash yuboradi va so‘rov tugmasi shuni aytadi. Payme ijara `status`ini `processing`ga almashtirmaydi. | Audit 9: payment qadamidagi variantlar; Audit 4 rental holati. Haqiqiy onlayn to‘lov ishladi degan da’vo yo‘q. |
| 10 | Tuzatildi | Quantity/rentDays avval tuzatilgan edi. Endi mobil savatcha, selector, checkout va API yagona formula; courier 15000, pickup 0, desktop standard 20000. `lib/checkout-pricing.mjs`, `order-input.mjs`. | Audit 10 va unit; Audit 7/8 bazada yakuniy summalar. |
| 11 | Tuzatildi | Statik manzillar olib tashlandi; haqiqiy matn kiritiladi. Bevosita ijara lat/lng tip va diapazoni tekshirilib saqlanadi, 0 koordinata ham valid. Kuryer o‘z topshirig‘ida ularni oladi. | Audit 9 manual forma; Audit 11 API → DB → kuryer, noto‘g‘ri koordinatada yozuv yo‘q. |
| 12 | Tuzatildi | PUT/DELETE cache invalidation avval bor edi. Admin endi page/limit/search/category yuboradi, keyingi/oldingi sahifalar va umumiy count mavjud. | Audit 12: 19 kitob, ikkinchi sahifa, qidiruv, Redis keshi bor holatda darhol tahrir natijasi. |
| 13 | Qoldi | Kodda upload handler auth/rol/egalik, 5 MB/MIME/signature tekshiruvi va image resource type; passport authenticated upload, owner/admin uchun 60 soniyali private download. Oddiy listlarda URL/ID yo‘q. **Real Cloudinary hisobida kirish va expiry tekshiruvi hamda eski public hujjatlarni migratsiya qilish bajarilmadi.** | Audit 13 mock: anonim/egasi bo‘lmagan/katta/fake fayl rad; provider option va expiry tekshirildi. Bu haqiqiy Cloudinary yetkazilishi dalili emas. |
| 14 | Tuzatildi | Crypto OTP, logsiz ishlash va loading finally avval bor edi. Endi Redis Lua bilan email/IP send/verify limitlari, hash, TTL va atomik bir martalik consume bor. Verify’dan keyingi sign-in error alohida tekshiriladi. | Audit 14: haqiqiy Redis, limit/expiry/replay; Resend va UI sign-in xatosi mock. Haqiqiy email yuborilmadi. |
| 15 | Tuzatildi | Ikkala desktop katalog endi `isError/refetch`ni ishlatadi; xato holati empty’dan ajratilgan va qayta urinish bor. | Audit 15: HTTP 500, network abort, haqiqiy empty va retry; UI mock. |
| 16 | Avval tuzatilgan | JSX/hook lint xatolari e9f0662’da tuzatilgan, `ignoreDuringBuilds` olib tashlangan edi. Bu ishda tekshiruvlar o‘chirilmagan. | `npm run lint`, `npm run build` va unit guard. CI ishga tushishi alohida tasdiqlanmagan. |

## Test muhiti va qaytarish

`npm ci`, `npx playwright install chromium`, `npm run build`, `npm test`, `npm run lint`.

To‘liq lokal regression: `npm run test:audit:local`. Skript uchun `mongod` (replica-set qo‘llaydigan versiya) va `redis-server` PATH’da bo‘lsin yoki `MONGOD_BIN`, `REDIS_SERVER_BIN` bilan yo‘l ko‘rsating. Kerak bo‘lsa `REDIS_LIBRARY_PATH` beriladi. Skript portlar 27019/26379/3000 va `kitobdosh_test_audit` nomli **yangi vaqtinchalik** bazadan foydalanadi; production URI qabul qilmaydi. Test parollari tasodifiy, process xotirasida; OTP faqat vaqtinchalik mock faylda, terminal/commitga chiqarilmaydi. Cloudinary va Resend preload mock hamda HTTP/fetch/socket darajasidagi tashqi tarmoq taqiqi faqat localhost `kitobdosh_test*` bazasida yoqiladi; app kodida test bypass yo‘q.

Alohida ishlayotgan lokal test server bilan `npm run test:audit` ishlatilishi mumkin; test nomi va local URI cheklovlari skriptning o‘zida tekshiriladi.

MongoDB tranzaksiyasi uchun production/lokal Mongo **replica set** bo‘lishi kerak. Standalone serverda API muvaffaqiyatni soxtalashtirmaydi, 503 qaytaradi. Himoya oldidan shu sozlamani tekshiring. Avvalgi standalone demo bo‘yicha ko‘rsatmalar bu jihatdan yangilandi.

## Xizmat cheklovlari

- Production bazasi va mavjud hujjatlar o‘zgartirilmadi. Eski public passport URLlarini provayder tarafida tekshirish/migratsiya qilish foydalanuvchi zimmasida qoladi; hozirgi API ularni chiqarmaydi.
- Payme timeout rad javobi biznes yozuvlarini o‘zgartirmaydi. Muddati tugagan rezervlarni alohida scheduler orqali bekor qilish bu ishga kiritilmagan.
- Payme live rejimi yopiq. Sandbox/mock holat testlari provider sertifikatsiyasi, haqiqiy pul yoki refund amalga oshganini bildirmaydi.
- Onlayn to‘lov variantlari yashirilgani backend ruxsat o‘rniga ishlatilmagan: callback va boshqaruv amallarida server tekshiruvlari bor.
- Yetkazish tariflari mavjud UI narxlariga mos yagona formulaga jamlandi. `SystemConfig` orqali dinamik tariflarni o‘zgartirish bu tuzatishda amalga oshirilmagan.
- Stock buyurtma yaratilganda rezervlanadi. Admin bekor qilgan buyurtma uchun rezervni qaytarish siyosati va takroriy submit idempotency alohida keyingi ish; asosiy xavfsizlik radlarida baza o‘zgarmaydi.
- Haqiqiy Google OAuth, xarita geocoding va Pusher yetkazilishi bu auditda tekshirilmagan.

## Rasmiy protokol manbalari

- Payme: https://developer.help.paycom.uz/protokol-merchant-api/skhema-vzaimodeystviya/
- Create/Perform/Cancel: https://developer.help.paycom.uz/metody-merchant-api/createtransaction/ ; https://developer.help.paycom.uz/metody-merchant-api/performtransaction/ ; https://developer.help.paycom.uz/metody-merchant-api/canceltransaction/
- Cloudinary authenticated va expiry: https://cloudinary.com/documentation/control_access_to_media ; https://cloudinary.com/documentation/image_upload_api_reference

Yakuniy natijalar:

- `npm test`: exit 0, 7/7.
- `npm run test:audit:local`: exit 0, 15/15 (production build + MongoDB 8.2.6 replica set + Redis 7.0.15; providerlar mock, tashqi fetch/HTTP/socket yopiq).
- `npm run lint`: exit 0, 0 xato, 24 warning (image optimization va hook dependencies).
- `npm run build`: exit 0; lint o‘chirilmagan.
- `git diff --check`: exit 0.
- CI natijasi tasdiqlanmagan; alohida TypeScript typecheck buyrug‘i yo‘q.

To‘liq xavfsiz test chiqishi: [audit-test-results.txt](audit-test-results.txt).

## Mock chegarasi bo‘yicha voqea

Birinchi audit yurishi 13-banddan so‘ng avtomatik xavfsizlik tekshiruvida to‘xtatildi: SDK mocki chetlab o‘tilib tashqi Resend so‘roviga urinish aniqlandi va bloklandi. Ushbu yurish email integratsiyasi muvaffaqiyati deb hisoblanmadi. Test preloadda mustaqil no-egress chegara qo‘shildi: tashqi fetch/HTTP/socket ulanishlari rad etiladi; Resend `/emails` javobi lokal yaratiladi. SDK mockiga bog‘lanmagan ushbu chegara alohida tekshirildi. Yakuniy 15/15 test shu cheklov bilan qayta bajarildi. Haqiqiy xat yetkazilgan degan da’vo yo‘q.
