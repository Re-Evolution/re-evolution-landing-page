import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const message: string = body?.message?.trim();
  const sessionId: string = body?.sessionId;

  if (!message || !sessionId) {
    return NextResponse.json({ error: 'message and sessionId are required' }, { status: 400 });
  }

  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'MAKE_WEBHOOK_URL is not configured' }, { status: 500 });
  }

  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;
  // Include sessionId in the callback URL so Make.com doesn't need to echo it back
  const callbackUrl = `${origin}/api/chat/response?sessionId=${sessionId}`;

  let makeRes: Response;
  try {
    makeRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId, callbackUrl }),
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    return NextResponse.json({ error: 'Could not reach Make.com agent' }, { status: 502 });
  }

  if (!makeRes.ok) {
    return NextResponse.json({ error: `Make.com returned ${makeRes.status}` }, { status: 502 });
  }

  // Make.com returns { "response": "<AI output>" } in synchronous mode.
  // Accept both "response" (Make.com default) and "message" (legacy) field names.
  const data = await makeRes.json().catch(() => null);
  const replyText: string | undefined = data?.response ?? data?.message;
  if (replyText) {
    return NextResponse.json({ message: replyText, buttons: data.buttons ?? null, sessionId });
  }

  // Asynchronous mode: Make.com will POST the reply to /api/chat/response.
  // The client should poll GET /api/chat/response?sessionId=<sessionId>.
  return NextResponse.json({ pending: true, sessionId });
}
