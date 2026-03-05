# M-Wallet

Subscription expense manager powered by Notion data, with a Linear‑style UI.

中文版本：`README.md`

## ✨ Features

- **Subscription management**: create / edit / delete subscriptions, 55+ presets
- **Spending stats**: monthly / yearly / total breakdowns by category
- **Flexible cycles**: monthly / quarterly / yearly / one‑time / custom
- **Password protection**: lightweight Cookie‑based access control
- **Custom sorting**: drag‑and‑drop / by amount / by name
- **Dark mode**: light / dark / system
- **Micro‑animations**: Linear‑style UI with framer‑motion
- **Notion‑driven**: data stored in a Notion database

## 🛠️ Tech Stack

- **Next.js 16** + React 19 + TypeScript
- **TailwindCSS 4** + Linear‑style theme
- **@notionhq/client** - Notion API layer
- **@dnd-kit** - Drag and drop
- **framer-motion** - Animations
- **Turborepo** + pnpm monorepo

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20
- pnpm >= 10

### Setup

```bash
# Install dependencies
pnpm install

# Configure environment
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your Notion credentials
```

### Environment Variables

| Variable               | Description                              |
| ---------------------- | ---------------------------------------- |
| `NOTION_TOKEN`         | Notion Integration Token                 |
| `NOTION_DATABASE_ID`   | Notion Database ID                       |
| `LOCK_PASSWORD`        | Access password (leave empty to disable) |
| `NEXT_PUBLIC_LANGUAGE` | UI language (`zh` / `en`)                |

### Notion Database Schema

Create a Notion database with the following properties:

| Property        | Type      | Description                                              |
| --------------- | --------- | -------------------------------------------------------- |
| Name            | title     | Subscription name                                        |
| Icon            | url       | Icon URL                                                 |
| Price           | number    | Price                                                    |
| Currency        | select    | Currency (CNY / USD)                                     |
| Cycle           | select    | Cycle (monthly / quarterly / yearly / one-time / custom) |
| CustomCycleDays | number    | Custom cycle days                                        |
| StartDate       | date      | Start date                                               |
| EndDate         | date      | End date                                                 |
| Description     | rich_text | Description                                              |
| Category        | select    | Category                                                 |
| Position        | number    | Sort position                                            |
| Color           | select    | Brand color                                              |

### Development

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm lint       # Lint check
```

Visit `http://localhost:3000`

## 🗂️ Project Structure

```text
m-wallet/
├── apps/web/                # Next.js app
│   ├── app/                 # Pages (/, /stats, /new, /settings)
│   ├── components/          # UI components
│   ├── lib/
│   │   ├── actions/         # Server Actions (subscriptions, auth)
│   │   ├── notion.ts        # Notion client
│   │   ├── services.ts      # 55+ preset services
│   │   └── types.ts         # TypeScript types
│   └── config/              # Site config
├── packages/
│   ├── ui/                  # Shared UI (shadcn/ui)
│   ├── eslint-config/       # ESLint config
│   └── typescript-config/   # TypeScript config
```

## 📄 License

[MIT](LICENSE)
