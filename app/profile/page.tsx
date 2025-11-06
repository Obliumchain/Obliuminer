"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { Navigation } from "@/components/navigation"
import { LiquidCard } from "@/components/ui/liquid-card"
import { GlowButton } from "@/components/ui/glow-button"
import { BackgroundAnimation } from "@/components/background-animation"
import type { WalletInfo } from "@/lib/wallet/wallet-adapter"

interface UserProfile {
  nickname: string
  created_at: string
  wallet_address: string | null
  referral_code: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
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
        .select("nickname, created_at, wallet_address, referral_code")
        .eq("id", user.id)
        .single()

      if (profileData) {
        setProfile(profileData as UserProfile)
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
        <div className="text-primary text-lg">Loading profile...</div>
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
              <span className="text-lg font-display font-bold text-background">
                {profile?.nickname?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h1 className="font-display font-bold text-primary">Profile</h1>
              <p className="text-xs text-foreground/60">Your mining journey</p>
            </div>
          </div>
          <Navigation />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <LiquidCard className="p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/50">
            <span className="text-5xl font-display font-bold text-background">
              {profile?.nickname?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-2">{profile?.nickname || "Miner"}</h2>
          {profile?.created_at && (
            <p className="text-foreground/60">
              Member since{" "}
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
          {[
            { label: "Total Points", value: "245,680", color: "from-primary to-accent" },
            { label: "OBL Tokens", value: "612", color: "from-accent to-primary" },
            { label: "Referrals", value: "28", color: "from-secondary to-primary" },
            { label: "Rank", value: "#487", color: "from-success to-accent" },
          ].map((stat, i) => (
            <LiquidCard key={i} className="p-6 text-center">
              <div className="text-foreground/60 text-sm mb-2">{stat.label}</div>
              <div
                className={`text-3xl font-display font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
            </LiquidCard>
          ))}
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

          {/* Referral Code */}
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

        {/* Conversion History */}
        <LiquidCard className="p-8">
          <h3 className="text-xl font-display font-bold text-success mb-6">Conversion History</h3>

          <div className="space-y-3">
            {[
              { date: "2 weeks ago", points: "10,000", obl: "200", status: "Completed" },
              { date: "4 weeks ago", points: "10,000", obl: "200", status: "Completed" },
              { date: "6 weeks ago", points: "9,800", obl: "196", status: "Completed" },
              { date: "Next conversion in 10 days", points: "pending", obl: "~200", status: "Pending" },
            ].map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-success/5 border border-success/20 rounded-lg hover:border-success/40 transition-all duration-300"
              >
                <div className="flex-1">
                  <div className="font-bold text-foreground">{entry.date}</div>
                  <div className="text-sm text-foreground/60">
                    {entry.points} Points → {entry.obl} OBL
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg font-bold text-sm ${
                    entry.status === "Completed" ? "bg-success/20 text-success" : "bg-foreground/5 text-foreground/60"
                  }`}
                >
                  {entry.status}
                </div>
              </div>
            ))}
          </div>
        </LiquidCard>
      </div>
    </div>
  )
}
