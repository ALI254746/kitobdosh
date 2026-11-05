import test from 'node:test';
import assert from 'node:assert/strict';
import { requiredAccess, canAccess } from '../lib/access-policy.mjs';
import { escapeSearch, positiveInt, isObjectId } from '../lib/catalog-input.mjs';
import { prepareOrder, cartItemTotal } from '../lib/order-input.mjs';

test('admin and courier routes reject anonymous and user tokens', () => {
 for (const [path, method] of [['/api/admin/users','GET'], ['/api/books','POST'], ['/api/books/abc','PUT'], ['/api/order','GET'], ['/api/rent','PUT'], ['/AdminPanel/Kitoblar','GET']]) {
  const access=requiredAccess(path, method);
  assert.equal(canAccess(access,null),false);
  assert.equal(canAccess(access,{id:'user',role:'user'}),false);
  assert.equal(canAccess(access,{id:'admin',role:'admin'}),true);
 }
 assert.equal(requiredAccess('/api/test/setup-notification','GET'),'disabled');
 assert.equal(requiredAccess('/uploads/renters/demo.png','GET'),'disabled');
 assert.equal(requiredAccess('/api/cron/check-rentals','GET'),'cron');
 assert.equal(canAccess(requiredAccess('/KurierPanel','GET'),{id:'c',role:'kurer'}),true);
 assert.equal(requiredAccess('/api/books','GET'),null);
 assert.equal(requiredAccess('/api/payment/payme/callback','POST'),null);
});
test('search treats brackets and regex operators literally; pagination is bounded', () => {
 assert.equal(new RegExp(escapeSearch('[')).test('['),true);
 assert.equal(new RegExp(escapeSearch('.*')).test('anything'),false);
 assert.equal(positiveInt('-2',16,100),16);
 assert.equal(positiveInt('999999',16,100),100);
 assert.equal(isObjectId('bad'),false);
});
const book={_id:'507f1f77bcf86cd799439011',title:'Demo kitob',author:'Demo',images:[],price:30000,stock:5,isRentable:true,rentalPricePerDay:1000};
const payload={items:[{book:book._id,quantity:2,type:'rent',rentDays:3,price:1}],customer:{name:'Demo',phone:'+998000000000',address:'Demo manzil'},deliveryMethod:'standard',paymentMethod:'cash',totalPrice:1,paymentStatus:'paid',status:'completed'};
test('server prices rentals from catalog and ignores forged payment/status totals', () => {
 const data=prepareOrder(payload,[book]);
 assert.equal(data.totalPrice,26000);
 assert.equal(data.items[0].price,3000);
 assert.equal(data.status,undefined);
 assert.equal(data.paymentStatus,undefined);
});
test('invalid quantities, missing books, empty carts and unsupported payments fail', () => {
 for(const changed of [{items:[]},{items:[{...payload.items[0],quantity:-1}]},{items:[{...payload.items[0],quantity:6}]},{items:[{...payload.items[0],rentDays:0}]},{paymentMethod:'click'}]) assert.throws(()=>prepareOrder({...payload,...changed},[book]));
 assert.throws(()=>prepareOrder(payload,[]));
});
test('mobile totals include quantity and all rental days', () => {
 assert.equal(cartItemTotal({...book,type:'rent',rentDays:3,quantity:2}),6000);
 assert.equal(cartItemTotal({...book,type:'buy',quantity:2}),60000);
});

test('delivery totals, duplicate stock and coordinates stay consistent', async () => {
 const { deliveryFee, coordinates } = await import('../lib/checkout-pricing.mjs');
 assert.equal(deliveryFee('courier'),15000);assert.equal(deliveryFee('pickup'),0);
 assert.deepEqual(coordinates(0,0),{lat:0,lng:0});assert.throws(()=>coordinates(91,0));
 assert.throws(()=>prepareOrder({...payload,items:[{...payload.items[0],quantity:3},{...payload.items[0],quantity:3}]},[book]));
 assert.equal(prepareOrder({...payload,deliveryMethod:'courier'},[book]).totalPrice,21000);
});
test('build keeps lint enabled and unsafe fixture route has no DB access', async () => {
 const {readFile}=await import('node:fs/promises');
 assert.ok(!(await readFile(new URL('../next.config.js',import.meta.url),'utf8')).includes('ignoreDuringBuilds'));
 const route=await readFile(new URL('../app/api/test/setup-notification/route.js',import.meta.url),'utf8');
 assert.ok(route.includes('status: 404'));assert.ok(!route.includes('dbConnect'));
});

test('image optimizer only allows public local assets, never renter documents', async () => {
 const {createRequire}=await import('node:module'); const require=createRequire(import.meta.url);
 const config=require('../next.config.js');
 const {hasLocalMatch}=require('next/dist/shared/lib/match-local-pattern');
 assert.equal(hasLocalMatch(config.images.localPatterns,'/uploads/renters/demo.png'),false);
 assert.equal(hasLocalMatch(config.images.localPatterns,'/demo-book.svg'),true);
});
