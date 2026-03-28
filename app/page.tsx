"use client"

import { AppProvider } from "@/lib/app-context"
import { AppShell } from "@/components/app-shell"

export default function Home() {
  return (
    <AppProvider>
      <div className="max-w-md mx-auto min-h-screen bg-background shadow-2xl">
        <AppShell />
      </div>
    </AppProvider>
  )
}
