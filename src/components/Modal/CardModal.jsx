import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import ModalBackdrop from './ModalBackdrop.jsx'
import { COLUMNS, PLATFORMS, CONTENT_TYPES, COLOR_OPTIONS } from '../../data/constants.js'

export default function CardModal({ card, onUpdate, onDelete, onClose }) {
  const [draft, setDraft] = useState({
    title: card.title ?? '',
    description: card.description ?? '',
    contentType: card.contentType ?? 'video',
    platform: card.platform ?? 'youtube',
    color: card.color ?? null,
    thumbnailUrl: card.thumbnailUrl ?? '',
    column: card.column,
    dueDate: card.dueDate ?? '',
    publishedDate: card.publishedDate ?? '',
    contentUrl: card.contentUrl ?? '',
    metrics: { ...card.metrics },
    notes: card.notes ?? '',
  })
  const [confirmDelete, setConfirmDelete] = useState(false)

  const showMetrics = draft.column === 'published' || draft.column === 'analyzed'
  const showWatchTime = draft.column === 'analyzed' && draft.platform === 'youtube'

  function patch(field, value) { setDraft((d) => ({ ...d, [field]: value })) }
  function patchMetric(field, value) {
    setDraft((d) => ({ ...d, metrics: { ...d.metrics, [field]: value === '' ? null : Number(value) } }))
  }
  function handleSave() {
    onUpdate({
      ...draft,
      dueDate: draft.dueDate || null,
      publishedDate: draft.publishedDate || null,
      contentUrl: draft.contentUrl || null,
      thumbnailUrl: draft.thumbnailUrl || null,
    })
    onClose()
  }

  const inputRowStyle = { borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '16px', marginTop: '4px' }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-glass w-full max-w-md" style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h2 className="text-sm font-bold" style={{ color: 'var(--t1)' }}>Edit Content</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            style={{ color: 'var(--t3)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--t1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.background = 'transparent' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Title */}
          <div>
            <label className="g-label">Title</label>
            <input autoFocus value={draft.title} onChange={(e) => patch('title', e.target.value)}
              placeholder="What's the content idea?" className="g-input" />
          </div>

          {/* Description */}
          <div>
            <label className="g-label">Description</label>
            <textarea value={draft.description} onChange={(e) => patch('description', e.target.value)}
              placeholder="What's the angle or key message?" rows={3} className="g-input" />
          </div>

          {/* Content Type */}
          <div>
            <label className="g-label">Content Type</label>
            <div className="flex gap-2 flex-wrap">
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.id}
                  type="button"
                  onClick={() => patch('contentType', ct.id)}
                  className={`type-chip ${draft.contentType === ct.id ? 'active' : ''}`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <label className="g-label">Platform</label>
            <select value={draft.platform} onChange={(e) => patch('platform', e.target.value)} className="g-select">
              {Object.entries(PLATFORMS).map(([key, p]) => (
                <option key={key} value={key}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Color Label */}
          <div>
            <label className="g-label">Color Label</label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => patch('color', draft.color === hex ? null : hex)}
                  className="w-6 h-6 rounded-full transition-transform hover:scale-110 shrink-0"
                  style={{
                    backgroundColor: hex,
                    boxShadow: draft.color === hex
                      ? `0 0 0 2px rgba(9,8,22,1), 0 0 0 4px ${hex}, 0 0 14px ${hex}88`
                      : `0 0 8px ${hex}44`,
                  }}
                />
              ))}
              {draft.color && (
                <button
                  type="button"
                  onClick={() => patch('color', null)}
                  className="g-btn-ghost"
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                >
                  clear
                </button>
              )}
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="g-label">Thumbnail URL</label>
            <input value={draft.thumbnailUrl} onChange={(e) => patch('thumbnailUrl', e.target.value)}
              placeholder="https://..." className="g-input" />
            {draft.thumbnailUrl && (
              <img
                src={draft.thumbnailUrl}
                alt="thumbnail preview"
                className="mt-2 w-full h-28 object-cover rounded-xl"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
          </div>

          {/* Stage */}
          <div>
            <label className="g-label">Stage</label>
            <select value={draft.column} onChange={(e) => patch('column', e.target.value)} className="g-select">
              {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          {/* Due Date + Published Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="g-label">Due Date</label>
              <input type="date" value={draft.dueDate} onChange={(e) => patch('dueDate', e.target.value)} className="g-input" />
            </div>
            <div>
              <label className="g-label">Published Date</label>
              <input type="date" value={draft.publishedDate} onChange={(e) => patch('publishedDate', e.target.value)} className="g-input" />
            </div>
          </div>

          {/* Content URL */}
          <div>
            <label className="g-label">Content URL</label>
            <div className="flex items-center gap-2">
              <input value={draft.contentUrl} onChange={(e) => patch('contentUrl', e.target.value)}
                placeholder="https://..." className="g-input" style={{ flex: 1 }} />
              {draft.contentUrl && (
                <a href={draft.contentUrl} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Performance metrics */}
          {showMetrics && (
            <div>
              <label className="g-label">Performance</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'views', label: 'Views' },
                  { key: 'likes', label: 'Likes' },
                  { key: 'comments', label: 'Comments' },
                  { key: 'shares', label: 'Shares' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="g-label" style={{ fontSize: '9.5px', marginBottom: '4px' }}>{label}</label>
                    <input
                      type="number" min="0"
                      value={draft.metrics[key] ?? ''}
                      onChange={(e) => patchMetric(key, e.target.value)}
                      placeholder="0"
                      className="g-input"
                      style={{ padding: '7px 11px', fontSize: '12.5px' }}
                    />
                  </div>
                ))}
                {showWatchTime && (
                  <div>
                    <label className="g-label" style={{ fontSize: '9.5px', marginBottom: '4px' }}>Watch Time (min)</label>
                    <input
                      type="number" min="0" step="0.1"
                      value={draft.metrics.watchTimeMins ?? ''}
                      onChange={(e) => patchMetric('watchTimeMins', e.target.value)}
                      placeholder="0.0"
                      className="g-input"
                      style={{ padding: '7px 11px', fontSize: '12.5px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="g-label">Notes</label>
            <textarea value={draft.notes} onChange={(e) => patch('notes', e.target.value)}
              rows={2} placeholder="Learnings, ideas for next time..." className="g-input" />
          </div>

        </div>

        {/* Footer */}
        <div
          className="px-5 py-3.5 shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          {confirmDelete ? (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: 'var(--danger)' }}>Delete this card?</span>
              <div className="flex gap-3 items-center">
                <button onClick={() => setConfirmDelete(false)} className="g-btn-ghost" style={{ fontSize: '12.5px' }}>
                  Cancel
                </button>
                <button onClick={onDelete} className="g-btn-danger">
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button onClick={handleSave} className="g-btn-primary">
                Save Changes
              </button>
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="g-btn-ghost" style={{ fontSize: '12.5px' }}>
                  Cancel
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="g-btn-ghost"
                  style={{ fontSize: '12.5px', color: 'var(--danger)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalBackdrop>
  )
}
