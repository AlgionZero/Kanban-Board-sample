import { Calendar, ExternalLink, TrendingUp } from 'lucide-react'
import PlatformPill from '../ui/PlatformPill.jsx'
import MetricsPreview from '../ui/MetricsPreview.jsx'
import { computeEngagementRate } from '../../utils/metrics.js'

export default function Card({ card, onOpen, dragHandleProps = {}, isDragging = false }) {
  const showMetrics = card.column === 'published' || card.column === 'analyzed'
  const showEngagement = card.column === 'analyzed'
  const showWatchTime = card.column === 'analyzed' && card.platform === 'youtube'
  const engRate = showEngagement && card.metrics.engagementRate == null
    ? computeEngagementRate(card.metrics)
    : card.metrics.engagementRate

  return (
    <div
      onClick={onOpen}
      className={`card-glass ${isDragging ? 'is-dragging' : ''}`}
      {...dragHandleProps}
    >
      {/* Colored left accent strip */}
      {card.color && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[14px]"
          style={{ background: card.color, opacity: 0.8 }}
        />
      )}

      {/* Thumbnail */}
      {card.thumbnailUrl && (
        <img
          src={card.thumbnailUrl}
          alt=""
          className="w-full h-28 object-cover"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}

      <div className={`px-4 py-3 ${card.color ? 'pl-[18px]' : ''}`}>
        {/* Platform + format */}
        <div className="flex items-center gap-2 mb-2">
          <PlatformPill platform={card.platform} small />
          {card.format && (
            <span className="text-[10px] font-medium" style={{ color: 'var(--t3)' }}>{card.format}</span>
          )}
        </div>

        {/* Title */}
        <p className="text-sm font-semibold leading-snug mb-1 line-clamp-2" style={{ color: 'var(--t1)' }}>
          {card.title || <span className="italic" style={{ color: 'var(--t3)' }}>Untitled</span>}
        </p>

        {/* Description */}
        {card.description && (
          <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--t2)' }}>{card.description}</p>
        )}

        {/* Published date + URL */}
        {showMetrics && card.publishedDate && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px]" style={{ color: 'var(--t3)' }}>
              {new Date(card.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {card.contentUrl && (
              <a
                href={card.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="transition-colors"
                style={{ color: 'var(--t3)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}

        {/* Metrics */}
        {showMetrics && (
          <div className="pt-2 mt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <MetricsPreview metrics={card.metrics} showWatchTime={showWatchTime} />
          </div>
        )}

        {/* Engagement rate */}
        {showEngagement && engRate && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={11} style={{ color: '#34D399' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#34D399' }}>{engRate}% engagement</span>
          </div>
        )}

        {/* Due date */}
        {!showMetrics && card.dueDate && (
          <div className="flex items-center gap-1 mt-2">
            <Calendar size={11} style={{ color: 'var(--t3)' }} />
            <span className="text-[11px]" style={{ color: 'var(--t3)' }}>
              Due {new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
