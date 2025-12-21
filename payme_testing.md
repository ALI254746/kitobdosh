# Payme Sandbox (Test Rejimi) Qo'llanmasi

Siz "To'lash" tugmasini bosganingizda Payme Sandbox sahifasiga o'tasiz. Bu erda haqiqiy pul ishlatilmasdan to'lov jarayonini tekshirish mumkin.

## 1. Kirish
Sandbox sahifasiga kirganingizda, u **Merchant ID** so'raydi.
- **Test Merchant ID:** `6764f69372ce606e309cc4cb` (Hozirgi kodda o'rnatilgan)

## 2. To'lovni simulyatsiya qilish
Backend integratsiyasini tekshirish uchun quyidagi bosqichlarni bajaring:

### A. CheckPerformTransaction
1. "ПЛАТЕЖНЫЕ ЗАПРОСЫ" bo'limidan **CheckPerformTransaction** ni tanlang.
2. `order_id` qismida buyurtma ID si (bazadagi ID) va `amount` qismida summa (tiyinda) borligini tekshiring.
3. "Выполнить" tugmasini bosing. Natijada `result: { allow: true }` chiqishi kerak.

### B. CreateTransaction
1. **CreateTransaction** metodini tanlang.
2. "Выполнить" tugmasini bosing. U tranzaksiya ID sini yaratadi.

### C. PerformTransaction
1. **PerformTransaction** metodini tanlang.
2. "Выполнить" tugmasini bosing. Natijada `state: 2` qaytishi kerak.

**Tabriklaymiz!** Agar hammasi to'g'ri bajarilsa, saytingizda buyurtma holati avtomatik ravishda **"To'langan"** (`paid`) holatiga o'tadi.

## 3. Real rejimga o'tish
Real rejimga o'tish uchun:
1. Payme Business kabinetidan olingan haqiqiy **Merchant ID** ni `.env.local` fayliga `PAYME_MERCHANT_ID` sifatida yozing.
2. `PAYME_MODE=production` deb o'rnating.
