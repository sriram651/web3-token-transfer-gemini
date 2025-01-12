import { useAccount } from "wagmi";

interface UseTransactionHandlerProps {
  tokenAddress: string; // ERC20 token contract address
  recipientAddress: string; // Recipient's wallet address
  amountInWei: string; // Amount to transfer in Wei
  isErc20: boolean; // Whether the transaction is for an ERC20 token
}

export default function useTransactionHandler({
  tokenAddress,
  recipientAddress,
  amountInWei,
  isErc20,
}: UseTransactionHandlerProps) {
  const { address, isConnected } = useAccount();

  async function handleTransaction() {
    if (!isConnected) {
      throw new Error("Wallet not connected");
    }

    if (isErc20) {
      // Transfer ERC20 token
      console.log(address, tokenAddress, recipientAddress, amountInWei);
    } else {
      // Transfer ETH
    }
  }

  return {
    handleTransaction,
  };
}
