import React, { useState } from "react";
import { getContract } from "../lib/contract";

export default function CreateElection() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
  const [duration, setDuration] = useState(""); // in days
  const [candidates, setCandidates] = useState(["", ""]); // default 2

  const handleCandidateChange = (index, value) => {
    const newCandidates = [...candidates];
    newCandidates[index] = value;
    setCandidates(newCandidates);
  };

  const addCandidateField = () => {
    setCandidates([...candidates, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const contract = await getContract();

      const unixStart = Math.floor(new Date(startDate).getTime() / 1000);
      console.log(title, description, candidates, unixStart, parseInt(duration));

      const response = await contract.createElection(title, description, candidates, unixStart, parseInt(duration));
      console.log("Response: ", response);
      alert("Election created successfully!");
      setTitle("");
      setDescription("");
      setStartDate("");
      setDuration("");
      setCandidates(["", ""]);
    } catch (err) {
      console.error(err);
      alert("Failed to create election.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Create New Election</h2>
      
      <input
        type="text"
        placeholder="Election Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      /><br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      /><br />

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      /><br />

      <input
        type="number"
        placeholder="Duration in Days"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        required
      /><br />

      <h4>Candidates:</h4>
      {candidates.map((c, i) => (
        <input
          key={i}
          type="text"
          placeholder={`Candidate ${i + 1}`}
          value={c}
          onChange={(e) => handleCandidateChange(i, e.target.value)}
          required
        />
      ))}
      <br />
      <button type="button" onClick={addCandidateField}>Add Candidate</button><br /><br />

      <button type="submit">Create Election</button>
    </form>
  );
}
