import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (user) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    user = await prisma.user.create({
      data: { name, email }
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
