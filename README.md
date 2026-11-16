# Marketplace

A Facebook Marketplace-style site. Visitors can post an item with a photo, browse and filter listings, open a listing, and message the seller. No login.

## Setup

1. Create a Supabase project.
2. In the Supabase SQL editor, run [`supabase/schema.sql`](supabase/schema.sql). That creates the `listings` and `messages` tables, the public read/insert policies, and the `listing-images` storage bucket.
3. Copy `env.example` to `.env.local`.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the anon key, or the newer publishable key).
5. Install and start:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What it does

- **Create a listing** at `/create`. Photo, title, description, price, email, and category are required and saved in Supabase Storage and Postgres.
- **Home** shows every listing. Category links filter the grid. Search matches title, description, and location.
- **Listing page** at `/item/[id]` shows the photo and the full details.
- **Message Seller** saves the buyer email and message in the `messages` table. Messages are insert-only for the public key, so they are visible in the Supabase table editor and not listed on the site.

## Optional email

Set `RESEND_API_KEY` and `EMAIL_FROM` to email the seller when a message is saved. The message is stored either way. Resend's default onboarding sender can only deliver to the address on your Resend account until you verify a domain.

On Vercel, add the same environment variables before you deploy.
