const STORAGE_KEY    = 'content-kanban-v1'
const WORKSPACE_KEY  = 'content-workspace-v1'
const INVITES_KEY    = 'content-invites-v1'
const AUTH_KEY       = 'content-auth-v1'

export function loadBoard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function loadWorkspace() {
  try { const r = localStorage.getItem(WORKSPACE_KEY); return r ? JSON.parse(r) : null } catch { return null }
}
export function saveWorkspace(profile) {
  try { localStorage.setItem(WORKSPACE_KEY, JSON.stringify(profile)) } catch {}
}

export function loadInvites() {
  try { const r = localStorage.getItem(INVITES_KEY); return r ? JSON.parse(r) : [] } catch { return [] }
}
export function saveInvites(arr) {
  try { localStorage.setItem(INVITES_KEY, JSON.stringify(arr)) } catch {}
}

export function loadAuth() {
  try { const r = localStorage.getItem(AUTH_KEY); return r ? JSON.parse(r) : { isSignedIn: false } } catch { return { isSignedIn: false } }
}
export function saveAuth(obj) {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(obj)) } catch {}
}

export function saveBoard(cards) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded — board not saved')
    }
  }
}
