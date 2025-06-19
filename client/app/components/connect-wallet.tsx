"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Shield, Vote, Users } from "lucide-react"
import { motion } from "framer-motion"

interface ConnectWalletProps {
  onConnect: () => void
  isConnecting: boolean
}

export function ConnectWallet({ onConnect, isConnecting }: ConnectWalletProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="mb-8">
          <CardHeader className="text-center">
            <motion.div
              className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Wallet className="w-8 h-8 text-blue-600" />
            </motion.div>
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <CardDescription>Connect your Web3 wallet to participate in decentralized elections</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={onConnect} disabled={isConnecting} size="lg" className="bg-blue-600 hover:bg-blue-700">
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect MetaMask
                  </>
                )}
              </Button>
            </motion.div>
            <p className="text-sm text-gray-500 mt-4">
              Make sure you have MetaMask installed and connected to the correct network
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: Shield,
            title: "Secure & Transparent",
            description: "All votes are recorded on the blockchain, ensuring transparency and immutability",
            color: "text-green-600",
          },
          {
            icon: Vote,
            title: "Easy Voting",
            description: "Simple and intuitive interface for casting votes in active elections",
            color: "text-blue-600",
          },
          {
            icon: Users,
            title: "Create Elections",
            description: "Create your own elections with custom candidates and voting periods",
            color: "text-purple-600",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -10 }}
          >
            <Card>
              <CardHeader>
                <feature.icon className={`w-8 h-8 ${feature.color} mb-2`} />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
