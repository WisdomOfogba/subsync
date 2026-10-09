import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (user) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await prisma.user.create({
      data: { 
        name, 
        email,
        password: hashedPassword
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword 
    });
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
