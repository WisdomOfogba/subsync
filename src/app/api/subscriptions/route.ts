import { NextResponse } from 'next/server';

export async function GET() {
  // Mock fetching subscriptions from a database
  const subscriptions = [
    { id: 1, name: "Netflix", amount: 4500, nextDate: "2026-10-15", category: "Streaming", status: "Active" },
    { id: 2, name: "NEPA Bill", amount: 15000, nextDate: "2026-10-20", category: "Utilities", status: "Pending Approval" },
    { id: 3, name: "Ajo Contribution", amount: 50000, nextDate: "2026-10-30", category: "Savings", status: "Active" },
    { id: 4, name: "Spotify", amount: 900, nextDate: "2026-11-02", category: "Streaming", status: "Active" },
  ];

  return NextResponse.json({ success: true, data: subscriptions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request...
    // In a real app, save to database here
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription added successfully',
      data: { id: Date.now(), ...body }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
