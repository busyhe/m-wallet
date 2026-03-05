# M-Wallet: Notion-based Subscription Tracker & Wallet Manager

English | [简体中文](./README.md)

A lightweight subscription management and personal wallet application built with Next.js 16. Real-time synchronization with your Notion database keeps your finances organized and visible.

![M-Wallet Screenshot](./example.png)

## Features

- **Real-time Notion Sync**: Read subscription data directly from your Notion database.
- **Subscription Tracking**: Track service fees with monthly/yearly statistics.
- **Financial Overview**: Automatically calculate monthly spending, yearly balance, and daily average cost.
- **Privacy Lock**: Support for a lock password to protect your sensitive information.
- **Modern Design**: Smooth UI/UX powered by Tailwind CSS, Framer Motion, and Lucide Icons.
- **i18n Support**: Native support for Chinese and English.

## Installation

As this project uses a Monorepo structure managed by Turborepo, please follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/busyhe/m-wallet.git
   cd m-wallet
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the `apps/web` directory:

   ```bash
   NOTION_TOKEN=your_notion_internal_integration_token
   NOTION_DATABASE_ID=your_notion_database_id
   LOCK_PASSWORD=your_secure_password
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_LANGUAGE=en
   ```

   - `NOTION_TOKEN`: Your Notion integration token.
   - `NOTION_DATABASE_ID`: The ID of your Notion database.
   - `LOCK_PASSWORD`: Access password for the application.
   - `NEXT_PUBLIC_LANGUAGE`: Default language (`zh` or `en`).

## Notion Database Schema

1. 复制这个 Notion 模板

   [Notion 演示页面](https://busyhe.notion.site/314bba2b2ae780a09b5ccdbc6fe0bce6?v=314bba2b2ae780b8a9e4000cb5128383&pvs=74)

## Development & Deployment

### Local Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Deployment

Deployment via [Vercel](https://vercel.com) is recommended. Ensure all environment variables are configured in the Vercel dashboard.

## License

MIT License
