import { NextResponse } from "next/server";
import { depositContract, provider } from "../../../utils/ethereum";
import { ethers } from "ethers";
import { connectToMongo } from "../../../db/connect";
import { insertDeposit, getAllDeposits } from "../../../db/deposits";
import axios from "axios";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ALCHEMY_API_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

const fetchInternalTransactions = async (txHash: string) => {
  try {
    const response = await axios.post(ALCHEMY_API_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "debug_traceTransaction",
      params: [txHash],
    });
    return response.data.result;
  } catch (error) {
    console.error("Error fetching internal transactions:", error);
    throw new Error("Failed to fetch internal transactions");
  }
};

// GET handler to fetch all deposits
export async function GET() {
  try {
    const db = await connectToMongo();
    const deposits = await getAllDeposits(db);
    return NextResponse.json(deposits);
  } catch (error) {
    console.error("Error fetching deposits:", error);
    return NextResponse.json(
      { message: "Error fetching deposits", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST handler to start listening for deposit events
export async function POST() {
  try {
    const db = await connectToMongo();

    // Ensure the event listener is registered only once
    depositContract.removeAllListeners("DepositEvent"); // Remove any previous listeners

    depositContract.on(
      "DepositEvent",
      async (
        publicKey: string,
        withdrawalCredentials: string,
        amount: ethers.BigNumberish,
        signature: string,
        index: ethers.BigNumberish
      ) => {
        try {
          // Retrieve the transaction hash from the event data
          const fromBlock = "latest";
          const toBlock = "latest";
          const transactionHash = (
            await depositContract.queryFilter(
              "DepositEvent",
              fromBlock,
              toBlock
            )
          ).pop()?.transactionHash;

          console.log("Transaction hash: ", transactionHash);

          if (!transactionHash) {
            throw new Error("Transaction hash not found");
          }

          // Retrieve block details
          const transaction = await provider.getTransaction(transactionHash);
          const blockNumber = transaction?.blockNumber;
          const block = await provider.getBlock(blockNumber!);
          const blockTimestamp = block?.timestamp;
          const from = transaction?.from;

          // Retrieve transaction receipt
          const transactionReceipt = await provider.getTransactionReceipt(
            transactionHash
          );

          // Calculate fee (Gas used * Gas price)
          const gasUsed = transactionReceipt?.gasUsed;
          const gasPrice = transaction?.gasPrice; // Ensure gasPrice is valid
          const fee = Number(gasUsed) * Number(gasPrice); // Convert to number for simplicity

          // Fetch internal transactions
        //   const internalTxs = await fetchInternalTransactions(transactionHash);
        //   const internalTransactions = internalTxs.map((trace: any) => ({
        //     from: trace.from,
        //     to: trace.to,
        //     value: ethers.formatEther(trace.value),
        //     gasUsed: trace.gasUsed.toNumber(),
        //     gasPrice: trace.gasPrice.toNumber(),
        //   }));

          // Construct depositData with accurate fields
          const depositData = {
            blockNumber,
            blockTimestamp: new Date(blockTimestamp! * 1000), // Convert Unix timestamp to Date
            fee,
            hash: transactionHash,
            pubKey: from,
            // internalTransactions,
          };

          await insertDeposit(db, depositData);
        } catch (insertError) {
          console.error("Error inserting deposit into database:", insertError);
        }
      }
    );

    return NextResponse.json({ message: "Listening for deposit events..." });
  } catch (error) {
    console.error("Error setting up deposit listener:", error);
    return NextResponse.json(
      {
        message: "Error setting up deposit listener",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
