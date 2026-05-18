export default function TutorialPage() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Tutoriel — Première connexion</h1>
      <ol className="space-y-4 list-decimal ml-6 text-slate-200">
        <li>Crée ton compte avec email/mot de passe ou active Google OAuth dans les variables d’environnement.</li>
        <li>À l’inscription, tu rejoins automatiquement la session par défaut <strong>Global Season</strong>.</li>
        <li>Ouvre le tableau de bord et lance le moteur de simulation (tick automatique toutes les 5s).</li>
        <li>Surveille le marché live, ajuste tes prêts, dépôts, et investissements.</li>
        <li>Discute en temps réel avec les autres joueurs via le chat global.</li>
      </ol>
    </main>
  );
}
