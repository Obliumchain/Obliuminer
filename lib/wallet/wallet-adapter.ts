// Wallet connection utilities for Solana and other blockchain wallets

export interface WalletInfo {
  address: string
  type: "phantom" | "metamask" | "solflare" | "ledger"
  connected_at: string
}

export async function connectPhantomWallet(): Promise<WalletInfo | null> {
  try {
    const { solana } = window as any

    if (!solana?.isPhantom) {
      throw new Error("Phantom wallet not installed. Please install it from https://phantom.app")
    }

    const response = await solana.connect()
    return {
      address: response.publicKey.toString(),
      type: "phantom",
      connected_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error("[v0] Phantom connection error:", error)
    return null
  }
}

export async function disconnectPhantomWallet(): Promise<void> {
  try {
    const { solana } = window as any
    if (solana?.isPhantom) {
      await solana.disconnect()
    }
  } catch (error) {
    console.error("[v0] Phantom disconnection error:", error)
  }
}

export function formatWalletAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}

export function getWalletExplorerUrl(address: string, type = "phantom"): string {
  return `https://solscan.io/account/${address}`
}
