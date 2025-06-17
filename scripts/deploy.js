const { ethers } = require("hardhat");

async function main() {
  const ElectionManager = await ethers.getContractFactory("ElectionManager"); // 1️⃣ Factory
  const contract = await ElectionManager.deploy();                            // 2️⃣ Deploy
  await contract.waitForDeployment();                                         // 3️⃣ Wait

  console.log("Contract deployed to:", await contract.getAddress());          // 4️⃣ Print address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
