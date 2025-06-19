export interface Candidate {
  name: string
  vote_count: bigint
}

export interface Election {
  id: bigint
  title: string
  description: string
  start_date: bigint
  end_date: bigint
  creator: string
  is_active: boolean
  candidates: Candidate[]
}

export interface ElectionStats {
  totalElections: number
  activeElections: number
  totalVotes: number
  myElections: number
}
