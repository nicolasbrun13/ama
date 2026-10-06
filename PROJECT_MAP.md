# PROJECT_MAP — annablanc

## Vue d'ensemble

Site vitrine + réservation en ligne pour **Ama (Anne-Marie Blanc)**, praticienne certifiée en Hypnose Régressive Ésotérique (méthode Grifasi).

## Architecture

```
Client (navigateur)
  └── Frontend Next.js :3202
        ├── Pages statiques (SEO friendly)
        ├── /api/reservations → proxy NestJS
        └── /api/contact → email direct (nodemailer)

NestJS Backend :3203
  ├── POST /api/reservations → emails + .ics
  └── Cron 20h00 → rappels J-1
```

## Composants clés

### Layout
- `Navbar` — sticky, responsive, liens + CTA "Réserver"
- `Footer` — 3 colonnes : brand / nav / contact

### Animations
- `VideoBackground` — fond vidéo étoiles + canvas shooting stars
- `ScrollReveal` — IntersectionObserver fade-in

### Sections (Homepage)
- `HeroSection` — 2 colonnes, photo avec halos, vidéo bg
- `MethodeSection` — explication HRE, 3 étapes
- `BienfaitsSection` — 6 cartes ce que l'HRE peut traiter
- `ResaSection` — aperçu réservation + calendrier statique
- `YoutubeSection` — card YouTube
- `AvisSection` — 3 témoignages flottants, vidéo bg

## Flux de réservation

```
/reserver (formulaire)
  → POST /api/reservations (Next.js API route)
    → POST localhost:3203/api/reservations (NestJS)
      → EmailService.sendConfirmationToAma() (.ics en PJ)
      → EmailService.sendConfirmationToClient()
      → Stockage en mémoire (reservations[])

Cron @20h00 chaque jour :
  → SchedulerService.sendReminders()
    → findUpcomingTomorrow()
    → EmailService.sendReminderToClient()
```

## Fichiers importants

| Fichier | Rôle |
|---------|------|
| `frontend/app/globals.css` | Variables CSS + classes animations globales |
| `frontend/tailwind.config.ts` | Tokens Tailwind (rose, gold, bg) |
| `backend/src/email/email.service.ts` | Génération ICS + envoi emails |
| `backend/src/scheduler/scheduler.service.ts` | Cron J-1 reminders |

## À faire (prochaines sessions)

- [ ] Renseigner les vraies coordonnées d'Ama (email, téléphone, localisation)
- [ ] Remplacer les avis DEMO par de vrais témoignages Google
- [ ] Configurer SMTP (Gmail App Password ou autre provider)
- [ ] Brancher le vrai lien YouTube
- [ ] Tester le flux complet de réservation en staging
- [ ] SEO : ajouter sitemap.xml, robots.txt, Open Graph images
- [ ] Déploiement : VPS ou Vercel (frontend) + PM2 (backend)
