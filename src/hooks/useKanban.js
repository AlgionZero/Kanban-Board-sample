import { useState, useEffect, useCallback } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { v4 as uuidv4 } from 'uuid'
import { loadBoard, saveBoard } from '../utils/localStorage.js'
import { sampleData } from '../data/sampleData.js'
import { COLUMN_IDS } from '../data/constants.js'

export function useKanban() {
  const [cards, setCards] = useState(() => {
    const saved = loadBoard()
    if (!saved) return sampleData
    const valid = saved.filter(c => COLUMN_IDS.includes(c.column))
    return valid.length ? valid : sampleData
  })
  const [activeCardId, setActiveCardId] = useState(null)
  const [modalState, setModalState] = useState({ type: null, cardId: null, defaultColumn: null })

  useEffect(() => {
    saveBoard(cards)
  }, [cards])

  const getColumnCards = useCallback(
    (columnId) => cards.filter((c) => c.column === columnId),
    [cards]
  )

  const addCard = useCallback((columnId, partial) => {
    const now = new Date().toISOString()
    const card = {
      id: uuidv4(),
      title: '',
      description: '',
      platform: 'youtube',
      contentType: 'video',
      format: 'Video',
      column: columnId,
      color: null,
      thumbnailUrl: null,
      tags: [],
      dueDate: null,
      publishedDate: null,
      contentUrl: null,
      metrics: { views: 0, likes: 0, comments: 0, shares: 0, watchTimeMins: null, engagementRate: null },
      notes: '',
      createdAt: now,
      updatedAt: now,
      ...partial,
    }
    setCards((prev) => [...prev, card])
    return card.id
  }, [])

  const updateCard = useCallback((id, patch) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c))
    )
  }, [])

  const deleteCard = useCallback((id) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const moveCard = useCallback((cardId, toColumnId, overCardId) => {
    if (!COLUMN_IDS.includes(toColumnId)) return
    setCards((prev) => {
      const cardIndex = prev.findIndex((c) => c.id === cardId)
      if (cardIndex === -1) return prev

      let updated = prev.map((c) =>
        c.id === cardId ? { ...c, column: toColumnId, updatedAt: new Date().toISOString() } : c
      )

      if (overCardId && overCardId !== cardId) {
        const fromIndex = updated.findIndex((c) => c.id === cardId)
        const toIndex = updated.findIndex((c) => c.id === overCardId)
        if (fromIndex !== -1 && toIndex !== -1) {
          updated = arrayMove(updated, fromIndex, toIndex)
        }
      }

      return updated
    })
  }, [])

  const resetCards = useCallback((snapshot) => {
    setCards(snapshot)
  }, [])

  const openAddModal = useCallback((columnId) => {
    setModalState({ type: 'add', cardId: null, defaultColumn: columnId })
  }, [])

  const openCardModal = useCallback((cardId) => {
    setModalState({ type: 'view', cardId, defaultColumn: null })
  }, [])

  const closeModal = useCallback(() => {
    setModalState({ type: null, cardId: null, defaultColumn: null })
  }, [])

  const getCard = useCallback((id) => cards.find((c) => c.id === id), [cards])

  return {
    cards,
    activeCardId,
    setActiveCardId,
    modalState,
    getCard,
    getColumnCards,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    resetCards,
    openAddModal,
    openCardModal,
    closeModal,
  }
}
