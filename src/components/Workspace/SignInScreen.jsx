import { useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { AVATAR_COLORS, getInitials } from '../../hooks/useWorkspace.js'

export default function SignInScreen({ onSignIn, savedProfile }) {
  const [name,  setName]  = useState(savedProfile?.name  || '')
  const [role,  setRole]  = useState(savedProfile?.role  || '')
  const [email, setEmail] = useState(savedProfile?.email || '')
  const [color, setColor] = useState(savedProfile?.avatarColor || '#7C5CFC')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onSignIn({
      name:        name.trim(),
      role:        role.trim() || 'Content Creator',
      email:       email.trim(),
      avatarColor: color,
    })
  }

  const initials = getInitials(name)

  return (
    <>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="orb orb-violet" />
        <div className="orb orb-cyan" />
        <div className="orb orb-mid" />
        <div className="noise-layer" />
        <div className="grid-layer" />
      </div>

      <div
        className="fixed inset-0 flex items-center justify-center px-4"
        style={{ zIndex: 1 }}
      >
        <div className="w-full max-w-sm">
          <div className="modal-glass" style={{ padding: '36px 32px' }}>

            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #7C5CFC 0%, #4B34C0 100%)',
                  boxShadow: '0 0 20px rgba(124,92,252,0.5)',
                }}
              >
                <Lightbulb size={17} className="text-white" />
              </div>
              <span className="font-bold text-base tracking-tight" style={{ color: 'var(--t1)' }}>
                Algion KB sample
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-bold mb-1"
              style={{ color: 'var(--t1)', fontSize: 22, letterSpacing: '-0.02em', lineHeight: 1.2 }}
            >
              Welcome back.
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--t3)' }}>
              Tell us who you are to get started.
            </p>

            {/* Avatar preview */}
            {name.trim() && (
              <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: color, boxShadow: `0 0 14px ${color}55` }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--t1)' }}>{name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--t3)' }}>{role || 'Content Creator'}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Name */}
              <div>
                <label className="g-label">Your Name</label>
                <input
                  autoFocus
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="g-input"
                />
              </div>

              {/* Role */}
              <div>
                <label className="g-label">Role / Title</label>
                <input
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="Content Creator"
                  className="g-input"
                />
              </div>

              {/* Email */}
              <div>
                <label className="g-label">Email <span style={{ color: 'var(--t3)', textTransform: 'none', letterSpacing: 0, fontSize: 10 }}>(optional)</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="g-input"
                />
              </div>

              {/* Avatar color */}
              <div>
                <label className="g-label">Avatar Color</label>
                <div className="flex items-center gap-2 mt-1">
                  {AVATAR_COLORS.map(hex => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setColor(hex)}
                      className="w-6 h-6 rounded-full transition-transform hover:scale-110 shrink-0"
                      style={{
                        background: hex,
                        boxShadow: color === hex
                          ? `0 0 0 2px rgba(8,10,18,1), 0 0 0 4px ${hex}, 0 0 12px ${hex}88`
                          : `0 0 6px ${hex}44`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!name.trim()}
                className="g-btn-primary"
                style={{ justifyContent: 'center', marginTop: 4 }}
              >
                Enter Workspace →
              </button>
            </form>

            {/* Fine print */}
            <p className="text-center mt-5" style={{ fontSize: 10.5, color: 'var(--t3)' }}>
              No account needed — all data stays in your browser.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
