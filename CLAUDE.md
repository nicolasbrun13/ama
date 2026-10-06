# annablanc — Site Web Ama · Hypnose HRE

## Identité
- **Nom UI** : Ama
- **Nom légal** : Anne-Marie Blanc
- **Activité** : Praticienne en Hypnose Régressive Ésotérique (HRE), méthode Calogéro Grifasi
- **Méthode fondée par** : Calogéro Grifasi (2012) — site source : https://www.calogerogrifasi.com/fr/

## Stack
| Couche | Tech | Port |
|--------|------|------|
| Frontend | Next.js 14 (App Router, TypeScript, Tailwind) | 3202 |
| Backend | NestJS (TypeScript) | 3203 |

## Lancer les serveurs

```bash
# Frontend
cd "E:/AGENCE IA/annablanc/frontend" && npm run dev
# → http://localhost:3202

# Backend
cd "E:/AGENCE IA/annablanc/backend" && npm run start:dev
# → http://localhost:3203
```

## Structure

```
annablanc/
├── frontend/               # Next.js 14 App Router
│   ├── app/
│   │   ├── page.tsx        # Homepage
│   │   ├── qui-suis-je/
│   │   ├── la-methode/
│   │   ├── youtube/
│   │   ├── contact/
│   │   ├── reserver/
│   │   └── api/
│   │       ├── reservations/route.ts  # Proxy → NestJS :3203
│   │       └── contact/route.ts       # Email direct
│   ├── components/
│   │   ├── layout/         # Navbar, Footer
│   │   ├── animations/     # VideoBackground, ScrollReveal
│   │   └── sections/       # HeroSection, MethodeSection, etc.
│   ├── public/
│   │   ├── anna-blanc.png
│   │   └── favicon.png
│   └── .env.local          # Variables d'environnement frontend
│
└── backend/                # NestJS
    ├── src/
    │   ├── reservations/   # Controller + Service + DTO
    │   ├── email/          # EmailService (nodemailer + .ics)
    │   └── scheduler/      # Cron J-1 reminders (20:00 daily)
    ├── .env                # Variables SMTP à remplir
    └── .env.example
```

## Variables d'environnement à renseigner

### Backend (`backend/.env`)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<email Gmail d'envoi>
SMTP_PASS=<App Password Gmail>
AMA_EMAIL=<email réel d'Anne-Marie Blanc>
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3203
API_URL=http://localhost:3203
SMTP_USER=<même que backend>
SMTP_PASS=<même que backend>
AMA_EMAIL=<même que backend>
```

## Design System

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--rose` | `#C8587A` | Couleur principale (rose doux, pas neon) |
| `--rose-deep` | `#A03460` | Boutons, numéros steps |
| `--gold` | `#E8BF50` | Accents dorés |
| `--bg` | `#06030F` | Fond principal |
| `--bg-mid` | `#0C0620` | Sections alternées |
| `--bg-soft` | `#120830` | Sections alternées |
| `--white` | `#FDF0F7` | Texte principal |
| `--dim` | `rgba(253,240,247,.55)` | Texte secondaire |

**Fonts :** Playfair Display (titres/italiques) + Nunito (corps)

**Backgrounds vidéo :** `https://assets.mixkit.co/videos/1610/1610-1080.mp4` sur Hero, Réservation, Avis

**Animations cartes :** `.card-breath` (breathing rose doux) — PAS de shimmer sweep

## Pages

| Route | Description |
|-------|-------------|
| `/` | Accueil — Hero, Méthode, Bienfaits, Réservation, YouTube, Avis |
| `/qui-suis-je` | Biographie d'Ama / Anne-Marie Blanc |
| `/la-methode` | Explication complète HRE + FAQ |
| `/youtube` | Chaîne YouTube |
| `/contact` | Formulaire de contact simple |
| `/reserver` | Formulaire de réservation complet |

## Système de réservation

1. Client remplit le formulaire sur `/reserver`
2. Frontend POST → `/api/reservations` (Next.js) → NestJS `:3203`
3. NestJS envoie :
   - Email à Ama avec `.ics` en pièce jointe (ajouter au calendrier)
   - Email de confirmation au client
4. Cron quotidien à 20h00 : email de rappel J-1 aux clients

## Données demo

Les avis clients sont **fictifs** — marqués avec badges 🧪 DEMO.
L'email et le téléphone dans le footer sont **fictifs** — marqués DEMO.
À remplacer par les vraies informations d'Anne-Marie Blanc.
