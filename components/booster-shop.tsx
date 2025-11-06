"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { LiquidCard } from "@/components/ui/liquid-card"
import { GlowButton } from "@/components/ui/glow-button"

interface Booster {
  id: string
  name: string
  description: string
  type: string
  multiplier_value: number
  duration_hours: number
  price_sol: number
}

interface BoosterShopProps {
  walletAddress?: string | null
  userId?: string
  onPurchaseSuccess?: () => void
}

export function BoosterShop({ walletAddress, userId, onPurchaseSuccess }: BoosterShopProps) {
  const [boosters, setBoosters] = useState<Booster[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBoosters = async () => {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase.from("boosters").select("*").eq("active", true)

        if (fetchError) throw fetchError
        setBoosters(data || [])
      } catch (err) {
        console.error("[v0] Error loading boosters:", err)
        setError("Failed to load boosters")
      } finally {
        setIsLoading(false)
      }
    }

    loadBoosters()
  }, [])

  const handlePurchaseBooster = async (booster: Booster) => {
    if (!walletAddress) {
      setError("Please connect your wallet first")
      return
    }

    if (!userId) {
      setError("User not authenticated")
      return
    }

    setIsPurchasing(booster.id)
    setError(null)

    try {
      const { solana } = window as any

      if (!solana?.isPhantom) {
        throw new Error("Phantom wallet not found")
      }

      // TODO: Integrate with createBoosterPurchaseTransaction from lib/solana/transfer-token.ts
      // For now, simulate a successful transaction
      const mockTxHash = "SimulatedTxHash_" + Date.now()

      // Record purchase in database
      const response = await fetch("/api/boosters/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          boosterId: booster.id,
          walletTxHash: mockTxHash,
          amountSol: booster.price_sol,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Purchase failed")
      }

      setError(null)
      onPurchaseSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Purchase failed"
      console.error("[v0] Purchase error:", err)
      setError(message)
    } finally {
      setIsPurchasing(null)
    }
  }

  if (isLoading) {
    return <div className="text-foreground/60">Loading boosters...</div>
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boosters.map((booster) => (
          <LiquidCard key={booster.id} className="p-6 flex flex-col">
            <div className="flex-grow mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-foreground">{booster.name}</h3>
                {booster.multiplier_value > 1 && (
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded">
                    {booster.multiplier_value}x
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground/60 mb-4">{booster.description}</p>
              <div className="space-y-2 text-xs text-foreground/50">
                <p>Duration: {booster.duration_hours}h</p>
                <p>Type: {booster.type}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-foreground/60 text-sm">Price</span>
                <span className="font-display font-bold text-primary">{booster.price_sol} SOL</span>
              </div>

              <GlowButton
                onClick={() => handlePurchaseBooster(booster)}
                disabled={isPurchasing === booster.id || !walletAddress}
                className="w-full"
              >
                {isPurchasing === booster.id ? "Processing..." : "Buy Now"}
              </GlowButton>
            </div>
          </LiquidCard>
        ))}
      </div>
    </div>
  )
}
