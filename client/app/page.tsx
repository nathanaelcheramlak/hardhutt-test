"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Vote, Trophy, Users } from "lucide-react"
import { useWeb3 } from "./hooks/use-web3"
import { CreateElectionDialog } from "./components/create-election-dialog"
import { ElectionCard } from "./components/election-card"
import { VoteDialog } from "./components/vote-dialog"
import { ManageElectionDialog } from "./components/manage-election-dialog"
import { ConnectWallet } from "./components/connect-wallet"
import { StatsCards } from "./components/stats-cards"
import type { Election } from "./types/election"

export default function ElectionsApp() {
  const { account, contract, connectWallet, disconnectWallet, isConnecting, getAllElections, getElectionCount } =
    useWeb3()

  const [elections, setElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [voteDialogOpen, setVoteDialogOpen] = useState(false)
  const [manageDialogOpen, setManageDialogOpen] = useState(false)
  const [selectedElection, setSelectedElection] = useState<Election | null>(null)
  const [stats, setStats] = useState({
    totalElections: 0,
    activeElections: 0,
    totalVotes: 0,
    myElections: 0,
  })

  const loadElections = async () => {
    if (!contract) return

    setLoading(true)
    try {
      const electionsData = await getAllElections()
      setElections(electionsData)

      // Calculate stats
      const totalElections = electionsData.length
      const activeElections = electionsData.filter((e) => e.is_active).length
      const totalVotes = electionsData.reduce(
        (sum, e) => sum + e.candidates.reduce((candidateSum, c) => candidateSum + Number(c.vote_count), 0),
        0,
      )
      const myElections = electionsData.filter((e) => e.creator.toLowerCase() === account?.toLowerCase()).length

      setStats({ totalElections, activeElections, totalVotes, myElections })
    } catch (error) {
      console.error("Error loading elections:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (contract && account) {
      loadElections()
    }
  }, [contract, account])

  const handleVote = (election: Election) => {
    setSelectedElection(election)
    setVoteDialogOpen(true)
  }

  const handleManage = (election: Election) => {
    setSelectedElection(election)
    setManageDialogOpen(true)
  }

  const activeElections = elections.filter((e) => e.is_active)
  const completedElections = elections.filter((e) => !e.is_active)
  const myElections = elections.filter((e) => e.creator.toLowerCase() === account?.toLowerCase())

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Decentralized Elections Platform</h1>
            <p className="text-xl text-gray-600 mb-8">
              Create, manage, and participate in transparent blockchain-based elections
            </p>
          </div>
          <ConnectWallet onConnect={connectWallet} isConnecting={isConnecting} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Elections Dashboard</h1>
            <div className="flex items-center gap-4">
              <p className="text-gray-600">Connected: {account}</p>
              <Button
                onClick={disconnectWallet}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Disconnect
              </Button>
            </div>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Election
          </Button>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Elections Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Vote className="w-4 h-4" />
              Active ({activeElections.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Completed ({completedElections.length})
            </TabsTrigger>
            <TabsTrigger value="my-elections" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              My Elections ({myElections.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              All Elections ({elections.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 animate-pulse">Loading elections...</p>
              </div>
            ) : activeElections.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No active elections found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                {activeElections.map((election) => (
                  <ElectionCard
                    key={election.id}
                    election={election}
                    onVote={handleVote}
                    onManage={handleManage}
                    currentAccount={account}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedElections.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No completed elections found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                {completedElections.map((election) => (
                  <ElectionCard
                    key={election.id}
                    election={election}
                    onVote={handleVote}
                    onManage={handleManage}
                    currentAccount={account}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-elections" className="space-y-4">
            {myElections.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">You haven't created any elections yet</p>
                  <Button onClick={() => setCreateDialogOpen(true)} className="mt-4">
                    Create Your First Election
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                {myElections.map((election) => (
                  <ElectionCard
                    key={election.id}
                    election={election}
                    onVote={handleVote}
                    onManage={handleManage}
                    currentAccount={account}
                    showManageButton={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {elections.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">No elections found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                {elections.map((election) => (
                  <ElectionCard
                    key={election.id}
                    election={election}
                    onVote={handleVote}
                    onManage={handleManage}
                    currentAccount={account}
                    showManageButton={election.creator.toLowerCase() === account?.toLowerCase()}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <CreateElectionDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onElectionCreated={loadElections}
        />

        {selectedElection && (
          <>
            <VoteDialog
              open={voteDialogOpen}
              onOpenChange={setVoteDialogOpen}
              election={selectedElection}
              onVoteSubmitted={loadElections}
            />

            <ManageElectionDialog
              open={manageDialogOpen}
              onOpenChange={setManageDialogOpen}
              election={selectedElection}
              onElectionUpdated={loadElections}
            />
          </>
        )}
      </div>
    </div>
  )
}
