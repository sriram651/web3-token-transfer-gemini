import { injected, useAccount, useConnect, useSendTransaction } from "wagmi";
import { useState, useCallback } from "react";

interface TransactionArgs {
  tokenAddress: string;
  recipientAddress: string;
  amountInWei: string;
  isErc20: boolean;
}

interface Transaction {
  success?: boolean;
  txHash?: string | null;
  error?: string | null;
}

export default function useTransactionHandler() {
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { sendTransactionAsync } = useSendTransaction();

  const handleTransaction = useCallback(
    async ({
      tokenAddress,
      recipientAddress,
      amountInWei,
      isErc20,
    }: TransactionArgs): Promise<Transaction | undefined> => {
      setIsProcessing(true);
      setError(null);

      try {
        // Ensure the wallet is connected
        if (!isConnected) {
          await connectAsync({ connector: injected() });
        }

        // Simulate the transaction
        const txHash = await sendTransactionAsync(
          {
            to: `0x${recipientAddress.replace(/^0x/, "")}`,
            value: BigInt(amountInWei),
            data: isErc20 ? `0x${tokenAddress.replace(/^0x/, "")}` : undefined,
          },
          {
            onError(error) {
              console.log("Error during transaction:", error.message);
              setError(
                error instanceof Error
                  ? error.message
                  : "Unknown error occurred."
              );

              // Return false to stop the transaction
              return setError(error.message);
            },
          }
        );

        console.log({ txHash, error });
        return {
          success: true,
          txHash: txHash,
          error: error,
        };
      } catch (err) {
        console.error("Error during transaction:", err);
        setError(
          err instanceof Error ? err.message : "Unknown error occurred."
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [isConnected, connectAsync, sendTransactionAsync]
  );

  return {
    handleTransaction,
    isProcessing,
    error,
  };
}
