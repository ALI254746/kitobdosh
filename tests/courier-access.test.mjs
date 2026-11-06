import test from "node:test";
import assert from "node:assert/strict";
import { courierPublicJob } from "../lib/courier-access.mjs";
const owner = { id:"100000000000000000000001",role:"courier" };
const privateJob={id:"200000000000000000000001",courierId:owner.id,customer:"Kitobxon",phone:"+998000000000",address:"Toshkent",lat:41.3,lng:69.2,status:"new"};
test("unassigned tasks withhold contact information and exact destination",()=>{
 const publicJob=courierPublicJob({...privateJob,courierId:undefined},owner);
 assert.equal(publicJob.customer,"Kitobxon");
 for(const key of ["phone","address","lat","lng"])assert.equal(key in publicJob,false);
});
test("another courier never receives an assigned task's destination or phone",()=>{
 const publicJob=courierPublicJob(privateJob,{id:"100000000000000000000002",role:"courier"});
 for(const key of ["phone","address","lat","lng"])assert.equal(key in publicJob,false);
});
test("task owner and administrator retain the details needed to navigate",()=>{
 for(const user of [owner,{id:"100000000000000000000002",role:"admin"}]){
  const result=courierPublicJob(privateJob,user);
  assert.equal(result.phone,privateJob.phone);assert.equal(result.lat,41.3);assert.equal(result.lng,69.2);
 }
});
