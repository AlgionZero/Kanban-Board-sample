import Card from './Card.jsx'

export default function DragOverlayCard({ card }) {
  if (!card) return null
  return (
    <div
      className="rotate-2 scale-105"
      style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.7)) drop-shadow(0 0 20px rgba(124,92,252,0.25))' }}
    >
      <Card card={card} />
    </div>
  )
}
