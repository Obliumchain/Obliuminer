"use client"

import { useState } from "react"
import {
  connectPhantomWallet,
  disconnectPhantomWallet,
  formatWalletAddress,
  type WalletInfo,
} from "@/lib/wallet/wallet-adapter"
import { GlowButton } from "@/components/ui/glow-button"

interface WalletConnectButtonProps {
  onConnect?: (wallet: WalletInfo) => void
  onDisconnect?: () => void
  walletAddress?: string | null
  variant?: "primary" | "accent" | "secondary"
}

export function WalletConnectButton({
  onConnect,
  onDisconnect,
  walletAddress,
  variant = "primary",
}: WalletConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const wallet = await connectPhantomWallet()
      if (wallet) {
        onConnect?.(wallet)
      } else {
        setError("Failed to connect wallet. Please try again.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    try {
      await disconnectPhantomWallet()
      onDisconnect?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Disconnection failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (walletAddress) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 px-4 py-3 bg-background/50 border border-primary/30 rounded-lg">
            <div className="text-xs text-foreground/60 mb-1">Connected Wallet</div>
            <div className="text-sm font-mono text-primary">{formatWalletAddress(walletAddress)}</div>
          </div>
          <GlowButton onClick={handleDisconnect} disabled={isLoading} variant={variant} className="px-6">
            {isLoading ? "..." : "Disconnect"}
          </GlowButton>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <GlowButton onClick={handleConnect} disabled={isLoading} variant={variant} className="w-full">
        {isLoading ? "Connecting..." : "Connect Phantom Wallet"}
      </GlowButton>
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
