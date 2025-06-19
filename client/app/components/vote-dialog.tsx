"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Vote, Clock, Users } from "lucide-react"
import { useWeb3 } from "../hooks/use-web3"
import { useToast } from "@/hooks/use-toast"
import type { Election } from "../types/election"
import { useErrorHandler } from "./error-toast"

interface VoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  election: Election
  onVoteSubmitted: () => void
}

export function VoteDialog({ open, onOpenChange, election, onVoteSubmitted }: VoteDialogProps) {
  const { vote } = useWeb3()
  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalVotes = election.candidates.reduce((sum, candidate) => sum + Number(candidate.vote_count), 0)

  const endDate = new Date(Number(election.end_date) * 1000)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCandidate) {
      toast({
        title: "Error",
        description: "Please select a candidate",
        variant: "destructive",
      })
      return
    }

    const candidateIndex = Number.parseInt(selectedCandidate)

    setIsSubmitting(true)
    try {
      await vote(election.id, candidateIndex)

      toast({
        title: "Success",
        description: "Your vote has been recorded!",
      })

      onVoteSubmitted()
      onOpenChange(false)
      setSelectedCandidate("")
    } catch (error: any) {
      handleError(error, "Voting")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Cast Your Vote
          </DialogTitle>
          <DialogDescription>{election.title}</DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Ends {endDate.toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {totalVotes} votes
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{election.description}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-base font-medium">Select a candidate:</Label>
                <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate} className="mt-3">
                  {election.candidates.map((candidate, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={index.toString()} id={`candidate-${index}`} />
                      <Label htmlFor={`candidate-${index}`} className="flex-1 cursor-pointer font-medium">
                        {candidate.name}
                      </Label>
                      <span className="text-sm text-gray-500">{Number(candidate.vote_count)} votes</span>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !selectedCandidate}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Voting...
                    </>
                  ) : (
                    <>
                      <Vote className="w-4 h-4 mr-2" />
                      Submit Vote
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> Your vote is permanent and cannot be changed once submitted.
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
