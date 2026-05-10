import { useRef, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import Column from './Column.jsx'
import DragOverlayCard from '../Card/DragOverlayCard.jsx'
import { COLUMNS, COLUMN_IDS } from '../../data/constants.js'

export default function Board({ kanban }) {
  const { cards, activeCardId, setActiveCardId, getColumnCards, moveCard, resetCards, openAddModal, openCardModal, getCard } = kanban

  const cardsRef = useRef(cards)
  useEffect(() => { cardsRef.current = cards })

  const preDragRef = useRef(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function resolveColumnId(overData, overId) {
    const containerId = overData?.sortable?.containerId
    if (COLUMN_IDS.includes(containerId)) return containerId
    if (COLUMN_IDS.includes(overId)) return overId
    return null
  }

  function getCardColumn(cardId) {
    return cardsRef.current.find((c) => c.id === cardId)?.column
  }

  function handleDragStart({ active }) {
    setActiveCardId(active.id)
    preDragRef.current = [...cardsRef.current]
  }

  function handleDragOver({ active, over }) {
    if (!over) return
    const activeColumn = getCardColumn(active.id)
    const overColumn = resolveColumnId(over.data.current, over.id)
    if (!activeColumn || !overColumn || activeColumn === overColumn) return
    // Optimistic cross-column preview only — final position applied in handleDragEnd
    moveCard(active.id, overColumn, over.id !== overColumn ? over.id : null)
  }

  function handleDragEnd({ active, over }) {
    // Capture snapshot before clearing so we can reset optimistic moves
    const snapshot = preDragRef.current
    setActiveCardId(null)
    preDragRef.current = null

    if (!over) {
      // Dropped outside any column — revert preview moves
      if (snapshot) resetCards(snapshot)
      return
    }

    const overColumn = resolveColumnId(over.data.current, over.id)
    if (!overColumn) {
      if (snapshot) resetCards(snapshot)
      return
    }

    // Undo all intermediate preview moves from handleDragOver, then apply
    // exactly one final move so the card lands precisely where the user dropped.
    // React batches both setCards calls in the same render, so no flicker.
    if (snapshot) resetCards(snapshot)
    moveCard(active.id, overColumn, over.id !== overColumn ? over.id : null)
  }

  function handleDragCancel() {
    setActiveCardId(null)
    if (preDragRef.current) {
      resetCards(preDragRef.current)
      preDragRef.current = null
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex-1 overflow-x-auto board-scroll">
        <div className="flex gap-4 p-5 h-full items-start min-w-max">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={getColumnCards(column.id)}
              onAddCard={() => openAddModal(column.id)}
              onOpenCard={openCardModal}
            />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
        {activeCardId ? <DragOverlayCard card={getCard(activeCardId)} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
