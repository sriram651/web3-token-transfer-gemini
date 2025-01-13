import { getCurrentDateTime } from "@/utils/date";
import { useState } from "react";
import useTransactionHandler from "./useTransactionHandler";
import { useAccount } from "wagmi";

export interface GeminiResponse {
  text: string; // The response message to display
  timestamp: string;
  url?: string; // Optional URL to view the transaction in a block explorer.
}

/**
 * Custom hook to handle interactions with Gemini AI and transaction initiation.
 * @returns Functions and states for managing Gemini inputs and transactions.
 */
export function useGeminiHandler() {
  // States for managing user input, loading state, and responses to be displayed.
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<GeminiResponse[]>([]);

  // Use the connected account address for transaction initiation
  const { address } = useAccount();
  const { handleTransaction } = useTransactionHandler();

  /**
   * Handles changes to the input field.
   * @param value - The updated value from the input field.
   */
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  /**
   * Submits the user input to Gemini AI and processes the response.
   * Initiates a blockchain transaction if the AI response is valid.
   */
  const handleSubmit = async () => {
    if (!inputValue.trim()) return; // Ignore empty inputs

    // Reset the loading state and responses.
    setIsLoading(true);
    setResponses([]);

    try {
      // Send the user input to the Gemini API for processing
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: inputValue }),
      });

      const { data, success } = await res.json();

      // Handle invalid input, errors from Gemini API, invalid responses from Gemini AI.
      if (!success) {
        setResponses(() => [
          {
            text: "Invalid input or error processing your request.",
            timestamp: getCurrentDateTime(),
          },
        ]);
      }

      const { tokenAddress, recipientAddress, amount, isErc20 } = data;

      // Prevent self-transfers.
      if (recipientAddress === address) {
        setResponses(() => [
          {
            text: "Sender & Recipient addresses cannot be the same.",
            timestamp: getCurrentDateTime(),
          },
        ]);
        return;
      }

      // Notify user about transaction initiation
      setResponses(() => [
        {
          text: `Please wait while we initiate the ${
            isErc20 ? "ERC20" : "ETH"
          } transfer to ${recipientAddress}`,
          timestamp: getCurrentDateTime(),
        },
      ]);

      // Initiate the transaction
      const transaction = await handleTransaction({
        tokenAddress,
        recipientAddress,
        amount,
        isErc20,
      });

      const { success: transactionSuccess, txHash } = transaction;

      // Handle transaction success or failure
      if (!transactionSuccess && transaction.errorMessage) {
        setResponses((prev) => [
          ...prev,
          {
            text: `Transaction failed: ${transaction.errorMessage}`,
            timestamp: getCurrentDateTime(),
          },
        ]);

        return;
      }

      // Notify user about transaction completion and provide the Block Explorer link for the transaction.
      setResponses((prev) => [
        ...prev,
        {
          text: `Transaction completed successfully. Click on the link to view on Polygon Amoy Scan explorer → `,
          timestamp: getCurrentDateTime(),
          url: `https://amoy.polygonscan.com/tx/${txHash}`,
        },
      ]);

      return;
    } catch {
      // Handle unexpected errors
      setResponses(() => [
        {
          text: "An error occurred while processing your request.",
          timestamp: getCurrentDateTime(),
        },
      ]);
    } finally {
      // Reset the input field and loading state.
      setIsLoading(false);
      setInputValue("");
    }
  };

  return {
    inputValue,
    isLoading,
    responses,
    handleInputChange,
    handleSubmit,
  };
}
