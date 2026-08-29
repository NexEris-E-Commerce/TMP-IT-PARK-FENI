This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setting up the store (Supabase + payments)

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier is fine to start).
2. **Run the schema**: open the SQL Editor in your Supabase project and run the contents of `supabase/schema.sql`. This creates all tables (`products`, `orders`, `order_items`, `profiles`, `addresses`) and Row Level Security policies.
3. **Copy env vars**: `cp .env.example .env.local`, then fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` from Supabase → Settings → API.
4. **Enable Google login**: Supabase → Authentication → Providers → Google. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (Authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`) and paste the Client ID/Secret into Supabase.
5. **Add your products**: go to `/admin/products` after setting up an admin account (step 7 below) and add products through the UI, or insert rows directly in Supabase's Table Editor. There is no dummy/demo catalog — the storefront only ever shows what's actually in your `products` table.
6. **Payments**: Cash on Delivery works immediately, no setup needed. For bKash/Nagad/Rocket/card via SSLCommerz, sign up for a [sandbox account](https://developer.sslcommerz.com/registration/) (instant) to build/test, then swap in live credentials later — just set `SSLCOMMERZ_STORE_ID` / `SSLCOMMERZ_STORE_PASSWORD` in `.env.local` (or your hosting provider's env settings) and flip `SSLCOMMERZ_SANDBOX=false` when you go live. No code changes needed either time.
7. **Admin panel** (`/admin`): register a normal account on the site first, then in Supabase's SQL Editor run:
   ```sql
   update public.profiles set is_admin = true where id =
     (select id from auth.users where email = 'you@example.com');
   ```
   Sign back in and visit `/admin` — you'll see product, order and message management. There's no self-serve admin signup on purpose.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
"# TMP-IT-PARK-FENI" 
