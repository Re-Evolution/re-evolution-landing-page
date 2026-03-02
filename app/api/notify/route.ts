import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'MAKE_WEBHOOK_URL not configured' }, { status: 500 });
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: body.name ?? 'não mencionado',
        contact: body.contact ?? 'não mencionado',
        business_type: body.business_type ?? 'não mencionado',
        current_situation: body.current_situation ?? 'não mencionado',
        main_need: body.main_need ?? 'não mencionado',
        urgency: body.urgency ?? 'não mencionado',
        budget: body.budget ?? 'não mencionado',
        decision_maker: body.decision_maker ?? 'não mencionado',
        timestamp: new Date().toISOString(),
        source: 'chatbot',
      }),
      signal: AbortSignal.timeout(5_000),
    });
  } catch (e) {
    console.error('Make.com webhook failed:', e);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
