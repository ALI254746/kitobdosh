const {chromium,expect}=require('@playwright/test');const mongoose=require('mongoose');const bcrypt=require('bcryptjs');const fs=require('fs');
const assert=require('node:assert/strict');
const base=process.env.DEFENSE_BASE_URL;
if(!/^http:\/\/127\.0\.0\.1:\d+$/.test(base||'')||!/^mongodb:\/\/127\.0\.0\.1:\d+\//.test(process.env.MONGO_URI||'')||!/^kitobdosh_test/.test(process.env.MONGO_DB_NAME||''))throw new Error('Local test only');
(async()=>{
 await mongoose.connect(process.env.MONGO_URI,{dbName:process.env.MONGO_DB_NAME});const db=mongoose.connection.db;
 const hello=await db.admin().command({hello:1});assert.ok(hello.setName&&hello.isWritablePrimary);
 const browser=await chromium.launch();const errors=[],outbound=[];const shots='docs/screenshots/journey';fs.mkdirSync(shots,{recursive:true});
 const contexts={};const pages={};const users={};
 for(const [name,role]of[['user','user'],['admin','admin'],['courier','kurer']]){
  const _id=new mongoose.Types.ObjectId();users[name]={_id,email:`demo-journey-${name}@example.invalid`};await db.collection('users').insertOne({...users[name],role,fullName:'Demo '+name,password:await bcrypt.hash(process.env.DEMO_PASSWORD,10),favorites:[],friends:[],createdAt:new Date()});
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});contexts[name]=ctx;
  // Browser also blocks external requests. Nothing is retried via another route.
  await ctx.route('**/*',r=>{const url=new URL(r.request().url());if(url.hostname==='127.0.0.1')return r.continue();outbound.push(url.hostname);return r.abort();});
  pages[name]=await ctx.newPage();pages[name].on('pageerror',e=>{const message=name+' '+new URL(pages[name].url()).pathname+' '+e.message;errors.push(message);console.log('BROWSER ERROR '+message);});
 }
 const bookId=new mongoose.Types.ObjectId();const title='Demo Journey Kitob';await db.collection('books').insertOne({_id:bookId,title,author:'Demo Muallif',description:'Demo test kitobi. Shaxsiy hujjat emas.',images:['/demo-book.svg'],price:30000,stock:10,category:'Badiiy Adabiyotlar',isRentable:true,rentalPricePerDay:1000,createdAt:new Date()});
 const shot=async(page,name)=>{await page.waitForTimeout(700);await page.screenshot({path:`${shots}/${name}.png`,fullPage:true});};
 const goto=async(page,path)=>page.goto(base+path,{waitUntil:'domcontentloaded'});
 const login=async(name)=>{const p=pages[name];await goto(p,'/');await p.getByPlaceholder('name@company.com').fill(users[name].email);await p.getByPlaceholder('••••••••').fill(process.env.DEMO_PASSWORD);await p.getByRole('button',{name:'Kirish',exact:true}).click();await p.waitForURL(name==='admin'?'**/AdminPanel':name==='courier'?'**/KurierPanel':'**/mainPage');};
 const waitDb=async(collection,filter,field,value)=>expect.poll(async()=>{const r=await db.collection(collection).findOne(filter);return r?.[field];}).toBe(value);
 try{
 assert.equal((await contexts.user.request.get(base+'/uploads/renters/demo.png')).status(),404);
 const blockedImage=await contexts.user.request.get(base+'/_next/image?url=%2Fuploads%2Frenters%2Fdemo.png&w=128&q=75');assert.equal(blockedImage.status(),400);assert.ok((await blockedImage.text()).includes('not allowed'));
 const p=pages.user;await goto(p,'/');await p.getByRole('button',{name:'Kirish',exact:true}).waitFor();await shot(p,'01-login');await login('user');
 await goto(p,'/mainPage/sotibolish');await expect(p.getByRole('heading',{name:title,exact:true})).toBeVisible();await shot(p,'02-desktop-catalog');
 // Both routes use genuine UI cart updates, API and Redis. No cart is seeded through API.
 const place=async(rent)=>{
  await p.setViewportSize({width:390,height:844});await goto(p,'/mobile/book/'+bookId);await p.getByRole('heading',{name:title,exact:true}).waitFor();
  await shot(p,rent?'06-rental-book':'02-mobile-book');
  const [cartResponse]=await Promise.all([p.waitForResponse(r=>r.url().endsWith('/api/cart')&&r.request().method()==='POST'),p.getByRole('button',{name:rent?'Ijara':'Sotib olish',exact:true}).click()]);assert.equal(cartResponse.status(),200);
  await goto(p,'/mobile/components/Savatcha');await p.getByRole('heading',{name:title,exact:true}).waitFor();
  if(rent)await p.getByRole('button',{name:'7 kun',exact:true}).click();
  await shot(p,rent?'07-rental-cart':'03-purchase-cart');
  await p.getByRole('button',{name:rent?'Ijarani tasdiqlash':'Xaridni yakunlash',exact:true}).click();
  await p.getByPlaceholder('Masalan: Aziz Azizov').fill(rent?'Demo Ijara Xaridor':'Demo Cash Xaridor');await p.getByPlaceholder('+998',{exact:true}).fill('+998000000000');
  await p.getByRole('button',{name:'Keyingi',exact:true}).click();await p.getByRole('textbox',{name:'Yetkazish manzili',exact:true}).fill('Demo manzil, haqiqiy manzil emas');
  await p.getByRole('button',{name:'Keyingi',exact:true}).click();await p.getByText('Kuryer orqali',{exact:true}).click();await p.getByRole('button',{name:'Keyingi',exact:true}).click();await p.getByText('Naqd pulda',{exact:true}).click();await p.getByRole('button',{name:'Keyingi',exact:true}).click();
  if(rent){
    // A generic 1px Demo PNG, never a passport or identity document; provider upload is mocked.
    const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jWZkAAAAASUVORK5CYII=','base64');
    await p.locator('input[type=file]').setInputFiles({name:'Demo-not-a-passport.png',mimeType:'image/png',buffer:png});await p.getByRole('button',{name:'Keyingi',exact:true}).click();
  }
  await shot(p,rent?'08-rental-cash-review':'04-purchase-cash-review');
  const [response]=await Promise.all([p.waitForResponse(r=>r.url().endsWith('/api/order')&&r.request().method()==='POST'),p.getByRole('button',{name:'Buyurtma berish',exact:true}).click()]);assert.equal(response.status(),200);const data=(await response.json()).data;
  assert.equal(data.totalPrice,rent?22000:45000);assert.equal(data.paymentMethod,'cash');assert.equal(data.paymentStatus,'pending');
  await waitDb('orders',{_id:new mongoose.Types.ObjectId(data._id)},'totalPrice',rent?22000:45000);
  await p.waitForURL('**/mobile/components/actions');await goto(p,'/mobile/components/mobileprofile');await expect(p.getByRole('heading',{name:'Salom, Demo! ✨',exact:true})).toBeVisible();await p.getByRole('button',{name:/Mening Buyurtmalarim/}).click();await expect(p.getByRole('heading',{name:title,exact:true}).first()).toBeVisible();await shot(p,rent?'09-rental-profile':'05-purchase-profile');
  console.log('PASS UI → cart API/Redis → cash '+(rent?'rental':'purchase')+' → MongoDB → profile');return data;
 };
 const purchase=await place(false);const rentalOrder=await place(true);const rental=await db.collection('rents').findOne({orderId:new mongoose.Types.ObjectId(rentalOrder._id)});assert.ok(rental&&rental.totalPrice===7000&&rental.paymentMethod==='cash');
 await login('admin');const a=pages.admin;await goto(a,'/AdminPanel/sotuvdagiKitoblar');await expect(a.getByRole('button',{name:'Buyurtmalar (1)',exact:true})).toBeVisible();await a.getByRole('button',{name:'Buyurtmalar (1)',exact:true}).click();await expect(a.getByText('Demo Cash Xaridor',{exact:true})).toBeVisible();await a.getByRole('button',{name:'Tasdiqlash (Kuryerga)',exact:true}).click();await waitDb('orders',{_id:new mongoose.Types.ObjectId(purchase._id)},'status','processing');await shot(a,'10-admin-cash-order');
 await goto(a,'/AdminPanel/rentRequest');await expect(a.getByText('Demo Ijara Xaridor',{exact:true})).toBeVisible();await a.getByRole('button',{name:'Tasdiqlash',exact:true}).click();await waitDb('rents',{_id:rental._id},'status','approved');await shot(a,'11-admin-rental');
 await login('courier');const c=pages.courier;
 for(const [record,type,name]of[[purchase,'buy','purchase'],[rental,'rent','rental']]){
  await goto(c,'/KurierPanel/buyurtmalar');
  const jobCard=c.locator('div.group.relative.overflow-hidden').filter({has:c.getByText('ID: #'+String(record._id).slice(-5).toUpperCase(),{exact:true})});
  await jobCard.getByRole('button',{name:"Ma'lumotlar va boshqaruv",exact:true}).click();
  const [acceptResponse]=await Promise.all([c.waitForResponse(r=>r.url().endsWith('/api/courier')&&r.request().method()==='PUT'),c.getByRole('button',{name:'Buyurtmani Qabul Qilish',exact:true}).click()]);const accepted=(await acceptResponse.json()).data;assert.equal(String(accepted._id),String(record._id));
  await waitDb(type==='buy'?'orders':'rents',{_id:new mongoose.Types.ObjectId(record._id)},'courierStatus','accepted');await goto(c,'/KurierPanel/faolTopshiriqlar');await expect(c.getByRole('button',{name:'Kitob Olinishini Kuting',exact:true})).toBeDisabled();await shot(c,`12-${name}-courier-accepted`);
  await goto(a,'/AdminPanel/kurierlar');await a.getByRole('button',{name:'Kitob Olish',exact:true}).click();const row=a.getByRole('row').filter({has:a.getByRole('button',{name:'Kitobni berish',exact:true})});await row.getByRole('button',{name:'Kitobni berish',exact:true}).click();await waitDb(type==='buy'?'orders':'rents',{_id:new mongoose.Types.ObjectId(record._id)},'courierStatus','picked_up');
  await goto(c,'/KurierPanel/faolTopshiriqlar');for(const state of ['on_way','delivered']){await c.getByRole('button',{name:'Keyingi Bosqich',exact:true}).click();await waitDb(type==='buy'?'orders':'rents',{_id:new mongoose.Types.ObjectId(record._id)},'courierStatus',state);if(state==='on_way')await shot(c,`13-${name}-courier-on-way`);}
  await shot(c,`14-${name}-courier-delivered`);console.log('PASS admin approve → courier accept → admin handover → courier on_way/delivered: '+name);
 }
 assert.equal((await db.collection('orders').findOne({_id:new mongoose.Types.ObjectId(purchase._id)})).status,'completed');assert.equal((await db.collection('rents').findOne({_id:rental._id})).status,'active');
 await goto(p,'/mobile/components/mobileprofile');await p.getByRole('button',{name:/Mening Buyurtmalarim/}).click();await expect(p.getByText('Yetkazildi',{exact:true})).toBeVisible();await expect(p.getByText('Ijara faol',{exact:true})).toBeVisible();await shot(p,'15-user-final-delivery-status');
 const providers=fs.readFileSync(process.env.MOCK_AUDIT_PATH,'utf8').trim().split('\n').map(JSON.parse);assert.ok(providers.some(e=>e.provider==='cloudinary'&&e.type==='authenticated'));
 assert.equal(errors.length,0,JSON.stringify(errors));console.log('PASS: Mongo replica set + real Redis + browser/DB journey; Cloudinary mocked, no email delivery test; external browser/server egress blocked.');
 const parent=await db.collection('orders').findOne({_id:new mongoose.Types.ObjectId(rentalOrder._id)});assert.equal(parent.status,'completed');console.log('PASS delivered rental and parent order status are synchronized');
 console.log('Screenshots saved in '+shots);console.log('Blocked external browser domains: '+[...new Set(outbound)].join(', '));
 }catch(e){for(const [name,page]of Object.entries(pages)){await page.screenshot({path:`/tmp/kitobdosh-journey-${name}-failure.png`,fullPage:true}).catch(()=>{});console.log(name+': '+(await page.locator('body').innerText()).slice(0,3500));}throw e;}
 finally{await browser.close();await mongoose.disconnect();}
})().catch(e=>{console.error(e.message);process.exitCode=1});
