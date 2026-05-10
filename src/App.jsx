import { useState } from 'react'
import { Plus } from 'lucide-react'
import { COLUMN_IDS } from './data/constants.js'
import { useKanban } from './hooks/useKanban.js'
import { useWorkspace } from './hooks/useWorkspace.js'
import Sidebar from './components/Sidebar.jsx'
import Board from './components/Board/Board.jsx'
import CalendarView from './components/Calendar/CalendarView.jsx'
import AnalyticsView from './components/Analytics/AnalyticsView.jsx'
import AddCardModal from './components/Modal/AddCardModal.jsx'
import CardModal from './components/Modal/CardModal.jsx'
import ProfileModal from './components/Workspace/ProfileModal.jsx'
import InviteModal from './components/Workspace/InviteModal.jsx'
import SignInScreen from './components/Workspace/SignInScreen.jsx'

const VIEW_TITLES = {
  Board:     { title: 'Content Board',    sub: 'Organize your content pipeline' },
  Calendar:  { title: 'Content Calendar', sub: 'Schedule and plan your publishing timeline' },
  Analytics: { title: 'Analytics',        sub: 'Performance overview across all your content' },
}

export default function App() {
  // Hooks must always be called before any conditional return
  const kanban    = useKanban()
  const workspace = useWorkspace()

  const [activeView, setActiveView] = useState('Board')

  // Gate: show sign-in screen when not authenticated
  if (!workspace.isSignedIn) {
    return <SignInScreen onSignIn={workspace.signIn} savedProfile={workspace.profile} />
  }

  const { title, sub } = VIEW_TITLES[activeView]

  return (
    <>
      {/* Fixed ambient background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="orb orb-violet" />
        <div className="orb orb-cyan" />
        <div className="orb orb-mid" />
        <div className="noise-layer" />
        <div className="grid-layer" />
      </div>

      <div className="relative flex h-screen overflow-hidden" style={{ zIndex: 1 }}>
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          profile={workspace.profile}
          onOpenProfile={() => workspace.openModal('profile')}
          onOpenInvite={() => workspace.openModal('invite')}
          onSignOut={workspace.signOut}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header
            className="px-6 py-3.5 flex items-center justify-between shrink-0"
            style={{
              background: 'rgba(8,10,18,0.65)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div>
              <h1 className="text-sm font-bold tracking-tight" style={{ color: 'var(--t1)' }}>
                {title}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--t3)' }}>{sub}</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  color: 'var(--t3)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {kanban.cards.filter(c => COLUMN_IDS.includes(c.column)).length} cards
              </span>
              <button
                onClick={() => kanban.openAddModal('ideas')}
                className="g-btn-primary"
                style={{ padding: '7px 14px', fontSize: '12.5px' }}
              >
                <Plus size={13} />
                New Content
              </button>
            </div>
          </header>

          {activeView === 'Board'     && <Board kanban={kanban} />}
          {activeView === 'Calendar'  && <CalendarView cards={kanban.cards} onOpenCard={kanban.openCardModal} />}
          {activeView === 'Analytics' && <AnalyticsView cards={kanban.cards} onOpenCard={kanban.openCardModal} />}
        </div>
      </div>

      {/* Kanban modals */}
      {kanban.modalState.type === 'add' && (
        <AddCardModal
          defaultColumn={kanban.modalState.defaultColumn}
          onAdd={(columnId, data) => { kanban.addCard(columnId, data); kanban.closeModal() }}
          onClose={kanban.closeModal}
        />
      )}
      {kanban.modalState.type === 'view' && kanban.modalState.cardId && (
        <CardModal
          card={kanban.getCard(kanban.modalState.cardId)}
          onUpdate={(patch) => kanban.updateCard(kanban.modalState.cardId, patch)}
          onDelete={() => { kanban.deleteCard(kanban.modalState.cardId); kanban.closeModal() }}
          onClose={kanban.closeModal}
        />
      )}

      {/* Workspace modals */}
      {workspace.activeModal === 'profile' && (
        <ProfileModal
          profile={workspace.profile}
          onSave={(patch) => { workspace.updateProfile(patch); workspace.closeModal() }}
          onClose={workspace.closeModal}
        />
      )}
      {workspace.activeModal === 'invite' && (
        <InviteModal
          invites={workspace.invites}
          inviterName={workspace.profile.name}
          onAdd={workspace.addInvite}
          onRemove={workspace.removeInvite}
          onClose={workspace.closeModal}
        />
      )}
    </>
  )
}
