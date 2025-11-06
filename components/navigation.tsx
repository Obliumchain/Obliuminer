"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⚡" },
  { href: "/tasks", label: "Tasks", icon: "📋" },
  { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { href: "/profile", label: "Profile", icon: "👤" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex gap-8 items-center">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`transition-all duration-300 flex items-center gap-2 font-display font-bold cursor-pointer relative hover:scale-105 active:scale-95 ${
                pathname === item.href ? "text-primary" : "text-foreground/60 hover:text-primary"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>

              {pathname === item.href && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
              )}
            </div>
          </Link>
        ))}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-border flex justify-around items-center h-20 z-50">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex-1">
            <div
              className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 cursor-pointer relative h-full justify-center hover:scale-110 active:scale-90 ${
                pathname === item.href ? "text-primary" : "text-foreground/60"
              }`}
            >
              <span className={`text-2xl ${pathname === item.href ? "animate-bounce" : ""}`}>{item.icon}</span>
              <span className="text-xs">{item.label}</span>

              {pathname === item.href && (
                <div
                  className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full bg-primary"
                  style={{ transform: "translateX(-50%)" }}
                />
              )}
            </div>
          </Link>
        ))}
      </nav>
    </>
  )
}
