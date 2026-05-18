import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { BankArchetype } from '@prisma/client';
const schema=z.object({userId:z.string(),name:z.string(),countryId:z.string(),archetype:z.nativeEnum(BankArchetype)});
export async function POST(req:NextRequest){const b=schema.parse(await req.json());const bank=await prisma.bank.create({data:{...b,capital:1_000_000,liquidity:300_000}});return NextResponse.json(bank);}
