import {
  useAccount,
  useConnect,
  useSendTransaction,
  useWalletClient,
} from "wagmi";
import { useState, useCallback } from "react";
import { injected, readContract } from "@wagmi/core";
import { config } from "@/components/Web3Provider";

interface TransactionArgs {
  tokenAddress?: string; // ERC20 token contract address (optional for native tokens)
  recipientAddress: string;
  amount: string; // Amount to transfer in human-readable format
  isErc20: boolean; // Whether the transaction is ERC20 or native token
}

interface Transaction {
  success: boolean;
  txHash: string | null;
  errorMessage?: string;
}

/**
 * Custom hook to handle blockchain transactions for native tokens (e.g., ETH, MATIC)
 * and ERC20 tokens.
 * @returns Functions and states for processing transactions.
 */
export default function useTransactionHandler() {
  // Wallet client for interacting with the blockchain
  const { data: walletClient } = useWalletClient({
    query: {
      refetchOnMount: "always",
    },
  });

  const { status } = useAccount();
  const { connectAsync } = useConnect();

  // Hook for native token transfers
  const { sendTransactionAsync } = useSendTransaction();

  // States for transaction processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the transaction process for both native and ERC20 tokens.
   * @param tokenAddress - Contract address of the ERC20 token (optional for native tokens).
   * @param recipientAddress - Address of the recipient.
   * @param amount - Transfer amount in human-readable format (e.g., 0.1 for tokens).
   * @param isErc20 - Flag indicating whether it's an ERC20 token or a native token.
   *
   * @returns A promise with the transaction result.
   */
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
        // Connect the wallet if not connected.
        if (status !== "connected") {
          await connectAsync({ connector: injected() });
        }

        if (isErc20 && tokenAddress) {
          // ERC20 token transfer logic
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
              outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
              stateMutability: "view",
              type: "function",
            },
          ];

          // Fetch token decimals from the contract
          const decimals = await readContract(config, {
            address: tokenAddress as `0x${string}`,
            abi,
            functionName: "decimals",
          });

          // Calculate the amount in Wei using the decimals from the contract
          // Reason: Gemini's Wei calculation for certain inputs (e.g., 0.1 tokens)
          // is sometimes inaccurate or inconsistent. This ensures accuracy.
          const amountInWei = BigInt(
            parseFloat(amount) * Math.pow(10, Number(decimals))
          );

          // Ensure the wallet client is available
          if (!walletClient) {
            throw new Error(
              "Wallet client not found. Try reconnecting your wallet & then retry."
            );
          }

          // Execute the ERC20 transfer
          const txHash = await walletClient.writeContract({
            address: tokenAddress as `0x${string}`,
            abi,
            functionName: "transfer",
            args: [recipientAddress, amountInWei],
          });

          return { success: true, txHash };
        }

        // Native token transfer logic
        const amountInWei = BigInt(parseFloat(amount) * Math.pow(10, 18));

        // Execute the native token transfer
        const txHash = await sendTransactionAsync({
          to: `0x${recipientAddress?.replace("0x", "")}`,
          value: amountInWei,
        });

        return { success: true, txHash };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        // Handle errors during the transaction process
        setError(errorMessage);
        return { success: false, txHash: null, errorMessage };
      } finally {
        setIsProcessing(false);
      }
    },
    [sendTransactionAsync, walletClient, status, connectAsync]
  );

  return {
    handleTransaction,
    isProcessing,
    error,
  };
}
