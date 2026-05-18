import Link from 'next/link';
const pages=['dashboard','map','branches','staff','deposits','loans','markets','treasury','regulation','interbank','funds','products','hq','alliances','leaderboard','events','admin'];
export default function Home(){return <main><h1 className='text-3xl font-bold mb-4'>Ticood Bank</h1><p>Jeu fictif sans argent réel.</p><div className='grid grid-cols-3 gap-2 mt-4'>{pages.map(p=><Link key={p} href={`/${p}`} className='card'>{p}</Link>)}</div></main>;}
