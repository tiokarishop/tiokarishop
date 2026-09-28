# TiokariShop - Complete Setup Guide

This guide will walk you through setting up TiokariShop for local development and production deployment.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Environment Variables](#environment-variables)
5. [Running the Application](#running-the-application)
6. [Production Deployment](#production-deployment)
7. [Cron Jobs](#cron-jobs)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js 20+** — [Download](https://nodejs.org/)
- **npm 10+** — Comes with Node.js
- **PostgreSQL 16+** — [Download](https://www.postgresql.org/download/)
- **Git** — [Download](https://git-scm.com/)

### Optional but Recommended

- **Docker** — [Download](https://www.docker.com/products/docker-desktop/)
- **Vercel CLI** — `npm i -g vercel`

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tiokarishop.git
cd tiokarishop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials (see [Environment Variables](#environment-variables) section).

---

## Database Setup

### Option A: Local PostgreSQL

#### macOS (using Homebrew)

```bash
brew install postgresql@16
brew services start postgresql@16
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql-16
sudo systemctl start postgresql
```

#### Windows

Download and run the installer from [postgresql.org](https://www.postgresql.org/download/windows/)

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE tiokariShop;

# Exit
\q
```

### Option B: Docker

```bash
docker run -d \
  --name tiokariShop-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=tiokariShop \
  -p 5432:5432 \
  postgres:16-alpine
```

### Option C: Cloud Database (Recommended for Production)

#### Neon (Free Tier)

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in `.env`

#### Supabase (Free Tier)

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Update `DATABASE_URL` in `.env`

### Run Migrations

```bash
# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### Verify Database

```bash
npm run db:studio
```

This opens Prisma Studio at `http://localhost:5555` where you can browse your data.

---

## Environment Variables

### Required Variables

| Variable | Description | How to Get |
|----------|-------------|------------|
| `DATABASE_URL` | PostgreSQL connection string | From your database provider |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | [Clerk Dashboard](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | Clerk secret key | [Clerk Dashboard](https://dashboard.clerk.com) |
| `STRIPE_SECRET_KEY` | Stripe secret key | [Stripe Dashboard](https://dashboard.stripe.com) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | [Stripe Dashboard](https://dashboard.stripe.com) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Stripe CLI or Dashboard |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Business Phone Number ID | — |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp Meta Access Token | — |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verification token | — |
| `CRON_SECRET` | Secret for cron job authentication | — |
| `NEXT_PUBLIC_APP_URL` | Your app URL | `http://localhost:3000` |

### Setting Up Clerk

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Go to **API Keys** in the sidebar
4. Copy the **Publishable Key** and **Secret Key**
5. Add them to your `.env` file

### Setting Up Stripe

1. Go to [stripe.com](https://stripe.com) and create an account
2. Go to **Developers > API Keys**
3. Copy the **Secret Key** and **Publishable Key**
4. Add them to your `.env` file
5. For webhooks, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

### Setting Up WhatsApp Business API

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app
3. Add **WhatsApp** product
4. Get your **Phone Number ID** and **Access Token**
5. Add them to your `.env` file
6. Configure webhook URL: `https://yourdomain.com/api/whatsapp/webhook`

---

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Mode (Local)

```bash
npm run build
npm run start
```

### Using Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

---

## Production Deployment

### Deploy to Vercel (Recommended)

#### Automatic Deployment (Git Integration)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add all environment variables in **Settings > Environment Variables**
4. Deploy!

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Deploy to Railway

1. Go to [railway.app](https://railway.app) and create an account
2. Create a new project
3. Add a PostgreSQL database service
4. Connect your GitHub repository
5. Add environment variables
6. Deploy!

### Deploy to Docker (Any VPS)

```bash
# Clone your server
git clone https://github.com/yourusername/tiokarishop.git
cd tiokarishop

# Create .env file
nano .env

# Build and run
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma db push
docker-compose exec app npx prisma db seed
```

### Deploy to AWS/GCP/Azure

See the [Dockerfile](Dockerfile) and [docker-compose.yml](docker-compose.yml) for container configuration. You can deploy to:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Fly.io

---

## Cron Jobs

### Abandoned Cart Recovery

The abandoned cart reminder runs automatically via Vercel Cron (configured in [vercel.json](vercel.json)).

#### Vercel Cron (Already Configured)

The `vercel.json` file includes a cron job that runs every hour:

```json
{
  "crons": [
    {
      "path": "/api/abandoned-cart/remind",
      "schedule": "0 * * * *"
    }
  ]
}
```

#### Manual Trigger

```bash
curl -X POST https://yourdomain.com/api/abandoned-cart/remind \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

#### GitHub Actions Cron

Create `.github/workflows/cron.yml`:

```yaml
name: Abandoned Cart Reminder
on:
  schedule:
    - cron: "0 * * * *"
jobs:
  remind:
    runs-on: ubuntu-latest
    steps:
      - name: Send reminders
        run: |
          curl -X POST https://yourdomain.com/api/abandoned-cart/remind \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1"
```

### Prisma Issues

```bash
# Regenerate Prisma client
npm run db:generate

# Reset database
npx prisma db push --force-reset
npm run db:seed
```

### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Rebuild
npm run build
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Webhook Issues

```bash
# Test Stripe webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test WhatsApp webhook
curl -X GET "https://yourdomain.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"
```

---

## Next Steps

- [ ] Set up your database
- [ ] Configure Clerk authentication
- [ ] Configure Stripe payments
- [ ] Configure WhatsApp Business API
- [ ] Deploy to production
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Set up analytics (Google Analytics, Plausible)

---

## Support

For issues and questions, please open a GitHub issue or contact support@tiokarishop.com.
