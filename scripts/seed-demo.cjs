// Explicitly local, idempotent fixtures. Never points at an Atlas/production database.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
async function seed() {
 const uri = process.env.MONGO_URI;
 const dbName = process.env.MONGO_DB_NAME;
 if (process.env.NODE_ENV === 'production' || process.env.DEMO_SEED_CONFIRM !== 'local-demo-only' || !/^kitobdosh_(demo|test)(_|$)/.test(dbName || '') || !/^mongodb:\/\/(127\.0\.0\.1|localhost):\d+\//.test(uri || '')) throw new Error('Seed faqat alohida localhost demo/test bazasida ruxsat etiladi');
 if (!process.env.DEMO_PASSWORD || process.env.DEMO_PASSWORD.length < 12) throw new Error('DEMO_PASSWORD kamida 12 belgi bo‘lsin');
 await mongoose.connect(uri,{dbName,serverSelectionTimeoutMS:5000});
 const db=mongoose.connection.db;
 for (const [email,role,name] of [['demo-user@example.invalid','user','Demo Foydalanuvchi'],['demo-reader@example.invalid','user','Demo Kitobxon'],['demo-admin@example.invalid','admin','Demo Administrator'],['demo-courier@example.invalid','kurer','Demo Kuryer']]) {
  await db.collection('users').updateOne({email},{$setOnInsert:{email,role,fullName:name,password:await bcrypt.hash(process.env.DEMO_PASSWORD,10),favorites:[],friends:[],createdAt:new Date(),updatedAt:new Date()}},{upsert:true});
 }
 await db.collection('books').updateOne({_id:new mongoose.Types.ObjectId('6b0000000000000000000001')},{$setOnInsert:{title:'Demo — Kitobdosh namoyish kitobi',author:'Demo Muallif',description:'Faqat alohida test bazasi uchun Demo kitob.',price:30000,category:'Badiiy Adabiyotlar',images:['/demo-book.svg'],stock:10,condition:'Yangi',language:"O'zbek",isRentable:true,rentalPricePerDay:1000,publisher:'Demo',averageRating:0,numReviews:0,createdAt:new Date(),updatedAt:new Date()}},{upsert:true});
 await mongoose.disconnect();
 console.log('Demo foydalanuvchi, ikkinchi kitobxon, admin, kuryer va kitob tayyor. Mavjud nusxalar va parollar o‘zgartirilmadi.');
}
seed().catch(()=>{console.error('Demo seed bajarilmadi. Lokal baza va DEMO_SEED_CONFIRM, DEMO_PASSWORD, MONGO_URI, MONGO_DB_NAME sozlamalarini tekshiring.');process.exitCode=1});
