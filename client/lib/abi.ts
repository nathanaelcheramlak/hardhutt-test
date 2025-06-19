const ELECTIONS_ABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "electionId",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "closedAt",
				type: "uint256",
			},
		],
		name: "ElectionClosed",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "electionId",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "string",
				name: "title",
				type: "string",
			},
		],
		name: "ElectionCreated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "electionId",
				type: "uint256",
			},
		],
		name: "ElectionDeleted",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "electionId",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "newEndDate",
				type: "uint256",
			},
		],
		name: "ElectionExtended",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "electionId",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "address",
				name: "voter",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "candidateIdx",
				type: "uint256",
			},
		],
		name: "Voted",
		type: "event",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "electionId",
				type: "uint256",
			},
		],
		name: "closeElection",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "title",
				type: "string",
			},
			{
				internalType: "string",
				name: "description",
				type: "string",
			},
			{
				internalType: "string[]",
				name: "candidateNames",
				type: "string[]",
			},
			{
				internalType: "uint256",
				name: "start_date",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "duration_days",
				type: "uint256",
			},
		],
		name: "createElection",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "electionId",
				type: "uint256",
			},
		],
		name: "deleteElection",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "election_count",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "exists",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "electionId",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "duration_days",
				type: "uint256",
			},
		],
		name: "extendElection",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "getAllElections",
		outputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "id",
						type: "uint256",
					},
					{
						internalType: "string",
						name: "title",
						type: "string",
					},
					{
						internalType: "string",
						name: "description",
						type: "string",
					},
					{
						internalType: "uint256",
						name: "start_date",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "end_date",
						type: "uint256",
					},
					{
						internalType: "address",
						name: "creator",
						type: "address",
					},
					{
						internalType: "bool",
						name: "is_active",
						type: "bool",
					},
					{
						components: [
							{
								internalType: "string",
								name: "name",
								type: "string",
							},
							{
								internalType: "uint256",
								name: "vote_count",
								type: "uint256",
							},
						],
						internalType: "struct Elections.ReturnCandidate[]",
						name: "candidates",
						type: "tuple[]",
					},
				],
				internalType: "struct Elections.ReturnElection[]",
				name: "",
				type: "tuple[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "electionId",
				type: "uint256",
			},
		],
		name: "getElection",
		outputs: [
			{
				internalType: "string",
				name: "title",
				type: "string",
			},
			{
				internalType: "string",
				name: "description",
				type: "string",
			},
			{
				internalType: "uint256",
				name: "start_date",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "end_date",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "creator",
				type: "address",
			},
			{
				internalType: "bool",
				name: "is_active",
				type: "bool",
			},
			{
				components: [
					{
						internalType: "string",
						name: "name",
						type: "string",
					},
					{
						internalType: "uint256",
						name: "vote_count",
						type: "uint256",
					},
				],
				internalType: "struct Elections.ReturnCandidate[]",
				name: "candidates",
				type: "tuple[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getElectionCount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getTime",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "electionId",
				type: "uint256",
			},
		],
		name: "isElectionActive",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "electionId",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "candidateIdx",
				type: "uint256",
			},
		],
		name: "vote",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];

export default ELECTIONS_ABI;
