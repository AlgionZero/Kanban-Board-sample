import { useEffect } from 'react'

export default function ModalBackdrop({ onClose, children }) {
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 50,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {children}
    </div>
  )
}
