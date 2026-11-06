const mongoose=require("mongoose");
const {createHash}=require("node:crypto");
const batch="courier-panel-2026-11-06";
const oid=key=>new mongoose.Types.ObjectId(createHash("sha256").update(batch+":"+key).digest("hex").slice(0,24));
async function main(){
 if(!process.argv.includes("--apply")||process.env.SEED_SAMPLE_DATA_ACK!==batch)throw new Error("Explicit --apply and batch acknowledgement required.");
 if(!process.env.MONGO_URI||!process.env.MONGO_DB_NAME)throw new Error("Explicit MongoDB settings required.");
 await mongoose.connect(process.env.MONGO_URI,{dbName:process.env.MONGO_DB_NAME,serverSelectionTimeoutMS:10000});
 const db=mongoose.connection.db,now=new Date();
 const couriers=await db.collection("users").find({role:{$in:["courier","kurier","kurer"]}},{projection:{_id:1}}).toArray();
 const customers=await db.collection("users").find({sampleBatch:"admin-design-2026-11-06",role:"user"}).toArray();
 const books=await db.collection("books").find({sampleBatch:"admin-design-2026-11-06"}).toArray();
 if(!couriers.length||!customers.length||!books.length)throw new Error("Courier accounts and sample catalog must exist first.");
 const places=[
  ["Toshkent sh., Yunusobod tumani, 12-mavze",41.3659,69.2928],
  ["Toshkent sh., Mirzo Ulug‘bek tumani, Buyuk Ipak Yo‘li",41.3263,69.3282],
  ["Toshkent sh., Chilonzor tumani, Bunyodkor ko‘chasi",41.2794,69.2031],
  ["Toshkent sh., Yakkasaroy tumani, Shota Rustaveli ko‘chasi",41.2867,69.2553],
  ["Toshkent sh., Mirobod tumani, Oybek ko‘chasi",41.2988,69.2756],
  ["Toshkent sh., Shayxontohur tumani, Chorsu maydoni",41.3256,69.2367],
 ];
 const orders=[],rents=[];
 for(const courier of couriers){
  const statuses=[...Array(8).fill("new"),"accepted","picked_up","on_way",...Array(12).fill("delivered")];
  for(let index=0;index<statuses.length;index++){
   const status=statuses[index],customer=customers[index%customers.length],book=books[index%books.length],place=places[index%places.length];
   const age=status==="delivered"?(index-10)*86400000:((index+1)*35*60000);
   const createdAt=new Date(now.getTime()-age);
   const steps=["new","accepted","picked_up","on_way","delivered"],stage=steps.indexOf(status),timeline={};
   for(let step=0;step<=stage;step++)timeline[steps[step]]=new Date(createdAt.getTime()+step*8*60000);
   const updatedAt=timeline[status];
   const base={_id:oid(courier._id+"-"+index),user:customer._id,courierId:courier._id.toString(),courierStatus:status,courierTimeline:timeline,
    paymentMethod:"cash",paymentStatus:index%4===0?"pending":"paid",createdAt,updatedAt,sampleData:true,sampleBatch:batch};
   if(index%3===0){
    const days=14;
    rents.push({...base,book:book._id,bookTitle:book.title,bookImage:book.images[0],fullName:customer.fullName,phone:customer.phone,address:place[0],lat:place[1],lng:place[2],days,totalPrice:days*book.rentalPricePerDay,
     status:status==="delivered"?"active":"approved",returnDate:status==="delivered"?new Date(updatedAt.getTime()+days*86400000):undefined});
   }else{
    orders.push({...base,items:[{book:book._id,title:book.title,author:book.author,image:book.images[0],quantity:1,price:book.price,type:"buy"}],
     customer:{name:customer.fullName,phone:customer.phone,address:place[0],lat:place[1],lng:place[2]},deliveryMethod:"courier",totalPrice:book.price,status:status==="delivered"?"completed":"processing"});
   }
  }
 }
 const summary={couriers:couriers.length};
 for(const [name,docs] of [["orders",orders],["rents",rents]]){
  const result=await db.collection(name).bulkWrite(docs.map(doc=>({updateOne:{filter:{_id:doc._id},update:{$setOnInsert:doc},upsert:true}})));
  summary[name]={inserted:result.upsertedCount,existing:result.matchedCount,total:await db.collection(name).countDocuments({sampleBatch:batch})};
 }
 console.log(JSON.stringify({batch,summary}));
}
main().catch(error=>{console.error("Courier sample data failed: "+error.name);process.exitCode=1}).finally(()=>mongoose.disconnect());
