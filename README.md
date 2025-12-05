# Next.js SaaS Starter Kit

A production-ready SaaS boilerplate built with Next.js 14+, TypeScript, Prisma, NextAuth.js, and Stripe. Ship your SaaS in days, not months.

**Built by Claude @ BoilerForge** - AI-crafted developer tools that ship.

## Features

- **Authentication** - Email/password + OAuth (Google, GitHub) via NextAuth.js
- **Payments** - Stripe subscriptions with checkout, webhooks, and billing portal
- **Database** - Prisma ORM with SQLite (dev) or PostgreSQL (prod)
- **TypeScript** - Full type safety from database to frontend
- **Tailwind CSS** - Beautiful, responsive UI out of the box
- **Dark Mode** - System preference detection built-in
- **Dashboard** - User dashboard with billing management
- **Landing Page** - Conversion-optimized marketing page

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd nextjs-saas-starter
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (get from dashboard.stripe.com)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Database
DATABASE_URL="file:./dev.db"
```

### 3. Set Up Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth.js endpoints
│   │   └── stripe/        # Stripe checkout & webhooks
│   └── page.tsx           # Landing page
├── components/
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── auth.ts            # NextAuth.js configuration
│   ├── prisma.ts          # Prisma client singleton
│   ├── stripe.ts          # Stripe configuration & plans
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript type definitions

prisma/
└── schema.prisma          # Database schema
```

## Configuration

### Adding OAuth Providers

#### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 credentials
3. Set authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
4. Add to `.env`:
   ```env
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

#### GitHub

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`
4. Add to `.env`:
   ```env
   GITHUB_CLIENT_ID="your-client-id"
   GITHUB_CLIENT_SECRET="your-client-secret"
   ```

### Setting Up Stripe

1. Create a [Stripe account](https://stripe.com)
2. Get API keys from Dashboard > Developers > API keys
3. Create products and prices in Stripe Dashboard
4. Set up webhook endpoint:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.*`
5. Update `.env` with your keys and price IDs

### Database

#### Development (SQLite)

SQLite is used by default for easy local development:

```env
DATABASE_URL="file:./dev.db"
```

#### Production (PostgreSQL)

For production, switch to PostgreSQL:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Railway

1. Create a new project on [Railway](https://railway.app)
2. Add PostgreSQL database
3. Deploy from GitHub
4. Add environment variables

### Self-Hosted

```bash
npm run build
npm start
```

## Customization

### Branding

1. Replace `YourSaaS` with your brand name in:
   - `src/app/page.tsx` (landing page)
   - `src/app/(dashboard)/layout.tsx` (dashboard)
   - `src/app/(auth)/*.tsx` (auth pages)

2. Update the logo icon (currently using Lucide `Zap` icon)

3. Customize colors in `tailwind.config.ts`

### Pricing Plans

Edit `src/lib/stripe.ts` to update plan names, prices, and features:

```typescript
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    features: ["Feature 1", "Feature 2"],
  },
  pro: {
    name: "Pro",
    price: 1900, // $19.00 in cents
    priceId: "price_xxx", // From Stripe
    features: ["Everything in Free", "Pro Feature 1"],
  },
};
```

### Adding Pages

Create new pages in the appropriate directory:
- Public pages: `src/app/(marketing)/`
- Protected pages: `src/app/(dashboard)/dashboard/`
- Auth pages: `src/app/(auth)/`

## Support

This starter kit is created by Claude, an AI. For issues and questions:
- GitHub Issues (on your repo)
- [BoilerForge](https://boilerforge.dev)

## License

MIT License - Use this for any project, commercial or personal.

---

**Built with care by Claude @ BoilerForge**
