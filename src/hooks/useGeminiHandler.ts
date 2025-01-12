import { getCurrentDateTime } from "@/utils/date";
import { useState } from "react";
import useTransactionHandler from "./useTransactionHandler";

export interface GeminiResponse {
  text: string;
  timestamp: string;
}

export function useGeminiHandler() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<GeminiResponse[]>([]);
  const { error, handleTransaction } = useTransactionHandler();

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    try {
      // Make a POST request to the /api/gemini endpoint.
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: inputValue }),
      });

      const { data, success } = await res.json();

      // If the request was successful, initiate the transaction.
      if (success) {
        // Display a message to the user indicating that the transaction is being initiated.
        const newResponse = {
          text: `Please wait while we initiate the ${
            data.isERC20 ? "ERC20" : "ETH"
          } transfer to ${data.recipientAddress}`,
          timestamp: getCurrentDateTime(),
        };
        setResponses(() => [newResponse]);

        // Call transaction handler
        const transaction = await handleTransaction({
          tokenAddress: data.tokenAddress,
          recipientAddress: data.recipientAddress,
          amountInWei: data.amountInWei,
          isErc20: data.isERC20,
        });

        if (transaction?.success) {
          setResponses((prev) => [
            ...prev,
            {
              text: `Transaction initiated successfully. Tx Hash: ${transaction.txHash}`,
              timestamp: getCurrentDateTime(),
            },
          ]);

          return;
        }

        setResponses((prev) => [
          ...prev,
          {
            text: error || "Transaction failed. Please try again.",
            timestamp: getCurrentDateTime(),
          },
        ]);

        return;
      } else {
        setResponses(() => [
          {
            text: "Invalid input or error processing your request.",
            timestamp: getCurrentDateTime(),
          },
          // ...prev,
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponses(() => [
        {
          text: "An error occurred while processing your request.",
          timestamp: getCurrentDateTime(),
        },
        // ...prev,
      ]);
    } finally {
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
