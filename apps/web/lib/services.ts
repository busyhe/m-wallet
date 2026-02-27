import type { PresetService } from '@/lib/types'

// Iconify slug helper for simple-icons
const SI = (name: string) => `simple-icons:${name}`

export const PRESET_SERVICES: PresetService[] = [
  // Streaming
  { name: 'Netflix', icon: SI('netflix'), category: '影音', color: '#E50914' },
  { name: 'Spotify', icon: SI('spotify'), category: '影音', color: '#1DB954' },
  { name: 'YouTube Premium', icon: SI('youtube'), category: '影音', color: '#FF0000' },
  { name: 'Apple Music', icon: SI('applemusic'), category: '影音', color: '#FA243C' },
  { name: 'Apple TV+', icon: SI('appletv'), category: '影音', color: '#000000' },
  { name: 'Disney+', icon: SI('disneyplus'), category: '影音', color: '#113CCF' },
  { name: 'HBO Max', icon: SI('hbo'), category: '影音', color: '#5822B4' },
  { name: 'Bilibili', icon: SI('bilibili'), category: '影音', color: '#00A1D6' },
  { name: 'QQ Music', icon: SI('tencentqq'), category: '影音', color: '#FE161F' },
  { name: 'NetEase Music', icon: SI('neteasemusic'), category: '影音', color: '#C20C0C' },

  // Cloud & Storage
  { name: 'iCloud+', icon: SI('icloud'), category: '云存储', color: '#3693F3' },
  { name: 'Google One', icon: SI('google'), category: '云存储', color: '#4285F4' },
  { name: 'Dropbox', icon: SI('dropbox'), category: '云存储', color: '#0061FF' },
  { name: 'OneDrive', icon: SI('microsoftonedrive'), category: '云存储', color: '#0078D4' },

  // Productivity
  { name: 'Notion', icon: SI('notion'), category: '效率', color: '#000000' },
  { name: 'Linear', icon: SI('linear'), category: '效率', color: '#5E6AD2' },
  { name: 'Slack', icon: SI('slack'), category: '效率', color: '#4A154B' },
  { name: 'Microsoft 365', icon: SI('microsoftoffice'), category: '效率', color: '#D83B01' },
  { name: 'Google Workspace', icon: SI('googleworkspace'), category: '效率', color: '#4285F4' },
  { name: '1Password', icon: SI('1password'), category: '效率', color: '#0094F5' },
  { name: 'Todoist', icon: SI('todoist'), category: '效率', color: '#E44332' },

  // Design
  { name: 'Figma', icon: SI('figma'), category: '设计', color: '#F24E1E' },
  { name: 'Adobe CC', icon: SI('adobe'), category: '设计', color: '#FF0000' },
  { name: 'Sketch', icon: SI('sketch'), category: '设计', color: '#F7B500' },
  { name: 'Canva', icon: SI('canva'), category: '设计', color: '#00C4CC' },
  { name: 'Framer', icon: SI('framer'), category: '设计', color: '#0055FF' },

  // Development
  { name: 'GitHub Copilot', icon: SI('githubcopilot'), category: '开发', color: '#000000' },
  { name: 'GitHub Pro', icon: SI('github'), category: '开发', color: '#181717' },
  { name: 'Vercel', icon: SI('vercel'), category: '开发', color: '#000000' },
  { name: 'Netlify', icon: SI('netlify'), category: '开发', color: '#00C7B7' },
  { name: 'JetBrains', icon: SI('jetbrains'), category: '开发', color: '#000000' },
  { name: 'Docker', icon: SI('docker'), category: '开发', color: '#2496ED' },
  { name: 'Railway', icon: SI('railway'), category: '开发', color: '#0B0D0E' },
  { name: 'Supabase', icon: SI('supabase'), category: '开发', color: '#3FCF8E' },

  // AI
  { name: 'ChatGPT Plus', icon: SI('openai'), category: 'AI', color: '#412991' },
  { name: 'Claude Pro', icon: SI('anthropic'), category: 'AI', color: '#191919' },
  { name: 'Midjourney', icon: SI('midjourney'), category: 'AI', color: '#000000' },
  { name: 'Cursor', icon: SI('cursor'), category: 'AI', color: '#000000' },
  { name: 'Gemini', icon: SI('googlegemini'), category: 'AI', color: '#8E75B2' },

  // Social & Communication
  { name: 'X Premium', icon: SI('x'), category: '社交', color: '#000000' },
  { name: 'Telegram Premium', icon: SI('telegram'), category: '社交', color: '#26A5E4' },
  { name: 'Discord Nitro', icon: SI('discord'), category: '社交', color: '#5865F2' },
  { name: 'Weibo VIP', icon: SI('sinaweibo'), category: '社交', color: '#E6162D' },

  // VPN & Security
  { name: 'NordVPN', icon: SI('nordvpn'), category: '安全', color: '#4687FF' },
  { name: 'ExpressVPN', icon: SI('expressvpn'), category: '安全', color: '#DA3940' },
  { name: 'Cloudflare', icon: SI('cloudflare'), category: '安全', color: '#F38020' },

  // Gaming
  { name: 'Xbox Game Pass', icon: SI('xbox'), category: '游戏', color: '#107C10' },
  { name: 'PlayStation Plus', icon: SI('playstation'), category: '游戏', color: '#003791' },
  { name: 'Nintendo Online', icon: SI('nintendoswitch'), category: '游戏', color: '#E60012' },
  { name: 'Steam', icon: SI('steam'), category: '游戏', color: '#000000' },

  // Reading & Learning
  { name: 'Kindle Unlimited', icon: SI('amazon'), category: '阅读', color: '#FF9900' },
  { name: 'Audible', icon: SI('audible'), category: '阅读', color: '#F8991C' },
  { name: 'Medium', icon: SI('medium'), category: '阅读', color: '#000000' },
  { name: 'Duolingo', icon: SI('duolingo'), category: '学习', color: '#58CC02' },

  // Domains & Hosting
  { name: 'Cloudflare Domain', icon: SI('cloudflare'), category: '域名', color: '#F38020' },
  { name: 'Namecheap', icon: SI('namecheap'), category: '域名', color: '#DE3723' },
  { name: 'GoDaddy', icon: SI('godaddy'), category: '域名', color: '#1BDBDB' }
]

// Get all categories from preset services
export function getServiceCategories(): string[] {
  const categories = new Set(PRESET_SERVICES.map((s) => s.category))
  return Array.from(categories)
}
