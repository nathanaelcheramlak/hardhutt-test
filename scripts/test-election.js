async function main() {
  const [deployer, voter] = await ethers.getSigners();

  const ElectionManager = await ethers.getContractFactory("ElectionManager");
  const contract = await ElectionManager.deploy();
  await contract.waitForDeployment(); // ✅ Fix: use waitForDeployment() in newer Hardhat versions
  console.log("Contract deployed at:", await contract.getAddress());

  const now = Math.floor(Date.now() / 1000) + 60;

  await contract.createElection(
    "Student Council",
    "Choose your rep",
    ["Alice", "Bob"],
    now,
    1 // 1 day
  );
  console.log("Election created");

  // Fast-forward time
  await network.provider.send("evm_increaseTime", [61]);
  await network.provider.send("evm_mine");

  // Cast vote
  await contract.connect(voter).vote(0, 0);
  console.log("Vote cast");

  // Read vote count
  const candidate = await contract.getCandidate(0, 0);
  console.log("Votes for Alice:", candidate.vote_count.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
