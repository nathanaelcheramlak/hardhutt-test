const { expect } = require("chai");
const { time } = require("console");
const { ethers } = require("hardhat");

describe("ElectionManager", function () {
  let ElectionManager, contract;

  // Deploying the contract before each test
  beforeEach(async function () {
    ElectionManager = await ethers.getContractFactory("ElectionManager");
    contract = await ElectionManager.deploy();
    await contract.waitForDeployment();
  });

  it("Should deploy and have initial elections", async function () {
    const ElectionManager = await ethers.getContractFactory("ElectionManager");
    const contract = await ElectionManager.deploy();
    await contract.waitForDeployment(); // ✅ RIGHT


    const count = await contract.election_count();
    expect(count).to.equal(2);
  });

  it("Should return a valid timestamp from getTime", async function () {
    const timestamp = await contract.getTime();
    const address = await contract.getAddress();
    
    expect(timestamp).to.be.a("bigint");
    expect(timestamp).to.be.greaterThan(0);
    console.log('Timestamp: ', timestamp);
    console.log('Address: ', address);
  })
});
