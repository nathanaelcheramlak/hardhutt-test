"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { ReactNode } from "react"

interface AnimatedCardProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function AnimatedCard({ children, delay = 0, className }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={className}
    >
      <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">{children}</Card>
    </motion.div>
  )
}
