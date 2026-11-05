const { chromium, request, expect } = require('@playwright/test');
const mongoose = require('mongoose'); const bcrypt = require('bcryptjs'); const assert = require('node:assert/strict');
const { createHash }=require('crypto');const fs=require('fs');const Redis=require('ioredis');
const base=process.env.DEFENSE_BASE_URL || 'http://127.0.0.1:3000';
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base) || !/^mongodb:\/\/127\.0\.0\.1:\d+\//.test(process.env.MONGO_URI || '') || !/^kitobdosh_test/.test(process.env.MONGO_DB_NAME || '')) throw new Error('Only local test environment is allowed');
const hash=value=>createHash('sha256').update(value).digest('hex');
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jWZkAAAAASUVORK5CYII=','base64');
(async()=>{
 await mongoose.connect(process.env.MONGO_URI,{dbName:process.env.MONGO_DB_NAME});const db=mongoose.connection.db;
 const redis=new Redis({host:'127.0.0.1',port:Number(process.env.REDIS_PORT)});const browser=await chromium.launch();
 const contexts={};const actors={};let passed=0;
 const test=async(number,name,fn)=>{await fn();passed++;console.log(`PASS ${number}: ${name}`)};
 const snapshot=async()=>{const state={};for(const {name} of await db.listCollections().toArray())state[name]=await db.collection(name).find().sort({_id:1}).toArray();return hash(JSON.stringify(state));};
 const deny=async(ctx,path,method,data,status)=>{const before=await snapshot();const res=await ctx.request.fetch(base+path,{method,data});assert.equal(res.status(),status,`${method} ${path}`);assert.equal(await snapshot(),before,'Rejected request changed MongoDB');};
 const api=(ctx,path,method='GET',data)=>ctx.request.fetch(base+path,{method,data});
 const id=()=>new mongoose.Types.ObjectId();
 const bookId=id();const fixture={_id:bookId,title:'Demo Audit',author:'Demo Muallif',description:'Demo test',price:30000,stock:100,images:['/demo-book.svg'],category:'Badiiy Adabiyotlar',isRentable:true,rentalPricePerDay:1000,createdAt:new Date()};
 await db.collection('books').insertOne(fixture);
 for(const [name,role] of [['user','user'],['other','user'],['courier','kurer'],['courier2','courier'],['admin','admin']]){
  const _id=id();actors[name]={_id,role,email:`demo-${name}@example.invalid`};await db.collection('users').insertOne({...actors[name],fullName:'Demo '+name,password:await bcrypt.hash(process.env.DEMO_PASSWORD,10),favorites:[],friends:[],createdAt:new Date()});
  const ctx=await browser.newContext({viewport:{width:1440,height:1000}});contexts[name]=ctx;
  const csrf=await(await ctx.request.get(base+'/api/auth/csrf')).json();const login=await ctx.request.post(base+'/api/auth/callback/credentials',{form:{csrfToken:csrf.csrfToken,email:actors[name].email,password:process.env.DEMO_PASSWORD,json:'true'}});assert.equal(login.status(),200);
  assert.equal((await(await ctx.request.get(base+'/api/auth/session')).json()).user.role,role);
 }
 contexts.anon=await browser.newContext();
 try{
 await test(1,'courier CRUD role matrix, target role constraint, password excluded',async()=>{
  for(const name of ['anon','user','courier'])for(const method of ['PUT','DELETE'])await deny(contexts[name],'/api/admin/couriers/'+actors.other._id,method,{password:'Demo changed password'},name==='anon'?401:403);
  for(const target of ['user','admin'])for(const method of ['PUT','DELETE'])await deny(contexts.admin,'/api/admin/couriers/'+actors[target]._id,method,{password:'Demo changed password'},404);
  assert.equal((await api(contexts.admin,'/api/admin/couriers/'+actors.courier2._id,'PUT',{fullName:'Demo updated',password:'Demo long password'})).status(),200);
  const created=await api(contexts.admin,'/api/admin/couriers','POST',{email:'demo-new-courier@example.invalid',password:'Demo long password'});assert.equal(created.status(),201);const data=await created.json();assert.ok(!data.data.password);assert.equal((await api(contexts.admin,'/api/admin/couriers/'+data.data._id,'DELETE')).status(),200);
 });
 await test(2,'order/rent/users management role matrix and private field projection',async()=>{
  for(const name of ['anon','user','courier'])for(const [path,methods] of [['/api/order',['GET','PUT']],['/api/rent',['GET','PUT']],['/api/admin/users',['GET']]])for(const method of methods)await deny(contexts[name],path,method,method==='GET'?undefined:{id:String(id()),status:'completed'},name==='anon'?401:403);
  for(const name of ['anon','user','courier']) {
    const before=await snapshot();const r=await contexts[name].request.get(base+'/AdminPanel',{maxRedirects:0});assert.ok([307,308].includes(r.status()));assert.equal(await snapshot(),before);
  }
  for(const name of ['anon','user']){const r=await contexts[name].request.get(base+'/KurierPanel',{maxRedirects:0});assert.ok([307,308].includes(r.status()));}
  for(const path of ['/api/order','/api/rent','/api/admin/users'])assert.equal((await api(contexts.admin,path)).status(),200);
  const search=await(await api(contexts.anon,'/api/user/search?q=Demo')).json();assert.ok(search.people.every(p=>!('email' in p)));
  await deny(contexts.user,'/api/user/profile?userId='+actors.other._id,'GET',undefined,403);
 });
 const orderPayload={items:[{book:String(bookId),type:'buy',quantity:1}],customer:{name:'Demo Audit',phone:'+998000000000',address:'Demo address',lat:0,lng:0},deliveryMethod:'pickup',paymentMethod:'cash'};
 let orderId;const createdOrder=await(await api(contexts.user,'/api/order','POST',orderPayload)).json();assert.ok(createdOrder.success);orderId=createdOrder.data._id;
 await test(3,'catalog/contact/notification/courier guards and courier ownership',async()=>{
  for(const name of ['anon','user','courier'])for(const [path,method,data] of [['/api/books','POST',{}],['/api/books/'+bookId,'PUT',{price:1}],['/api/books/'+bookId,'DELETE',{}],['/api/contact','GET',undefined],['/api/contact','PUT',{id:String(id()),updates:{status:'read'}}],['/api/contact','DELETE',{id:String(id())}],['/api/notifications','POST',{userId:String(actors.other._id),title:'Demo',message:'Demo'}]])await deny(contexts[name],path,method,data,name==='anon'?401:403);
  for(const name of ['anon','user'])for(const path of ['/api/courier','/api/courier/returns'])for(const method of ['GET','PUT'])await deny(contexts[name],path,method,method==='GET'?undefined:{id:orderId,type:'buy',status:'delivered'},name==='anon'?401:403);
  await db.collection('orders').updateOne({_id:new mongoose.Types.ObjectId(orderId)},{$set:{status:'processing',courierStatus:'new'}});
  assert.equal((await api(contexts.courier,'/api/courier','PUT',{id:orderId,type:'buy',status:'accepted',courierId:String(actors.courier2._id)})).status(),200);
  assert.equal(String((await db.collection('orders').findOne({_id:new mongoose.Types.ObjectId(orderId)})).courierId),String(actors.courier._id));
  await deny(contexts.courier2,'/api/courier','PUT',{id:orderId,type:'buy',status:'picked_up'},403);
  const jobs=await(await api(contexts.courier2,'/api/courier')).json();assert.ok(!jobs.data.some(j=>j.id===orderId));
  const n=await db.collection('notifications').insertOne({user:actors.other._id,title:'Demo',message:'Demo',isRead:false});await deny(contexts.user,'/api/notifications','PUT',{id:String(n.insertedId)},404);
  assert.equal((await api(contexts.admin,'/api/notifications','POST',{userId:String(actors.user._id),title:'Demo',message:'Demo'})).status(),200);
 });
 await test(4,'Payme mock auth, amount, replay, state, duplicate concurrency, rental status',async()=>{
  const payId=id();await db.collection('orders').insertOne({...orderPayload,_id:payId,user:actors.user._id,totalPrice:30000,paymentMethod:'payme',paymentStatus:'pending',status:'pending'});
  const url=base+'/api/payment/payme/callback';const auth='Basic '+Buffer.from('Paycom:'+process.env.PAYME_SECRET_KEY).toString('base64');
  const rpc=async(method,params,authorization=auth)=>{const r=await contexts.anon.request.post(url,{headers:{authorization},data:{id:1,method,params}});return {status:r.status(),body:await r.json()};};
  const before=await snapshot();assert.equal((await rpc('PerformTransaction',{id:'demo-no'},'Basic wrong')).status,401);assert.equal(await snapshot(),before);
  const params={id:'demo-tx',time:Date.now(),amount:3000000,account:{order_id:String(payId)}};
  assert.equal((await rpc('CreateTransaction',{...params,amount:1})).body.error.code,-31001);assert.equal(await db.collection('paymenttransactions').countDocuments(),0);
  const tx=(await rpc('CreateTransaction',params)).body.result;assert.equal(tx.state,1);assert.deepEqual((await rpc('CreateTransaction',params)).body.result,tx);
  assert.equal((await rpc('CreateTransaction',{...params,id:'demo-conflict'})).body.error.code,-31008);
  const perform=await Promise.all([rpc('PerformTransaction',{id:params.id}),rpc('PerformTransaction',{id:params.id})]);assert.ok(perform.every(r=>r.body.result?.state===2));assert.equal(perform[0].body.result.perform_time,perform[1].body.result.perform_time);
  assert.equal((await db.collection('orders').findOne({_id:payId})).paymentStatus,'paid');
  const cancelled=(await rpc('CancelTransaction',{id:params.id,reason:5})).body.result;assert.equal(cancelled.state,-2);assert.deepEqual((await rpc('CancelTransaction',{id:params.id,reason:5})).body.result,cancelled);assert.equal((await rpc('PerformTransaction',{id:params.id})).body.error.code,-31008);
  const missingAuthBefore=await snapshot();const unauth=await contexts.anon.request.post(url,{data:{id:1,method:'PerformTransaction',params:{id:params.id}}});assert.equal(unauth.status(),401);assert.equal(await snapshot(),missingAuthBefore);
  const expiredId=id();await db.collection('orders').insertOne({...orderPayload,_id:expiredId,user:actors.user._id,totalPrice:30000,paymentMethod:'payme',paymentStatus:'pending',status:'pending'});
  const expiredParams={...params,id:'demo-expired-tx',time:Date.now()-43200001,account:{order_id:String(expiredId)}};const expiredBefore=await snapshot();assert.equal((await rpc('CreateTransaction',expiredParams)).body.error.code,-31008);assert.equal(await snapshot(),expiredBefore);
  await db.collection('paymenttransactions').insertOne({providerId:expiredParams.id,target:expiredId,targetModel:'Order',amount:3000000,providerTime:expiredParams.time,createTime:expiredParams.time,state:1,performTime:0,cancelTime:0,reason:null});const beforeExpiredPerform=await snapshot();assert.equal((await rpc('PerformTransaction',{id:expiredParams.id})).body.error.code,-31008);assert.equal(await snapshot(),beforeExpiredPerform);

  const rentId=id();await db.collection('rents').insertOne({_id:rentId,user:actors.user._id,book:bookId,bookTitle:'Demo',fullName:'Demo',phone:'+998000000000',address:'Demo',passportUrl:'https://example.invalid/demo',days:1,totalPrice:1000,paymentMethod:'payme',paymentStatus:'pending',status:'pending'});
  const rentParams={...params,id:'demo-rent-tx',account:{order_id:String(rentId)},amount:100000};assert.equal((await rpc('CreateTransaction',rentParams)).body.result.state,1);assert.equal((await rpc('PerformTransaction',{id:rentParams.id})).body.result.state,2);assert.equal((await db.collection('rents').findOne({_id:rentId})).status,'pending');
 });
 await test(5,'fixture endpoint is 404 and never changes DB in production build',async()=>{for(const ctx of Object.values(contexts))await deny(ctx,'/api/test/setup-notification','GET',undefined,404)});
 await test(6,'legacy A cookie cannot override B; logout means protected APIs reject',async()=>{
  const jwt=require('jsonwebtoken');await contexts.user.addCookies([{name:'kitobdosh_token',value:jwt.sign({userId:String(actors.other._id)},'Demo unused secret'),url:base}]);
  const profile=await(await api(contexts.user,'/api/user/profile')).json();assert.equal(profile.data.user._id,String(actors.user._id));
  const csrf=await(await api(contexts.user,'/api/auth/csrf')).json();await contexts.user.request.post(base+'/api/auth/signout',{form:{csrfToken:csrf.csrfToken,json:'true'}});
  for(const path of ['/api/user/profile','/api/user/favorites','/api/order'])await deny(contexts.user,path,'GET',undefined,401);
  const csrf2=await(await api(contexts.user,'/api/auth/csrf')).json();await contexts.user.request.post(base+'/api/auth/callback/credentials',{form:{csrfToken:csrf2.csrfToken,email:actors.user.email,password:process.env.DEMO_PASSWORD,json:'true'}});
 });
 await test(7,'server price/status, stock, duplicate quantities and invalid input',async()=>{
  const res=await api(contexts.user,'/api/order','POST',{...orderPayload,deliveryMethod:'courier',items:[{book:String(bookId),quantity:2,type:'buy',price:1}],totalPrice:1,status:'completed',paymentStatus:'paid'});assert.equal(res.status(),200);const d=(await res.json()).data;assert.equal(d.totalPrice,75000);assert.equal(d.status,'pending');assert.equal(d.paymentStatus,'pending');
  for(const items of [[{book:String(bookId),quantity:-1,type:'buy'}],[{book:String(id()),quantity:1,type:'buy'}],[{book:String(bookId),quantity:70,type:'buy'},{book:String(bookId),quantity:70,type:'buy'}]])await deny(contexts.user,'/api/order','POST',{...orderPayload,items},400);
 });
 const rentalForm=(extra={})=>({customer:JSON.stringify(orderPayload.customer),items:JSON.stringify([{book:String(bookId),type:'rent',quantity:2,rentDays:3}]),deliveryMethod:'courier',paymentMethod:'cash',passport:{name:'Demo.png',mimeType:'image/png',buffer:png},...extra});
 let rentalId;
 await test(8,'rental + order + stock are atomic, including failed DB save (Cloudinary mocked)',async()=>{
  const res=await contexts.user.request.post(base+'/api/order',{multipart:rentalForm()});assert.equal(res.status(),200);const d=(await res.json()).data;assert.equal(d.totalPrice,21000);
  const rent=await db.collection('rents').findOne({orderId:new mongoose.Types.ObjectId(d._id)});assert.ok(rent);rentalId=rent._id;assert.equal(rent.paymentMethod,'cash');assert.equal(rent.totalPrice,6000);assert.ok(rent.passportCloudinaryId);assert.ok(!rent.passportUrl);
  const payme=await contexts.user.request.post(base+'/api/order',{multipart:rentalForm({paymentMethod:'payme'})});assert.equal(payme.status(),200);const paymeOrder=(await payme.json()).data;assert.equal(paymeOrder.paymentStatus,'pending');assert.ok(await db.collection('rents').findOne({orderId:new mongoose.Types.ObjectId(paymeOrder._id),paymentMethod:'payme',paymentStatus:'pending'}));
  const invalidBefore=await snapshot();const unsupported=await contexts.user.request.post(base+'/api/order',{multipart:rentalForm({paymentMethod:'click'})});assert.equal(unsupported.status(),400);assert.equal(await snapshot(),invalidBefore);
  const beforeOrders=await db.collection('orders').countDocuments(), beforeRents=await db.collection('rents').countDocuments(), stock=(await db.collection('books').findOne({_id:bookId})).stock;
  await db.command({collMod:'rents',validator:{fullName:{$ne:'Demo DB rejection'}},validationLevel:'strict'});
  const fail=await contexts.user.request.post(base+'/api/order',{multipart:rentalForm({customer:JSON.stringify({...orderPayload.customer,name:'Demo DB rejection'})})});assert.equal(fail.status(),503);
  assert.equal(await db.collection('orders').countDocuments(),beforeOrders);assert.equal(await db.collection('rents').countDocuments(),beforeRents);assert.equal((await db.collection('books').findOne({_id:bookId})).stock,stock);
  await db.command({collMod:'rents',validator:{}});
 });
 await test(9,'online UI choices hidden; sandbox callbacks do not approve rentals',async()=>{
  const page=await contexts.user.newPage();await page.goto(base+'/mobile/components/checkout',{waitUntil:'domcontentloaded'});
  await page.getByPlaceholder('Masalan: Aziz Azizov').fill('Demo mobile');await page.getByPlaceholder('+998',{exact:true}).fill('+998000000000');await page.getByRole('button',{name:'Keyingi',exact:true}).click();
  await page.getByRole('textbox',{name:'Yetkazish manzili',exact:true}).fill('Demo mobile manual address');await page.getByRole('button',{name:'Keyingi',exact:true}).click();await page.getByRole('button',{name:'Keyingi',exact:true}).click();
  await expect(page.getByText('Naqd pulda',{exact:true})).toBeVisible();assert.equal(await page.getByText('Click',{exact:true}).count(),0);assert.equal(await page.getByText('Payme',{exact:true}).count(),0);await page.close();
 });
 await test(10,'same 2 copies × 3 days + delivery in server and pure pricing',async()=>{
  const {prepareOrder,cartItemTotal}=await import('../lib/order-input.mjs');const p={...orderPayload,deliveryMethod:'courier',items:[{book:String(bookId),type:'rent',quantity:2,rentDays:3}]};assert.equal(prepareOrder(p,[{...fixture,_id:String(bookId)}]).totalPrice,cartItemTotal({...fixture,type:'rent',quantity:2,rentDays:3})+15000);
 });
 await test(11,'manual address + zero coordinates stored and visible to assigned courier',async()=>{
  const res=await contexts.user.request.post(base+'/api/rent',{multipart:{name:'Demo coordinates',phone:'+998000000000',address:'Demo manual address',lat:'0',lng:'0',bookId:String(bookId),days:'3',payment:'cash',totalPrice:'1',passport:{name:'Demo.png',mimeType:'image/png',buffer:png}}});assert.equal(res.status(),200);const rent=(await res.json()).data;assert.equal(rent.totalPrice,3000);assert.equal(rent.lat,0);assert.equal(rent.lng,0);
  await db.collection('rents').updateOne({_id:new mongoose.Types.ObjectId(rent._id)},{$set:{status:'approved',courierId:actors.courier._id,courierStatus:'accepted'}});
  const jobs=await(await api(contexts.courier,'/api/courier')).json();const job=jobs.data.find(j=>String(j.id)===rent._id);assert.equal(job.address,'Demo manual address');assert.equal(job.lat,0);
  const before=await snapshot();const invalid=await contexts.user.request.post(base+'/api/rent',{multipart:{name:'Demo',phone:'+998000000000',address:'Demo',lat:'91',lng:'0',bookId:String(bookId),days:'1',payment:'cash',passport:{name:'Demo.png',mimeType:'image/png',buffer:png}}});assert.equal(invalid.status(),400);assert.equal(await snapshot(),before);
  const incomplete=await contexts.user.request.post(base+'/api/rent',{multipart:{name:'Demo',phone:'+998000000000',address:'Demo',lat:'',lng:'1',bookId:String(bookId),days:'1',payment:'cash',passport:{name:'Demo.png',mimeType:'image/png',buffer:png}}});assert.equal(incomplete.status(),400);assert.equal(await snapshot(),before);
 });
 await test(12,'17+ catalog pagination/search and immediate cache invalidation',async()=>{
  // Admin global search must not return unrelated orders for short terms or
  // interpret punctuation as a regular expression.
  const unmatched=await api(contexts.admin,'/api/admin/search?q=nonexistent-search-xyz');
  assert.equal(unmatched.status(),200);assert.deepEqual((await unmatched.json()).results.orders,[]);
  const bracket=await api(contexts.admin,'/api/admin/search?q=%5B%5B');
  assert.equal(bracket.status(),200);assert.deepEqual((await bracket.json()).results.orders,[]);
  const byId=await api(contexts.admin,'/api/admin/search?q='+orderId);
  assert.equal(byId.status(),200);assert.ok((await byId.json()).results.orders.some(o=>String(o._id)===orderId));
  await db.collection('books').insertMany(Array.from({length:18},(_,i)=>({...fixture,_id:id(),title:'Demo Page '+String(i).padStart(2,'0'),createdAt:new Date(Date.now()+i)})));
  const second=await(await api(contexts.admin,'/api/books?page=2&limit=16')).json();assert.ok(second.data.length>=3);
  const page=await contexts.admin.newPage();await page.goto(base+'/AdminPanel/Kitoblar',{waitUntil:'domcontentloaded'});await expect(page.getByRole('button',{name:'Keyingi sahifa',exact:true})).toBeEnabled();await page.getByRole('button',{name:'Keyingi sahifa',exact:true}).click();await expect(page.getByText('2 / 2',{exact:true})).toBeVisible();
  await page.getByPlaceholder('Qidirish (Nomi, Muallifi)...').fill('Demo Page 05');await expect(page.getByRole('heading',{name:'Demo Page 05',exact:true})).toBeVisible();await page.close();
  await api(contexts.anon,'/api/books?search=Demo%20Audit');assert.equal((await api(contexts.admin,'/api/books/'+bookId,'PUT',{title:'Demo Audit updated'})).status(),200);assert.ok((await(await api(contexts.anon,'/api/books?search=updated')).json()).data.some(b=>b._id===String(bookId)));
  const removable=await db.collection('books').findOne({title:'Demo Page 17'});await api(contexts.anon,'/api/books?search=Demo%20Page%2017');assert.equal((await api(contexts.admin,'/api/books/'+removable._id,'DELETE')).status(),200);assert.equal((await(await api(contexts.anon,'/api/books?search=Demo%20Page%2017')).json()).totalItems,0);
 });
 await test(13,'upload role/owner/type limits and authenticated private document URL (provider mocked)',async()=>{
  for(const name of ['anon']){await deny(contexts[name],'/api/upload','DELETE',{publicId:'demo/unknown'},401);await deny(contexts[name],'/api/upload','POST',{},401);}
  const before=await snapshot();const bad=await contexts.user.request.post(base+'/api/upload',{multipart:{file:{name:'Demo.png',mimeType:'image/png',buffer:Buffer.from('not an image')}}});assert.equal(bad.status(),400);assert.equal(await snapshot(),before);
  const oversized=await contexts.user.request.post(base+'/api/upload',{multipart:{file:{name:'Demo.png',mimeType:'image/png',buffer:Buffer.alloc(5*1024*1024+1)}}});assert.equal(oversized.status(),400);assert.equal(await snapshot(),before);
  const upload=await contexts.user.request.post(base+'/api/upload',{multipart:{file:{name:'Demo.png',mimeType:'image/png',buffer:png}}});assert.equal(upload.status(),200);const asset=(await upload.json()).publicId;
  await deny(contexts.other,'/api/upload','DELETE',{publicId:asset},403);assert.equal((await api(contexts.user,'/api/upload','DELETE',{publicId:asset})).status(),200);
  for(const ctx of [contexts.user,contexts.admin]) {
    const response=await api(ctx,ctx===contexts.admin?'/api/rent':'/api/user/profile');const body=JSON.stringify(await response.json());
    assert.ok(!body.includes('passportUrl')&&!body.includes('passportCloudinaryId'));
  }
  await db.collection('rents').updateOne({_id:rentalId},{$set:{status:'courier_assigned',returnCourierId:actors.courier._id}});
  await deny(contexts.courier2,'/api/courier/returns','PUT',{rentId:String(rentalId),action:'pickup'},403);
  await deny(contexts.other,'/api/rent/'+rentalId+'/document','GET',undefined,403);
  const urlResponse=await api(contexts.user,'/api/rent/'+rentalId+'/document');assert.equal(urlResponse.status(),200);const url=new URL((await urlResponse.json()).url);assert.ok(Number(url.searchParams.get('expires_at'))<=Math.floor(Date.now()/1000)+60);assert.equal(url.searchParams.get('type'),'authenticated');
  const audits=fs.readFileSync(process.env.MOCK_AUDIT_PATH,'utf8').trim().split('\n').map(JSON.parse);assert.ok(audits.some(a=>a.type==='authenticated'));
 });
 await test(14,'real Redis OTP send/attempt limits, expiry, replay; email mocked',async()=>{
  const email='demo-register-audit@example.invalid';const password=process.env.DEMO_PASSWORD;
  console.log('OTP check: local mocked send');
  const send=await api(contexts.anon,'/api/auth/register','POST',{email,password});assert.equal(send.status(),200);const saved=JSON.parse(fs.readFileSync(process.env.MOCK_OTP_PATH));assert.equal(saved.email,email);assert.ok(saved.code);
  const key='register_otp:'+hash(email);assert.ok(!(await redis.get(key)).includes(saved.code));
  for(let i=0;i<5;i++)assert.equal((await api(contexts.anon,'/api/auth/verify','POST',{email,otp:'000000'})).status(),400);
  await deny(contexts.anon,'/api/auth/verify','POST',{email,otp:saved.code},429);
  for(let i=0;i<2;i++)assert.equal((await api(contexts.anon,'/api/auth/register','POST',{email,password})).status(),200);
  await deny(contexts.anon,'/api/auth/register','POST',{email,password},429);
  const expired='demo-expired@example.invalid';await api(contexts.anon,'/api/auth/register','POST',{email:expired,password});const expiredCode=JSON.parse(fs.readFileSync(process.env.MOCK_OTP_PATH)).code;await redis.pexpire('register_otp:'+hash(expired),1);await new Promise(resolve=>setTimeout(resolve,10));await deny(contexts.anon,'/api/auth/verify','POST',{email:expired,otp:expiredCode},400);
  console.log('OTP check: UI sign-in failure mock');
  const page=await contexts.anon.newPage();
  await page.route('**/api/auth/register',r=>r.fulfill({status:200,contentType:'application/json',body:'{"success":true}'}));
  await page.route('**/api/auth/verify',r=>r.fulfill({status:201,contentType:'application/json',body:'{"success":true}'}));
  await page.route('**/api/auth/callback/credentials',r=>r.fulfill({status:401,contentType:'application/json',body:JSON.stringify({url:base+'/?error=CredentialsSignin'})}));
  await page.goto(base,{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:"Ro'yxatdan o'tish",exact:true}).first().click();await page.getByPlaceholder('name@company.com').fill('demo-ui@example.invalid');await page.getByPlaceholder('••••••••').fill(password);await page.getByRole('button',{name:'Davom etish',exact:true}).click();await page.getByPlaceholder('123456').fill('123456');await page.getByRole('button',{name:'Tasdiqlash',exact:true}).click();await expect(page.getByText('Hisob yaratildi. Endi email va parol bilan kiring.',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Kirish',exact:true}).last()).toBeEnabled();await page.close();
  const valid='demo-valid@example.invalid';await api(contexts.anon,'/api/auth/register','POST',{email:valid,password});const code=JSON.parse(fs.readFileSync(process.env.MOCK_OTP_PATH)).code;
  assert.equal((await api(contexts.anon,'/api/auth/verify','POST',{email:valid,otp:code})).status(),201);await deny(contexts.anon,'/api/auth/verify','POST',{email:valid,otp:code},400);
 });
 await test(16,'rental and mixed-order delivery synchronization and ownership',async()=>{
  const mk=async(types,parentStatus='processing')=>{
   const oid=id(), rents=types.filter(t=>t==='rent').map(()=>id());
   await db.collection('orders').insertOne({_id:oid,user:actors.user._id,items:types.map(type=>({book:bookId,title:'Demo',type,quantity:1,price:1000})),customer:{name:'Demo',phone:'000',address:'Demo'},deliveryMethod:'courier',totalPrice:1000,status:parentStatus,courierStatus:'on_way',courierId:actors.courier._id});
   if(rents.length)await db.collection('rents').insertMany(rents.map(_id=>({_id,orderId:oid,user:actors.user._id,book:bookId,bookTitle:'Demo',fullName:'Demo',phone:'000',address:'Demo',days:2,totalPrice:1000,paymentMethod:'cash',status:'approved',courierStatus:'on_way',courierId:actors.courier._id})));
   return {oid,rents};
  };
  const deliver=(kind,record,ctx=contexts.courier)=>api(ctx,'/api/courier','PUT',{id:String(record),type:kind,status:'delivered'});
  const status=async oid=>(await db.collection('orders').findOne({_id:oid})).status;
  const rentOnly=await mk(['rent'],'pending');assert.equal((await deliver('rent',rentOnly.rents[0])).status(),200);assert.equal(await status(rentOnly.oid),'completed');
  const mixed=await mk(['buy','rent']);assert.equal((await deliver('buy',mixed.oid)).status(),200);assert.equal(await status(mixed.oid),'processing');assert.equal((await deliver('rent',mixed.rents[0])).status(),200);assert.equal(await status(mixed.oid),'completed');
  const mixedReverse=await mk(['buy','rent']);assert.equal((await deliver('rent',mixedReverse.rents[0])).status(),200);assert.equal(await status(mixedReverse.oid),'processing');assert.equal((await deliver('buy',mixedReverse.oid)).status(),200);assert.equal(await status(mixedReverse.oid),'completed');
  const parallel=await mk(['rent','rent'],'pending');const responses=await Promise.all(parallel.rents.map(r=>deliver('rent',r)));assert.deepEqual(responses.map(r=>r.status()),[200,200]);assert.equal(await status(parallel.oid),'completed');
  const cancelled=await mk(['rent'],'cancelled');await deny(contexts.courier,'/api/courier','PUT',{id:String(cancelled.rents[0]),type:'rent',status:'delivered'},409);assert.equal((await db.collection('rents').findOne({_id:cancelled.rents[0]})).status,'approved');
  const guarded=await mk(['rent'],'pending');await deny(contexts.courier2,'/api/courier','PUT',{id:String(guarded.rents[0]),type:'rent',status:'delivered'},403);
  const standalone=await mk(['rent'],'pending');await db.collection('rents').updateOne({_id:standalone.rents[0]},{$unset:{orderId:''}});assert.equal((await deliver('rent',standalone.rents[0])).status(),200);
 });
 await test(15,'500, network errors and empty catalog are distinct, retry works',async()=>{
  for(const [kind,body] of [['500',null],['network',null],['empty',{success:true,data:[],totalPages:0,totalItems:0}]]){
   const page=await contexts.user.newPage();await page.route('**/api/books?**',r=>kind==='network'?r.abort():r.fulfill({status:kind==='500'?500:200,contentType:'application/json',body:JSON.stringify(body||{success:false})}));await page.goto(base+'/mainPage/sotibolish',{waitUntil:'domcontentloaded'});
   if(kind==='empty')await expect(page.getByText('Kitoblar topilmadi 😔',{exact:true})).toBeVisible();else {await expect(page.getByRole('button',{name:'Qayta urinish',exact:true})).toBeVisible();assert.equal(await page.getByText('Kitoblar topilmadi 😔',{exact:true}).count(),0);await page.unroute('**/api/books?**');await page.getByRole('button',{name:'Qayta urinish',exact:true}).click();await expect(page.getByRole('heading',{name:/Demo Page/}).first()).toBeVisible();}
   await page.close();
  }
 });
 console.log(`Audit scenarios passed: ${passed}; Cloudinary/Resend mocked, Payme requests local mock only; no real payments or messages.`);
 }finally{await browser.close();redis.disconnect();await mongoose.disconnect()}
})().catch(error=>{console.error(error.message);process.exitCode=1});
