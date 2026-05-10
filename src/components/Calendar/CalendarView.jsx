import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, Clock } from 'lucide-react'
import { PLATFORMS, COLUMNS } from '../../data/constants.js'

const DAYS    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS  = ['January','February','March','April','May','June','July','August','September','October','November','December']

const PLATFORM_COLORS = {
  youtube:   '#EF4444',
  instagram: '#EC4899',
  twitter:   '#38BDF8',
  blog:      '#10B981',
  linkedin:  '#3B82F6',
}

const COLUMN_META = Object.fromEntries(COLUMNS.map(c => [c.id, c]))

export default function CalendarView({ cards, onOpenCard }) {
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [mode, setMode]   = useState('due') // 'due' | 'published'

  const daysInMonth     = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const calendarDays = useMemo(() => {
    const days = []
    const prevDays = new Date(year, month, 0).getDate()
    for (let i = firstDayOfMonth - 1; i >= 0; i--)
      days.push({ day: prevDays - i, inMonth: false, dateStr: null })
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        day: d,
        inMonth: true,
        dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      })
    }
    while (days.length < 42)
      days.push({ day: days.length - daysInMonth - firstDayOfMonth + 1, inMonth: false, dateStr: null })
    return days
  }, [year, month, daysInMonth, firstDayOfMonth])

  const cardsByDate = useMemo(() => {
    const map = {}
    cards.forEach(card => {
      const raw = mode === 'due' ? card.dueDate : card.publishedDate
      if (!raw) return
      const key = raw.slice(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(card)
    })
    return map
  }, [cards, mode])

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1)
  }

  const scheduledThisMonth = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
    return Object.entries(cardsByDate)
      .filter(([d]) => d.startsWith(prefix))
      .reduce((s, [, cs]) => s + cs.length, 0)
  }, [cardsByDate, year, month])

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ padding: '22px 24px 16px' }}>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          {/* Mode toggle */}
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--bd)', background: 'rgba(255,255,255,0.03)' }}
          >
            {[{ id: 'due', label: 'Due Dates', icon: Clock },
              { id: 'published', label: 'Published', icon: CalendarDays }].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  color:      mode === id ? '#C4B8FF' : 'var(--t3)',
                  background: mode === id ? 'rgba(124,92,252,0.18)' : 'transparent',
                  borderRight: id === 'due' ? '1px solid var(--bd)' : 'none',
                }}
              >
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>

          {/* Scheduled count pill */}
          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{ color: 'var(--t3)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--bd)' }}
          >
            {scheduledThisMonth} scheduled in {MONTHS[month]}
          </span>
        </div>

        {/* Month navigator */}
        <div
          className="flex items-center gap-1"
          style={{ border: '1px solid var(--bd)', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', padding: '3px' }}
        >
          <button onClick={prevMonth} className="g-btn-ghost" style={{ padding: '4px 7px' }}>
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm font-semibold px-3" style={{ color: 'var(--t1)', minWidth: '148px', textAlign: 'center' }}>
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} className="g-btn-ghost" style={{ padding: '4px 7px' }}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div
        className="flex-1 card-glass overflow-hidden"
        style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
      >
        {/* Day-of-week header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          {DAYS.map(d => (
            <div
              key={d}
              className="py-2.5 text-center text-xs font-semibold"
              style={{ color: 'var(--t3)', letterSpacing: '0.05em' }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: 'repeat(6, 1fr)',
            minHeight: 0,
          }}
        >
          {calendarDays.map(({ day, inMonth, dateStr }, i) => {
            const isToday    = dateStr === todayStr
            const dayCards   = dateStr ? (cardsByDate[dateStr] || []) : []
            const isLastCol  = (i + 1) % 7 === 0
            const row        = Math.floor(i / 7)
            const hasCards   = dayCards.length > 0

            return (
              <div
                key={i}
                style={{
                  borderRight:  isLastCol ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  borderBottom: row < 5   ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  padding: '6px 7px',
                  background: isToday
                    ? 'rgba(124,92,252,0.08)'
                    : hasCards && inMonth
                    ? 'rgba(255,255,255,0.01)'
                    : 'transparent',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  minHeight: 0,
                }}
              >
                {/* Day number */}
                <div style={{ flexShrink: 0 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      fontSize: '11px',
                      fontWeight: isToday ? 700 : 500,
                      color: isToday ? '#fff' : inMonth ? 'var(--t2)' : 'rgba(236,233,255,0.15)',
                      background: isToday ? 'var(--accent)' : 'transparent',
                      boxShadow: isToday ? '0 0 14px rgba(124,92,252,0.55)' : 'none',
                    }}
                  >
                    {day}
                  </span>
                </div>

                {/* Card chips */}
                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '2px', minHeight: 0 }}>
                  {dayCards.slice(0, 3).map(card => {
                    const col   = COLUMN_META[card.column]
                    const color = PLATFORM_COLORS[card.platform] || '#7C5CFC'
                    return (
                      <button
                        key={card.id}
                        onClick={() => onOpenCard(card.id)}
                        title={card.title}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 500,
                          lineHeight: '1.45',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          background: `${color}18`,
                          color,
                          borderLeft: `2px solid ${color}`,
                          cursor: 'pointer',
                          transition: 'opacity 0.15s',
                          flexShrink: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                      >
                        {card.title}
                      </button>
                    )
                  })}
                  {dayCards.length > 3 && (
                    <span style={{ fontSize: '9px', color: 'var(--t3)', paddingLeft: '6px', flexShrink: 0 }}>
                      +{dayCards.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Platform legend */}
      <div className="flex items-center gap-4 mt-3 shrink-0">
        {Object.entries(PLATFORM_COLORS).map(([platform, color]) => (
          <div key={platform} className="flex items-center gap-1.5">
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: 'var(--t3)' }}>
              {PLATFORMS[platform]?.label ?? platform}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
