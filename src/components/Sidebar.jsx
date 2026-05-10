import { useState } from 'react'
import { LayoutGrid, Calendar, BarChart2, Lightbulb, ChevronUp, User, Users, LogOut } from 'lucide-react'
import { getInitials } from '../hooks/useWorkspace.js'

const navItems = [
  { icon: LayoutGrid, label: 'Board' },
  { icon: Calendar,   label: 'Calendar' },
  { icon: BarChart2,  label: 'Analytics' },
]

export default function Sidebar({ activeView, onViewChange, profile, onOpenProfile, onOpenInvite, onSignOut }) {
  const [workspaceOpen, setWorkspaceOpen]     = useState(false)
  const [confirmSignOut, setConfirmSignOut]   = useState(false)

  function toggleWorkspace() {
    setWorkspaceOpen(v => !v)
    setConfirmSignOut(false)
  }

  const initials     = getInitials(profile?.name)
  const displayName  = profile?.name  || 'My Workspace'
  const displayRole  = profile?.role  || 'Content Creator'
  const avatarColor  = profile?.avatarColor || '#7C5CFC'

  const popoverItemStyle = {
    display: 'flex', alignItems: 'center', gap: 9,
    width: '100%', textAlign: 'left',
    padding: '8px 12px',
    fontSize: 12.5, fontWeight: 500,
    color: 'var(--t2)',
    background: 'transparent', border: 'none', cursor: 'pointer',
    transition: 'color 0.15s, background 0.15s',
    fontFamily: 'inherit',
  }

  return (
    <aside
      className="w-56 shrink-0 h-full flex flex-col select-none"
      style={{
        background: 'rgba(6,5,17,0.84)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #7C5CFC 0%, #4B34C0 100%)',
            boxShadow: '0 0 18px rgba(124,92,252,0.5)',
          }}
        >
          <Lightbulb size={15} className="text-white" />
        </div>
        <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--t1)' }}>
          Algion KB sample
        </span>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => onViewChange(label)}
            className={`nav-item ${activeView === label ? 'active' : ''}`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

      {/* Workspace trigger */}
      <button
        onClick={toggleWorkspace}
        className="px-3 py-3.5 flex items-center gap-2.5 w-full text-left transition-all"
        style={{ background: workspaceOpen ? 'rgba(124,92,252,0.08)' : 'transparent' }}
        onMouseEnter={e => { if (!workspaceOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        onMouseLeave={e => { if (!workspaceOpen) e.currentTarget.style.background = 'transparent' }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{
            background: avatarColor,
            boxShadow: `0 0 12px ${avatarColor}72`,
          }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold leading-none truncate" style={{ color: 'var(--t1)' }}>
            {displayName}
          </p>
          <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--t3)' }}>
            {displayRole}
          </p>
        </div>
        <ChevronUp
          size={13}
          style={{
            color: 'var(--t3)',
            transform: workspaceOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Workspace popover */}
      {workspaceOpen && (
        <div
          className="mx-2 mb-2 rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)' }}
        >
          {!confirmSignOut ? (
            <>
              {/* Profile Settings */}
              <button
                style={popoverItemStyle}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--t1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--t2)'; e.currentTarget.style.background = 'transparent' }}
                onClick={() => { onOpenProfile(); toggleWorkspace() }}
              >
                <User size={13} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                Profile Settings
              </button>

              {/* Invite Members */}
              <button
                style={popoverItemStyle}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--t1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--t2)'; e.currentTarget.style.background = 'transparent' }}
                onClick={() => { onOpenInvite(); toggleWorkspace() }}
              >
                <Users size={13} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                Invite Members
              </button>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '2px 0' }} />

              {/* Sign out — first click */}
              <button
                style={{ ...popoverItemStyle, color: 'var(--danger)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                onClick={() => setConfirmSignOut(true)}
              >
                <LogOut size={13} style={{ flexShrink: 0 }} />
                Sign out
              </button>
            </>
          ) : (
            /* Confirm sign-out */
            <div style={{ padding: '12px 12px 10px' }}>
              <p style={{ fontSize: 11.5, color: 'var(--t2)', marginBottom: 10 }}>
                Sign out of Algion KB sample?
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setConfirmSignOut(false)}
                  className="g-btn-ghost"
                  style={{ fontSize: 12, flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  onClick={onSignOut}
                  className="g-btn-danger"
                  style={{ fontSize: 12, flex: 1, justifyContent: 'center' }}
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
