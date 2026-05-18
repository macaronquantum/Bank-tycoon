'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const features = [
  'Marchés live (Yahoo Finance proxy)',
  'Chat temps réel entre joueurs',
  'Sessions de jeu administrables',
  'Connexion email + Google ready',
  'Tutoriel de première connexion',
];

type MarketQuote = { symbol: string; name: string; price: number; changePercent: number };

type ChatMessage = { user: string; text: string; at: string };

export default function Home() {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');

  const time = useMemo(() => new Date().toLocaleTimeString('fr-FR'), [messages]);

  useEffect(() => {
    const loadQuotes = async () => {
      const res = await fetch('/api/market/quotes').then((r) => r.json());
      setQuotes(res.quotes ?? []);
    };

    const loadChat = async () => {
      const res = await fetch('/api/chat/messages').then((r) => r.json());
      setMessages(res.messages ?? []);
    };

    loadQuotes();
    loadChat();

    const timer = setInterval(() => {
      loadQuotes();
      loadChat();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'Player', text }),
    });
    setText('');
    const res = await fetch('/api/chat/messages').then((r) => r.json());
    setMessages(res.messages ?? []);
  };

  return (
    <main className="min-h-screen p-6 md:p-10 bg-grid">
      <section className="hero rounded-3xl p-8 md:p-12 border border-cyan-300/20">
        <p className="uppercase text-cyan-300 tracking-[0.35em] text-xs mb-6">Capital Tycoon</p>
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Build. Invest. Disrupt.</h1>
        <p className="text-slate-200/90 max-w-2xl text-lg mb-8">
          Simulation bancaire en ligne: crée ta banque, pilote les risques, domine le marché en temps réel.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard" className="btn-main">Entrer dans le jeu</Link>
          <Link href="/tutorial" className="btn-alt">Tutoriel première connexion</Link>
          <Link href="/admin" className="btn-alt">Console admin</Link>
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-6 mt-8">
        <article className="panel lg:col-span-2">
          <h2 className="panel-title">Marché en direct ({time})</h2>
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            {quotes.map((q) => (
              <div key={q.symbol} className="quote-card">
                <div>
                  <p className="text-sm text-slate-400">{q.symbol}</p>
                  <p className="font-semibold">{q.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">${q.price.toFixed(2)}</p>
                  <p className={q.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {q.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2 className="panel-title">Fonctionnalités Ready-to-Deploy</h2>
          <ul className="list-disc ml-5 mt-4 space-y-2 text-slate-300">
            {features.map((f) => <li key={f}>{f}</li>)}
          </ul>
          <p className="text-xs text-slate-400 mt-4">Google OAuth configurable via NEXTAUTH_URL / GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET.</p>
        </article>
      </section>

      <section className="panel mt-6">
        <h2 className="panel-title">Chat global en temps réel</h2>
        <div className="mt-4 h-56 overflow-auto space-y-2 pr-2">
          {messages.map((m, i) => (
            <div key={`${m.at}-${i}`} className="chat-row">
              <strong>{m.user}</strong>
              <span className="text-slate-300">{m.text}</span>
              <small className="text-slate-500 ml-auto">{new Date(m.at).toLocaleTimeString('fr-FR')}</small>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Écrire un message..." className="input" />
          <button onClick={sendMessage} className="btn-main">Envoyer</button>
        </div>
      </section>
    </main>
  );
}
