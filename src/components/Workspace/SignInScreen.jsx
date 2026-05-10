import { useState } from 'react'
import { Lightbulb, Eye, EyeOff } from 'lucide-react'
import { AVATAR_COLORS, getInitials } from '../../hooks/useWorkspace.js'

export default function SignInScreen({ onLogin, onSignUp, hasAccount, savedProfile }) {
  const [tab, setTab] = useState(hasAccount ? 'login' : 'signup')

  // Login state
  const [loginName, setLoginName]     = useState(savedProfile?.name || '')
  const [loginPw, setLoginPw]         = useState('')
  const [loginError, setLoginError]   = useState(null)
  const [showLoginPw, setShowLoginPw] = useState(false)

  // Sign-up state
  const [name,      setName]      = useState(hasAccount ? '' : (savedProfile?.name  || ''))
  const [role,      setRole]      = useState(hasAccount ? '' : (savedProfile?.role  || ''))
  const [email,     setEmail]     = useState(hasAccount ? '' : (savedProfile?.email || ''))
  const [color,     setColor]     = useState(savedProfile?.avatarColor || '#7C5CFC')
  const [password,  setPassword]  = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw,    setShowPw]    = useState(false)
  const [signupErr, setSignupErr] = useState(null)

  const initials = getInitials(name)

  function handleLogin(e) {
    e.preventDefault()
    if (!loginName.trim() || !loginPw) return
    const err = onLogin(loginName, loginPw)
    if (err) setLoginError(err)
  }

  function handleSignUp(e) {
    e.preventDefault()
    if (!name.trim() || !password) return
    if (password.length < 4) { setSignupErr('Password must be at least 4 characters.'); return }
    if (password !== confirmPw) { setSignupErr('Passwords do not match.'); return }
    onSignUp({ name: name.trim(), role: role.trim() || 'Content Creator', email: email.trim(), avatarColor: color }, password)
  }

  function switchTab(t) {
    setTab(t)
    setLoginError(null)
    setSignupErr(null)
  }

  return (
    <>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="orb orb-violet" />
        <div className="orb orb-cyan" />
        <div className="orb orb-mid" />
        <div className="noise-layer" />
        <div className="grid-layer" />
      </div>

      <div className="fixed inset-0 flex items-center justify-center px-4" style={{ zIndex: 1 }}>
        <div className="w-full max-w-sm">
          <div className="modal-glass" style={{ padding: '32px 28px', maxHeight: '94vh', overflowY: 'auto' }}>

            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-6">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #7C5CFC 0%, #4B34C0 100%)', boxShadow: '0 0 20px rgba(124,92,252,0.5)' }}
              >
                <Lightbulb size={17} className="text-white" />
              </div>
              <span className="font-bold text-base tracking-tight" style={{ color: 'var(--t1)' }}>
                Algion KB sample
              </span>
            </div>

            {/* Tab switcher */}
            <div
              className="flex mb-6 p-1 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {[{ id: 'login', label: 'Sign In' }, { id: 'signup', label: 'New User' }].map(t => (
                <button
                  key={t.id}
                  onClick={() => switchTab(t.id)}
                  className="flex-1 text-xs font-semibold py-2 rounded-lg transition-all"
                  style={{
                    background:  tab === t.id ? 'rgba(124,92,252,0.22)' : 'transparent',
                    color:       tab === t.id ? '#C4B8FF' : 'var(--t3)',
                    border:      tab === t.id ? '1px solid rgba(124,92,252,0.3)' : '1px solid transparent',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'login' ? (
              /* ── LOGIN ── */
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <h1 className="font-bold mb-1" style={{ color: 'var(--t1)', fontSize: 20, letterSpacing: '-0.02em' }}>
                    Welcome back.
                  </h1>
                  <p className="text-sm mb-2" style={{ color: 'var(--t3)' }}>Sign in to your workspace.</p>
                </div>

                <div>
                  <label className="g-label">Screen Name</label>
                  <input
                    autoFocus
                    value={loginName}
                    onChange={e => { setLoginName(e.target.value); setLoginError(null) }}
                    placeholder="Your display name"
                    className="g-input"
                  />
                </div>

                <div>
                  <label className="g-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showLoginPw ? 'text' : 'password'}
                      value={loginPw}
                      onChange={e => { setLoginPw(e.target.value); setLoginError(null) }}
                      placeholder="••••••••"
                      className="g-input"
                      style={{ paddingRight: 38 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPw(v => !v)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                    >
                      {showLoginPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: -4 }}>{loginError}</p>
                )}

                <button
                  type="submit"
                  disabled={!loginName.trim() || !loginPw}
                  className="g-btn-primary"
                  style={{ justifyContent: 'center', marginTop: 4 }}
                >
                  Sign In →
                </button>

                <p className="text-center" style={{ fontSize: 11, color: 'var(--t3)' }}>
                  New here?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('signup')}
                    style={{ color: '#C4B8FF', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 11 }}
                  >
                    Create an account
                  </button>
                </p>
              </form>
            ) : (
              /* ── SIGN UP ── */
              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <h1 className="font-bold mb-1" style={{ color: 'var(--t1)', fontSize: 20, letterSpacing: '-0.02em' }}>
                    Create your account.
                  </h1>
                  <p className="text-sm mb-2" style={{ color: 'var(--t3)' }}>
                    All data stays in your browser — no server account needed.
                  </p>
                </div>

                {/* Avatar preview */}
                {name.trim() && (
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
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

                <div>
                  <label className="g-label">Screen Name</label>
                  <input
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="g-input"
                  />
                </div>

                <div>
                  <label className="g-label">Role / Title</label>
                  <input
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="Content Creator"
                    className="g-input"
                  />
                </div>

                <div>
                  <label className="g-label">
                    Email{' '}
                    <span style={{ color: 'var(--t3)', textTransform: 'none', letterSpacing: 0, fontSize: 10 }}>(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="g-input"
                  />
                </div>

                <div>
                  <label className="g-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setSignupErr(null) }}
                      placeholder="At least 4 characters"
                      className="g-input"
                      style={{ paddingRight: 38 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                    >
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="g-label">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPw}
                    onChange={e => { setConfirmPw(e.target.value); setSignupErr(null) }}
                    placeholder="Re-enter password"
                    className="g-input"
                  />
                </div>

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

                {signupErr && (
                  <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: -4 }}>{signupErr}</p>
                )}

                <button
                  type="submit"
                  disabled={!name.trim() || !password || !confirmPw}
                  className="g-btn-primary"
                  style={{ justifyContent: 'center', marginTop: 4 }}
                >
                  Create Account →
                </button>

                {hasAccount && (
                  <p className="text-center" style={{ fontSize: 11, color: 'var(--t3)' }}>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchTab('login')}
                      style={{ color: '#C4B8FF', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 11 }}
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
