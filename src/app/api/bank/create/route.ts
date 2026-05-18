import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  userId: z.string(),
  name: z.string(),
  countryId: z.string(),
  archetype: z.enum(['POPULAR', 'PREMIUM', 'ENTREPRENEURIAL', 'NEOBANK', 'INVESTMENT']),
});

export async function POST(req: NextRequest) {
  const body = schema.parse(await req.json());
  const bank = await prisma.bank.create({
    data: { ...body, capital: 1_000_000, liquidity: 300_000 },
  });

  return NextResponse.json(bank);
}
