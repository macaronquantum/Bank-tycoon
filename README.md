# Ticood Bank

Jeu de stratégie bancaire multijoueur fictif en temps réel (aucun argent réel, aucun conseil financier).

## Stack
Next.js 14 + TypeScript, Prisma/PostgreSQL, Redis, Socket-ready, Tailwind, Docker Compose.

## Setup
1. `cp .env.example .env`
2. `docker compose up`

## Commandes
- `npm run db:push`
- `npm run db:seed`
- `npm run dev`
- `npm run worker`
- `npm run sim:tick`
- `npm test`

## Architecture
- `prisma/schema.prisma`: modèle complet (banque, agences, crédits, dépôts, régulation, événements, alliances, fonds, ledger, audit).
- `src/simulation/*`: moteur modulaire (tick + engines spécialisés + time compression).
- `src/app/*`: UI (dashboard + 16 pages fonctionnelles) et API routes.
- `src/simulation/balance.ts`: constantes d'équilibrage centralisées.

## Temps réel
Le worker exécute un tick chaque seconde (`src/simulation/worker.ts`).
Redis lock empêche la double exécution. `sim:tick` permet le debug manuel.

## Seed monde
Le seed crée 8 pays, 5 villes/pays, 8 quartiers/ville, instruments de marché et saison active.

## Admin
Page `/admin` + endpoint `/api/simulation/tick` pour piloter des ticks en dev.

## Déploiement
- Construire image Docker
- Fournir `DATABASE_URL`, `REDIS_URL`, `NEXTAUTH_*`
- Lancer web + worker

## Nouvelle expérience Capital Tycoon
- Landing page premium inspirée de la direction artistique fournie.
- Chat global en quasi temps réel: `GET/POST /api/chat/messages`.
- Cotations live: `GET /api/market/quotes` (Yahoo Finance, fallback local si indisponible).
- Sessions de jeu administrables: `GET/POST /api/game/sessions` avec session par défaut `Global Season`.
- Tutoriel de première connexion: `/tutorial`.

## Authentification
- Email/mot de passe conservé.
- Google OAuth prêt à l’activation via variables:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`

## Sécurité & conformité
- Les agents IA intégrés doivent rester conformes aux lois et CGU applicables.
- Aucun modèle ni usage illégal n’est implémenté.
