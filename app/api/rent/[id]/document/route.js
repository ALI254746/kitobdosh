import { authorize } from '@/lib/server-auth';
import { dbConnect } from '@/lib/db.Connect';
import { configureCloudinary } from '@/lib/uploads';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import Rent from '@/model/Rent';
import Asset from '@/model/UploadAsset';
import { isObjectId } from '@/lib/catalog-input.mjs';
export async function GET(req, { params }) {
  const access = await authorize(); if (access.response) return access.response;
  if (!isObjectId(params.id)) return NextResponse.json({ success: false }, { status: 400 });
  await dbConnect();
  const rent = await Rent.findById(params.id);
  if (!rent || (access.user.role !== 'admin' && String(rent.user) !== access.user.id)) return NextResponse.json({ success: false }, { status: 403 });
  const asset = await Asset.findOne({ publicId: rent.passportCloudinaryId, private: true, owner: rent.user });
  // Old public uploads are not silently treated as private or exposed here.
  if (!asset) return NextResponse.json({ success: false }, { status: 404 });
  configureCloudinary();
  const url = cloudinary.utils.private_download_url(asset.publicId, rent.passportFormat || 'png', { type: 'authenticated', resource_type: 'image', expires_at: Math.floor(Date.now()/1000) + 60, attachment: true });
  return NextResponse.json({ success: true, url }, { headers: { 'Cache-Control': 'private, no-store' } });
}
