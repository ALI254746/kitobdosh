import { requireRole } from "@/lib/require-role";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.Connect";
import Book from "@/model/Book";
import User from "@/model/user";
import Order from "@/model/Order";
import Rent from "@/model/Rent";
export async function GET() {
 const denied=await requireRole();if(denied)return denied;
 try {
  await dbConnect();
  const now=new Date(),monthStart=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),1)),yearAgo=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-11,1));
  const monthlyGroup={month:{$month:"$createdAt"},year:{$year:"$createdAt"}};
  const [totalBooks,totalUsers,orderTotals,rentTotals,activeRentals,pendingRentRequests,overdueRentals,categories,activeCouriers,monthlySales,readers,totalOrders,inDelivery,recentOrders,orderActivity,rentalActivity,paidOrders,paidRents]=await Promise.all([
   Book.countDocuments(),
   User.countDocuments({role:"user"}),
   Order.aggregate([{$match:{status:{$ne:"cancelled"}}},{$group:{_id:null,total:{$sum:"$totalPrice"}}}]),
   Rent.aggregate([{$match:{status:{$ne:"rejected"},orderId:{$exists:false}}},{$group:{_id:null,total:{$sum:"$totalPrice"}}}]),
   Rent.countDocuments({status:{$in:["approved","active","courier_assigned","courier_picked_up"]}}),
   Rent.countDocuments({status:"pending"}),
   Rent.countDocuments({status:{$in:["active","late"]},returnDate:{$lt:now}}),
   Book.aggregate([{$group:{_id:"$category",count:{$sum:1}}},{$sort:{count:-1}},{$limit:1}]),
   User.countDocuments({role:{$in:["courier","kurier","kurer"]}}),
   Order.aggregate([{$match:{createdAt:{$gte:yearAgo},status:{$ne:"cancelled"}}},{$group:{_id:monthlyGroup,total:{$sum:"$totalPrice"}}},{$sort:{"_id.year":1,"_id.month":1}}]),
   Order.aggregate([{$group:{_id:"$user",count:{$sum:1}}},{$sort:{count:-1}},{$limit:4},{$lookup:{from:"users",localField:"_id",foreignField:"_id",as:"userDetails"}},{$unwind:"$userDetails"}]),
   Order.countDocuments(),
   Order.countDocuments({status:"processing"}),
   Order.find().sort({createdAt:-1}).limit(6).select("customer items totalPrice status createdAt").lean(),
   Order.aggregate([{$match:{createdAt:{$gte:yearAgo},status:{$ne:"cancelled"}}},{$group:{_id:monthlyGroup,count:{$sum:1},sales:{$sum:{$cond:[{$in:["buy",{$ifNull:["$items.type",[]]}]},1,0]}}}},{$sort:{"_id.year":1,"_id.month":1}}]),
   Rent.aggregate([{$match:{createdAt:{$gte:yearAgo},status:{$ne:"rejected"}}},{$group:{_id:monthlyGroup,count:{$sum:1}}}]),
   Order.aggregate([{$match:{paymentStatus:"paid",status:{$ne:"cancelled"},createdAt:{$gte:monthStart}}},{$group:{_id:null,total:{$sum:"$totalPrice"}}}]),
   Rent.aggregate([{$match:{paymentStatus:"paid",status:{$ne:"rejected"},orderId:{$exists:false},createdAt:{$gte:monthStart}}},{$group:{_id:null,total:{$sum:"$totalPrice"}}}])
  ]);
  return NextResponse.json({success:true,stats:{
   totalBooks,totalUsers,totalIncome:(orderTotals[0]?.total||0)+(rentTotals[0]?.total||0),activeRentals,pendingRentRequests,overdueRentals,
   topCategory:categories[0]?._id||"Noma’lum",activeCouriers,monthlySales,
   topReaders:readers.map(reader=>({name:reader.userDetails.fullName||reader.userDetails.email,email:reader.userDetails.email,avatar:reader.userDetails.avatar||"/icon-192x192.png",count:reader.count})),
   dashboard:{totalOrders,inDelivery,recentOrders,orderActivity,rentalActivity,monthlyIncome:(paidOrders[0]?.total||0)+(paidRents[0]?.total||0)}
  }});
 }catch(error){console.error("Dashboard stats unavailable:",error.name);return NextResponse.json({success:false,message:"Statistikani yuklab bo‘lmadi. Qayta urinib ko‘ring."},{status:503})}
}
