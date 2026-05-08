"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", testId: "nav-dashboard" },
  { href: "/tasks", label: "Tasks", testId: "nav-tasks" },
  { href: "/map", label: "Map", testId: "nav-map" },
  { href: "/feed", label: "Feed", testId: "nav-feed" },
  { href: "/album", label: "Album", testId: "nav-album" },
  { href: "/settings", label: "Settings", testId: "nav-settings" },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-[var(--color-border)] bg-[var(--color-surface)] fixed inset-y-0 left-0 top-0 z-30">
        <div className="flex items-center gap-3 p-5 border-b border-[var(--color-border)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-semibold text-[var(--color-text-primary)]">Neo</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-testid={item.testId}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-[var(--color-accent-muted)] text-[var(--color-accent-hover)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-[var(--color-border)]">
          <form action={signOut}>
            <Button variant="ghost" type="submit" className="w-full justify-start text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]" data-testid="btn-logout">
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[var(--color-surface)] border-t border-[var(--color-border)] pb-safe">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-testid={item.testId}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-colors min-w-[56px]",
                pathname === item.href
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)]"
              )}
            >
              <span className="text-base">{item.label.charAt(0)}</span>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 lg:ml-60 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  )
}
