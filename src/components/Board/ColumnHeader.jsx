import { Plus } from 'lucide-react'
import Badge from '../ui/Badge.jsx'

export default function ColumnHeader({ column, count, onAddCard }) {
  return (
    <div className="flex items-center justify-between px-1 mb-2.5">
      <div className="flex items-center gap-2">
        {/* Glowing dot */}
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{
            backgroundColor: column.color,
            boxShadow: `0 0 8px ${column.color}88`,
          }}
        />
        <h2 className="text-xs font-semibold tracking-wide" style={{ color: 'var(--t2)' }}>
          {column.label}
        </h2>
        <Badge count={count} color={column.color} />
      </div>

      <button
        onClick={onAddCard}
        className="w-6 h-6 flex items-center justify-center rounded-lg transition-all"
        style={{ color: 'var(--t3)', background: 'transparent', border: '1px solid transparent' }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'var(--t1)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'var(--t3)'
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'transparent'
        }}
        title={`Add to ${column.label}`}
      >
        <Plus size={13} />
      </button>
    </div>
  )
}
