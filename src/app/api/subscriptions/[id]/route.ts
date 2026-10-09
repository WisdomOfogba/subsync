import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await req.json();
    const { id: subId } = await params;

    if (data.action === 'mark_used') {
      const subscription = await prisma.subscription.update({
        where: { id: subId },
        data: { lastInteractedAt: new Date() }
      });
      return NextResponse.json({ success: true, subscription });
    }

    if (!data.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const subscription = await prisma.subscription.update({
      where: { id: subId },
      data: { status: data.status } // Allow updating to the provided status, or default 'Active' if you prefer.
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.subscription.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
