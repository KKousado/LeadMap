'use client'
import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import MobileTabBar from '@/components/layout/MobileTabBar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--background)]">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</div>
      </main>

      {/* Floating Bottom Tab Bar - Mobile */}
      <MobileTabBar />
    </div>
  )
}
