'use client'

import LoadingScreen from '@/components/layout/loading-screen'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return
    
    if (session) {
      redirect('/dashboard')
    } else {
      redirect('/login')
    }
  }, [session, status])

  // Loading state while checking authentication
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingScreen />
    </div>
  )
}