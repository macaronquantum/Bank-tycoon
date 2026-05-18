import { NextResponse } from 'next/server';

const symbols = ['AAPL', 'MSFT', 'NVDA', 'TSLA'];

export async function GET() {
  try {
    const endpoint = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}`;
    const res = await fetch(endpoint, { next: { revalidate: 10 } });
    if (!res.ok) throw new Error('Yahoo unavailable');
    const data = await res.json();
    const quotes = (data?.quoteResponse?.result ?? []).map((q: any) => ({
      symbol: q.symbol,
      name: q.shortName ?? q.symbol,
      price: Number(q.regularMarketPrice ?? 0),
      changePercent: Number(q.regularMarketChangePercent ?? 0),
    }));
    return NextResponse.json({ quotes });
  } catch {
    const quotes = symbols.map((symbol, idx) => ({
      symbol,
      name: symbol,
      price: 100 + idx * 10,
      changePercent: 0,
    }));
    return NextResponse.json({ quotes, fallback: true });
  }
}
