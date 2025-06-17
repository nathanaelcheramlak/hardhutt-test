import { useEffect, useState } from "react";
import { getContract } from "../lib/contract.js";

export default function Vote() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    async function load() {
      const contract = await getContract();
      const election = await contract.getElection(0);
      setCandidates(election[2]); // Candidates array
    }

    load();
  }, []);

  return (
    <div>
      <h2>Vote for a candidate:</h2>
      {candidates.map((c, i) => (
        <button key={i} onClick={async () => {
          const contract = await getContract();
          await contract.vote(0, i);
          alert("You voted!");
        }}>
          {c.name}
        </button>
      ))}
    </div>
  );
}
