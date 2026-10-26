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

## Flux de réservation (paiement PayPal obligatoire, màj 2026-10-20)

```
Calendriers (/reserver, CalendarSection, ResaSection)
  → hook useTakenDates (frontend/lib/useTakenDates.ts)
    → GET /api/availability?month=YYYY-MM (Next, transmet l'IP réelle)
      → GET backend /api/reservations/availability (throttle dédié 60/min/IP)
  Si le chargement échoue : rien n'est cliquable + message "réessayez" (AvailabilityNotice)

/reserver → PaypalButton
  → POST /api/payment/create-order (Next proxy) → backend
       CreateOrderDto validé, isValidSlot (400) + isSlotTaken (409) AVANT PayPal
  → POST /api/payment/capture-order (Next proxy) → backend
       CaptureOrderDto validé, isValidSlot + isSlotTaken AVANT capture
       capture PayPal → montant 150 EUR vérifié (sinon refund + 400)
       insert Reservation (unique date+time, unique paypalOrderId)
         P2002 date/time      → refund + 409
         P2002 paypalOrderId  → 409 sans refund (paiement rejoué)
       refund refusé par PayPal → log + mail d'alerte à AMA_EMAIL (remboursement manuel)
       mails confirmation (Ama + client) : échec SMTP loggé, réponse reste success
  409 côté front → retour au formulaire, date vidée, calendrier rechargé

POST/GET /api/reservations → 405 (plus de réservation sans paiement)

### Mode paiement manuel (lien paypal.me, temporaire, màj 2026-10-26)
Tant que les cles API PayPal ne sont pas la : `MANUAL_PAYMENT=true` (backend) + `NEXT_PUBLIC_PAYPAL_ME_URL=https://paypal.me/amablanc`
(frontend, fige au build, et NEXT_PUBLIC_PAYPAL_CLIENT_ID vide). `lib/manualPayment.ts` calcule `MANUAL_PAYMENT`.
/reserver → PaypalButton affiche : 1. lien `paypal.me/amablanc/150` (nouvel onglet) 2. bouton "J'ai paye, confirmer"
  → POST /api/payment/manual-reservation → `PaymentService.createManualReservation` (403 si MANUAL_PAYMENT!=true,
    400 creneau invalide, 409 pris) → insert Reservation (sans paypalOrderId) → mails variante sans mention de paiement
    cote client ; mail Ama "paiement a verifier sur PayPal". AUCUNE verification de paiement : Ama controle a la main.
Retour au bouton PayPal automatique : renseigner les cles, MANUAL_PAYMENT=false, vider NEXT_PUBLIC_PAYPAL_ME_URL, rebuild front.
Attention : la facture J+1 (sendInvoiceToClient) dit toujours "Paiement recu via PayPal".

Cron toutes les 15 min (SchedulerService) :
  18h-22h Paris : rappels J-1 (reminderSentAt)
  8h-12h Paris  : factures J+1 (invoiceSentAt)
```

## Sécurité

- ValidationPipe globale : whitelist + forbidNonWhitelisted + transform (`backend/src/validation.ts`)
- Throttler global 5/10s + 20/min par IP, availability 20/10s + 60/min (`backend/src/throttle.config.ts`)
- Routes Next : IP réelle via `frontend/lib/server/request.ts` (getClientIp, proxyPostToBackend, JSON mal formé → 400)
- Contact : 3 messages / 10 min / IP (en mémoire), honeypot `website`, email validé (`lib/validateEmail.ts`)
- Headers : CSP, HSTS sans preload, X-Frame, nosniff, pas de x-powered-by (`frontend/next.config.ts`)
- Nginx écrase CF-Connecting-IP (`deploy/nginx-amablanc-hre.fr.conf`)

## Tests

- Backend : `cd backend && npm test` (vitest, *.spec.ts) : DTO, escHtml de tous les mails, isValidSlot,
  parisDateStr, captureOrder (fetch PayPal mocké), throttle availability, sync des règles front/back
- Frontend : `cd frontend && npm test` (vitest, *.test.ts) : route contact, rate limiter, IP, email
- Règles de créneaux dupliquées : `backend/src/reservations/slots.ts` et `frontend/lib/availableDates.ts`
  (le test `slots.spec.ts` échoue si elles divergent)

## Fichiers importants

| Fichier | Rôle |
|---------|------|
| `frontend/app/globals.css` | Variables CSS + classes animations globales |
| `frontend/tailwind.config.ts` | Tokens Tailwind (rose, gold, bg) |
| `frontend/lib/useTakenDates.ts` | Hook partagé des créneaux pris (3 calendriers) |
| `frontend/components/payment/PaypalButton.tsx` | Boutons PayPal, vrais messages serveur |
| `backend/src/payment/payment.service.ts` | Commande, capture, refund, alerte |
| `backend/src/reservations/slots.ts` | Règles de créneaux + parisDateStr |
| `backend/src/email/email.service.ts` | ICS + mails (confirmation, rappel, facture, alerte refund) |
| `backend/src/scheduler/scheduler.service.ts` | Crons rappels J-1 et factures J+1 |

## À faire (prochaines sessions)

- [ ] Renseigner les vraies coordonnées d'Ama (email, téléphone, localisation)
- [ ] Remplacer les avis DEMO par de vrais témoignages Google
- [ ] Configurer SMTP (Gmail App Password ou autre provider)
- [ ] Brancher le vrai lien YouTube
- [ ] Tester le flux complet de réservation en staging
- [ ] SEO : ajouter sitemap.xml, robots.txt, Open Graph images
- [ ] Déploiement : VPS ou Vercel (frontend) + PM2 (backend)
