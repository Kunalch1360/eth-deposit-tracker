import { ethers } from "ethers";

// Ensure environment variable is present
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY as string;

if (!ALCHEMY_API_KEY) {
  throw new Error("Missing ALCHEMY_API_KEY.");
}

let provider: ethers.Provider;

try {
  provider = new ethers.AlchemyProvider("mainnet", ALCHEMY_API_KEY);
} catch (error) {
  throw new Error(
    `Failed to initialize AlchemyProvider: ${
      error instanceof Error ? error.message : "Unknown error"
    }`
  );
}

const depositContractAddress = "0x00000000219ab540356cBB839Cbe05303d7705Fa";

const depositContractAbi = [
  "event DepositEvent(bytes publicKey, bytes withdrawalCredentials, bytes amount, bytes signature, bytes index)",
];

let depositContract: ethers.Contract;

try {
  depositContract = new ethers.Contract(
    depositContractAddress,
    depositContractAbi,
    provider
  );
} catch (error) {
  throw new Error(
    `Failed to initialize contract: ${
      error instanceof Error ? error.message : "Unknown error"
    }`
  );
}

export {
  provider,
  depositContractAddress,
  depositContractAbi,
  depositContract,
};
