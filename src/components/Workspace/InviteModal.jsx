import { useState } from 'react'
import { X, Link, Check, UserMinus, Send, AlertCircle } from 'lucide-react'
import ModalBackdrop from '../Modal/ModalBackdrop.jsx'

const ROLE_COLORS = {
  Admin:  { bg: 'rgba(124,92,252,0.18)', color: '#C4B8FF', border: 'rgba(124,92,252,0.3)' },
  Editor: { bg: 'rgba(59,130,246,0.15)', color: '#93C5FD', border: 'rgba(59,130,246,0.28)' },
  Viewer: { bg: 'rgba(255,255,255,0.07)', color: 'var(--t2)',  border: 'rgba(255,255,255,0.12)' },
}

function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return new Date(iso).toLocaleDateString()
}

const emailRe = /.+@.+\..+/

export default function InviteModal({ invites, inviterName, onAdd, onRemove, onClose }) {
  const [email,   setEmail]   = useState('')
  const [role,    setRole]    = useState('Editor')
  const [copied,  setCopied]  = useState(false)
  const [sending, setSending] = useState(false)
  const [error,   setError]   = useState(null)
  const [sentTo,  setSentTo]  = useState(null) // last successfully invited email

  const canInvite = emailRe.test(email) && !sending

  async function handleInvite() {
    if (!canInvite) return
    setError(null)
    setSending(true)
    setSentTo(null)

    try {
      const res = await fetch('/api/invite', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim(), role, inviterName }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
      } else {
        onAdd(email.trim(), role)
        setSentTo(email.trim())
        setEmail('')
        setTimeout(() => setSentTo(null), 4000)
      }
    } catch {
      setError('Could not reach the server. Check your connection.')
    } finally {
      setSending(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

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
          <h2 className="text-sm font-bold" style={{ color: 'var(--t1)' }}>Invite Members</h2>
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
        <div className="modal-body flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Copy invite link */}
          <div
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="text-xs truncate flex-1" style={{ color: 'var(--t3)', fontFamily: 'monospace' }}>
              {window.location.href}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg transition-all"
              style={{
                color:      copied ? '#10B981' : 'var(--t2)',
                background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.06)',
                border:     copied ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {copied ? <Check size={12} /> : <Link size={12} />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

          {/* Email */}
          <div>
            <label className="g-label">Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(null) }}
              onKeyDown={e => { if (e.key === 'Enter') handleInvite() }}
              placeholder="colleague@example.com"
              className="g-input"
              autoFocus
              disabled={sending}
            />
          </div>

          {/* Role */}
          <div>
            <label className="g-label">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="g-select" disabled={sending}>
              <option value="Admin">Admin — full access</option>
              <option value="Editor">Editor — can edit cards</option>
              <option value="Viewer">Viewer — read only</option>
            </select>
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-xs"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--danger)' }}
            >
              <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Success banner */}
          {sentTo && (
            <div
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981' }}
            >
              <Check size={13} style={{ flexShrink: 0 }} />
              Invite sent to <strong>{sentTo}</strong>
            </div>
          )}

          {/* Send button */}
          <button
            onClick={handleInvite}
            disabled={!canInvite}
            className="g-btn-primary w-full"
            style={{ justifyContent: 'center', opacity: sending ? 0.7 : 1 }}
          >
            {sending ? (
              <>
                <span style={{
                  width: 12, height: 12, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Sending…
              </>
            ) : (
              <>
                <Send size={13} />
                Send Invite
              </>
            )}
          </button>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

          {/* Pending invites */}
          <div>
            <label className="g-label">
              Pending Invites
              {invites.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px]"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--t3)' }}>
                  {invites.length}
                </span>
              )}
            </label>

            {invites.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--t3)', marginTop: 6 }}>No pending invites yet.</p>
            ) : (
              <div className="space-y-2">
                {invites.map(invite => {
                  const rc = ROLE_COLORS[invite.role] ?? ROLE_COLORS.Viewer
                  return (
                    <div
                      key={invite.id}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}
                      >
                        {invite.role}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--t1)' }}>{invite.email}</p>
                        <p className="text-[10px]" style={{ color: 'var(--t3)' }}>{relativeTime(invite.invitedAt)}</p>
                      </div>
                      <button
                        onClick={() => onRemove(invite.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg shrink-0 transition-all"
                        style={{ color: 'var(--t3)', background: 'transparent' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.background = 'transparent' }}
                        title="Remove invite"
                      >
                        <UserMinus size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3.5 flex justify-end shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <button onClick={onClose} className="g-btn-ghost" style={{ fontSize: '12.5px' }}>Close</button>
        </div>
      </div>
    </ModalBackdrop>
  )
}
