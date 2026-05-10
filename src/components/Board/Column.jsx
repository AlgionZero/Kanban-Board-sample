import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Plus } from 'lucide-react'
import ColumnHeader from './ColumnHeader.jsx'
import Card from '../Card/Card.jsx'

function SortableCard({ card, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <Card card={card} onOpen={onOpen} dragHandleProps={{ ...attributes, ...listeners }} isDragging={isDragging} />
    </div>
  )
}

export default function Column({ column, cards, onAddCard, onOpenCard }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const cardIds = cards.map((c) => c.id)

  return (
    <div className="w-72 shrink-0 flex flex-col">
      <ColumnHeader column={column} count={cards.length} onAddCard={onAddCard} />

      <SortableContext id={column.id} items={cardIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex-1 flex flex-col gap-2 min-h-[120px] p-2 rounded-2xl column-scroll overflow-y-auto max-h-[calc(100vh-148px)]"
          style={{
            background: isOver
              ? `rgba(${hexToRgb(column.color)}, 0.07)`
              : 'rgba(255,255,255,0.02)',
            border: `1px solid ${isOver
              ? `rgba(${hexToRgb(column.color)}, 0.3)`
              : 'rgba(255,255,255,0.055)'}`,
            transition: 'background 0.2s ease, border-color 0.2s ease',
          }}
        >
          {cards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div
                className="w-7 h-7 rounded-full mb-2.5"
                style={{ background: `rgba(${hexToRgb(column.color)}, 0.2)`, border: `1px solid rgba(${hexToRgb(column.color)}, 0.3)` }}
              />
              <p className="text-[11px]" style={{ color: 'var(--t3)' }}>Drop cards here</p>
            </div>
          )}
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} onOpen={() => onOpenCard(card.id)} />
          ))}
        </div>
      </SortableContext>

      {/* Add card */}
      <button
        onClick={onAddCard}
        className="mt-2 w-full flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
        style={{ color: 'var(--t3)', border: '1px dashed rgba(255,255,255,0.1)', background: 'transparent' }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'var(--t1)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'var(--t3)'
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        }}
      >
        <Plus size={13} className="shrink-0" />
        Add a card
      </button>
    </div>
  )
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
