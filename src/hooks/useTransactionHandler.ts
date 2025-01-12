import {
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import { useState, useCallback } from "react";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/components/Web3Provider";

interface TransactionArgs {
  tokenAddress?: string; // ERC20 token contract address (optional for native tokens)
  recipientAddress: string; // Recipient's wallet address
  amount: string; // Amount to transfer in Wei
  isErc20: boolean; // Whether the transaction is ERC20 or native token
}

interface Transaction {
  success: boolean;
  txHash: string;
}

export default function useTransactionHandler() {
  const { data: walletClient } = useWalletClient();
  const { sendTransactionAsync } = useSendTransaction();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransaction = useCallback(
    async ({
      tokenAddress,
      recipientAddress,
      amount,
      isErc20,
    }: TransactionArgs): Promise<Transaction> => {
      setIsProcessing(true);
      setError(null);

      try {
        if (!walletClient) {
          throw new Error("Wallet client is not available.");
        }

        if (isErc20 && tokenAddress) {
          // ERC20 token transfer
          const abi = [
            {
              inputs: [
                { internalType: "address", name: "recipient", type: "address" },
                { internalType: "uint256", name: "amount", type: "uint256" },
              ],
              name: "transfer",
              outputs: [{ internalType: "bool", name: "", type: "bool" }],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "decimals",
              outputs: [
                {
                  internalType: "uint8",
                  name: "",
                  type: "uint8",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ];

          const decimals = await readContract(config, {
            address: tokenAddress as `0x${string}`,
            abi,
            functionName: "decimals",
          });

          console.log("Token decimals:", decimals);

          const amountInWei = BigInt(
            parseFloat(amount) * Math.pow(10, Number(decimals))
          );

          console.log("Amount in Wei:", amountInWei);

          console.log("Preparing ERC20 transfer...");
          const txHash = await walletClient.writeContract({
            address: tokenAddress as `0x${string}`,
            abi,
            functionName: "transfer",
            args: [recipientAddress, amountInWei],
          });

          console.log("ERC20 transaction hash:", txHash);

          return { success: true, txHash };
        } else {
          const amountInWei = BigInt(parseFloat(amount) * Math.pow(10, 18));
          // Native token transfer
          console.log("Preparing native token transfer...");
          const txHash = await sendTransactionAsync({
            to: `0x${recipientAddress?.replace("0x", "")}`,
            value: amountInWei,
          });

          console.log("Native token transaction hash:", txHash);

          return { success: true, txHash };
        }
      } catch (err) {
        console.error("Error during transaction:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );

        return { success: false, txHash: "" };
      } finally {
        setIsProcessing(false);
      }
    },
    [sendTransactionAsync, walletClient]
  );

  return {
    handleTransaction,
    isProcessing,
    error,
  };
}
