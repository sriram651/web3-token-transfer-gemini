import { getCurrentDateTime } from "@/utils/date";
import { useState } from "react";

export interface GeminiResponse {
  text: string;
  timestamp: string;
}

export function useGeminiHandler() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<GeminiResponse[]>([]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: inputValue }),
      });
      const { data, success } = await res.json();

      if (success) {
        const newResponse = {
          text: `Please wait while we initiate the ${
            data.isERC20 ? "ERC20" : "ETH"
          } transfer to ${data.recipientAddress}`,
          timestamp: getCurrentDateTime(),
        };
        setResponses((prev) => [...prev, newResponse]);
      } else {
        setResponses((prev) => [
          ...prev,
          {
            text: "Invalid input or error processing your request.",
            timestamp: getCurrentDateTime(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponses((prev) => [
        ...prev,
        {
          text: "An error occurred while processing your request.",
          timestamp: getCurrentDateTime(),
        },
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
