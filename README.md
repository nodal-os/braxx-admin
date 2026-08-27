# HAVØK Command Center

Internal OS at [admin.ridehavok.com](https://admin.ridehavok.com). Public site is [ridehavok.com](https://ridehavok.com). Shopify (`np11ks-vz.myshopify.com`) is checkout-only.

## Design

Nodal OS **Ink** — Paper night. Paperweight inverted. Inter + Space Grotesk. Copper `#E8C4A0` on page `#16181e`, ink `#f4f1ec`. Not Voltage. Not BRAXX.

## Real rooms

| Room | Route | What is live |
|------|-------|----------------|
| Catalog | `/catalog` | SKAEL compatibility catalog (vehicles, parts, fitment) |
| Laws | `/laws` | HAVØK Legal desk. No statute file is loaded in this admin yet. |

Other rooms (Performance, Partners, Operations, Inventory, and the rest) stay as empty OS rooms until real data is wired.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind + shadcn/ui
- PostgreSQL via Prisma (schema only — pages do not read demo rows)

## Local

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Auth is not wired. The sign-in door opens the Command Center.

## Deploy

Vercel project `braxx-admin` already serves `admin.ridehavok.com`. Merging to `main` is the live step. Do not invent a new host.
