"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { LiquidCard } from "@/components/ui/liquid-card"
import { BackgroundAnimation } from "@/components/background-animation"

interface LeaderboardEntry {
  rank: number
  username: string
  points: number
  referrals: number
}

export default function LeaderboardPage() {
  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, username: "SolanaMiner", points: 1250000, referrals: 45 },
    { rank: 2, username: "CryptoKing", points: 1100000, referrals: 38 },
    { rank: 3, username: "BlockchainPro", points: 950000, referrals: 32 },
    { rank: 4, username: "MinerX", points: 850000, referrals: 28 },
    { rank: 5, username: "TokenHunter", points: 750000, referrals: 24 },
    { rank: 6, username: "VaultKeeper", points: 680000, referrals: 20 },
    { rank: 7, username: "DigitalAscend", points: 620000, referrals: 18 },
    { rank: 8, username: "FutureTrader", points: 550000, referrals: 15 },
    { rank: 9, username: "QuantumLeap", points: 480000, referrals: 12 },
    { rank: 10, username: "NovaStrike", points: 420000, referrals: 10 },
  ])

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600"
    if (rank === 2) return "from-gray-300 to-gray-500"
    if (rank === 3) return "from-orange-400 to-orange-600"
    return "from-primary to-accent"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
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
              <h1 className="font-display font-bold text-primary">Global Leaderboard</h1>
              <p className="text-xs text-foreground/60">Top miners by points and referrals</p>
            </div>
          </div>
          <Navigation />
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top 3 Podium */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" variants={itemVariants}>
          {leaderboard.slice(0, 3).map((entry, i) => (
            <motion.div key={entry.rank} custom={i} variants={itemVariants} whileHover={{ y: -10 }}>
              <LiquidCard className={`p-8 text-center relative overflow-hidden`}>
                {/* Medal Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getRankColor(entry.rank)} opacity-10 blur-3xl`} />

                <motion.div
                  className="relative z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2, type: "spring" }}
                >
                  {/* Medal */}
                  <div className="text-5xl mb-4">{entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}</div>

                  {/* Rank */}
                  <div
                    className={`text-lg font-display font-bold mb-2 bg-gradient-to-r ${getRankColor(entry.rank)} bg-clip-text text-transparent`}
                  >
                    #{entry.rank}
                  </div>

                  {/* Username */}
                  <h3 className="text-2xl font-display font-bold text-foreground mb-4">{entry.username}</h3>

                  {/* Points */}
                  <div className="mb-4">
                    <div className="text-foreground/60 text-xs mb-1">Points</div>
                    <div className="text-3xl font-display font-black text-primary">
                      {(entry.points / 1000).toFixed(0)}K
                    </div>
                  </div>

                  {/* Referrals */}
                  <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
                    <div className="text-foreground/60 text-xs mb-1">Referrals</div>
                    <div className="text-xl font-display font-bold text-accent">{entry.referrals}</div>
                  </div>
                </motion.div>
              </LiquidCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div variants={itemVariants}>
          <LiquidCard className="p-8 overflow-x-auto">
            <h2 className="text-2xl font-display font-bold text-primary mb-6">Full Rankings</h2>

            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-display font-bold text-foreground/60 text-sm">Rank</th>
                  <th className="text-left py-4 px-4 font-display font-bold text-foreground/60 text-sm">Miner</th>
                  <th className="text-right py-4 px-4 font-display font-bold text-foreground/60 text-sm">Points</th>
                  <th className="text-right py-4 px-4 font-display font-bold text-foreground/60 text-sm">Referrals</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <motion.tr
                    key={entry.rank}
                    custom={index}
                    variants={itemVariants}
                    className="border-b border-border/50 hover:bg-primary/5 transition-colors duration-300 group"
                  >
                    <td className="py-4 px-4">
                      <div className="font-display font-bold text-primary text-lg">#{entry.rank}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-background">
                          {entry.username[0]}
                        </div>
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {entry.username}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-display font-bold text-primary">{(entry.points / 1000).toFixed(0)}K</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-accent">{entry.referrals}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </LiquidCard>
        </motion.div>
      </motion.div>
    </div>
  )
}
