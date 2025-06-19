const { expect } = require("chai");
const { time } = require("console");
const { ethers } = require("hardhat");

describe("Elections", function () {
	let Elections, contract;

	// Deploying the contract before each test
	beforeEach(async function () {
		Elections = await ethers.getContractFactory("Elections");
		contract = await Elections.deploy();
		await contract.waitForDeployment();
	});

	it("Should return a valid timestamp from getTime", async function () {
		const timestamp = await contract.getTime();
		const address = await contract.getAddress();

		expect(timestamp).to.be.a("bigint");
		expect(timestamp).to.be.greaterThan(0);
		console.log("Timestamp: ", timestamp);
		console.log("Address: ", address);
	});
});
