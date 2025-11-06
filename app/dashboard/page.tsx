"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { LiquidCard } from "@/components/ui/liquid-card"
import { GlowButton } from "@/components/ui/glow-button"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { BackgroundAnimation } from "@/components/background-animation"
import { BoosterShop } from "@/components/booster-shop"

interface UserProfile {
  id: string
  wallet_address: string | null
}

interface ActiveBooster {
  id: string
  name: string
  expires_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [points, setPoints] = useState(45234)
  const [nextClaim, setNextClaim] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000))
  const [obl, setObl] = useState(225)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [activeBoosters, setActiveBoosters] = useState<ActiveBooster[]>([])
  const [showBoosterShop, setShowBoosterShop] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth")
          return
        }

        // Fetch profile
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        setUserProfile(profile)

        // Fetch active boosters (not expired)
        const { data: boosters } = await supabase
          .from("user_boosters")
          .select("id, booster_id, expires_at, boosters(name)")
          .eq("user_id", user.id)
          .gt("expires_at", new Date().toISOString())

        if (boosters) {
          setActiveBoosters(
            boosters.map((b: any) => ({
              id: b.id,
              name: b.boosters?.name || "Unknown",
              expires_at: b.expires_at,
            })),
          )
        }
      } catch (error) {
        console.error("[v0] Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleClaim = () => {
    const newPoints = Math.floor(Math.random() * 500) + 200
    setPoints(points + newPoints)
    setNextClaim(new Date(Date.now() + 4 * 60 * 60 * 1000))
  }

  const handleRefreshBoosters = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: boosters } = await supabase
        .from("user_boosters")
        .select("id, booster_id, expires_at, boosters(name)")
        .eq("user_id", user.id)
        .gt("expires_at", new Date().toISOString())

      if (boosters) {
        setActiveBoosters(
          boosters.map((b: any) => ({
            id: b.id,
            name: b.boosters?.name || "Unknown",
            expires_at: b.expires_at,
          })),
        )
      }
    } catch (error) {
      console.error("[v0] Error refreshing boosters:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-[#0a0015] to-background flex items-center justify-center">
        <BackgroundAnimation />
        <div className="text-primary text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#0a0015] to-background pb-32 lg:pb-8">
      <BackgroundAnimation />

      {/* Header */}
      <div className="relative z-10 sticky top-0 glass-panel backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-display font-bold text-background">Ø</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-primary">OBLIUM</h1>
              <p className="text-xs text-foreground/60">Mining Dashboard</p>
            </div>
          </div>
          <Navigation />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <LiquidCard className="p-8 text-center">
            <div className="text-foreground/60 text-sm mb-2">Total Points</div>
            <div className="text-5xl font-display font-black text-primary mb-2">{points.toLocaleString()}</div>
            <div className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-4" />
          </LiquidCard>

          <LiquidCard className="p-8 text-center">
            <div className="text-foreground/60 text-sm mb-2">OBL Tokens</div>
            <div className="text-5xl font-display font-black text-accent">{obl}</div>
            <div className="h-1 bg-gradient-to-r from-accent to-primary rounded-full mt-4" />
          </LiquidCard>

          <LiquidCard className="p-8 text-center">
            <div className="text-foreground/60 text-sm mb-2">Conversion Status</div>
            <div className="text-lg font-display font-bold text-success mb-4">Active</div>
            <div className="text-xs text-foreground/60">Auto-convert in 14 days</div>
          </LiquidCard>
        </div>

        {/* Mining Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Claim Panel */}
          <LiquidCard className="lg:col-span-2 p-8">
            <h2 className="text-2xl font-display font-bold text-primary mb-6">Mining Panel</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Claim Info */}
              <div>
                <div className="text-foreground/60 text-sm mb-4">Next Claim Available In:</div>
                <CountdownTimer targetTime={nextClaim} />
              </div>

              <div>
                <div className="text-foreground/60 text-sm mb-4">Active Boosters ({activeBoosters.length})</div>
                {activeBoosters.length > 0 ? (
                  <div className="space-y-2">
                    {activeBoosters.map((booster) => (
                      <div
                        key={booster.id}
                        className="flex items-center justify-between p-3 bg-success/10 border border-success/30 rounded-lg"
                      >
                        <span className="text-foreground text-sm">{booster.name}</span>
                        <span className="text-success text-xs font-bold">ACTIVE</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-foreground/5 border border-foreground/10 rounded-lg text-xs text-foreground/60 text-center">
                    No active boosters
                  </div>
                )}
              </div>
            </div>

            {/* Claim Button */}
            <div className="mt-8">
              <GlowButton onClick={handleClaim} className="w-full py-6 text-lg">
                ⚡ Claim Points
              </GlowButton>
            </div>
          </LiquidCard>

          <LiquidCard className="p-8 flex flex-col">
            <h2 className="text-xl font-display font-bold text-secondary mb-6">Boosters</h2>

            <div className="flex-grow mb-6">
              <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg mb-4">
                <div className="text-foreground/60 text-xs mb-1">Price per Booster</div>
                <div className="text-2xl font-display font-bold text-secondary">0.07 SOL</div>
              </div>
              <p className="text-sm text-foreground/60">Unlock mining multipliers and auto-claim features</p>
            </div>

            <GlowButton
              onClick={() => setShowBoosterShop(!showBoosterShop)}
              variant="secondary"
              className="w-full"
              disabled={!userProfile?.wallet_address}
            >
              {showBoosterShop ? "Hide Shop" : "Browse Boosters"}
            </GlowButton>
          </LiquidCard>
        </div>

        {showBoosterShop && (
          <LiquidCard className="p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-primary">Booster Shop</h2>
              <button
                onClick={() => setShowBoosterShop(false)}
                className="text-foreground/60 hover:text-foreground transition"
              >
                ✕
              </button>
            </div>
            <BoosterShop
              walletAddress={userProfile?.wallet_address}
              userId={userProfile?.id}
              onPurchaseSuccess={handleRefreshBoosters}
            />
          </LiquidCard>
        )}

        {/* Wallet & Conversion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiquidCard className="p-8">
            <h2 className="text-xl font-display font-bold text-accent mb-6">Wallet Connection</h2>
            {userProfile?.wallet_address ? (
              <div className="space-y-4">
                <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
                  <div className="text-xs text-foreground/60 mb-1">Connected Address</div>
                  <div className="text-sm font-mono text-accent">
                    {userProfile.wallet_address.slice(0, 6)}...{userProfile.wallet_address.slice(-6)}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-foreground/60 text-sm">Connect your wallet to purchase boosters</p>
            )}
          </LiquidCard>

          <LiquidCard className="p-8">
            <h2 className="text-xl font-display font-bold text-success mb-6">Conversion Schedule</h2>
            <div className="space-y-4">
              <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                <div className="text-sm text-foreground/60 mb-1">Conversion Rate</div>
                <div className="text-2xl font-display font-bold text-success">10,000 Points = 200 OBL</div>
              </div>
              <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                <div className="text-sm text-foreground/60 mb-1">Last Conversion</div>
                <div className="text-lg font-bold text-foreground">14 days ago</div>
              </div>
              <div className="p-2 bg-foreground/5 border border-foreground/10 rounded-lg text-xs text-foreground/60 text-center">
                Automatic conversion every 14 days
              </div>
            </div>
          </LiquidCard>
        </div>
      </div>
    </div>
  )
}
