const {chromium,expect}=require("@playwright/test");
const mongoose=require("mongoose"),bcrypt=require("bcryptjs"),assert=require("node:assert/strict"),fs=require("fs");
const base=process.env.DEFENSE_BASE_URL;
if(!/^http:\/\/127\.0\.0\.1:\d+$/.test(base||"")||!/^mongodb:\/\/127\.0\.0\.1:\d+\//.test(process.env.MONGO_URI||"")||!/^kitobdosh_test/.test(process.env.MONGO_DB_NAME||""))throw new Error("Isolated test environment only");
(async()=>{
 if(process.env.AUDIT_DISABLE_REDIS==="1")assert.equal(process.env.REDIS_HOST,undefined);
 await mongoose.connect(process.env.MONGO_URI,{dbName:process.env.MONGO_DB_NAME});const db=mongoose.connection.db;
 const browser=await chromium.launch({args:["--no-sandbox"]}),contexts={},pages={},actors={},errors=[];
 const waitDb=async(collection,filter,field,value)=>expect.poll(async()=>{const doc=await db.collection(collection).findOne(filter);return doc?.[field]},{timeout:15000}).toBe(value);
 const go=async(page,path)=>page.goto(base+path,{waitUntil:"domcontentloaded"});
 try{
  for(const [name,role]of [["user","user"],["admin","admin"],["courier","courier"],["other","courier"]]){
   actors[name]={_id:new mongoose.Types.ObjectId(),email:"flow-"+name+"@example.invalid",fullName:"Sinov "+name,role,password:await bcrypt.hash(process.env.DEMO_PASSWORD,10),favorites:[],friends:[],createdAt:new Date()};
   await db.collection("users").insertOne(actors[name]);
   contexts[name]=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce"});
   await contexts[name].route("**/*",r=>new URL(r.request().url()).hostname==="127.0.0.1"?r.continue():r.abort());
   pages[name]=await contexts[name].newPage();pages[name].on("pageerror",e=>errors.push(name+": "+e.message));
  }
  const book={_id:new mongoose.Types.ObjectId(),title:"Ijara jarayoni kitobi",author:"Kitobdosh",description:"Ajratilgan sinov kitobi",images:["/demo-book.svg"],price:30000,stock:5,category:"Badiiy Adabiyotlar",isRentable:true,rentalPricePerDay:1000,createdAt:new Date()};
  await db.collection("books").insertOne(book);
  const login=async name=>{const p=pages[name];await go(p,"/");await p.getByPlaceholder("name@company.com").fill(actors[name].email);await p.getByPlaceholder("••••••••").fill(process.env.DEMO_PASSWORD);await p.getByRole("button",{name:"Kirish",exact:true}).click();await p.waitForURL(name==="admin"?"**/AdminPanel":name==="user"?"**/mainPage":"**/KurierPanel");};
  await login("user");const user=pages.user;await user.setViewportSize({width:390,height:844});
  await go(user,"/mobile/book/"+book._id);await user.getByRole("heading",{name:book.title,exact:true}).waitFor();
  const [cart]=await Promise.all([user.waitForResponse(r=>r.url().endsWith("/api/cart")&&r.request().method()==="POST"),user.getByRole("button",{name:"Ijara",exact:true}).click()]);assert.equal(cart.status(),200);assert.equal((await db.collection("carts").findOne({_id:String(actors.user._id)})).items.length,1);
  await go(user,"/mobile/components/Savatcha");await user.getByRole("heading",{name:book.title,exact:true}).waitFor();await user.getByRole("button",{name:"7 kun",exact:true}).click();await user.getByRole("button",{name:"Ijarani tasdiqlash",exact:true}).click();
  await user.getByPlaceholder("Masalan: Aziz Azizov").fill("Sinov Kitobxon");await user.getByPlaceholder("+998",{exact:true}).fill("+998000000000");await user.getByRole("button",{name:"Keyingi",exact:true}).click();
  await user.getByRole("textbox",{name:"Yetkazish manzili",exact:true}).fill("Toshkent, Yunusobod");await user.getByRole("button",{name:"Keyingi",exact:true}).click();await user.getByText("Kuryer orqali",{exact:true}).click();await user.getByRole("button",{name:"Keyingi",exact:true}).click();await user.getByText("Naqd pulda",{exact:true}).click();await user.getByRole("button",{name:"Keyingi",exact:true}).click();
  const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jWZkAAAAASUVORK5CYII=","base64");
  await user.locator("input[type=file]").setInputFiles({name:"test-image.png",mimeType:"image/png",buffer:png});await user.getByRole("button",{name:"Keyingi",exact:true}).click();
  const [placed]=await Promise.all([user.waitForResponse(r=>r.url().endsWith("/api/order")&&r.request().method()==="POST"),user.getByRole("button",{name:"Buyurtma berish",exact:true}).click()]);
  assert.equal(placed.status(),200);const order=(await placed.json()).data;assert.equal(order.totalPrice,22000);assert.equal(order.paymentStatus,"pending");
  const rent=await db.collection("rents").findOne({orderId:new mongoose.Types.ObjectId(order._id)});assert(rent);assert.equal(rent.status,"pending");assert.equal(rent.totalPrice,7000);assert.equal((await db.collection("books").findOne({_id:book._id})).stock,4);console.log("PASS user UI -> MongoDB cart -> rental checkout -> pending MongoDB order and rent");
  await login("admin");const admin=pages.admin;await go(admin,"/AdminPanel/rentRequest");await admin.getByText("Sinov Kitobxon",{exact:true}).waitFor();await admin.getByRole("button",{name:"Tasdiqlash",exact:true}).click();await waitDb("rents",{_id:rent._id},"status","approved");console.log("PASS admin UI approves pending rental");
  await login("courier");const courier=pages.courier;await go(courier,"/KurierPanel/buyurtmalar?task="+rent._id);
  await courier.getByRole("button",{name:"Topshiriqni qabul qilish",exact:true}).click();await waitDb("rents",{_id:rent._id},"courierStatus","accepted");
  const assigned=await db.collection("rents").findOne({_id:rent._id});assert.equal(String(assigned.courierId),String(actors.courier._id));console.log("PASS courier UI accepts task; assignment is persisted");
  await login("other");const foreign=await contexts.other.request.get(base+"/api/courier");assert(!(await foreign.json()).data.some(job=>String(job.id)===String(rent._id)));
  const forbidden=await contexts.other.request.put(base+"/api/courier",{data:{id:String(rent._id),type:"rent",status:"picked_up"}});assert.equal(forbidden.status(),403);console.log("PASS another courier cannot see or update the assigned task");
  await courier.getByRole("button",{name:"Kitobni oldim",exact:true}).click();await waitDb("rents",{_id:rent._id},"courierStatus","picked_up");await courier.getByRole("button",{name:"Yo‘lga chiqish",exact:true}).click();await waitDb("rents",{_id:rent._id},"courierStatus","on_way");
  await courier.getByRole("button",{name:"Yetkazilganini tasdiqlash",exact:true}).click();await courier.getByRole("dialog").waitFor();await courier.getByRole("button",{name:"Ha, yetkazildi",exact:true}).click();await waitDb("rents",{_id:rent._id},"courierStatus","delivered");await waitDb("rents",{_id:rent._id},"status","active");await waitDb("orders",{_id:new mongoose.Types.ObjectId(order._id)},"status","completed");
  const finalRent=await db.collection("rents").findOne({_id:rent._id}),finalOrder=await db.collection("orders").findOne({_id:new mongoose.Types.ObjectId(order._id)});assert.equal(finalRent.paymentStatus,"pending");assert.equal(finalOrder.paymentStatus,"pending");assert(finalRent.returnDate>new Date());assert(finalRent.courierTimeline.delivered);console.log("PASS courier UI picked_up -> on_way -> delivered; rent active; parent completed; cash payment remains pending");
  const repeat=await contexts.courier.request.put(base+"/api/courier",{data:{id:String(rent._id),type:"rent",status:"delivered"}});assert.equal(repeat.status(),409);
  await go(courier,"/KurierPanel/yakunlanganlar?task="+rent._id);await courier.getByRole("heading",{name:"Buyurtma #"+String(rent._id).slice(-6).toUpperCase(),exact:true}).waitFor();
  await go(user,"/mobile/components/mobileprofile");await user.getByRole("button",{name:/Mening Buyurtmalarim/}).click();await user.getByText("Ijara faol",{exact:true}).waitFor();console.log("PASS user UI shows active rental; courier history retains delivered task; repeated delivery is rejected");
  assert.equal((await db.collection("carts").findOne({_id:String(actors.user._id)})).items.length,0);assert.equal(errors.length,0,JSON.stringify(errors));console.log("PASS rental lifecycle end-to-end: real sign-ins, browser, API, MongoDB replica set; Redis-independent cart. Upload and external notifications mocked.");
 }catch(error){for(const [name,page]of Object.entries(pages)){console.log("FAILURE "+name+": "+(await page.locator("body").innerText().catch(()=>"")).slice(0,1800))}throw error}
 finally{await browser.close();await mongoose.disconnect()}
})().catch(error=>{console.error(error.stack);process.exitCode=1});
