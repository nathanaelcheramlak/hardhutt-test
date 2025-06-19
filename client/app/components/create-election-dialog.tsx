"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Calendar, Clock } from "lucide-react"
import { useWeb3 } from "../hooks/use-web3"
import { useToast } from "@/hooks/use-toast"
import { useErrorHandler } from "./error-toast"

interface CreateElectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onElectionCreated: () => void
}

export function CreateElectionDialog({ open, onOpenChange, onElectionCreated }: CreateElectionDialogProps) {
  const { createElection } = useWeb3()
  const { toast } = useToast()
  const { handleError } = useErrorHandler()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [candidates, setCandidates] = useState(["", ""])
  const [startDate, setStartDate] = useState("")
  const [durationDays, setDurationDays] = useState(7)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addCandidate = () => {
    setCandidates([...candidates, ""])
  }

  const removeCandidate = (index: number) => {
    if (candidates.length > 2) {
      setCandidates(candidates.filter((_, i) => i !== index))
    }
  }

  const updateCandidate = (index: number, value: string) => {
    const updated = [...candidates]
    updated[index] = value
    setCandidates(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const validCandidates = candidates.filter((c) => c.trim())
    if (validCandidates.length < 2) {
      toast({
        title: "Error",
        description: "Please provide at least 2 candidates",
        variant: "destructive",
      })
      return
    }

    const startTimestamp = startDate ? Math.floor(new Date(startDate).getTime() / 1000) : Math.floor(Date.now() / 1000)

    setIsSubmitting(true)
    try {
      await createElection(title.trim(), description.trim(), validCandidates, startTimestamp, durationDays)

      toast({
        title: "Success",
        description: "Election created successfully!",
      })

      // Reset form
      setTitle("")
      setDescription("")
      setCandidates(["", ""])
      setStartDate("")
      setDurationDays(7)

      onElectionCreated()
      onOpenChange(false)
    } catch (error: any) {
      handleError(error, "Creating election")
    } finally {
      setIsSubmitting(false)
    }
  }

  const minDate = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Election</DialogTitle>
          <DialogDescription>Set up a new election with candidates and voting parameters</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Election Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Student Council President Election"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the election purpose and any important details..."
                rows={3}
                required
              />
            </div>
          </div>

          {/* Candidates */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Candidates *</Label>
              <Button type="button" onClick={addCandidate} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
            </div>

            <div className="space-y-2">
              {candidates.map((candidate, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={candidate}
                    onChange={(e) => updateCandidate(index, e.target.value)}
                    placeholder={`Candidate ${index + 1} name`}
                    className="flex-1"
                  />
                  {candidates.length > 2 && (
                    <Button type="button" onClick={() => removeCandidate(index)} variant="outline" size="icon">
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">At least 2 candidates are required</p>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={minDate}
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to start immediately</p>
            </div>

            <div>
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration (days)
              </Label>
              <Input
                id="duration"
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                min={1}
                max={365}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Election"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
