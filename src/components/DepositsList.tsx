"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Pagination,
  Box,
} from "@mui/material";
import { formatEther } from "ethers";
import Link from "next/link";

type DepositData = {
  blockNumber: number;
  blockTimestamp: string; // Converted to string for easier display
  fee: number;
  hash: string;
  pubKey: string;
//   internalTransactions: {
//     from: string;
//     to: string;
//     value: string;
//     gasUsed: number;
//     gasPrice: number;
//   }[];
};

// Utility function to format addresses and hashes
const formatAddress = (address: string) => {
  if (address.length > 8) {
    return `${address.substring(0, 8)}...${address.substring(
      address.length - 8
    )}`;
  }
  return address;
};

const DepositList: React.FC = () => {
  const [deposits, setDeposits] = useState<DepositData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 10; // Set number of rows per page

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/deposits"); // Replace with your actual API endpoint
        setDeposits(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch deposits");
        setLoading(false);
      }
    };

    fetchDeposits();
  }, []);

  // Handle pagination
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  // Calculate the start and end indices for the current page
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedDeposits = deposits.slice(startIndex, endIndex);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{ mt: 10, width: "90%", ml: "auto", mr: "auto"}}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Block Number</TableCell>
              <TableCell>Block Timestamp</TableCell>
              <TableCell>Fee (ETH)</TableCell>
              <TableCell>Transaction Hash</TableCell>
              <TableCell>Public Key</TableCell>
              {/* <TableCell>Internal Transactions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDeposits.map((deposit, index) => (
              <TableRow key={index}>
                <TableCell>{deposit.blockNumber}</TableCell>
                <TableCell>
                  {new Date(deposit.blockTimestamp).toLocaleString()}
                </TableCell>
                <TableCell>{formatEther(deposit.fee)}</TableCell>
                <TableCell>
                  <Link href={`https://etherscan.io/tx/${deposit.hash}`}>
                    {formatAddress(deposit.hash)}
                  </Link>
                </TableCell>
                <TableCell>
                    {formatAddress(deposit.pubKey)}
                </TableCell>
                {/* <TableCell>
                  {deposit?.internalTransactions?.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>From</TableCell>
                          <TableCell>To</TableCell>
                          <TableCell>Value (ETH)</TableCell>
                          <TableCell>Gas Used</TableCell>
                          <TableCell>Gas Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {deposit.internalTransactions.map((tx, i) => (
                          <TableRow key={i}>
                            <TableCell>{formatAddress(tx.from)}</TableCell>
                            <TableCell>{formatAddress(tx.to)}</TableCell>
                            <TableCell>{tx.value}</TableCell>
                            <TableCell>{tx.gasUsed}</TableCell>
                            <TableCell>{tx.gasPrice}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography>No internal transactions</Typography>
                  )}
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Component */}
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination
          count={Math.ceil(deposits.length / rowsPerPage)} // Calculate total pages
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default DepositList;
