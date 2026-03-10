'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

function AcceptPageContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (token) {
      fetch('/api/couples/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then((res) => {
          if (res.ok) setStatus('success')
          else setStatus('error')
        })
        .catch(() => setStatus('error'))
    }
  }, [token])

  if (!token) return <div className="p-8 text-center">Invalid invitation link.</div>
  if (status === 'loading') return <div className="p-8 text-center">Accepting invitation...</div>
  if (status === 'error') return <div className="p-8 text-center">Something went wrong. Please try again.</div>

  return <div className="p-8 text-center text-green-500 font-semibold">Invitation accepted! You are now connected.</div>
}

export default function AcceptPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AcceptPageContent />
    </Suspense>
  )
}
