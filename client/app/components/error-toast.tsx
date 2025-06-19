"use client"

import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Wifi, Clock, UserX, Vote } from "lucide-react"

export function useErrorHandler() {
  const { toast } = useToast()

  const handleError = (error: any, context = "Operation") => {
    console.error(`${context} error:`, error)

    let title = "Error"
    let description = `${context} failed`
    let icon = <AlertCircle className="w-4 h-4" />

    // Parse common error messages
    if (error.message) {
      const message = error.message.toLowerCase()

      if (message.includes("user rejected") || message.includes("user denied")) {
        title = "Transaction Cancelled"
        description = "You cancelled the transaction"
        icon = <UserX className="w-4 h-4" />
      } else if (message.includes("already voted")) {
        title = "Already Voted"
        description = "You have already cast your vote in this election"
        icon = <Vote className="w-4 h-4" />
      } else if (message.includes("not active") || message.includes("election is not active")) {
        title = "Election Not Active"
        description = "This election is not currently accepting votes"
        icon = <Clock className="w-4 h-4" />
      } else if (message.includes("only creator")) {
        title = "Access Denied"
        description = "Only the election creator can perform this action"
        icon = <UserX className="w-4 h-4" />
      } else if (message.includes("network") || message.includes("connection")) {
        title = "Network Error"
        description = "Please check your internet connection and try again"
        icon = <Wifi className="w-4 h-4" />
      } else if (message.includes("insufficient funds")) {
        title = "Insufficient Funds"
        description = "You don't have enough funds to complete this transaction"
      } else if (message.includes("gas")) {
        title = "Transaction Failed"
        description = "Transaction failed due to gas issues. Please try again."
      } else if (message.includes("doesn't exist") || message.includes("not found")) {
        title = "Election Not Found"
        description = "The requested election could not be found"
      } else if (message.includes("ended") || message.includes("expired")) {
        title = "Election Ended"
        description = "This election has already ended"
        icon = <Clock className="w-4 h-4" />
      }
    }

    toast({
      title,
      description,
      variant: "destructive",
      duration: 5000,
    })
  }

  return { handleError }
}
