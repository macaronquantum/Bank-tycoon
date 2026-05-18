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
