"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { LiquidCard } from "@/components/ui/liquid-card"
import { GlowButton } from "@/components/ui/glow-button"
import { BackgroundAnimation } from "@/components/background-animation"

interface Task {
  id: number
  icon: string
  title: string
  description: string
  reward: number
  completed: boolean
  type: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      icon: "𝕏",
      title: "Follow on X",
      description: "Follow Oblium on X (Twitter)",
      reward: 100,
      completed: false,
      type: "social",
    },
    {
      id: 2,
      icon: "💬",
      title: "Join Discord",
      description: "Join our community Discord server",
      reward: 150,
      completed: true,
      type: "social",
    },
    {
      id: 3,
      icon: "🔗",
      title: "Share Referral",
      description: "Share your referral link with friends",
      reward: 200,
      completed: false,
      type: "referral",
    },
    {
      id: 4,
      icon: "⭐",
      title: "Daily Check-in",
      description: "Check in daily for bonus points",
      reward: 50,
      completed: false,
      type: "daily",
    },
    {
      id: 5,
      icon: "🚀",
      title: "Ambassador Mission",
      description: "Complete special ambassador tasks",
      reward: 500,
      completed: false,
      type: "special",
    },
    {
      id: 6,
      icon: "📱",
      title: "Share on Telegram",
      description: "Share Oblium in Telegram groups",
      reward: 120,
      completed: false,
      type: "social",
    },
  ])

  const handleCompleteTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: true } : task)))
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const totalReward = tasks.reduce((sum, task) => sum + (task.completed ? task.reward : 0), 0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
              <h1 className="font-display font-bold text-primary">Tasks & Rewards</h1>
              <p className="text-xs text-foreground/60">Complete missions for bonus points</p>
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
        {/* Stats */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" variants={itemVariants}>
          <LiquidCard className="p-6 text-center">
            <div className="text-foreground/60 text-sm mb-2">Completed</div>
            <div className="text-4xl font-display font-bold text-success">
              {completedCount}/{tasks.length}
            </div>
          </LiquidCard>
          <LiquidCard className="p-6 text-center">
            <div className="text-foreground/60 text-sm mb-2">Points Earned</div>
            <div className="text-4xl font-display font-bold text-primary">{totalReward}</div>
          </LiquidCard>
          <LiquidCard className="p-6 text-center">
            <div className="text-foreground/60 text-sm mb-2">Potential Reward</div>
            <div className="text-4xl font-display font-bold text-accent">
              {tasks.reduce((sum, task) => sum + (task.completed ? 0 : task.reward), 0)}
            </div>
          </LiquidCard>
        </motion.div>

        {/* Tasks Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
          {tasks.map((task, index) => (
            <motion.div key={task.id} variants={itemVariants} whileHover={{ y: -5 }} custom={index}>
              <LiquidCard
                className={`p-6 h-full flex flex-col transition-all duration-300 ${
                  task.completed ? "border-success/50 bg-success/5" : "hover:border-primary/50"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{task.icon}</div>
                  {task.completed && (
                    <motion.div
                      className="w-6 h-6 rounded-full bg-success flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <span className="text-white text-sm font-bold">✓</span>
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{task.title}</h3>
                <p className="text-foreground/60 text-sm mb-4 flex-grow">{task.description}</p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-display font-bold text-xl">{task.reward}</span>
                    <span className="text-foreground/60 text-xs">pts</span>
                  </div>
                  {!task.completed && (
                    <GlowButton onClick={() => handleCompleteTask(task.id)} className="px-4 py-2 text-sm">
                      Complete
                    </GlowButton>
                  )}
                </div>
              </LiquidCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
