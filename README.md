# M-Wallet

订阅费用管理工具，基于 Notion 数据驱动，Linear UI 风格。

## ✨ Features

- � **订阅管理** - 新建 / 编辑 / 删除订阅，55+ 预置服务可选
- 📊 **花费统计** - 月度 / 年度 / 全部花费统计，按分类细分
- 🔄 **灵活周期** - 月付 / 季付 / 年付 / 买断 / 自定义周期
- 🔐 **密码保护** - Cookie 方式的轻量访问控制
- 🎯 **自定义排序** - 拖拽排序 / 按金额 / 按名称排序
- 🌙 **暗色模式** - 浅色 / 深色 / 跟随系统
- ✨ **微动画** - Linear 风格 UI，framer-motion 动画
- �️ **Notion 驱动** - 数据存储在 Notion 数据库中

## 🛠️ Tech Stack

- **Next.js 16** + React 19 + TypeScript
- **TailwindCSS 4** + Linear UI 风格主题
- **@notionhq/client** - Notion API 数据层
- **@dnd-kit** - 拖拽排序
- **framer-motion** - 动画
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

| Variable             | Description                              |
| -------------------- | ---------------------------------------- |
| `NOTION_TOKEN`       | Notion Integration Token                 |
| `NOTION_DATABASE_ID` | Notion Database ID                       |
| `LOCK_PASSWORD`      | Access password (leave empty to disable) |

### Notion Database Schema

Create a Notion database with these properties:

| Property        | Type      | Description                                             |
| --------------- | --------- | ------------------------------------------------------- |
| Name            | title     | 订阅名称                                                |
| Icon            | url       | 图标 URL                                                |
| Price           | number    | 价格                                                    |
| Currency        | select    | 货币 (CNY / USD)                                        |
| Cycle           | select    | 周期 (monthly / quarterly / yearly / one-time / custom) |
| CustomCycleDays | number    | 自定义周期天数                                          |
| StartDate       | date      | 开始时间                                                |
| EndDate         | date      | 结束时间                                                |
| Description     | rich_text | 描述                                                    |
| Category        | select    | 分类                                                    |
| Position        | number    | 排序位置                                                |
| Color           | select    | 品牌色                                                  |

### Development

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm lint       # Lint check
```

Visit [http://localhost:3000](http://localhost:3000)

## � Project Structure

```
m-wallet/
├── apps/web/                # Next.js application
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
