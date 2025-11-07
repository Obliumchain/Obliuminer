"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { Navigation } from "@/components/navigation"
import { LiquidCard } from "@/components/ui/liquid-card"
import { GlowButton } from "@/components/ui/glow-button"
import { BackgroundAnimation } from "@/components/background-animation"
import { CubeLoader } from "@/components/ui/cube-loader"
import type { WalletInfo } from "@/lib/wallet/wallet-adapter"

interface UserProfile {
  nickname: string
  created_at: string
  wallet_address: string | null
  referral_code: string
  points: number
}

interface UserStats {
  totalPoints: number
  oblTokens: number
  referralCount: number
  rank: number
  totalUsers: number
}

interface ConversionRecord {
  id: string
  points_converted: number
  obl_tokens_received: number
  status: string
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [conversions, setConversions] = useState<ConversionRecord[]>([])
  const [referralCopied, setReferralCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth")
        return
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("nickname, created_at, wallet_address, referral_code, points")
        .eq("id", user.id)
        .single()

      if (profileData) {
        setProfile(profileData as UserProfile)

        const oblTokens = Math.floor(profileData.points / 10000) * 200

        const { count: referralCount } = await supabase
          .from("referrals")
          .select("*", { count: "exact", head: true })
          .eq("referrer_id", user.id)

        const { data: allUsers } = await supabase
          .from("profiles")
          .select("id, points")
          .order("points", { ascending: false })

        let userRank = 0
        const totalUsers = allUsers?.length || 0

        if (allUsers) {
          userRank = allUsers.findIndex((u) => u.id === user.id) + 1
        }

        setStats({
          totalPoints: profileData.points || 0,
          oblTokens,
          referralCount: referralCount || 0,
          rank: userRank,
          totalUsers,
        })

        const { data: conversionData } = await supabase
          .from("conversion_history")
          .select("id, points_converted, obl_tokens_received, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10)

        setConversions(conversionData || [])
      }
      setIsLoading(false)
    }

    loadProfile()
  }, [router])

  const copyReferral = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code)
      setReferralCopied(true)
      setTimeout(() => setReferralCopied(false), 2000)
    }
  }

  const handleWalletConnect = async (wallet: WalletInfo) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase
        .from("profiles")
        .update({
          wallet_address: wallet.address,
          wallet_type: wallet.type,
          wallet_connected_at: wallet.connected_at,
        })
        .eq("id", user.id)

      setProfile((prev) => (prev ? { ...prev, wallet_address: wallet.address } : null))
    }
  }

  const handleWalletDisconnect = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase
        .from("profiles")
        .update({
          wallet_address: null,
          wallet_type: null,
          wallet_connected_at: null,
        })
        .eq("id", user.id)

      setProfile((prev) => (prev ? { ...prev, wallet_address: null } : null))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-[#0a0015] to-background flex items-center justify-center">
        <BackgroundAnimation />
        <CubeLoader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#0a0015] to-background pb-32 lg:pb-8">
      <BackgroundAnimation />

      <div className="relative z-10">
        <Navigation />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-primary mb-2">Profile</h1>
          <p className="text-foreground/60">Your mining journey</p>
        </div>

        <LiquidCard className="p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/50">
            <span className="text-5xl font-display font-bold text-background">
              {profile?.nickname?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-3">{profile?.nickname || "Miner"}</h2>
          {profile?.created_at && (
            <p className="text-foreground/60">
              Joined{" "}
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </LiquidCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LiquidCard className="p-6 text-center">
            <div className="text-foreground/60 text-sm mb-2">Total Points</div>
            <div className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {stats?.totalPoints.toLocaleString() || "0"}
            </div>
          </LiquidCard>

          <LiquidCard className="p-6 text-center">
            <div className="text-foreground/60 text-sm mb-2">OBL Tokens</div>
            <div className="text-3xl font-display font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              {stats?.oblTokens || "0"}
            </div>
          </LiquidCard>

          <LiquidCard className="p-6 text-center">
            <div className="text-foreground/60 text-sm mb-2">Referrals</div>
            <div className="text-3xl font-display font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              {stats?.referralCount || "0"}
            </div>
          </LiquidCard>

          <LiquidCard className="p-6 text-center">
            <div className="text-foreground/60 text-sm mb-2">Rank</div>
            <div className="text-3xl font-display font-bold bg-gradient-to-r from-success to-accent bg-clip-text text-transparent">
              #{stats?.rank || "0"}
            </div>
            {stats && <div className="text-xs text-foreground/60 mt-1">of {stats.totalUsers} users</div>}
          </LiquidCard>
        </div>

        {/* Wallet & Referral */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiquidCard className="p-8">
            <h3 className="text-xl font-display font-bold text-primary mb-6">Connect Wallet</h3>
            <WalletConnectButton
              walletAddress={profile?.wallet_address}
              onConnect={handleWalletConnect}
              onDisconnect={handleWalletDisconnect}
              variant="primary"
            />
            <p className="text-xs text-foreground/50 mt-4">
              Connect your Solana wallet to claim rewards and convert points to tokens.
            </p>
          </LiquidCard>

          <LiquidCard className="p-8">
            <h3 className="text-xl font-display font-bold text-accent mb-6">Your Referral Code</h3>
            <div className="p-4 bg-background/50 border border-accent/30 rounded-lg mb-4">
              <div className="text-xs text-foreground/60 mb-2">Share this code with friends</div>
              <div className="text-lg font-display font-bold text-accent">{profile?.referral_code || "Loading..."}</div>
            </div>
            <GlowButton onClick={copyReferral} className="w-full" variant="accent">
              {referralCopied ? "✓ Copied!" : "Copy Code"}
            </GlowButton>
          </LiquidCard>
        </div>

        <LiquidCard className="p-8">
          <h3 className="text-xl font-display font-bold text-success mb-6">Conversion History</h3>

          {conversions.length === 0 ? (
            <div className="text-center py-8 text-foreground/60">
              <p>No conversions yet</p>
              <p className="text-sm mt-2">Points are automatically converted to OBL tokens every 30 days</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversions.map((conversion) => (
                <div
                  key={conversion.id}
                  className="flex items-center justify-between p-4 bg-success/5 border border-success/20 rounded-lg hover:border-success/40 transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="font-bold text-foreground">
                      {new Date(conversion.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm text-foreground/60">
                      {conversion.points_converted.toLocaleString()} Points → {conversion.obl_tokens_received} OBL
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg font-bold text-sm ${
                      conversion.status === "completed"
                        ? "bg-success/20 text-success"
                        : conversion.status === "pending"
                          ? "bg-foreground/5 text-foreground/60"
                          : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {conversion.status.charAt(0).toUpperCase() + conversion.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </LiquidCard>
      </div>
    </div>
  )
}
