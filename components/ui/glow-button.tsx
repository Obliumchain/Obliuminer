import type React from "react"

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
}

export function GlowButton({ children, variant = "primary", className = "", ...props }: GlowButtonProps) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    ghost: "px-4 py-2 rounded-lg transition-all duration-200 hover:bg-foreground/10 active:scale-95",
  }

  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
