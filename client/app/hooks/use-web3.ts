"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import type { Election } from "../types/election";
import ELECTIONS_ABI from "@/lib/abi";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export function useWeb3() {
	const [account, setAccount] = useState<string | null>(null);
	const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
	const [contract, setContract] = useState<ethers.Contract | null>(null);
	const [isConnecting, setIsConnecting] = useState(false);

	const connectWallet = async () => {
		if (typeof window.ethereum === "undefined") {
			alert("Please install MetaMask!");
			return;
		}

		setIsConnecting(true);
		try {
			const provider = new ethers.BrowserProvider(window.ethereum);
			await provider.send("eth_requestAccounts", []);

			const signer = await provider.getSigner();
			const address = await signer.getAddress();

			const contract = new ethers.Contract(
				CONTRACT_ADDRESS,
				ELECTIONS_ABI,
				signer
			);

			setProvider(provider);
			setAccount(address);
			setContract(contract);
		} catch (error) {
			console.error("Error connecting wallet:", error);
		} finally {
			setIsConnecting(false);
		}
	};

	const getAllElections = async (): Promise<Election[]> => {
		if (!contract) return [];

		try {
			const elections = await contract.getAllElections();
			return elections.map((election: any) => ({
				id: election.id,
				title: election.title,
				description: election.description,
				start_date: election.start_date,
				end_date: election.end_date,
				creator: election.creator,
				is_active: election.is_active,
				candidates: election.candidates.map((candidate: any) => ({
					name: candidate.name,
					vote_count: candidate.vote_count,
				})),
			}));
		} catch (error) {
			console.error("Error getting elections:", error);
			return [];
		}
	};

	const getElectionCount = async (): Promise<number> => {
		if (!contract) return 0;

		try {
			const count = await contract.getElectionCount();
			return Number(count);
		} catch (error) {
			console.error("Error getting election count:", error);
			return 0;
		}
	};

	const createElection = async (
		title: string,
		description: string,
		candidates: string[],
		startDate: number,
		durationDays: number
	) => {
		if (!contract) throw new Error("Contract not connected");

		const tx = await contract.createElection(
			title,
			description,
			candidates,
			startDate,
			durationDays
		);
		await tx.wait();
		return tx;
	};

	const vote = async (electionId: bigint, candidateIndex: number) => {
		if (!contract) throw new Error("Contract not connected");

		const tx = await contract.vote(electionId, candidateIndex);
		await tx.wait();
		return tx;
	};

	const closeElection = async (electionId: bigint) => {
		if (!contract) throw new Error("Contract not connected");

		const tx = await contract.closeElection(electionId);
		await tx.wait();
		return tx;
	};

	const deleteElection = async (electionId: bigint) => {
		if (!contract) throw new Error("Contract not connected");

		const tx = await contract.deleteElection(electionId);
		await tx.wait();
		return tx;
	};

	const extendElection = async (electionId: bigint, additionalDays: number) => {
		if (!contract) throw new Error("Contract not connected");

		const tx = await contract.extendElection(electionId, additionalDays);
		await tx.wait();
		return tx;
	};

	const disconnectWallet = () => {
		setAccount(null);
		setProvider(null);
		setContract(null);
	};

	// Check if wallet is already connected on page load
	useEffect(() => {
		const checkConnection = async () => {
			if (typeof window.ethereum !== "undefined") {
				try {
					const provider = new ethers.BrowserProvider(window.ethereum);
					const accounts = await provider.listAccounts();

					if (accounts.length > 0) {
						const signer = await provider.getSigner();
						const address = await signer.getAddress();
						const contract = new ethers.Contract(
							CONTRACT_ADDRESS,
							ELECTIONS_ABI,
							signer
						);

						setProvider(provider);
						setAccount(address);
						setContract(contract);
					}
				} catch (error) {
					console.error("Error checking connection:", error);
				}
			}
		};

		checkConnection();
	}, []);

	return {
		account,
		provider,
		contract,
		isConnecting,
		connectWallet,
		disconnectWallet,
		getAllElections,
		getElectionCount,
		createElection,
		vote,
		closeElection,
		deleteElection,
		extendElection,
	};
}
