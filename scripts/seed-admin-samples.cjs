/* Explicitly authorized sample records. No email, payment or delivery services are called. */
const mongoose = require("mongoose");
const { createHash } = require("node:crypto");
const batch = "admin-design-2026-11-06";
const id = key => new mongoose.Types.ObjectId(createHash("sha256").update(batch + ":" + key).digest("hex").slice(0,24));
async function main() {
  if (!process.argv.includes("--apply") || process.env.SEED_SAMPLE_DATA_ACK !== batch) {
    throw new Error("Pass --apply and set SEED_SAMPLE_DATA_ACK to the reviewed batch name.");
  }
  if (!process.env.MONGO_URI || !process.env.MONGO_DB_NAME) throw new Error("Explicit Mongo URI and database name required.");
  await mongoose.connect(process.env.MONGO_URI, {dbName:process.env.MONGO_DB_NAME,serverSelectionTimeoutMS:10000});
  const db = mongoose.connection.db;
  const now = new Date();
  const meta = { sampleData:true, sampleBatch:batch };
  const names = ["Aliyeva Sevinch","Karimov Javohir","Norqulov Bekzod","Ismoilova Dilnoza","Tursunov Aziz","Mamadova Zarnigor","Saidov Akmal","Qodirov Sardor"];
  const users = names.map((fullName,index)=>({
    _id:id("user-"+index),fullName,email:"reader-"+(index+1)+"-"+batch+"@example.invalid",
    role:index<6?"user":"courier",phone:"+998000000"+String(index).padStart(3,"0"),
    avatar:"",createdAt:new Date(Date.UTC(now.getUTCFullYear(),0,5+index)),updatedAt:now,...meta
  }));
  const titles = [
    ["Mehrobdan chayon","Abdulla Qodiriy",45000,"Badiiy Adabiyotlar",288],
    ["Kecha va kunduz","Cho‘lpon",38000,"Badiiy Adabiyotlar",320],
    ["Shum bola","G‘afur G‘ulom",29000,"Bolalar Adabiyoti",192],
    ["Ufq","Said Ahmad",52000,"Badiiy Adabiyotlar",480],
    ["Navoiy","Oybek",58000,"Tarixiy Kitoblar",512],
    ["Momo yer","Chingiz Aytmatov",34000,"Badiiy Adabiyotlar",208],
    ["Robinzon Kruzo","Daniel Defo",41000,"Sarguzashtlar",304],
    ["Oq kema","Chingiz Aytmatov",36000,"Badiiy Adabiyotlar",176]
  ];
  const books = titles.map(([title,author,price,category,pages],index)=>({
    _id:id("book-"+index),title,author,price,category,pages,
    description:title+" — "+author+" qalamiga mansub asar. Kitobxonlar uchun xarid va ijara shaklida taqdim etiladi.",
    stock:8+index,condition:"Yangi",language:"O'zbek",publisher:"Kitobdosh",
    images:["/demo-book.svg"],cloudinaryIds:[],isRentable:true,rentalPricePerDay:1200+index*100,
    averageRating:0,numReviews:0,createdAt:new Date(Date.UTC(now.getUTCFullYear(),0,5)),updatedAt:now,...meta
  }));
  const orders=[],rents=[];
  const monthlyCounts=[4,6,5,7,6,8,10,9,12,14,13,16];
  for(let monthIndex=0;monthIndex<12;monthIndex++) {
    const date=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-11+monthIndex,1));
    for(let index=0;index<monthlyCounts[monthIndex];index++){
      const person=users[index%6], book=books[(index+monthIndex)%books.length];
      const current=monthIndex===11;
      const day=current?1+(index%Math.max(1,now.getUTCDate()-1)):2+(index*2%26);
      const createdAt=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),day,8,index));
      const status=current?["pending","processing","completed","completed"][index%4]:"completed";
      const quantity=1+index%3;
      orders.push({_id:id("order-"+monthIndex+"-"+index),user:person._id,
        customer:{name:person.fullName,phone:person.phone,address:["Toshkent","Samarqand","Buxoro"][index%3]},
        items:[{book:book._id,title:book.title,author:book.author,image:book.images[0],quantity,price:book.price,type:"buy"}],
        deliveryMethod:index%2?"pickup":"courier",totalPrice:book.price*quantity,
        status,paymentMethod:"cash",paymentStatus:status==="completed"?"paid":"pending",
        createdAt,updatedAt:createdAt,...meta});
    }
    for(let index=0;index<2+monthIndex%5;index++){
      const person=users[(index+1)%6],book=books[(index+monthIndex)%books.length];
      const current=monthIndex===11;
      const createdAt=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),current?Math.max(1,now.getUTCDate()-2):5+index*3,9,index));
      const status=current?["active","active","pending"][index%3]:"returned";
      const days=7+index*3;
      rents.push({_id:id("rent-"+monthIndex+"-"+index),user:person._id,book:book._id,
        bookTitle:book.title,bookImage:book.images[0],fullName:person.fullName,phone:person.phone,address:"Toshkent",
        days,totalPrice:book.rentalPricePerDay*days,status,paymentMethod:"cash",
        paymentStatus:status==="pending"?"pending":"paid",
        returnDate:new Date(createdAt.getTime()+days*86400000),createdAt,updatedAt:createdAt,...meta});
    }
  }
  const summary={};
  for(const [name,docs] of [["users",users],["books",books],["orders",orders],["rents",rents]]){
    const result=await db.collection(name).bulkWrite(docs.map(doc=>({updateOne:{filter:{_id:doc._id},update:{$setOnInsert:doc},upsert:true}})),{ordered:true});
    summary[name]={inserted:result.upsertedCount,existing:result.matchedCount,batchTotal:await db.collection(name).countDocuments({sampleBatch:batch})};
  }
  console.log(JSON.stringify({batch,summary}));
}
main().catch(error=>{console.error("Sample data operation failed: "+error.name);process.exitCode=1}).finally(()=>mongoose.disconnect());
