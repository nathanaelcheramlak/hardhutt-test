// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ElectionManager {
    struct Candidate {
        string name;
        uint vote_count;
    }

    struct Election {
        string title;
        string description;
        Candidate[] candidates;
        uint256 start_date;    // Unix timestamp
        uint256 duration;      // Duration in seconds
        uint256 end_date;      // Calculated end timestamp
        mapping(address => bool) hasVoted;
    }

    uint256 public election_count;
    mapping(uint256 => Election) public elections;
    event ElectionCreated(uint indexed electionId, string title);
    event Voted(uint indexed electionId, address voter, uint candidateIdx);

    constructor() {
        // First election (School President)
        string[] memory schoolCandidates = new string[](2);
        schoolCandidates[0] = "Alice";
        schoolCandidates[1] = "Bob";
        
        createElection(
            "School President 2024",
            "Vote for your school president",
            schoolCandidates,
            block.timestamp + 1 hours, // Starts 1 hour from now
            3                         // Runs for 3 days
        );

        // Second election (Class Representative)
        string[] memory classCandidates = new string[](3);
        classCandidates[0] = "Charlie";
        classCandidates[1] = "Dana";
        classCandidates[2] = "Evan";
        
        createElection(
            "Class Representative",
            "Select your class representative",
            classCandidates,
            block.timestamp + 2 hours, // Starts 2 hours from now
            5                         // Runs for 5 days
        );
    }

    function createElection(
        string memory title,
        string memory description,
        string[] memory candidateNames,
        uint256 start_date,
        uint256 duration_days
    ) public {
        // Validations
        if (bytes(title).length == 0) {
            revert ("InvalidElectionParameters: Title length too short");
        }
        if (candidateNames.length < 2) {
            revert ("InvalidElectionParameters: No enough candidates");
        }
        // if (start_date < block.timestamp) {
        //     revert ("InvalidElectionParameters: Invalid Date");
        // }

        uint256 duration_seconds = duration_days * 1 days;
        uint256 end_date = start_date + duration_seconds;


        elections[election_count].title = title;
        elections[election_count].description = description;
        elections[election_count].start_date = start_date;
        elections[election_count].duration = duration_seconds;
        elections[election_count].end_date = end_date;

        // Initialize candidates
        for (uint i = 0; i < candidateNames.length; i++) {
            elections[election_count].candidates.push(Candidate({
                name: candidateNames[i],
                vote_count: 0
            }));
        }

        emit ElectionCreated(election_count, title);
        election_count++;
    }

    function isElectionActive(uint256 electionId) private view returns (bool) {
        if (electionId >= election_count) return false;
        Election storage election = elections[electionId];
        return block.timestamp >= election.start_date && block.timestamp <= election.end_date;
    }

    function getElection(uint256 electionId) public view returns (
        string memory title,
        string memory description,
        Candidate[] memory candidates,
        uint256 end_date,
        bool is_active
    ) {
        require(electionId < election_count, "Invalid election ID");
        Election storage election = elections[electionId];
        return (
            election.title,
            election.description,
            election.candidates,
            election.end_date,
            isElectionActive(electionId)
        );
    }

    function getTime() public view returns(uint) {
        return block.timestamp;
    }

    function vote(uint electionId, uint candidateIdx) public {
        require(electionId < election_count, "Invalid election ID");
        Election storage election = elections[electionId];

        require(candidateIdx < election.candidates.length, "Invalid candidate index");
        require(isElectionActive(electionId), "Election is not active");
        require(!election.hasVoted[msg.sender], "Already voted");

        election.hasVoted[msg.sender] = true;
        election.candidates[candidateIdx].vote_count += 1;

        emit Voted(electionId, msg.sender, candidateIdx);
    }
}