import { Db } from "mongodb";

type InternalTransaction = {
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  gasPrice: number;
};

type Deposit = {
  blockNumber: number | null | undefined;
  blockTimestamp: Date;
  fee: number;
  hash: string;
  pubKey: string | undefined;
//   internalTransactions?: InternalTransaction[];
};

export const insertDeposit = async (db: Db, deposit: Deposit) => {
  try {
    const depositsCollection = db.collection("deposits");
    await depositsCollection.insertOne(deposit);
  } catch (error) {
    console.error("Error inserting deposit into database:", error);
    throw new Error("Failed to insert deposit");
  }
};

export const getAllDeposits = async (db: Db) => {
  try {
    const depositsCollection = db.collection("deposits");
    const deposits = await depositsCollection.find({}).toArray();
    return deposits;
  } catch (error) {
    console.error("Error fetching deposits from database:", error);
    throw new Error("Failed to fetch deposits");
  }
};
