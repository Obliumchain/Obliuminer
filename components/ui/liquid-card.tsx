import type React from "react"

interface LiquidCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "default" | "elevated" | "muted"
}

export function LiquidCard({ children, className = "", variant = "default", ...props }: LiquidCardProps) {
  const variants = {
    default: "card-modern p-6",
    elevated: "card-modern p-6 shadow-xl shadow-primary/5 border-primary/20",
    muted: "card-modern p-6 bg-background/50 border-border/50",
  }

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}
