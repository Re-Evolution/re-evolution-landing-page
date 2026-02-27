import { NextRequest, NextResponse } from 'next/server';

interface AgentResponse {
  message: string;
  buttons?: { label: string; action: string }[];
}

// Module-level store shared within a single serverless function instance.
// NOTE: on Vercel each cold-start creates a fresh instance, so this works
// reliably only when the POST (Make.com callback) and the GET (frontend poll)
// hit the same instance. For high-traffic production use, replace with
// Redis / Vercel KV / Upstash.
const store = new Map<string, AgentResponse>();

// POST — Make.com agent calls this URL when the reply is ready.
// sessionId comes from the query string (embedded in callbackUrl by /api/chat).
// Body: { "response": "<AI output>" }  ← Make.com default field name
//   or: { "message": "<AI output>" }   ← legacy field name
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  // sessionId is passed as a query param in the callbackUrl so Make.com
  // doesn't need to echo it back in the response body.
  const sessionId =
    req.nextUrl.searchParams.get('sessionId') ?? body?.sessionId;

  // Accept both "response" (Make.com default) and "message" (legacy)
  const message: string | undefined = body?.response ?? body?.message;
  const buttons = body?.buttons;

  if (!sessionId || !message) {
    return NextResponse.json({ error: 'sessionId and message are required' }, { status: 400 });
  }

  store.set(sessionId, { message, buttons: buttons ?? undefined });

  // Auto-cleanup after 5 minutes to avoid memory leaks
  setTimeout(() => store.delete(sessionId), 5 * 60 * 1000);

  return NextResponse.json({ ok: true });
}

// GET — frontend polls this URL every second waiting for the agent reply.
// Query: ?sessionId=<sessionId>
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  const entry = store.get(sessionId);
  if (!entry) {
    return NextResponse.json({ pending: true });
  }

  store.delete(sessionId);
  return NextResponse.json(entry);
}
