import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function generateRandomNumeric(length: number) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });

    const cards = await prisma.virtualCard.findMany({ where: { userId } });
    return NextResponse.json({ success: true, cards });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error fetching cards" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, name } = await req.json();
    if (!userId || !name) return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });

    const cardNumber = "4" + generateRandomNumeric(15); // Fake Visa
    const expiry = "12/28";
    const cvv = generateRandomNumeric(3);

    const card = await prisma.virtualCard.create({
      data: {
        userId,
        name,
        cardNumber,
        expiry,
        cvv,
        balance: 0
      }
    });

    return NextResponse.json({ success: true, card });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Error creating card" }, { status: 500 });
  }
}
