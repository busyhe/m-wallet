# M-Wallet

订阅费用管理工具，基于 Notion 数据驱动，Linear UI 风格。

English version: `README.en.md`

## ✨ 功能特性

- **订阅管理**：新建 / 编辑 / 删除订阅，内置 55+ 预置服务
- **花费统计**：月度 / 年度 / 全部花费统计，按分类细分
- **灵活周期**：月付 / 季付 / 年付 / 买断 / 自定义周期
- **密码保护**：基于 Cookie 的轻量访问控制
- **自定义排序**：拖拽排序 / 按金额 / 按名称排序
- **暗色模式**：浅色 / 深色 / 跟随系统
- **微动画**：Linear 风格 UI，framer-motion 动画
- **Notion 驱动**：数据存储在 Notion 数据库中

## 🛠️ 技术栈

- **Next.js 16** + React 19 + TypeScript
- **TailwindCSS 4** + Linear UI 风格主题
- **@notionhq/client** - Notion API 数据层
- **@dnd-kit** - 拖拽排序
- **framer-motion** - 动画
- **Turborepo** + pnpm monorepo

## 🚀 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 10

### 安装与配置

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp apps/web/.env.example apps/web/.env.local
# 编辑 .env.local，填入 Notion 相关配置
```

### 环境变量

| 变量名                 | 说明                     |
| ---------------------- | ------------------------ |
| `NOTION_TOKEN`         | Notion Integration Token |
| `NOTION_DATABASE_ID`   | Notion Database ID       |
| `LOCK_PASSWORD`        | 访问密码（留空则不启用） |
| `NEXT_PUBLIC_LANGUAGE` | UI 语言（`zh` / `en`）   |

### Notion 数据库结构

请在 Notion 中创建数据库，并配置以下属性：

| 字段名          | 类型      | 说明                                                     |
| --------------- | --------- | -------------------------------------------------------- |
| Name            | title     | 订阅名称                                                 |
| Icon            | url       | 图标 URL                                                 |
| Price           | number    | 价格                                                     |
| Currency        | select    | 货币（CNY / USD）                                        |
| Cycle           | select    | 周期（monthly / quarterly / yearly / one-time / custom） |
| CustomCycleDays | number    | 自定义周期天数                                           |
| StartDate       | date      | 开始时间                                                 |
| EndDate         | date      | 结束时间                                                 |
| Description     | rich_text | 描述                                                     |
| Category        | select    | 分类                                                     |
| Position        | number    | 排序位置                                                 |
| Color           | select    | 品牌色                                                   |

### 开发命令

```bash
pnpm dev        # 启动开发环境
pnpm build      # 生产构建
pnpm lint       # 代码检查
```

访问 `http://localhost:3000`

## 🗂️ 项目结构

```text
m-wallet/
├── apps/web/                # Next.js 应用
│   ├── app/                 # 页面（/, /stats, /new, /settings）
│   ├── components/          # UI 组件
│   ├── lib/
│   │   ├── actions/         # Server Actions（订阅、鉴权等）
│   │   ├── notion.ts        # Notion 客户端
│   │   ├── services.ts      # 55+ 预置服务
│   │   └── types.ts         # TypeScript 类型
│   └── config/              # 站点配置
├── packages/
│   ├── ui/                  # 共享 UI（shadcn/ui）
│   ├── eslint-config/       # ESLint 配置
│   └── typescript-config/   # TypeScript 配置
```

## 📄 License

[MIT](LICENSE)
