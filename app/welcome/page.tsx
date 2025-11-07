"use client"

import Link from "next/link"
import Image from "next/image"
import { GlowButton } from "@/components/ui/glow-button"
import { BackgroundAnimation } from "@/components/background-animation"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#0a0015] to-background overflow-hidden">
      <BackgroundAnimation />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center animate-fade-in">
          {/* Logo */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: "0s" }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image src="/logo.png" alt="Oblium Logo" width={100} height={100} className="drop-shadow-2xl" />
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              OBLIUM
            </h1>
          </div>

          {/* Tagline */}
          <div className="mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-xl md:text-3xl font-display mb-4 text-foreground/80">Mine. Earn. Ascend.</h2>
            <p className="text-lg text-foreground/60 max-w-xl mx-auto leading-relaxed">
              Enter the future of crypto mining. Accumulate points through dedicated mining, complete tasks, and convert
              them to OBL tokens on the Solana blockchain.
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link href="/auth">
              <GlowButton>Start Mining</GlowButton>
            </Link>
            <button className="px-8 py-4 text-lg font-display font-bold rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300">
              Learn More
            </button>
          </div>

          {/* Features Grid */}
          <div
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            {[
              { icon: "⛏️", title: "Mine Points", desc: "Claim every 4 hours" },
              { icon: "🎯", title: "Earn Rewards", desc: "Complete tasks & referrals" },
              { icon: "✨", title: "Convert to OBL", desc: "Every 30 days automatically" },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-panel p-6 group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 rounded-3xl"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-display font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground/60 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
