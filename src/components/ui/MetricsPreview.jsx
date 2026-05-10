import { Eye, Heart, MessageCircle, Clock } from 'lucide-react'
import { formatCount } from '../../utils/metrics.js'

export default function MetricsPreview({ metrics, showWatchTime = false }) {
  const items = [
    { icon: Eye,           value: metrics.views,    key: 'views' },
    { icon: Heart,         value: metrics.likes,    key: 'likes' },
    { icon: MessageCircle, value: metrics.comments, key: 'comments' },
  ]

  const hasAnyMetric = items.some((i) => i.value && i.value > 0)
  if (!hasAnyMetric) {
    return <p className="text-[11px] italic" style={{ color: 'var(--t3)' }}>No metrics yet</p>
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {items.map(({ icon: Icon, value, key }) => {
        const formatted = formatCount(value)
        if (!formatted) return null
        return (
          <span key={key} className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--t2)' }}>
            <Icon size={11} style={{ color: 'var(--t3)' }} />
            {formatted}
          </span>
        )
      })}
      {showWatchTime && metrics.watchTimeMins && (
        <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--t2)' }}>
          <Clock size={11} style={{ color: 'var(--t3)' }} />
          {metrics.watchTimeMins}m avg
        </span>
      )}
    </div>
  )
}
