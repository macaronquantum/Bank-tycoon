import { NextResponse } from 'next/server';
import { runtimeStore } from '@/lib/runtimeStore';

export async function GET() {
  return NextResponse.json({ messages: runtimeStore.chat.slice(-100) });
}

export async function POST(req: Request) {
  const body = await req.json();
  const text = String(body?.text ?? '').trim();
  const user = String(body?.user ?? 'Player').trim();

  if (!text) {
    return NextResponse.json({ error: 'Message vide' }, { status: 400 });
  }

  runtimeStore.chat.push({ user, text, at: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
