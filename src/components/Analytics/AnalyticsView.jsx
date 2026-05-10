import { useState, useMemo } from 'react'
import {
  TrendingUp, TrendingDown, Minus,
  Eye, Heart, MessageCircle, Film, ChevronLeft, ChevronRight,
} from 'lucide-react'
import LineChart from './LineChart.jsx'
import { PLATFORMS } from '../../data/constants.js'

// ── Constants ────────────────────────────────────────────────────────────────

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTH_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December']

const PLATFORM_COLORS = {
  youtube:   '#EF4444',
  instagram: '#EC4899',
  twitter:   '#38BDF8',
  blog:      '#10B981',
  linkedin:  '#3B82F6',
}

const METRICS = [
  { key: 'views',      label: 'Views',      color: '#22D3EE', isRate: false },
  { key: 'likes',      label: 'Likes',      color: '#EC4899', isRate: false },
  { key: 'engagement', label: 'Engagement', color: '#10B981', isRate: true  },
  { key: 'comments',   label: 'Comments',   color: '#F59E0B', isRate: false },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n) {
  if (n == null || n === 0) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return String(Math.round(n))
}

function fmtRate(v) {
  return v > 0 ? `${v.toFixed(1)}%` : '—'
}

function getLast6Months(refYear, refMonth) {
  const months = []
  let y = refYear, m = refMonth
  for (let i = 0; i < 6; i++) {
    months.unshift({ year: y, month: m })
    if (--m < 0) { m = 11; y-- }
  }
  return months
}

function aggregateMonth(cards, year, month) {
  const mc = cards.filter(c => {
    if (!c.publishedDate) return false
    const d = new Date(c.publishedDate + 'T00:00:00')
    return d.getFullYear() === year && d.getMonth() === month
  })
  const views      = mc.reduce((s, c) => s + (c.metrics?.views    ?? 0), 0)
  const likes      = mc.reduce((s, c) => s + (c.metrics?.likes    ?? 0), 0)
  const comments   = mc.reduce((s, c) => s + (c.metrics?.comments ?? 0), 0)
  const shares     = mc.reduce((s, c) => s + (c.metrics?.shares   ?? 0), 0)
  const engArr     = mc.filter(c => c.metrics?.engagementRate != null).map(c => c.metrics.engagementRate)
  const engagement = engArr.length ? engArr.reduce((s, v) => s + v, 0) / engArr.length : 0
  return { views, likes, comments, shares, engagement, count: mc.length, cards: mc }
}

function metricVal(agg, key) {
  if (key === 'views')      return agg.views
  if (key === 'likes')      return agg.likes
  if (key === 'comments')   return agg.comments
  if (key === 'engagement') return agg.engagement
  return 0
}

function momArrow(curr, prev) {
  if (!prev || prev === 0) return null
  return ((curr - prev) / prev) * 100
}

// ── Sub-components ───────────────────────────────────────────────────────────

function MomBadge({ pct }) {
  if (pct === null) return <span style={{ fontSize: 10, color: 'rgba(236,233,255,0.25)' }}>no prev. data</span>
  const up    = pct > 0
  const flat  = Math.abs(pct) < 0.5
  const color = flat ? 'rgba(236,233,255,0.35)' : up ? '#10B981' : '#F87171'
  const Icon  = flat ? Minus : up ? TrendingUp : TrendingDown
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10.5, fontWeight: 600, color }}>
      <Icon size={11} />
      {flat ? 'flat' : `${Math.abs(pct).toFixed(1)}% vs prev`}
    </span>
  )
}

