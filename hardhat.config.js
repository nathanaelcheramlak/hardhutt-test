require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  paths: {
    artifacts: './client/src/abi'
  },
  networks: {
    hardhat: {
      chainId: 31337,
    }
  }
};
