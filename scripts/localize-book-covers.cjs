const mongoose=require("mongoose");
const covers=require("../lib/book-covers.json");
async function main(){
 if(!process.argv.includes("--apply")||process.env.COVER_MIGRATION_ACK!=="local-covers-2026-11-06")throw new Error("Explicit migration acknowledgement required");
 if(!process.env.MONGO_URI||!process.env.MONGO_DB_NAME)throw new Error("Explicit database settings required");
 for(const cover of covers){
  if(!/^\/books\/[a-f0-9]{24}\.(jpg|png|webp|svg)$/.test(cover.image))throw new Error("Invalid asset path");
  const response=await fetch("https://kitobdosh.com"+cover.image,{method:"HEAD",signal:AbortSignal.timeout(10000)});
  if(!response.ok||!response.headers.get("content-type")?.startsWith("image/"))throw new Error("Published cover is unavailable");
 }
 await mongoose.connect(process.env.MONGO_URI,{dbName:process.env.MONGO_DB_NAME,serverSelectionTimeoutMS:10000});
 const db=mongoose.connection.db;let updated=0;
 for(const cover of covers){
  const _id=new mongoose.Types.ObjectId(cover.id),book=await db.collection("books").findOne({_id});
  if(!book)continue;
  const update={images:[cover.image],coverStorage:"local"};
  if(!book.coverPreviousImages)update.coverPreviousImages=book.images;
  if(book.publisher==="Kitobdosh Demo")update.publisher="Kitobdosh";
  if(/^Demo\b/i.test(book.author||""))update.author="Muallif ko‘rsatilmagan";
  await db.collection("books").updateOne({_id},{$set:update});
  await db.collection("orders").updateMany({"items.book":_id},{$set:{"items.$[entry].image":cover.image}},{arrayFilters:[{"entry.book":_id}]});
  await db.collection("rents").updateMany({book:_id},{$set:{bookImage:cover.image}});
  updated++;
 }
 const sampleUsers=await db.collection("users").find({email:/@example\.invalid$/,fullName:/^Demo\b/i},{projection:{_id:1,role:1}}).toArray();
 for(const user of sampleUsers){
  const name=user.role==="admin"?"Administrator":["courier","kurer","kurier"].includes(user.role)?"Kuryer":"Kitobxon";
  await db.collection("users").updateOne({_id:user._id},{$set:{fullName:name}});
  await db.collection("orders").updateMany({user:user._id,"customer.name":/^Demo\b/i},{$set:{"customer.name":name}});
  await db.collection("rents").updateMany({user:user._id,fullName:/^Demo\b/i},{$set:{fullName:name}});
 }
 console.log(JSON.stringify({booksUpdated:updated,sampleLabelsUpdated:sampleUsers.length}));
}
main().catch(error=>{console.error("Cover localization failed: "+error.name);process.exitCode=1}).finally(()=>mongoose.disconnect());
