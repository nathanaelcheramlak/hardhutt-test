"use client"

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Vote, Settings, Clock, Users, Trophy } from "lucide-react"
import type { Election } from "../types/election"
import { AnimatedCard } from "./animated-card"
import { motion } from "framer-motion"

interface ElectionCardProps {
  election: Election
  onVote: (election: Election) => void
  onManage: (election: Election) => void
  currentAccount: string
  showManageButton?: boolean
}

export function ElectionCard({
  election,
  onVote,
  onManage,
  currentAccount,
  showManageButton = false,
}: ElectionCardProps) {
  const totalVotes = election.candidates.reduce((sum, candidate) => sum + Number(candidate.vote_count), 0)

  const isCreator = election.creator.toLowerCase() === currentAccount.toLowerCase()
  const startDate = new Date(Number(election.start_date) * 1000)
  const endDate = new Date(Number(election.end_date) * 1000)
  const now = new Date()

  const isUpcoming = now < startDate
  const isActive = election.is_active && now >= startDate && now <= endDate
  const isCompleted = !election.is_active || now > endDate

  const getStatusBadge = () => {
    if (isUpcoming) {
      return <Badge variant="secondary">Upcoming</Badge>
    } else if (isActive) {
      return (
        <Badge variant="default" className="bg-green-600">
          Active
        </Badge>
      )
    } else {
      return <Badge variant="outline">Completed</Badge>
    }
  }

  const getWinner = () => {
    if (totalVotes === 0) return null

    const winner = election.candidates.reduce((prev, current) =>
      Number(current.vote_count) > Number(prev.vote_count) ? current : prev,
    )

    return winner
  }

  const winner = getWinner()

  return (
    <AnimatedCard>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{election.title}</CardTitle>
            <CardDescription className="line-clamp-2">{election.description}</CardDescription>
          </div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
            {getStatusBadge()}
          </motion.div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {isUpcoming
              ? `Starts ${startDate.toLocaleDateString()}`
              : isActive
                ? `Ends ${endDate.toLocaleDateString()}`
                : `Ended ${endDate.toLocaleDateString()}`}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {totalVotes} votes
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Candidates and Results */}
        <div className="space-y-2">
          {election.candidates.map((candidate, index) => {
            const percentage = totalVotes > 0 ? (Number(candidate.vote_count) / totalVotes) * 100 : 0
            const isWinning = winner && candidate.name === winner.name && totalVotes > 0

            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center gap-2">
                    {candidate.name}
                    {isWinning && isCompleted && <Trophy className="w-4 h-4 text-yellow-500" />}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Number(candidate.vote_count)} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Progress value={percentage} className="h-2" />
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {isActive && !isCreator && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => onVote(election)} className="flex-1">
                <Vote className="w-4 h-4 mr-2" />
                Vote
              </Button>
            </motion.div>
          )}

          {(showManageButton || isCreator) && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => onManage(election)} variant="outline" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </motion.div>
          )}

          {!isActive && !isCreator && (
            <Button disabled className="flex-1">
              {isUpcoming ? "Not Started" : "Voting Ended"}
            </Button>
          )}
        </div>

        {isCreator && <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">You created this election</div>}
      </CardContent>
    </AnimatedCard>
  )
}
