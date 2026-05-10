import { useState } from 'react'
import { X } from 'lucide-react'
import ModalBackdrop from './ModalBackdrop.jsx'
import { COLUMNS, PLATFORMS, CONTENT_TYPES, COLOR_OPTIONS } from '../../data/constants.js'

export default function AddCardModal({ defaultColumn, onAdd, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [contentType, setContentType] = useState('video')
  const [platform, setPlatform] = useState('youtube')
  const [color, setColor] = useState(null)
  const [column, setColumn] = useState(defaultColumn ?? 'ideas')
  const [dueDate, setDueDate] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(column, { title: title.trim(), description: description.trim(), contentType, platform, color, dueDate: dueDate || null })
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-glass w-full max-w-md" style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h2 className="text-sm font-bold" style={{ color: 'var(--t1)' }}>Add Content</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            style={{ color: 'var(--t3)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--t1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.background = 'transparent' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-body flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Title */}
          <div>
            <label className="g-label">Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's the content idea?"
              className="g-input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="g-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief angle or notes..."
              rows={2}
              className="g-input"
            />
          </div>

          {/* Content Type */}
          <div>
            <label className="g-label">Content Type</label>
            <div className="flex gap-2 flex-wrap">
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.id}
                  type="button"
                  onClick={() => setContentType(ct.id)}
                  className={`type-chip ${contentType === ct.id ? 'active' : ''}`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platform + Stage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="g-label">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="g-select">
                {Object.entries(PLATFORMS).map(([key, p]) => (
                  <option key={key} value={key}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="g-label">Stage</label>
              <select value={column} onChange={(e) => setColumn(e.target.value)} className="g-select">
                {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* Color Label */}
          <div>
            <label className="g-label">Color Label</label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setColor(color === hex ? null : hex)}
                  className="w-6 h-6 rounded-full transition-transform hover:scale-110 shrink-0"
                  style={{
                    backgroundColor: hex,
                    boxShadow: color === hex ? `0 0 0 2px rgba(8,10,18,1), 0 0 0 4px ${hex}, 0 0 12px ${hex}88` : `0 0 8px ${hex}44`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="g-label">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="g-input"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-1 pb-1">
            <button type="submit" disabled={!title.trim()} className="g-btn-primary">
              Add Card
            </button>
            <button type="button" onClick={onClose} className="g-btn-ghost">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ModalBackdrop>
  )
}
