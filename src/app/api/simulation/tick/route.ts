import { NextResponse } from 'next/server';
import { runTick } from '@/simulation/tickEngine';
export async function POST(){return NextResponse.json({processed:await runTick()});}
