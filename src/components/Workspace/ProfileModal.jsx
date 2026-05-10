import { useState } from 'react'
import { X } from 'lucide-react'
import ModalBackdrop from '../Modal/ModalBackdrop.jsx'
import { AVATAR_COLORS, getInitials } from '../../hooks/useWorkspace.js'

export default function ProfileModal({ profile, onSave, onClose }) {
  const [draft, setDraft] = useState({
    name:        profile.name        ?? '',
    role:        profile.role        ?? '',
    email:       profile.email       ?? '',
    bio:         profile.bio         ?? '',
    avatarColor: profile.avatarColor ?? '#7C5CFC',
  })

  function patch(field, value) {
    setDraft(d => ({ ...d, [field]: value }))
  }

  function handleSave() {
    onSave({
      name:        draft.name.trim(),
      role:        draft.role.trim() || 'Content Creator',
      email:       draft.email.trim(),
      bio:         draft.bio.trim(),
      avatarColor: draft.avatarColor,
    })
  }

  const initials = getInitials(draft.name)

  return (
    <ModalBackdrop onClose={onClose}>
      <div
        className="modal-glass w-full max-w-sm"
        style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h2 className="text-sm font-bold" style={{ color: 'var(--t1)' }}>Profile Settings</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg"
            style={{ color: 'var(--t3)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--t1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.background = 'transparent' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* Avatar preview */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
              style={{
                background: draft.avatarColor,
                boxShadow: `0 0 24px ${draft.avatarColor}66`,
                letterSpacing: '-0.02em',
              }}
            >
              {initials}
            </div>

            {/* Color swatches */}
            <div className="flex items-center gap-2">
              {AVATAR_COLORS.map(hex => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => patch('avatarColor', hex)}
                  className="w-6 h-6 rounded-full transition-transform hover:scale-110 shrink-0"
                  style={{
                    background: hex,
                    boxShadow: draft.avatarColor === hex
                      ? `0 0 0 2px rgba(8,10,18,1), 0 0 0 4px ${hex}, 0 0 12px ${hex}88`
                      : `0 0 6px ${hex}44`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="g-label">Display Name</label>
            <input
              autoFocus
              value={draft.name}
              onChange={e => patch('name', e.target.value)}
              placeholder="Your name"
              className="g-input"
            />
          </div>

          {/* Role */}
          <div>
            <label className="g-label">Role / Title</label>
            <input
              value={draft.role}
              onChange={e => patch('role', e.target.value)}
              placeholder="Content Creator"
              className="g-input"
            />
          </div>

          {/* Email */}
          <div>
            <label className="g-label">Email</label>
            <input
              type="email"
              value={draft.email}
              onChange={e => patch('email', e.target.value)}
              placeholder="you@example.com"
              className="g-input"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="g-label">Bio</label>
            <textarea
              value={draft.bio}
              onChange={e => patch('bio', e.target.value)}
              placeholder="A little about you..."
              rows={3}
              className="g-input"
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3.5 flex items-center justify-between shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <button
            onClick={handleSave}
            disabled={!draft.name.trim()}
            className="g-btn-primary"
          >
            Save Changes
          </button>
          <button onClick={onClose} className="g-btn-ghost" style={{ fontSize: '12.5px' }}>
            Cancel
          </button>
        </div>
      </div>
    </ModalBackdrop>
  )
}
