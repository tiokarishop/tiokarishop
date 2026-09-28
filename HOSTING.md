# TiokariShop - Recommended Hosting Stack

## Best Free Options (2026)

### Frontend Hosting
**Vercel** — Best for Next.js
- URL: https://vercel.com
- Free Tier: 100GB bandwidth/mo, 6000 build minutes/mo
- Why: Official Next.js creators, zero-config, automatic HTTPS, global CDN, preview deployments
- Deploy: `vercel --prod`

### Database
**Neon** — Serverless PostgreSQL
- URL: https://neon.tech
- Free Tier: 0.5GB storage, 190 compute hours/mo
- Why: Serverless PostgreSQL, branching, instant scaling, great DX
- Alternative: Supabase (500MB, more features)

### Authentication
**Clerk** — Already integrated
- URL: https://clerk.com
- Free Tier: 10,000 monthly active users
- Why: Pre-built UI, OAuth, sessions, webhooks

### Payments
**Stripe** — Already integrated
- URL: https://stripe.com
- Free Tier: Pay-as-you-go (2.9% + 30¢ per transaction)
- Why: Industry standard, great DX, webhooks

### Email
**Resend** — Best free tier
- URL: https://resend.com
- Free Tier: 100 emails/day
- Why: Great DX, React email templates, deliverability
- Alternative: SendGrid (100 emails/day)

### WhatsApp
**Meta Cloud API** — Already integrated
- URL: https://developers.facebook.com/docs/whatsapp
- Free Tier: 1,000 conversations/mo
- Why: Official WhatsApp Business API

### File Storage
**Cloudinary** — Best free tier
- URL: https://cloudinary.com
- Free Tier: 25GB bandwidth/mo, 25GB storage
- Why: Image optimization, transformations, CDN
- Alternative: AWS S3 (12 months free)

### Analytics
**Vercel Analytics** — Built-in
- URL: https://vercel.com/analytics
- Free Tier: Included with Vercel
- Why: Privacy-friendly, Core Web Vitals, no cookie banner
- Alternative: Plausible ($9/mo, privacy-focused)

### Error Tracking
**Sentry** — Best free tier
- URL: https://sentry.io
- Free Tier: 5K errors/mo, 10K transactions/mo
- Why: Great DX, source maps, performance monitoring

### Uptime Monitoring
**UptimeRobot** — Free
- URL: https://uptimerobot.com
- Free Tier: 50 monitors, 5-min intervals
- Why: Free, reliable, multiple alert channels

### CDN
**Cloudflare** — Free
- URL: https://cloudflare.com
- Free Tier: Unlimited bandwidth, DDoS protection
- Why: Global CDN, DNS, security, free SSL

---

## Deployment Guide

### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Step 2: Set Up Neon Database

1. Go to https://neon.tech
2. Create account → New Project
3. Copy connection string
4. Add to Vercel: `DATABASE_URL=postgresql://...`

### Step 3: Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Step 4: Run Database Migrations

```bash
npx prisma db push
npx prisma db seed
```

### Step 5: Configure Webhooks

**Stripe:**
```bash
stripe listen --forward-to https://yourdomain.com/api/webhooks/stripe
```

**WhatsApp:**
- Set webhook URL in Meta Developer Portal: `https://yourdomain.com/api/whatsapp/webhook`

---

## Production Checklist

- [ ] Deploy to Vercel
- [ ] Set up Neon database
- [ ] Add all environment variables
- [ ] Run database migrations
- [ ] Seed database
- [ ] Configure Stripe webhook
- [ ] Configure WhatsApp webhook
- [ ] Set up Resend for emails
- [ ] Set up Cloudinary for images
- [ ] Set up Sentry for error tracking
- [ ] Set up UptimeRobot monitoring
- [ ] Configure custom domain (optional)
- [ ] Test full checkout flow
- [ ] Test WhatsApp notifications
- [ ] Test email notifications
- [ ] Set up Cloudflare CDN

---

## Cost Summary

| Service | Monthly Cost |
|---------|--------------|
| Vercel | $0 |
| Neon | $0 |
| Clerk | $0 |
| Stripe | Pay-per-transaction |
| Resend | $0 |
| Meta WhatsApp | $0 |
| Cloudinary | $0 |
| Sentry | $0 |
| UptimeRobot | $0 |
| Cloudflare | $0 |
| **Total** | **$0/month** |

---

## Alternative: All-in-One (Paid)

If you want a single platform:

| Platform | Price | Includes |
|----------|-------|----------|
| **Railway** | $5/mo | App + Database + Redis |
| **Render** | $7/mo | App + Database |
| **Fly.io** | $5/mo | App + Database |

---

## Scaling Path

| Stage | Users | Action |
|-------|-------|--------|
| MVP | 0-1K | Free tier everywhere |
| Growth | 1K-10K | Upgrade Vercel to Pro ($20/mo) |
| Scale | 10K-100K | Upgrade database, add caching |
| Enterprise | 100K+ | Dedicated infrastructure |

---

## Notes

- All recommended services have generous free tiers
- No credit card required for most free tiers
- Easy to upgrade as you grow
- All services integrate well with Next.js
