# 🗳️ True Vote

**True Vote** is a decentralized voting platform built with Solidity, Hardhat, Ethers.js, and Next.js. It enables transparent, tamper-resistant elections on the **blockchain**, empowering communities to run trustless voting processes.

## 🚀 Features

- ✅ Create elections with a title, description, and multiple candidates
- 🗓️ Schedule start and end dates with configurable durations
- 📥 Vote securely – one vote per wallet
- 🧾 Retrieve all active elections and their current vote counts
- 🔐 Only election creators can close, extend, or delete their elections
- 📊 Real-time voting insights directly on-chain
- 🔁 Extend elections if needed
- 🛑 Close elections early

## 🛠️ Tech Stack

| Layer          | Tech              |
| -------------- | ----------------- |
| Smart Contract | Solidity (v0.8.x) |
| Dev Env        | Hardhat           |
| Frontend       | Next.js + React   |
| Web3 Library   | Ethers.js         |

## 📁 Project Structure

```bash
contracts/
└── Elections.sol

frontend/
├── pages/
├── components/
└── hooks/

hardhat.config.js
```

## 🔧 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nathanaelcheramlak/true-vote.git
cd true-vote
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Hardhat local blockchain

```bash
npx hardhat compile
npx hardhat node
```

### 4. Deploy the contract

In a new terminal:

```bash
npx hardhat ignition deploy ignition/modules/ignition.js --network localhost
```

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

### 6. Install MetaMask Extension

After installation, go to Settings → Networks → Add Network and add the following:

    Network Name: Hardhat Localhost
    New RPC URL: http://localhost:8545
    Chain ID: 31337

### 7. Add a Test wallet

From the Hardhat local blockchain, copy one of the test accounts shown in the terminal (with its private key).
Then, import that account into MetaMask:

    Open MetaMask.
    Click your profile icon → Import Account.
    Paste the private key of the test account.

You'll now have test ETH available for transactions on localhost:8545.

## 🧪 Example Contract Usage

- createElection(title, description, candidateNames, startDate, durationDays)

- vote(electionId, candidateIndex)

- getAllElections() → ReturnElection[]

- getElection(electionId) → title, description, ...candidates

- closeElection(electionId)

- extendElection(electionId, durationDays)

- deleteElection(electionId)

## 👨‍💻 Author

Built by [nathanaelcheramlak](https://github.com/nathanaelcheramlak).