function KpiCard({ label, value, sub, mom, color, icon: Icon }) {
  return (
    <div
      className="card-glass"
      style={{ padding: '16px 18px', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute', top: -24, right: -24, width: 80, height: 80,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}1a 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <p style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {label}
        </p>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={13} style={{ color }} />
        </div>
      </div>
      <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--t1)', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 6 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: 10.5, color: 'var(--t3)', marginBottom: 4 }}>{sub}</p>}
      <MomBadge pct={mom} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AnalyticsView({ cards, onOpenCard }) {
  const today  = useMemo(() => new Date(), [])
  const last6  = useMemo(() => getLast6Months(today.getFullYear(), today.getMonth()), [today])

  const [selectedIdx, setSelectedIdx] = useState(5) // current month
  const [hoverIdx,    setHoverIdx]    = useState(null)
  const [metric,      setMetric]      = useState('views')

  const activeIdx = hoverIdx ?? selectedIdx

  const agg6 = useMemo(
    () => last6.map(m => aggregateMonth(cards, m.year, m.month)),
    [cards, last6]
  )

  const activeAgg = agg6[activeIdx]
  const prevAgg   = activeIdx > 0 ? agg6[activeIdx - 1] : null
  const selMonth  = last6[activeIdx]

  const activeMetric = METRICS.find(m => m.key === metric)

  // Chart series
  const chartData = useMemo(() => last6.map((m, i) => ({
    shortLabel: MONTH_SHORT[m.month],
    fullLabel:  `${MONTH_FULL[m.month]} ${m.year}`,
    value:      metricVal(agg6[i], metric),
    count:      agg6[i].count,
  })), [last6, agg6, metric])

  // Platform breakdown for the whole period (all 6 months)
  const platformData = useMemo(() => {
    const allPublished = cards.filter(c => {
      if (!c.publishedDate) return false
      const d = new Date(c.publishedDate + 'T00:00:00')
      return last6.some(m => m.year === d.getFullYear() && m.month === d.getMonth())
    })
    const counts = {}
    allPublished.forEach(c => { counts[c.platform] = (counts[c.platform] ?? 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [cards, last6])
  const maxPlatformCount = Math.max(...platformData.map(([, n]) => n), 1)

  // Total across all 6 months
  const total6 = useMemo(() => agg6.reduce((s, a) => ({
    views:    s.views    + a.views,
    likes:    s.likes    + a.likes,
    comments: s.comments + a.comments,
    count:    s.count    + a.count,
  }), { views: 0, likes: 0, comments: 0, count: 0 }), [agg6])

  const monthLabel = `${MONTH_FULL[selMonth.month]} ${selMonth.year}`

  return (
    <div className="flex-1 overflow-auto" style={{ padding: '20px 24px 28px' }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Analytics</h2>
          <p style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
            6-month rolling performance · {total6.count} pieces published
          </p>
        </div>

        {/* Metric selector */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          background: 'rgba(255,255,255,0.04)', border: '1px solid var(--bd)',
          borderRadius: 10, padding: 3,
        }}>
          {METRICS.map(m => {
            const active = metric === m.key
            return (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                style={{
                  padding: '5px 12px', borderRadius: 7, fontSize: 11.5, fontWeight: 600,
                  border: 'none', cursor: 'pointer', transition: 'all 0.16s',
                  color:      active ? m.color   : 'var(--t3)',
                  background: active ? `${m.color}18` : 'transparent',
                  outline: active ? `1px solid ${m.color}33` : '1px solid transparent',
                  fontFamily: 'inherit',
                }}
              >
                {m.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 }}>
        <KpiCard
          label="Views" icon={Eye} color="#22D3EE"
          value={fmt(activeAgg.views)}
          sub={`${fmt(total6.views)} total · 6 months`}
          mom={momArrow(activeAgg.views, prevAgg?.views)}
        />
        <KpiCard
          label="Likes" icon={Heart} color="#EC4899"
          value={fmt(activeAgg.likes)}
          sub={`${fmt(total6.likes)} total · 6 months`}
          mom={momArrow(activeAgg.likes, prevAgg?.likes)}
        />
        <KpiCard
          label="Published" icon={Film} color="#7C5CFC"
          value={activeAgg.count}
          sub={`${total6.count} total · 6 months`}
          mom={momArrow(activeAgg.count, prevAgg?.count)}
        />
        <KpiCard
          label="Avg Engagement" icon={TrendingUp} color="#10B981"
          value={fmtRate(activeAgg.engagement)}
          sub="avg of published pieces"
          mom={momArrow(activeAgg.engagement, prevAgg?.engagement)}
        />
      </div>

      {/* ── Chart ── */}
      <div
        className="card-glass"
        style={{ padding: '18px 20px 12px', marginBottom: 12 }}
      >
        {/* Chart header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Performance Trend
            </p>
            <p style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>
              <span style={{ color: activeMetric.color, fontWeight: 600 }}>{activeMetric.label}</span>
              {' '}· hover or click a month to inspect
            </p>
          </div>

          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--bd)', borderRadius: 9, padding: '3px 4px' }}>
            <button
              onClick={() => setSelectedIdx(i => Math.max(0, i - 1))}
              disabled={selectedIdx === 0}
              style={{
                width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 6, border: 'none', background: 'transparent', cursor: selectedIdx === 0 ? 'default' : 'pointer',
                color: selectedIdx === 0 ? 'rgba(236,233,255,0.15)' : 'var(--t2)',
                transition: 'background 0.14s',
              }}
              onMouseEnter={e => { if (selectedIdx > 0) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <ChevronLeft size={14} />
            </button>

            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', minWidth: 118, textAlign: 'center' }}>
              {monthLabel}
            </span>

            <button
              onClick={() => setSelectedIdx(i => Math.min(5, i + 1))}
              disabled={selectedIdx === 5}
              style={{
                width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 6, border: 'none', background: 'transparent', cursor: selectedIdx === 5 ? 'default' : 'pointer',
                color: selectedIdx === 5 ? 'rgba(236,233,255,0.15)' : 'var(--t2)',
                transition: 'background 0.14s',
              }}
              onMouseEnter={e => { if (selectedIdx < 5) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Chart area */}
        <div style={{ height: 200 }}>
          <LineChart
            data={chartData}
            color={activeMetric.color}
            isRate={activeMetric.isRate}
            selectedIdx={activeIdx}
            onHover={setHoverIdx}
            onSelect={idx => { setSelectedIdx(idx); setHoverIdx(null) }}
          />
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Platform mix (6-month view) */}
        <div className="card-glass" style={{ padding: '18px 20px' }}>
          <p style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>
            Platform Mix · 6 months
          </p>
          {platformData.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--t3)' }}>No published content in this window.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {platformData.map(([platform, count]) => {
                const color = PLATFORM_COLORS[platform] ?? '#7C5CFC'
                const pct   = count / maxPlatformCount
                return (
                  <div key={platform} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}` }} />
                    <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--t2)', width: 80, flexShrink: 0 }}>
                      {PLATFORMS[platform]?.label ?? platform}
                    </span>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct * 100}%`, background: color, borderRadius: 3, boxShadow: `0 0 8px ${color}55`, transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', width: 18, textAlign: 'right', flexShrink: 0 }}>{count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Published this month */}
        <div className="card-glass" style={{ padding: '18px 20px' }}>
          <p style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>
            Published · {MONTH_SHORT[selMonth.month]} {selMonth.year}
          </p>

          {activeAgg.cards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Film size={24} style={{ color: 'var(--t3)', margin: '0 auto 8px' }} />
              <p style={{ fontSize: 12, color: 'var(--t3)' }}>Nothing published this month.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {activeAgg.cards.map(card => {
                const color = PLATFORM_COLORS[card.platform] ?? '#7C5CFC'
                return (
                  <button
                    key={card.id}
                    onClick={() => onOpenCard(card.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 10px', borderRadius: 10, width: '100%', textAlign: 'left',
                      background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.055)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 5px ${color}` }} />
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {card.title}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--t3)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Eye size={10} />
                      {fmt(card.metrics?.views ?? 0)}
                    </span>
                    {card.metrics?.engagementRate != null && (
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, flexShrink: 0,
                        color: card.metrics.engagementRate >= 6 ? '#10B981' : card.metrics.engagementRate >= 3 ? '#F59E0B' : 'var(--t3)',
                      }}>
                        {card.metrics.engagementRate}%
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
