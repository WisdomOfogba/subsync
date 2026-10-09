import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { telegramChatId, name, baseCurrency } = await req.json();
    const { id } = await params;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(telegramChatId !== undefined && { telegramChatId }),
        ...(name !== undefined && { name }),
        ...(baseCurrency !== undefined && { baseCurrency }),
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, telegramChatId: updatedUser.telegramChatId } 
    });
  } catch (error: any) {
    console.error("Update User Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
