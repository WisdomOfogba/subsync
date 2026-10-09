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

    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword 
    });
  } catch (error: any) {
    console.error("Update User Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}



export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { searchParams } = new URL(req.url); // Opt out of caching
    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ success: false }, { status: 404 });
    
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error: any) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
