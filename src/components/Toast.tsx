'use client'
// src/components/Toast.tsx
import { useEffect } from 'react'

export default function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t) }, [])
  return (
    <div className="toast">
      <span className="toast-ic">✓</span>{msg}
    </div>
  )
}
