"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Vote, Trophy, Users, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedCard } from "./animated-card"

interface StatsCardsProps {
  stats: {
    totalElections: number
    activeElections: number
    totalVotes: number
    myElections: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <AnimatedCard delay={0}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Elections</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <motion.div
            className="text-2xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {stats.totalElections}
          </motion.div>
          <p className="text-xs text-muted-foreground">All elections created</p>
        </CardContent>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
          <Vote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <motion.div
            className="text-2xl font-bold text-green-600"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {stats.activeElections}
          </motion.div>
          <p className="text-xs text-muted-foreground">Currently accepting votes</p>
        </CardContent>
      </AnimatedCard>

      <AnimatedCard delay={0.2}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <motion.div
            className="text-2xl font-bold text-blue-600"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {stats.totalVotes}
          </motion.div>
          <p className="text-xs text-muted-foreground">Votes cast across all elections</p>
        </CardContent>
      </AnimatedCard>

      <AnimatedCard delay={0.3}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Elections</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <motion.div
            className="text-2xl font-bold text-purple-600"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {stats.myElections}
          </motion.div>
          <p className="text-xs text-muted-foreground">Elections you created</p>
        </CardContent>
      </AnimatedCard>
    </div>
  )
}
