const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Elections", (m) => {
	const contract = m.contract("Elections");
	return { contract };
});
