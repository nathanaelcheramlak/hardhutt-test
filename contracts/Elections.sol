// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Elections {
    struct Candidate {
        string name;
        uint vote_count;
    }

    struct Election {
        string title;
        string description;
        address creator;
        uint256 start_date;    
        uint256 duration;
        uint256 end_date;
        Candidate[] candidates;
        mapping(address => bool) hasVoted;
    }

    struct ReturnCandidate {
        string name;
        uint vote_count;
    }

    struct ReturnElection {
        uint id;
        string title;
        string description;
        uint256 start_date;
        uint256 end_date;
        address creator;
        bool is_active;
        ReturnCandidate[] candidates;
    }

    uint public election_count = 0;
    mapping(uint => Election) private elections;
    mapping(uint => bool) public exists;

    uint[] private electionIds;

    // Events
    event ElectionCreated(uint indexed electionId, string title);
    event Voted(uint indexed electionId, address voter, uint candidateIdx);  
    event ElectionClosed(uint indexed electionId, uint closedAt);
    event ElectionDeleted(uint indexed electionId);
    event ElectionExtended(uint indexed electionId, uint newEndDate);

    function createElection(
        string memory title,
        string memory description,
        string[] memory candidateNames,
        uint256 start_date,
        uint256 duration_days
    ) public {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(candidateNames.length >= 2, "At least two candidates required");
        require(start_date >= block.timestamp - 5 minutes, "Start date must be now or in the future");

        uint256 duration_seconds = duration_days * 1 days;
        uint256 end_date = start_date + duration_seconds;

        uint id = election_count;
        Election storage e = elections[id];

        e.title = title;
        e.description = description;
        e.creator = msg.sender;
        e.start_date = start_date;
        e.duration = duration_seconds;
        e.end_date = end_date;

        for (uint i = 0; i < candidateNames.length; i++) {
            e.candidates.push(Candidate({
                name: candidateNames[i],
                vote_count: 0
            }));
        }

        exists[id] = true;
        electionIds.push(id);
        emit ElectionCreated(id, title);
        election_count++;
    }

    function vote(uint electionId, uint candidateIdx) public {
        require(exists[electionId], "Election doesn't exist");
        Election storage e = elections[electionId];
        require(block.timestamp >= e.start_date && block.timestamp <= e.end_date, "Election is not active");
        require(!e.hasVoted[msg.sender], "You have already voted");
        require(candidateIdx < e.candidates.length, "Invalid candidate index");

        e.hasVoted[msg.sender] = true;
        e.candidates[candidateIdx].vote_count++;

        emit Voted(electionId, msg.sender, candidateIdx);
    }

    function getTime() public view returns (uint) {
        return block.timestamp;
    }

    function isElectionActive(uint electionId) public view returns (bool) {
        if (!exists[electionId]) return false;
        Election storage e = elections[electionId];
        return block.timestamp >= e.start_date && block.timestamp <= e.end_date;
    }

    function getElection(uint electionId) public view returns (
        string memory title,
        string memory description,
        uint256 start_date,
        uint256 end_date,
        address creator,
        bool is_active,
        ReturnCandidate[] memory candidates
    ) {
        require(exists[electionId], "Election doesn't exist");
        Election storage e = elections[electionId];

        ReturnCandidate[] memory cands = new ReturnCandidate[](e.candidates.length);
        for (uint i = 0; i < e.candidates.length; i++) {
            cands[i] = ReturnCandidate({
                name: e.candidates[i].name,
                vote_count: e.candidates[i].vote_count
            });
        }

        return (
            e.title,
            e.description,
            e.start_date,
            e.end_date,
            e.creator,
            isElectionActive(electionId),
            cands
        );
    }

    function getAllElections() public view returns (ReturnElection[] memory) {
        uint count = 0;
        for (uint i = 0; i < electionIds.length; i++) {
            if (exists[electionIds[i]]) {
                count++;
            }
        }

        ReturnElection[] memory activeElections = new ReturnElection[](count);
        uint index = 0;

        for (uint i = 0; i < electionIds.length; i++) {
            uint id = electionIds[i];
            if (!exists[id]) continue;

            Election storage e = elections[id];

            ReturnCandidate[] memory cands = new ReturnCandidate[](e.candidates.length);
            for (uint j = 0; j < e.candidates.length; j++) {
                cands[j] = ReturnCandidate({
                    name: e.candidates[j].name,
                    vote_count: e.candidates[j].vote_count
                });
            }

            activeElections[index] = ReturnElection({
                id: id,
                title: e.title,
                description: e.description,
                start_date: e.start_date,
                end_date: e.end_date,
                creator: e.creator,
                is_active: isElectionActive(id),
                candidates: cands
            });

            index++;
        }

        return activeElections;
    }

    function deleteElection(uint electionId) public returns (bool) {
        require(exists[electionId], "Election doesn't exist");

        Election storage e = elections[electionId];
        require(e.creator == msg.sender, "Only creator can delete the election");

        delete elections[electionId];
        exists[electionId] = false;
        emit ElectionDeleted(electionId);
        return true;
    }

    function closeElection(uint electionId) public returns(bool) {
        require(exists[electionId], "Election doesn't exist");

        Election storage e = elections[electionId];
        require(e.creator == msg.sender, "Only creator can close the election");
        require(block.timestamp < e.end_date, "Election already ended");

        e.end_date = block.timestamp;
        emit ElectionClosed(electionId, block.timestamp);
        return true;
    }

    function getElectionCount() public view returns (uint) {
        uint count = 0;
        for (uint i = 0; i < election_count; i++) {
            if (exists[i]) {
                count++;
            }
        }
        return count;
    }


    function extendElection(uint electionId, uint duration_days) public returns(bool) {
        require(exists[electionId], "Election doesn't exist");

        Election storage e = elections[electionId];
        require(e.creator == msg.sender, "Only creator can close the election");

        uint256 duration_seconds = duration_days * 1 days;
        uint256 end_date = block.timestamp + duration_seconds;
        e.end_date = end_date;
        return true;
    }
}
