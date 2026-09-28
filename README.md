# TiokariShop

A modern e-commerce platform for fashion & lifestyle products built with Next.js, TypeScript, and PostgreSQL.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Clerk
- **Payments**: Stripe
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Clerk account
- Stripe account

### Setup

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your database URL, Clerk keys, and Stripe keys.

3. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
tiokarishop/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (pages)        # Storefront pages
│   │   ├── admin/         # Admin dashboard
│   │   ├── api/           # API routes
│   │   └── sign-in/       # Auth pages
│   ├── components/        # React components
│   ├── lib/               # Utilities & configs
│   ├── store/             # Zustand stores
│   └── types/             # TypeScript types
└── public/                # Static assets
```

## Features

- Product catalog with categories, variants, and search
- Shopping cart with persistent storage
- Checkout flow with Stripe integration
- User authentication with Clerk
- Admin dashboard for managing products, orders, and categories
- Customer reviews and ratings
- Wishlist functionality
- Order history tracking

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |
