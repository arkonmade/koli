// src/lib/platforms.ts

export type PlatformDef = {
  id: string
  label: string
  icon: string
  color: string
  base: string
  ph: string
}

export const PLATFORMS: PlatformDef[] = [
  { id:'instagram',  label:'Instagram',  icon:'📸', color:'#E1306C', base:'https://instagram.com/',      ph:'username' },
  { id:'tiktok',     label:'TikTok',     icon:'🎵', color:'#010101', base:'https://tiktok.com/@',        ph:'username' },
  { id:'twitter',    label:'Twitter/X',  icon:'🐦', color:'#1DA1F2', base:'https://x.com/',              ph:'username' },
  { id:'linkedin',   label:'LinkedIn',   icon:'💼', color:'#0A66C2', base:'https://linkedin.com/in/',    ph:'profile-slug' },
  { id:'youtube',    label:'YouTube',    icon:'▶️', color:'#FF0000', base:'https://youtube.com/',        ph:'@channel' },
  { id:'facebook',   label:'Facebook',   icon:'👤', color:'#1877F2', base:'https://facebook.com/',       ph:'page-name' },
  { id:'snapchat',   label:'Snapchat',   icon:'👻', color:'#FFFC00', base:'https://snapchat.com/add/',   ph:'username' },
  { id:'pinterest',  label:'Pinterest',  icon:'📌', color:'#E60023', base:'https://pinterest.com/',      ph:'username' },
  { id:'threads',    label:'Threads',    icon:'🧵', color:'#000000', base:'https://threads.net/@',       ph:'username' },
  { id:'twitch',     label:'Twitch',     icon:'🎮', color:'#9146FF', base:'https://twitch.tv/',          ph:'username' },
  { id:'spotify',    label:'Spotify',    icon:'🎧', color:'#1DB954', base:'https://open.spotify.com/',  ph:'profile-url' },
  { id:'bereal',     label:'BeReal',     icon:'📷', color:'#000000', base:'https://bere.al/',            ph:'username' },
  { id:'whatsapp',   label:'WhatsApp',   icon:'💬', color:'#25D366', base:'https://wa.me/',              ph:'+250…' },
  { id:'website',    label:'Website',    icon:'🌐', color:'#6366F1', base:'',                            ph:'https://...' },
  { id:'podcast',    label:'Podcast',    icon:'🎙️',color:'#8B5CF6', base:'',                            ph:'https://...' },
  { id:'substack',   label:'Substack',   icon:'📝', color:'#FF6719', base:'https://substack.com/@',      ph:'username' },
  { id:'patreon',    label:'Patreon',    icon:'🎁', color:'#FF424D', base:'https://patreon.com/',        ph:'username' },
  { id:'linktree',   label:'Linktree',   icon:'🔗', color:'#43E660', base:'https://linktr.ee/',          ph:'username' },
  { id:'other',      label:'Other',      icon:'🔗', color:'#A1A1AA', base:'',                            ph:'https://...' },
]

export const getPlatform = (id: string): PlatformDef =>
  PLATFORMS.find(p => p.id === id) ?? PLATFORMS[PLATFORMS.length - 1]

export const SOCIAL_PLATFORMS = PLATFORMS.filter(
  p => !['website','podcast','substack','patreon','linktree','other'].includes(p.id)
)

export const buildUrl = (platform: string, handle: string): string => {
  if (!handle) return '#'
  const p = getPlatform(platform)
  if (!p.base) return handle.startsWith('http') ? handle : `https://${handle}`
  if (platform === 'whatsapp') return `https://wa.me/${handle.replace(/\D/g, '')}`
  return `${p.base}${handle.replace(/^@/, '')}`
}

export const fmtFollowers = (n: number | string): string => {
  const num = typeof n === 'string' ? parseInt(n) : n
  if (!num || isNaN(num)) return '0'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${Math.round(num / 1_000)}k`
  return String(num)
}

export const totalReach = (socials: { followers: number }[]): number =>
  (socials ?? []).reduce((a, s) => a + (s.followers || 0), 0)
