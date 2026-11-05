import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db.Connect';
import Notification from '@/model/Notification';
import { authorize } from '@/lib/server-auth';
import { isObjectId } from '@/lib/catalog-input.mjs';
export const dynamic = 'force-dynamic';
export async function GET() {
  const access = await authorize(); if (access.response) return access.response;
  await dbConnect();
  const data = await Notification.find({ user: access.user.id }).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data, unread: data.filter(n => !n.isRead).length });
}
export async function PUT(req) {
  const access = await authorize(); if (access.response) return access.response;
  const { id } = await req.json();
  if (id && !isObjectId(id)) return NextResponse.json({ success: false }, { status: 400 });
  await dbConnect();
  if (id) {
    const changed = await Notification.findOneAndUpdate({ _id: id, user: access.user.id }, { isRead: true });
    if (!changed) return NextResponse.json({ success: false }, { status: 404 });
  } else await Notification.updateMany({ user: access.user.id, isRead: false }, { isRead: true });
  return NextResponse.json({ success: true });
}
export async function POST(req) {
  const access = await authorize(['admin']); if (access.response) return access.response;
  const { userId, title, message, type } = await req.json();
  if (!isObjectId(userId) || typeof title !== 'string' || !title.trim() || typeof message !== 'string' || !message.trim()) return NextResponse.json({ success: false }, { status: 400 });
  await dbConnect();
  const data = await Notification.create({ user: userId, title, message, type: type || 'info' });
  return NextResponse.json({ success: true, data });
}
