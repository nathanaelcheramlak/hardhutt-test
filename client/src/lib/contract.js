import { ethers } from "ethers";
import contractABI from "../abi/contracts/ElectionManager.sol/ElectionManager.json";

const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; 

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

  return contract;
}