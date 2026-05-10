import { useRef } from 'react'

const VW = 600, VH = 200
const PAD = { l: 46, r: 20, t: 20, b: 34 }
const CW  = VW - PAD.l - PAD.r
const CH  = VH - PAD.t - PAD.b

function fmtTick(v, isRate) {
  if (isRate) return `${v % 1 === 0 ? v : v.toFixed(1)}%`
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}k`
  return String(Math.round(v))
}

function smoothPath(pts) {
  if (pts.length === 0) return ''
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], c = pts[i]
    const cpx = (p.x + c.x) / 2
    d += ` C ${cpx} ${p.y} ${cpx} ${c.y} ${c.x} ${c.y}`
  }
  return d
}

export default function LineChart({ data, color, isRate, selectedIdx, onHover, onSelect }) {
  const svgRef = useRef(null)

  const values = data.map(d => d.value)
  const maxVal = Math.max(...values, isRate ? 10 : 100)

  const toX = i => PAD.l + (data.length > 1 ? (i / (data.length - 1)) : 0.5) * CW
  const toY = v => PAD.t + CH - (Math.max(v, 0) / maxVal) * CH

  const pts      = data.map((d, i) => ({ x: toX(i), y: toY(d.value) }))
  const linePath = smoothPath(pts)
  const areaPath = pts.length > 1
    ? `${linePath} L ${pts[pts.length - 1].x} ${VH - PAD.b} L ${PAD.l} ${VH - PAD.b} Z`
    : ''

  // Y-axis ticks at 0%, 50%, 100%
  const yTicks = [0, 0.5, 1].map(f => ({
    y:     toY(maxVal * f),
    label: fmtTick(maxVal * f, isRate),
  }))

  const gradId = `lg-${color.replace('#', '')}`

  function getIdxFromEvent(e) {
    if (!svgRef.current || data.length === 0) return null
    const rect = svgRef.current.getBoundingClientRect()
    const svgX  = ((e.clientX - rect.left) / rect.width) * VW
    const relX  = svgX - PAD.l
    const raw   = (relX / CW) * (data.length - 1)
    return Math.max(0, Math.min(Math.round(raw), data.length - 1))
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        style={{ width: '100%', height: '100%' }}
        onMouseMove={e => onHover?.(getIdxFromEvent(e))}
        onMouseLeave={() => onHover?.(null)}
        onClick={e => { const i = getIdxFromEvent(e); if (i !== null) onSelect?.(i) }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Grid lines + Y labels */}
        {yTicks.map(({ y, label }, i) => (
          <g key={i}>
            <line
              x1={PAD.l} y1={y} x2={VW - PAD.r} y2={y}
              stroke="rgba(255,255,255,0.055)" strokeWidth="1"
            />
            <text x={PAD.l - 7} y={y + 4} textAnchor="end"
              style={{ fontSize: 9, fill: 'rgba(236,233,255,0.28)', fontFamily: 'inherit' }}>
              {label}
            </text>
          </g>
        ))}

        {/* Selected month column highlight */}
        {selectedIdx !== null && pts[selectedIdx] && (
          <rect
            x={PAD.l}
            y={PAD.t}
            width={CW}
            height={CH}
            fill="transparent"
          />
        )}
        {selectedIdx !== null && pts[selectedIdx] && (() => {
          const segW = CW / Math.max(data.length - 1, 1)
          const cx = pts[selectedIdx].x
          return (
            <rect
              x={cx - segW / 2}
              y={PAD.t}
              width={segW}
              height={CH}
              fill={`${color}09`}
              rx="4"
            />
          )
        })()}

        {/* Area fill */}
        {areaPath && <path d={areaPath} fill={`url(#${gradId})`} />}

        {/* Line */}
        {linePath && (
          <path
            d={linePath} fill="none"
            stroke={color} strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          />
        )}

        {/* Dots + vertical crosshair for selected */}
        {pts.map((p, i) => {
          const isSel = i === selectedIdx
          return (
            <g key={i}>
              {isSel && (
                <line
                  x1={p.x} y1={PAD.t} x2={p.x} y2={VH - PAD.b}
                  stroke={color} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.5"
                />
              )}
              <circle
                cx={p.x} cy={p.y}
                r={isSel ? 5 : 3.5}
                fill={isSel ? color : 'rgba(12,10,26,1)'}
                stroke={color}
                strokeWidth={isSel ? 0 : 2}
                style={{ transition: 'r 0.12s ease' }}
              />
            </g>
          )
        })}

        {/* X-axis month labels */}
        {data.map((d, i) => {
          const isSel = i === selectedIdx
          return (
            <text key={i} x={toX(i)} y={VH - 8} textAnchor="middle"
              style={{
                fontSize: isSel ? 10 : 9,
                fontWeight: isSel ? 700 : 400,
                fill: isSel ? 'rgba(236,233,255,0.9)' : 'rgba(236,233,255,0.3)',
                fontFamily: 'inherit',
              }}>
              {d.shortLabel}
            </text>
          )
        })}

        {/* Invisible wide hit targets per column */}
        {data.map((_, i) => {
          const segW = CW / Math.max(data.length - 1, 1)
          return (
            <rect
              key={i}
              x={Math.max(PAD.l, toX(i) - segW / 2)}
              y={PAD.t}
              width={segW}
              height={CH + PAD.b}
              fill="transparent"
              onMouseEnter={() => onHover?.(i)}
              onClick={() => onSelect?.(i)}
            />
          )
        })}
      </svg>

      {/* Floating tooltip anchored to selected dot */}
      {selectedIdx !== null && pts[selectedIdx] && (() => {
        const pct     = pts[selectedIdx].x / VW
        const leftPct = `${pct * 100}%`
        const isRight = selectedIdx < data.length / 2
        return (
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: leftPct,
              transform: isRight ? 'translateX(10px)' : 'translateX(calc(-100% - 10px))',
              background: 'rgba(8,7,20,0.94)',
              border: `1px solid ${color}44`,
              borderRadius: 10,
              padding: '8px 12px',
              pointerEvents: 'none',
              backdropFilter: 'blur(14px)',
              zIndex: 10,
              minWidth: 120,
            }}
          >
            <p style={{ fontSize: 10, color: 'rgba(236,233,255,0.4)', marginBottom: 3 }}>
              {data[selectedIdx].fullLabel}
            </p>
            <p style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {fmtTick(data[selectedIdx].value, isRate)}
            </p>
            {data[selectedIdx].count !== undefined && (
              <p style={{ fontSize: 10, color: 'rgba(236,233,255,0.3)', marginTop: 4 }}>
                {data[selectedIdx].count} {data[selectedIdx].count === 1 ? 'piece' : 'pieces'} published
              </p>
            )}
          </div>
        )
      })()}
    </div>
  )
}
