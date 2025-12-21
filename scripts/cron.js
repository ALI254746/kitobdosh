const cron = require('node-cron');
const http = require('http');

console.log("Kitobdosh Rental Cron Job boshlandi...");

// Har kuni soat 00:00 da ishga tushadi (0 0 * * *)
// Test uchun har 5 daqiqada: */5 * * * *
cron.schedule('0 0 * * *', () => {
    console.log(`[${new Date().toLocaleString()}] Ijaralarni tekshirish boshlanmoqda...`);

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/cron/check-rentals',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`[${new Date().toLocaleString()}] API Javobi:`, data);
        });
    });

    req.on('error', (e) => {
        console.error(`[${new Date().toLocaleString()}] Xatolik:`, e.message);
    });

    req.end();
});
