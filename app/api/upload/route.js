import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { authorize, courierRoles } from '@/lib/server-auth';
import { dbConnect } from '@/lib/db.Connect';
import Asset from '@/model/UploadAsset';
import { uploadImage, configureCloudinary, UploadInputError } from '@/lib/uploads';
export async function POST(req) {
  const access = await authorize(); if (access.response) return access.response;
  try {
    const data = await req.formData(); const folder = data.get('folder') || 'kitobdosh';
    const allowed = access.user.role === 'admin' ? ['kitobdosh','books','promo-banners','returns'] : courierRoles.includes(access.user.role) ? ['kitobdosh','returns'] : ['kitobdosh'];
    if (!allowed.includes(folder)) return NextResponse.json({ success: false, message: 'Rasm papkasi uchun ruxsat yo‘q' }, { status: 403 });
    await dbConnect();
    const asset = await uploadImage(data.get('file'), access.user.id, folder);
    return NextResponse.json({ success: true, url: asset.url, publicId: asset.publicId });
  } catch (error) { return NextResponse.json({ success: false, message: error instanceof UploadInputError ? error.message : 'Rasmni yuklab bo‘lmadi' }, { status: error instanceof UploadInputError ? 400 : 503 }); }
}
export async function DELETE(req) {
  const access = await authorize(); if (access.response) return access.response;
  try {
    const { publicId } = await req.json();
    if (typeof publicId !== 'string' || !publicId) return NextResponse.json({ success: false }, { status: 400 });
    await dbConnect();
    const asset = await Asset.findOne({ publicId, private: false });
    if (!asset || (access.user.role !== 'admin' && String(asset.owner) !== access.user.id)) return NextResponse.json({ success: false }, { status: 403 });
    configureCloudinary(); await cloudinary.uploader.destroy(publicId);
    await asset.deleteOne(); return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: false, message: 'Rasmni o‘chirib bo‘lmadi' }, { status: 503 }); }
}
