"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Settings, Trash2, StopCircle, Trophy, Calendar } from "lucide-react"
import { useWeb3 } from "../hooks/use-web3"
import { useToast } from "@/hooks/use-toast"
import type { Election } from "../types/election"
import { useErrorHandler } from "./error-toast"

interface ManageElectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  election: Election
  onElectionUpdated: () => void
}

export function ManageElectionDialog({ open, onOpenChange, election, onElectionUpdated }: ManageElectionDialogProps) {
  const { closeElection, deleteElection, extendElection } = useWeb3()
  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  const [extensionDays, setExtensionDays] = useState(7)
  const [isClosing, setIsClosing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExtending, setIsExtending] = useState(false)

  const totalVotes = election.candidates.reduce((sum, candidate) => sum + Number(candidate.vote_count), 0)

  const endDate = new Date(Number(election.end_date) * 1000)
  const now = new Date()
  const isActive = election.is_active && now <= endDate

  const getWinner = () => {
    if (totalVotes === 0) return null

    const winner = election.candidates.reduce((prev, current) =>
      Number(current.vote_count) > Number(prev.vote_count) ? current : prev,
    )

    return winner
  }

  const winner = getWinner()

  const handleClose = async () => {
    setIsClosing(true)
    try {
      await closeElection(election.id)

      toast({
        title: "Success",
        description: "Election closed successfully",
      })

      onElectionUpdated()
      onOpenChange(false)
    } catch (error: any) {
      handleError(error, "Closing election")
    } finally {
      setIsClosing(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this election? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteElection(election.id)

      toast({
        title: "Success",
        description: "Election deleted successfully",
      })

      onElectionUpdated()
      onOpenChange(false)
    } catch (error: any) {
      handleError(error, "Deleting election")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExtend = async () => {
    if (extensionDays < 1) {
      toast({
        title: "Error",
        description: "Extension must be at least 1 day",
        variant: "destructive",
      })
      return
    }

    setIsExtending(true)
    try {
      await extendElection(election.id, extensionDays)

      toast({
        title: "Success",
        description: `Election extended by ${extensionDays} days`,
      })

      onElectionUpdated()
      onOpenChange(false)
    } catch (error: any) {
      handleError(error, "Extending election")
    } finally {
      setIsExtending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Manage Election
          </DialogTitle>
          <DialogDescription>{election.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Election Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Election Status
                {isActive ? <Badge className="bg-green-600">Active</Badge> : <Badge variant="outline">Completed</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">End Date</p>
                  <p className="font-medium">{endDate.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Votes</p>
                  <p className="font-medium">{totalVotes}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 mb-2">Description</p>
                <p className="text-sm">{election.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Current Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Current Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {election.candidates.map((candidate, index) => {
                  const percentage = totalVotes > 0 ? (Number(candidate.vote_count) / totalVotes) * 100 : 0
                  const isWinning = winner && candidate.name === winner.name && totalVotes > 0

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium flex items-center gap-2">
                          {candidate.name}
                          {isWinning && <Trophy className="w-4 h-4 text-yellow-500" />}
                        </span>
                        <span className="text-sm text-gray-500">
                          {Number(candidate.vote_count)} votes ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Management Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Management Actions</CardTitle>
              <CardDescription>Manage your election settings and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Extend Election */}
              {isActive && (
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="extension">Extend Election (days)</Label>
                    <Input
                      id="extension"
                      type="number"
                      value={extensionDays}
                      onChange={(e) => setExtensionDays(Number(e.target.value))}
                      min={1}
                      max={365}
                    />
                  </div>
                  <Button onClick={handleExtend} disabled={isExtending} className="bg-blue-600 hover:bg-blue-700">
                    {isExtending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Extending...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Extend
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Close Election */}
              {isActive && (
                <Button onClick={handleClose} disabled={isClosing} variant="outline" className="w-full">
                  {isClosing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Closing...
                    </>
                  ) : (
                    <>
                      <StopCircle className="w-4 h-4 mr-2" />
                      Close Election
                    </>
                  )}
                </Button>
              )}

              {/* Delete Election */}
              <Button onClick={handleDelete} disabled={isDeleting} variant="destructive" className="w-full">
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Election
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <strong>Note:</strong> Closing an election will stop accepting new votes. Deleting an election will
                permanently remove it and cannot be undone.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
