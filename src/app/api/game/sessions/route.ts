import { NextResponse } from 'next/server';
import { runtimeStore } from '@/lib/runtimeStore';

export async function GET() {
  return NextResponse.json({ sessions: runtimeStore.sessions });
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = String(body?.name ?? '').trim();
  if (!name) return NextResponse.json({ error: 'name requis' }, { status: 400 });

  const session = {
    id: `${Date.now()}`,
    name,
    isDefault: false,
    status: 'open' as const,
  };
  runtimeStore.sessions.push(session);
  return NextResponse.json({ session }, { status: 201 });
}
