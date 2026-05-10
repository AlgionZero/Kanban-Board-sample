const DARK = {
  youtube:   { label: 'YouTube',   bg: 'rgba(239,68,68,0.14)',   color: '#F87171' },
  instagram: { label: 'Instagram', bg: 'rgba(236,72,153,0.14)',  color: '#F472B6' },
  twitter:   { label: 'Twitter/X', bg: 'rgba(56,189,248,0.14)',  color: '#38BDF8' },
  blog:      { label: 'Blog',      bg: 'rgba(52,211,153,0.14)',  color: '#34D399' },
  linkedin:  { label: 'LinkedIn',  bg: 'rgba(59,130,246,0.14)',  color: '#60A5FA' },
}

export default function PlatformPill({ platform, small = false }) {
  const p = DARK[platform]
  if (!p) return null
  return (
    <span
      className="inline-flex items-center rounded-full font-semibold"
      style={{
        background: p.bg,
        color: p.color,
        border: `1px solid ${p.color}30`,
        fontSize: small ? '10px' : '11px',
        padding: small ? '1px 7px' : '2px 9px',
        letterSpacing: '0.01em',
      }}
    >
      {p.label}
    </span>
  )
}
